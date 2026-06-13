import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Update order status to paid
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          customer_email: session.customer_email,
          customer_name: session.shipping_details?.name || '',
          amount_total: (session.amount_total || 0) / 100,
          shipping_address: session.shipping_details?.address || {},
        })
        .eq('stripe_session_id', session.id)

      if (error) {
        console.error('Supabase update error:', error)
      }

      console.log(`✅ Order paid: ${session.id} — ${session.customer_email}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      console.error(`❌ Payment failed: ${intent.id}`)
      break
    }

    default:
      console.log(`Unhandled event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
