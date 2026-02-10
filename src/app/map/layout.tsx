import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClientInit } from "@/components/ClientInit";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Wuwa Map",
  description: "Interactive Map",
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className="text-primary bg-base-100">
        <ClientInit>
          <div className="mx-auto">
            <Header collapsible />
            <main>{children}</main>
          </div>
        </ClientInit>
      </body>
    </html>
  );
}
