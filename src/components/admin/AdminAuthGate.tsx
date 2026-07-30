'use client'

import { useEffect, useState } from 'react'
import { clearAdminToken, getAdminToken, verifyAdminPassword } from '@/lib/admin-api'
import { PressableButton } from '@/components/ui/motion'
import { Label2, P3 } from '@/components/ui/typography'

type AdminAuthGateProps = {
  title: string
  children: React.ReactNode
}

export function AdminAuthGate({ title, children }: AdminAuthGateProps) {
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setToken(getAdminToken())
  }, [])

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const ok = await verifyAdminPassword(password)
      if (!ok) {
        setError('Incorrect password')
        return
      }
      setToken(password)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearAdminToken()
    setToken(null)
    setPassword('')
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center gap-6 px-4 py-16">
        <div className="rounded-[24px] border border-[#ede9fe] bg-bg-100 p-8 shadow-card">
          <Label2 className="text-font-600">{title}</Label2>
          <P3 className="mt-2 text-font-400">Enter the admin password to continue.</P3>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-[14px] border border-[#e2e8f0] px-4 font-inter text-base text-font-600 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-300/30"
              placeholder="Admin password"
              required
            />
            {error && <P3 className="text-red-600">{error}</P3>}
            <PressableButton
              type="submit"
              disabled={loading}
              className="rounded-[14px] bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end px-6 py-3 text-bg-100 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </PressableButton>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-font-200/60 bg-bg-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <P3 className="text-font-400">Signed in to admin</P3>
          <PressableButton onClick={handleLogout} className="rounded-full px-4 py-2 text-sm text-font-500">
            Sign out
          </PressableButton>
        </div>
      </div>
      {children}
    </div>
  )
}
