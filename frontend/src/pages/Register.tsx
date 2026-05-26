import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(nombre, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
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
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Crear cuenta gratis</h1>
          <p className="text-text-secondary text-sm">Empieza a facturar con Verifactu sin pagar nada</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">Nombre</label>
            <input
              className="input-field"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre o empresa"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">Contrasena</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-gold w-full justify-center" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Crear cuenta gratis
              </>
            )}
          </button>

          <p className="text-center text-sm text-text-tertiary">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-accent-gold hover:underline font-medium">
              Inicia sesion
            </Link>
          </p>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-text-tertiary">
            Sin tarjeta de credito. Sin limites. Sin trampas.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
            <span>Hash SHA-256</span>
            <span>Firma RSA</span>
            <span>QR Verifactu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
