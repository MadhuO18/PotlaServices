import parse, { attributesToProps, domToReact, Element } from 'html-react-parser'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import HeroCarousel from './components/HeroCarousel.jsx'
import {
  TestimonialsCarousel,
  PartnerCarousel,
  Counter,
  Accordion,
  Portfolio,
  InsightsStories,
} from './components/Widgets.jsx'
import {
  EnquiryForm,
  ContactForm,
  CareersForm,
  NewsletterForm,
} from './components/Forms.jsx'
import { useUI } from './components/UIContext.jsx'

function textOf(node) {
  if (!node) return ''
  if (node.type === 'text') return node.data
  return (node.children || []).map(textOf).join('')
}

function collect(node, pred, out = []) {
  if (!node) return out
  if (node instanceof Element && pred(node)) out.push(node)
  for (const c of node.children || []) collect(c, pred, out)
  return out
}

const hasClass = (node, cls) =>
  node instanceof Element && (node.attribs.class || '').split(/\s+/).includes(cls)

function isHeroImage(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      hasClass(parent, 'company-hero-visual') ||
      hasClass(parent, 'about-hero-visual') ||
      hasClass(parent, 'portfolio-hero-visual') ||
      hasClass(parent, 'contact-hero-visual') ||
      hasClass(parent, 'careers-hero-visual')
    ) {
      return true
    }
  }
  return false
}

function WebsiteTransition({ href }) {
  useEffect(() => {
    if (!href) return undefined

    const timer = window.setTimeout(() => window.location.assign(href), 2600)
    return () => window.clearTimeout(timer)
  }, [href])

  if (!href) return null

  return createPortal(
    <div className="branded-preloader" role="status" aria-live="polite">
      <div className="branded-preloader-content">
        <div className="branded-preloader-mark">
          <img src="/assets/img/potla-group-logo.png" alt="Potla Group" />
        </div>
        <p>Potla Tech Solutions</p>
        <strong>9+ Years of Excellence</strong>
        <span>Loading website</span>
      </div>
    </div>,
    document.body,
  )
}

export function useContentRenderer() {
  const { openVideo, openCeo } = useUI()
  const [transitionHref, setTransitionHref] = useState('')

  const options = {
    replace: (node) => {
      if (!(node instanceof Element)) return undefined

      // Hero slider
      if (hasClass(node, 'home-slides')) return <HeroCarousel />

      // Testimonials slider
      if (hasClass(node, 'feedback-slides')) return <TestimonialsCarousel />

      // Partner / logo / product slider
      if (hasClass(node, 'partner-slider')) {
        const images = collect(node, (n) => n.name === 'img').map((n) => n.attribs.src)
        return <PartnerCarousel images={images} />
      }

      // Portfolio (filterable grid + lightbox)
      if (node.name === 'section' && hasClass(node, 'project-area')) return <Portfolio />

      // Editorial stories with accessible detail dialogs
      if (node.name === 'div' && hasClass(node, 'insights-grid')) return <InsightsStories />

      // FAQ / careers accordion
      if (node.name === 'ul' && hasClass(node, 'accordion')) {
        const items = collect(node, (n) => hasClass(n, 'accordion-item')).map((li) => {
          const title = collect(li, (n) => hasClass(n, 'accordion-title'))[0]
          const content = collect(li, (n) => hasClass(n, 'accordion-content'))[0]
          const metadata = collect(li, (n) => hasClass(n, 'careers-role-meta'))[0]
          return {
            title: textOf(title),
            metadata: metadata ? domToReact(metadata.children, options) : null,
            content: content ? domToReact(content.children, options) : null,
          }
        })
        return <Accordion items={items} className={node.attribs.class || ''} />
      }

      // Animated counters
      if (node.name === 'span' && hasClass(node, 'count')) {
        return <Counter value={parseInt(textOf(node), 10) || 0} />
      }

      // Forms
      if (node.name === 'form') {
        const cls = node.attribs.class || ''
        const action = node.attribs.action || ''
        if (cls.includes('newsletter-form')) return <NewsletterForm />
        if (action.includes('careersmail')) return <CareersForm />
        if (action.includes('mail.php')) return <ContactForm />
        return <EnquiryForm />
      }

      // Links
      if (node.name === 'button' && hasClass(node, 'meet-ceo-trigger')) {
        return (
          <button
            type="button"
            className={node.attribs.class}
            aria-haspopup="dialog"
            aria-controls="ceo-popup-title"
            onClick={openCeo}
          >
            {domToReact(node.children, options)}
          </button>
        )
      }

      if (node.name === 'a') {
        const href = node.attribs.href || ''
        const cls = node.attribs.class || ''
        const children = domToReact(node.children, options)

        if (cls.includes('video-btn')) {
          return (
            <button type="button" className="video-btn" onClick={() => openVideo(href)}>
              {children}
            </button>
          )
        }
        if (href.startsWith('/') && !href.startsWith('//')) {
          return (
            <Link to={href} className={cls || undefined}>
              {children}
            </Link>
          )
        }
        if (node.attribs['data-logo-transition'] === 'true') {
          return (
            <a
              href={href}
              className={cls || undefined}
              onClick={(event) => {
                event.preventDefault()
                setTransitionHref(href)
              }}
            >
              {children}
            </a>
          )
        }
        if (href === '#') {
          return (
            <a href="#" className={cls || undefined} onClick={(e) => e.preventDefault()}>
              {children}
            </a>
          )
        }
        if (/^https?:\/\//.test(href) && !href.includes('potlaservices.com')) {
          return (
            <a href={href} className={cls || undefined} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        }
      }

      if (node.name === 'img') {
        const heroImage = isHeroImage(node)
        return (
          <img
            {...attributesToProps(node.attribs)}
            loading={heroImage ? 'eager' : 'lazy'}
            fetchPriority={heroImage ? 'high' : 'auto'}
            decoding="async"
          />
        )
      }

      return undefined
    },
  }

  return (html) => (
    <>
      {parse(html, options)}
      <WebsiteTransition href={transitionHref} />
    </>
  )
}
