# 🌿 Econet API - Backend

Sistema de información de productos naturales similar a Fragrantica, pero enfocado en suplementos y productos naturales.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)

---

## 📝 Descripción

Econet es una plataforma informativa que permite a los usuarios:

- 📦 Ver información detallada de productos naturales
- ⭐ Dejar reseñas y calificaciones
- 🔍 Buscar y filtrar productos
- 🏢 Consultar información de laboratorios
- 📍 Explorar productos por ubicación

---

## 🛠 Tecnologías

### Backend
- **Node.js** (v18+)
- **TypeScript** (v5.3+)
- **Express** - Framework web
- **PostgreSQL** - Base de datos

### Seguridad y Middleware
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT

### Utilidades
- **Morgan** - Logger HTTP
- **Compression** - Compresión de respuestas
- **dotenv** - Variables de entorno

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **PostgreSQL** >= 14.0 ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn**
- **Git**

---

## 📥 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/econet-backend.git
cd econet-backend
```

### 2. Instalar dependencias

```bash
npm install
```

---

## ⚙️ Configuración

### 1. Configurar PostgreSQL

#### Crear la base de datos:

```sql
CREATE DATABASE econet_db;
```

#### Ejecutar el script SQL:

Copia el contenido del archivo `database-schema.sql` (ubicado en `/docs` o solicítalo) y ejecútalo en pgAdmin o desde psql:

```bash
psql -U postgres -d econet_db -f database-schema.sql
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/econet_db

# JWT
JWT_SECRET=genera_una_clave_segura_aqui
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

#### 🔐 Generar JWT_SECRET seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Ejecución

### Modo desarrollo (con hot-reload):

```bash
npm run dev
```

### Compilar TypeScript:

```bash
npm run build
```

### Modo producción:

```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📜 Scripts Disponibles

```json
{
  "dev": "Iniciar servidor en modo desarrollo",
  "build": "Compilar TypeScript a JavaScript",
  "start": "Iniciar servidor en producción"
}
```

### Ejemplos:

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión compilada
npm start
```