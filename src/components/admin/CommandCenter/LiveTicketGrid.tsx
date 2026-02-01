"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, User, CreditCard, Calendar, Filter, Copy, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import { getTicketStatus } from "@/app/actions/ticket-status"

// 10,000 Tickets (0000 - 9999)
const TOTAL_TICKETS = 10000;

type TicketData = {
    status: string;
    serialCode?: string;
    user?: {
        name: string | null;
        lastName: string | null;
        identification?: string | null;
        email: string | null;
        phone: string | null;
        payments?: { proofImage: string }[];
    };
    updatedAt?: Date;
}

export function LiveTicketGrid() {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'sold' | 'available'>('all');

    // Real Data State
    const [ticketMap, setTicketMap] = useState<Record<string, TicketData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ sold: 0, available: 10000 });

    // Fetch Data on Mount
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const result = await getTicketStatus();
                if (result.success && result.tickets && isMounted) {
                    setTicketMap(result.tickets);

                    // Calculate stats
                    const soldCount = Object.keys(result.tickets).length;
                    setStats({
                        sold: soldCount,
                        available: TOTAL_TICKETS - soldCount
                    });
                }
            } catch (error) {
                console.error("Failed to load tickets", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();

        // Optional: Poll every 10 seconds for live updates
        const interval = setInterval(fetchData, 10000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Memoize the full 10k array to avoid re-generating it on every render
    const allTickets = useMemo(() => {
        return Array.from({ length: TOTAL_TICKETS }).map((_, i) => {
            const numStr = i.toString().padStart(4, '0');
            return numStr;
        });
    }, []);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 1000;

    // Filter Logic
    const filteredTickets = useMemo(() => {
        const result = allTickets.filter(numStr => {
            const ticketData = ticketMap[numStr];
            const isSold = !!ticketData && ticketData.status !== 'AVAILABLE'; // Default to available if missing

            // Search Filter
            if (searchTerm && !numStr.includes(searchTerm)) return false;

            // Status Filter
            if (filter === 'sold' && !isSold) return false;
            if (filter === 'available' && isSold) return false;

            return true;
        });
        return result;
    }, [allTickets, ticketMap, searchTerm, filter]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderCentralPanel = () => {
        if (!selectedTicket) return null;

        const ticketData = ticketMap[selectedTicket];
        const isSold = !!ticketData && ticketData.status !== 'AVAILABLE';

        return (
            <div className="bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-[450px] animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/20">
                {/* Header with Ticket Visual */}
                <div className={`h-24 relative overflow-hidden p-6 flex items-center justify-between ${isSold ? 'bg-gradient-to-br from-red-600/20 to-zinc-900' : 'bg-gradient-to-br from-emerald-600/20 to-zinc-900'}`}>
                    <div className="z-10">
                        <h3 className="text-3xl font-black text-white tracking-tight">
                            #{selectedTicket}
                        </h3>
                        <p className="text-white/60 text-xs font-mono uppercase tracking-widest mt-1">
                            {ticketData.serialCode ? `Serial: ${ticketData.serialCode.slice(-6).toUpperCase()}` : 'Ticket Único'}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isSold ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                        {isSold ? 'VENDIDO' : 'DISPONIBLE'}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {isSold ? (
                        <>
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Detalles del Comprador</h4>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                        {ticketData.user?.name?.[0] || 'U'}{ticketData.user?.lastName?.[0] || ''}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {ticketData.user?.name} {ticketData.user?.lastName}
                                        </p>
                                        <p className="text-xs text-zinc-500 font-mono">{ticketData.user?.phone || 'No Phone'}</p>
                                    </div>
                                    <button className="text-zinc-600 hover:text-white" title="Ver Perfil"><ExternalLink className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-500">
                                        <CreditCard className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-bold">Comprobante</span>
                                    </div>
                                    {ticketData.user?.payments?.[0]?.proofImage ? (
                                        <a
                                            href={ticketData.user.payments[0].proofImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                                        >
                                            Ver Imagen <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <p className="text-xs text-zinc-500 italic">No disponible</p>
                                    )}
                                </div>
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-500">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-bold">Fecha</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-white">
                                            {ticketData.updatedAt ? new Date(ticketData.updatedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const text = `🎟️ TICKET: #${selectedTicket}\n👤 Usuario: ${ticketData.user?.name} ${ticketData.user?.lastName}\n🆔 ID: ${ticketData.user?.identification || ticketData.user?.phone}\n📆 Fecha: ${new Date(ticketData.updatedAt || new Date()).toLocaleDateString()}\n🔑 Serial: ${ticketData.serialCode || 'N/A'}`;
                                    navigator.clipboard.writeText(text);
                                    alert("¡Recibo copiado!");
                                }}
                                className="w-full py-3 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                                <Copy className="w-4 h-4" /> Copiar Recibo
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Copy className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Ticket Disponible</h4>
                            <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                                El número <span className="text-white font-bold">#{selectedTicket}</span> está libre.
                            </p>
                            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02]">
                                Asignar Manualmente
                            </button>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setSelectedTicket(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        )
    }

    return (
        <div className="h-full flex-1 bg-zinc-950 flex flex-col rounded-2xl border border-white/5 relative overflow-hidden">
            {/* Professional Toolbar */}
            <div className="h-16 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        MONITOR LIVE
                        <span className="text-zinc-600 hidden sm:inline">|</span>
                        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                            {isLoading ? 'SYNCING...' : `${stats.sold} VENDIDOS / ${stats.available} DISPO`}
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter Tabs */}
                    <div className="bg-black/50 p-1 rounded-lg border border-white/5 flex text-[10px] font-bold">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded ${filter === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >ALL</button>
                        <button
                            onClick={() => setFilter('sold')}
                            className={`px-3 py-1.5 rounded ${filter === 'sold' ? 'bg-red-900/50 text-red-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >SOLD</button>
                        <button
                            onClick={() => setFilter('available')}
                            className={`px-3 py-1.5 rounded ${filter === 'available' ? 'bg-emerald-900/50 text-emerald-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >OPEN</button>
                    </div>

                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar #..."
                            className="bg-black/50 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs w-28 focus:w-32 transition-all text-white placeholder-zinc-600 focus:outline-none focus:border-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Grid Viewport */}
            <div className="flex-1 relative min-h-0 bg-zinc-950 p-1 flex flex-col">
                {isLoading ? (
                    // ... loading state
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <p className="text-xs text-zinc-500 animate-pulse">Sincronizando 10,000 Tickets...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-600 pr-1">
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(46px,1fr))] gap-1 p-4 content-start">
                                {paginatedTickets.map((numStr) => {

                                    const ticketData = ticketMap[numStr];
                                    const isSold = !!ticketData && ticketData.status !== 'AVAILABLE';
                                    const isSelected = selectedTicket === numStr;

                                    return (
                                        <div
                                            key={numStr}
                                            onClick={() => setSelectedTicket(numStr)}
                                            className={`
                                            aspect-square rounded-[4px] cursor-pointer transition-all duration-150 flex items-center justify-center
                                            text-[10px] font-mono font-bold tracking-tight border
                                            ${isSelected
                                                    ? 'ring-2 ring-white z-10 scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)] border-white bg-zinc-900 text-white'
                                                    : ''}
                                            ${!isSelected && isSold
                                                    ? 'bg-red-900/40 border-red-800/50 text-red-400 hover:bg-red-800 hover:text-white shadow-[0_0_5px_rgba(220,38,38,0.1)]'
                                                    : ''}
                                            ${!isSelected && !isSold
                                                    ? 'bg-zinc-900/50 border-white/5 text-zinc-600 hover:bg-emerald-900/30 hover:text-emerald-400 hover:border-emerald-500/30'
                                                    : ''}
                                        `}
                                        >
                                            {numStr}
                                        </div>
                                    )
                                })}

                                {/* Pagination Controls */}
                            </div>
                        </div>
                        <div className="h-12 border-t border-white/5 bg-zinc-900/80 backdrop-blur flex items-center justify-between px-4 shrink-0">
                            <div className="text-xs text-zinc-500">
                                Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white">{totalPages || 1}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs disabled:opacity-50 rounded"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs disabled:opacity-50 rounded"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Detail Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-colors duration-300 ${selectedTicket ? 'bg-black/50 backdrop-blur-[2px]' : ''}`}>
                    <div className="pointer-events-auto">
                        {renderCentralPanel()}
                    </div>
                </div>
            </div>
            )
}
