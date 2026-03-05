import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const STEPS = [
  { label: 'Mentalidad', path: '/crear/mentalidad' },
  { label: 'Insumos', path: '/crear/insumos' },
  { label: 'Big Think', path: '/crear/big-think' },
  { label: 'Temas', path: '/crear/temas' },
  { label: 'Objetivos', path: '/crear/objetivos' },
  { label: 'Key Results', path: '/crear/resultados-clave' },
  { label: 'Comportamiento', path: '/crear/comportamiento' },
  { label: 'Resumen', path: '/crear/resumen' },
]

export default function WizardLayout({ currentStep, children, title, subtitle }) {
  const navigate = useNavigate()
  const progress = ((currentStep) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* Header */}
      <header className="bg-navy px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-white text-sm font-semibold">
            Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1]?.label}
          </h2>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-white/20 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-white/60 text-xs">{Math.round(progress)}%</span>
      </header>

      {/* Step indicators */}
      <div className="bg-white border-b border-border px-8 py-3 flex gap-2 overflow-x-auto">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-3 py-1 rounded-full ${
              i + 1 === currentStep
                ? 'bg-primary text-white'
                : i + 1 < currentStep
                ? 'bg-neon/20 text-navy'
                : 'bg-disabled text-text-secondary'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">
              {i + 1 < currentStep ? '✓' : i + 1}
            </span>
            {step.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy mb-2">{title}</h1>
              {subtitle && <p className="text-text-secondary">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
