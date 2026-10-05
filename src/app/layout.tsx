import SchemaGuard from "@/components/SchemaGuard";
import "./globals.css";
import { ClientInit } from "@/components/ClientInit";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-primary bg-[rgb(var(--base-100))]">
        <ClientInit>
          <SchemaGuard />
          {children}
        </ClientInit>
      </body>
    </html>
  );
}