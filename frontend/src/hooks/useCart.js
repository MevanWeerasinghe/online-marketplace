// src/hooks/useCart.js
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createApiUrl, API_ENDPOINTS } from "../config/api";

export default function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  // Load cart on mount and when user changes
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (user) {
      loadCartFromServer();
    } else {
      loadCartFromLocal();
    }
  }, [user, isLoaded]);

  // Load cart from server for logged-in users
  const loadCartFromServer = async () => {
    try {
      const response = await fetch(
        createApiUrl(`${API_ENDPOINTS.CART}/${user.id}`)
      );
      if (response.ok) {
        const serverCart = await response.json();

        // Get local cart for potential merging
        const localCart = getLocalCart();

        // Merge server cart with local cart (if any)
        const mergedCart = mergeCartItems(serverCart, localCart);

        setCart(mergedCart);

        // Clear local cart after merging to server
        if (localCart.length > 0) {
          localStorage.removeItem("cart");
          // Save merged cart to server
          await saveCartToServer(mergedCart);
        }
      } else {
        // If no server cart exists, load from local
        loadCartFromLocal();
      }
    } catch (error) {
      console.error("Error loading cart from server:", error);
      loadCartFromLocal(); // Fallback to local storage
    } finally {
      setLoading(false);
    }
  };

  // Get local cart without setting state
  const getLocalCart = () => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return [];
    }
  };

  // Load cart from localStorage for non-logged-in users
  const loadCartFromLocal = () => {
    try {
      const localCart = getLocalCart();
      setCart(localCart);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Merge two carts, avoiding duplicates and combining quantities
  const mergeCartItems = (serverCart, localCart) => {
    if (!localCart || localCart.length === 0) return serverCart;
    if (!serverCart || serverCart.length === 0) return localCart;

    const mergedCart = [...serverCart];

    localCart.forEach((localItem) => {
      const existingItemIndex = mergedCart.findIndex(
        (item) => item._id === localItem._id
      );

      if (existingItemIndex >= 0) {
        // Item exists in server cart, combine quantities
        mergedCart[existingItemIndex].quantity += localItem.quantity;
      } else {
        // Item doesn't exist in server cart, add it
        mergedCart.push(localItem);
      }
    });

    return mergedCart;
  };

  // Save cart to server for logged-in users
  const saveCartToServer = async (cartData) => {
    if (!user || !isLoaded) return;

    try {
      await fetch(createApiUrl(`${API_ENDPOINTS.CART}/${user.id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });
    } catch (error) {
      console.error("Error saving cart to server:", error);
    }
  };

  // Sync cart changes (debounced to avoid too many API calls)
  useEffect(() => {
    if (loading || !isLoaded) return; // Don't sync during initial load

    const timeoutId = setTimeout(() => {
      if (user) {
        saveCartToServer(cart);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [cart, user, loading, isLoaded]);

  // Clear cart when user logs out
  useEffect(() => {
    if (isLoaded && !user) {
      // User logged out, clear the cart state but keep localStorage
      // (localStorage will be handled by the sync effect above)
    }
  }, [user, isLoaded]);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex((i) => i._id === item._id);
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // Add new item with quantity
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    // Also clear from storage
    if (user) {
      saveCartToServer([]);
    } else {
      localStorage.removeItem("cart");
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const isInCart = (itemId) => {
    return cart.some((item) => item._id === itemId);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    loading,
  };
}
