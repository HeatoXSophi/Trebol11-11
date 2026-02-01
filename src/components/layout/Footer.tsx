import Link from "next/link"
import { Lock } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-900 py-6 mt-12">
            <div className="container mx-auto px-4 flex justify-between items-center text-zinc-600 text-xs">
                <p>&copy; 2024 Trebol 11-11. Todos los derechos reservados.</p>

                {/* Hidden Admin Link */}
                <Link href="/admin/login" className="opacity-10 hover:opacity-100 transition-opacity p-2">
                    <Lock className="h-3 w-3" />
                </Link>
            </div>
        </footer>
    )
}
