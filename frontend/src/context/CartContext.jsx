import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ADD ITEM (color + size create unique item)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item._id === product._id &&
          item.color === product.color &&
          item.size === product.size
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id &&
          item.color === product.color &&
          item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // DECREASE ONE ITEM QTY
  const decreaseQty = (id, color, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id && item.color === color && item.size === size
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // REMOVE ENTIRE ITEM
  const removeItem = (id, color, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item._id === id && item.color === color && item.size === size)
      )
    );
  };

  // CLEAR CART
  const clearCart = () => setCart([]);

  // TOTAL PRICE
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeItem,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
