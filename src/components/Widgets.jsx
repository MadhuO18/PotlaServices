import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Carousel from './Carousel.jsx'
import { testimonials, products } from '../data.js'
import { useUI } from './UIContext.jsx'

const insightMoments = [
  {
    image: '/assets/img/potla-group-moments-team-event.jpg',
    alt: 'Potla Group colleagues gathered in front of a company event banner',
    caption: 'Colleagues coming together at a Potla Group event',
  },
  {
    image: '/assets/img/potla-group-moments-women-team.jpg',
    alt: 'Potla Group women colleagues gathered in front of the company banner',
    caption: 'Celebrating the people and perspectives across our teams',
  },
  {
    image: '/assets/img/potla-group-moments-team-activity.jpg',
    alt: 'Colleagues taking part in a team activity together',
    caption: 'Building connections through shared team activities',
  },
  {
    image: '/assets/img/potla-group-moments-celebration.jpg',
    alt: 'Colleagues celebrating together around flowers and a cake',
    caption: 'Recognizing a special moment as a team',
  },
  {
    image: '/assets/img/potla-group-moments-team-selfie.jpg',
    alt: 'Potla Group colleagues gathered for a team photograph',
    caption: 'A team moment to remember',
  },
  {
    image: '/assets/img/potla-group-moments-founder.jpg',
    alt: 'Portrait of Potla Group Founder and CEO Srinu Potla Garu',
    caption: 'Srinu Potla Garu, Founder and CEO',
  },
]

const insightStories = [
  {
    id: 'bheeshma-recognition',
    category: 'Recognition',
    image: '/assets/img/potla-bheeshma-award.jpg',
    alt: 'Srinu Potla Garu receiving the Bheeshma Vishishta Puraskar award',
    title: 'Bheeshma Puraskar',
    summary: 'Potla Group celebrates Founder and CEO Srinu Potla Garu’s recognition with the Bheeshma Vishishta Puraskar—a proud milestone for him and the Group.',
    sections: [
      {
        heading: 'A moment of distinction',
        body: 'Potla Group is proud to celebrate the Bheeshma Vishishta Puraskar presented to its Founder and CEO, Srinu Potla Garu. This recognition is a significant milestone in his journey and a memorable occasion for the entire Potla Group community.',
      },
      {
        heading: 'A milestone shared with our community',
        body: 'Meaningful milestones are shaped by the support and trust of many. We acknowledge our colleagues, partners, clients, and well-wishers whose continued encouragement has accompanied the Group’s journey.',
      },
      {
        heading: 'With gratitude and purpose',
        body: 'We extend our sincere thanks to everyone who has been part of this journey. This honour inspires us to continue building with commitment, strengthening relationships, and creating lasting value for the communities we serve.',
      },
    ],
  },
  {
    id: 'telugu-web-media',
    category: 'Media & community',
    image: '/assets/img/telugu-web-media-community.jpg',
    alt: 'Community representatives holding Telugu Web Media signs at an event',
    title: 'Telugu Web Media: connecting with our community',
    summary: 'Telugu Web Media is Potla Group’s digital news initiative, created to connect Telugu-speaking audiences with relevant stories and updates.',
    sections: [
      {
        heading: 'Connecting audiences through Telugu',
        body: 'Telugu Web Media is Potla Group’s digital news initiative for Telugu-speaking audiences. By bringing content to people in their language, the platform contributes to a more accessible and connected digital media experience.',
      },
      {
        heading: 'A digital-first regional media presence',
        body: 'Digital platforms continue to shape how people discover and engage with information. Telugu Web Media reflects the Group’s interest in regional-language media and the role it can play in helping audiences stay connected with stories and updates that matter to them.',
      },
      {
        heading: 'Built around community connection',
        body: 'The initiative is grounded in the value of language and community. The event pictured here represents an opportunity to engage with Telugu-speaking audiences and strengthen the connection between the platform and the people it serves.',
      },
      {
        heading: 'Looking ahead',
        body: 'As Telugu Web Media continues to develop, Potla Group remains focused on growing the initiative with a clear audience-first perspective and a commitment to responsible, relevant communication.',
      },
    ],
  },
  {
    id: 'our-collaboration',
    category: 'Community & culture',
    image: '/assets/img/our-collaboration-madhuri-musical-tribute.png',
    alt: 'Poster for a musical tribute to S. P. Balasubrahmanyam and S. Janaki, featuring event guests',
    title: 'A Musical Tribute to S. P. Balasubrahmanyam & S. Janaki',
    summary: 'ఎస్. పి. బాలసుబ్రహ్మణ్యం, ఎస్. జానకి గార్ల చిరస్మరణీయ గీతాలకు మాధురి మ్యూజికల్ ఈవెంట్స్ నిర్వహించిన సంగీత నివాళి.',
    sections: [
      {
        heading: 'అజరామర గీతాలకు స్వర నివాళి',
        body: 'పద్మవిభూషణ్ డాక్టర్ ఎస్. పి. బాలసుబ్రహ్మణ్యం, ప్రముఖ గాయని ఎస్. జానకి ఆలపించిన చిరస్మరణీయ గీతాలకు మాధురి మ్యూజికల్ ఈవెంట్స్ ఆధ్వర్యంలో సంగీత నివాళి కార్యక్రమం నిర్వహించారు. అక్టోబర్ 3న కూకట్‌పల్లి మెట్రో సమీపంలోని ప్రేకాసా స్టూడియోలో జరిగిన ఈ కార్యక్రమాన్ని నిర్వాహకుడు, గాయకుడు రవికుమార్ మాతంగి సమన్వయం చేశారు.',
      },
      {
        heading: 'సంగీత ప్రముఖులు, విశిష్ట అతిథుల సమక్షంలో',
        body: 'ప్రముఖ సంగీత దర్శకుడు శ్రీ మాధవపెద్ది సురేష్ ముఖ్య అతిథిగా పాల్గొన్నారు. విశిష్ట అతిథులుగా పొట్ల గ్రూప్ ఆఫ్ కంపెనీస్ వ్యవస్థాపకులు, సీఈఓ శ్రీ శ్రీను పొట్ల; శ్రీ నివాస్ ఇన్‌ఫ్రా అండ్ డెవలపర్స్ మేనేజింగ్ డైరెక్టర్ శ్రీ శ్రీనివాస్; ఏఓఎఫ్ ఫిల్ట్రేషన్ ప్రైవేట్ లిమిటెడ్‌కు చెందిన శ్రీ జి. సురేందర్ రెడ్డి; ట్రయోసిస్ టెక్నోసోల్ టెక్నికల్ డైరెక్టర్ డాక్టర్ కె. శివ ప్రసాద్ హాజరయ్యారు.',
      },
      {
        heading: 'తరతరాలను అలరించే గాన వారసత్వం',
        body: 'గాయకులు ఎస్. పి. బాలసుబ్రహ్మణ్యం, ఎస్. జానకి ఆలపించిన ప్రసిద్ధ గీతాలను పాడి ప్రేక్షకులను అలరించారు. సంగీత, సాంస్కృతిక ప్రదర్శనలు కార్యక్రమానికి ప్రత్యేక ఆకర్షణగా నిలిచాయి. సంగీత రంగానికి సేవలందిస్తున్న కళాకారులను, కార్యక్రమానికి సహకరించిన వారిని శ్రీ మాధవపెద్ది సురేష్ సత్కరించారు.',
      },
      {
        heading: 'సంగీతం మన హృదయాల్లో చిరస్థాయిగా',
        body: 'శ్రీను పొట్ల, రవికుమార్ మాతంగి మాట్లాడుతూ, “ఎస్. పి. బాలసుబ్రహ్మణ్యం, ఎస్. జానకి గారు సంగీత ప్రపంచానికి అందించిన సేవలు చిరస్మరణీయం. వారి స్వరాలు కేవలం పాటలు కాదు—తరతరాల జ్ఞాపకాలు, భావాలు, స్ఫూర్తి. వారి సంగీత వారసత్వానికి నివాళి అర్పించడం గర్వకారణం. వారి స్వరం శాశ్వతం; వారి సంగీతం అజరామరం” అని పేర్కొన్నారు. కార్యక్రమాన్ని విజయవంతం చేసిన అతిథులు, గాయకులు, సంగీత కళాకారులు, నిర్వాహకులు, సహాయకులు, సంగీతాభిమానులకు మాధురి మ్యూజికல் ఈవెంట్స్ కృతజ్ఞతలు తెలిపింది.',
      },
    ],
  },
]

export function InsightsStories() {
  const [selectedStory, setSelectedStory] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    if (!selectedStory) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedStory(null)
        return
      }
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

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus()
    }
  }, [selectedStory])

  const openStory = (story, event) => {
    returnFocusRef.current = event.currentTarget
    setSelectedStory(story)
  }

  const closeStory = () => setSelectedStory(null)

  return (
    <>
      <div className="insights-grid">
        {insightStories.map((story, index) => (
          <button
            type="button"
            className="insight-card"
            key={story.id}
            aria-haspopup="dialog"
            aria-label={`Read story: ${story.title}`}
            onClick={(event) => openStory(story, event)}
          >
            <img
              className={`insight-card-image${story.id === 'our-collaboration' ? ' insight-card-image-portrait' : ''}`}
              src={story.image}
              alt={story.alt}
              width={story.id === 'our-collaboration' ? '400' : '1365'}
              height={story.id === 'our-collaboration' ? '600' : '768'}
              loading="lazy"
              decoding="async"
            />
            <span className="insight-card-content">
              <span className="insight-card-top">
                <span>{story.category}</span>
                <span className="insight-index">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="insight-card-title">{story.title}</span>
              <span className="insight-card-summary">{story.summary}</span>
              <span className="insight-card-readmore">
                Read more <span aria-hidden="true">+</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <section
        className="insights-moments"
        id="group-moments"
        aria-labelledby="insights-moments-title"
      >
        <div className="insights-moments-heading">
          <p className="insights-eyebrow">People &amp; culture</p>
          <h2 id="insights-moments-title">Potla Group Moments</h2>
          <p>A collection of moments celebrating our colleagues, shared experiences, and the people behind our journey.</p>
        </div>
        <div className="insights-moments-grid">
          {insightMoments.map((moment, index) => (
            <figure
              className={`insights-moment${index === 5 ? ' insights-moment--founder' : ''}`}
              key={moment.image}
            >
              <img
                src={moment.image}
                alt={moment.alt}
                width={index < 2 ? '1024' : index === 4 ? '1280' : '1365'}
                height={index < 2 ? '768' : index === 4 ? '720' : '768'}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{moment.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      {selectedStory && createPortal(
        <div className="portfolio-dialog-backdrop insights-dialog-backdrop" onClick={closeStory}>
          <section
            ref={dialogRef}
            className="portfolio-dialog insights-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`insight-title-${selectedStory.id}`}
            aria-describedby={`insight-summary-${selectedStory.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="portfolio-dialog-close"
              aria-label={`Close ${selectedStory.title} story`}
              onClick={closeStory}
            >
              &times;
            </button>
            <div className="portfolio-dialog-header">
              <p className="portfolio-eyebrow">{selectedStory.category}</p>
              <h2 id={`insight-title-${selectedStory.id}`}>{selectedStory.title}</h2>
              <p id={`insight-summary-${selectedStory.id}`}>{selectedStory.summary}</p>
            </div>
            <div className="portfolio-dialog-body">
              <figure className="insight-dialog-image">
                <img
                  className={selectedStory.id === 'our-collaboration' ? 'insight-dialog-image-portrait' : undefined}
                  src={selectedStory.image}
                  alt={selectedStory.alt}
                  width={selectedStory.id === 'our-collaboration' ? '400' : '1365'}
                  height={selectedStory.id === 'our-collaboration' ? '600' : '768'}
                  decoding="async"
                />
              </figure>
              <div className="portfolio-dialog-information">
                {selectedStory.sections.map((section) => (
                  <section key={section.heading}>
                    <h3>{section.heading}</h3>
                    <p>{section.body}</p>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  )
}

export function TestimonialsCarousel() {
  const slides = testimonials.map((t, i) => (
    <div className="single-feedback" key={i}>
      <div className="client-info">
        <div className="img">
          <img src={t.img} alt={t.name} />
        </div>
        <h4>{t.name}</h4>
        <span>{t.role}</span>
      </div>
      <p align="justify">{t.text}</p>
      <i className="icofont-quote-right" />
    </div>
  ))
  return (
    <Carousel
      slides={slides}
      className="feedback-slides"
      responsive={{ 0: 1, 768: 2, 1200: 3 }}
      nav={false}
      dots
      autoplay
      interval={4500}
      ariaLabel="Client testimonials"
    />
  )
}

export function PartnerCarousel({ images }) {
  const slides = images.map((src, i) => (
    <div className="item" key={i}>
      <a href="#" onClick={(e) => e.preventDefault()}>
        <img src={src} alt="partner" />
      </a>
    </div>
  ))
  return (
    <Carousel
      slides={slides}
      className="partner-slider"
      responsive={{ 0: 2, 768: 4, 1200: 6 }}
      nav={false}
      dots
      autoplay
      interval={3000}
      ariaLabel="Partner organizations"
    />
  )
}

export function Counter({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration)
            setDisplay(Math.round(value * p))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return <span className="count" ref={ref}>{display}</span>
}

export function Accordion({ items, className = '' }) {
  // The original template closes every other panel on the page when one opens.
  const { accordionOpen, setAccordionOpen } = useUI()
  const baseId = useId()
  return (
    <ul className={`accordion ${className}`.trim()}>
      {items.map((item, i) => {
        const key = `${baseId}-${i}`
        const titleId = `${key}-title`
        const contentId = `${key}-content`
        const active = accordionOpen === key
        return (
          <li className="accordion-item" key={i}>
            <a
              id={titleId}
              className={`accordion-title ${active ? 'active' : ''}`}
              href="#"
              aria-expanded={active}
              aria-controls={contentId}
              onClick={(e) => {
                e.preventDefault()
                setAccordionOpen(active ? null : key)
              }}
            >
              {item.title}
            </a>
            {item.metadata && <div className="careers-role-meta">{item.metadata}</div>}
            <div
              id={contentId}
              className={`accordion-content ${active ? 'show' : ''}`}
              role="region"
              aria-labelledby={titleId}
              aria-hidden={!active}
              align="justify"
            >
              {item.content}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const productFilters = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business & Careers' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'education', label: 'Education' },
  { key: 'commerce', label: 'Ecommerce' },
  { key: 'events', label: 'Events' },
]

export function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    if (!selectedProject) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedProject(null)
        return
      }

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

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus()
    }
  }, [selectedProject])

  const openProject = (project, event) => {
    returnFocusRef.current = event.currentTarget
    setSelectedImageIndex(0)
    setSelectedProject(project)
  }

  const closeProject = () => setSelectedProject(null)
  const activeImage = selectedProject?.images[selectedImageIndex]

  return (
    <section className="project-area portfolio-project-area" id="portfolio-gallery">
      <div className="container">
        <div className="portfolio-section-heading">
          <div>
            <p className="portfolio-eyebrow">Our digital products</p>
            <h2>Purpose-built platforms for work, learning, care, and commerce</h2>
            <p>Each product is shaped around a distinct everyday need—from organizing operations and finding opportunities to learning, shopping, and discovering local services.</p>
          </div>
          <span className="portfolio-project-count">{products.length} products</span>
        </div>
        <div className="portfolio-filters" role="group" aria-label="Filter products by category">
          {productFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filter ${filter === f.key ? 'active' : ''}`}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {products.map((p) => {
            const visible = filter === 'all' || p.cats.includes(filter)
            return (
              <article
                key={p.title}
                className="portfolio-card"
                hidden={!visible}
              >
                <div className="portfolio-product-art portfolio-product-art--image">
                  <img
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    width="1440"
                    height="760"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
                  />
                </div>
                <div className="portfolio-card-copy">
                  <p className="portfolio-card-audience"><i className="icofont-users-alt-5" aria-hidden="true" />{p.audience}</p>
                  <h3>{p.title}</h3>
                  <p className="portfolio-card-summary">{p.summary}</p>
                  <p className="portfolio-card-tech">
                    <span>Technology</span>
                    {p.technologies.length ? p.technologies.slice(0, 4).join(' · ') : 'Not specified in presentation'}
                  </p>
                  <div className="portfolio-card-highlights">
                    <span>Project capabilities</span>
                    <ul>
                      {p.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                  <ul aria-label="Product areas">
                    {p.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <button
                    type="button"
                    className="portfolio-card-details"
                    aria-label={`View ${p.title} project details`}
                    onClick={(event) => openProject(p, event)}
                  >
                    Explore project <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="portfolio-product-cta">
          <div>
            <p className="portfolio-eyebrow">Have a requirement in mind?</p>
            <h2>Let’s find the right digital solution for you.</h2>
            <p>Tell us what you’re looking to improve. Our team can help you explore the product that best fits your organization or community.</p>
          </div>
          <a className="btn btn-primary" href="/contact">Talk to our team<i className="icofont-arrow-right" aria-hidden="true" /></a>
        </aside>
      </div>
      {selectedProject && (
        <div className="portfolio-dialog-backdrop" onClick={closeProject}>
          <section
            ref={dialogRef}
            className="portfolio-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-title-${selectedProject.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="portfolio-dialog-close"
              aria-label={`Close ${selectedProject.title} details`}
              onClick={closeProject}
            >
              &times;
            </button>
            <div className="portfolio-dialog-header">
              <p className="portfolio-eyebrow">{selectedProject.category}</p>
              <h2 id={`project-title-${selectedProject.id}`}>{selectedProject.title}</h2>
              <p>{selectedProject.summary}</p>
            </div>
            <div className="portfolio-dialog-body">
              <div className="portfolio-dialog-gallery">
                <figure className="portfolio-dialog-featured-image">
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    width="1440"
                    height="760"
                    decoding="async"
                  />
                  <figcaption>{activeImage.caption}</figcaption>
                </figure>
                <div className="portfolio-dialog-thumbnails" role="group" aria-label={`${selectedProject.title} screenshots`}>
                  {selectedProject.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      className={`portfolio-dialog-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                      aria-label={`Show ${image.caption}`}
                      aria-pressed={index === selectedImageIndex}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={image.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="portfolio-dialog-information">
                <section aria-labelledby={`project-objective-${selectedProject.id}`}>
                  <h3 id={`project-objective-${selectedProject.id}`}>Project objective</h3>
                  <p>{selectedProject.objective}</p>
                </section>
                <section aria-labelledby={`project-challenge-${selectedProject.id}`}>
                  <h3 id={`project-challenge-${selectedProject.id}`}>The challenge</h3>
                  <p>{selectedProject.caseStudy.challenge}</p>
                </section>
                <section aria-labelledby={`project-solution-${selectedProject.id}`}>
                  <h3 id={`project-solution-${selectedProject.id}`}>Solution approach</h3>
                  <p>{selectedProject.caseStudy.solution}</p>
                </section>
                <section aria-labelledby={`project-features-${selectedProject.id}`}>
                  <h3 id={`project-features-${selectedProject.id}`}>Key features</h3>
                  <ul className="portfolio-dialog-list">
                    {selectedProject.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                </section>
                <section aria-labelledby={`project-services-${selectedProject.id}`}>
                  <h3 id={`project-services-${selectedProject.id}`}>Services and modules</h3>
                  <ul className="portfolio-dialog-pills">
                    {selectedProject.services.map((service) => <li key={service}>{service}</li>)}
                  </ul>
                </section>
                <section aria-labelledby={`project-technologies-${selectedProject.id}`}>
                  <h3 id={`project-technologies-${selectedProject.id}`}>Technologies</h3>
                  {selectedProject.technologies.length > 0 ? (
                    <ul className="portfolio-dialog-pills">
                      {selectedProject.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                  ) : (
                    <p className="portfolio-stack-note">Technology details were not specified in the supplied presentation.</p>
                  )}
                </section>
                <section aria-labelledby={`project-impact-${selectedProject.id}`}>
                  <h3 id={`project-impact-${selectedProject.id}`}>Intended business impact</h3>
                  <p>{selectedProject.caseStudy.impact}</p>
                </section>
                <p className="portfolio-demo-note">
                  A public demo link was not provided for this project. Contact us to discuss a walkthrough.
                </p>
                {selectedProject.roadmap && (
                  <section aria-labelledby={`project-roadmap-${selectedProject.id}`}>
                    <h3 id={`project-roadmap-${selectedProject.id}`}>Planned enhancements</h3>
                    <ul className="portfolio-dialog-list">
                      {selectedProject.roadmap.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <p className="portfolio-roadmap-note">Listed as upcoming or planned in the presentation.</p>
                  </section>
                )}
                <a className="portfolio-dialog-cta" href="/contact" onClick={closeProject}>
                  Request a live demo <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
