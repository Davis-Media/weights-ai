import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";
import { AI } from "./action";
import Providers from "./providers";
import { Rethink_Sans } from "next/font/google";
import { Chivo } from "next/font/google";

const rethink_sans = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rethink_sans",
});
const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chivo",
});

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
        <Providers>
          <body className={rethink_sans.variable + chivo.variable}>
            <NavBar />
            {/* scuffed as all hell, but whatever */}
            {children}
          </body>
        </Providers>
      </AI>
    </html>
  );
}
