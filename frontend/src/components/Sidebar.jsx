import React, { useState } from 'react'
import { Shield, Activity, FileSearch, ClipboardList, LogOut, ChevronDown, ChevronUp, History, User, X } from 'lucide-react'
import HistoryPanel from './HistoryPanel'

const MODES = [
  { id: 'soc', label: 'SOC TRIAGE', icon: Shield, desc: 'Alert triage & IOC analysis' },
  { id: 'ir', label: 'INCIDENT RESPONSE', icon: Activity, desc: 'IR playbooks & containment' },
  { id: 'risk', label: 'RISK SCORING', icon: FileSearch, desc: 'CVSS v3.1 scoring & vuln analysis' },
  { id: 'audit', label: 'SECURITY AUDIT', icon: ClipboardList, desc: 'Compliance & audit reports' },
]

const THREAT_CONFIG = {
  ESCALATE: { label: 'CRITICAL', color: '#ff2d55', bg: 'rgba(255,45,85,0.12)', pulse: 'animate-pulse-danger', bar: 100 },
  MONITOR: { label: 'ELEVATED', color: '#ffb800', bg: 'rgba(255,184,0,0.12)', pulse: 'animate-pulse-warn', bar: 60 },
  CLOSE: { label: 'NOMINAL', color: '#00e896', bg: 'rgba(0,232,150,0.12)', pulse: 'animate-pulse-ok', bar: 20 },
  null: { label: 'STANDBY', color: '#8899bb', bg: 'rgba(136,153,187,0.08)', pulse: '', bar: 5 },
}

export default function Sidebar({ mode, setMode, user, logout, lastVerdict, onClose }) {
  const [showHistory, setShowHistory] = useState(false)
  const threat = THREAT_CONFIG[lastVerdict] || THREAT_CONFIG[null]

  return (
    <div className="flex flex-col h-full" style={{ background: '#070e1a', borderRight: '1px solid rgba(0,212,255,0.08)' }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)' }}>
            <Shield size={16} color="#020509" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none" style={{ color: '#00d4ff', letterSpacing: '2px' }}>NEXORA</div>
            <div className="text-xs" style={{ color: '#445566', letterSpacing: '3px', fontSize: '8px' }}>SOC PLATFORM</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Threat Level */}
      <div className="mx-4 mt-4 mb-2 rounded-lg p-3" style={{ background: threat.bg, border: `1px solid ${threat.color}22` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-widest" style={{ color: '#8899bb', fontSize: '9px' }}>THREAT LEVEL</span>
          <div className={`w-2 h-2 rounded-full ${threat.pulse}`} style={{ background: threat.color }} />
        </div>
        <div className="font-display font-bold text-base tracking-widest" style={{ color: threat.color }}>{threat.label}</div>
        <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${threat.bar}%`, background: threat.color, boxShadow: `0 0 8px ${threat.color}66` }}
          />
        </div>
      </div>

      {/* Mode Selector */}
      <div className="px-3 py-2">
        <div className="text-xs mb-2 px-2" style={{ color: '#445566', letterSpacing: '2px', fontSize: '9px' }}>ANALYSIS MODE</div>
        <div className="space-y-1">
          {MODES.map(({ id, label, icon: Icon, desc }) => {
            const active = mode === id
            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all"
                style={{
                  background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
                  color: active ? '#00d4ff' : '#8899bb',
                }}
              >
                <Icon size={14} style={{ color: active ? '#00d4ff' : '#445566', flexShrink: 0 }} />
                <div>
                  <div className="text-xs font-bold font-display tracking-wider" style={{ fontSize: '10px' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#445566', fontSize: '9px' }}>{desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* History Toggle */}
      <div className="px-3 mt-2">
        <button
          onClick={() => setShowHistory(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-all"
          style={{ color: '#8899bb', border: '1px solid rgba(0,212,255,0.06)', background: 'rgba(0,212,255,0.02)' }}
        >
          <div className="flex items-center gap-2">
            <History size={12} />
            <span style={{ letterSpacing: '1px', fontSize: '9px' }}>ANALYSIS HISTORY</span>
          </div>
          {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {showHistory && (
          <div className="mt-2 max-h-48 overflow-y-auto">
            <HistoryPanel />
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Info */}
      <div className="border-t p-4" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: '#d0daf0' }}>{user?.name}</div>
            <div className="text-xs truncate" style={{ color: '#445566', fontSize: '9px' }}>{user?.org} · {user?.role?.toUpperCase()}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs transition-all"
          style={{ border: '1px solid rgba(255,45,85,0.2)', color: '#ff2d55', background: 'rgba(255,45,85,0.05)' }}
        >
          <LogOut size={12} />
          <span style={{ letterSpacing: '1px' }}>LOGOUT</span>
        </button>
      </div>
    </div>
  )
}
