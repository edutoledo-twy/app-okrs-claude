import { useState, useRef, useEffect } from 'react'
import { Bot, User, Send } from 'lucide-react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

const QUICK_QUESTIONS = [
  '¿Cómo redacto un buen objetivo?',
  '¿Cuál es la diferencia entre aspiración y compromiso?',
  'Mi KR no tiene número claro, ¿qué hago?',
  '¿Cuántos OKRs debería tener?',
  'Explícame la metáfora del jardín',
  '¿Qué es el Parking Lot?',
]

export default function Coach() {
  const { activeCycle, saveCoachMessage } = useApp()
  const [messages, setMessages] = useState(activeCycle?.coachConversations?.free || [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    const userMsg = { role: 'user', content, ts: Date.now() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    inputRef.current?.focus()
    try {
      const res = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: 'free', messages: newMessages.map(m => ({ role: m.role, content: m.content })), cycleData: { objectives: activeCycle?.objectives||[], keyResults: activeCycle?.keyResults||[], themes: activeCycle?.themes||[] } })
      })
      const assistantContent = res.ok ? (await res.json()).response : 'No se pudo conectar con el Coach IA. Configura tu ANTHROPIC_API_KEY en el archivo .env del servidor.'
      const assistantMsg = { role: 'assistant', content: assistantContent, ts: Date.now() }
      setMessages([...newMessages, assistantMsg])
      if (activeCycle) { saveCoachMessage('free', userMsg); saveCoachMessage('free', assistantMsg) }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión con el servidor.', ts: Date.now() }])
    }
    setLoading(false)
  }

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="p-6 border-b border-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#3DB3EA,#FF00E3)'}}>
              <Bot size={20} className="text-white" />
            </div>
            <div><h1 className="font-bold text-navy">Coach IA</h1><p className="text-xs text-text-secondary">Metodología No-BS OKRs · Powered by Claude</p></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#3DB3EA,#FF00E3)'}}>
                <Bot size={32} className="text-white" />
              </div>
              <h2 className="font-bold text-navy mb-2">Tu Coach de OKRs</h2>
              <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto">Soy socrático: pregunto más de lo que afirmo. Estoy aquí para ayudarte a pensar bien sobre tus objetivos.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => send(q)} className="text-left text-sm p-3 rounded-lg bg-bg-card hover:bg-primary/10 text-navy transition-colors border border-border cursor-pointer">{q}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role==='user'?'justify-end':'justify-start'} fade-in`}>
              {m.role==='assistant' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5"><Bot size={16} className="text-white" /></div>}
              <div className={`max-w-[75%] p-4 rounded-card text-sm leading-relaxed ${m.role==='user'?'bg-primary text-white':'bg-bg-card text-navy border border-border'}`}>
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
              {m.role==='user' && <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0 mt-0.5"><User size={16} className="text-white" /></div>}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-white" /></div>
              <div className="bg-bg-card p-4 rounded-card border border-border flex gap-2 items-center">
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" /><span className="w-2 h-2 bg-primary rounded-full typing-dot" /><span className="w-2 h-2 bg-primary rounded-full typing-dot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-border bg-white">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <textarea ref={inputRef} className="textarea-field flex-1" rows={2} placeholder="Pregunta algo sobre tus OKRs..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }} />
            <button onClick={() => send()} disabled={!input.trim()||loading} className="bg-primary text-white w-12 rounded-btn flex items-center justify-center border-0 cursor-pointer hover:opacity-90 disabled:opacity-50 self-end h-10"><Send size={18} /></button>
          </div>
          <p className="text-xs text-text-secondary text-center mt-2">Enter para enviar · Shift+Enter para nueva línea</p>
        </div>
      </div>
    </Layout>
  )
}
