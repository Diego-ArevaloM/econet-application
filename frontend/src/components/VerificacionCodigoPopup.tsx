import React, { useState, useRef, createRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react'; // Icono para cerrar

// Definición de tipos para las propiedades del componente
interface VerificacionCodigoPopupProps {
  isOpen: boolean; // Controla si el pop-up está visible
  onClose: () => void; // Función para cerrar el pop-up
  targetEmail: string; // El correo electrónico al que se envió el código
}

// Número de dígitos esperado para el código de verificación
const CODE_LENGTH = 5;

const VerificacionCodigoPopup: React.FC<VerificacionCodigoPopupProps> = ({ isOpen, onClose, targetEmail }) => {
  // Estado para almacenar los 5 dígitos del código
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Referencias para cada input (para manejar el foco)
  // FIX: Se cambió el tipo genérico de useRef a React.RefObject<HTMLInputElement | null>[]
  // para resolver el error de sobrecarga de TypeScript, ya que .current puede ser null.
  const inputRefs = useRef<React.RefObject<HTMLInputElement | null>[]>(
    Array(CODE_LENGTH).fill(0).map(() => createRef<HTMLInputElement>())
  );

  // Efecto para limpiar el estado al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setCode(Array(CODE_LENGTH).fill(''));
      setError('');
      setMessage('');
      // Enfocar el primer input al abrir el modal
      setTimeout(() => {
        // Asegurarse de que el ref existe antes de intentar enfocar
        if (inputRefs.current[0].current) {
          inputRefs.current[0].current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Maneja el cambio de input en un campo individual
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newCode = [...code];

    // Solo acepta el primer carácter y debe ser un dígito
    if (/^\d?$/.test(value)) {
      newCode[index] = value;
      setCode(newCode);

      // Mueve el foco al siguiente input si se ingresó un dígito
      if (value !== '' && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1].current?.focus();
      }
    }
  };

  // Maneja el borrado (Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      // Si el campo está vacío, mueve el foco al anterior y borra su valor
      inputRefs.current[index - 1].current?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  // Maneja el pegado (paste)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, CODE_LENGTH);

    if (digits.length > 0) {
      const newCode = Array(CODE_LENGTH).fill('');
      digits.forEach((digit, i) => {
        if (i < CODE_LENGTH) {
          newCode[i] = digit;
        }
      });
      setCode(newCode);

      // Enfoca el último campo rellenado o el último campo disponible
      const focusIndex = Math.min(digits.length, CODE_LENGTH) - 1;
      if (focusIndex >= 0) {
          inputRefs.current[focusIndex].current?.focus();
      }
    }
  };


  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const fullCode = code.join('');

    if (fullCode.length !== CODE_LENGTH) {
      setError('Por favor, ingresa el código de 5 dígitos completo.');
      return;
    }

    setLoading(true);

    // Simulación de verificación API
    setTimeout(() => {
      setLoading(false);
      if (fullCode === '12345') { // Código de prueba
        setMessage('¡Código verificado exitosamente!');
        // Aquí se llamaría a la función para continuar con el cambio de contraseña
        setTimeout(() => onClose(), 1500);
      } else {
        setError('Código incorrecto. Por favor, intenta de nuevo.');
        setCode(Array(CODE_LENGTH).fill('')); // Limpiar los inputs
        inputRefs.current[0].current?.focus(); // Enfocar el primer input
      }
    }, 1500);
  };

  return (
    // Overlay oscuro (fondo del modal)
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      
      {/* Contenedor del pop-up */}
      <div className="bg-amber-50 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative">
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        {/* Logo ECONET */}
        <div className="text-center mb-6">
          <span className="text-3xl font-extrabold text-black tracking-widest">
            ECO<span className="text-green-500">NET</span>
          </span>
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6 border-b-2 border-green-500 pb-2">
          CÓDIGO DE VERIFICACIÓN
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-4 text-sm">
          Se ha enviado un código de verificación de <span className="font-bold">5 dígitos</span> al siguiente correo electrónico:
        </p>
        <p className="text-green-700 font-bold text-md text-center mb-8 truncate">
          {targetEmail}
        </p>

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
          {/* Campos de entrada del código */}
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={inputRefs.current[index] as React.RefObject<HTMLInputElement>} // Casteo para usar en ref prop
                disabled={loading}
                className="w-12 h-14 text-center text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600 shadow-md transition duration-150 bg-white disabled:bg-gray-100"
                style={{ caretColor: 'transparent' }} // Ocultar el cursor para una mejor experiencia de OTP
                inputMode="numeric"
                pattern="\d{1}"
              />
            ))}
          </div>

          {/* Botón de verificación */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6 transform hover:scale-[1.01]"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Verificar código'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificacionCodigoPopup;