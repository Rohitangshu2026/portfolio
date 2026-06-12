import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohitangshu's Sketchbook",
  description:
    "An interactive sketchbook portfolio — wander a hand-drawn hallway and step into the rooms of a backend engineer's mind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${caveat.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
