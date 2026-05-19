import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Tunatumia font ya Inter (Default ya Next.js)
const inter = Inter({ subsets: ["latin"] });

// HAPA NDIPO TULIPOBADILISHA JINA LA TOVUTI 🔥
export const metadata: Metadata = {
  title: "Simba Dume Cargo",
  description: "Mfumo wa kisasa wa usafirishaji na ufuatiliaji wa mizigo (Cargo & Logistics).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}