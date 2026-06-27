'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type MessageRow = {
  id: string
  name: string
  email: string
  phone?: string | null
  project_type?: string | null
  details?: string | null
  status?: string | null
}

type AdminLeadMessagesPanelProps = {
  connected: boolean
  saving: boolean
  messages: MessageRow[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

const statusOptions = ['new', 'read', 'replied', 'closed']

export default function AdminLeadMessagesPanel({
  connected,
  saving,
  messages,
  onUpdateStatus,
  onDelete,
}: AdminLeadMessagesPanelProps) {
  const [rows, setRows] = useState<MessageRow[]>(messages)
  const [loading, setLoading] = useState(!messages.length)
  const [error, setError] = useState('')
  const [panelConnected, setPanelConnected] = useState(connected)

  async function loadMessages() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/messages', { cache: 'no-store' })
      const payload = await readJsonResponse<{ rows?: MessageRow[]; error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to load contact messages.')
      setRows(payload.rows ?? [])
      setPanelConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load contact messages.')
      setRows(messages)
      setPanelConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRows(messages)
  }, [messages])

  useEffect(() => {
    void loadMessages()
    // Run once on tab mount so this panel is not dependent on the overview load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-6 rounded-[30px] border border-white/8 bg-[#171719] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Inbox</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
            Recent contact inquiries
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-white/55">
          Use this section to track contact form submissions, update lead status, and remove test messages.
        </p>
        <button
          type="button"
          onClick={loadMessages}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/74 transition hover:border-[#D8FF6A]/30"
        >
          Refresh messages
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-[24px] border border-white/8 bg-white/5 px-5 py-10 text-center text-sm text-white/52">
            Loading contact messages...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-[#E87F24]/30 bg-[#E87F24]/10 px-5 py-6 text-sm leading-6 text-[#FFBC8C]">
            {error}
          </div>
        ) : rows.length ? (
          rows.map((message) => (
            <div
              key={message.id}
              className="rounded-[24px] border border-white/8 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                    <span className="rounded-full border border-white/8 bg-[#D8FF6A]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#111]">
                      {message.status || 'new'}
                    </span>
                  </div>
                  <p className="mt-2 break-all text-sm text-white/55">{message.email}</p>
                  {message.phone ? <p className="mt-1 text-sm text-white/55">{message.phone}</p> : null}
                  {message.project_type ? (
                    <p className="mt-1 text-sm text-white/55">Project: {message.project_type}</p>
                  ) : null}
                  {message.details ? <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">{message.details}</p> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={!panelConnected || saving}
                      onClick={async () => {
                        await onUpdateStatus(message.id, status)
                        await loadMessages()
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold capitalize text-white/74 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={!panelConnected || saving}
                    onClick={async () => {
                      await onDelete(message.id)
                      await loadMessages()
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-3 py-2 text-xs font-semibold text-[#FFBC8C] disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52">
            No contact messages yet. New submissions from the Contact page will appear here automatically.
          </div>
        )}
      </div>
    </div>
  )
}
