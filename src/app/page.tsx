"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Toast from "./components/Toast";

// TU MENÚ COMPLETO (Categorizado)
const MENU_ITEMS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00 },
  { id: 4, category: "Entradas", title: "Tequeños de Queso", price: 15.00 },
  { id: 5, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 6, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 7, category: "Fondos", title: "Arroz con Mariscos", price: 42.00 },
  { id: 8, category: "Fondos", title: "Seco de Cordero", price: 48.00 },
  { id: 9, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00 },
  { id: 10, category: "Bebidas", title: "Limonada Frozen", price: 12.00 },
  { id: 11, category: "Bebidas", title: "Pisco Sour", price: 25.00 },
  { id: 12, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00 },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Math.random() }]);
    setToastMessage(`¡${item.title} agregado!`);
    
    // ⚠️ CAMBIO IMPORTANTE: YA NO ABRIMOS EL CARRITO AUTOMÁTICAMENTE
    // setIsCartOpen(true);  <-- COMENTADO PARA QUE SEA "SILENCIOSO"
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
      
      {/* El menú ahora maneja sus propias pestañas internamente */}
      <Menu items={MENU_ITEMS} onAddToCart={addToCart} />
      
      <Testimonials />
      <Reservation />
      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onClearCart={clearCart} // Pasamos la función para limpiar al confirmar
      />
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </main>
  );
}
