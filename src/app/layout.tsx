import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AI } from "./action";
import { CurrentWorkout } from "@/components/CurrentWorkout";
import { useRouter } from "next/navigation";

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
          <body className={`${inter.className}`}>
            {/* scuffed as all hell, but whatever */}
            <CurrentWorkout />
            {children}
          </body>
        </AI>
      </ClerkProvider>
    </html>
  );
}
