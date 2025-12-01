import React, { useState, useCallback } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

interface ChangePasswordFormState {
    correo: string;
    nuevaContrasena: string;
    confirmarNuevaContrasena: string;
}

const FormInput: React.FC<{
  name: keyof ChangePasswordFormState;
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


const CambiarContrasena = () => {
  const [formData, setFormData] = useState<ChangePasswordFormState>({
    correo: '',
    nuevaContrasena: '',
    confirmarNuevaContrasena: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.correo || !formData.nuevaContrasena || !formData.confirmarNuevaContrasena) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (formData.nuevaContrasena !== formData.confirmarNuevaContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.nuevaContrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    console.log('Intentando cambiar contraseña para:', formData.correo);

    setTimeout(() => {
      setLoading(false);
      if (formData.correo === 'test@econet.com') {
        setMessage('¡Contraseña cambiada exitosamente!');
        setError('');
      } else {
        setError('El correo electrónico no está registrado.');
        setMessage('');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-green-500 flex flex-col items-center justify-center p-4">
      
      {/* Logo ECONET en la parte superior, como en la imagen */}
      <div className="mb-8 mt-4">
        <span className="text-5xl font-extrabold text-white tracking-wider">
          ECO<span className="text-black">NET</span>
        </span>
      </div>

      {/* Tarjeta del formulario de cambio de contraseña */}
      <div className="relative bg-amber-50 rounded-lg shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md">
        
        {/* Botón Regresar - Usando botón nativo para evitar el error de contexto */}
        <button 
          type="button"
          onClick={() => window.history.back()} // Navega hacia atrás en el historial
          className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out text-sm flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Regresar</span>
        </button>

        <div className="text-center mb-8 mt-10"> {/* Añadido mt-10 para espacio con el botón regresar */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wider">
            CAMBIO DE CONTRASEÑA
          </h1>
        </div>

        {/* Mensajes de feedback */}
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
              name="nuevaContrasena" 
              label="Cambiar contraseña" 
              type="password" 
              placeholder="********" 
              icon={Lock} 
              value={formData.nuevaContrasena} 
              onChange={handleChange} 
          />
          <FormInput 
              name="confirmarNuevaContrasena" 
              label="Confirmar cambio de contraseña" 
              type="password" 
              placeholder="********" 
              icon={Lock} 
              value={formData.confirmarNuevaContrasena} 
              onChange={handleChange} 
          />

          {/* Botón Aceptar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6 transform hover:scale-[1.01]"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Aceptar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasena;