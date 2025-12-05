import React, { useState, useCallback } from 'react';
import { ThumbsUp, DollarSign, Star, Zap, Heart, Meh, Frown, Angry, X, LucideIcon, Pencil, ArrowLeft } from 'lucide-react';

// --- DEFINICIONES DE TIPOS ---

// Definición de datos básicos del producto para el contexto
interface ProductData {
  name: string;
  brand: string;
}

// Tipos para el estado del formulario de calificación
type ProductStatus = 'Lo tengo' | 'Lo tuve' | 'Lo quiero' | null;
type OverallSentiment = 'Lo amo' | 'Me gusta' | 'Ok' | 'No me gusta' | 'Lo odio' | null;
type CriteriaValues = {
  efectividad: number;
  valorPrecio: number;
  facilidadUso: number;
  calidad: number;
};

// --- DATOS DE EJEMPLO (Simplificados) ---
const mockProductData: ProductData = {
  name: "MANZATABS",
  brand: "MACROSALUD",
};

// --- COMPONENTES DE DISEÑO DEL FORMULARIO ---

// Componente para los botones de estado (Lo tengo, Lo tuve, Lo quiero) - Estilo Píldora
const StatusButton: React.FC<{ status: ProductStatus, current: ProductStatus, onClick: (status: ProductStatus) => void }> = ({ status, current, onClick }) => {
  const isSelected = status === current;

  return (
    <button
      onClick={() => onClick(status)}
      className={`flex items-center justify-center h-8 px-4 py-1 rounded-full text-sm font-semibold transition duration-200 border ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-400'
      }`}
    >
      {status}
    </button>
  );
};

// Componente para los botones de sentimiento (Lo amo, Ok, Lo odio, etc.) - Estilo Círculo Simple
const SentimentButton: React.FC<{ sentiment: OverallSentiment, current: OverallSentiment, onClick: (sentiment: OverallSentiment) => void }> = ({ sentiment, current, onClick }) => {
    let Icon: LucideIcon = Meh;
    let colorClass = 'text-gray-500';

    if (sentiment === 'Lo amo') { Icon = Heart; colorClass = 'text-red-500'; }
    else if (sentiment === 'Me gusta') { Icon = Zap; colorClass = 'text-green-500'; }
    else if (sentiment === 'Ok') { Icon = Meh; colorClass = 'text-yellow-500'; }
    else if (sentiment === 'No me gusta') { Icon = Frown; colorClass = 'text-orange-500'; }
    else if (sentiment === 'Lo odio') { Icon = Angry; colorClass = 'text-red-700'; }

    const isSelected = sentiment === current;

    return (
        <button
            onClick={() => onClick(sentiment)}
            title={sentiment || ""}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 transition duration-200 shadow-sm
                ${isSelected
                    ? `border-blue-600 bg-blue-50 scale-105 ring-4 ring-blue-200`
                    : 'border-gray-300 bg-white hover:bg-gray-100'
                }`}
        >
            <Icon size={24} className={colorClass} />
            <span className='text-xs font-medium text-gray-700 mt-1 hidden sm:inline'>{sentiment}</span>
        </button>
    );
};

// Componente del Slider de Criterios con el estilo de icono a la izquierda
interface CriteriaSliderProps {
    label: string;
    icon: LucideIcon;
    value: number;
    onChange: (value: number) => void
}
const CriteriaSlider: React.FC<CriteriaSliderProps> = ({ label, icon: Icon, value, onChange }) => {
    return (
        <div className="flex flex-col p-2 border-b border-gray-100 last:border-b-0">
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                    <Icon size={20} className="text-gray-700" />
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                </div>
                {/* Valor Grande a la derecha */}
                <span className="font-bold text-xl text-blue-700 w-10 text-right">{value.toFixed(1)}</span>
            </div>

            {/* Slider */}
            <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-sm accent-blue-600"
            />
        </div>
    );
};

// Componente que dibuja el mapa corporal (Interactive)
const BodyMap: React.FC<{ affectedZones: string[], onZoneToggle: (zoneId: string) => void }> = ({ affectedZones, onZoneToggle }) => {
  // Coordenadas y etiquetas de ejemplo para el mapa corporal (usando SVG)
  const joints = [
    { id: 'cabeza', label: 'Cabeza', x: 50, y: 10, r: 8, name: 'Cabeza' },
    { id: 'cuello', label: 'Cuello', x: 50, y: 20, r: 6, name: 'Cuello' },
    { id: 'hombro_izquierdo', label: 'Hombro Izq.', x: 30, y: 25, r: 8, name: 'Hombro Izquierdo' },
    { id: 'hombro_derecho', label: 'Hombro Der.', x: 70, y: 25, r: 8, name: 'Hombro Derecho' },
    { id: 'codo_izquierdo', label: 'Codo Izq.', x: 20, y: 40, r: 6, name: 'Codo Izquierdo' },
    { id: 'codo_derecho', label: 'Codo Der.', x: 80, y: 40, r: 6, name: 'Codo Derecho' },
    { id: 'cadera', label: 'Cadera', x: 50, y: 55, r: 10, name: 'Cadera / Pelvis' },
    { id: 'rodilla_izquierda', label: 'Rodilla Izq.', x: 40, y: 75, r: 8, name: 'Rodilla Izquierda' },
    { id: 'rodilla_derecha', label: 'Rodilla Der.', x: 60, y: 75, r: 8, name: 'Rodilla Derecha' },
    { id: 'tobillo_izquierdo', label: 'Tobillo Izq.', x: 40, y: 95, r: 6, name: 'Tobillo Izquierdo' },
    { id: 'tobillo_derecho', label: 'Tobillo Der.', x: 60, y: 95, r: 6, name: 'Tobillo Derecho' },
  ];

  const handleClick = (jointId: string) => {
    onZoneToggle(jointId);
  };

  return (
    <div className="flex flex-col items-center h-full min-h-[400px]">
      <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Selecciona las Zonas Afectadas</h3>
      <div className='p-4 bg-gray-50 rounded-xl w-full flex justify-center items-start'>
          <svg viewBox="0 0 100 100" className="w-48 h-96">
            {/* Cuerpo básico */}
            <rect x="45" y="20" width="10" height="35" fill="#f0d2b2" rx="5" /> {/* Tronco */}
            <circle cx="50" cy="15" r="10" fill="#f0d2b2" /> {/* Cabeza */}
            {/* Brazos (líneas) */}
            <line x1="45" y1="30" x2="35" y2="50" stroke="#f0d2b2" strokeWidth="3" strokeLinecap="round" />
            <line x1="55" y1="30" x2="65" y2="50" stroke="#f0d2b2" strokeWidth="3" strokeLinecap="round" />
            {/* Piernas (líneas) */}
            <line x1="50" y1="55" x2="45" y2="85" stroke="#f0d2b2" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="55" x2="55" y2="85" stroke="#f0d2b2" strokeWidth="3" strokeLinecap="round" />

            {/* Articulaciones marcables */}
            {joints.map(joint => {
              const isAffected = affectedZones.includes(joint.id);

              return (
                <circle
                  key={joint.id}
                  cx={joint.x}
                  cy={joint.y}
                  r={isAffected ? joint.r + 2 : joint.r}
                  fill={isAffected ? '#DC2626' : 'rgba(0,0,0,0.1)'}
                  stroke={isAffected ? '#991B1B' : '#6B7280'}
                  strokeWidth={"1"}
                  className={'transition-all duration-300 cursor-pointer hover:opacity-80'}
                  onClick={() => handleClick(joint.id)}
                />
              );
            })}
          </svg>
      </div>

    </div>
  );
};


// --- VISTA PRINCIPAL (FORMULARIO ÚNICO) ---

const ProductoPopup: React.FC = () => {
  const product = mockProductData;
  const initialCriteria: CriteriaValues = { efectividad: 3.0, valorPrecio: 3.0, facilidadUso: 3.0, calidad: 3.0 };

  const [status, setStatus] = useState<ProductStatus>('Lo tengo');
  const [sentiment, setSentiment] = useState<OverallSentiment>('Me gusta');
  const [criteria, setCriteria] = useState<CriteriaValues>(initialCriteria);
  const [comment, setComment] = useState('');
  const [affectedZones, setAffectedZones] = useState<string[]>([]);

  const handleCriteriaChange = (key: keyof CriteriaValues, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const handleZoneToggle = useCallback((zoneId: string) => {
    setAffectedZones(prev =>
      prev.includes(zoneId)
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  }, []);

  const handleSubmit = () => {
    // Lógica para enviar la reseña (simulada)
    console.log("Enviando Reseña:", {
      productName: product.name,
      brand: product.brand,
      status,
      sentiment,
      criteria,
      comment,
      affectedZones
    });
    alert('¡Gracias por tu calificación! (Simulación de envío)');
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-2 sm:p-4 md:p-8 flex items-start justify-center">

        {/* CONTENEDOR PRINCIPAL DEL FORMULARIO (Se comporta como el popup de la imagen) */}
        <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[98vh] flex flex-col transform transition-all duration-300 border border-gray-200"
        >

            {/* Encabezado del Formulario - Estilo de barra */}
            <div className="bg-blue-600 p-4 rounded-t-xl flex items-center justify-between">
                <div className='flex items-center space-x-3'>
                    <button className="text-white hover:text-blue-200 transition">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-white tracking-wider">
                        CALIFICA ESTE PRODUCTO
                    </h2>
                </div>
                <button title="Cerrar" onClick={() => alert('Cerrar Modal (Simulado)')} className="text-white hover:text-blue-200 transition">
                    <X size={24} />
                </button>
            </div>

            {/* Nombre del Producto y Marca */}
            <div className="text-center p-4">
              <h3 className="text-3xl font-bold text-blue-700">{product.name}</h3>
              <p className="text-lg font-light text-gray-500">{product.brand}</p>
            </div>

            {/* Contenido Principal (Scrollable) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">

                {/* Fila 1: Estado y Sentimiento */}
                <div className="flex flex-col space-y-6 mb-8 p-4 bg-gray-50/50 rounded-xl border border-gray-100">

                    {/* 1. Botones de Estado */}
                    <div className='flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6'>
                      <p className='text-sm font-semibold text-gray-600 mr-4'>ESTADO:</p>
                      {['Lo tengo', 'Lo tuve', 'Lo quiero'].map(s => (
                        <StatusButton
                          key={s}
                          status={s as ProductStatus}
                          current={status}
                          onClick={setStatus}
                        />
                      ))}
                    </div>

                    {/* 2. Selector de Sentimiento */}
                    <div className='flex flex-col justify-center items-center space-y-3'>
                        <p className='text-sm font-semibold text-gray-600'>SENTIMIENTO GENERAL:</p>
                        <div className='flex justify-center space-x-3'>
                            {['Lo amo', 'Me gusta', 'Ok', 'No me gusta', 'Lo odio'].map(s => (
                                <SentimentButton
                                    key={s}
                                    sentiment={s as OverallSentiment}
                                    current={sentiment}
                                    onClick={setSentiment}
                                />
                            ))}
                        </div>
                    </div>
                </div>


                {/* Fila 2: Criterios (Sliders) y Mapa Corporal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">

                    {/* Criterios (Sliders) -> 2/3 de ancho con 2 columnas internas */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                        <h4 className='col-span-full text-xl font-bold text-gray-800 mb-3 border-b pb-2'>Califica Criterios</h4>

                        <CriteriaSlider
                            label="Efectividad"
                            icon={ThumbsUp}
                            value={criteria.efectividad}
                            onChange={(v) => handleCriteriaChange('efectividad', v)}
                        />
                        <CriteriaSlider
                            label="Facilidad de Uso"
                            icon={Zap}
                            value={criteria.facilidadUso}
                            onChange={(v) => handleCriteriaChange('facilidadUso', v)}
                        />
                        <CriteriaSlider
                            label="Precio-Valor"
                            icon={DollarSign}
                            value={criteria.valorPrecio}
                            onChange={(v) => handleCriteriaChange('valorPrecio', v)}
                        />
                        <CriteriaSlider
                            label="Calidad"
                            icon={Star}
                            value={criteria.calidad}
                            onChange={(v) => handleCriteriaChange('calidad', v)}
                        />
                    </div>

                    {/* Mapa Corporal Interactivo -> 1/3 de ancho */}
                    <div className="lg:col-span-1 border border-gray-300 rounded-xl shadow-lg p-4 bg-white">
                        <BodyMap
                            affectedZones={affectedZones}
                            onZoneToggle={handleZoneToggle}
                        />
                    </div>
                </div>

                {/* Campo de Comentario */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <Pencil size={18} className='mr-2 text-blue-600'/>
                    Escribe tu Comentario
                  </h4>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Describe tu experiencia con el producto, qué te gustó o qué se podría mejorar. (Máximo 500 caracteres)"
                    maxLength={500}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
                  ></textarea>
                  <p className='text-right text-sm text-gray-500'>{comment.length}/500</p>
                </div>
            </div>

            {/* Pie de Página del Formulario (Botones Cancelar y Publicar) */}
            <div className="p-4 sm:p-6 flex justify-end border-t border-gray-200 bg-gray-100 rounded-b-xl space-x-4">
              <button
                onClick={() => alert('Cancelar (Simulado)')}
                className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 uppercase"
              >
                Publicar
              </button>
            </div>

        </div>
    </div>
  );
};

export default ProductoPopup;