import { useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../utils/api'

export function useAgent() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastVerdict, setLastVerdict] = useState(null)
  const sessionIdRef = useRef(uuidv4())

  const getSessionId = () => sessionIdRef.current

  const send = useCallback(async (content, mode) => {
    setLoading(true)
    setError(null)
    const userMsg = { role: 'user', content, mode, ts: Date.now() }
    setMessages(prev => [...prev, userMsg])

    try {
      const data = await api.analyze({ session_id: sessionIdRef.current, mode, content })
      const reply = data.reply

      let verdict = null
      if (reply.includes('ESCALATE')) verdict = 'ESCALATE'
      else if (reply.includes('MONITOR')) verdict = 'MONITOR'
      else if (reply.includes('FALSE POSITIVE') || reply.includes('CLOSE')) verdict = 'CLOSE'
      setLastVerdict(verdict)

      setMessages(prev => [...prev, { role: 'assistant', content: reply, mode, ts: Date.now(), verdict }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSession = useCallback(async () => {
    await api.clearSession(sessionIdRef.current).catch(() => {})
    sessionIdRef.current = uuidv4()
    setMessages([])
    setLastVerdict(null)
    setError(null)
  }, [])

  const newSession = useCallback(() => {
    sessionIdRef.current = uuidv4()
    setMessages([])
    setLastVerdict(null)
    setError(null)
  }, [])

  return { messages, loading, error, lastVerdict, send, clearSession, newSession, getSessionId }
}
