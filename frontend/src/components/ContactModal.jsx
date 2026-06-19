import React, { useState } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'

export default function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', team_size: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.contact(form)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,5,9,0.92)' }}>
      <div className="relative w-full max-w-lg rounded-xl border p-8" style={{ background: '#0a1220', borderColor: 'rgba(0,212,255,0.2)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {sent ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#00e896' }} />
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: '#00e896' }}>Request Received</h3>
            <p className="text-sm" style={{ color: '#8899bb' }}>Our team will contact you within 24 hours.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 rounded text-sm font-bold transition-all" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl font-bold mb-1" style={{ color: '#00d4ff' }}>Contact Enterprise Sales</h3>
            <p className="text-xs mb-6" style={{ color: '#8899bb' }}>We'll get back to you within 24 hours.</p>

            <form onSubmit={submit} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
                { key: 'email', label: 'Work Email', type: 'email', placeholder: 'jane@company.com' },
                { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs mb-1" style={{ color: '#8899bb', letterSpacing: '1px' }}>{label.toUpperCase()}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded px-3 py-2 text-sm outline-none transition-all"
                    style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#d0daf0' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs mb-1" style={{ color: '#8899bb', letterSpacing: '1px' }}>TEAM SIZE</label>
                <select
                  required
                  value={form.team_size}
                  onChange={e => setForm(p => ({ ...p, team_size: e.target.value }))}
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{ background: '#0a1220', border: '1px solid rgba(0,212,255,0.15)', color: '#d0daf0' }}
                >
                  <option value="">Select team size</option>
                  <option value="1-5">1–5 analysts</option>
                  <option value="6-20">6–20 analysts</option>
                  <option value="21-50">21–50 analysts</option>
                  <option value="50+">50+ analysts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: '#8899bb', letterSpacing: '1px' }}>MESSAGE</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your SOC needs..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#d0daf0' }}
                />
              </div>

              {error && <p className="text-xs" style={{ color: '#ff2d55' }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded font-bold text-sm tracking-widest transition-all"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088ff)', color: '#020509', opacity: loading ? 0.7 : 1 }}
              >
                <Send size={14} />
                {loading ? 'SENDING...' : 'SEND REQUEST'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
