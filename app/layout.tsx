import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "MC Marketplace",
  description: "Buy and sell premium Minecraft accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
