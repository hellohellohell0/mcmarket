import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";


export const metadata: Metadata = {
  title: "MCMarket",
  description: "A website to simplify selling and buying Minecraft accounts.",
  openGraph: {
    title: "MCMarket",
    description: "A website to simplify selling and buying Minecraft accounts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
