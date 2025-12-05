import React, { useMemo, useState } from 'react';
import { ThumbsUp, DollarSign, Feather, Star, MessageSquare, Tag, Droplet, Target, Shield, Pencil, LucideIcon } from 'lucide-react';

// --- DEFINICIONES DE TIPOS ---

// Definición de las métricas de calificación de cada reseña
interface ReviewMetrics {
  efectividad: number; // 1-5
  valorPrecio: number; // 1-5
  facilidadUso: number; // 1-5
  calidad: number;    // 1-5
}

// Definición de una reseña individual
interface ProductReview extends ReviewMetrics {
  id: number;
  userName: string;
  avatarUrl: string;
  date: string;
  content: string;
}

// Definición del producto y sus características
interface ProductData {
  name: string;
  brand: string;
  imageUrl: string;
  description: string;
  type: string;
  form: string;
  healthGoal: string;
  seals: string[];
  affectedZones: string[]; // Ej: 'rodilla', 'codo', 'espalda'
  reviews: ProductReview[];
}


// --- DATOS DE EJEMPLO ---
const mockProductData: ProductData = {
  name: "MANZATABS",
  brand: "MACROSALUD",
  imageUrl: "https://placehold.co/300x350/e0f0d5/006400?text=ManzaTabs+Image",
  description: "La manzanilla es una de las plantas medicinales más utilizadas en el mundo. Se consume principalmente en infusión y se le atribuyen múltiples beneficios. Es considerada segura para la mayoría de las personas y representa un ejemplo de cómo la medicina natural combina tradición y efectividad comprobada.",
  type: "Planta Medicinal",
  form: "Tableta",
  healthGoal: "Calmante",
  seals: ["Sello Orgánico", "Sin Gluten"],
  affectedZones: ['cuello', 'hombro_izquierdo', 'codo_derecho', 'cadera', 'rodilla_derecha', 'tobillo_izquierdo'],
  reviews: [
    { id: 1, userName: 'Pepe Luján', avatarUrl: 'https://placehold.co/40x40/f0f0f0/808080?text=P', date: '2025-10-20', content: 'Me gustó mucho esta planta medicinal. Tenía dolor de cabeza y funcionó como un calmante. Lo recomiendo mucho.', efectividad: 4.2, valorPrecio: 4.1, facilidadUso: 3.2, calidad: 4.3 },
    { id: 2, userName: 'Jessica Gutierrez', avatarUrl: 'https://placehold.co/40x40/f0f0f0/808080?text=J', date: '2025-10-19', content: 'La uso cuando tengo molestias estomacales o nervios. Además de calmar el malestar, me deja una sensación de tranquilidad.', efectividad: 4.2, valorPrecio: 4.2, facilidadUso: 4.2, calidad: 4.5 },
    { id: 3, userName: 'Pedro Sanchez', avatarUrl: 'https://placehold.co/40x40/f0f0f0/808080?text=P', date: '2025-09-10', content: 'Me sorprendió lo rápido que actuó. Tenía un fuerte dolor de cabeza por tensión y con una taza de manzanilla caliente se me pasó en poco tiempo. Es ideal para relajarse.', efectividad: 4.2, valorPrecio: 3.9, facilidadUso: 4.2, calidad: 3.9 },
    // Añadir más reseñas para un mejor promedio
    { id: 4, userName: 'Ana Gómez', avatarUrl: 'https://placehold.co/40x40/f0f0f0/808080?text=A', date: '2025-08-01', content: 'Funciona bien para el insomnio ocasional, muy natural.', efectividad: 4.5, valorPrecio: 4.0, facilidadUso: 4.5, calidad: 4.6 },
  ]
};

// --- UTILIDADES ---

// Hook para calcular el promedio de las métricas
const useReviewAverages = (reviews: ProductReview[]) => {
  return useMemo(() => {
    if (reviews.length === 0) {
      return { efectividad: 0, valorPrecio: 0, facilidadUso: 0, calidad: 0 };
    }
    
    const sum = reviews.reduce((acc, review) => ({
      efectividad: acc.efectividad + review.efectividad,
      valorPrecio: acc.valorPrecio + review.valorPrecio,
      facilidadUso: acc.facilidadUso + review.facilidadUso,
      calidad: acc.calidad + review.calidad,
    }), { efectividad: 0, valorPrecio: 0, facilidadUso: 0, calidad: 0 });

    const count = reviews.length;

    return {
      efectividad: parseFloat((sum.efectividad / count).toFixed(1)),
      valorPrecio: parseFloat((sum.valorPrecio / count).toFixed(1)),
      facilidadUso: parseFloat((sum.facilidadUso / count).toFixed(1)),
      calidad: parseFloat((sum.calidad / count).toFixed(1)),
    };
  }, [reviews]);
};


// --- COMPONENTES DE VISTA ESPECÍFICOS ---

// Componente para el promedio de un solo criterio
interface CriterionBarProps {
  icon: LucideIcon;
  label: string;
  value: number;
}
const CriterionBar: React.FC<CriterionBarProps> = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl shadow-md border border-green-200 transition duration-300 hover:bg-green-50/50">
    <Icon size={24} className="text-green-600 mb-1" />
    <span className="text-xs font-medium text-gray-500 text-center mb-1">{label}</span>
    <div className="flex items-baseline">
        <span className="text-xl font-bold text-gray-800">{value.toFixed(1)}</span>
        <span className="text-sm font-light text-yellow-500 ml-0.5">/5</span>
    </div>
  </div>
);


// Componente que dibuja el mapa corporal (Mejorado con interactividad)
const BodyMap: React.FC<{ affectedZones: string[] }> = ({ affectedZones }) => {
  // Estado para rastrear la zona sobre la que se pasa el cursor
  const [hoveredJoint, setHoveredJoint] = useState<string | null>(null);

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

  const currentJointName = joints.find(j => j.id === hoveredJoint)?.name || 'Pasa el cursor sobre una articulación';

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-xl border border-gray-100 h-full min-h-[400px]">
      <h3 className="text-xl font-bold text-green-700 mb-3">Zona(s) de Acción</h3>
      
      {/* Indicador de articulación seleccionada/hover */}
      <div className="h-6 text-center text-base font-semibold text-gray-800 transition duration-150 mb-4">
          {currentJointName}
      </div>

      <svg viewBox="0 0 100 100" className="w-40 h-80">
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
          const isHovered = hoveredJoint === joint.id;
          
          return (
            <circle
              key={joint.id}
              cx={joint.x}
              cy={joint.y}
              r={isAffected || isHovered ? joint.r + 2 : joint.r} // Ligeramente más grande si está afectada o en hover
              fill={isAffected ? '#DC2626' : 'rgba(0,0,0,0.1)'}
              stroke={isAffected ? '#991B1B' : '#6B7280'}
              strokeWidth={isHovered ? "2" : "1"}
              className="cursor-pointer transition-all duration-300"
              // Eliminado: title={joint.name} para resolver el error de tipado
              onMouseEnter={() => setHoveredJoint(joint.id)} // Guarda el ID para el estado
              onMouseLeave={() => setHoveredJoint(null)}
            />
          );
        })}
      </svg>
      <div className="flex mt-4 text-sm text-gray-600">
        <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2 my-auto"></span>
        <span className='font-semibold'>Zonas de Acción Marcadas</span>
      </div>
    </div>
  );
};


// Componente para renderizar una reseña individual
const ReviewCard: React.FC<{ review: ProductReview }> = ({ review }) => (
  // El ancho completo se maneja en el componente padre con 'space-y-6'
  <div className="border border-gray-200 p-5 rounded-xl bg-white shadow-lg hover:shadow-xl transition duration-200">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center">
        <img 
          src={review.avatarUrl} 
          alt={review.userName} 
          className="w-12 h-12 rounded-full mr-4 border-2 border-green-400 object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = `https://placehold.co/48x48/f0f0f0/808080?text=${review.userName.charAt(0)}`; 
          }}
        />
        <div>
          <p className="font-bold text-lg text-gray-900">{review.userName}</p>
          <p className="text-xs text-gray-500">{review.date}</p>
        </div>
      </div>
      <div className="flex items-center text-xl font-extrabold text-yellow-600">
        <Star size={20} className="mr-1" fill="#FBBF24" stroke="#FBBF24" />
        {((review.efectividad + review.valorPrecio + review.facilidadUso + review.calidad) / 4).toFixed(1)}
      </div>
    </div>
    
    <p className="text-gray-700 leading-relaxed mb-4 italic border-l-4 border-green-500 pl-4 text-base">{review.content}</p>
    
    {/* Métricas de la reseña */}
    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 pt-3 border-t border-gray-100">
      <p>Efectividad: <span className="font-bold text-green-700">{review.efectividad.toFixed(1)}</span></p>
      <p>Valor-Precio: <span className="font-bold text-green-700">{review.valorPrecio.toFixed(1)}</span></p>
      <p>Uso: <span className="font-bold text-green-700">{review.facilidadUso.toFixed(1)}</span></p>
      <p>Calidad: <span className="font-bold text-green-700">{review.calidad.toFixed(1)}</span></p>
    </div>
  </div>
);


// --- COMPONENTE PRINCIPAL ---
const ProductoVista: React.FC = () => {
  const product = mockProductData;
  const averages = useReviewAverages(product.reviews);
  
  // Promedio general
  const globalAverage = (averages.efectividad + averages.valorPrecio + averages.facilidadUso + averages.calidad) / 4;

  const handleReviewClick = () => {
    // Aquí se debe implementar la lógica para abrir el formulario o modal de calificación.
    console.log("Abrir modal para calificar el producto.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      
      {/* Encabezado del Producto */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b-2 border-green-300">
        <div className='mb-3 md:mb-0'>
            <h1 className="text-4xl font-extrabold text-green-800 uppercase leading-tight">{product.name}</h1>
            <span className="text-xl font-light text-gray-600">{product.brand}</span>
        </div>
        <div className="flex items-center bg-green-100 border border-green-300 px-4 py-2 rounded-full shadow-md">
            <Star size={20} className="mr-2 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-green-800">{globalAverage.toFixed(1)}</span>
            <span className="text-sm text-gray-600 ml-2">({product.reviews.length} Reseñas)</span>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL: Imagen, Descripción y Zonas Afectadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Columna 1: Imagen, Criterios (Promedios) y BOTÓN DE CALIFICACIÓN */}
        <div className="lg:col-span-1 flex flex-col items-center space-y-8">
          {/* Imagen */}
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
            <img 
              src={product.imageUrl} 
              alt={`Imagen de ${product.name}`} 
              className="w-full h-auto object-contain rounded-lg shadow-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "https://placehold.co/300x350/e0f0d5/006400?text=Imagen+No+Disponible"; 
              }}
            />
          </div>

          {/* Criterios (Promedios de Reseñas) */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-3 p-5 bg-green-50 rounded-2xl shadow-inner border border-green-200">
            <h3 className='col-span-2 text-lg font-bold text-green-700 mb-1 text-center'>Criterios Promediados</h3>
            <CriterionBar icon={ThumbsUp} label="Efectividad" value={averages.efectividad} />
            <CriterionBar icon={DollarSign} label="Valor-Precio" value={averages.valorPrecio} />
            <CriterionBar icon={Feather} label="Facilidad de Uso" value={averages.facilidadUso} />
            <CriterionBar icon={Star} label="Calidad" value={averages.calidad} />
          </div>

          {/* NUEVA POSICIÓN DEL BOTÓN: Debajo de Criterios Promediados */}
          <div className="w-full max-w-sm flex flex-col items-stretch bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <button
                  onClick={handleReviewClick}
                  className="flex items-center justify-center p-4 bg-yellow-500 text-white font-bold rounded-xl text-lg shadow-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                  <Pencil size={24} className="mr-2" />
                  Califica este producto
              </button>
          </div>
          {/* FIN DEL BOTÓN */}
        </div>

        {/* Columna 2 & 3: Descripción, Detalles y Mapa Corporal */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          
          {/* Descripción del Producto */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-green-700 mb-3 border-b pb-2">Acerca de {product.name}</h2>
            <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
          </div>

          {/* Detalles Técnicos y Sellos */}
          <div className="bg-green-100 p-6 rounded-2xl shadow-xl border border-green-300">
            <h2 className="text-xl font-bold text-green-800 mb-4">Detalles y Especificaciones</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-xs font-semibold text-green-600 uppercase">Tipo de Producto</span>
                  <div className="flex items-center text-sm font-medium text-gray-800 mt-1"><Tag size={16} className="mr-1 text-green-500" /> {product.type}</div>
                </div>
                <div className="flex flex-col p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-xs font-semibold text-green-600 uppercase">Forma Farmacéutica</span>
                  <div className="flex items-center text-sm font-medium text-gray-800 mt-1"><Droplet size={16} className="mr-1 text-green-500" /> {product.form}</div>
                </div>
                <div className="flex flex-col p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-xs font-semibold text-green-600 uppercase">Objetivo de Salud</span>
                  <div className="flex items-center text-sm font-medium text-gray-800 mt-1"><Target size={16} className="mr-1 text-green-500" /> {product.healthGoal}</div>
                </div>
                <div className="flex flex-col p-2 bg-white rounded-lg shadow-sm md:col-span-1">
                  <span className="text-xs font-semibold text-green-600 uppercase">Sellos y Certificaciones</span>
                  <div className="flex items-center text-sm font-medium text-gray-800 mt-1 space-x-2">
                    {product.seals.map((seal, index) => (
                      <span key={index} className="flex items-center px-2 py-0.5 bg-yellow-100 rounded-full text-xs font-medium">
                        <Shield size={12} className="mr-1 text-yellow-600" />
                        {seal}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
          </div>
          
          {/* Zonas Afectadas (Mapa Corporal) - Ahora ocupa el espacio inferior completamente */}
          <div className="flex-1">
              {/* Mapa Corporal Interactivo */}
              <BodyMap affectedZones={product.affectedZones} />
          </div>
        </div>

      </div>

      {/* SECCIÓN DE RESEÑAS */}
      <div className="mt-12 p-6 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center">
            <MessageSquare size={30} className="mr-3 text-green-600" />
            Opiniones de la Comunidad ({product.reviews.length})
        </h2>
        
        {/* Reseñas en rectángulos de lado a lado (Single-column layout) */}
        <div className="space-y-6">
          {product.reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {product.reviews.length === 0 && (
            <div className="text-center p-10 bg-gray-50 rounded-xl shadow-inner text-gray-500 border border-gray-200">
                Aún no hay reseñas para este producto. ¡Sé el primero en calificar y ayuda a otros!
            </div>
        )}
      </div>

    </div>
  );
};

export default ProductoVista;