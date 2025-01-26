import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <main className="mt-8">{children}</main>
      <Footer />
    </div>
  );
}