import { useState } from 'react'
import { Settings, Trash2, Download, Upload, AlertTriangle } from 'lucide-react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

export default function Config() {
  const { cycles, activeCycle, setActiveCycleId, deleteCycle } = useApp()
  const [confirmDelete, setConfirmDelete] = useState(null)

  const exportData = () => {
    const data = localStorage.getItem('twy_okr_data')
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `twy-okr-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        localStorage.setItem('twy_okr_data', JSON.stringify(parsed))
        window.location.reload()
      } catch {
        alert('Archivo inválido. Asegúrate de que sea un backup de TWY OKR.')
      }
    }
    reader.readAsText(file)
  }

  const handleDelete = (cycleId) => {
    deleteCycle(cycleId)
    setConfirmDelete(null)
  }

  return (
    <Layout>
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-navy">Configuración</h1>
          </div>
          <p className="text-text-secondary">Gestiona tus ciclos OKR y los datos de la aplicación.</p>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold text-navy mb-4">Mis Ciclos OKR</h3>
            {cycles.length === 0 ? (
              <p className="text-text-secondary text-sm">No tienes ciclos todavía.</p>
            ) : (
              <div className="space-y-3">
                {cycles.map(cycle => (
                  <div key={cycle.id} className={`flex items-center justify-between p-3 rounded-lg border ${cycle.id === activeCycle?.id ? 'border-primary bg-primary/5' : 'border-border bg-bg-card'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy text-sm">{cycle.name || 'Sin nombre'}</span>
                        {cycle.id === activeCycle?.id && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Activo</span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{cycle.period} {cycle.year} · {cycle.status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cycle.id !== activeCycle?.id && (
                        <button onClick={() => setActiveCycleId(cycle.id)} className="btn-ghost text-xs py-1 px-2">
                          Activar
                        </button>
                      )}
                      {confirmDelete === cycle.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500">¿Eliminar?</span>
                          <button onClick={() => handleDelete(cycle.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded cursor-pointer border-0">Sí</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs btn-ghost py-1 px-2">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(cycle.id)} className="text-text-secondary hover:text-red-500 border-0 bg-transparent cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-bold text-navy mb-2">Exportar datos</h3>
            <p className="text-text-secondary text-sm mb-4">Descarga un backup de todos tus ciclos OKR y datos de la aplicación.</p>
            <button onClick={exportData} className="btn-secondary flex items-center gap-2">
              <Download size={16} />Exportar backup (JSON)
            </button>
          </div>

          <div className="card">
            <h3 className="font-bold text-navy mb-2">Importar datos</h3>
            <p className="text-text-secondary text-sm mb-4">Restaura un backup previamente exportado. Esto reemplazará todos los datos actuales.</p>
            <div className="flex items-center gap-3">
              <label className="btn-ghost flex items-center gap-2 cursor-pointer">
                <Upload size={16} />Importar backup
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-amber">
              <AlertTriangle size={12} />
              <span>La importación reemplaza todos los datos actuales. No se puede deshacer.</span>
            </div>
          </div>

          <div className="card border border-red-200 bg-red-50">
            <h3 className="font-bold text-red-600 mb-2">Zona de peligro</h3>
            <p className="text-text-secondary text-sm mb-4">Eliminar todos los datos de la aplicación. Esta acción no se puede deshacer.</p>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro? Esto eliminará TODOS tus datos de TWY OKR permanentemente.')) {
                  localStorage.removeItem('twy_okr_data')
                  window.location.reload()
                }
              }}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-white border border-red-300 px-4 py-2 rounded-btn cursor-pointer hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />Eliminar todos los datos
            </button>
          </div>

          <div className="card bg-navy/5 border border-navy/20">
            <h3 className="font-bold text-navy mb-2">Acerca de</h3>
            <p className="text-text-secondary text-sm">TWY OKR App · Versión 1.0</p>
            <p className="text-text-secondary text-sm">Basado en la metodología No-BS OKRs de Sara Lobkovich.</p>
            <p className="text-text-secondary text-sm mt-1">Desarrollado por Thinking With You.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
