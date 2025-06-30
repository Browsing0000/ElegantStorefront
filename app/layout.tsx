import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModernCommerce - E-commerce, Prototyping & 3D Printing",
  description: "Your one-stop destination for e-commerce, prototyping, and 3D printing services.",
  keywords: "e-commerce, prototyping, 3D printing, online store, custom manufacturing",
  authors: [{ name: "ModernCommerce" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "ModernCommerce - E-commerce, Prototyping & 3D Printing",
    description: "Your one-stop destination for e-commerce, prototyping, and 3D printing services.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}