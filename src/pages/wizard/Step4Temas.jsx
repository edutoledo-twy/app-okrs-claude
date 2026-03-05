import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'
import { Plus, Trash2 } from 'lucide-react'

const COLORS = ['#3DB3EA', '#FF00E3', '#00FFB4', '#FF740A', '#243C6A']

export default function Step4Temas() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const temas = state.wizard.temas

  function add() {
    if (!input.trim()) return
    const color = COLORS[temas.length % COLORS.length]
    dispatch({ type: 'SET_TEMAS', temas: [...temas, { name: input.trim(), color }] })
    setInput('')
  }

  function remove(i) {
    dispatch({ type: 'SET_TEMAS', temas: temas.filter((_, idx) => idx !== i) })
  }

  return (
    <WizardLayout currentStep={4} title="Temas estratégicos" subtitle="Define las áreas o pilares que organizarán tus objetivos. Ej: Crecimiento, Producto, Equipo.">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Nombre del tema (ej: Crecimiento de ingresos)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button onClick={add} className="btn-secondary px-3">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {temas.map((tema, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: tema.color }}
          >
            {tema.name}
            <button onClick={() => remove(i)} className="opacity-70 hover:opacity-100 ml-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">← Atrás</button>
        <button onClick={() => navigate('/crear/objetivos')} className="btn-primary">Siguiente →</button>
      </div>
    </WizardLayout>
  )
}
