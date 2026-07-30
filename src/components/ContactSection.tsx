'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageContainer, Section } from '@/components/ui/section'
import { PressableButton, Reveal } from '@/components/ui/motion'
import { Label1, Label2, P3, SectionHeading } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  organization: string
}

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  organization: '',
}

export default function ContactSection() {
  const { t } = useLanguage()
  const [inquiryType, setInquiryType] = useState<'demo' | 'partnership'>('demo')
  const [form, setForm] = useState<FormState>(initialFormState)
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const contactItems = [
    { icon: Mail, label: 'info@lango.ai', href: 'mailto:info@lango.ai' },
    { icon: Phone, label: '+852 9354 1948', href: 'https://wa.me/85293541948' },
    { icon: MapPin, label: t('home.contact.location') },
  ]

  const inquiryOptions = [
    { id: 'demo' as const, labelKey: 'home.contact.inquiry_demo' },
    { id: 'partnership' as const, labelKey: 'home.contact.inquiry_partnership' },
  ]

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setStatus('idle')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          inquiryType,
          website,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? t('home.contact.error'))
      }

      setStatus('success')
      setForm(initialFormState)
      setWebsite('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t('home.contact.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="contact" className="bg-bg-500 py-12 lg:py-24">
      <PageContainer>
        <div className="flex flex-col items-center gap-8 lg:gap-16">
          <Reveal>
            <SectionHeading
              title={t('home.contact.title')}
              subtitle={<span className="hidden lg:inline">{t('home.contact.subtitle')}</span>}
            />
          </Reveal>

          <Reveal delay={0.06} className="w-full">
          <div
            className={cn(
              'w-full overflow-hidden rounded-[20px] border border-[#ede9fe] lg:rounded-[31px]',
              'shadow-[0px_26px_32px_-6px_rgba(0,0,0,0.1),0px_10px_13px_-8px_rgba(0,0,0,0.1)]'
            )}
            style={{
              backgroundImage:
                'linear-gradient(149deg, rgb(249,247,255) 0%, rgb(255,255,255) 100%)',
            }}
          >
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col justify-between bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end p-6 lg:max-w-[443px] lg:p-[41px]">
                <div>
                  <Label1 className="mb-3 text-[21px] text-bg-100 lg:mb-5 lg:text-[28px]">
                    {t('home.contact.info_title')}
                  </Label1>
                  <P3 className="text-xs text-[#ddd6ff] lg:text-base">{t('home.contact.info_desc')}</P3>
                </div>

                <div className="mt-6 flex flex-row flex-wrap gap-4 lg:mt-10 lg:flex-col lg:gap-5">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-white/15 lg:size-12 lg:rounded-[18px]">
                        <item.icon className="size-4 text-bg-100 lg:size-5" />
                      </div>
                      {item.href ? (
                        <a href={item.href} className="truncate font-inter text-xs text-[#ddd6ff] hover:text-white lg:text-base">
                          {item.label}
                        </a>
                      ) : (
                        <span className="font-inter text-xs text-[#ddd6ff] lg:text-base">{item.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form
                className="flex flex-1 flex-col gap-4 p-6 lg:gap-5 lg:p-[41px]"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label={t('home.contact.first_name')}
                    required
                    value={form.firstName}
                    onChange={(value) => updateField('firstName', value)}
                  />
                  <FormField
                    label={t('home.contact.last_name')}
                    required
                    value={form.lastName}
                    onChange={(value) => updateField('lastName', value)}
                  />
                </div>
                <FormField
                  label={t('home.contact.email')}
                  type="email"
                  required
                  value={form.email}
                  onChange={(value) => updateField('email', value)}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label={t('home.contact.phone')}
                    type="tel"
                    value={form.phone}
                    onChange={(value) => updateField('phone', value)}
                  />
                  <FormField
                    label={t('home.contact.role')}
                    required
                    value={form.role}
                    onChange={(value) => updateField('role', value)}
                  />
                </div>
                <FormField
                  label={t('home.contact.organization')}
                  required
                  value={form.organization}
                  onChange={(value) => updateField('organization', value)}
                />

                <div className="flex flex-wrap gap-8 pt-2">
                  {inquiryOptions.map((option) => (
                    <label key={option.id} className="flex cursor-pointer items-center gap-4">
                      <input
                        type="radio"
                        name="inquiry"
                        checked={inquiryType === option.id}
                        onChange={() => setInquiryType(option.id)}
                        className="size-[17px] accent-brand-500"
                      />
                      <span className="font-inter text-base text-font-600">{t(option.labelKey)}</span>
                    </label>
                  ))}
                </div>

                {status === 'success' && (
                  <P3 className="rounded-[14px] bg-[#e8f5ee] px-4 py-3 text-[#1f7a4d]">
                    {t('home.contact.success')}
                  </P3>
                )}

                {status === 'error' && errorMessage && (
                  <P3 className="rounded-[14px] bg-[#fdecec] px-4 py-3 text-red-600">
                    {errorMessage}
                  </P3>
                )}

                <PressableButton
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    'mt-4 flex w-full items-center justify-center gap-3 rounded-[18px]',
                    'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end py-5',
                    'shadow-[0px_13px_10px_rgba(0,0,0,0.1),0px_5px_4px_rgba(0,0,0,0.1)]',
                    submitting && 'opacity-70'
                  )}
                >
                  <Send className="size-5 text-bg-100" />
                  <Label2 className="text-bg-100">
                    {submitting ? t('home.contact.submitting') : t('home.contact.submit')}
                  </Label2>
                </PressableButton>

                <P3 className="text-center text-[#90a1b9]">{t('home.contact.privacy_note')}</P3>
              </form>
            </div>
          </div>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  )
}

function FormField({
  label,
  type = 'text',
  required,
  value,
  onChange,
}: {
  label: string
  type?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-inter text-xs text-font-600 lg:text-base">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-10 rounded-[11px] border border-[#e2e8f0] bg-font-100 px-3 lg:h-[59px] lg:rounded-[18px] lg:bg-bg-100 lg:px-4',
          'font-inter text-sm text-font-600 outline-none lg:text-base',
          'transition-[border-color,box-shadow] duration-200',
          'focus:border-brand-400 focus:ring-2 focus:ring-brand-300/30'
        )}
      />
    </div>
  )
}
