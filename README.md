# Serene Rituals — Spa SME Website Demo

A responsive, spa-inspired **React + Vite + Framer Motion** website based on the supplied design reference. Made as a Malaysian SME concept website.

## Run locally

Make sure Node.js 18+ is installed.

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

The deployable static website will be inside `dist/`. Deploy it to Vercel, Netlify or a static host.

## Features

- Responsive desktop / tablet / mobile layouts
- Custom design system: warm ivory, deep forest green, elegant typography
- Framer Motion scroll reveals, entrance transitions and modal transitions
- Treatment cards, category filters, package listings
- Booking UI: treatment, date, time and therapist selection
- Booking summary, guest form, confirmation screen
- Reservations stored in the **browser's localStorage** as a demo (key: `serene-demo-bookings`)
- FAQ accordion, guest testimonials, newsletter demo form, navigation

## Important demo limitations

**The booking system does not check real availability or reserve real appointments.** Booking data is stored only in the current browser, and is not sent to a server or spa. There is no email sending, payment gateway, authentication or scheduling backend. Newsletter signups also only display an in-page confirmation. Testimonials, business address, contact details and offers are demonstration content. Do not use this as a production booking system without a secure backend and proper privacy controls.

## Customize

- `src/App.jsx` — company name, treatments, prices in MYR, content, hero imagery URLs, offers, testimonials, FAQ, booking UI.
- `src/styles.css` — all styling and responsive rules.
- `index.html` — browser title, SEO description and fonts.

Treatment photos are loaded from Unsplash URLs. Internet is required for those images and Google Fonts to display. Replace with your own licensed assets before launching a real business website.
