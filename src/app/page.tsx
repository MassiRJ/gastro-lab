"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu"; // Ya trae sus datos dentro
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
    // No abrimos el carrito automáticamente (diseño silencioso)
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <Hero />
      <Features />
      
      {/* ⚠️ CAMBIO: Ya no pasamos items={...}, el componente los tiene dentro */}
      <Menu onAddToCart={addToCart} />
      
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
