# App de Gestión de Usuarios - React Native

Aplicación móvil moderna desarrollada con React Native y Expo que integra el API Gateway para gestión de usuarios.

## 🚀 Características

- ✅ Lista de usuarios con paginación
- ✅ Visualización de detalles de usuario
- ✅ Creación de nuevos usuarios
- ✅ Edición de usuarios existentes
- ✅ Eliminación de usuarios (soft delete)
- ✅ Interfaz moderna y profesional
- ✅ Validación de formularios
- ✅ Manejo de errores y estados de carga
- ✅ Navegación fluida con React Navigation

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- API Gateway en ejecución (ubicado en `D:\Users\darwin\Documents\GitHub\ITS\W\apiGateway`)

## 🔧 Instalación

1. **Clonar o ubicarse en el directorio del proyecto:**
```bash
cd D:\Users\darwin\Documents\GitHub\ITS\W\front_react
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar la URL del API:**

Edita el archivo `src/constants/api.constants.ts` y actualiza la URL base del API:

```typescript
export const API_BASE_URL = 'http://tu-ip:5000/api/v1';
```

**Importante:** 
- Si pruebas en un dispositivo físico, usa la IP de tu computadora (ej: `http://192.168.1.100:5000/api/v1`)
- Si pruebas en el emulador de Android, usa `http://10.0.2.2:5000/api/v1`
- Si pruebas en iOS Simulator, usa `http://localhost:5000/api/v1`

## 🎮 Ejecutar la Aplicación

### 1. Iniciar el API Gateway

Primero, asegúrate de que tu API Gateway esté corriendo:

```bash
cd D:\Users\darwin\Documents\GitHub\ITS\W\apiGateway
npm run start:dev
```

### 2. Iniciar la aplicación React Native

```bash
npm start
```

Esto abrirá Expo Dev Tools en tu navegador. Desde ahí puedes:

- **Presionar 'w'** para abrir en el navegador web
- **Presionar 'a'** para abrir en un emulador de Android
- **Presionar 'i'** para abrir en un simulador de iOS (solo macOS)
- **Escanear el código QR** con la app Expo Go en tu teléfono

### Comandos Alternativos

```bash
# Abrir directamente en Android
npm run android

# Abrir directamente en iOS (solo macOS)
npm run ios

# Abrir en navegador web
npm run web
```

## 📱 Uso de la Aplicación

### Pantalla Principal (Lista de Usuarios)
- Visualiza todos los usuarios registrados
- Desliza hacia abajo para refrescar
- Haz scroll hasta el final para cargar más usuarios
- Toca el botón flotante "+" para crear un nuevo usuario

### Crear Usuario
- Completa el formulario con los datos del usuario
- Email y contraseña son obligatorios
- El teléfono debe estar en formato internacional (ej: +1234567890)
- Toca "Crear Usuario" para guardar

### Ver Detalles de Usuario
- Toca cualquier tarjeta de usuario en la lista
- Visualiza toda la información del usuario
- Opciones para editar o eliminar

### Editar Usuario
- Desde los detalles, toca "Editar Usuario"
- Modifica los campos deseados
- Toca "Guardar Cambios"

### Eliminar Usuario
- Desde los detalles, toca "Eliminar Usuario"
- Confirma la acción en el diálogo

## 🏗️ Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── UserCard.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── EmptyState.tsx
├── contexts/          # Context API para manejo de estado
│   └── UserContext.tsx
├── navigation/        # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/          # Pantallas de la aplicación
│   ├── UsersListScreen.tsx
│   ├── UserDetailScreen.tsx
│   ├── CreateUserScreen.tsx
│   └── EditUserScreen.tsx
├── services/         # Servicios para llamadas al API
│   ├── api.service.ts
│   └── user.service.ts
├── types/            # Definiciones de TypeScript
│   └── user.types.ts
├── constants/        # Constantes de la aplicación
│   └── api.constants.ts
└── utils/            # Utilidades
```

## 🎨 Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo** - Plataforma para desarrollo de React Native
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación entre pantallas
- **Axios** - Cliente HTTP para llamadas al API
- **Context API** - Manejo de estado global
- **React Hooks** - useState, useEffect, useContext

## 📡 API Endpoints Integrados

- `POST /api/v1/users` - Crear usuario
- `GET /api/v1/users?page=1&limit=10` - Listar usuarios (paginado)
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario

## 🐛 Solución de Problemas

### Error de conexión con el API

1. Verifica que el API Gateway esté ejecutándose
2. Revisa la URL en `src/constants/api.constants.ts`
3. Si usas un dispositivo físico, asegúrate de estar en la misma red WiFi
4. Verifica que el firewall no esté bloqueando la conexión

### Error al instalar dependencias

```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install

# O limpia el caché de npm
npm cache clean --force
npm install
```

## 📝 Notas Adicionales

- Esta aplicación es parte de una prueba técnica
- El diseño está optimizado para una experiencia de usuario moderna y profesional
- Todos los componentes están desarrollados con TypeScript para mayor seguridad de tipos
- La aplicación incluye validación de formularios y manejo de errores robusto

## 👨‍💻 Desarrollo

Para agregar nuevas funcionalidades:

1. Agrega nuevos tipos en `src/types/`
2. Crea servicios en `src/services/`
3. Desarrolla componentes en `src/components/`
4. Implementa pantallas en `src/screens/`
5. Actualiza la navegación en `src/navigation/`

## 📄 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica.

