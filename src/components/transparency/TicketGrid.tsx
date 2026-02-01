"use client"

import * as React from "react"
import { Search, ChevronLeft, ChevronRight, Dna } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Ticket, TicketStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TicketGridProps {
    initialTickets?: Ticket[]
}

const ITEMS_PER_PAGE = 200

export function TicketGrid({ initialTickets = [] }: TicketGridProps) {
    const [tickets, setTickets] = React.useState<Ticket[]>(initialTickets)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState<TicketStatus | 'ALL'>('ALL')

    // Generate all 10,000 numbers virtually
    const allNumbers = React.useMemo(() => {
        return Array.from({ length: 10000 }, (_, i) => {
            const numberStr = i.toString().padStart(4, "0")
            // Find if this ticket has a special status
            const existingTicket = tickets.find((t) => t.number === numberStr)
            return {
                id: existingTicket?.id || `temp-${numberStr}`,
                number: numberStr,
                status: existingTicket?.status || "AVAILABLE",
            }
        })
    }, [tickets])

    // Filter logic
    const filteredNumbers = React.useMemo(() => {
        return allNumbers.filter((ticket) => {
            const matchesSearch = ticket.number.includes(searchQuery)
            const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus
            return matchesSearch && matchesStatus
        })
    }, [allNumbers, searchQuery, filterStatus])

    // Pagination logic
    const totalPages = Math.ceil(filteredNumbers.length / ITEMS_PER_PAGE)
    const paginatedNumbers = filteredNumbers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Quick Random Logic (Selection simulation)
    const handleRandom = () => {
        const available = filteredNumbers.filter(t => t.status === 'AVAILABLE')
        if (available.length > 0) {
            const randomIndex = Math.floor(Math.random() * available.length)
            const randomTicket = available[randomIndex]
            setSearchQuery(randomTicket.number)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar número (0000-9999)..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1) // Reset to page 1 on search
                            }}
                        />
                    </div>
                    <Button variant="outline" onClick={handleRandom}>
                        <Dna className="mr-2 h-4 w-4" />
                        Aleatorio
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                            <span>Disponible</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500 border border-red-500"></div>
                            <span>Vendido</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-amber-500 border border-amber-500"></div>
                            <span>Reservado</span>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20">
                        {paginatedNumbers.map((ticket) => (
                            <Button
                                key={ticket.id}
                                variant="outline"
                                className={cn(
                                    "h-10 w-full p-0 font-mono text-sm transition-all hover:scale-110",
                                    ticket.status === "AVAILABLE" && "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/20 hover:border-emerald-500 text-emerald-500",
                                    ticket.status === "SOLD" && "border-red-500 bg-red-500 text-white hover:bg-red-600",
                                    ticket.status === "RESERVED" && "border-amber-500 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                                )}
                                disabled={ticket.status === "SOLD"}
                            >
                                {ticket.number}
                            </Button>
                        ))}
                    </div>

                    {filteredNumbers.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            No se encontraron números con ese criterio.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {Math.min(filteredNumbers.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-
                        {Math.min(filteredNumbers.length, currentPage * ITEMS_PER_PAGE)} de {filteredNumbers.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
