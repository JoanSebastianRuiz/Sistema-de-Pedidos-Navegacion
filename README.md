# Sistema de Pedidos Navegacion

Sistema web para la gestión de pedidos, productos, categorías y usuarios. El proyecto está organizado como una aplicación **full-stack**, compuesta por un cliente web desarrollado con React y una API desarrollada con NestJS, utilizando PostgreSQL como base de datos y Drizzle ORM para el acceso a los datos.

El sistema incorpora autenticación basada en JWT mediante cookies HttpOnly, gestión de roles, internacionalización, administración de productos y categorías, gestión de pedidos y una arquitectura preparada para ejecutar procesos distribuidos mediante workers.

## Tecnologías

### Cliente

* **React 18**
* **Vite**
* **Material UI**
* **React Router**
* **TanStack React Query**
* **Zustand**
* **Formik**
* **Yup**
* **i18next**

### Servidor

* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **Drizzle ORM**
* **JWT**
* **Workers distribuidos**

### Otros

* **npm** para la gestión de dependencias.
* **ESLint** para análisis estático del código.
* **Git** para control de versiones.
* Interfaz disponible en **español e inglés**.

## Arquitectura del proyecto

El repositorio está dividido en dos aplicaciones principales:

```text
Sistema-de-Pedidos-Navegacion/
├── client/     # Aplicación web React/Vite
└── server/     # API NestJS y servicios del backend
```

### Cliente

La aplicación cliente contiene la interfaz web, navegación, gestión del estado, formularios, consumo de la API e internacionalización.

### Servidor

El servidor contiene la API REST, autenticación, autorización, lógica de negocio, acceso a PostgreSQL mediante Drizzle ORM y la configuración necesaria para los procesos distribuidos.

## Requisitos

Antes de ejecutar el proyecto se requiere:

* Node.js 20 o superior.
* npm.
* PostgreSQL accesible mediante `DATABASE_URL`.

## Configuración

El cliente y el servidor utilizan archivos de entorno independientes. Estos archivos deben crearse localmente y **no deben incluirse en el repositorio**.

### `server/.env`

```env
PORT=3005
NODE_ENV=development

DATABASE_URL=postgresql://usuario:contraseña@host:5432/base_de_datos

JWT_KEY=una-clave-secreta

ALLOWED_ORIGINS=http://localhost:3006

# Credenciales utilizadas por el seed inicial
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=cambia-esta-contraseña

# Configuración opcional para workers distribuidos
INTERNAL_WORKER_KEY=una-clave-interna
WORKERS=3007,3008
```

`DATABASE_PASSWORD` puede utilizarse como variable auxiliar si la configuración de PostgreSQL lo requiere.

`ALLOWED_ORIGINS` permite definir los orígenes autorizados para las solicitudes del cliente. Si se configuran varios orígenes, deben especificarse de acuerdo con el formato esperado por la aplicación.

### `client/.env`

```env
VITE_PROJECT_NAME=Sistema de pedidos
VITE_PORT=3006
VITE_BACKEND_URL=http://localhost:3005
VITE_ENVIRONMENT=development
```

El cliente utiliza `VITE_BACKEND_URL` como dirección base para comunicarse con la API. Los endpoints de la aplicación utilizan el prefijo `/api`.

## Instalación

Clona el repositorio e instala las dependencias de ambas aplicaciones:

```bash
cd server
npm install

cd ../client
npm install
```

## Base de datos

Los siguientes comandos deben ejecutarse desde el directorio `server/`.

### Generar migraciones

```bash
npm run db:generate
```

Genera una migración a partir de los cambios realizados en el esquema de la base de datos.

### Aplicar migraciones

```bash
npm run db:migrate
```

Aplica las migraciones pendientes sobre la base de datos configurada.

### Sincronizar el esquema

```bash
npm run db:push
```

Sincroniza directamente el esquema con la base de datos. Está orientado principalmente al desarrollo y no sustituye el uso de migraciones versionadas.

### Ejecutar el seed

```bash
npm run db:seed
```

Carga los datos iniciales necesarios para trabajar con el sistema, incluyendo el usuario administrador, categorías y productos iniciales.

Para entornos compartidos se recomienda utilizar `db:migrate` y mantener las migraciones versionadas.

## Ejecución

### Iniciar el servidor

Desde `server/`:

```bash
npm run start:dev
```

La API estará disponible, con la configuración predeterminada, en:

```text
http://localhost:3005/api
```

### Iniciar el cliente

En una segunda terminal, desde `client/`:

```bash
npm run dev
```

El cliente estará disponible en:

```text
http://localhost:3006
```

## Scripts principales

### Cliente

Desde `client/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
```

| Comando            | Descripción                                                   |
| ------------------ | ------------------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo de Vite.                     |
| `npm run build`    | Genera la compilación para producción.                        |
| `npm run preview`  | Sirve localmente la compilación generada.                     |
| `npm run lint`     | Analiza el código mediante ESLint.                            |
| `npm run lint:fix` | Corrige automáticamente los problemas compatibles con ESLint. |

### Servidor

Desde `server/`:

```bash
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

| Comando              | Descripción                                           |
| -------------------- | ----------------------------------------------------- |
| `npm run start:dev`  | Inicia NestJS en modo desarrollo con watch.           |
| `npm run build`      | Compila la aplicación.                                |
| `npm run start:prod` | Ejecuta la aplicación compilada.                      |
| `npm run lint`       | Analiza el código mediante ESLint.                    |
| `npm run test`       | Ejecuta las pruebas unitarias.                        |
| `npm run test:e2e`   | Ejecuta las pruebas end-to-end.                       |
| `npm run test:cov`   | Ejecuta las pruebas y genera el reporte de cobertura. |

## Módulos principales

El sistema cuenta con los siguientes módulos y funcionalidades:

* **Autenticación:** inicio de sesión y protección de recursos.
* **Usuarios:** gestión de usuarios y roles.
* **Productos:** creación, consulta, actualización y administración de productos.
* **Categorías:** gestión y organización de categorías.
* **Pedidos:** creación, consulta, actualización y seguimiento de pedidos.
* **Catálogo:** navegación de productos mediante categorías, búsqueda y paginación.
* **Carrito:** administración de los productos seleccionados durante la creación de pedidos.
* **Autorización:** protección de rutas mediante roles y JWT.
* **Internacionalización:** interfaz disponible en español e inglés.
* **Exportación:** exportación de información desde la aplicación cliente.
* **Procesamiento distribuido:** soporte para workers destinados a ejecutar procesos específicos de forma independiente.

## Autenticación y seguridad

El sistema utiliza autenticación basada en **JWT**, almacenando las credenciales de sesión mediante cookies HttpOnly. Las rutas protegidas requieren autenticación y determinadas operaciones están restringidas según el rol del usuario.

Como medidas básicas de seguridad:

* No subir archivos `.env` al repositorio.
* No almacenar contraseñas, claves JWT o claves internas directamente en el código.
* Utilizar valores diferentes para desarrollo, pruebas y producción.
* Cambiar las credenciales del administrador utilizadas por el seed inicial antes de utilizar el sistema fuera de un entorno local.
* Mantener las claves internas de los workers únicamente en las variables de entorno correspondientes.

## Workers distribuidos

El backend puede utilizar workers independientes para ejecutar determinados procesos. Estos pueden configurarse mediante:

```env
WORKERS=3007,3008
```

La comunicación interna entre el servidor y los workers se protege mediante:

```env
INTERNAL_WORKER_KEY=una-clave-interna
```

Los workers pueden ejecutarse en puertos independientes y permiten distribuir determinados procesos del backend entre diferentes instancias.

## Flujo de desarrollo

Para ejecutar el proyecto desde cero:

1. Configurar `server/.env` y `client/.env`.
2. Instalar las dependencias del cliente y del servidor.
3. Configurar la conexión a PostgreSQL.
4. Ejecutar las migraciones de la base de datos.
5. Ejecutar el seed inicial.
6. Iniciar la API.
7. Iniciar el cliente.
8. Verificar el funcionamiento de los principales flujos.
9. Ejecutar lint y pruebas antes de integrar cambios.

## URLs locales

Con la configuración predeterminada:

| Servicio | URL                         |
| -------- | --------------------------- |
| Cliente  | `http://localhost:3006`     |
| API      | `http://localhost:3005/api` |
| Worker 1 | `http://localhost:3007`     |
| Worker 2 | `http://localhost:3008`     |

Los workers únicamente son necesarios cuando se utilizan los procesos distribuidos correspondientes.

## Consideraciones

El proyecto está orientado principalmente a un entorno de desarrollo y académico. Para utilizarlo en producción se deben complementar las configuraciones de seguridad, infraestructura, manejo de secretos, monitoreo, disponibilidad de la base de datos y despliegue de los servicios.

Antes de realizar cambios en el proyecto, se recomienda ejecutar las herramientas de análisis y pruebas disponibles para mantener la estabilidad del sistema.
