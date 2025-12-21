"use client";
export default function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=1920&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
        />
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          SABORES QUE <br/><span className="text-emerald-500">TRASCIENDEN</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light max-w-2xl mx-auto">
          Alta cocina fusionada con tecnología. Reserva, pide y disfruta en segundos.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#menu" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-900/50">
            Ver Menú
          </a>
          <a href="#reservas" className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm">
            Reservar Mesa
          </a>
        </div>
      </div>
    </div>
  );
}
