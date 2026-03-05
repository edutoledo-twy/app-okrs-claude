import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'
import { Plus, Trash2 } from 'lucide-react'

export default function Step3BigThink() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const items = state.wizard.bigThink

  function add() {
    if (!input.trim()) return
    dispatch({ type: 'ADD_BIG_THINK', item: input.trim() })
    setInput('')
  }

  function remove(i) {
    dispatch({ type: 'REMOVE_BIG_THINK', index: i })
  }

  return (
    <WizardLayout currentStep={3} title="Big Think" subtitle="Piensa en grande. ¿Qué ideas audaces quieres explorar este trimestre sin limitaciones?">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Escribe una idea grande..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button onClick={add} className="btn-secondary px-3">
            <Plus size={18} />
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-2">Presiona Enter o el botón + para agregar</p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2 mb-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-card rounded-card px-4 py-3 border border-border">
              <span className="flex-1 text-sm text-navy">{item}</span>
              <button onClick={() => remove(i)} className="text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">← Atrás</button>
        <button onClick={() => navigate('/crear/temas')} className="btn-primary">Siguiente →</button>
      </div>
    </WizardLayout>
  )
}
