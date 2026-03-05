import { useState } from 'react'
import { TrendingUp, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

function StatusBadge({ status }) {
  const map = { on_track:['bg-neon/20 text-green-700','En camino'], at_risk:['bg-amber/20 text-amber','En riesgo'], off_track:['bg-red-100 text-red-600','Fuera de camino'], completed:['bg-neon/20 text-green-700','Completado'] }
  const [cls, label] = map[status] || map.on_track
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

function ProgressModal({ kr, onClose, onUpdate }) {
  const [val, setVal] = useState('')
  const [note, setNote] = useState('')
  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card shadow-md w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-navy">Actualizar progreso</h3>
          <button onClick={onClose} className="border-0 bg-transparent cursor-pointer text-text-secondary"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-navy">{kr.directionalVerb} {kr.metric}</p>
            <p className="text-xs text-text-secondary">De {kr.initialValue} a {kr.targetValue} · Actual: {kr.currentValue || kr.initialValue || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Nuevo valor actual</label>
            <input type="number" className="input-field" value={val} onChange={e => setVal(e.target.value)} placeholder={kr.currentValue || kr.initialValue || '0'} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Nota (opcional)</label>
            <textarea className="textarea-field" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="¿Qué está pasando? ¿Qué aprendiste?" />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="btn-ghost">Cancelar</button>
            <button onClick={() => { if (val) { onUpdate(kr.id, val, note); onClose() } }} className="btn-secondary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tracking() {
  const { activeCycle, updateKRProgress } = useApp()
  const [updatingKR, setUpdatingKR] = useState(null)

  if (!activeCycle) return <Layout><div className="p-8 text-center text-text-secondary">No hay ciclo activo.</div></Layout>

  const themes = activeCycle.themes || []
  const objectives = activeCycle.objectives || []
  const keyResults = activeCycle.keyResults || []
  const statusColors = { on_track:'#00FFB4', at_risk:'#FF740A', off_track:'#EF4444', completed:'#00FFB4' }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-navy mb-6">Seguimiento de KRs</h1>
        <div className="space-y-8">
          {themes.map(theme => {
            const themeObjs = objectives.filter(o => o.themeId === theme.id)
            return (
              <div key={theme.id}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: theme.color }} />
                  <h2 className="font-bold text-navy">{theme.name}</h2>
                </div>
                {themeObjs.map(obj => {
                  const objKRs = keyResults.filter(kr => kr.objectiveId === obj.id)
                  return (
                    <div key={obj.id} className="mb-6">
                      <p className="text-sm font-semibold text-navy mb-3 p-3 bg-bg-card rounded-lg">{obj.refinedStatement || obj.whatStatement}</p>
                      <div className="grid gap-4">
                        {objKRs.map(kr => {
                          const ini = parseFloat(kr.initialValue)||0, cur = parseFloat(kr.currentValue||kr.initialValue)||ini, tgt = parseFloat(kr.targetValue)||100
                          const pct = Math.min(100, Math.max(0, ((cur-ini)/(tgt-ini||1))*100))
                          const status = kr.status || 'on_track'
                          const chartData = [{ date:'Inicio', value:ini }, ...(kr.progressEntries||[]).map(e => ({ date: new Date(e.recordedAt).toLocaleDateString('es',{month:'short',day:'numeric'}), value: parseFloat(e.value) }))]
                          return (
                            <div key={kr.id} className="card">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${kr.type==='aspiration'?'bg-primary/10 text-primary':'bg-fuchsia/10 text-fuchsia'}`}>{kr.type==='aspiration'?'Aspiración':'Compromiso'}</span>
                                    <StatusBadge status={status} />
                                  </div>
                                  <p className="font-semibold text-navy"><strong>{kr.directionalVerb}</strong> {kr.metric}{kr.changeDescription && ` en ${kr.changeDescription}`}</p>
                                </div>
                                <button onClick={() => setUpdatingKR(kr)} className="btn-secondary text-xs py-2 px-3 flex-shrink-0">Actualizar</button>
                              </div>
                              <div className="mb-4">
                                <div className="flex justify-between text-xs text-text-secondary mb-1">
                                  <span>Inicial: {kr.initialValue||0}</span><span className="font-bold text-navy">{pct.toFixed(0)}%</span><span>Meta: {kr.targetValue||'?'}</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-3"><div className="h-3 rounded-full transition-all" style={{width:`${pct}%`,background:statusColors[status]}} /></div>
                                <div className="text-center mt-1 text-sm font-bold text-navy">Actual: {kr.currentValue||kr.initialValue||0}</div>
                              </div>
                              {status === 'off_track' && (
                                <div className={`p-3 rounded-lg text-sm mb-3 ${kr.type==='aspiration'?'bg-primary/10 text-primary':'bg-amber/10 text-amber'}`}>
                                  {kr.type==='aspiration' ? 'Recuerda: este es un objetivo aspiracional. Es seguro no alcanzarlo. ¿Qué estás aprendiendo?' : 'Atención: este es un compromiso. Se espera 100% de cumplimiento. ¿Necesitas ajustar tu plan?'}
                                </div>
                              )}
                              {chartData.length > 1 && (
                                <div className="mt-4">
                                  <p className="text-xs text-text-secondary mb-2">Evolución:</p>
                                  <ResponsiveContainer width="100%" height={80}>
                                    <LineChart data={chartData}><XAxis dataKey="date" tick={{fontSize:10}} /><YAxis tick={{fontSize:10}} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3DB3EA" strokeWidth={2} dot={{fill:'#3DB3EA',r:3}} /></LineChart>
                                  </ResponsiveContainer>
                                </div>
                              )}
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
          {themes.length === 0 && <div className="text-center py-12 text-text-secondary"><TrendingUp size={48} className="mx-auto mb-4 text-border" /><p>No hay OKRs para hacer seguimiento todavía.</p></div>}
        </div>
        {updatingKR && <ProgressModal kr={updatingKR} onClose={() => setUpdatingKR(null)} onUpdate={updateKRProgress} />}
      </div>
    </Layout>
  )
}
