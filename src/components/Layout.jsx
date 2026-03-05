import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Target, MessageCircle, RotateCcw, Lightbulb, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracking', icon: Target, label: 'Tracking' },
  { to: '/coach', icon: MessageCircle, label: 'Coach IA' },
  { to: '/revision', icon: RotateCcw, label: 'Revisión' },
  { to: '/parking-lot', icon: Lightbulb, label: 'Parking Lot' },
  { to: '/config', icon: Settings, label: 'Config' },
]

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-bg-main">
      {/* Sidebar */}
      <aside className="w-60 bg-navy flex flex-col py-6 px-4 fixed top-0 left-0 h-full z-10">
        <div className="mb-8 px-2">
          <h1 className="text-white text-xl font-bold tracking-wide">TWY OKRs</h1>
          <p className="text-primary text-xs mt-1">Think With You</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 pt-4 border-t border-white/10">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            + Nuevo Ciclo OKR
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
