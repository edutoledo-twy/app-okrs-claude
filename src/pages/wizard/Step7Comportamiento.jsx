import WizardLayout from '../../components/WizardLayout'
import { useApp } from '../../context/AppContext'

const RHYTHM = [
  { key: 'daily', label: 'Diario', example: 'Revisión rápida de prioridades, check-in con objetivos' },
  { key: 'weekly', label: 'Semanal', example: 'Revisión de progreso en KRs, ajuste de plan' },
  { key: 'biweekly', label: 'Quincenal', example: 'Sesión de trabajo profundo en lo importante' },
  { key: 'monthly', label: 'Mensual', example: 'Evaluación de progreso OKR, ajuste de rumbo' },
  { key: 'quarterly', label: 'Trimestral', example: 'Revisión de aprendizaje completa, reset de OKRs' },
]

export default function Step7Comportamiento() {
  const { activeCycle, updateNestedField } = useApp()
  const data = activeCycle?.behaviorPlan || {}
  const handleField = (key, value) => updateNestedField('behaviorPlan', key, value)

  return (
    <WizardLayout canNext={true}>
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Tu Plan de Cambio</h1>
        <p className="text-text-secondary mb-2">¿Qué vas a hacer diferente?</p>
        <p className="text-sm text-text-secondary mb-8">Crear OKRs no basta. Necesitas cambiar cómo trabajas para alcanzarlos.</p>

        <div className="card mb-8">
          <h3 className="font-bold text-navy mb-4">Reflexión previa</h3>
          <div className="space-y-4">
            {[
              { key: 'whatsWorking', label: '¿Qué está funcionando en tu rutina actual?', placeholder: 'Lo que ya funciona y quieres conservar...' },
              { key: 'whatsToImprove', label: '¿Qué es lo más importante a mejorar?', placeholder: 'Lo que necesitas cambiar para lograr tus OKRs...' },
              { key: 'whatsToStop', label: '¿Hay algo que debes dejar de hacer?', placeholder: 'Lo que te quita tiempo y energía sin aportar a tus OKRs...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-navy mb-1.5">{label}</label>
                <textarea className="textarea-field" rows={3} defaultValue={data[key] || ''} onChange={e => handleField(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-navy mb-4">Mi Ritmo Personal</h3>
          <div className="space-y-4">
            {RHYTHM.map(({ key, label, example }) => (
              <div key={key} className="grid grid-cols-3 gap-4 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">{label}</div>
                  <p className="text-xs text-text-secondary mt-1">{example}</p>
                </div>
                <div className="col-span-2">
                  <textarea className="textarea-field" rows={2} placeholder={`¿Qué harás ${label.toLowerCase()}?`} defaultValue={data[key] || ''} onChange={e => handleField(key, e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WizardLayout>
  )
}
