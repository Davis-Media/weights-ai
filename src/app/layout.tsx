import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AI } from "./action";

const inter = Inter({ subsets: ["latin"] });

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
      <ClerkProvider>
        <AI>
          <body className={inter.className}>{children}</body>
        </AI>
      </ClerkProvider>
    </html>
  );
}
