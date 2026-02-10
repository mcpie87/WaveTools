export default function Footer() {
    return (
        <footer className="mt-auto p-6 text-center text-text-secondary border-t border-base-300">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <span>© 2026 WaveTools</span>
                <span className="hidden sm:inline">•</span>
                <a
                    href="https://github.com/mcpie87/WaveTools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                >
                    GitHub
                </a>
                <a
                    href="https://discord.com/users/198738007388454912"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                >
                    Discord
                </a>
            </div>
        </footer>
    );
}