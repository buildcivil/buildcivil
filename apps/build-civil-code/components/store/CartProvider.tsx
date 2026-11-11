'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { StoreProduct } from '@buildcivil/cms/store'

export type CartItem = {
  productId: string
  slug: string
  name: string
  image: string
  unit: string
  price: number
  quantity: number
  minOrderQty: number
}

type CartContextValue = {
  items: CartItem[]
  ready: boolean
  count: number
  subtotal: number
  addItem: (product: StoreProduct, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const STORAGE_KEY = 'buildcivil-store-cart-v1'
const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        item && typeof item.productId === 'string' && typeof item.price === 'number' && typeof item.quantity === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(readStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be blocked (private mode); the cart still works for this visit.
    }
  }, [items, ready])

  const addItem = useCallback((product: StoreProduct, quantity?: number) => {
    const qty = Math.max(product.minOrderQty, Math.floor(quantity ?? product.minOrderQty))
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, price: product.price, quantity: item.quantity + qty } : item,
        )
      }
      return [
        ...current,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          unit: product.unit,
          price: product.price,
          quantity: qty,
          minOrderQty: product.minOrderQty,
        },
      ]
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(item.minOrderQty, Math.min(100000, Math.floor(quantity) || item.minOrderQty)) }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>.')
  return context
}
