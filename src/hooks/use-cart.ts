// Hook cart sederhana untuk menggantikan paket eksternal `react-use-cart`.
// Menyimpan state cart di memory (bisa dikembangkan ke localStorage bila perlu).
import * as React from "react";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

let memoryState: CartState = { items: [] };
const listeners: Array<(state: CartState) => void> = [];

function notify() {
  listeners.forEach((l) => l(memoryState));
}

export function useCart() {
  const [state, setState] = React.useState<CartState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  const { items } = state;
  const isEmpty = items.length === 0;
  const totalUniqueItems = items.length;
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0,
  );

  const addItem = (item: CartItem, quantity: number = 1) => {
    const existing = memoryState.items.find((it) => it.id === item.id);
    if (existing) {
      existing.quantity = (existing.quantity ?? 1) + quantity;
      if (existing.quantity <= 0) {
        memoryState.items = memoryState.items.filter((it) => it.id !== item.id);
      }
    } else if (quantity > 0) {
      memoryState.items = [
        ...memoryState.items,
        { ...item, quantity: quantity > 0 ? quantity : 1 },
      ];
    }
    notify();
  };

  const updateItemQuantity = (id: CartItem["id"], quantity: number) => {
    if (quantity <= 0) {
      memoryState.items = memoryState.items.filter((it) => it.id !== id);
    } else {
      memoryState.items = memoryState.items.map((it) =>
        it.id === id ? { ...it, quantity } : it,
      );
    }
    notify();
  };

  const removeItem = (id: CartItem["id"]) => {
    memoryState.items = memoryState.items.filter((it) => it.id !== id);
    notify();
  };

  const emptyCart = () => {
    memoryState = { items: [] };
    notify();
  };

  return {
    items,
    isEmpty,
    totalUniqueItems,
    cartTotal,
    addItem,
    updateItemQuantity,
    removeItem,
    emptyCart,
  };
}

