import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUI } from './UIContext.jsx'

const companies = [
  { to: '/potla-tech-solutions', label: 'Potla Tech Solutions' },
  { to: '/potla-consulting', label: 'Potla Consulting' },
  { to: '/teluguwebmedia', label: 'Telugu Web Media' },
  { to: '/potla-developers', label: 'Potla Developers' },
  { to: '/sree-technologies', label: 'Sree Technologies' },
]

export function Preloader() {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHide(true), 2700)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`preloader-area ${hide ? 'rtl-hide' : ''}`} role="status" aria-label="Loading Potla Group">
      <div className="preloader-branding">
        <div className="preloader-brand-mark">
          <img src="/assets/img/potla-refresh-logo.png" alt="Potla Group" />
        </div>
        <p className="preloader-excellence">9+ Years of Excellence</p>
      </div>
    </div>
  )
}

export function Header() {
  return (
    <header className="header-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <ul className="social-links">
              <li>
                <a href="mailto:email@potlaservices.com">
                  <i className="icofont-envelope" />
                  &emsp;email@potlaservices.com
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-7 col-md-7">
            <ul className="header-info">
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/testimonials">Testimonials</Link>
              </li>
              <li>815, Manjeera Majestic Commercial - KPHB, Hyderabad-500072</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export function Navbar() {
  const [sticky, setSticky] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const dropdownTriggerRef = useRef(null)
  const { setSideOpen } = useUI()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setDropdown(false)
  }, [location.pathname])

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${sticky ? 'is-sticky' : ''}`}>
      <div className="container">
        <div className="row navbar-layout">
          <div className="col-lg-5 col-md-12 navbar-brand-column">
            <div className="navbar-branding">
              <Link to="/" className="navbar-logo-link">
                <img className="sai" src="/assets/img/potla-group-logo.png" alt="Potla Group of Companies" />
              </Link>
              <span className="navbar-excellence" role="img" aria-label="9 plus years of excellence">
                <span className="navbar-excellence-motion" aria-hidden="true">
                  <span className="navbar-excellence-copy">
                    <span className="navbar-excellence-line">YEARS OF</span>
                    <span className="navbar-excellence-line">EXCELLENCE</span>
                  </span>
                  <span className="navbar-excellence-years">9+</span>
                </span>
              </span>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarSupportedContent"
              aria-expanded={open}
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
          <div className="col-lg-6 col-md-12 navbar-links-column">
            <div className={`collapse navbar-collapse ${open ? 'rtl-open show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink to="/" end className={navLinkClass}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={navLinkClass}>
                    About Us
                  </NavLink>
                </li>
                <li
                  className={`nav-item dropdown ${dropdown ? 'show' : ''}`}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && dropdown) {
                      setDropdown(false)
                      dropdownTriggerRef.current?.focus()
                    }
                  }}
                >
                  <button
                    ref={dropdownTriggerRef}
                    className="nav-link dropdown-toggle"
                    type="button"
                    aria-expanded={dropdown}
                    aria-haspopup="true"
                    aria-controls="company-navigation-menu"
                    onClick={() => {
                      setDropdown((v) => !v)
                    }}
                  >
                    Companies
                  </button>
                  <div
                    id="company-navigation-menu"
                    className={`dropdown-menu ${dropdown ? 'rtl-show show' : ''}`}
                    aria-hidden={!dropdown}
                  >
                    {companies.map((c) =>
                      c.external ? (
                        <a
                          key={c.label}
                          className="dropdown-item"
                          href={c.to}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.label}
                        </a>
                      ) : (
                        <NavLink key={c.to} to={c.to} className="dropdown-item">
                          {c.label}
                        </NavLink>
                      ),
                    )}
                  </div>
                </li>
                <li className="nav-item">
                  <NavLink to="/careers" className={navLinkClass}>
                    Careers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/portfolio" className={navLinkClass}>
                    Portfolio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className={navLinkClass}>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-1 col-md-12 navbar-tools-column">
            <div className="navbar-right-side">
              <div className="modal-taggle-button">
                <a
                  href="#"
                  aria-label="Open company information"
                  onClick={(e) => {
                    e.preventDefault()
                    setSideOpen(true)
                  }}
                >
                  <span />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function SideModal() {
  const { sideOpen, setSideOpen } = useUI()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSideOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSideOpen])

  return (
    <>
      <div
        className={`rtl-modal-backdrop ${sideOpen ? 'show' : ''}`}
        onClick={() => setSideOpen(false)}
      />
      <div
        className={`modal right fade rtl-modal ${sideOpen ? 'show' : ''}`}
        tabIndex={-1}
        role="dialog"
        aria-hidden={!sideOpen}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => setSideOpen(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src="/assets/img/potla-group-logo.png" className="sai" alt="Potla Group" />
              <p align="justify">
                Potla Group has world class IT, Telecom and Consulting company with competence in
                providing strategic solutions to client’s needs & which can spring up client business
              </p>
              <ul className="modal-contact-info">
                <li>
                  <i className="icofont-google-map" /> <b>Manjeera Majestic Commercial, 815, KPHB Phase 3, Kukatpally, Hyderabad Telangana 500072</b>
                </li>
                <li>
                  <i className="icofont-ui-call" /> <b><a href="tel:+914035699217">+91 40 3569 9217</a></b>Give us a call
                </li>
                <li>
                  <i className="icofont-envelope" /> <b>email@potlaservices.com</b>24/7 online support
                </li>
              </ul>
              <ul className="social-links">
                <li>
                  <a href="https://www.facebook.com/potlaservices/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="icofont-facebook" />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Twitter"><i className="icofont-twitter" /></a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram"><i className="icofont-instagram" /></a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/potla-group-of-companies-45722a166/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="icofont-linkedin" />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Pinterest"><i className="icofont-pinterest" /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="footer-area bg-fbf9f8">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3>Important Links</h3>
              <ul className="useful-links">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3>Head Office</h3>
              <ul className="contact-list">
                <li><span>Address:</span> Manjeera Majestic Commercial, 815, KPHB Phase 3, Kukatpally, Hyderabad Telangana 500072</li>
                <li><span>Website:</span> <a href="https://potlaservices.com">potlaservices.com</a></li>
                <li><span>Email:</span> <a href="mailto:email@potlaservices.com">email@potlaservices.com</a></li>
                <li><span>Landline:</span> <a href="tel:+914035699217">+91 40 3569 9217</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3>Branch Offices</h3>
              <ul className="contact-list">
                <li><span>Address:</span> Annapurna Nagar, Gorantla, near inner ring road, Guntur-34.</li>
                <li><span>Address:</span> 301 Sudarshan Plazza, Opposite Pills Pharmacy, KPHB 6TH PHASE HYDERABAD</li>
                <li><span>Landline:</span> <a href="tel:+914035699217">+91 40 3569 9217</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="single-footer-widget" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '18px', width: '100%', textAlign: 'center' }}>Like us on Social</h3>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <img
                  src="/assets/img/potla-group-logo.png"
                  alt="Potla Group"
                  style={{ width: '220px', maxWidth: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
              <ul
                className="social-links"
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <li>
                  <a
                    href="https://www.facebook.com/potlaservices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1d4ed8',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="icofont-facebook" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/potla-group-of-companies-45722a166/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0a66c2',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="icofont-linkedin" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="Instagram"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#e1306c',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="icofont-instagram" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="Twitter"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1d9bf0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="icofont-twitter" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright-area">
        <div className="container">
          <div className="copyright-inner">
            <p className="copyright-notice">
                © 2020{currentYear > 2020 ? `–${currentYear}` : ''} Potla Group of Companies. All rights reserved.
            </p>
            <nav className="copyright-links" aria-label="Legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-conditions">Terms &amp; Conditions</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function GoTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className={`go-top ${visible ? 'rtl-visible' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Go to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="icofont-stylish-up" />
    </div>
  )
}

export function ContactQuickActions() {
  return (
    <div className="contact-quick-actions" aria-label="Contact Potla Group">
      <a
        className="contact-quick-action contact-quick-action-phone"
        href="tel:+919985753789"
        aria-label="Call Potla Group at +91 99857 53789"
      >
        <i className="icofont-phone" aria-hidden="true" />
      </a>
      <a
        className="contact-quick-action contact-quick-action-whatsapp"
        href="https://wa.me/919985753789"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Potla Group on WhatsApp"
      >
        <i className="icofont-brand-whatsapp" aria-hidden="true" />
      </a>
    </div>
  )
}

export function Popups() {
  const { video, image, ceoOpen, closeAll } = useUI()
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeAll()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAll])

  useEffect(() => {
    if (!ceoOpen) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const keepFocusInDialog = (event) => {
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', keepFocusInDialog)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', keepFocusInDialog)
      previousFocus?.focus?.()
    }
  }, [ceoOpen])

  if (!video && !image && !ceoOpen) return null

  if (ceoOpen) {
    return (
      <div className="ceo-popup-backdrop" onClick={closeAll}>
        <section
          className="ceo-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ceo-popup-title"
          ref={dialogRef}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeAll()
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="ceo-popup-close"
            aria-label="Close CEO profile"
            onClick={closeAll}
          >
            &times;
          </button>
          <div className="ceo-popup-portrait">
            <img src="/assets/img/CEO2.jpg" alt="Srinu Potla, Managing Director of Potla Group" />
            <span>Leadership</span>
          </div>
          <div className="ceo-popup-content">
            <p className="ceo-popup-eyebrow">A message from our leadership</p>
            <h2 id="ceo-popup-title">Srinu Potla</h2>
            <p className="ceo-popup-designation">Managing Director, Potla Group</p>
            <p className="ceo-popup-message">
              “Our goal is to build practical services, lasting partnerships, and meaningful
              opportunities. I’m proud of the teams working together to make that possible.”
            </p>
            <Link to="/about" className="ceo-popup-link" onClick={closeAll}>
              Discover our group <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const src = video
    ? video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : null

  return (
    <div className="rtl-popup" onClick={closeAll}>
      <div className="rtl-popup-inner" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rtl-popup-close" aria-label="Close" onClick={closeAll}>
          &times;
        </button>
        {video && (
          <iframe
            src={`${src}?autoplay=1&rel=0`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {image && <img src={image} alt="Portfolio preview" />}
      </div>
    </div>
  )
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
