"use client";

import { useState, useEffect } from "react";
// Importamos todos los componentes que creaste
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Toast from "./components/Toast";

// Datos del Menú (Simulados para la Landing Page)
const MENU_ITEMS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 4, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 5, category: "Bebidas", title: "Chicha Morada", price: 15.00 },
  { id: 6, category: "Bebidas", title: "Pisco Sour", price: 25.00 },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Función para agregar al carrito
  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Math.random() }]);
    setToastMessage(`Agregado: ${item.title}`);
  };

  // Función para eliminar del carrito
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <main className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-white">
      {/* 1. Barra de Navegación */}
      <Navbar 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* 2. Hero (Portada) */}
      <Hero />

      {/* 3. Características */}
      <Features />

      {/* 4. Menú */}
      <Menu items={MENU_ITEMS} onAddToCart={addToCart} />

      {/* 5. Testimonios */}
      <Testimonials />

      {/* 6. Reservas */}
      <Reservation />

      {/* 7. Footer */}
      <Footer />

      {/* 8. Componentes Flotantes (Carrito y Notificaciones) */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart} 
      />
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage("")} 
        />
      )}
    </main>
  );
}
