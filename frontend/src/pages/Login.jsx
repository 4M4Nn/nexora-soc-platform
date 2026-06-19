import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', org: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await register({ email: form.email, password: form.password, name: form.name, org: form.org })
      } else {
        await login(form.email, form.password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(0,212,255,0.04)',
    border: '1px solid rgba(0,212,255,0.15)',
    color: '#d0daf0',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '12px',
    width: '100%',
    outline: 'none',
    fontFamily: 'IBM Plex Mono, monospace',
    transition: 'border-color 0.2s',
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid" style={{ background: '#020509' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)' }}>
              <Shield size={20} color="#020509" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-xl" style={{ color: '#00d4ff', letterSpacing: '3px' }}>NEXORA</div>
              <div style={{ color: '#445566', letterSpacing: '4px', fontSize: '8px' }}>SOC PLATFORM</div>
            </div>
          </Link>
          <h1 className="font-display font-bold text-lg mt-2" style={{ color: '#d0daf0' }}>
            {isRegister ? 'Create Account' : 'Analyst Login'}
          </h1>
        </div>

        {/* Demo credentials */}
        {!isRegister && (
          <div className="mb-4 rounded-lg px-4 py-3" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="text-xs mb-1" style={{ color: '#8899bb', letterSpacing: '1px', fontSize: '9px' }}>DEMO CREDENTIALS</p>
            <p className="text-xs" style={{ color: '#00d4ff' }}>demo@nexora.ai / demo1234</p>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, email: 'demo@nexora.ai', password: 'demo1234' }))}
              className="text-xs mt-2 px-3 py-1 rounded transition-all"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', fontSize: '9px', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              Auto-fill
            </button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8899bb', letterSpacing: '1px', fontSize: '9px' }}>FULL NAME</label>
                <input style={inputStyle} type="text" required placeholder="Jane Smith" value={form.name} onChange={set('name')}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8899bb', letterSpacing: '1px', fontSize: '9px' }}>ORGANIZATION</label>
                <input style={inputStyle} type="text" required placeholder="Acme Security" value={form.org} onChange={set('org')}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8899bb', letterSpacing: '1px', fontSize: '9px' }}>EMAIL</label>
            <input style={inputStyle} type="email" required placeholder="analyst@company.com" value={form.email} onChange={set('email')}
              onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8899bb', letterSpacing: '1px', fontSize: '9px' }}>PASSWORD</label>
            <div className="relative">
              <input
                style={{ ...inputStyle, paddingRight: '40px' }}
                type={showPwd ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#445566' }}
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
              <AlertCircle size={12} style={{ color: '#ff2d55', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: '#ff2d55' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold font-display text-sm tracking-widest transition-all mt-2"
            style={{
              background: loading ? 'rgba(0,212,255,0.1)' : 'linear-gradient(135deg, #00d4ff, #0055ff)',
              color: loading ? '#445566' : '#020509',
            }}
          >
            {loading && <Loader size={14} className="animate-spin" />}
            {loading ? 'AUTHENTICATING...' : (isRegister ? 'CREATE ACCOUNT' : 'LOGIN')}
          </button>
        </form>

        <p className="text-center mt-6 text-xs" style={{ color: '#445566' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(v => !v); setError('') }}
            className="transition-colors"
            style={{ color: '#00d4ff' }}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

        <p className="text-center mt-4 text-xs" style={{ color: '#334455', fontSize: '9px' }}>
          NEXORA SOC PLATFORM · CONFIDENTIAL
        </p>
      </div>
    </div>
  )
}
