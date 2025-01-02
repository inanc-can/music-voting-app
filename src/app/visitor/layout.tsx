// app/layout.tsx
"use client";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br 
   from-gray-900 via-purple-900 to-indigo-900 transition-colors duration-300`}
      >
        <main className="flex-grow">{children}</main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
