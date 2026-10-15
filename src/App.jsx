import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowRight, ArrowLeft, CalendarDays, Check, ChevronDown, Clock3, Flower2, Heart, Leaf, MapPin, Menu, Phone, Mail, Sparkles, Star, X, Instagram, Facebook, Wind, Droplets, HandHeart, CircleCheck, Play, Plus, Minus } from 'lucide-react'

const photos = {
  hero: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1550&q=85',
  oil: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
  massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=950&q=85',
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=950&q=85',
  stones: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=950&q=85',
  atmosphere: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1300&q=85',
  hands: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1100&q=85',
}
const services = [
  { id: 'aroma', category: 'Body', name: 'Aromatherapy Massage', duration: 60, price: 160, image: photos.massage, description: 'Release tension with soothing pressure and a bespoke blend of essential oils.', badge: 'Most loved' },
  { id: 'facial', category: 'Facial', name: 'Radiance Facial Ritual', duration: 75, price: 190, image: photos.facial, description: 'Deeply nourish, hydrate and restore your natural glow.', badge: 'Glow favourite' },
  { id: 'stone', category: 'Body', name: 'Warm Stone Therapy', duration: 90, price: 240, image: photos.stones, description: 'Melt away fatigue with grounding warmth and restorative touch.', badge: '' },
  { id: 'deep', category: 'Body', name: 'Deep Tissue Reset', duration: 75, price: 210, image: photos.hands, description: 'Target stubborn tension and rediscover ease of movement.', badge: '' },
  { id: 'ritual', category: 'Packages', name: 'The Serene Escape', duration: 120, price: 320, image: photos.atmosphere, description: 'A complete renewal ritual combining massage, facial and aromatic tea.', badge: 'Signature' },
  { id: 'glow', category: 'Packages', name: 'Blissful Duo Ritual', duration: 90, price: 360, image: photos.oil, description: 'A peaceful shared experience for two. Price includes both guests.', badge: 'For two' },
]
const therapists = ['Any available', 'Alya', 'Maya', 'Sofia']
const faq = [
  ['Do I need to book in advance?', 'We recommend booking at least 24 hours ahead to secure your preferred time. Walk-ins are welcome subject to availability.'],
  ['What should I arrive with?', 'Just yourself. We provide towels, robes and everything needed for your treatment. Please arrive 10 minutes early.'],
  ['Can I reschedule my appointment?', 'Yes. Please contact our team at least 24 hours in advance to rearrange your visit.'],
  ['Is the first-visit offer applicable to all treatments?', 'The 20% welcome discount applies to single treatments, not bundled packages. Show your confirmation when you arrive.'],
]
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: .75, ease: [.22, 1, .36, 1] } } }
const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: .14 }, variants: fadeUp }
const money = p => `RM ${p}`
const dateISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const today = dateISO(new Date())
const times = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [serviceId, setServiceId] = useState('aroma')
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('10:00 AM')
  const [therapist, setTherapist] = useState('Any available')
  const [modal, setModal] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [booking, setBooking] = useState({ name: '', email: '', phone: '', notes: '' })
  const [category, setCategory] = useState('All treatments')
  const [expanded, setExpanded] = useState(-1)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const currentService = services.find(s => s.id === serviceId) || services[0]
  const visibleServices = useMemo(() => services.filter(s => category === 'All treatments' || s.category === category).slice(0, showAll ? 6 : 3), [category, showAll])
  const { scrollYProgress } = useScroll()
  const heroShift = useTransform(scrollYProgress, [0, .27], [0, -45])

  useEffect(() => {
    const track = () => setScrolled(window.scrollY > 25)
    window.addEventListener('scroll', track, { passive: true })
    return () => window.removeEventListener('scroll', track)
  }, [])
  useEffect(() => { document.body.style.overflow = modal || menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal, menuOpen])
  const navigate = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  const startBooking = id => { if (id) setServiceId(id); setConfirmed(false); setBookingError(''); navigate('booking'); document.getElementById('booking')?.classList.add('booking-highlight'); setTimeout(() => document.getElementById('booking')?.classList.remove('booking-highlight'), 1300) }
  const openCheckout = e => { e?.preventDefault(); setBookingError(''); setConfirmed(false); if (!date || date < today) { setBookingError('Please select a valid date.'); return } setModal(true) }
  const finishBooking = e => {
    e.preventDefault()
    if (!booking.name.trim() || !/^\S+@\S+\.\S+$/.test(booking.email) || !booking.phone.trim()) { setBookingError('Please enter your name, a valid email and phone number.'); return }
    const record = { ...booking, service: currentService.name, date, time, therapist, price: currentService.price, reference: `SR-${Date.now().toString().slice(-7)}` }
    try { const existing = JSON.parse(localStorage.getItem('serene-demo-bookings') || '[]'); localStorage.setItem('serene-demo-bookings', JSON.stringify([...existing, record])); localStorage.setItem('serene-last-booking', JSON.stringify(record)) } catch { /* demo still works with storage blocked */ }
    setConfirmed(true); setBookingError('')
  }
  return <>
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-wrap container">
        <button className="brand" onClick={() => navigate('home')} aria-label="Serene Rituals, go to top"><span className="brand-emblem"><Flower2 size={27} strokeWidth={1.5} /></span><span className="brand-name">serene<span>rituals</span><small>THE ART OF RESTORATION</small></span></button>
        <nav className="desktop-nav" aria-label="Main navigation"><button onClick={() => navigate('about')}>Our Story</button><button onClick={() => navigate('treatments')}>Treatments</button><button onClick={() => navigate('experience')}>The Experience</button><button onClick={() => navigate('reviews')}>Testimonials</button></nav>
        <button className="header-book" onClick={() => startBooking()}>Book a treatment <ArrowUpRight size={16} /></button>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{[['about', 'Our Story'], ['treatments', 'Treatments'], ['experience', 'The Experience'], ['reviews', 'Testimonials'], ['booking', 'Book a Treatment']].map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label} <ArrowUpRight size={19} /></button>)}</motion.div>}</AnimatePresence>

    <main id="home">
      <section className="hero-section container">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
          <div className="eyebrow"><span className="little-dot" /> YOUR SPACE TO SLOW DOWN</div>
          <h1>Rebalance.<br />Renew.<br /><em>Rejuvenate.</em></h1>
          <p>A sanctuary of tranquility and holistic treatments designed to restore your mind, body and soul.</p>
          <button className="pill-btn" onClick={() => startBooking()}>BOOK YOUR ESCAPE <ArrowUpRight size={19} /></button>
          <div className="hero-footnote"><span className="footnote-line" /> RELAXATION, REIMAGINED</div>
        </motion.div>
        <motion.div className="hero-visual" style={{ y: heroShift }} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}><div className="hero-image" style={{ backgroundImage: `url(${photos.hero})` }} /><div className="hero-stamp"><Flower2 size={24} strokeWidth={1.3} /><span>PAUSE · BREATHE · BE</span></div></motion.div>
        <div className="hero-flower" aria-hidden="true">✳</div>
      </section>

      <section className="benefits container" aria-label="Our promises">{[[Flower2, 'Holistic', 'Approach'], [Droplets, 'Premium', 'Products'], [Leaf, 'Expert', 'Therapists'], [Heart, 'Personalized', 'Care']].map(([Icon, a, b], i) => <motion.div key={a} {...inView} transition={{ delay: i * .08 }} className="benefit"><span className="benefit-icon"><Icon size={27} strokeWidth={1.45} /></span><span>{a}<br />{b}</span></motion.div>)}</section>

      <motion.section className="offer container" {...inView}><div className="offer-card"><img src={photos.oil} alt="Natural aromatic oils for spa rituals" /><div className="offer-copy"><p className="offer-kicker">A LITTLE SOMETHING FOR YOU <span /></p><h2>20% OFF</h2><p>On your first treatment.<br />Begin your journey to wellness.</p><small>* New guests only. Single treatments.</small></div><button className="round-outline" onClick={() => startBooking()} aria-label="Book the new client offer"><ArrowRight /></button><span className="offer-leaf" aria-hidden="true">✳</span></div></motion.section>

      <section className="booking-area container" id="booking"><motion.div className="booking-card" {...inView}><div className="booking-top"><div className="booking-heading"><span className="booking-heading-icon"><CalendarDays size={22} /></span><div><div className="mini-overline">YOUR MOMENT OF CALM AWAITS</div><h2>Book your escape</h2></div></div><button className="text-link" onClick={() => navigate('treatments')}>View packages <ArrowRight size={19} /></button></div>
        <form onSubmit={openCheckout} className="booking-form"><label className="field"><span className="field-icon"><Flower2 size={25} strokeWidth={1.45} /></span><span className="field-body"><span className="field-label">SERVICE</span><select value={serviceId} onChange={e => setServiceId(e.target.value)}>{services.map(s => <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>)}</select></span><ChevronDown className="select-chevron" size={18} /></label>
          <label className="field"><span className="field-icon"><CalendarDays size={25} strokeWidth={1.45} /></span><span className="field-body"><span className="field-label">DATE</span><input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} required /></span></label>
          <label className="field"><span className="field-icon"><Clock3 size={25} strokeWidth={1.45} /></span><span className="field-body"><span className="field-label">TIME</span><select value={time} onChange={e => setTime(e.target.value)}>{times.map(t => <option key={t}>{t}</option>)}</select></span><ChevronDown className="select-chevron" size={18} /></label>
          <label className="field"><span className="field-icon"><Heart size={25} strokeWidth={1.45} /></span><span className="field-body"><span className="field-label">THERAPIST</span><select value={therapist} onChange={e => setTherapist(e.target.value)}>{therapists.map(t => <option key={t}>{t}</option>)}</select></span><ChevronDown className="select-chevron" size={18} /></label>
          <p className="booking-price">From <strong>{money(currentService.price)}</strong> <span>· {currentService.duration} minutes</span></p><button type="submit" className="pill-btn booking-submit">CHECK AVAILABILITY <ArrowUpRight size={21} /></button>{bookingError && <p className="form-error" role="alert">{bookingError}</p>}</form>
        <div className="booking-disclaimer"><CircleCheck size={15} /> No payment needed for this demo reservation</div>
      </motion.div></section>

      <section className="treatments-section container" id="treatments"><motion.div {...inView} className="section-header"><div><p className="section-kicker">INTENTIONALLY CRAFTED FOR YOU</p><h2>Signature <em>experiences.</em></h2></div><button className="text-link" onClick={() => { setShowAll(!showAll); setCategory('All treatments') }}>{showAll ? 'Show Less' : 'View All Treatments'} <ArrowRight size={20} /></button></motion.div>
        <div className="category-tabs" role="tablist" aria-label="Treatment category">{['All treatments', 'Body', 'Facial', 'Packages'].map(c => <button role="tab" aria-selected={category === c} className={category === c ? 'active' : ''} key={c} onClick={() => { setCategory(c); setShowAll(c !== 'All treatments') }}>{c}</button>)}</div>
        <motion.div className="treatment-grid" layout>{visibleServices.map((s, i) => <motion.article layout key={s.id} className="treatment-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}><div className="treatment-img-wrap"><img loading="lazy" src={s.image} alt={s.name} /><span className="duration-tag">{s.duration} min</span>{s.badge && <span className="service-badge">{s.badge}</span>}</div><div className="treatment-bottom"><p className="treatment-category">{s.category} Therapy</p><h3>{s.name}</h3><p className="treatment-description">{s.description}</p><div className="treatment-action"><span>From <b>{money(s.price)}</b></span><button onClick={() => startBooking(s.id)} aria-label={`Book ${s.name}`}><ArrowUpRight size={20} /></button></div></div></motion.article>)}</motion.div>
      </section>

      <section className="story-section" id="about"><div className="container story-grid"><motion.div className="story-image" {...inView}><img loading="lazy" src={photos.atmosphere} alt="Peaceful spa room with soft light and calming details" /><div className="story-image-caption"><Sparkles size={17} /> A place to simply be.</div></motion.div><motion.div {...inView} className="story-copy"><span className="section-kicker">THE SERENE PHILOSOPHY</span><h2>Wellness begins<br />with a <em>little pause.</em></h2><p>In the middle of life's beautiful chaos, we believe you deserve a moment that belongs entirely to you.</p><p>Serene Rituals is a boutique Malaysian wellness sanctuary where thoughtful treatments, warm hospitality and nature-inspired rituals come together to help you feel like yourself again.</p><div className="story-checks"><span><Check size={17} /> Naturally inspired products</span><span><Check size={17} /> Expert, caring hands</span><span><Check size={17} /> Calm at every touchpoint</span></div><button className="outlined-btn" onClick={() => navigate('experience')}>DISCOVER OUR APPROACH <ArrowUpRight size={17} /></button></motion.div></div></section>

      <section className="experience-section container" id="experience"><motion.div {...inView} className="center-heading"><p className="section-kicker">THE ART OF SLOWING DOWN</p><h2>Your ritual, <em>your way.</em></h2><p>Every detail is considered. Every visit, a gentle invitation to reconnect.</p></motion.div><div className="steps-grid">{[[Wind, '01', 'Arrive & unwind', 'Step away from the rush with a warm welcome and calming herbal tea.'], [Flower2, '02', 'Choose your ritual', 'Find the perfect treatment for your body, mind and mood.'], [HandHeart, '03', 'Leave renewed', 'Walk away feeling rested, restored and beautifully rebalanced.']].map(([Icon, n, title, desc], i) => <motion.div {...inView} key={n} className="step" transition={{ delay: i * .12 }}><span className="step-icon"><Icon size={28} strokeWidth={1.35} /></span><span className="step-number">{n} / THE EXPERIENCE</span><h3>{title}</h3><p>{desc}</p></motion.div>)}</div></section>

      <section className="quote-section"><div className="quote-overlay" /><div className="container quote-content"><motion.div {...inView}><Flower2 size={31} strokeWidth={1.2} /><h2>Taking time for yourself<br />isn't a luxury.<br /><em>It's a necessity.</em></h2><button onClick={() => startBooking()} className="light-pill">MAKE TIME FOR YOU <ArrowUpRight size={18} /></button></motion.div></div></section>

      <section className="reviews container" id="reviews"><motion.div {...inView} className="center-heading"><p className="section-kicker">KIND WORDS, CALM HEARTS</p><h2>Loved by our <em>guests.</em></h2><p>Little moments of peace, shared by our community.</p></motion.div><div className="review-grid">{[
        ['“A beautiful little escape from the everyday. The atmosphere was so peaceful and the massage was exactly what I needed.”', 'Nadia A.', 'First-time guest'],
        ['“From the moment I walked in, I felt taken care of. Everything was thoughtful, welcoming and so relaxing.”', 'Sarah L.', 'Returning guest'],
        ['“One of the most calming spa experiences I’ve had. I left feeling completely refreshed. Already planning my next visit!”', 'Aina R.', 'Wellness enthusiast']
      ].map(([q, name, role], i) => <motion.article {...inView} transition={{ delay: i * .09 }} key={name} className="review-card"><div className="stars">{Array.from({ length: 5 }).map((_, j) => <Star key={j} fill="currentColor" size={15} />)}</div><p>{q}</p><div className="review-author"><span className="author-avatar">{name.charAt(0)}</span><div><strong>{name}</strong><small>{role}</small></div></div></motion.article>)}</div><p className="review-note">* Illustrative testimonials for this concept website.</p></section>

      <section className="faq-section"><div className="container faq-grid"><motion.div {...inView}><p className="section-kicker">GOOD TO KNOW</p><h2>A little more<br /><em>peace of mind.</em></h2><p className="faq-intro">Everything you need to know before your visit.</p></motion.div><div className="faq-list">{faq.map(([q, a], i) => <div key={q} className={`faq-item ${expanded === i ? 'open' : ''}`}><button onClick={() => setExpanded(expanded === i ? -1 : i)} aria-expanded={expanded === i}><span>{q}</span>{expanded === i ? <Minus size={20} /> : <Plus size={20} />}</button><AnimatePresence initial={false}>{expanded === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}>{a}</motion.p>}</AnimatePresence></div>)}</div></div></section>

      <section className="newsletter container"><div className="newsletter-content"><div><p className="section-kicker">A LITTLE CALM IN YOUR INBOX</p><h2>Stay in the <em>glow.</em></h2><p>Discover wellbeing tips and thoughtful offers, delivered gently.</p></div><form onSubmit={e => { e.preventDefault(); if (newsletterEmail.includes('@')) setSubscribed(true) }}><label htmlFor="email-newsletter" className="sr-only">Email address</label><input id="email-newsletter" type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Your email address" required /><button type="submit" aria-label="Subscribe to newsletter"><ArrowUpRight size={22} /></button>{subscribed && <span className="newsletter-success">Thank you! You're on our demo mailing list.</span>}</form></div></section>
    </main>
    <footer className="footer"><div className="container footer-main"><div><div className="footer-brand"><Flower2 size={29} /> serene<span>rituals</span></div><p>A peaceful retreat for your mind,<br />body and soul. Rooted in care,<br />inspired by nature.</p><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a></div></div><div><h4>Explore</h4><button onClick={() => navigate('about')}>Our Story</button><button onClick={() => navigate('treatments')}>Treatments</button><button onClick={() => navigate('experience')}>Our Approach</button><button onClick={() => startBooking()}>Book Now</button></div><div><h4>Visit us</h4><p><MapPin size={16} /> Malaysia · Kuala Lumpur</p><p><Clock3 size={16} /> Daily, 10 AM – 7 PM</p><p><Mail size={16} /> hello@serenerituals.example</p><p><Phone size={16} /> +60 00-000 0000</p></div></div><div className="footer-bottom container"><span>© {new Date().getFullYear()} Serene Rituals. Designed with intention.</span><span>CONCEPT WEBSITE · ORBIT WEB</span></div></footer>

    <AnimatePresence>{modal && <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) setModal(false) }}><motion.div className="modal-panel" role="dialog" aria-modal="true" aria-label="Complete your booking" initial={{ opacity: 0, y: 35, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .97 }} transition={{ duration: .28 }}><button className="modal-close" onClick={() => setModal(false)} aria-label="Close booking"><X size={22} /></button>{confirmed ? <div className="confirmation"><div className="success-icon"><Check size={37} /></div><h2>Your moment is reserved.</h2><p>Thank you, {booking.name}! Your demo booking has been saved in this browser.</p><div className="confirmation-summary"><div><span>Treatment</span><strong>{currentService.name}</strong></div><div><span>Date & time</span><strong>{date} · {time}</strong></div><div><span>Price</span><strong>{money(currentService.price)}</strong></div></div><p className="demo-notice">This is a demo confirmation only. No appointment or email was sent to a real spa.</p><button className="pill-btn modal-submit" onClick={() => { setModal(false); setBooking({ name: '', email: '', phone: '', notes: '' }) }}>BACK TO THE WEBSITE <ArrowRight size={19} /></button></div> : <><p className="section-kicker">ONE STEP CLOSER TO CALM</p><h2>Complete your <em>escape.</em></h2><p className="modal-subtitle">Leave us your details to save a demonstration reservation.</p><div className="modal-summary"><div><span>TREATMENT</span><strong>{currentService.name}</strong></div><div><span>DATE & TIME</span><strong>{date} · {time}</strong></div><div><span>TOTAL</span><strong>{money(currentService.price)}</strong></div></div><form onSubmit={finishBooking} className="checkout-form"><label>Full name *<input value={booking.name} onChange={e => setBooking({ ...booking, name: e.target.value })} placeholder="Your full name" required /></label><div className="checkout-row"><label>Email *<input value={booking.email} onChange={e => setBooking({ ...booking, email: e.target.value })} type="email" placeholder="you@example.com" required /></label><label>Phone *<input value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })} type="tel" placeholder="+60 ..." required /></label></div><label>Anything we should know? <span>(optional)</span><textarea rows="3" value={booking.notes} onChange={e => setBooking({ ...booking, notes: e.target.value })} placeholder="Any preferences or special requests" /></label>{bookingError && <p className="form-error" role="alert">{bookingError}</p>}<button type="submit" className="pill-btn modal-submit">CONFIRM DEMO BOOKING <ArrowUpRight size={19} /></button><small>No payment collected. Local demo only; availability is illustrative.</small></form></>}</motion.div></motion.div>}</AnimatePresence>
  </>
}
export default App
