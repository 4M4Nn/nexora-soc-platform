import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 cyber-grid" style={{ background: '#020509' }}>
      <AlertTriangle size={48} className="mb-4" style={{ color: '#ff2d55' }} />
      <h1 className="font-display font-bold text-6xl mb-2" style={{ color: '#ff2d55' }}>404</h1>
      <p className="font-display font-bold text-xl mb-2" style={{ color: '#d0daf0' }}>SECTOR NOT FOUND</p>
      <p className="text-sm mb-8" style={{ color: '#8899bb' }}>The requested resource does not exist in this system.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold font-display text-sm tracking-widest" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)', color: '#020509' }}>
        <Shield size={14} />
        RETURN TO BASE
      </Link>
    </div>
  )
}
