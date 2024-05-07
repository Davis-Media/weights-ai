import type { Metadata, Viewport } from "next";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";
import { AI } from "./action";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Matterhorn AI",
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
      <AI>
        <TRPCReactProvider>
          <body
            className={`${GeistMono.variable} ${GeistSans.variable} font-geistSans`}
          >
            <NavBar />
            {/* scuffed as all hell, but whatever */}
            {children}
          </body>
        </TRPCReactProvider>
      </AI>
    </html>
  );
}
