import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen cyber-grid" style={{ background: '#020509' }}>
      {children}
    </div>
  )
}
