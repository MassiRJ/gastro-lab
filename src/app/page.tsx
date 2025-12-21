"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodMenu from "./components/FoodMenu"; // Asegúrate que importa FoodMenu
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Toast from "./components/Toast";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Math.random() }]);
    setToastMessage(`¡${item.title} agregado!`);
  };

  // ⚠️ CAMBIO: Usamos lógica manual en vez de .filter para evitar el error
  const removeFromCart = (cartId) => {
    setCart((prev) => {
      if (!prev) return []; // Seguridad extra
      const newCart = [...prev];
      const index = newCart.findIndex(item => item.cartId === cartId);
      if (index > -1) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <Hero />
      <Features />
      <FoodMenu onAddToCart={addToCart} />
      <Testimonials />
      <Reservation />
      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onClearCart={clearCart} 
      />
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </main>
  );
}
