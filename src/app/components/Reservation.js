"use client";
export default function Reservation() {
  return (
    <section id="reservas" className="py-20 bg-zinc-900/50 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Reserva tu Experiencia</h2>
        <p className="text-gray-400 mb-8">Asegura tu mesa en segundos. Confirmación inmediata a tu WhatsApp.</p>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          <input type="text" placeholder="Nombre completo" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
          <input type="tel" placeholder="Teléfono" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
          <input type="date" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
          <select className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none">
            <option>2 Personas</option>
            <option>3-4 Personas</option>
            <option>5+ Personas</option>
          </select>
          <button className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-lg font-bold mt-4 transition-all">
            Confirmar Reserva
          </button>
        </form>
      </div>
    </section>
  );
}
