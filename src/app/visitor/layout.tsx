// app/layout.tsx
"use client";
import { Space_Grotesk } from "next/font/google";
const inter = Space_Grotesk({ subsets: ["latin"] });
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br 
   from-gray-900 via-purple-900 to-indigo-900 transition-colors duration-300`}
      >
        <main className="flex-grow">{children}</main>
        <SpeedInsights />

        <div className="flex justify-evenly mb-12">
          <Button
            variant="secondary"
            onClick={() => router.push("visitor/sign-in")}
          >
            Sign In
          </Button>
        </div>
      </body>
    </html>
  );
}
