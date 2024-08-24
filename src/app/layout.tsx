// app/layout.tsx
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Space_Grotesk({ subsets: ["latin"] });

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
        <Providers>
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
