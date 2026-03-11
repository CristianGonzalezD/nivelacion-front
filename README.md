# FrontApp

Frontend base construido con Angular 21, Bootstrap 5 y Bootstrap Icons. El proyecto arranca con una pantalla de bienvenida, una barra lateral de navegacion y un modulo de prueba para listar productos en una tabla.

## Objetivo

Servir como base para un sistema frontend que pueda crecer con modulos como:

- bienvenida o dashboard inicial
- listado de productos
- gestion de pedidos
- contacto o soporte

## Tecnologias

- Angular 21
- TypeScript
- Bootstrap 5
- Bootstrap Icons
- npm

## Requisitos

- Node.js 22 LTS recomendado
- npm 10 o superior

## Instalacion

Clona el repositorio e instala las dependencias:

```bash
npm install
```

## Ejecucion en desarrollo

Inicia el servidor local con:

```bash
npm start
```

Luego abre:

```text
http://localhost:4200/
```

## Compilacion

Para generar el build de produccion:

```bash
npm run build
```

La salida se genera en:

```text
dist/front-app
```

## Scripts disponibles

- `npm start`: inicia la aplicacion en modo desarrollo
- `npm run build`: compila el proyecto
- `npm run watch`: compila en modo observacion
- `npm test`: ejecuta pruebas

## Estructura actual

```text
src/
  app/
    app.html
    app.scss
    app.routes.ts
    app.ts
    pages/
      home/
      products/
```

## Rutas actuales

- `/`: pantalla de bienvenida
- `/productos`: modulo de prueba con tabla de productos

## Estructura funcional

- `App`: layout principal con sidebar y `router-outlet`
- `HomeComponent`: vista inicial del sistema
- `ProductsComponent`: modulo de prueba para validar navegacion y estructura

## Buenas practicas para versionado

- No subir `node_modules`, `dist` ni `.angular`
- Mantener commits pequenos y con mensajes claros
- Versionar `package-lock.json`
- Ejecutar `npm run build` antes de subir cambios importantes

## Proximos pasos sugeridos

- crear rutas reales para `pedidos` y `contacto`
- mover datos de productos a un servicio
- conectar una API para listado real
- agregar formularios y validaciones

## Autor

Proyecto academico/base de practica sobre Angular con Bootstrap.
