import type { Metadata } from "next";
import { CharacterProvider } from "@/providers/CharacterProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DataProvider } from "@/providers/DataProvider";
import { InventoryProvider } from "@/providers/InventoryProvider";
import { WeaponProvider } from "@/providers/WeaponProvider";

export const metadata: Metadata = {
  title: "WaveTools",
  description: "Echo simulator and others",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <CharacterProvider>
        <WeaponProvider>
          <InventoryProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="m-6 flex-1">{children}</main>
              <Footer />
            </div>
          </InventoryProvider>
        </WeaponProvider>
      </CharacterProvider>
    </DataProvider>
  );
}
