import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        beige: { 50:'#FAF9F6', 100:'#F5F0E8', 200:'#EDE8DE', 300:'#C8BFB0' },
        brand: { dark:'#1A1814', mid:'#6B6458', accent:'#2C4A2E' },
      },
      fontFamily: {
        display: ['var(--font-cormorant)','Georgia','serif'],
        sans: ['var(--font-inter)','system-ui','sans-serif'],
      },
      animation: { marquee: 'marquee 25s linear infinite' },
      keyframes: { marquee: { '0%':{transform:'translateX(0)'},'100%':{transform:'translateX(-50%)'} } },
    },
  },
  plugins: [],
}
export default config
