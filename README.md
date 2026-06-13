# koopey_mx — Guía de Despliegue Completa

## Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Pagos**: Stripe Checkout
- **Hosting**: Vercel (gratis)

---

## PASO 1 — Supabase

1. Ve a [supabase.com](https://supabase.com) → **New Project**
2. Ponle nombre: `koopey-mx`
3. Guarda la contraseña de la base de datos
4. En el panel → **SQL Editor** → pega el contenido de `supabase-schema.sql` → **Run**
5. En **Settings → API** copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Subir imágenes a Supabase Storage
1. **Storage** → **New bucket** → nombre: `images` → Public: ✅
2. Sube tus fotos de producto (los archivos .jpg/.png que tienes)
3. Las URLs quedarán como: `https://TU_PROYECTO.supabase.co/storage/v1/object/public/images/polo-verde-agua.jpg`
4. Actualiza las URLs en la tabla `products` (SQL Editor):
   ```sql
   UPDATE products SET images = ARRAY['https://TU_PROYECTO.supabase.co/storage/v1/object/public/images/polo-verde-agua.jpg'] WHERE name = 'Polo Verde Agua';
   -- Repite para cada producto
   ```

---

## PASO 2 — Stripe

1. Ve a [stripe.com](https://stripe.com) → crea una cuenta
2. En el Dashboard → **Developers → API Keys** copia:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Crea los precios de los productos:
   - **Products** → **Add product** → para cada polo/camisa
   - Copia el `Price ID` (empieza con `price_`) → actualiza en Supabase:
     ```sql
     UPDATE products SET stripe_price_id = 'price_TU_ID' WHERE name = 'Polo Verde Agua';
     ```
4. **Webhooks** → **Add endpoint**:
   - URL: `https://koopey-mx.vercel.app/api/webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copia `Signing secret` → `STRIPE_WEBHOOK_SECRET`

---

## PASO 3 — Vercel

1. Ve a [vercel.com](https://vercel.com) → **New Project**
2. Conecta tu cuenta de GitHub
3. Sube este proyecto a GitHub:
   ```bash
   cd koopey_mx
   git init
   git add .
   git commit -m "🐆 koopey_mx initial commit"
   git remote add origin https://github.com/TU_USUARIO/koopey-mx.git
   git push -u origin main
   ```
4. En Vercel → importa el repo `koopey-mx`
5. **Environment Variables** → añade todas las variables del archivo `.env.example` con sus valores reales
6. **Deploy** → Vercel construye y despliega automáticamente

### Dominio personalizado (opcional)
- Vercel Dashboard → **Domains** → añade tu dominio
- Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio real

---

## PASO 4 — Imagen hero

Copia tu foto del yate (`IMG_3016.png`) a la carpeta `public/` con el nombre `hero-bg.jpg`:
```bash
cp /ruta/a/IMG_3016.png public/hero-bg.jpg
```

---

## PASO 5 — Imágenes de producto

Copia tus fotos de producto a `public/images/`:
```bash
cp IMG_2990.jpeg public/images/polo-verde-agua.jpg
cp IMG_2997.jpeg public/images/polo-verde-oliva.jpg
cp IMG_2986.png  public/images/polo-verde-oscuro.jpg
cp IMG_2993.jpeg public/images/polo-azul-marino.jpg
cp IMG_2981.png  public/images/camiseta-rayas.jpg
cp IMG_2946.png  public/images/camisa-rosa.jpg
```

---

## Desarrollo local

```bash
cd koopey_mx
cp .env.example .env.local
# Edita .env.local con tus claves reales
npm install
npm run dev
# Abre http://localhost:3000
```

---

## Estructura del proyecto

```
koopey_mx/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Landing "Próximamente"
│   │   ├── layout.tsx                  ← HTML root, metadatos SEO
│   │   ├── success/page.tsx            ← Confirmación de pago
│   │   └── api/
│   │       ├── subscribe/route.ts      ← Newsletter → Supabase
│   │       ├── products/route.ts       ← Catálogo desde Supabase
│   │       ├── create-checkout-session/route.ts  ← Stripe checkout
│   │       └── webhook/route.ts        ← Eventos Stripe → Supabase
│   ├── lib/
│   │   ├── supabase.ts                 ← Cliente Supabase + tipos
│   │   ├── stripe.ts                   ← Cliente Stripe
│   │   ├── cart-store.ts               ← Carrito (Zustand, persistente)
│   │   └── products.ts                 ← Datos estáticos de fallback
│   └── styles/globals.css              ← CSS global + Tailwind
├── public/
│   ├── hero-bg.jpg                     ← Foto del yate SS'26
│   └── images/                         ← Fotos de producto
├── supabase-schema.sql                 ← Schema completo de la BD
├── vercel.json                         ← Config de despliegue
└── .env.example                        ← Variables de entorno
```

---

## ¿Cuándo quieres abrir la tienda?

Cuando llegue el 17.05.26 (o cuando tú decidas), la landing "Próximamente" se convierte en tienda completa simplemente actualizando `page.tsx` para mostrar el carrito y los precios. El backend (Stripe + Supabase) ya está listo.
