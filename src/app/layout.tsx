import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-primary bg-base-100">
        {children}
      </body>
    </html>
  );
}