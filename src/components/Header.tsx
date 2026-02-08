import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 border-b">
            <h1 className="text-2xl font-bold">Wuwa Planner</h1>
            <DarkModeToggle />
            <nav className="space-x-4">
                {process.env.NODE_ENV === "development" && (
                    <>
                        <Button asChild>
                            <Link href="/">
                                Home
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href="/items">
                                Items
                            </Link>
                        </Button>
                    </>
                )}
                <Button asChild>
                    <Link href="/map">
                        Map
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/union-level">
                        Union Level
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/recipes">
                        Recipes
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/planner">
                        Planner
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/echo-simulation">
                        Echo Roll Simulator
                    </Link>
                </Button>
            </nav>
        </header >
    );
}