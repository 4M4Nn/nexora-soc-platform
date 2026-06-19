import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Activity, FileSearch, ClipboardList, ChevronRight, Terminal, Zap, Lock, Globe, ArrowRight } from 'lucide-react'
import ContactModal from '../components/ContactModal'

const FEATURES = [
  {
    icon: Shield,
    title: 'SOC TRIAGE',
    color: '#00d4ff',
    desc: 'L3-equivalent alert triage. MITRE ATT&CK mapping, IOC analysis, severity scoring, and Kali Linux commands — all in one response.',
  },
  {
    icon: Activity,
    title: 'INCIDENT RESPONSE',
    color: '#ff2d55',
    desc: 'Battle-tested IR playbooks in seconds. Containment, eradication, evidence preservation, and communication plans for any incident type.',
  },
  {
    icon: FileSearch,
    title: 'RISK SCORING',
    color: '#ffb800',
    desc: 'CVSS v3.1 scoring with full vector breakdown, business impact analysis, exploitability assessment, and remediation roadmaps.',
  },
  {
    icon: ClipboardList,
    title: 'SECURITY AUDIT',
    color: '#00e896',
    desc: 'Executive-ready audit reports aligned to ISO 27001, NIST CSF, CIS Controls, and GDPR. Findings register with risk matrix.',
  },
]

const TERMINAL_LINES = [
  { delay: 0, color: '#445566', text: '$ nova analyze --mode soc --input alert.log' },
  { delay: 600, color: '#00d4ff', text: '◈ NOVA SOC Analyst initialized...' },
  { delay: 1200, color: '#8899bb', text: 'Loading threat intelligence feeds...' },
  { delay: 1800, color: '#ff2d55', text: '## VERDICT' },
  { delay: 2200, color: '#ff2d55', text: '🔴 ESCALATE — P1 (Critical)' },
  { delay: 2800, color: '#00d4ff', text: '## MITRE ATT\&CK MAPPING' },
  { delay: 3200, color: '#8899bb', text: 'T1059.001 · PowerShell · Command Execution' },
  { delay: 3600, color: '#8899bb', text: 'T1071.001 · Web Protocols · C2 Channel' },
  { delay: 4200, color: '#ffb800', text: '## KALI LINUX COMMANDS' },
  { delay: 4600, color: '#00e896', text: '$ nmap -sV -p 4444 45.33.32.156 --script vuln' },
]

function AnimatedTerminal() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisible(i + 1), line.delay + 500)
    )
    const reset = setTimeout(() => setVisible(0), 7000)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [visible === 0 ? 0 : -1])

  useEffect(() => {
    if (visible === 0) {
      const t = setTimeout(() => setVisible(1), 100)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#040d16', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 60px rgba(0,212,255,0.08)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)', background: '#070e1a' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff2d55' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#ffb800' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#00e896' }} />
        <span className="ml-2 text-xs" style={{ color: '#445566', fontSize: '9px', letterSpacing: '1px' }}>NOVA TERMINAL — NEXORA SOC</span>
      </div>
      <div className="p-5 font-mono text-xs space-y-1.5" style={{ minHeight: '200px' }}>
        {TERMINAL_LINES.slice(0, visible).map((line, i) => (
          <div key={i} className="animate-fade-in-up" style={{ color: line.color }}>
            {line.text}
            {i === visible - 1 && visible < TERMINAL_LINES.length && (
              <span className="ml-1 inline-block w-1.5 h-3.5 align-middle" style={{ background: '#00d4ff', animation: 'blink 1s step-end infinite' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Landing() {
  const [showContact, setShowContact] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#020509' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)' }}>
            <Shield size={16} color="#020509" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg" style={{ color: '#00d4ff', letterSpacing: '2px' }}>NEXORA</div>
            <div style={{ color: '#445566', letterSpacing: '3px', fontSize: '7px' }}>SOC PLATFORM</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {['Features', 'How It Works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-xs transition-colors hover:text-white" style={{ color: '#8899bb', letterSpacing: '1px' }}>{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-xs px-4 py-2 rounded transition-all" style={{ color: '#8899bb', border: '1px solid rgba(0,212,255,0.15)' }}>
            LOGIN
          </Link>
          <Link to="/login" className="text-xs px-4 py-2 rounded font-bold transition-all" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)', color: '#020509', letterSpacing: '1px' }}>
            TRY FREE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-16 pt-20 pb-16 cyber-grid">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Zap size={10} style={{ color: '#00d4ff' }} />
                <span className="text-xs" style={{ color: '#00d4ff', letterSpacing: '2px', fontSize: '9px' }}>AI-POWERED · FREE TIER · INSTANT ANALYSIS</span>
              </div>

              <h1 className="font-display font-bold text-4xl lg:text-5xl mb-4 leading-tight">
                <span style={{ color: '#d0daf0' }}>Your AI</span>{' '}
                <span style={{ color: '#00d4ff' }} className="glow-cyan">SOC Analyst</span>
                <br />
                <span style={{ color: '#d0daf0' }}>Available 24/7</span>
              </h1>

              <p className="text-sm mb-8 leading-relaxed max-w-lg" style={{ color: '#8899bb', lineHeight: '1.8' }}>
                NOVA delivers L3-equivalent security analysis — alert triage, incident response, CVSS scoring, and compliance audits — in seconds, not hours. Powered by LLaMA 3.3 70B.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold font-display text-sm tracking-widest transition-all"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)', color: '#020509' }}
                >
                  START ANALYZING FREE
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setShowContact(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm transition-all"
                  style={{ border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
                >
                  Enterprise Demo
                </button>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { label: '4 AI AGENTS', sub: 'SOC · IR · Risk · Audit' },
                  { label: 'FREE TIER', sub: 'No credit card' },
                  { label: 'MITRE ATT&CK', sub: 'Full framework' },
                ].map(({ label, sub }) => (
                  <div key={label}>
                    <div className="text-xs font-bold font-display" style={{ color: '#00d4ff', letterSpacing: '1px', fontSize: '10px' }}>{label}</div>
                    <div className="text-xs" style={{ color: '#445566', fontSize: '9px' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-float">
              <AnimatedTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#d0daf0' }}>Four Specialized Agents</h2>
            <p className="text-sm" style={{ color: '#8899bb' }}>Each mode delivers expert-level output structured for SOC operations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, color, desc }) => (
              <div key={title} className="rounded-xl p-6 transition-all hover:-translate-y-1" style={{ background: '#0a1220', border: '1px solid rgba(0,212,255,0.08)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-sm mb-2 tracking-widest" style={{ color, fontSize: '11px' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#8899bb', lineHeight: '1.7', fontSize: '11px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 lg:px-16 py-20" style={{ background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#d0daf0' }}>How It Works</h2>
          <p className="text-sm mb-12" style={{ color: '#8899bb' }}>From raw alert to actionable intelligence in under 10 seconds.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Paste Alert Data', desc: 'Drop in raw logs, SIEM alerts, CVE findings, or incident descriptions. No special formatting required.' },
              { n: '02', title: 'Select Agent Mode', desc: 'Choose SOC Triage, Incident Response, Risk Scoring, or Security Audit based on your need.' },
              { n: '03', title: 'Get Expert Analysis', desc: 'Receive structured, L3-quality output with MITRE mapping, commands, and a clear escalation decision.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-left">
                <div className="font-display font-bold text-4xl mb-3" style={{ color: 'rgba(0,212,255,0.2)', fontSize: '48px' }}>{n}</div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#d0daf0' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#8899bb', lineHeight: '1.8', fontSize: '11px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#d0daf0' }}>Simple Pricing</h2>
          <p className="text-sm mb-12" style={{ color: '#8899bb' }}>Start free. Scale when you're ready.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-xl p-8 text-left" style={{ background: '#0a1220', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="font-display font-bold text-sm mb-1 tracking-widest" style={{ color: '#8899bb', fontSize: '10px' }}>ANALYST FREE</div>
              <div className="font-display font-bold text-4xl mb-4" style={{ color: '#d0daf0' }}>$0<span className="text-sm font-normal" style={{ color: '#445566' }}>/mo</span></div>
              {['All 4 agent modes', 'Session history', 'Kali command generation', 'MITRE ATT&CK mapping'].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: '#00e896' }} />
                  <span className="text-xs" style={{ color: '#8899bb', fontSize: '11px' }}>{f}</span>
                </div>
              ))}
              <Link to="/login" className="mt-6 block text-center py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all" style={{ border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                GET STARTED FREE
              </Link>
            </div>
            <div className="rounded-xl p-8 text-left relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,85,255,0.08))', border: '1px solid rgba(0,212,255,0.25)' }}>
              <div className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: '8px', letterSpacing: '1px' }}>POPULAR</div>
              <div className="font-display font-bold text-sm mb-1 tracking-widest" style={{ color: '#00d4ff', fontSize: '10px' }}>ENTERPRISE</div>
              <div className="font-display font-bold text-4xl mb-4" style={{ color: '#d0daf0' }}>Custom</div>
              {['Multi-team workspace', 'SSO / SAML integration', 'API access & webhooks', 'SLA & dedicated support', 'Custom agent fine-tuning'].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: '#00d4ff' }} />
                  <span className="text-xs" style={{ color: '#8899bb', fontSize: '11px' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => setShowContact(true)} className="mt-6 w-full py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)', color: '#020509' }}>
                CONTACT SALES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-16 text-center" style={{ background: 'rgba(0,212,255,0.03)', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <Lock size={32} className="mx-auto mb-4" style={{ color: '#00d4ff', opacity: 0.6 }} />
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: '#d0daf0' }}>Ready to upgrade your SOC?</h2>
        <p className="text-sm mb-6" style={{ color: '#8899bb' }}>Start analyzing threats in seconds. No setup. No credit card.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold font-display text-sm tracking-widest" style={{ background: 'linear-gradient(135deg, #00d4ff, #0055ff)', color: '#020509' }}>
          LAUNCH NOVA FREE
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <Shield size={14} style={{ color: '#00d4ff' }} />
          <span className="text-xs font-display font-bold" style={{ color: '#445566', letterSpacing: '2px' }}>NEXORA AI SOLUTIONS</span>
        </div>
        <p className="text-xs" style={{ color: '#334455', fontSize: '9px' }}>© 2025 NEXORA · CONFIDENTIAL · ALL RIGHTS RESERVED</p>
      </footer>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  )
}
