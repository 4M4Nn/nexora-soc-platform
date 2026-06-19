import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ChatPanel from '../components/ChatPanel'
import { useAuth } from '../hooks/useAuth'
import { useAgent } from '../hooks/useAgent'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { messages, loading, error, lastVerdict, send, clearSession, newSession } = useAgent()
  const [mode, setMode] = useState('soc')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020509' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(2,5,9,0.8)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <div
        className={`fixed lg:relative z-40 lg:z-auto h-full w-64 flex-shrink-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          mode={mode}
          setMode={handleModeChange}
          user={user}
          logout={logout}
          lastVerdict={lastVerdict}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="flex lg:hidden items-center gap-3 px-4 py-3 border-b" style={{ background: '#070e1a', borderColor: 'rgba(0,212,255,0.08)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: '#8899bb' }}>
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-sm tracking-widest" style={{ color: '#00d4ff' }}>NEXORA NOVA</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatPanel
            messages={messages}
            loading={loading}
            error={error}
            mode={mode}
            onSend={send}
            onClear={clearSession}
            onNew={newSession}
          />
        </div>
      </div>
    </div>
  )
}
