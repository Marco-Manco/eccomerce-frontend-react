export interface AuthResponse {
  token: string;
  tipo: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface ProductoResumen {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioDesde: number;
  stockTotal: number;
  imagenPrincipal: string | null;
  activo: boolean;
}

export interface ProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioDesde: number;
  precioHasta: number;
  variantes: Variante[];
  imagenes: Imagen[];
  activo: boolean;
}

export interface Variante {
  id: number;
  sku: string;
  color: string | null;
  talle: string | null;
  precio: number;
  stockDisponible: number;
}

export interface Imagen {
  id: number;
  url: string;
  orden: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  subcategorias: Categoria[];
}

export interface Carrito {
  carritoId: number;
  items: ItemCarrito[];
  totalItems: number;
  total: number;
}

export interface ItemCarrito {
  id: number;
  varianteProductoId: number;
  sku: string;
  productoNombre: string;
  variante: string | null;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  numeroPedido: string;
  estado: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  metodoPago: string;
  fechaCreacion: string;
  fechaExpiracionReserva: string | null;
  items: ItemPedido[];
  linkPago: string | null;
}

export interface ItemPedido {
  id: number;
  productoNombre: string;
  varianteDescripcion: string | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
