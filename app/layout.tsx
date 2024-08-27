import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CharacterProvider } from './context/CharacterContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D&D Web Adventure",
  description: "An interactive D&D-style web game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CharacterProvider>
          {children}
        </CharacterProvider>
      </body>
    </html>
  );
}
