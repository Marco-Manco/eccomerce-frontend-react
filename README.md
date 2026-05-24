# 🧵 Ecommerce Tejidos — Frontend (React + TypeScript)

SPA del ecommerce de productos tejidos artesanales. MVP funcional con landing page, catálogo, carrito, checkout con MercadoPago, panel de administración y autenticación con Google.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Build** | Vite 5 |
| **Lenguaje** | TypeScript (strict) |
| **UI** | React 19 |
| **Estado global** | Redux Toolkit |
| **Estado servidor** | RTK Query (cache automático, invalidación) |
| **Router** | React Router v6 (layout routes, lazy loading) |
| **Estilos** | Tailwind CSS 4 |
| **Íconos** | Lucide React |
| **Proxy dev** | Vite proxy → backend `localhost:8080` |

## Arquitectura

```
src/
├── app/                        ← Store Redux, Router
├── features/                   ← Módulos por dominio
│   ├── auth/                   ← Login, registro, Google OAuth, perfil
│   ├── products/               ← Catálogo, detalle, componentes
│   ├── cart/                   ← Carrito sincronizado con backend
│   ├── orders/                 ← Checkout, historial de pedidos
│   └── admin/                  ← Panel productos, categorías, pedidos
└── shared/                     ← Componentes, tipos y utils compartidos
```

**Principios aplicados:**
- Feature-based: cada dominio autocontenido (slice, API, páginas, componentes)
- RTK Query con `invalidatesTags` para refetch automático al mutar datos
- `ProtectedRoute` con verificación de autenticación y rol
- Estados: loading, empty, error en cada vista

## Cómo levantar

### Requisitos
- Node.js 18+
- Backend corriendo en `localhost:8080`

### Instalación
```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. El proxy de Vite (`vite.config.ts`) redirige `/api/*` al backend automáticamente.

## Páginas

| Ruta | Página | Acceso |
|------|--------|:---:|
| `/` | Landing con hero + carrusel + catálogo | Público |
| `/productos/:id` | Detalle con variantes e imágenes | Público |
| `/login` | Login / Registro / Google OAuth | Público |
| `/carrito` | Carrito de compras | CLIENTE |
| `/checkout` | Finalizar compra (dirección + pago) | CLIENTE |
| `/pedidos` | Historial con stepper de estados | CLIENTE |
| `/perfil` | Datos personales + direcciones | CLIENTE/ADMIN |
| `/admin/pedidos` | Todos los pedidos (filtros + acciones) | ADMIN |
| `/admin/productos` | CRUD productos, variantes, imágenes | ADMIN |
| `/admin/categorias` | CRUD categorías (árbol jerárquico) | ADMIN |

## Funcionalidades

### Landing + Catálogo
- [x] Hero con gradient + CTA
- [x] Carrusel automático de productos destacados
- [x] Buscador con filtros dinámicos
- [x] Paginación
- [x] Detalle con selector de variantes (color/talle)

### Autenticación
- [x] Login / Registro con validación
- [x] Google OAuth: redirect → callback → JWT almacenado
- [x] Persistencia de sesión en localStorage
- [x] Navbar adaptativo según rol (admin vs cliente)

### Carrito + Checkout
- [x] Carrito sincronizado con backend (RTK Query)
- [x] Contador en Navbar con actualización automática
- [x] Modificar cantidades / eliminar items
- [x] Checkout con selección de dirección real
- [x] Redirect a MercadoPago para pago

### Pedidos
- [x] Historial con badge de estado coloreado
- [x] Modal con stepper visual de 5 estados
- [x] Link "Pagar ahora" en pedidos PENDIENTES

### Admin
- [x] Productos: crear, editar (nombre, desc, categoría, activo)
- [x] Variantes: modificar precio, stock, color, talle + agregar nuevas
- [x] Imágenes: subida diferida con preview, eliminación (hasta 3)
- [x] Categorías: tabla con árbol jerárquico, crear, editar
- [x] Pedidos: tabla con filtros (búsqueda, estado), acciones rápidas (Preparar, Enviar, Entregar), modal stepper

### Perfil
- [x] Datos del usuario (nombre, email, rol)
- [x] CRUD de direcciones de envío (calle, número, ciudad, CP)

## Pantallas principales

### Landing
Hero con gradiente púrpura + buscador de productos + grilla de tarjetas con imágenes, nombre, categoría y precio.

### Detalle de producto
Imagen grande, selector de variantes visual, control de cantidad, botón "Agregar al carrito". Las variantes sin stock aparecen tachadas.

### Carrito
Tabla con items, cantidad editable, subtotales, total y botón "Ir al checkout".

### Checkout
Resumen del pedido, selección de dirección con radio buttons, botón "Pagar con MercadoPago".

### Admin
Panel con tabs: Productos (grilla + formulario de edición con secciones), Categorías (tabla jerárquica), Pedidos (tabla con filtros).

### Stepper de pedido
Barra de progreso con 5 pasos: PENDIENTE → PAGADO → EN_PREPARACIÓN → ENVIADO → ENTREGADO. Colores: verde (completado), púrpura (actual), gris (pendiente), rojo (cancelado).

## 🌐 Demo en vivo

**[eccomerce-frontend-react.vercel.app](https://eccomerce-frontend-react.vercel.app)**

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@ecommerce.com` | `admin1234` |

## 💰 Probar pagos (MercadoPago Sandbox)

En el checkout serás redirigido a MercadoPago. Logueate con:
- **Usuario:** `TESTUSER3477234149032093924`
- **Contraseña:** `NUD38I13vV`

> ⚠️ Sandbox — no se realizan cobros reales.
