import Carousel from './Carousel.jsx'
import { heroSlides } from '../data.js'
import { Link } from 'react-router-dom'

function CompanyLink({ slide }) {
  const className = 'btn btn-primary company-hero-cta'
  const label = slide.external ? 'Visit website' : 'Explore company'

  if (slide.external) {
    return (
      <a className={className} href={slide.link} target="_blank" rel="noopener noreferrer">
        {label}
        <i className="icofont-arrow-right" aria-hidden="true" />
      </a>
    )
  }

  return (
    <Link className={className} to={slide.link}>
      {label}
      <i className="icofont-arrow-right" aria-hidden="true" />
    </Link>
  )
}

export default function HeroCarousel() {
  const slides = heroSlides.map((slide, index) => {
    const Heading = index === 0 ? 'h1' : 'h2'
    return (
    <section className={`company-hero-slide company-hero-slide--${slide.id}`} key={slide.id}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className={`company-hero-visual ${slide.visualClass || ''}`}>
              <img
                src={slide.img}
                alt={slide.imageAlt}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
              <span className="company-hero-year">Established {slide.established}</span>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="company-hero-copy">
              <p className="company-hero-eyebrow">Potla Group of Companies</p>
              <Heading>{slide.name}</Heading>
              <p className="company-hero-description">{slide.text}</p>
              <CompanyLink slide={slide} />
            </div>
          </div>
        </div>
      </div>
    </section>
    )
  })

  return (
    <Carousel
      slides={slides}
      className="home-slides"
      responsive={{ 0: 1 }}
      nav
      dots
      autoplay
      autoplayControl
      interval={6500}
      speed={750}
      ariaLabel="Potla Group companies"
    />
  )
}
