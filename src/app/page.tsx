"use client";

import { useState, useEffect } from "react"; 
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar"; 
import Testimonials from "./components/Testimonials"; 
import Features from "./components/Features"; 
import Toast from "./components/Toast"; // <--- 1. IMPORTAMOS EL TOAST

export default function Home() {
  const [cart, setCart] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  
  // --- ESTADO PARA LA NOTIFICACIÓN ---
  const [toast, setToast] = useState({ show: false, message: "" });

  // Lógica de Auto-Scroll (QR)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mesaParam = params.get("mesa");
      if (mesaParam) {
        setTimeout(() => {
          const menuSection = document.getElementById("menu");
          if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, []);

  // --- FUNCIÓN AGREGAR MEJORADA (UX) ---
  const addToCart = (product) => {
    setCart([...cart, product]);
    
    // CAMBIO CLAVE: YA NO ABRIMOS EL CARRITO AUTOMÁTICAMENTE
    // setIsCartOpen(true); <--- Eliminado
    
    // EN SU LUGAR, MOSTRAMOS EL TOAST
    setToast({ show: true, message: `Has agregado: ${product.title}` });

    // Ocultamos el toast después de 2.5 segundos
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <main className="bg-black min-h-screen">
      {/* Notificación Flotante */}
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Navbar 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onRemoveItem={removeFromCart}
      />

      <Hero />
      <Features />

      <div className="relative z-20 bg-zinc-950">
        <Menu onAddToCart={addToCart} />
      </div>

      <Testimonials />
      <Reservation />
      <Footer />
    </main>
  );
}
// Actualización forzada