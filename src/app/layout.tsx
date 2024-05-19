import type { Metadata, Viewport } from "next";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";
import { AI } from "./action";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Weights AI",
  description: "Track your progress with the simplest AI weights tracker",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <AI>
        <TRPCReactProvider>
          <body
            className={`${GeistMono.variable} ${GeistSans.variable} font-geistSans w-full min-h-screen flex flex-col justify-between`}
          >
            <NavBar />
            {/* scuffed as all hell, but whatever */}
            {children}
            <Footer />
          </body>
        </TRPCReactProvider>
      </AI>
    </html>
  );
}
