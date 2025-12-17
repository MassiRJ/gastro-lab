import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gastro • Lab | Experiencia Culinaria",
  description: "El mejor restaurante de alta cocina con sistema de pedidos digitales.",
  icons: {
    icon: "/favicon.ico", // (Opcional si tienes un icono)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* AGREGAMOS suppressHydrationWarning AQUÍ ABAJO */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}