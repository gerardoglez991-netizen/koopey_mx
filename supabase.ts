import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type Product = {
  id: string
  name: string
  subtitle: string
  description: string
  price: number
  badge: string | null
  category: string
  images: string[]
  materials: string
  stripe_price_id: string
  in_stock: boolean
  sort_order: number
}

export type Order = {
  id: string
  stripe_session_id: string
  customer_email: string
  customer_name: string
  amount_total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  items: OrderItem[]
  shipping_address: ShippingAddress
  created_at: string
}

export type OrderItem = {
  product_id: string
  name: string
  size: string
  quantity: number
  price: number
  image: string
}

export type ShippingAddress = {
  line1: string
  city: string
  postal_code: string
  country: string
}

export type Subscriber = {
  id: string
  email: string
  created_at: string
}
