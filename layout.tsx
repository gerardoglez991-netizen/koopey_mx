import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'koopey_mx — SS\'26 Próximamente',
  description: 'Moda masculina de lujo casual. Inspirada en el Mediterráneo. Lanzamiento SS\'26.',
  openGraph: {
    title: 'koopey_mx',
    description: 'Luxury Summer Collection SS\'26 — Próximamente',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'koopey_mx — SS\'26',
    description: 'Próximamente. Luxury Summer Collection.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
