import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo y Slogan */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tighter">GASTRO • LAB</h2>
            <p className="text-gray-500 text-sm mt-2">© 2025 Todos los derechos reservados.</p>
          </div>

          {/* Links Rápidos */}
          <div className="flex gap-8 text-gray-400 text-sm">
            <a href="#" className="hover:text-yellow-500 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Términos</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Contacto</a>
          </div>

          {/* Redes Sociales */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all">
              <Twitter size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}