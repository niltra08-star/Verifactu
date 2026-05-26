import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  usuarioId: number;
  nombre: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = '/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('facturaia_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem('facturaia_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error de conexion' }));
      throw new Error(err.error || 'Error al iniciar sesion');
    }

    const data = await res.json();
    const userData: User = {
      usuarioId: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
      token: data.token,
    };

    localStorage.setItem('facturaia_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (nombre: string, email: string, password: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error de conexion' }));
      throw new Error(err.error || 'Error al registrarse');
    }

    const data = await res.json();
    const userData: User = {
      usuarioId: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
      token: data.token,
    };

    localStorage.setItem('facturaia_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('facturaia_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
