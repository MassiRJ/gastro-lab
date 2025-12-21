"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
// import FoodMenu from "./components/FoodMenu";  <-- COMENTADO PARA PROBAR
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar cartCount={0} onOpenCart={() => {}} />
      <Hero />
      
      <div className="py-20 text-center">
        <h2 className="text-3xl text-emerald-500">Mantenimiento del Menú</h2>
        <p className="text-gray-400">Estamos actualizando nuestra carta...</p>
      </div>

      <Footer />
    </main>
  );
}
