import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, XCircle, Trophy, TrendingUp, Calendar, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

function StatusBadge({ status }) {
  const map = { on_track: ['bg-neon/20 text-green-700','En camino'], at_risk: ['bg-amber/20 text-amber','En riesgo'], off_track: ['bg-red-100 text-red-600','Fuera de camino'], completed: ['bg-neon/20 text-green-700','Completado'] }
  const [cls, label] = map[status] || map.on_track
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { activeCycle } = useApp()
  const themes = activeCycle?.themes || []
  const objectives = activeCycle?.objectives || []
  const keyResults = activeCycle?.keyResults || []

  if (!activeCycle || activeCycle.status === 'draft') {
    return (
      <Layout>
        <div className="p-8 flex flex-col items-center justify-center min-h-screen">
          <TrendingUp size={64} className="text-border mb-6" />
          <h2 className="text-2xl font-bold text-navy mb-2">No hay ciclo activo</h2>
          <p className="text-text-secondary mb-6">Crea tu primer ciclo de OKRs para ver el dashboard.</p>
          <button onClick={() => navigate('/crear/mentalidad')} className="btn-primary flex items-center gap-2">Comenzar ciclo OKR <ChevronRight size={16} /></button>
        </div>
      </Layout>
    )
  }

  const krsWithValues = keyResults.filter(kr => kr.initialValue && kr.targetValue)
  const globalProgress = krsWithValues.length > 0
    ? krsWithValues.reduce((sum, kr) => {
        const ini = parseFloat(kr.initialValue), cur = parseFloat(kr.currentValue || kr.initialValue), tgt = parseFloat(kr.targetValue)
        const range = tgt - ini
        return sum + (range > 0 ? (cur - ini) / range : 0)
      }, 0) / krsWithValues.length * 100
    : 0

  const statusCounts = keyResults.reduce((acc, kr) => { acc[kr.status || 'on_track'] = (acc[kr.status || 'on_track'] || 0) + 1; return acc }, {})

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-navy">Panel de Control</h1>
            <span className="text-sm text-text-secondary">{activeCycle.period} {activeCycle.year}</span>
          </div>
          <p className="text-text-secondary">{activeCycle.name}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-1">{Math.round(globalProgress)}%</div>
            <div className="text-xs text-text-secondary">Progreso global</div>
            <div className="mt-2 bg-border rounded-full h-2"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${globalProgress}%` }} /></div>
          </div>
          <div className="card text-center"><div className="text-3xl font-bold text-green-600 mb-1">{statusCounts.on_track || 0}</div><div className="text-xs text-text-secondary">En camino</div></div>
          <div className="card text-center"><div className="text-3xl font-bold mb-1" style={{color:'#FF740A'}}>{statusCounts.at_risk || 0}</div><div className="text-xs text-text-secondary">En riesgo</div></div>
          <div className="card text-center"><div className="text-3xl font-bold text-red-500 mb-1">{statusCounts.off_track || 0}</div><div className="text-xs text-text-secondary">Fuera de camino</div></div>
        </div>

        <div className="space-y-6">
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
                  const objStatus = objKRs.some(kr => kr.status === 'off_track') ? 'off_track' : objKRs.some(kr => kr.status === 'at_risk') ? 'at_risk' : objKRs.every(kr => kr.status === 'completed') ? 'completed' : 'on_track'
                  return (
                    <div key={obj.id} className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-navy text-sm flex-1 pr-4">{obj.refinedStatement || `${obj.whatStatement} ${obj.whyStatement}`}</p>
                        <StatusBadge status={objStatus} />
                      </div>
                      <div className="space-y-2 pl-4 border-l-2 border-border">
                        {objKRs.map(kr => {
                          const ini = parseFloat(kr.initialValue)||0, cur = parseFloat(kr.currentValue||kr.initialValue)||ini, tgt = parseFloat(kr.targetValue)||100
                          const pct = Math.min(100, Math.max(0, ((cur-ini)/(tgt-ini||1))*100))
                          const colors = {on_track:'#00FFB4',at_risk:'#FF740A',off_track:'#EF4444',completed:'#00FFB4'}
                          return (
                            <div key={kr.id} className="p-3 bg-bg-card rounded-lg">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-sm text-navy"><strong>{kr.directionalVerb}</strong> {kr.metric}</p>
                                <StatusBadge status={kr.status || 'on_track'} />
                              </div>
                              <div className="w-full bg-border rounded-full h-2"><div className="h-2 rounded-full transition-all" style={{width:`${pct}%`,background:colors[kr.status||'on_track']}} /></div>
                              <div className="flex justify-between text-xs text-text-secondary mt-1"><span>{kr.currentValue||kr.initialValue||0}</span><span>→ {kr.targetValue||'?'}</span></div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {themes.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              <p>Completa el proceso de creación de OKRs para ver tu progreso.</p>
              <button onClick={() => navigate('/crear/mentalidad')} className="btn-secondary mt-4">Ir al wizard de creación</button>
            </div>
          )}
        </div>

        {activeCycle.behaviorPlan?.weekly && (
          <div className="mt-8 card bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2"><Calendar size={16} className="text-primary" /><span className="font-bold text-navy text-sm">Ritual semanal</span></div>
            <p className="text-text-secondary text-sm">{activeCycle.behaviorPlan.weekly}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
