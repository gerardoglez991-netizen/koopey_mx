'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  size: string
  image: string
  quantity: number
  stripe_price_id: string
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const key = `${item.id}-${item.size}`
        const existing = get().items.find(i => `${i.id}-${i.size}` === key)
        if (existing) {
          set(s => ({ items: s.items.map(i => `${i.id}-${i.size}` === key ? { ...i, quantity: i.quantity + item.quantity } : i) }))
        } else {
          set(s => ({ items: [...s.items, item] }))
        }
        set({ isOpen: true })
      },
      removeItem: (id, size) => set(s => ({ items: s.items.filter(i => !(i.id === id && i.size === size)) })),
      updateQuantity: (id, size, qty) => {
        if (qty <= 0) { get().removeItem(id, size); return }
        set(s => ({ items: s.items.map(i => i.id === id && i.size === size ? { ...i, quantity: qty } : i) }))
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'koopey-cart' }
  )
)
