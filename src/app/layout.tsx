import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";
import { AI } from "./action";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Weights AI",
  description: "A basic GPT wrapper, built to show off Gen AI UI",
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
