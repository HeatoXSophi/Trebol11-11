"use client"

import { useEffect, useState } from "react"
import { Wallet } from "lucide-react"
import { getUserBalance } from "@/app/actions/user"
import { useSession } from "next-auth/react"

export function BalanceDisplay({ initialBalance }: { initialBalance: number }) {
    const [balance, setBalance] = useState(initialBalance)
    const { data: session } = useSession()

    useEffect(() => {
        // Fetch fresh balance on mount and when session exists
        if (session) {
            getUserBalance().then(bal => {
                if (bal !== null) setBalance(bal)
            })
        }
    }, [session])

    return (
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-gold-500/20 rounded-full">
            <Wallet className="h-4 w-4 text-gold-500" />
            <span className="text-sm font-bold text-white">
                ${balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
        </div>
    )
}
