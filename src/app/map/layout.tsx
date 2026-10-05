import type { Metadata } from "next";
import "../globals.css";
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
    <div className="mx-auto">
      <Header collapsible />
      <main>{children}</main>
    </div>
  );
}
