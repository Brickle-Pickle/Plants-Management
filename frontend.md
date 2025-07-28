## Frontend

### Descripción

El frontend de la aplicación está desarrollado con React y Vite para una experiencia rápida y moderna. Permite a los usuarios interactuar con el sistema de gestión de plantas, visualizar sus plantas, gestionar cuidados, y recibir notificaciones.

### Estructura del Frontend

- **Framework:** React
- **Bundler:** Vite
- **Gestión de Estado:** React Context o Redux (según preferencia)
- **Rutas principales:**
  - `/` - Página principal o dashboard
  - `/login` - Página de inicio de sesión
  - `/register` - Registro de usuario
  - `/plants` - Listado de plantas del usuario
  - `/plants/:id` - Detalle de planta
  - `/care-history/:plantId` - Historial de cuidados
  - `/reminders` - Recordatorios

### Configuración y Scripts

- El proyecto frontend se encuentra en la carpeta `client/`.
- Para instalar dependencias:
  ```bash
  npm install
  ```
- Para iniciar el servidor de desarrollo:
  ```bash
  npm run dev
  ```
- Para construir la versión de producción:
  ```bash
  npm run build
  ```

### Comunicación con Backend

- El frontend consume la API RESTful expuesta por el backend en `http://localhost:5000/api`.
- Se recomienda configurar un proxy en Vite para evitar problemas de CORS durante el desarrollo.

```js
// vite.config.js
export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:5000'
        }
    }
});
```

Esta sección complementa la documentación existente y ayuda a tener una visión completa del proyecto tanto en backend como en frontend.