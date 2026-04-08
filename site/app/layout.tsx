import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Vibe Trading — Trade with data. Trade with purpose.",
  description: "Institutional macro trading community. Economic calendar, live market data, macro news, and community intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
