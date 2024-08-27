import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CharacterProvider } from './context/CharacterContext';
import { GameStateProvider } from './context/GameStateContext';

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
      <head>
        {/* ... preload links ... */}
      </head>
      <body className={inter.className}>
        <GameStateProvider>
          <CharacterProvider>
            {children}
          </CharacterProvider>
        </GameStateProvider>
      </body>
    </html>
  );
}
