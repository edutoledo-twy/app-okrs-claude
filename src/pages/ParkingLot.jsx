import { useState } from 'react'
import { ParkingSquare, Plus, Trash2, ArrowRight, Lightbulb } from 'lucide-react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

const CATEGORIES = [
  { key: 'idea', label: 'Idea', color: '#3DB3EA', bg: 'bg-primary/10' },
  { key: 'risk', label: 'Riesgo', color: '#FF740A', bg: 'bg-amber/10' },
  { key: 'question', label: 'Pregunta', color: '#FF00E3', bg: 'bg-fuchsia/10' },
  { key: 'future', label: 'Futuro ciclo', color: '#00FFB4', bg: 'bg-neon/10' },
]

export default function ParkingLot() {
  const { activeCycle, addParkingItem, updateParkingItem, removeParkingItem } = useApp()
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState('idea')
  const items = activeCycle?.parkingLot || []

  const handleAdd = () => {
    if (!newText.trim()) return
    addParkingItem({ text: newText.trim(), category: newCategory })
    setNewText('')
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ParkingSquare size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-navy">Parking Lot</h1>
          </div>
          <p className="text-text-secondary">
            Ideas, riesgos y preguntas que surgieron y no quieres perder. Captúralos aquí sin interrumpir tu flujo.
          </p>
        </div>

        <div className="card mb-8">
          <h3 className="font-bold text-navy mb-4">Agregar al Parking Lot</h3>
          <div className="flex gap-3 mb-3 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setNewCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer transition-all ${newCategory === cat.key ? 'text-white' : 'text-navy bg-bg-card border border-border'}`}
                style={newCategory === cat.key ? { background: cat.color } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Escribe una idea, riesgo, pregunta o algo para el futuro..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            />
            <button onClick={handleAdd} disabled={!newText.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Plus size={16} />Agregar
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <Lightbulb size={48} className="mx-auto mb-4 text-border" />
            <p className="font-semibold text-navy mb-1">El parking lot está vacío</p>
            <p className="text-sm">Cuando tengas ideas o preguntas que no quieras perder, agrégalas aquí.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map(cat => {
              const catItems = items.filter(i => i.category === cat.key)
              if (catItems.length === 0) return null
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <h3 className="font-bold text-navy text-sm">{cat.label}</h3>
                    <span className="text-xs text-text-secondary">({catItems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {catItems.map(item => (
                      <div key={item.id} className={`card ${cat.bg} flex items-start gap-3`}>
                        <div className="flex-1">
                          <textarea
                            className="w-full bg-transparent text-sm text-navy resize-none focus:outline-none"
                            rows={2}
                            value={item.text}
                            onChange={e => updateParkingItem(item.id, { text: e.target.value })}
                          />
                          {item.createdAt && (
                            <p className="text-xs text-text-secondary mt-1">
                              {new Date(item.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <select
                            value={item.category}
                            onChange={e => updateParkingItem(item.id, { category: e.target.value })}
                            className="text-xs border border-border rounded px-1 py-0.5 bg-white text-navy focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                          </select>
                          <button onClick={() => removeParkingItem(item.id)} className="text-text-secondary hover:text-red-500 border-0 bg-transparent cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 p-4 bg-navy/5 rounded-card border border-navy/20 text-sm text-text-secondary">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight size={14} className="text-primary" />
              <span className="font-semibold text-navy">¿Qué hacer con estos items?</span>
            </div>
            <p>En la revisión de ciclo, pasa por el Parking Lot. Decide qué va al Compost (reutilizable), qué a la Pila de Quema (eliminar) y qué merece convertirse en un OKR del próximo ciclo.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
