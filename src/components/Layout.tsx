'use client';

import Header from "./Header";
import Footer from "./Footer";
import { DataProvider } from '@/app/context/DataContext';

export default function Layout({ children }) {
  return (
    <DataProvider>
      <div className="container mx-auto p-4">
        <Header />
        <main className="mt-8">{children}</main>
        <Footer />
      </div>
    </DataProvider>
  );
}