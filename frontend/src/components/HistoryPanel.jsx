import React, { useEffect, useState } from 'react'
import { Clock, ChevronRight } from 'lucide-react'
import { api } from '../utils/api'

const MODE_LABELS = { soc: 'SOC', ir: 'IR', risk: 'RISK', audit: 'AUDIT' }
const VERDICT_COLORS = {
  ESCALATE: '#ff2d55',
  MONITOR: '#ffb800',
  CLOSE: '#00e896',
  UNKNOWN: '#8899bb',
}

function timeAgo(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString()
}

export default function HistoryPanel() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.history()
      .then(data => setItems(data.history || []))
      .catch(() => {})

    const interval = setInterval(() => {
      api.history()
        .then(data => setItems(data.history || []))
        .catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!items.length) {
    return (
      <div className="px-3 py-4">
        <p className="text-xs text-center" style={{ color: '#445566' }}>No analysis history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-1 px-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded px-3 py-2 cursor-default transition-all"
          style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold font-display tracking-widest" style={{ color: '#00d4ff' }}>
              {MODE_LABELS[item.mode] || item.mode}
            </span>
            <span className="text-xs font-bold" style={{ color: VERDICT_COLORS[item.verdict] || '#8899bb' }}>
              {item.verdict}
            </span>
          </div>
          <p className="text-xs truncate mb-1" style={{ color: '#8899bb' }}>{item.preview}</p>
          <div className="flex items-center gap-1" style={{ color: '#445566' }}>
            <Clock size={9} />
            <span style={{ fontSize: '9px' }}>{timeAgo(item.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
