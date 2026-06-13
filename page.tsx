'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    // Clear cart from localStorage
    localStorage.removeItem('koopey-cart')
  }, [])

  return (
    <main style={{
      minHeight: '100vh', background: '#F5F0E8',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '2rem',
      opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        {/* Jaguar icon */}
        <div style={{ marginBottom: '2rem' }}>
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="#2C4A2E" />
            <g fill="white">
              <ellipse cx="42" cy="44" rx="18" ry="8" transform="rotate(-10 42 44)" />
              <circle cx="24" cy="36" r="7" />
              <polygon points="19,30 22,23 26,30" />
              <polygon points="24,30 27,23 30,30" />
              <path d="M58 40 Q66 36 68 28 Q66 24 62 26 Q64 32 58 38Z" />
              <rect x="28" y="49" width="5" height="10" rx="2" />
              <rect x="36" y="51" width="5" height="9" rx="2" />
              <rect x="44" y="51" width="5" height="9" rx="2" />
              <rect x="52" y="48" width="5" height="10" rx="2" />
            </g>
          </svg>
        </div>

        <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6B6458', marginBottom: '1rem' }}>
          koopey_mx
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px,6vw,64px)', fontWeight: 300, color: '#1A1814', lineHeight: 1, marginBottom: '1.5rem' }}>
          ¡Gracias por<br /><em>tu pedido!</em>
        </h1>

        <p style={{ fontSize: 14, color: '#6B6458', lineHeight: 1.8, marginBottom: '1rem', fontWeight: 300 }}>
          Hemos recibido tu compra correctamente. En breve recibirás un correo de confirmación con todos los detalles.
        </p>

        {sessionId && (
          <p style={{ fontSize: 11, color: '#C8BFB0', letterSpacing: '0.08em', marginBottom: '3rem', fontFamily: 'monospace' }}>
            Ref: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{ display: 'inline-block', padding: '14px 36px', background: '#1A1814', color: '#F5F0E8', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
