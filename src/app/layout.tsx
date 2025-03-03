import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CharacterProvider } from "@/providers/CharacterProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DataProvider } from "@/providers/DataProvider";
import { ItemProvider } from "@/providers/ItemProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wuwa Planner",
  description: "Echo simulator and others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DataProvider>
          <CharacterProvider>
            <ItemProvider>
              <div className="container mx-auto">
                <Header />
                <main className="mt-8">{children}</main>
                <Footer />
              </div>
            </ItemProvider>
          </CharacterProvider>
        </DataProvider>
      </body>
    </html>
  );
}
