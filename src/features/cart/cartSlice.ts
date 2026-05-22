import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  varianteProductoId: number;
  sku: string;
  productoNombre: string;
  variante: string | null;
  precioUnitario: number;
  cantidad: number;
  stockDisponible: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.varianteProductoId === action.payload.varianteProductoId);
      if (existing) {
        existing.cantidad += action.payload.cantidad;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity(state, action: PayloadAction<{ varianteProductoId: number; cantidad: number }>) {
      const item = state.items.find((i) => i.varianteProductoId === action.payload.varianteProductoId);
      if (item) item.cantidad = action.payload.cantidad;
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.varianteProductoId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
