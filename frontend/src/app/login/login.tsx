import React, { useState, useCallback } from 'react';
import { Mail, Lock, Check } from 'lucide-react';
import { Link, BrowserRouter } from 'react-router-dom';

interface LoginFormState {
    correo: string;
    contrasena: string;
    recordarContrasena: boolean;
}

const FormInput: React.FC<{
  name: keyof LoginFormState;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, label, type, placeholder, icon: Icon, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400 text-sm transition duration-150 ease-in-out"
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  </div>
);


const Login = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    correo: '',
    contrasena: '',
    recordarContrasena: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.correo || !formData.contrasena) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    console.log('Intentando iniciar sesión con:', formData);

    setTimeout(() => {
      setLoading(false);
      
      if (formData.correo === 'test@econet.com' && formData.contrasena === 'password') {
        setMessage('¡Inicio de sesión exitoso!');
        setError('');
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
        setMessage('');
      }
    }, 2000);
  };

  return (
    <div className="flex h-full min-h-screen font-sans bg-gray-50">
      
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://placehold.co/1000x800/F5E6E6/222222?text=Productos+ECONET')`,
        }}
        role="img"
        aria-label="Productos naturales de ECONET con fondo rosa y flores"
      >
        <div className="h-full w-full bg-black bg-opacity-5"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-white shadow-xl rounded-l-2xl">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">

            <div className="mx-auto h-12 w-auto mb-6 flex justify-center items-center">
                <span className="text-4xl font-extrabold text-black tracking-wider">
                    ECO<span className="text-sky-700">NET</span>
                </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wider">
              INICIAR SESIÓN
            </h1>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-inner" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg shadow-inner" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput 
                name="correo" 
                label="Correo Electrónico" 
                type="email" 
                placeholder="Correo Electrónico" 
                icon={Mail} 
                value={formData.correo} 
                onChange={handleChange} 
            />
            <FormInput 
                name="contrasena" 
                label="Contraseña" 
                type="password" 
                placeholder="********" 
                icon={Lock} 
                value={formData.contrasena} 
                onChange={handleChange} 
            />

            <div className="flex justify-between items-center text-sm">
                <label className="flex items-center text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="recordarContrasena"
                      checked={formData.recordarContrasena}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span
                      className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition duration-150 ease-in-out ${
                        formData.recordarContrasena ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'
                      }`}
                    >
                      {formData.recordarContrasena && <Check className="h-3 w-3 text-white" />}
                    </span>
                    Recordar contraseña
                </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.01]"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="text-center mt-6 text-sm space-y-2">
            <Link to="/olvidar-contrasena" className="text-sky-600 hover:text-sky-700 font-medium underline block">
                ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-gray-600">
                ¿No tienes una cuenta? {' '}
                <Link to="/registro" className="text-sky-600 hover:text-sky-700 font-medium underline">
                    Regístrate
                </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;