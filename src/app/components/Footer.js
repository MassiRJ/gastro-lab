"use client";
export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} GastroLab. Barranca, Perú.</p>
    </footer>
  );
}
