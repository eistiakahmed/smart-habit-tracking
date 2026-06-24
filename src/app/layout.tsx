import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Habit Tracker - Build Better Habits",
  description: "Track your daily habits and achieve your goals with our minimal 30-day habit tracker",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#050a15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050a15] text-[#f8fafc] overflow-x-hidden relative">
        {/* Ambient Gradient Background Glows */}
        <div className="fixed top-[-12%] left-[-18%] w-[18rem] sm:w-[50%] h-[18rem] sm:h-[50%] rounded-full bg-indigo-900/10 blur-[70px] sm:blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-[-12%] right-[-18%] w-[20rem] sm:w-[55%] h-[20rem] sm:h-[55%] rounded-full bg-purple-950/10 blur-[80px] sm:blur-[120px] pointer-events-none z-0" />
        
        <AuthProvider>
          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
