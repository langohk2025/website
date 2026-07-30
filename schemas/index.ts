import { defineField, defineType } from 'sanity'
import { localeFields } from '../src/lib/sanity.locales'

const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized string',
  type: 'object',
  fields: localeFields.map((locale) =>
    defineField({
      name: locale.field,
      title: locale.title,
      type: 'string',
    })
  ),
})

const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized text',
  type: 'object',
  fields: localeFields.map((locale) =>
    defineField({
      name: locale.field,
      title: locale.title,
      type: 'text',
      rows: 4,
    })
  ),
})

const localizedBlockContent = defineType({
  name: 'localizedBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: localeFields.map((locale) =>
    defineField({
      name: locale.field,
      title: locale.title,
      type: 'array',
      of: [{ type: 'block' }],
    })
  ),
})

export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localizedText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Lango Team',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Competition', value: 'competition' },
          { title: 'Partnership', value: 'partnership' },
          { title: 'Expansion', value: 'expansion' },
          { title: 'Education', value: 'education' },
          { title: 'Event', value: 'event' },
          { title: 'Exhibition', value: 'exhibition' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'externalUrl',
      title: 'External article URL',
      type: 'url',
      description: 'Optional. If set, Read More links out instead of the on-site detail page.',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'author',
      media: 'image',
    },
  },
})

export const schemaTypes = [localizedString, localizedText, localizedBlockContent, news]
