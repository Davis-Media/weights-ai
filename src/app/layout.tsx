import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AI } from "./action";
import { CurrentWorkout } from "@/components/workout/CurrentWorkout";
import Providers from "./providers";

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
      <AI>
        <Providers>
          <body className={`${inter.className}`}>
            {/* scuffed as all hell, but whatever */}
            <CurrentWorkout />
            {children}
          </body>
        </Providers>
      </AI>
    </html>
  );
}
