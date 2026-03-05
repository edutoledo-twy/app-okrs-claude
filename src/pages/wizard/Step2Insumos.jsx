import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'

export default function Step2Insumos() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...state.wizard.insumos })

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleNext() {
    dispatch({ type: 'SET_WIZARD_INSUMOS', value: form })
    navigate('/crear/big-think')
  }

  const fields = [
    { key: 'vision', label: 'Visión', placeholder: '¿A dónde va la empresa/equipo a largo plazo?' },
    { key: 'mision', label: 'Misión', placeholder: '¿Cuál es el propósito y razón de ser?' },
    { key: 'valores', label: 'Valores', placeholder: '¿Qué principios guían las decisiones?' },
    { key: 'quarter', label: 'Contexto del Quarter', placeholder: '¿Qué está pasando este trimestre? ¿Retos, oportunidades?' },
  ]

  return (
    <WizardLayout currentStep={2} title="Insumos estratégicos" subtitle="Esta información contextualizará tus OKRs y los mantendrá alineados a tu estrategia.">
      <div className="flex flex-col gap-5 mb-8">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-navy mb-1">{f.label}</label>
            <textarea
              className="textarea-field"
              rows={3}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => update(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">← Atrás</button>
        <button onClick={handleNext} className="btn-primary">Siguiente →</button>
      </div>
    </WizardLayout>
  )
}
