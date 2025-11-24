import React, { useState, useCallback } from 'react';
import { Mail, User, Lock, Check } from 'lucide-react'; 

interface FormData {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    confirmarContrasena: string;
    aceptaTerminos: boolean;
    aceptaPoliticas: boolean;
}

const FormInput: React.FC<{
  name: keyof FormData;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, label, type = 'text', placeholder, icon: Icon, value, onChange }) => (
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

const Registro = () => {
  const [formData, setFormData] = useState<FormData>({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    aceptaTerminos: false,
    aceptaPoliticas: false,
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

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!formData.aceptaTerminos || !formData.aceptaPoliticas) {
      setError('Debes aceptar los Términos y Condiciones y las Políticas de Privacidad.');
      return;
    }

    setLoading(true);
    console.log('Datos a enviar:', formData);

    setTimeout(() => {
      setLoading(false);
      setFormData({
        nombres: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        aceptaTerminos: false,
        aceptaPoliticas: false,
      });
      setMessage('¡Registro exitoso! Ya puedes iniciar sesión.');
    }, 2000);
  };

  return (
    <div className="flex h-full min-h-screen font-sans bg-gray-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-white shadow-xl rounded-r-2xl">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-auto mb-6 flex justify-center items-center">
                <span className="text-3xl font-extrabold text-sky-700 border-2 border-sky-700 px-3 py-1 rounded-md tracking-wider shadow-md">
                    ECONET
                </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wider uppercase border-b-2 border-sky-500 inline-block pb-1">
              REGISTRO DE USUARIO
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput name="nombres" label="Nombres" placeholder="Nombres" icon={User} value={formData.nombres} onChange={handleChange} />
            <FormInput name="apellidos" label="Apellidos" placeholder="Apellidos" icon={User} value={formData.apellidos} onChange={handleChange} />
            <FormInput name="correo" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" icon={Mail} value={formData.correo} onChange={handleChange} />
            <FormInput name="contrasena" label="Contraseña" type="password" placeholder="********" icon={Lock} value={formData.contrasena} onChange={handleChange} />
            <FormInput name="confirmarContrasena" label="Confirmar Contraseña" type="password" placeholder="********" icon={Lock} value={formData.confirmarContrasena} onChange={handleChange} />

            <div className="space-y-2 pt-2 text-sm">
              <label className="flex items-center text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition duration-150 ease-in-out ${
                    formData.aceptaTerminos ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'
                  }`}
                >
                  {formData.aceptaTerminos && <Check className="h-3 w-3 text-white" />}
                </span>
                Acepto los <span className="text-sky-600 hover:text-sky-700 ml-1 underline">Términos y Condiciones</span>
              </label>

              <label className="flex items-center text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="aceptaPoliticas"
                  checked={formData.aceptaPoliticas}
                  onChange={handleChange}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition duration-150 ease-in-out ${
                    formData.aceptaPoliticas ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'
                  }`}
                >
                  {formData.aceptaPoliticas && <Check className="h-3 w-3 text-white" />}
                </span>
                Acepto las <span className="text-sky-600 hover:text-sky-700 ml-1 underline">Políticas de privacidad</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.aceptaTerminos || !formData.aceptaPoliticas}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6 transform hover:scale-[1.01]"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Registrar'
              )}
            </button>
          </form>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center border-l-4 border-sky-500 rounded-l-2xl"
        style={{
          backgroundImage: `url('https://placehold.co/1000x800/1E3A8A/FFFFFF?text=Bienvenido+a+ECONET')`,
        }}
        role="img"
        aria-label="Imagen de fondo promocional para el registro de usuario en ECONET"
      >

        <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center">
            <h2 className="text-4xl font-extrabold text-white p-6 rounded-lg shadow-2xl backdrop-blur-sm">
                Tu Farmacia Natural Online
            </h2>
        </div>
      </div>
    </div>
  );
};

export default Registro;