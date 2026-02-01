export type TicketStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD'

export interface Ticket {
    id: string
    number: string
    status: TicketStatus
    userId?: string
    drawId?: string
}

export interface User {
    id: string
    name: string
    identification: string
    phone: string
    role: 'USER' | 'ADMIN'
}
