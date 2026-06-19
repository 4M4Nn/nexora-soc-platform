import React, { useRef, useEffect, useState } from 'react'
import { Send, Trash2, Plus, Loader, AlertCircle, Terminal } from 'lucide-react'
import OutputRenderer from './OutputRenderer'

const MODE_PLACEHOLDERS = {
  soc: 'Paste alert data, log entries, or IOC details for triage...\n\nExample: Suspicious outbound connection from 192.168.1.45 to 45.33.32.156 port 4444 via powershell.exe every 60 seconds',
  ir: 'Describe the active incident for an IR playbook...\n\nExample: Active ransomware — 40 endpoints encrypted, .locked extension, domain admin credentials compromised',
  risk: 'Paste CVE, vulnerability finding, or scan output for CVSS scoring...\n\nExample: Apache Log4j 2.14.1 — CVE-2021-44228 detected in production app server',
  audit: 'Describe the system or environment to audit...\n\nExample: AWS production environment — assess IAM policies, S3 bucket security, CloudTrail logging, security group rules',
}

const MODE_LABELS = { soc: 'SOC TRIAGE', ir: 'INCIDENT RESPONSE', risk: 'RISK SCORING', audit: 'AUDIT REPORT' }

function UserMessage({ content }) {
  const lines = content.split('\n')
  const modeLine = lines[0].startsWith('[MODE:') ? lines[0] : null
  const body = modeLine ? lines.slice(2).join('\n') : content

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-2xl rounded-lg px-4 py-3" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#d0daf0' }}>{body}</p>
      </div>
    </div>
  )
}

function AssistantMessage({ content, verdict }) {
  const verdictColors = { ESCALATE: '#ff2d55', MONITOR: '#ffb800', CLOSE: '#00e896' }
  const borderColor = verdict ? verdictColors[verdict] : 'rgba(0,212,255,0.15)'

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)' }}>
          <Terminal size={10} color="#020509" />
        </div>
        <span className="text-xs font-bold font-display tracking-widest" style={{ color: '#00d4ff', fontSize: '9px' }}>NOVA AI · NEXORA SOC</span>
        {verdict && (
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${verdictColors[verdict]}18`, color: verdictColors[verdict], border: `1px solid ${verdictColors[verdict]}44`, fontSize: '9px' }}>
            {verdict}
          </span>
        )}
      </div>
      <div className="rounded-lg p-5" style={{ background: '#070e1a', border: `1px solid ${borderColor}`, boxShadow: verdict ? `0 0 20px ${borderColor}0a` : 'none' }}>
        <OutputRenderer content={content} />
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="mb-4 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)' }}>
          <Terminal size={10} color="#020509" />
        </div>
        <span className="text-xs font-bold font-display tracking-widest" style={{ color: '#00d4ff', fontSize: '9px' }}>NOVA ANALYZING</span>
      </div>
      <div className="rounded-lg px-5 py-4 flex items-center gap-3" style={{ background: '#070e1a', border: '1px solid rgba(0,212,255,0.15)' }}>
        <Loader size={14} className="animate-spin" style={{ color: '#00d4ff' }} />
        <span className="text-xs cursor-blink" style={{ color: '#8899bb' }}>Processing threat intelligence</span>
      </div>
    </div>
  )
}

export default function ChatPanel({ messages, loading, error, mode, onSend, onClear, onNew }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const submit = () => {
    const val = input.trim()
    if (!val || loading) return
    setInput('')
    onSend(val, mode)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submit()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,212,255,0.08)', background: '#070e1a' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse-ok" style={{ background: '#00e896' }} />
          <span className="font-display font-bold text-sm tracking-widest" style={{ color: '#00d4ff' }}>{MODE_LABELS[mode]}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all"
            style={{ border: '1px solid rgba(0,212,255,0.15)', color: '#8899bb' }}
            title="New session"
          >
            <Plus size={12} />
            <span style={{ fontSize: '9px', letterSpacing: '1px' }}>NEW SESSION</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all"
            style={{ border: '1px solid rgba(255,45,85,0.2)', color: '#ff2d55' }}
            title="Clear session"
          >
            <Trash2 size={12} />
            <span style={{ fontSize: '9px', letterSpacing: '1px' }}>CLEAR</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isEmpty && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,85,255,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}>
              <Terminal size={28} style={{ color: '#00d4ff' }} />
            </div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#00d4ff' }}>NOVA Ready</h3>
            <p className="text-xs mb-6 max-w-xs leading-relaxed" style={{ color: '#8899bb' }}>
              Submit threat data, alerts, or incident details for AI-powered analysis.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {[
                'Suspicious PowerShell beacon to C2 on port 4444',
                'CVE-2021-44228 Log4Shell detected in prod',
                'Ransomware — 40 endpoints encrypted, DA creds stolen',
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setInput(sample)}
                  className="text-left px-4 py-2 rounded text-xs transition-all"
                  style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', color: '#8899bb' }}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <UserMessage key={i} content={msg.content} />
          ) : (
            <AssistantMessage key={i} content={msg.content} verdict={msg.verdict} />
          )
        )}

        {loading && <TypingIndicator />}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg px-4 py-3" style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
            <AlertCircle size={14} style={{ color: '#ff2d55', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: '#ff2d55' }}>{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'rgba(0,212,255,0.08)', background: '#070e1a' }}>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.2)', background: '#0a1220' }}>
          <textarea
            ref={textareaRef}
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={MODE_PLACEHOLDERS[mode]}
            className="w-full px-4 pt-3 text-xs resize-none outline-none"
            style={{ background: 'transparent', color: '#d0daf0', lineHeight: '1.7', fontSize: '11px' }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs" style={{ color: '#334455', fontSize: '9px' }}>CTRL+ENTER TO SUBMIT</span>
            <button
              onClick={submit}
              disabled={!input.trim() || loading}
              className="flex items-center gap-2 px-4 py-2 rounded font-bold text-xs transition-all"
              style={{
                background: !input.trim() || loading ? 'rgba(0,212,255,0.05)' : 'linear-gradient(135deg, #00d4ff, #0055ff)',
                color: !input.trim() || loading ? '#334455' : '#020509',
                letterSpacing: '1px',
              }}
            >
              {loading ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
              <span style={{ fontSize: '10px' }}>{loading ? 'ANALYZING' : 'ANALYZE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
