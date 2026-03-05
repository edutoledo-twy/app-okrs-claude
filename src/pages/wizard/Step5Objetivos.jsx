import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'
import { Plus, Trash2 } from 'lucide-react'

export default function Step5Objetivos() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', tema: '', why: '' })
  const objetivos = state.wizard.objetivos
  const temas = state.wizard.temas

  function add() {
    if (!form.title.trim()) return
    dispatch({ type: 'ADD_OBJETIVO', objetivo: { ...form, id: Date.now() } })
    setForm({ title: '', tema: '', why: '' })
  }

  function remove(i) {
    dispatch({ type: 'REMOVE_OBJETIVO', index: i })
  }

  return (
    <WizardLayout currentStep={5} title="Define tus Objetivos" subtitle="Los objetivos son cualitativos, inspiradores y alcanzables en el trimestre.">
      <div className="card mb-6">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Objetivo</label>
            <input
              className="input-field"
              placeholder="Ej: Alcanzar product-market fit en el segmento SMB"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          {temas.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Tema estratégico</label>
              <select
                className="input-field"
                value={form.tema}
                onChange={e => setForm(f => ({ ...f, tema: e.target.value }))}
              >
                <option value="">Sin tema</option>
                {temas.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">¿Por qué importa?</label>
            <textarea
              className="textarea-field"
              rows={2}
              placeholder="El propósito detrás de este objetivo..."
              value={form.why}
              onChange={e => setForm(f => ({ ...f, why: e.target.value }))}
            />
          </div>
          <button onClick={add} disabled={!form.title.trim()} className="btn-secondary disabled:opacity-50 flex items-center gap-2 self-end">
            <Plus size={16} /> Agregar objetivo
          </button>
        </div>
      </div>

      {objetivos.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {objetivos.map((obj, i) => (
            <div key={i} className="card flex items-start gap-3">
              <div className="flex-1">
                <div className="font-semibold text-navy">{obj.title}</div>
                {obj.tema && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{obj.tema}</span>}
                {obj.why && <p className="text-xs text-text-secondary mt-1">{obj.why}</p>}
              </div>
              <button onClick={() => remove(i)} className="text-text-secondary hover:text-red-500 mt-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">← Atrás</button>
        <button onClick={() => navigate('/crear/resultados-clave')} disabled={objetivos.length === 0} className="btn-primary disabled:opacity-50">
          Siguiente →
        </button>
      </div>
    </WizardLayout>
  )
}
