import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Target, TrendingUp, MessageCircle, Lightbulb } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const hasCycles = state.cycles.length > 0

  function startNew() {
    dispatch({ type: 'RESET_WIZARD' })
    navigate('/crear/mentalidad')
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
      {/* Logo / Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-card flex items-center justify-center">
            <Target size={28} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white">TWY OKRs</h1>
        </div>
        <p className="text-primary text-lg font-semibold">Think With You</p>
        <p className="text-slate-400 mt-3 max-w-md">
          Define, ejecuta y revisa tus OKRs con ayuda de inteligencia artificial.
          Logra lo que más importa este trimestre.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl w-full">
        {[
          { icon: Target, title: 'OKRs Estructurados', desc: 'Wizard paso a paso para definir tus mejores objetivos' },
          { icon: TrendingUp, title: 'Tracking Visual', desc: 'Sigue el progreso de tus Key Results en tiempo real' },
          { icon: MessageCircle, title: 'Coach IA', desc: 'Claude como tu coach personal de OKRs siempre disponible' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/10 rounded-card p-4 text-center">
            <Icon size={24} className="text-neon mx-auto mb-2" />
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-slate-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <button onClick={startNew} className="btn-primary text-base px-8 py-4">
          {hasCycles ? '+ Nuevo Ciclo OKR' : 'Crear mis OKRs'}
        </button>
        {hasCycles && (
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-white border-white/30 text-base px-8 py-4">
            Ver Dashboard
          </button>
        )}
      </div>

      {hasCycles && (
        <p className="text-slate-500 text-xs mt-6">
          Tienes {state.cycles.length} ciclo{state.cycles.length > 1 ? 's' : ''} OKR guardado{state.cycles.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
