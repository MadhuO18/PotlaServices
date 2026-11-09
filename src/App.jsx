import { Routes, Route } from 'react-router-dom'
import { UIProvider } from './components/UIContext.jsx'
import {
  Preloader,
  Header,
  Navbar,
  SideModal,
  Footer,
  GoTop,
  ContactQuickActions,
  Popups,
  ScrollToTop,
} from './components/Chrome.jsx'
import {
  Home,
  About,
  Careers,
  Contact,
  Dermishine,
  Faq,
  PortfolioPage,
  Consulting,
  Logistics,
  Overseas,
  TechSolutions,
  SreeTechnologies,
  Privacy,
  TeluguWebMedia,
  Terms,
  Testimonials,
  DigitalMarketing,
  MobileAppDevelopment,
  WebDesignDevelopment,
  Blog,
  PotlaDevelopers,
  NotFound,
} from './pages.jsx'

export default function App() {
  return (
    <UIProvider>
      <ScrollToTop />
      <Preloader />
      <a className="skip-to-content" href="#main-content">Skip to main content</a>
      <Header />
      <Navbar />
      <SideModal />
      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.php" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dermishine" element={<Dermishine />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/potla-consulting" element={<Consulting />} />
          <Route path="/potla-logistics" element={<Logistics />} />
          <Route path="/potla-overseas" element={<Overseas />} />
          <Route path="/potla-tech-solutions" element={<TechSolutions />} />
          <Route path="/potla-developers" element={<PotlaDevelopers />} />
          <Route path="/sree-technologies" element={<SreeTechnologies />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/teluguwebmedia" element={<TeluguWebMedia />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/digitalmarketing" element={<DigitalMarketing />} />
          <Route path="/mobileapplicationdevelopment" element={<MobileAppDevelopment />} />
          <Route path="/webdesignandwebdevelopment" element={<WebDesignDevelopment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ContactQuickActions />
      <GoTop />
      <Popups />
    </UIProvider>
  )
}
