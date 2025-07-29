# Sistema de Gestión de Plantas Domésticas
## Proyecto Backend con NodeJS + ExpressJS + MongoDB

### Descripción del Proyecto

Una aplicación web completa para ayudar a los usuarios a gestionar y cuidar sus plantas domésticas. El sistema permite registrar plantas, programar recordatorios de riego, llevar un historial de cuidados y recibir notificaciones automáticas.

### Características Principales

#### Funcionalidades Core:
- **Gestión de Plantas**: CRUD completo para registrar plantas con información detallada
- **Recordatorios Inteligentes**: Sistema automatizado de recordatorios de riego y cuidados
- **Historial de Cuidados**: Tracking completo de todas las actividades realizadas
- **Galería de Fotos**: Subida y gestión de imágenes de las plantas
- **Calendario de Cuidados**: Vista calendario con todas las tareas programadas
- **Notificaciones**: Sistema de alertas por email y en la aplicación

#### Características Técnicas:
- **Autenticación JWT**: Sistema seguro de login y registro
- **APIs RESTful**: Endpoints bien estructurados y documentados
- **Validación de Datos**: Validación robusta en backend
- **Subida de Archivos**: Manejo de imágenes con Multer
- **Programación de Tareas**: Cron jobs para recordatorios automáticos

---

## Arquitectura del Sistema

### Stack Tecnológico:
- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT + bcrypt
- **Validación**: Joi
- **Subida de Archivos**: Multer + Cloudinary
- **Programación**: node-cron
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Documentación**: Swagger

### Estructura de la Base de Datos:

#### Colección Users:
```javascript
{
    _id: ObjectId,
    email: String,
    password: String, // hashed
    avatar: String,
    preferences: {
        notifications: Boolean,
        reminderTime: String, // "09:00"
        timezone: String
    },
    createdAt: Date
}
```

#### Colección Plants:
```javascript
{
    _id: ObjectId,
    userId: ObjectId, // ref to User
    name: String,
    species: String,
    location: String, // "Living room", "Balcony"
    photo: String, // URLs to images
    info: {  
        status: String, // "healthy", "needs_attention", "sick"
        lastWatering: Date,
        nextWatering: Date,
        notes: String
    },
    createdAt: Date
}
```

#### Colección CareRecords:
```javascript
{
    _id: ObjectId,
    plantId: ObjectId, // ref to Plant
    userId: ObjectId, // ref to User
    careType: String, // "watering", "fertilizing", "pruning", "repotting"
    description: String,
    nextDueDate: Date, // calculated based on frequency
    completed: Boolean,
    completedAt: Date,
    notes: String,
    createdAt: Date
}
```

#### Colección Reminders:
```javascript
{
    _id: ObjectId,
    plantId: ObjectId, // ref to Plant
    userId: ObjectId, // ref to User
    careType: String,
    scheduledDate: Date,
    isRecurring: Boolean,
    frequency: Number, // days
    status: String, // "pending", "completed", "overdue"
    notificationSent: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Roadmap de Desarrollo

### Fase 1: Configuración Inicial (Semana 1)

#### Día 1-2: Setup del Proyecto
- [ ] Inicializar proyecto Node.js
- [ ] Configurar Express.js básico
- [ ] Setup de MongoDB y Mongoose
- [ ] Configurar variables de entorno
- [ ] Estructura de carpetas
- [ ] Configurar ESLint y Prettier

#### Día 3-4: Autenticación Base
- [ ] Modelo de Usuario
- [ ] Registro de usuarios
- [ ] Login con JWT
- [ ] Middleware de autenticación
- [ ] Validación de datos con Joi

#### Día 5-7: Testing Setup
- [ ] Configurar Jest y Supertest
- [ ] Tests para autenticación
- [ ] Setup de MongoDB Memory Server
- [ ] CI/CD básico

### Fase 2: Gestión de Plantas (Semana 2)

#### Día 8-10: CRUD de Plantas
- [ ] Modelo de Plant
- [ ] Endpoint para crear planta
- [ ] Endpoint para listar plantas del usuario
- [ ] Endpoint para obtener planta específica
- [ ] Endpoint para actualizar planta
- [ ] Endpoint para eliminar planta

#### Día 11-12: Subida de Imágenes
- [ ] Configurar Multer
- [ ] Integración con Cloudinary
- [ ] Endpoint para subir fotos
- [ ] Validación de tipos de archivo
- [ ] Redimensionado automático

#### Día 13-14: Validaciones y Tests
- [ ] Validaciones robustas para plantas
- [ ] Tests unitarios para CRUD
- [ ] Tests de integración
- [ ] Manejo de errores

### Fase 3: Sistema de Cuidados (Semana 3)

#### Día 15-17: Historial de Cuidados
- [ ] Modelo CareRecord
- [ ] Endpoint para registrar cuidado
- [ ] Endpoint para historial por planta
- [ ] Estadísticas de cuidados
- [ ] Filtros por tipo y fecha

#### Día 18-19: Recordatorios Básicos
- [ ] Modelo Reminder
- [ ] Crear recordatorio manual
- [ ] Listar recordatorios pendientes
- [ ] Marcar como completado
- [ ] Cálculo de próximas fechas

#### Día 20-21: Tests y Optimización
- [ ] Tests para sistema de cuidados
- [ ] Optimización de consultas
- [ ] Índices en MongoDB
- [ ] Validación de datos

### Fase 4: Automatización (Semana 4)

#### Día 22-24: Recordatorios Automáticos
- [ ] Configurar node-cron
- [ ] Job para generar recordatorios
- [ ] Lógica de frecuencias
- [ ] Recordatorios recurrentes
- [ ] Manejo de recordatorios vencidos

#### Día 25-26: Sistema de Notificaciones
- [ ] Configurar Nodemailer
- [ ] Templates de email
- [ ] Notificaciones en la app
- [ ] Preferencias de usuario
- [ ] Queue de emails

#### Día 27-28: Calendario y Dashboard
- [ ] API para vista calendario
- [ ] Dashboard con estadísticas
- [ ] Próximos cuidados
- [ ] Estado general de plantas

### Fase 5: Características Avanzadas (Semana 5)

#### Día 29-31: Funcionalidades Extra
- [ ] Búsqueda y filtros avanzados
- [ ] Exportar datos a PDF
- [ ] Sistema de etiquetas
- [ ] Notas y observaciones
- [ ] Modo offline básico

#### Día 32-33: Optimización y Performance
- [ ] Caching con Redis
- [ ] Paginación optimizada
- [ ] Compresión de imágenes
- [ ] Rate limiting
- [ ] Monitoring básico

#### Día 34-35: Documentación y Deploy
- [ ] Documentación con Swagger
- [ ] README completo
- [ ] Deploy en Heroku/Railway
- [ ] Configuración de producción
- [ ] Testing en producción

---

## Endpoints de la API

### Módulo de Autenticación

**Registro de usuario**
- Método: POST
- Ruta: /api/auth/register
- Descripción: Registro de nuevo usuario

**Login de usuario**
- Método: POST
- Ruta: /api/auth/login
- Descripción: Autenticación de usuario

**Refresh token**
- Método: POST
- Ruta: /api/auth/refresh
- Descripción: Renovar token de acceso

**Perfil del usuario**
- Método: GET
- Ruta: /api/auth/profile
- Descripción: Obtener información del perfil

**Actualizar perfil**
- Método: PUT
- Ruta: /api/auth/profile
- Descripción: Modificar datos del usuario

### Módulo de Plantas

**Listar plantas**
- Método: GET
- Ruta: /api/plants
- Descripción: Obtener todas las plantas del usuario

**Crear planta**
- Método: POST
- Ruta: /api/plants
- Descripción: Registrar nueva planta

**Obtener planta específica**
- Método: GET
- Ruta: /api/plants/:id
- Descripción: Detalles de una planta

**Actualizar planta**
- Método: PUT
- Ruta: /api/plants/:id
- Descripción: Modificar información de planta

**Eliminar planta**
- Método: DELETE
- Ruta: /api/plants/:id
- Descripción: Borrar planta del sistema

**Subir foto de planta**
- Método: POST
- Ruta: /api/plants/:id/photos
- Descripción: Agregar imagen a la planta

### Módulo de Cuidados

**Historial de cuidados**
- Método: GET
- Ruta: /api/plants/:id/care-history
- Descripción: Ver todos los cuidados de una planta

**Registrar cuidado**
- Método: POST
- Ruta: /api/care-records
- Descripción: Anotar nuevo cuidado realizado

**Obtener cuidado específico**
- Método: GET
- Ruta: /api/care-records/:id
- Descripción: Detalles de un cuidado

**Actualizar cuidado**
- Método: PUT
- Ruta: /api/care-records/:id
- Descripción: Modificar registro de cuidado

### Módulo de Recordatorios

**Listar recordatorios**
- Método: GET
- Ruta: /api/reminders
- Descripción: Todos los recordatorios del usuario

**Crear recordatorio**
- Método: POST
- Ruta: /api/reminders
- Descripción: Programar nuevo recordatorio

**Marcar como completado**
- Método: PUT
- Ruta: /api/reminders/:id/complete
- Descripción: Completar tarea de cuidado

**Eliminar recordatorio**
- Método: DELETE
- Ruta: /api/reminders/:id
- Descripción: Cancelar recordatorio

**Recordatorios vencidos**
- Método: GET
- Ruta: /api/reminders/overdue
- Descripción: Tareas pendientes y atrasadas

### Módulo de Dashboard

**Estadísticas generales**
- Método: GET
- Ruta: /api/dashboard/stats
- Descripción: Resumen de plantas y cuidados

**Vista calendario**
- Método: GET
- Ruta: /api/dashboard/calendar
- Descripción: Cuidados programados por fecha

**Próximos cuidados**
- Método: GET
- Ruta: /api/dashboard/upcoming
- Descripción: Tareas de los próximos días

---

## Comandos de Desarrollo

### Instalación de Dependencias

**Dependencias principales:**
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken joi cors helmet morgan multer cloudinary nodemailer node-cron
```

**Dependencias de desarrollo:**
```bash
npm install -D nodemon jest supertest mongodb-memory-server eslint prettier
```

### Scripts de Package.json

```json
{
    "scripts": {
        "start": "node src/server.js",
        "dev": "nodemon src/server.js",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "lint": "eslint src/",
        "lint:fix": "eslint src/ --fix"
    }
}
```

### Variables de Entorno

Crear archivo .env con:
- NODE_ENV=development
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/plant_care
- JWT_SECRET=your_super_secret_key
- JWT_EXPIRE=7d
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=your_email@gmail.com
- EMAIL_PASS=your_app_password

---

## Estructura de Carpetas del Proyecto

**Directorio raíz:**
- src/ - Código fuente principal
- tests/ - Archivos de testing
- docs/ - Documentación del proyecto
- uploads/ - Archivos temporales
- .env - Variables de entorno
- package.json - Dependencias y scripts
- README.md - Documentación principal

**Dentro de src/:**
- controllers/ - Lógica de controladores
- models/ - Modelos de MongoDB
- routes/ - Definición de rutas
- middleware/ - Middleware personalizado
- services/ - Lógica de negocio
- utils/ - Funciones utilitarias
- config/ - Configuración de servicios
- validators/ - Esquemas de validación
- app.js - Configuración de Express
- server.js - Punto de entrada

---

## Criterios de Éxito

### Funcionalidad Básica:
- [ ] Usuario puede registrarse y hacer login
- [ ] CRUD completo de plantas funciona
- [ ] Sistema de recordatorios genera alertas
- [ ] Subida de imágenes funciona
- [ ] Historial de cuidados se registra
- [ ] Notificaciones por email se envían

### Calidad Técnica:
- [ ] Cobertura de tests mayor al 80%
- [ ] APIs documentadas con Swagger
- [ ] Validación en todos los endpoints
- [ ] Manejo de errores centralizado
- [ ] Performance optimizada
- [ ] Seguridad implementada

### Deployment:
- [ ] Aplicación deployada y accesible
- [ ] Base de datos en la nube
- [ ] Variables de entorno configuradas
- [ ] SSL certificado activo
- [ ] Monitoring implementado

---

## Próximos Pasos y Mejoras

### Versión 2.0:
- Integración con APIs de clima
- Reconocimiento de plantas por IA
- Comunidad de usuarios
- Marketplace de plantas
- App móvil con React Native

### Características Premium:
- Análisis avanzado de salud
- Consultas con expertos
- Planes personalizados
- Integración con sensores IoT
- Backup automático

Este proyecto te dará experiencia completa en desarrollo backend y será una excelente pieza para tu portfolio profesional.