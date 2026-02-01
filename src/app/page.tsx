"use client"

import { TicketSelector } from "@/components/tickets/TicketSelector"
import { Trophy, TrendingUp, ShieldCheck, Star, Ticket } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Countdown } from "@/components/ui/Countdown"

import { getLatestDraw, getLastWinner } from "@/app/actions/admin"
import { useEffect, useState } from "react"

export default function Home() {
  const [draw, setDraw] = useState<any>(null)
  const [winner, setWinner] = useState<any>(null)

  useEffect(() => {
    getLatestDraw().then(setDraw)
    getLastWinner().then(setWinner)
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-gold-500/30 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-600/10 blur-[150px] pointer-events-none" />

      <Header />

      {/* HERO: GRAND PRIZE SECTION */}
      <section className="relative pt-8 pb-12 lg:pt-16 overflow-hidden">
        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center mb-10 space-y-4 animate-in fade-in slide-in-from-top-6 duration-1000 relative">

            {/* Background Golden Rays & Particles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[150%] h-[150%] pointer-events-none">
              {/* Central Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)] blur-2xl"></div>

              {/* Rotating Rays - Stronger (Statoc) */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(212,175,55,0.2)_10deg,transparent_20deg,rgba(212,175,55,0.2)_30deg,transparent_40deg,rgba(212,175,55,0.2)_50deg,transparent_60deg,rgba(212,175,55,0.2)_70deg,transparent_80deg,rgba(212,175,55,0.2)_90deg,transparent_100deg,rgba(212,175,55,0.2)_110deg,transparent_120deg,rgba(212,175,55,0.2)_130deg,transparent_140deg,rgba(212,175,55,0.2)_150deg,transparent_160deg,rgba(212,175,55,0.2)_170deg,transparent_180deg,rgba(212,175,55,0.2)_190deg,transparent_200deg,rgba(212,175,55,0.2)_210deg,transparent_220deg,rgba(212,175,55,0.2)_230deg,transparent_240deg,rgba(212,175,55,0.2)_250deg,transparent_260deg,rgba(212,175,55,0.2)_270deg,transparent_280deg,rgba(212,175,55,0.2)_290deg,transparent_300deg,rgba(212,175,55,0.2)_310deg,transparent_320deg,rgba(212,175,55,0.2)_330deg,transparent_340deg,rgba(212,175,55,0.2)_350deg,transparent_360deg)] opacity-60"></div>

              {/* Floating Particles - Brighter */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gold-400 rounded-full animate-bounce delay-700 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
              <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              <div className="absolute top-1/2 left-10 w-1.5 h-1.5 bg-gold-300 rounded-full animate-ping delay-300"></div>
              <div className="absolute top-10 right-1/4 w-2 h-2 bg-gold-500 rounded-full animate-bounce duration-1000 opacity-80"></div>
              <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-yellow-200 rounded-full animate-pulse duration-700"></div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 text-sm font-bold text-gold-400 uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Star className="h-4 w-4 fill-gold-500 animate-pulse" />
              Premio Mayor del Día
              <Star className="h-4 w-4 fill-gold-500 animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-600 drop-shadow-2xl relative z-10">
              {draw?.prizeTitle?.split(" ")[0] || "MERCEDES"}
              <span className="block text-4xl md:text-5xl mt-2 text-white/90 font-extrabold tracking-tight">
                {draw?.prizeTitle?.split(" ").slice(1).join(" ") || "BENZ AMG GT 2024"}
              </span>
            </h1>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-3xl md:text-4xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:scale-105 transition-transform cursor-default border border-red-400/50">
                ${draw?.prizeAmount?.toLocaleString() || "185,000"} USD
              </div>
            </div>
          </div>

          {/* Hero Image Mockup */}
          <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

            {/* Placeholder / Loading State */}
            {!draw && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-20">
                <div className="h-12 w-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Dynamic Image Background Layer */}
            <div
              className={`absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110 transition-opacity duration-700 ${draw ? 'opacity-50' : 'opacity-0'}`}
              style={{ backgroundImage: draw?.prizeImage ? `url('${draw.prizeImage}')` : 'none' }}
            ></div>

            {/* Main Image */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center transition-opacity duration-500 ${draw ? 'opacity-100' : 'opacity-0'}`}>
              {draw?.prizeImage && (
                <img
                  src={draw.prizeImage}
                  alt="Premio"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col md:flex-row items-end justify-between gap-6">
              <div className="text-left space-y-4">
                <div>
                  <p className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-1">
                    {draw?.date ? `JUEGA EL ${new Date(draw.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}` : "PRÓXIMAMENTE"}
                  </p>
                  <p className="text-zinc-300 text-sm max-w-md shadow-black drop-shadow-md">
                    {draw?.prizeDescription || "¡El gran premio del día puede ser tuyo!"}
                  </p>
                </div>

                {draw?.date && (
                  <div>
                    <p className="text-xs text-zinc-400 mb-1 uppercase tracking-widest">Tiempo Restante</p>
                    <Countdown targetDate={draw.date} />
                  </div>
                )}
              </div>
              {/* Calculator moved here? No, let's keep it distinctive */}
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY SECTION: ACTION & WINNERS */}
      <section className="relative z-10 py-12 md:py-20 border-t border-white/5 bg-black/40">
        <div className="container relative z-10 grid gap-16 lg:grid-cols-2 lg:items-start">

          {/* Left Content: Last Winner (Moved Down) */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                RESULTADOS <br />
                <span className="text-gold-500">TRANSPARENTES</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-lg">
                Verifica quién ganó ayer. Resultados certificados por la lotería oficial a las 10:00 PM.
              </p>
            </div>

            {/* Winner Card */}
            {winner ? (
              <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-zinc-900 to-black p-6 shadow-2xl max-w-md animate-in fade-in zoom-in duration-1000">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trophy className="h-32 w-32 text-gold-500" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest">Último Ganador</h3>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full border-2 border-gold-500/50 bg-zinc-800 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    🏆
                  </div>
                  <div>
                    {winner.hasWinner ? (
                      <>
                        <div className="text-2xl font-bold text-white leading-none mb-1">{winner.winnerName} {winner.winnerInitial}.</div>
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-200">
                          ${winner.prize?.toLocaleString()} USD
                        </div>
                        <div className="text-xs text-zinc-500 mt-2 font-mono">Ticket #{winner.ticketId} • Sorteo {new Date(winner.date).toLocaleDateString()}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-zinc-400 leading-none mb-1">Sin Ganador</div>
                        <div className="text-2xl font-black text-white">VACANTE</div>
                        <div className="text-xs text-zinc-500 mt-2 font-mono">Num: {winner.number} • Nadie lo tuvo</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-white/10 rounded-2xl bg-black/40 text-center">
                <p className="text-zinc-500 italic">Esperando resultados del próximo sorteo...</p>
              </div>
            )}
          </div>

          {/* Right Content: Calculator & Availability (Kept Side-by-Side with Winner info) */}
          <div className="space-y-8 sticky top-24">
            {/* Progress Bar Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-black/90 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-gold-500/5 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="flex items-end justify-between mb-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-white">Disponibilidad</h3>
                  <p className="text-sm text-zinc-400">Tickets restantes para el sorteo de HOY</p>
                </div>
                <div className="text-right">
                  {draw ? (
                    <>
                      <div className="text-3xl font-black text-gold-500 text-glow">
                        {(((10000 - (draw._count?.tickets || 0)) / 10000) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs font-bold text-red-400">
                        ¡SE AGOTAN!
                      </div>
                    </>
                  ) : (
                    <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded"></div>
                  )}
                </div>
              </div>

              <div className="h-6 w-full rounded-full bg-zinc-800/50 p-1 relative z-10 box-content border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-500 to-white shadow-[0_0_15px_rgba(212,175,55,0.6)] relative overflow-hidden transition-all duration-1000"
                  style={{ width: draw ? `${((10000 - (draw._count?.tickets || 0)) / 10000) * 100}%` : '0%' }}
                >
                  <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite] skew-x-[-20deg]"></div>
                </div>
              </div>
            </div>

            {/* Calculator Integration */}
            <div className="relative transform hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-gold-500 via-transparent to-purple-600 opacity-30 blur-sm pointer-events-none"></div>
              <TicketSelector pricePerTicket={draw?.ticketPrice || 2.0} />
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12 relative z-10">
        <div className="container grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <span className="text-2xl font-black italic text-white">
              TREBOL <span className="text-gold-500">11-11</span>
            </span>
            <p className="text-sm text-zinc-500 max-w-xs">
              La plataforma líder en sorteos transparentes. Resultados auditables y pagos instantáneos.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="/terms" className="hover:text-gold-500 transition-colors">Términos y Condiciones</a></li>
              <li><a href="/privacy" className="hover:text-gold-500 transition-colors">Política de Privacidad</a></li>
              <li><a href="/rules" className="hover:text-gold-500 transition-colors">Reglas del Sorteo</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">Contacto</h4>
            <p className="text-sm text-zinc-500">
              ¿Necesitas ayuda? <br />
              <a href="mailto:soporte@trebol11-11.com" className="text-gold-500 hover:underline">soporte@trebol11-11.com</a>
            </p>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
          <p>&copy; 2024 TREBOL 11-11. Todos los derechos reservados. Los resultados se basan en la lotería oficial de Super Gana (10:00 PM).</p>
        </div>
      </footer>
    </main>
  )
}
