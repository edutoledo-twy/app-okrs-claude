import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import WizardLayout from '../../components/WizardLayout'
import { Plus, Trash2 } from 'lucide-react'

export default function Step6ResultadosClave() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [selectedObj, setSelectedObj] = useState(0)
  const [form, setForm] = useState({ title: '', metric: '', baseline: '', target: '', unit: '' })
  const objetivos = state.wizard.objetivos
  const krs = state.wizard.resultadosClave

  function krsForObj(objId) {
    return krs.filter(kr => kr.objetivoId === objId)
  }

  function add() {
    if (!form.title.trim()) return
    const obj = objetivos[selectedObj]
    dispatch({
      type: 'ADD_KEY_RESULT',
      kr: { ...form, id: Date.now(), objetivoId: obj.id, objetivoTitle: obj.title, current: Number(form.baseline) || 0 }
    })
    setForm({ title: '', metric: '', baseline: '', target: '', unit: '' })
  }

  function remove(i) {
    dispatch({ type: 'REMOVE_KEY_RESULT', index: i })
  }

  return (
    <WizardLayout currentStep={6} title="Resultados Clave (KRs)" subtitle="Los KRs son medibles y definen cómo sabrás que lograste tu objetivo.">
      {/* Objective selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {objetivos.map((obj, i) => (
          <button
            key={i}
            onClick={() => setSelectedObj(i)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedObj === i ? 'bg-navy text-white' : 'bg-bg-card text-navy border border-border hover:border-navy'
            }`}
          >
            O{i + 1}: {obj.title.slice(0, 25)}...
            <span className="ml-1 text-xs opacity-60">({krsForObj(obj.id).length} KRs)</span>
          </button>
        ))}
      </div>

      {/* KR form */}
      <div className="card mb-5">
        <h4 className="font-semibold text-navy text-sm mb-3">Agregar KR para: {objetivos[selectedObj]?.title}</h4>
        <div className="flex flex-col gap-3">
          <input className="input-field" placeholder="Resultado clave (ej: Aumentar MRR de $10k a $25k)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            <input className="input-field" placeholder="Línea base" type="number" value={form.baseline} onChange={e => setForm(f => ({ ...f, baseline: e.target.value }))} />
            <input className="input-field" placeholder="Meta" type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
            <input className="input-field" placeholder="Unidad (%, $, #)" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
          </div>
          <button onClick={add} disabled={!form.title.trim()} className="btn-secondary disabled:opacity-50 self-end flex items-center gap-2">
            <Plus size={16} /> Agregar KR
          </button>
        </div>
      </div>

      {/* KRs list */}
      {krs.length > 0 && (
        <div className="flex flex-col gap-2 mb-8">
          {krs.map((kr, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-card rounded-card px-4 py-3 border border-border">
              <div className="flex-1">
                <div className="text-sm font-semibold text-navy">{kr.title}</div>
                <div className="text-xs text-text-secondary">{kr.objetivoTitle} — {kr.baseline || 0} → {kr.target || 0} {kr.unit}</div>
              </div>
              <button onClick={() => remove(i)} className="text-text-secondary hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">← Atrás</button>
        <button onClick={() => navigate('/crear/comportamiento')} disabled={krs.length === 0} className="btn-primary disabled:opacity-50">Siguiente →</button>
      </div>
    </WizardLayout>
  )
}
