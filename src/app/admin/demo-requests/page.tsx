'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import {
  DemoRequest,
  fetchDemoRequests,
  updateDemoRequest,
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

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)

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
      setLoading(false)
    }
  }, [inquiryFilter, selectedId, statusFilter])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const selected = items.find((item) => item.id === selectedId) ?? null

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
                  Contact form submissions are saved here and emailed to info@lango.ai.
                </P3>
              </div>
              <PressableButton
                onClick={loadItems}
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

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
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
                      label="Submitted"
                      value={new Date(selected.created_at).toLocaleString()}
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <P4 className="text-font-400">{label}</P4>
      <P3 className="text-font-600">{value}</P3>
    </div>
  )
}
