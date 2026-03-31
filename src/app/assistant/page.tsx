'use client'

import { useState, useRef, useEffect } from 'react'
import BottomNav from '@/components/navigation/BottomNav'
import { ArrowLeft, Send, Bot, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MSG: Message = {
  role: 'assistant',
  content: "Bonjour ! 👋 Je suis l'assistant FinTrack, ton conseiller financier personnel.\n\nJe peux t'aider à :\n• Analyser tes habitudes de dépenses\n• Te donner des conseils d'épargne\n• Proposer des budgets réalistes\n• Répondre à tes questions sur tes finances\n\nPose-moi ta question !",
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Send only role+content (not the welcome message internal state)
      const apiMessages = newMessages
        .filter((_, i) => i > 0 || newMessages.length === 1) // skip welcome for API
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur du service IA')
      }

      const aiMsg: Message = {
        role: 'assistant',
        content: data.message,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion'
      setError(errorMessage)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleRetry = () => {
    if (messages.length < 2) return
    // Remove last assistant error and retry
    setError(null)
    const lastUserMsg = messages[messages.length - 1]
    if (lastUserMsg.role === 'user') {
      setInput(lastUserMsg.content)
      setMessages(prev => prev.slice(0, -1))
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 768, margin: '0 auto' }}>
        {/* Header */}
        <header className="page-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Assistant IA</h1>
          </div>
          <div className="badge" style={{ fontSize: '11px' }}>
            <Bot size={12} /> Groq AI
          </div>
        </header>

        {/* Chat Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-lg)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: 'var(--space-sm)',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              animation: 'slideUp 0.2s ease forwards',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot size={16} />
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: 'var(--space-md) var(--space-lg)',
                borderRadius: msg.role === 'user'
                  ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)'
                  : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface)',
                color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
                fontSize: 'var(--font-size-base)', lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={16} />
              </div>
              <div style={{
                padding: 'var(--space-md) var(--space-xl)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                display: 'flex', gap: '6px', alignItems: 'center',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.4, animation: 'pulse 1s ease-in-out infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.4, animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.4, animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'var(--space-sm)', padding: 'var(--space-lg)',
              background: 'var(--color-expense-light)', borderRadius: 'var(--radius-md)',
            }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-expense)' }}>{error}</span>
              <button className="btn btn-sm btn-secondary" onClick={handleRetry}>
                <RefreshCw size={14} /> Réessayer
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          flexShrink: 0,
          padding: 'var(--space-md) var(--space-lg)',
          paddingBottom: 'calc(var(--nav-height) + var(--space-md) + env(safe-area-inset-bottom, 0px))',
          background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)',
          display: 'flex', gap: 'var(--space-sm)', alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            type="text"
            className="input"
            placeholder="Pose ta question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            id="ai-chat-input"
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            id="btn-send-message"
            style={{ opacity: !input.trim() || loading ? 0.5 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
