/**
 * Sync recent public LinkedIn company posts into Sanity news.
 *
 * LinkedIn has no free public company-posts API. This script reads the public
 * company page + post embeds (guest HTML), then creates Sanity documents.
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (default: production)
 *   - SANITY_API_TOKEN (Editor or Admin)
 *
 * Usage:
 *   npm run sanity:sync-linkedin
 *   npm run sanity:sync-linkedin -- --dry-run
 *   LINKEDIN_SYNC_PUBLISH=false npm run sanity:sync-linkedin
 *
 * Env:
 *   LINKEDIN_COMPANY_SLUG   default: lango-language
 *   LINKEDIN_SYNC_PUBLISH   default: true (set false to create drafts)
 *   LINKEDIN_SYNC_MAX       default: 10 (max new posts per run)
 *   CLOUDFLARE_PAGES_DEPLOY_HOOK_URL  optional; POST after creating posts
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')

function loadEnvFile(filename) {
  const filePath = join(root, filename)
  if (!existsSync(filePath)) return

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN
const companySlug = process.env.LINKEDIN_COMPANY_SLUG ?? 'lango-language'
const publish =
  (process.env.LINKEDIN_SYNC_PUBLISH ?? 'true').toLowerCase() !== 'false'
const maxNew = Number(process.env.LINKEDIN_SYNC_MAX ?? 10)

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01',
  token,
  useCdn: false,
})

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const localeFields = ['en', 'zhTW', 'zhCN', 'ms', 'idLang', 'ja', 'my']

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} for ${url}`)
  }
  return response.text()
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u00a0/g, ' ')
}

function ogContent(html, name) {
  const match = html.match(
    new RegExp(`property="og:${name}"\\s+content="([^"]+)"`, 'i')
  ) || html.match(new RegExp(`og:${name}"\\s+content="([^"]+)"`, 'i'))
  return match ? decodeHtml(match[1]) : null
}

/** LinkedIn activity IDs encode Unix ms as (id >> 22). */
function activityToIso(activityId) {
  const ms = Number(BigInt(activityId) >> 22n)
  return new Date(ms).toISOString()
}

function cleanPostText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function titleFromPost({ description, ogTitle, activityId }) {
  const lines = cleanPostText(description || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^#[\w]+(?:\s+#[\w]+)*$/.test(line))

  let candidate = lines[0] || ''
  candidate = candidate.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s📢🎉🚀✨🥳]+/gu, '').trim()

  if (!candidate || candidate.length < 8) {
    const fromOg = (ogTitle || '').split('|')[0].trim()
    candidate = fromOg.replace(/^#/, '').replace(/#/g, ' ').trim()
  }

  if (!candidate) {
    candidate = `LinkedIn update ${activityId}`
  }

  if (candidate.length > 110) {
    candidate = `${candidate.slice(0, 107).trim()}...`
  }

  return candidate
}

function excerptFromPost(description) {
  const text = cleanPostText(description || '')
    .replace(/#[\w]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return 'Latest update from Lango on LinkedIn.'
  if (text.length <= 220) return text
  return `${text.slice(0, 217).trim()}...`
}

function detectCategory(text) {
  const lower = text.toLowerCase()
  if (/(partner|partnership|distributor|collaboration|協作|合作)/.test(lower)) {
    return 'partnership'
  }
  if (/(competition|cup|contest|比賽)/.test(lower)) return 'competition'
  if (/(expo|exhibition|booth|fair|展)/.test(lower)) return 'exhibition'
  if (/(expand|expansion|middle east|thailand|singapore|dubai|市場)/.test(lower)) {
    return 'expansion'
  }
  if (/(school|education|student|learning|教育|學校)/.test(lower)) return 'education'
  return 'event'
}

function localizedFromEnglish(text) {
  const value = {}
  for (const field of localeFields) {
    value[field] = text
  }
  return value
}

function extractPostUrls(companyHtml) {
  const pattern = new RegExp(
    `https://www\\.linkedin\\.com/posts/${companySlug}_[^"'\\\\\\s>]+`,
    'g'
  )
  const urls = [...companyHtml.matchAll(pattern)].map((m) => m[0])
  return [...new Set(urls)]
}

function parseActivityId(postUrl) {
  const match = postUrl.match(/activity-(\d{10,})/)
  return match?.[1] ?? null
}

async function listExistingExternalUrls() {
  const urls = await client.fetch(
    `*[_type == "news" && defined(externalUrl)].externalUrl`
  )
  return new Set(urls.filter(Boolean))
}

async function listExistingLinkedInIds() {
  const ids = await client.fetch(
    `*[_type == "news" && _id match "linkedin-*"]._id`
  )
  return new Set(ids)
}

async function downloadImage(imageUrl) {
  const response = await fetch(imageUrl, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  })
  if (!response.ok) {
    throw new Error(`Image download failed ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : 'jpg'
  return { buffer, ext, contentType }
}

async function uploadCoverImage(activityId, imageUrl) {
  if (!imageUrl) return undefined

  const { buffer, ext } = await downloadImage(imageUrl)
  const filename = `linkedin-${activityId}.${ext}`

  if (dryRun) {
    const previewDir = join(tmpdir(), 'lango-linkedin-sync')
    mkdirSync(previewDir, { recursive: true })
    writeFileSync(join(previewDir, filename), buffer)
    console.log(`  (dry-run) saved image preview ${filename}`)
    return undefined
  }

  const asset = await client.assets.upload('image', buffer, { filename })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function fetchPostDetails(postUrl) {
  const activityId = parseActivityId(postUrl)
  if (!activityId) return null

  const embedHtml = await fetchText(
    `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`
  )

  const description = ogContent(embedHtml, 'description') || ''
  const ogTitle = ogContent(embedHtml, 'title') || ''
  const image =
    ogContent(embedHtml, 'image') ||
    [...embedHtml.matchAll(/https:\/\/media\.licdn\.com\/dms\/image\/[^"'&\s]+/g)]
      .map((m) => decodeHtml(m[0]))
      .find((url) => /feedshare/i.test(url)) ||
    null

  return {
    activityId,
    postUrl: postUrl.split('?')[0],
    publishedAt: activityToIso(activityId),
    description,
    ogTitle,
    imageUrl: image,
    title: titleFromPost({ description, ogTitle, activityId }),
    excerpt: excerptFromPost(description),
    category: detectCategory(`${ogTitle}\n${description}`),
  }
}

async function sync() {
  console.log(
    `Syncing LinkedIn company/${companySlug} → Sanity (${dataset})${dryRun ? ' [dry-run]' : ''}`
  )

  const companyHtml = await fetchText(
    `https://www.linkedin.com/company/${companySlug}/`
  )
  const postUrls = extractPostUrls(companyHtml)
  console.log(`Found ${postUrls.length} public post URL(s) on company page`)

  if (!postUrls.length) {
    console.warn('No posts found — LinkedIn HTML may have changed.')
    process.exit(0)
  }

  const existingUrls = await listExistingExternalUrls()
  const existingIds = await listExistingLinkedInIds()

  const candidates = []
  for (const url of postUrls) {
    const activityId = parseActivityId(url)
    if (!activityId) continue
    const docId = `linkedin-${activityId}`
    if (existingIds.has(docId) || existingUrls.has(url.split('?')[0])) {
      continue
    }
    candidates.push(url)
  }

  console.log(`${candidates.length} new post(s) to import (cap ${maxNew})`)

  let created = 0
  for (const url of candidates.slice(0, maxNew)) {
    const post = await fetchPostDetails(url)
    if (!post) continue

    const docId = `linkedin-${post.activityId}`
    console.log(`→ ${post.title}`)
    console.log(`  ${post.publishedAt} · ${post.category}`)
    console.log(`  ${post.postUrl}`)

    const image = await uploadCoverImage(post.activityId, post.imageUrl)

    const document = {
      _id: docId,
      _type: 'news',
      title: localizedFromEnglish(post.title),
      slug: { _type: 'slug', current: `linkedin-${post.activityId}` },
      excerpt: localizedFromEnglish(post.excerpt),
      publishedAt: post.publishedAt,
      author: 'Lango',
      category: post.category,
      published: publish,
      externalUrl: post.postUrl,
      ...(image ? { image } : {}),
    }

    if (dryRun) {
      console.log('  (dry-run) would create', JSON.stringify(document, null, 2))
    } else {
      await client.createOrReplace(document)
      console.log(`  ✓ ${publish ? 'published' : 'draft'} ${docId}`)
    }
    created += 1
  }

  console.log(`Done. ${created} post(s) ${dryRun ? 'previewed' : 'synced'}.`)

  if (!dryRun && created > 0) {
    const deployHook = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL
    if (deployHook) {
      const response = await fetch(deployHook, { method: 'POST' })
      if (!response.ok) {
        throw new Error(`Deploy hook failed: ${response.status}`)
      }
      console.log('Triggered Cloudflare Pages deploy hook')
    } else {
      console.warn(
        'CLOUDFLARE_PAGES_DEPLOY_HOOK_URL not set — site will update on next manual deploy / Sanity webhook.'
      )
    }
  }
}

sync().catch((error) => {
  console.error('LinkedIn sync failed:', error)
  process.exit(1)
})
