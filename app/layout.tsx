import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/layout/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "400", "600"],
});

export const metadata: Metadata = {
  title: "Sonnen Frontend Task",
  description: "Sonnen.eg Frontend Task submitted by Amr Elnaggar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
