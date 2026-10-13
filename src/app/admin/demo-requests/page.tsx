'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import {
  DemoRequest,
  draftDemoRequestReply,
  fetchDemoRequests,
  isStaleLeadCheck,
  isStaleReplyDraft,
  updateDemoRequest,
  verifyDemoRequest,
} from '@/lib/admin-api'
import { PageContainer, Section } from '@/components/ui/section'
import { PressableButton } from '@/components/ui/motion'
import { H2, P3, P4 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const statusOptions: DemoRequest['status'][] = ['new', 'contacted', 'closed']

export default function DemoRequestsAdminPage() {
  const [items, setItems] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [inquiryFilter, setInquiryFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [drafting, setDrafting] = useState(false)

  const loadItems = useCallback(async (quiet = false) => {
    if (!quiet) {
      setLoading(true)
      setError(null)
    }

    try {
      const data = await fetchDemoRequests({
        status: statusFilter === 'all' ? undefined : statusFilter,
        inquiryType: inquiryFilter === 'all' ? undefined : inquiryFilter,
      })
      setItems(data)
      if (selectedId && !data.some((item) => item.id === selectedId)) {
        setSelectedId(null)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load requests')
    } finally {
      if (!quiet) setLoading(false)
    }
  }, [inquiryFilter, selectedId, statusFilter])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const selected = items.find((item) => item.id === selectedId) ?? null
  const selectedCheckState = selected?.verification_status
  const selectedCheckStale = selected
    ? isStaleLeadCheck(selected.verification_status, selected.updated_at)
    : false
  const selectedDraftState = selected?.reply_draft_status
  const selectedDraftStale = selected
    ? isStaleReplyDraft(selected.reply_draft_status, selected.updated_at)
    : false

  useEffect(() => {
    const checkBusy =
      selectedCheckState === 'pending' ||
      (selectedCheckState === 'checking' && !selectedCheckStale)
    const draftBusy = selectedDraftState === 'drafting' && !selectedDraftStale
    if (!checkBusy && !draftBusy) return
    const timer = window.setInterval(() => {
      void loadItems(true)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [loadItems, selectedCheckStale, selectedCheckState, selectedDraftStale, selectedDraftState])

  useEffect(() => {
    setNotesDraft(selected?.notes ?? '')
  }, [selected])

  async function handleStatusChange(id: number, status: DemoRequest['status']) {
    const updated = await updateDemoRequest({ id, status })
    setItems((current) => current.map((item) => (item.id === id ? updated : item)))
  }

  async function handleSaveNotes() {
    if (!selected) return
    const updated = await updateDemoRequest({
      id: selected.id,
      notes: notesDraft,
    })
    setItems((current) => current.map((item) => (item.id === selected.id ? updated : item)))
  }

  async function handleVerify() {
    if (!selected) return
    setVerifying(true)
    try {
      const updated = await verifyDemoRequest(selected.id)
      setItems((current) => current.map((item) => (item.id === selected.id ? updated : item)))
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Web check failed')
    } finally {
      setVerifying(false)
    }
  }

  async function handleDraft() {
    if (!selected) return
    setDrafting(true)
    try {
      const updated = await draftDemoRequestReply(selected.id)
      setItems((current) => current.map((item) => (item.id === selected.id ? updated : item)))
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : 'Draft generation failed')
    } finally {
      setDrafting(false)
    }
  }

  return (
    <AdminAuthGate title="Demo Requests Admin">
      <Section className="py-10 lg:py-16">
        <PageContainer>
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link
                  href="/admin"
                  className="pressable mb-3 inline-flex items-center gap-2 font-inter text-sm text-font-400 hover:text-font-500"
                >
                  <ArrowLeft className="size-4" />
                  Back to admin
                </Link>
                <H2 as="h1">Demo Requests</H2>
                <P3 className="mt-2 text-font-400">
                  New leads are automatically screened on the public web and get draft email /
                  WhatsApp replies. Review each lead, then copy or open a draft to follow up.
                </P3>
              </div>
              <PressableButton
                onClick={() => void loadItems()}
                className="rounded-full border border-font-200 px-4 py-2 text-sm text-font-500"
              >
                Refresh
              </PressableButton>
            </div>

            <div className="flex flex-wrap gap-3">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
              <FilterSelect
                label="Inquiry"
                value={inquiryFilter}
                onChange={setInquiryFilter}
                options={[
                  { value: 'all', label: 'All inquiries' },
                  { value: 'demo', label: 'School demo' },
                  { value: 'partnership', label: 'Partnership' },
                ]}
              />
            </div>

            {error && <P3 className="text-red-600">{error}</P3>}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="overflow-hidden rounded-[24px] border border-[#ede9fe] bg-bg-100">
                {loading ? (
                  <P3 className="p-8 text-font-400">Loading requests…</P3>
                ) : items.length === 0 ? (
                  <P3 className="p-8 text-font-400">No demo requests yet.</P3>
                ) : (
                  <div className="divide-y divide-font-200/60">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={cn(
                          'w-full px-6 py-5 text-left transition-colors hover:bg-bg-500/40',
                          selectedId === item.id && 'bg-bg-500/60'
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <P3 className="font-medium text-font-600">
                              {item.first_name} {item.last_name}
                            </P3>
                            <P4 className="mt-1 text-font-400">{item.organization}</P4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge>{item.inquiry_type}</Badge>
                            <Badge tone={item.status}>{item.status}</Badge>
                            <VerificationBadge item={item} />
                          </div>
                        </div>
                        <P4 className="mt-2 text-font-400">
                          {item.email} · {new Date(item.created_at).toLocaleString()}
                        </P4>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-[#ede9fe] bg-bg-100 p-6">
                {selected ? (
                  <div className="flex flex-col gap-5">
                    <div>
                      <H2 className="text-2xl text-font-600">
                        {selected.first_name} {selected.last_name}
                      </H2>
                      <P3 className="mt-2 text-font-400">{selected.organization}</P3>
                    </div>

                    <DetailRow label="Email" value={selected.email} />
                    <DetailRow label="Phone" value={selected.phone || '—'} />
                    <DetailRow label="Role" value={selected.role} />
                    <DetailRow label="Inquiry" value={selected.inquiry_type} />
                    <DetailRow
                      label="Details"
                      value={selected.details || '—'}
                      preserveWhitespace
                    />
                    <DetailRow
                      label="Submitted"
                      value={new Date(selected.created_at).toLocaleString()}
                    />

                    <LeadCheckCard
                      item={selected}
                      verifying={verifying}
                      onVerify={() => void handleVerify()}
                    />

                    <ReplyDraftsCard
                      item={selected}
                      drafting={drafting}
                      onDraft={() => void handleDraft()}
                    />

                    <div>
                      <P4 className="mb-2 text-font-400">Status</P4>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((status) => (
                          <PressableButton
                            key={status}
                            onClick={() => handleStatusChange(selected.id, status)}
                            className={cn(
                              'rounded-full px-4 py-2 text-sm capitalize',
                              selected.status === status
                                ? 'bg-brand-500 text-bg-100'
                                : 'border border-font-200 text-font-500'
                            )}
                          >
                            {status}
                          </PressableButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <P4 className="mb-2 text-font-400">Notes</P4>
                      <textarea
                        value={notesDraft}
                        onChange={(event) => setNotesDraft(event.target.value)}
                        rows={5}
                        className="w-full rounded-[14px] border border-[#e2e8f0] px-4 py-3 font-inter text-sm text-font-600 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-300/30"
                      />
                      <PressableButton
                        onClick={handleSaveNotes}
                        className="mt-3 rounded-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end px-5 py-2 text-sm text-bg-100"
                      >
                        Save notes
                      </PressableButton>
                    </div>
                  </div>
                ) : (
                  <P3 className="text-font-400">Select a request to view details.</P3>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </AdminAuthGate>
  )
}

function verificationLabel(item: DemoRequest) {
  if (!item.verification_status || item.verification_status === 'skipped') return 'Not checked'
  if (
    (item.verification_status === 'checking' || item.verification_status === 'pending') &&
    isStaleLeadCheck(item.verification_status, item.updated_at)
  ) {
    return 'Check timed out'
  }
  if (item.verification_status === 'checking' || item.verification_status === 'pending') {
    return 'Checking web'
  }
  if (item.verification_status === 'error') return 'Check error'
  if (item.verification_risk === 'likely_real') return 'Likely real'
  if (item.verification_risk === 'suspicious') return 'Suspicious'
  if (item.verification_risk === 'uncertain') return 'Uncertain'
  return 'Not checked'
}

function VerificationBadge({ item }: { item: DemoRequest }) {
  const label = verificationLabel(item)
  const risk = item.verification_risk
  const status = item.verification_status
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs',
        (!status || status === 'skipped') && 'bg-bg-500 text-font-500',
        (status === 'pending' || status === 'checking') &&
          !isStaleLeadCheck(status, item.updated_at) &&
          'bg-bg-500 text-font-500',
        (status === 'pending' || status === 'checking') &&
          isStaleLeadCheck(status, item.updated_at) &&
          'bg-[#fff4db] text-[#9a6700]',
        status === 'error' && 'bg-[#fdecec] text-red-600',
        status === 'ready' && risk === 'likely_real' && 'bg-[#e8f5ee] text-[#1f7a4d]',
        status === 'ready' && risk === 'uncertain' && 'bg-[#fff4db] text-[#9a6700]',
        status === 'ready' && risk === 'suspicious' && 'bg-[#fdecec] text-red-600'
      )}
    >
      {label}
    </span>
  )
}

function parseFindings(raw: string | null | undefined) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

function parseSources(raw: string | null | undefined) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is { title: string; url: string } => {
      return Boolean(
        item &&
          typeof item === 'object' &&
          typeof (item as { title?: unknown }).title === 'string' &&
          typeof (item as { url?: unknown }).url === 'string'
      )
    })
  } catch {
    return []
  }
}

function LeadCheckCard({
  item,
  verifying,
  onVerify,
}: {
  item: DemoRequest
  verifying: boolean
  onVerify: () => void
}) {
  const findings = parseFindings(item.verification_findings)
  const sources = parseSources(item.verification_sources)
  const stale = isStaleLeadCheck(item.verification_status, item.updated_at)
  const inProgress =
    item.verification_status === 'pending' ||
    (item.verification_status === 'checking' && !stale)
  const busy = verifying || inProgress

  return (
    <div className="rounded-[16px] border border-[#ede9fe] bg-bg-500/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <P4 className="text-font-400">Web check</P4>
          <div className="mt-2">
            <VerificationBadge item={item} />
          </div>
        </div>
        <PressableButton
          onClick={onVerify}
          disabled={busy}
          className="rounded-full border border-font-200 px-4 py-2 text-sm text-font-500 disabled:opacity-60"
        >
          {verifying
            ? 'Checking…'
            : stale
              ? 'Retry check'
              : item.verification_status === 'ready'
                ? 'Recheck'
                : 'Check on web'}
        </PressableButton>
      </div>
      {stale && (
        <P4 className="mt-3 text-[#9a6700]">
          Previous check did not finish. Click retry to run again.
        </P4>
      )}
      <P3 className="mt-3 whitespace-pre-wrap text-font-600">
        {item.verification_summary ||
          (item.verification_status === 'skipped'
            ? 'No web check has run yet. Click "Check on web" to screen this person and organisation using OpenRouter.'
            : 'A public-web screen will look up this person and organisation. This is a heuristic, not a guarantee.')}
      </P3>
      {findings.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 font-inter text-sm text-font-500">
          {findings.map((finding) => (
            <li key={finding}>{finding}</li>
          ))}
        </ul>
      )}
      {sources.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="truncate font-inter text-sm text-brand-500 hover:underline"
            >
              {source.title}
            </a>
          ))}
        </div>
      )}
      {item.verification_checked_at && (
        <P4 className="mt-3 text-font-400">
          Checked {new Date(item.verification_checked_at).toLocaleString()}
        </P4>
      )}
    </div>
  )
}

function whatsappUrl(phone: string | null, message: string) {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

function mailtoUrl(email: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}

function ReplyDraftsCard({
  item,
  drafting,
  onDraft,
}: {
  item: DemoRequest
  drafting: boolean
  onDraft: () => void
}) {
  const stale = isStaleReplyDraft(item.reply_draft_status, item.updated_at)
  const inProgress = item.reply_draft_status === 'drafting' && !stale
  const busy = drafting || inProgress
  const hasDraft =
    item.reply_draft_status === 'ready' &&
    Boolean(item.reply_email_subject && item.reply_email_body && item.reply_whatsapp_body)

  return (
    <div className="rounded-[16px] border border-[#ede9fe] bg-bg-500/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <P4 className="text-font-400">Reply drafts</P4>
          <P4 className="mt-1 text-font-500">
            {inProgress
              ? 'Generating email and WhatsApp drafts…'
              : hasDraft
                ? 'Ready to copy or open'
                : 'No drafts yet'}
          </P4>
        </div>
        <PressableButton
          onClick={onDraft}
          disabled={busy}
          className="rounded-full border border-font-200 px-4 py-2 text-sm text-font-500 disabled:opacity-60"
        >
          {drafting ? 'Drafting…' : hasDraft ? 'Regenerate' : 'Generate drafts'}
        </PressableButton>
      </div>

      {stale && (
        <P4 className="mt-3 text-[#9a6700]">
          Previous draft did not finish. Click regenerate to try again.
        </P4>
      )}

      {!item.reply_draft_status && (
        <P3 className="mt-3 text-[#9a6700]">
          Reply drafts are not available yet. Run database migration 0004 and redeploy.
        </P3>
      )}

      {item.reply_draft_status === 'skipped' && (
        <P3 className="mt-3 text-font-600">
          Drafts are not configured. Add OPENROUTER_API_KEY in Cloudflare Pages.
        </P3>
      )}

      {item.reply_draft_status === 'error' && !hasDraft && (
        <P3 className="mt-3 text-red-600">
          {item.reply_email_body || 'Draft generation failed.'}
        </P3>
      )}

      {hasDraft && (
        <div className="mt-4 flex flex-col gap-5">
          <DraftBlock
            label="Email"
            actions={
              <>
                <DraftAction
                  label="Copy"
                  onClick={() => void copyText(item.reply_email_body ?? '')}
                />
                <DraftAction
                  label="Open in mail"
                  href={mailtoUrl(
                    item.email,
                    item.reply_email_subject ?? '',
                    item.reply_email_body ?? ''
                  )}
                />
              </>
            }
          >
            <P4 className="font-medium text-font-600">{item.reply_email_subject}</P4>
            <P3 className="mt-2 whitespace-pre-wrap text-font-600">{item.reply_email_body}</P3>
          </DraftBlock>

          <DraftBlock
            label="WhatsApp"
            actions={
              <>
                <DraftAction
                  label="Copy"
                  onClick={() => void copyText(item.reply_whatsapp_body ?? '')}
                />
                {whatsappUrl(item.phone, item.reply_whatsapp_body ?? '') ? (
                  <DraftAction
                    label="Open WhatsApp"
                    href={whatsappUrl(item.phone, item.reply_whatsapp_body ?? '')!}
                  />
                ) : (
                  <P4 className="text-font-400">No phone on file</P4>
                )}
              </>
            }
          >
            <P3 className="whitespace-pre-wrap text-font-600">{item.reply_whatsapp_body}</P3>
          </DraftBlock>
        </div>
      )}

      {item.reply_drafted_at && (
        <P4 className="mt-3 text-font-400">
          Drafted {new Date(item.reply_drafted_at).toLocaleString()}
        </P4>
      )}
    </div>
  )
}

function DraftBlock({
  label,
  actions,
  children,
}: {
  label: string
  actions: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[12px] border border-font-200/60 bg-bg-100 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <P4 className="font-medium text-font-500">{label}</P4>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      {children}
    </div>
  )
}

function DraftAction({
  label,
  href,
  onClick,
}: {
  label: string
  href?: string
  onClick?: () => void
}) {
  const className =
    'rounded-full border border-font-200 px-3 py-1 font-inter text-xs text-font-500 hover:bg-bg-500/60'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex items-center gap-2 font-inter text-sm text-font-500">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-full border border-font-200 bg-bg-100 px-4 py-2 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone?: DemoRequest['status']
}) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs capitalize',
        tone === 'new' && 'bg-[#ede9fe] text-brand-500',
        tone === 'contacted' && 'bg-[#fff4db] text-[#9a6700]',
        tone === 'closed' && 'bg-[#e8f5ee] text-[#1f7a4d]',
        !tone && 'bg-bg-500 text-font-500'
      )}
    >
      {children}
    </span>
  )
}

function DetailRow({
  label,
  value,
  preserveWhitespace,
}: {
  label: string
  value: string
  preserveWhitespace?: boolean
}) {
  return (
    <div>
      <P4 className="text-font-400">{label}</P4>
      <P3 className={cn('text-font-600', preserveWhitespace && 'whitespace-pre-wrap')}>{value}</P3>
    </div>
  )
}
