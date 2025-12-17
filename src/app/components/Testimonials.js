"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Camila R.",
    role: "Crítica Gastronómica",
    comment: "La fusión de sabores es simplemente de otro planeta. El Bife de Chorizo es obligatorio.",
    rating: 5,
  },
  {
    id: 2,
    name: "Javier M.",
    role: "Cliente Frecuente",
    comment: "El mejor servicio de la ciudad. Poder pedir desde el celular sin esperar al mesero es un 10/10.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sofia L.",
    role: "Food Blogger",
    comment: "El ambiente es increíble para citas. La iluminación, la música y los cócteles son perfectos.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Lo que dicen de <span className="text-yellow-500">Nosotros</span></h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-yellow-500/50 transition-colors group"
            >
              <Quote className="text-yellow-500 mb-6 opacity-50 group-hover:opacity-100 transition-opacity" size={40} />
              
              <p className="text-gray-300 mb-6 italic">"{review.comment}"</p>
              
              <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-yellow-500 text-xs uppercase tracking-wider">{review.role}</p>
                </div>
                <div className="flex text-yellow-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-700" : ""} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}