"use client";

import { useState } from "react";
// Importamos los componentes (asegúrate de que existen en la carpeta components)
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Toast from "./components/Toast";

// DATOS DEL MENÚ (Puedes editarlos aquí)
const MENU_ITEMS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00 },
  { id: 4, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 5, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 6, category: "Fondos", title: "Arroz con Mariscos", price: 42.00 },
  { id: 7, category: "Fondos", title: "Seco de Cordero", price: 48.00 },
  { id: 8, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00 },
  { id: 9, category: "Bebidas", title: "Limonada Frozen", price: 12.00 },
  { id: 10, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00 },
];

export default function Home() {
  // ESTADOS PRINCIPALES
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // LOGICA DEL CARRITO
  const addToCart = (item) => {
    // Añadimos un ID único (cartId) para poder borrar items individuales si se repiten
    setCart((prev) => [...prev, { ...item, cartId: Math.random() }]);
    setToastMessage(`¡${item.title} agregado!`);
    setIsCartOpen(true); // Abrimos el carrito automáticamente al agregar (opcional)
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <main className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-white scroll-smooth">
      
      {/* 1. BARRA DE NAVEGACIÓN (Con contador de carrito) */}
      <Navbar 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* 2. PORTADA GIGANTE (Con Video/Imagen) */}
      <Hero />

      {/* 3. CARACTERÍSTICAS (Iconos rápidos) */}
      <Features />

      {/* 4. MENÚ DE COMIDA */}
      <Menu items={MENU_ITEMS} onAddToCart={addToCart} />

      {/* 5. TESTIMONIOS */}
      <Testimonials />

      {/* 6. RESERVAS */}
      <Reservation />

      {/* 7. PIE DE PÁGINA */}
      <Footer />

      {/* --- ELEMENTOS FLOTANTES --- */}
      
      {/* Sidebar del Carrito */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart} 
      />
      
      {/* Notificación Toast */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage("")} 
        />
      )}

    </main>
  );
}
