import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-[0_0_12px_rgba(200,148,62,0.15)]" />
            <span className="text-xl font-extrabold tracking-tight">FacturaIA</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Iniciar sesion</h1>
          <p className="text-text-secondary text-sm">Accede a tu panel de facturacion Verifactu</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">Contrasena</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-gold w-full justify-center" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Entrar
              </>
            )}
          </button>

          <p className="text-center text-sm text-text-tertiary">
            No tienes cuenta?{' '}
            <Link to="/register" className="text-accent-gold hover:underline font-medium">
              Registrate gratis
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-text-tertiary mt-6">
          100% gratuito. Open source. Sin limites.
        </p>
      </div>
    </div>
  );
}
