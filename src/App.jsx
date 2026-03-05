import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Landing from './pages/Landing'
import Step1Mentalidad from './pages/wizard/Step1Mentalidad'
import Step2Insumos from './pages/wizard/Step2Insumos'
import Step3BigThink from './pages/wizard/Step3BigThink'
import Step4Temas from './pages/wizard/Step4Temas'
import Step5Objetivos from './pages/wizard/Step5Objetivos'
import Step6ResultadosClave from './pages/wizard/Step6ResultadosClave'
import Step7Comportamiento from './pages/wizard/Step7Comportamiento'
import Step8Resumen from './pages/wizard/Step8Resumen'
import Dashboard from './pages/Dashboard'
import Tracking from './pages/Tracking'
import Coach from './pages/Coach'
import Revision from './pages/Revision'
import ParkingLot from './pages/ParkingLot'
import Config from './pages/Config'
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/crear/mentalidad" element={<Step1Mentalidad />} />
          <Route path="/crear/insumos" element={<Step2Insumos />} />
          <Route path="/crear/big-think" element={<Step3BigThink />} />
          <Route path="/crear/temas" element={<Step4Temas />} />
          <Route path="/crear/objetivos" element={<Step5Objetivos />} />
          <Route path="/crear/resultados-clave" element={<Step6ResultadosClave />} />
          <Route path="/crear/comportamiento" element={<Step7Comportamiento />} />
          <Route path="/crear/resumen" element={<Step8Resumen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/parking-lot" element={<ParkingLot />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
