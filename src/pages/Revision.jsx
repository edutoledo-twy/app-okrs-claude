import { useNavigate } from 'react-router-dom'
import { Flame, Recycle, Sprout, Plus, Trash2, ChevronRight, Leaf } from 'lucide-react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

const AREAS = [
  { key:'burn_pile', label:'Pila de Quema', icon:Flame, color:'#FF740A', bg:'bg-amber/10', border:'border-amber/30', questions:['¿Qué abandonas por completo porque está obsoleto?','¿Qué ya no te sirve o no contribuye a tu futuro?','¿Dónde tienes malezas invasoras que deben desaparecer?'] },
  { key:'compost', label:'Compost', icon:Recycle, color:'#243C6A', bg:'bg-navy/5', border:'border-navy/20', questions:['¿Qué intentaste que no funcionó pero vale la pena intentar de nuevo?','¿Qué deberías conservar pero necesita adoptar una nueva forma?'] },
  { key:'cultivation', label:'Oportunidades de Cultivo', icon:Sprout, color:'#00FFB4', bg:'bg-neon/10', border:'border-neon/30', questions:['¿Qué semillas plantaste que necesitan ayuda para crecer?','¿Qué semillas te gustaría plantar?','Cuando visualizas tu jardín al final del próximo ciclo, ¿qué es diferente?'] },
]

export default function Revision() {
  const navigate = useNavigate()
  const { activeCycle, updateNestedField, addLearningItem, updateLearningItem, removeLearningItem, createCycle } = useApp()
  const data = activeCycle?.learningReview || {}
  const items = data.items || []

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center"><Leaf size={20} className="text-green-600" /></div>
            <h1 className="text-2xl font-bold text-navy">Revisión de Aprendizaje</h1>
          </div>
          <p className="text-text-secondary">Piensa en el ciclo anterior como una temporada de crecimiento en un jardín.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {AREAS.map(area => {
            const Icon = area.icon
            const areaItems = items.filter(i => i.category === area.key)
            return (
              <div key={area.key} className={`card ${area.bg} border ${area.border}`}>
                <div className="flex items-center gap-2 mb-3"><Icon size={20} style={{color:area.color}} /><h3 className="font-bold text-navy">{area.label}</h3></div>
                <div className="space-y-1 mb-4">{area.questions.map((q,i) => <p key={i} className="text-xs text-text-secondary">› {q}</p>)}</div>
                <div className="space-y-2 mb-3">
                  {areaItems.map(item => (
                    <div key={item.id} className="flex items-start gap-2">
                      <textarea className="flex-1 text-sm border border-border rounded-input px-2 py-1.5 bg-white focus:outline-none focus:border-primary resize-none" rows={2} placeholder="Escribe aquí..." value={item.content} onChange={e => updateLearningItem(item.id, { content: e.target.value })} />
                      <button onClick={() => removeLearningItem(item.id)} className="text-text-secondary hover:text-red-500 border-0 bg-transparent cursor-pointer mt-1"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addLearningItem(area.key)} className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-btn border border-dashed text-text-secondary hover:text-primary transition-colors bg-transparent cursor-pointer" style={{borderColor:area.color+'60'}}>
                  <Plus size={12} />Añadir item
                </button>
              </div>
            )
          })}
        </div>

        <div className="card mb-8">
          <h3 className="font-bold text-navy mb-3">Aprendizajes Clave</h3>
          <p className="text-text-secondary text-sm mb-3">Resume los aprendizajes más importantes de este ciclo.</p>
          <textarea className="textarea-field" rows={5} placeholder="¿Cuáles son los 3 aprendizajes más importantes de este ciclo?" value={data.keyLearnings||''} onChange={e => updateNestedField('learningReview','keyLearnings',e.target.value)} />
        </div>

        <div className="flex justify-center">
          <button onClick={() => { createCycle(); navigate('/crear/mentalidad') }} className="flex items-center gap-3 btn-primary text-base px-8 py-4">
            <Sprout size={20} />Iniciar nuevo ciclo OKR basado en estos aprendizajes<ChevronRight size={20} />
          </button>
        </div>
      </div>
    </Layout>
  )
}
