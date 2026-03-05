import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CoachModal({ onClose }) {
  const { state, dispatch } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.chatHistory, loading])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: userMsg })
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...state.chatHistory, userMsg],
          context: state.cycles,
        }),
      })
      const data = await res.json()
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: { role: 'assistant', content: data.content } })
    } catch {
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: { role: 'assistant', content: 'Lo siento, hubo un error al conectar con el coach. Verifica que el servidor esté activo.' } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-end justify-end z-50 p-4">
      <div className="bg-white rounded-card shadow-md w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-bold text-navy">Coach OKR IA</h3>
            <p className="text-xs text-text-secondary">Impulsado por Claude</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {state.chatHistory.length === 0 && (
            <div className="text-center text-text-secondary text-sm mt-8">
              <p className="text-2xl mb-2">💬</p>
              <p>Hola! Soy tu coach de OKRs. Pregúntame cualquier cosa sobre tus objetivos o cómo mejorar tu sistema OKR.</p>
            </div>
          )}
          {state.chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-card text-sm fade-in ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-bg-card text-navy border border-border'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-bg-card border border-border rounded-card px-4 py-3 flex gap-1">
                <span className="typing-dot w-2 h-2 bg-primary rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-primary rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-primary rounded-full inline-block" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-secondary px-3 py-2 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
