"use client";

export default function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 1. FONDO DE VIDEO/IMAGEN */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
        {/* Aquí puedes poner tu video local. Por ahora uso una imagen premium animada */}
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop" 
          alt="Fondo Gourmet" 
          className="w-full h-full object-cover opacity-60 animate-pulse-slow scale-105"
        />
        {/* SI QUIERES EL VIDEO, DESCOMENTA ESTO Y PON TU ARCHIVO EN public/video.mp4 */}
        {/* <video autoPlay loop muted className="w-full h-full object-cover opacity-50">
           <source src="/video-fondo.mp4" type="video/mp4" />
        </video> 
        */}
      </div>

      {/* 2. TEXTO CENTRAL */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 animate-in slide-in-from-bottom-10 duration-1000">
        <span className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-4 block">
          Experiencia Gastronómica
        </span>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white leading-tight">
          SABORES QUE <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
            TRASCIENDEN
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
          La fusión perfecta entre alta cocina y tecnología. Reserva tu mesa o pide desde tu móvil en segundos.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a 
            href="#menu" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-900/40 w-full md:w-auto"
          >
            Ver la Carta
          </a>
          <a 
            href="#reservas" 
            className="group bg-transparent border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg transition-all backdrop-blur-md w-full md:w-auto flex items-center justify-center gap-2"
          >
            Reservar Mesa
          </a>
        </div>
      </div>
    </div>
  );
}
