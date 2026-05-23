import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from './authApi';
import { useAppDispatch } from '../../app/store';
import { setCredentials } from './authSlice';
import { API_BASE } from '../../shared/utils/constants';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const [login, { isLoading: loadingLogin }] = useLoginMutation();
  const [register, { isLoading: loadingReg }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Google OAuth redirect: ?token=xxx&email=xxx&nombre=xxx&rol=xxx
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(setCredentials({
        token,
        tipo: 'Bearer',
        email: searchParams.get('email') || '',
        nombre: searchParams.get('nombre') || '',
        rol: searchParams.get('rol') || 'CLIENTE',
      }));
      navigate('/', { replace: true });
    }
  }, [searchParams, dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = isRegister
        ? await register({ nombre, email, password }).unwrap()
        : await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      setError(err?.data?.mensaje || 'Error al autenticar');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {isRegister && (
          <input
            type="text" placeholder="Nombre" value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded px-3 py-2" required
          />
        )}

        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2" required
        />

        <input
          type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2" required minLength={6}
        />

        <button type="submit" disabled={loadingLogin || loadingReg}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50">
          {isRegister ? 'Registrarse' : 'Ingresar'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">o</span></div>
        </div>

        <a
          href={(API_BASE || 'http://localhost:8080') + '/oauth2/authorization/google'}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </a>

        <p className="text-center text-sm text-gray-500">
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button type="button" onClick={() => setIsRegister(!isRegister)}
            className="text-purple-600 hover:underline">
            {isRegister ? 'Iniciá sesión' : 'Registrate'}
          </button>
        </p>
      </form>
    </div>
  );
}
