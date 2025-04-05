import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 border-b">
            <h1 className="text-2xl font-bold">Wuwa Planner</h1>
            <DarkModeToggle />
            <nav className="space-x-4">
                {process.env.NODE_ENV === "development" && (
                    <>
                        <Link href="/" className="text-blue-600 hover:underline">
                            Home
                        </Link>

                        <Link href="/items" className="text-blue-600 hover:underline">
                            Items
                        </Link>
                    </>
                )}
                <Link href="/recipes" className="text-blue-600 hover:underline">
                    Recipes
                </Link>
                <Link href="/planner" className="text-blue-600 hover:underline">
                    Planner
                </Link>
                <Link href="/echo-simulation" className="text-blue-600 hover:underline">
                    Echo Roll Simulator
                </Link>
            </nav>
        </header>
    );
}