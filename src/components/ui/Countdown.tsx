"use client"
import { useEffect, useState } from "react"

export function Countdown({ targetDate }: { targetDate: Date | string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const target = new Date(targetDate).getTime()

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = target - now

            if (distance < 0) {
                clearInterval(interval)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <div className="flex gap-4 text-center">
            <div className="bg-black/50 border border-gold-500/20 rounded p-2 min-w-[60px]">
                <div className="text-2xl font-black text-white">{timeLeft.days}</div>
                <div className="text-xs text-gold-500 uppercase">Días</div>
            </div>
            <div className="bg-black/50 border border-gold-500/20 rounded p-2 min-w-[60px]">
                <div className="text-2xl font-black text-white">{timeLeft.hours}</div>
                <div className="text-xs text-gold-500 uppercase">Hrs</div>
            </div>
            <div className="bg-black/50 border border-gold-500/20 rounded p-2 min-w-[60px]">
                <div className="text-2xl font-black text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-gold-500 uppercase">Min</div>
            </div>
            <div className="bg-black/50 border border-gold-500/20 rounded p-2 min-w-[60px]">
                <div className="text-2xl font-black text-white">{timeLeft.seconds}</div>
                <div className="text-xs text-gold-500 uppercase">Seg</div>
            </div>
        </div>
    )
}
