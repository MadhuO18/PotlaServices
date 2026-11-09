import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContentRenderer } from './renderContent.jsx'

import indexHtml from './content/index.html?raw'
import aboutHtml from './content/about.html?raw'
import careersHtml from './content/careers.html?raw'
import contactHtml from './content/contact.html?raw'
import dermishineHtml from './content/dermishine.html?raw'
import faqHtml from './content/faq.html?raw'
import portfolioHtml from './content/portfolio.html?raw'
import consultingHtml from './content/potla-consulting.html?raw'
import logisticsHtml from './content/potla-logistics.html?raw'
import overseasHtml from './content/potla-overseas.html?raw'
import techHtml from './content/potla-tech-solutions.html?raw'
import sreeTechnologiesHtml from './content/sree-technologies.html?raw'
import privacyHtml from './content/privacy-policy.html?raw'
import teluguHtml from './content/teluguwebmedia.html?raw'
import termsHtml from './content/terms-conditions.html?raw'
import testimonialsHtml from './content/testimonials.html?raw'
import digitalHtml from './content/digitalmarketing.html?raw'
import mobileHtml from './content/mobileapplicationdevelopment.html?raw'
import webHtml from './content/webdesignandwebdevelopment.html?raw'
import blogHtml from './content/blog.html?raw'
import developersHtml from './content/potla-developers.html?raw'

const DEFAULT_TITLE = 'Potla Group of Companies | Technology, Talent & Digital Services'

function Page({ html, title = DEFAULT_TITLE, description }) {
  const render = useContentRenderer()
  useEffect(() => {
    document.title = title
    if (!description) return undefined

    const existingDescription = document.querySelector('meta[name="description"]')
    const previousContent = existingDescription?.getAttribute('content') ?? null
    const metaDescription = existingDescription || document.createElement('meta')
    if (!existingDescription) {
      metaDescription.name = 'description'
      document.head.append(metaDescription)
    }
    metaDescription.content = description

    return () => {
      if (previousContent === null) metaDescription.remove()
      else metaDescription.content = previousContent
    }
  }, [title, description])
  return <>{render(html)}</>
}

export const Home = () => (
  <Page
    html={indexHtml}
    title={DEFAULT_TITLE}
    description="Discover Potla Group of Companies: software development, consulting, digital media, technology services, and career opportunities."
  />
)
export const About = () => (
  <Page
    html={aboutHtml}
    title="About Potla Group | Our Companies, Mission & Leadership"
    description="Learn about Potla Group, its five companies, leadership, mission, vision, and work across technology, talent, and digital services."
  />
)
export const Careers = () => (
  <Page
    html={careersHtml}
    title="Careers at Potla Group | Technology and Digital Roles"
    description="Explore technology, cloud, AI, mobile, and digital marketing opportunities at Potla Group of Companies."
  />
)
export const Contact = () => (
  <Page
    html={contactHtml}
    title="Contact Potla Group | Start a Conversation"
    description="Contact Potla Group about software, consulting, staffing, digital media, and technology services."
  />
)
export const Dermishine = () => <Page html={dermishineHtml} />
export const Faq = () => <Page html={faqHtml} />
export const PortfolioPage = () => (
  <Page
    html={portfolioHtml}
    title="Digital Products Portfolio | Potla Group of Companies"
    description="Explore Potla Group digital products for HR, recruitment, healthcare, education, local commerce, events, and fashion, with project features and technology details."
  />
)
export const Consulting = () => (
  <Page
    html={consultingHtml}
    title="Potla Consulting | Product Development, Cloud & Technology Services"
    description="Explore Potla Consulting's product and application development, cloud solutions, custom software and ERP, and technology consulting services."
  />
)
export const Logistics = () => <Page html={logisticsHtml} />
export const Overseas = () => <Page html={overseasHtml} />
export const TechSolutions = () => <Page html={techHtml} />
export const SreeTechnologies = () => (
  <Page html={sreeTechnologiesHtml} title="Sree Technologies | Potla Group" />
)
export const Privacy = () => <Page html={privacyHtml} />
export const TeluguWebMedia = () => <Page html={teluguHtml} />
export const Terms = () => <Page html={termsHtml} />
export const Testimonials = () => <Page html={testimonialsHtml} />
export const DigitalMarketing = () => <Page html={digitalHtml} />
export const MobileAppDevelopment = () => <Page html={mobileHtml} />
export const WebDesignDevelopment = () => <Page html={webHtml} />
export const Blog = () => (
  <Page
    html={blogHtml}
    title="Insights | Potla Group of Companies"
    description="Meet the people behind Potla Group and explore company culture, team moments, and milestones, including the Bheeshma Vishishta Puraskar."
  />
)
export const PotlaDevelopers = () => (
  <Page
    html={developersHtml}
    title="Potla Developers | Property, Construction & Advisory"
    description="Explore Potla Developers services for open plots, construction, and real estate property advisory."
  />
)

export function NotFound() {
  useEffect(() => {
    document.title = DEFAULT_TITLE
  }, [])
  return (
    <div className="page-title animatedBackground">
      <div className="container">
        <h3>404 — Page Not Found</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li className="dot-divider" />
          <li>404</li>
        </ul>
      </div>
      <div className="bg-pattern">
        <img src="/assets/img/bg-pattern-2.png" alt="pattern" />
      </div>
    </div>
  )
}
