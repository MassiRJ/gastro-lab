"use client";
export default function Testimonials() {
  return (
    <section className="py-20 bg-black text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Lo que dicen de nosotros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
            <p className="text-gray-300 italic mb-4">"La mejor experiencia gastronómica en Barranca. La tecnología hace todo súper fluido."</p>
            <h4 className="font-bold text-emerald-500">- Carlos M.</h4>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
            <p className="text-gray-300 italic mb-4">"Increíble sabor y atención. Reservar por la web fue facilísimo."</p>
            <h4 className="font-bold text-emerald-500">- Ana P.</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
