import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 border-b">
            <h1 className="text-2xl font-bold">Wuwa Planner</h1>
            <nav className="space-x-4">
                <Link href="/" className="text-blue-600 hover:underline">
                    Home
                </Link>
                <Link href="/planner" className="text-blue-600 hover:underline">
                    Planner
                </Link>
                <Link href="/items" className="text-blue-600 hover:underline">
                    Items
                </Link>
            </nav>
        </header>
    );
}