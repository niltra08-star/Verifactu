import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, PlusCircle, Github, Coffee, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/facturas', icon: FileText, label: 'Facturas' },
  { to: '/facturas/nueva', icon: PlusCircle, label: 'Nueva factura' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-bg-primary border-r border-white/6 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-[0_0_12px_rgba(200,148,62,0.15)]" />
            <span className="text-xl font-extrabold tracking-tight">FacturaIA</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-gold/10 text-accent-gold-light'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`
                }
                end={item.to !== '/facturas'}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/6">
          {user && (
            <div className="p-6 pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-xs font-bold text-accent-gold-light">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.nombre}</div>
                  <div className="text-xs text-text-tertiary truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-tertiary hover:text-text-secondary hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesion
              </button>
            </div>
          )}

          <div className="p-6 pt-3">
            <a
              href="https://github.com/facturaia"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 text-xs text-text-tertiary hover:text-text-secondary transition-colors mb-3"
            >
              <Github size={14} />
              Open Source (MIT)
            </a>
            <a
              href="https://ko-fi.com/facturaia"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 text-xs text-accent-gold/70 hover:text-accent-gold transition-colors"
            >
              <Coffee size={14} />
              Apoyar con un cafe
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-bg-deep">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
