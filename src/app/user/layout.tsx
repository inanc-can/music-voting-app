// app/layout.tsx
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Music Voting App",
  description: "Vote for your favorite music tracks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-gray-800 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300`}
      >
        <main className="flex-grow">{children}</main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
