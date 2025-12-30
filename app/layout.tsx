import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import GlassBackground from "@/components/Shared/GlassBackground";
import ThemeToggle from "@/components/Shared/ThemeToggle";
import { Providers } from "@/components/Shared/Providers";

export const metadata: Metadata = {
  title: "Glass Market",
  description: "A website to simplify selling and buying Minecraft accounts.",
  openGraph: {
    title: "Glass Market",
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
        <GlassBackground />
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
        <ThemeToggle />
      </body>
    </html>
  );
}
