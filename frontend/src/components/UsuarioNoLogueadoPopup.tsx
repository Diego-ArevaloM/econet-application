import React from 'react';
import { Info, X } from 'lucide-react'; // Icono de información y de cerrar
import { Link } from 'react-router-dom'; // Para navegar a Iniciar Sesión o Registrarse

interface UsuarioNoLogueadoPopupProps {
  isOpen: boolean; // Controla si el pop-up está visible
  onClose: () => void; // Función para cerrar el pop-up
}

const UsuarioNoLogueadoPopup: React.FC<UsuarioNoLogueadoPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null; // Si no está abierto, no renderiza nada
  }

  return (
    // Overlay oscuro para el fondo del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      
      {/* Contenedor principal del pop-up */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center relative transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Botón de cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        {/* Icono de información */}
        <div className="flex justify-center mb-6">
          <div className="bg-sky-100 text-sky-600 rounded-full p-4">
            <Info size={48} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Únete a Econet!
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 leading-relaxed mb-6 px-4">
          Para poder dejar tu reseña sobre ciertos productos, debes unirte a la comunidad de EcoNet. 
          De esta manera, podrás desbloquear todas las funcionalidades que son para miembros de este sitio web.
        </p>
        <p className="text-gray-500 italic text-sm mb-8">
          Mientras mas gorda, mejor la chpa - Pitágoras
        </p>

        {/* Contenedor de botones */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/login">
            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/registro">
            <button className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsuarioNoLogueadoPopup;