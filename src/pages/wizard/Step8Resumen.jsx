import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Download, ChevronRight, Bot, X } from 'lucide-react'
import WizardLayout from '../../components/WizardLayout'
import { useApp } from '../../context/AppContext'

export default function Step8Resumen() {
  const navigate = useNavigate()
  const { activeCycle, updateCycle, activateCycle } = useApp()
  const [coachFeedback, setCoachFeedback] = useState(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const themes = activeCycle?.themes || []
  const objectives = activeCycle?.objectives || []
  const keyResults = activeCycle?.keyResults || []

  useEffect(() => {
    if (objectives.length > 0 && keyResults.length > 0) requestCoachReview()
  }, [])

  const requestCoachReview = async () => {
    setLoadingFeedback(true)
    const okrSummary = objectives.map(obj => {
      const krs = keyResults.filter(kr => kr.objectiveId === obj.id)
      return `Objetivo: ${obj.refinedStatement || obj.whatStatement}\nKRs:\n${krs.map(kr => `  - ${kr.directionalVerb} ${kr.metric} (${kr.type})`).join('\n')}`
    }).join('\n\n')
    try {
      const res = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: 'review', message: `Por favor revisa estos OKRs:\n\n${okrSummary}`, cycleData: { objectives, keyResults } })
      })
      setCoachFeedback(res.ok ? (await res.json()).response : 'Puedes pedir retroalimentación del Coach IA en la sección Coach.')
    } catch { setCoachFeedback('El Coach IA no está disponible. Revisa la configuración de la API key.') }
    setLoadingFeedback(false)
  }

  const handleActivate = () => { activateCycle(); navigate('/dashboard') }

  return (
    <WizardLayout canNext={false} onNext={handleActivate}>
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Tus OKRs de un Vistazo</h1>
        <p className="text-text-secondary mb-6">Relájate y admira el trabajo. Este es tu plan de transformación.</p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input className="input-field text-lg font-bold max-w-xs" value={activeCycle?.name || ''} onChange={e => updateCycle({ name: e.target.value })} placeholder="Nombre del ciclo" />
          <div className="flex gap-2 flex-wrap">
            {['Q1','Q2','Q3','Q4','H1','H2','Anual'].map(p => (
              <button key={p} onClick={() => updateCycle({ period: p })} className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${activeCycle?.period === p ? 'bg-primary text-white' : 'bg-bg-card text-navy border border-border'}`}>{p}</button>
            ))}
          </div>
        </div>

        {(loadingFeedback || coachFeedback) && (
          <div className="card mb-6 bg-navy/5 border border-navy/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Bot size={18} className="text-primary" /><span className="font-bold text-navy text-sm">Revisión del Coach IA</span></div>
              {coachFeedback && <button onClick={() => setCoachFeedback(null)} className="border-0 bg-transparent cursor-pointer text-text-secondary"><X size={16} /></button>}
            </div>
            {loadingFeedback ? (
              <div className="flex gap-1 items-center text-text-secondary text-sm">
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" /><span className="w-2 h-2 bg-primary rounded-full typing-dot" /><span className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <span className="ml-2">Analizando tus OKRs...</span>
              </div>
            ) : <p className="text-navy text-sm whitespace-pre-line">{coachFeedback}</p>}
          </div>
        )}

        <div className="space-y-6 mb-8">
          {themes.map(theme => {
            const themeObjs = objectives.filter(o => o.themeId === theme.id)
            return (
              <div key={theme.id} className="card border-t-4" style={{ borderTopColor: theme.color }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: theme.color }} />
                  <span className="font-bold text-navy">{theme.name}</span>
                </div>
                {themeObjs.map(obj => {
                  const objKRs = keyResults.filter(kr => kr.objectiveId === obj.id)
                  return (
                    <div key={obj.id} className="mb-4">
                      <div className="p-3 rounded-lg bg-bg-main mb-3">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Objetivo</p>
                        <p className="font-bold text-navy">{obj.refinedStatement || `${obj.whatStatement} ${obj.whyStatement}`}</p>
                      </div>
                      <div className="space-y-2 pl-4">
                        {objKRs.map(kr => (
                          <div key={kr.id} className="flex items-start gap-3 p-3 bg-bg-card rounded-lg">
                            <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-navy"><strong>{kr.directionalVerb}</strong> {kr.metric}{kr.changeDescription && ` en ${kr.changeDescription}`}{kr.initialValue && kr.targetValue && ` (de ${kr.initialValue} a ${kr.targetValue})`}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${kr.type === 'aspiration' ? 'bg-primary/10 text-primary' : 'bg-fuchsia/10 text-fuchsia'}`}>{kr.type === 'aspiration' ? 'Aspiración' : 'Compromiso'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {themes.length === 0 && <div className="p-8 text-center text-text-secondary bg-bg-card rounded-card">No hay OKRs creados todavía. Completa los pasos anteriores.</div>}
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <button onClick={() => window.print()} className="flex items-center gap-2 btn-ghost"><Download size={16} />Exportar PDF</button>
          <button onClick={handleActivate} className="flex items-center gap-2 btn-primary text-base px-8 py-4">
            <CheckCircle size={18} />Activar ciclo e ir al Dashboard<ChevronRight size={18} />
          </button>
        </div>
      </div>
    </WizardLayout>
  )
}
