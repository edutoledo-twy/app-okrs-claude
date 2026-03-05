import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'

const OPTIONS = [
  { value: 'moonshot', label: 'Moonshot', desc: 'Apunto muy alto — 70% de logro es éxito. Quiero crecer y estirarrme.' },
  { value: 'roofshot', label: 'Roofshot', desc: 'Metas alcanzables pero ambiciosas. Quiero comprometerme a resultados.' },
  { value: 'hibrido', label: 'Híbrido', desc: 'Combino ambos: algunos OKRs aspiracionales y otros comprometidos.' },
]

export default function Step1Mentalidad() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(state.wizard.mentalidad || '')

  function handleNext() {
    dispatch({ type: 'SET_WIZARD_FIELD', field: 'mentalidad', value: selected })
    navigate('/crear/insumos')
  }

  return (
    <WizardLayout currentStep={1} title="¿Cuál es tu mentalidad OKR?" subtitle="La mentalidad define cómo interpretarás el éxito de tus objetivos este ciclo.">
      <div className="flex flex-col gap-4 mb-8">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={`text-left p-5 rounded-card border-2 transition-all ${
              selected === opt.value
                ? 'border-primary bg-primary/5'
                : 'border-border bg-bg-card hover:border-primary/50'
            }`}
          >
            <div className="font-bold text-navy text-lg">{opt.label}</div>
            <div className="text-text-secondary text-sm mt-1">{opt.desc}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={handleNext} disabled={!selected} className="btn-primary disabled:opacity-50">
          Siguiente →
        </button>
      </div>
    </WizardLayout>
  )
}
