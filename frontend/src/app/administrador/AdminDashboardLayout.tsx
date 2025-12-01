import React, { useState } from 'react';
import { Users, Package, MessageSquare, Eye, Pencil, Trash2, EyeOff, Search, Filter, LogOut, LucideIcon } from 'lucide-react';

// --- DEFINICIONES DE TIPOS (Interfaces) ---

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Usuario' | 'Admin';
  status: boolean; // true = Activo, false = Deshabilitado
  reviews: number;
  register: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  status: boolean; // true = Activo, false = Inactivo
  reviews: number;
  rating: number;
  register: string;
}

interface Review {
  id: number;
  user: string;
  product: string;
  brand: string;
  content: string;
  status: boolean; // true = Visible, false = Oculta/Pendiente
  publication: string;
}

interface ActionButtonProps {
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  label: string;
}

// --- 1. COMPONENTES ESTRUCTURALES ---

const AdminHeader: React.FC = () => (
  <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow-lg flex-wrap">
    <div className="flex items-center space-x-4">
      <span className="text-2xl font-extrabold tracking-widest">ECO<span className="text-yellow-300">NET</span></span>
      <h1 className="text-xl font-semibold hidden sm:block">GESTIÓN DE ADMINISTRACIÓN</h1>
    </div>
    <div className="flex space-x-2 text-sm items-center mt-2 sm:mt-0">
      <button className="hover:bg-green-700 p-2 rounded transition hidden md:block">INICIO</button>
      <button className="hover:bg-green-700 p-2 rounded transition hidden md:block">CATÁLOGO</button>
      <button className="hover:bg-green-700 p-2 rounded transition hidden md:block">ADMINISTRAR</button>
      <button className="hover:bg-green-700 p-2 rounded transition hidden sm:block">MI PERFIL</button>
      <button className="hover:bg-red-700 p-2 rounded transition" title="Cerrar Sesión">
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const AdminFooter: React.FC = () => (
  <footer className="bg-green-600 text-white p-4 flex flex-col sm:flex-row justify-between items-center text-sm shadow-inner mt-auto">
    <div className="flex flex-col text-center sm:text-left mb-2 sm:mb-0">
      <span className="font-extrabold tracking-widest">ECO<span className="text-yellow-300">NET</span></span>
      <p className="mt-1 text-xs sm:text-sm">© 2024 Derechos Reservados</p>
    </div>
    <div className="flex space-x-4 text-xs sm:text-sm mb-2 sm:mb-0">
        <span className="hover:underline cursor-pointer">Términos de servicio</span>
        <span className="hover:underline cursor-pointer">Políticas de Privacidad</span>
    </div>
    <button className="bg-white text-green-600 font-bold py-1 px-3 rounded-full hover:bg-gray-100 transition text-sm">
      Volver a Inicio
    </button>
  </footer>
);

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, color, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`p-1 rounded-full hover:shadow-md transition-all duration-200 ${color}`}
    aria-label={label}
    title={label}
  >
    <Icon size={18} />
  </button>
);


// --- 2. VISTAS DE GESTIÓN (GestionUsuarios, GestionProductos, GestionResenas) ---

const GestionUsuarios: React.FC = () => {
  const initialUsers: User[] = [
    { id: 1, name: 'María Quintana', email: 'maria@gmail.com', role: 'Usuario', status: true, reviews: 3, register: '2025-03-10' },
    { id: 2, name: 'Pedro Sanchez', email: 'pedro@gmail.com', role: 'Usuario', status: false, reviews: 2, register: '2025-02-28' },
    { id: 3, name: 'Royer Bizarro', email: 'royer@gmail.com', role: 'Admin', status: true, reviews: 5, register: '2025-01-23' },
  ];
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleUserStatus = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: !user.status } : user
      )
    );
  };

  const deleteUser = (userId: number) => {
    console.log(`Eliminando usuario con ID: ${userId}`);
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const editUser = (userId: number) => {
    console.log(`Editando usuario con ID: ${userId}`);
    // Implementar lógica para abrir un modal de edición (TSX)
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Gestión de Usuarios</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center mb-4 sm:mb-0">
            <Users className="text-gray-600 mr-3" size={32} />
            <div className="text-sm">
                <p className="text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 items-center w-full sm:w-auto max-w-lg">
          <div className="relative flex-grow w-full">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>
          <button className="flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto justify-center">
            <Filter size={18} className="mr-1" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Correo electrónico</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Rol</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registro</th>
              <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-amber-50">
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <img 
                        src={`https://placehold.co/40x40/f0f0f0/808080?text=${user.name.charAt(0)}`} 
                        alt="Avatar" 
                        className="rounded-full mr-3 hidden sm:block" 
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "https://placehold.co/40x40/f0f0f0/808080?text=U" 
                        }}
                    />
                    {user.name}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{user.email}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status ? 'Activo' : 'Deshabilitado'}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{user.register}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {/* Ojo Azul (Deshabilitar/Habilitar) */}
                    <ActionButton 
                      icon={user.status ? EyeOff : Eye} 
                      color="text-sky-600 hover:bg-sky-100"
                      onClick={() => toggleUserStatus(user.id)}
                      label={user.status ? "Deshabilitar Usuario" : "Habilitar Usuario"}
                    />
                    {/* Lápiz Verde (Editar) */}
                    <ActionButton 
                      icon={Pencil} 
                      color="text-green-600 hover:bg-green-100"
                      onClick={() => editUser(user.id)}
                      label="Editar Usuario"
                    />
                    {/* Tacho Rojo (Eliminar) */}
                    <ActionButton 
                      icon={Trash2} 
                      color="text-red-600 hover:bg-red-100"
                      onClick={() => deleteUser(user.id)}
                      label="Eliminar Usuario"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GestionProductos: React.FC = () => {
  const initialProducts: Product[] = [
    { id: 101, name: 'Harina de Cúrcuma', brand: 'Medicorp', status: true, reviews: 124123, rating: 3.3, register: '2025-03-10' },
    { id: 102, name: 'Aceite de Coco Orgánico', brand: 'BioVida', status: false, reviews: 8700, rating: 4.8, register: '2025-01-15' },
    { id: 103, name: 'Té Verde Matcha', brand: 'Zenith', status: true, reviews: 5000, rating: 4.5, register: '2025-02-01' },
  ];
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const toggleProductStatus = (productId: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, status: !product.status } : product
      )
    );
  };

  const deleteProduct = (productId: number) => {
    console.log(`Eliminando producto con ID: ${productId}`);
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  const editProduct = (productId: number) => {
    console.log(`Editando producto con ID: ${productId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Gestión de Productos</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center mb-4 sm:mb-0">
            <Package className="text-gray-600 mr-3" size={32} />
            <div className="text-sm">
                <p className="text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 items-center w-full sm:w-auto max-w-lg">
          <div className="relative flex-grow w-full">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>
          <button className="flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto justify-center">
            <Filter size={18} className="mr-1" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Marca</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Calificación</th>
              <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-amber-50">
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <img 
                      src="https://placehold.co/40x40/f0f0f0/808080?text=P" 
                      alt="Product Icon" 
                      className="rounded-full mr-3 hidden sm:block" 
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = "https://placehold.co/40x40/f0f0f0/808080?text=P" 
                      }}
                    />
                    {product.name}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{product.brand}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{product.rating.toFixed(1)} <span className="text-yellow-500">★</span></td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {/* Ojo Azul (Deshabilitar) */}
                    <ActionButton 
                      icon={product.status ? EyeOff : Eye} 
                      color="text-sky-600 hover:bg-sky-100"
                      onClick={() => toggleProductStatus(product.id)}
                      label={product.status ? "Deshabilitar Producto" : "Habilitar Producto"}
                    />
                    {/* Lápiz Verde (Editar) */}
                    <ActionButton 
                      icon={Pencil} 
                      color="text-green-600 hover:bg-green-100"
                      onClick={() => editProduct(product.id)}
                      label="Editar Producto"
                    />
                    {/* Tacho Rojo (Eliminar) */}
                    <ActionButton 
                      icon={Trash2} 
                      color="text-red-600 hover:bg-red-100"
                      onClick={() => deleteProduct(product.id)}
                      label="Eliminar Producto"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const GestionResenas: React.FC = () => {
  const initialReviews: Review[] = [
    { id: 201, user: 'Andrés Greep', product: 'Maca en polvo', brand: 'Medicorp', content: 'Me gustó mucho, pero el sabor no es tan agradable como esperaba.', status: true, publication: '2025-03-10' },
    { id: 202, user: 'Elena López', product: 'Semillas de Chía', brand: 'Natura', content: 'Excelente calidad y precio! Lo volvería a comprar sin duda.', status: true, publication: '2025-03-05' },
    { id: 203, user: 'Javier Ruiz', product: 'Aceite de Oliva', brand: 'OroVerde', content: 'Parece que lleva mucho tiempo en el almacén. El empaque llegó dañado.', status: false, publication: '2025-02-20' },
  ];
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const toggleReviewStatus = (reviewId: number) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId ? { ...review, status: !review.status } : review
      )
    );
  };

  const deleteReview = (reviewId: number) => {
    console.log(`Eliminando reseña con ID: ${reviewId}`);
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
  };

  const editReview = (reviewId: number) => {
    console.log(`Editando reseña con ID: ${reviewId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Gestión de Reseñas</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center mb-4 sm:mb-0">
            <MessageSquare className="text-gray-600 mr-3" size={32} />
            <div className="text-sm">
                <p className="text-gray-600">Total Reseñas</p>
                <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 items-center w-full sm:w-auto max-w-lg">
          <div className="relative flex-grow w-full">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>
          <button className="flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto justify-center">
            <Filter size={18} className="mr-1" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabla de Reseñas */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Producto</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contenido</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-amber-50">
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.user}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{review.product}</td>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-500 truncate max-w-xs hidden md:table-cell">{review.content}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.status ? 'Visible' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {/* Ojo Azul (Deshabilitar) */}
                    <ActionButton 
                      icon={review.status ? EyeOff : Eye} 
                      color="text-sky-600 hover:bg-sky-100"
                      onClick={() => toggleReviewStatus(review.id)}
                      label={review.status ? "Ocultar Reseña" : "Aprobar Reseña"}
                    />
                    {/* Lápiz Verde (Editar) */}
                    <ActionButton 
                      icon={Pencil} 
                      color="text-green-600 hover:bg-green-100"
                      onClick={() => editReview(review.id)}
                      label="Editar Reseña"
                    />
                    {/* Tacho Rojo (Eliminar) */}
                    <ActionButton 
                      icon={Trash2} 
                      color="text-red-600 hover:bg-red-100"
                      onClick={() => deleteReview(review.id)}
                      label="Eliminar Reseña"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---
const AdminDashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'usuarios' | 'productos' | 'reseñas'>('usuarios'); // Estado tipado para la navegación

  const renderContent = () => {
    switch (activeSection) {
      case 'productos':
        return <GestionProductos />;
      case 'reseñas':
        return <GestionResenas />;
      case 'usuarios':
      default:
        return <GestionUsuarios />;
    }
  };

  interface NavItem {
    id: 'usuarios' | 'productos' | 'reseñas';
    icon: LucideIcon;
    label: string;
  }
  
  const navItems: NavItem[] = [
    { id: 'usuarios', icon: Users, label: 'USUARIOS' },
    { id: 'productos', icon: Package, label: 'PRODUCTOS' },
    { id: 'reseñas', icon: MessageSquare, label: 'RESEÑAS' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <AdminHeader />
      <div className="flex flex-grow w-full max-w-7xl mx-auto border-x border-gray-200 bg-white">
        
        {/* Sidebar de Navegación */}
        <nav className="w-20 sm:w-56 bg-amber-50 p-4 border-r border-gray-200 flex-shrink-0">
          <ul className="space-y-2 mt-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg font-semibold transition duration-150 text-center justify-center sm:justify-start ${
                    activeSection === item.id
                      ? 'bg-white text-green-700 shadow-md border-r-4 border-green-600'
                      : 'text-gray-600 hover:bg-amber-100 hover:text-green-600'
                  }`}
                  title={item.label} // Muestra el label en el tooltip en pantallas pequeñas
                >
                  <item.icon size={20} className="sm:mr-3" />
                  <span className='hidden sm:inline'>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido Principal */}
        <main className="flex-grow bg-white">
          {renderContent()}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminDashboardLayout;