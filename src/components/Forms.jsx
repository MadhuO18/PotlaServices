import { useState } from 'react'

function useFakeSubmit() {
  const [state, setState] = useState({ status: 'idle', message: '' })
  const submit = (e, validate) => {
    e.preventDefault()
    const form = e.currentTarget
    const err = validate ? validate(form) : null
    if (err) {
      setState({ status: 'error', message: err })
      return
    }
    setState({ status: 'success', message: 'Thank you! Your submission has been received.' })
    form.reset()
    setTimeout(() => setState({ status: 'idle', message: '' }), 5000)
  }
  return [state, submit]
}

const required = (form, names) => {
  for (const n of names) {
    const el = form.elements[n]
    if (el && !String(el.value).trim()) return 'Please fill in all required fields.'
  }
  const email = form.elements.email
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return 'Please enter your email correctly.'
  }
  return null
}

export function EnquiryForm() {
  const [state, submit] = useFakeSubmit()
  return (
    <form onSubmit={(e) => submit(e, (f) => required(f, ['name', 'email', 'phone']))} noValidate>
      <div className="form-group"><input name="name" type="text" placeholder="Name*" className="form-control" /></div>
      <div className="form-group"><input name="email" type="email" placeholder="Email*" className="form-control" /></div>
      <div className="form-group"><input name="phone" type="text" placeholder="Phone*" className="form-control" /></div>
      <div className="form-group"><textarea name="message" className="form-control" placeholder="Message" /></div>
      <button type="submit" className="btn btn-primary">Enquire Now</button>
      {state.message && <div className={`rtl-form-msg ${state.status}`}>{state.message}</div>}
    </form>
  )
}

export function ContactForm() {
  const [state, setState] = useState({ status: 'idle', message: '' })
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '')
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const validationError = required(form, ['name', 'email', 'message'])
    if (validationError) {
      setState({ status: 'error', message: validationError })
      return
    }

    if (!supabaseConfigured) {
      setState({ status: 'error', message: 'The contact service is not configured. Please contact us by phone or email.' })
      return
    }

    setState({ status: 'submitting', message: 'Sending your message securely…' })
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact-inquiry`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim(),
          subject: form.elements.subject.value.trim(),
          message: form.elements.message.value.trim(),
          website: form.elements.website.value,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setState({
          status: 'error',
          message: result.error || 'We could not submit your message. Please try again later.',
        })
        return
      }

      form.reset()
      setState({ status: 'success', message: 'Your message has been sent. Our team will be in touch.' })
    } catch {
      setState({
        status: 'error',
        message: 'We could not connect to the contact service. Please try again later.',
      })
    }
  }

  return (
    <form className="contact-page-form" onSubmit={submit} noValidate>
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="form-group">
            <input className="form-control" name="name" placeholder="Full name*" autoComplete="name" aria-label="Full name" required type="text" />
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="form-group">
            <input className="form-control" name="email" placeholder="Email address*" autoComplete="email" aria-label="Email address" required type="email" />
          </div>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <input className="form-control" name="subject" placeholder="What can we help with?" aria-label="Subject" type="text" />
          </div>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <textarea className="form-control" cols="30" id="message" name="message" placeholder="Tell us a little about your project or question*" aria-label="Your message" maxLength="1000" required rows="5" />
            <small>Maximum 1,000 characters.</small>
          </div>
        </div>
        <div className="contact-form-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" />
        </div>
        <div className="col-lg-12 col-md-12">
          <button className="btn btn-primary" type="submit" disabled={state.status === 'submitting'}>
            {state.status === 'submitting' ? 'Sending…' : 'Send message'}
            <i className="icofont-arrow-right" aria-hidden="true" />
          </button>
          {state.message && (
            <div className={`rtl-form-msg ${state.status}`} role={state.status === 'error' ? 'alert' : 'status'} aria-live="polite">
              {state.message}
            </div>
          )}
          <div className="clearfix" />
        </div>
      </div>
    </form>
  )
}

export function CareersForm() {
  const [state, setState] = useState({ status: 'idle', message: '' })
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '')
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const validationError = required(form, ['name', 'email', 'phone', 'role'])
    if (validationError) {
      setState({ status: 'error', message: validationError })
      return
    }

    const resume = form.elements.resume.files?.[0]
    if (!resume) {
      setState({ status: 'error', message: 'Please attach your resume before continuing.' })
      return
    }
    if (!/\.(pdf|doc|docx)$/i.test(resume.name)) {
      setState({ status: 'error', message: 'Please choose a PDF, DOC, or DOCX resume.' })
      return
    }
    if (resume.size > 5 * 1024 * 1024) {
      setState({ status: 'error', message: 'Your resume must be 5 MB or smaller.' })
      return
    }

    if (!supabaseConfigured) {
      setState({ status: 'submitting', message: 'Saving this application on this device…' })
      try {
        const applicationId = await saveLocalCareerApplication({
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim(),
          phone: form.elements.phone.value.trim(),
          role: form.elements.role.value,
          resume,
        })
        form.reset()
        setState({
          status: 'success',
          message: `Saved on this device only (reference: ${applicationId}). It has not been sent to the careers team. Configure online storage to receive applications centrally.`,
        })
      } catch {
        setState({
          status: 'error',
          message: 'We could not save this application on your device. Check your browser storage settings and try again.',
        })
      }
      return
    }

    setState({ status: 'submitting', message: 'Submitting your application securely…' })
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-career-application`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: new FormData(form),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setState({
          status: 'error',
          message: result.error || 'We could not submit your application. Please try again later.',
        })
        return
      }

      form.reset()
      setState({
        status: 'success',
        message: `Your application has been submitted and saved. Reference: ${result.applicationId}`,
      })
    } catch {
      setState({
        status: 'error',
        message: 'We could not connect to the application service. Please try again later.',
      })
    }
  }

  return (
    <form className="careers-application-form" onSubmit={submit} noValidate>
      <div className="analysis-form">
        <div className="form-group"><input className="form-control" name="name" placeholder="Full name*" type="text" autoComplete="name" aria-label="Full name" required /></div>
        <div className="form-group"><input className="form-control" name="email" placeholder="Email address*" type="email" autoComplete="email" aria-label="Email address" required /></div>
        <div className="form-group"><input className="form-control" name="phone" placeholder="Phone number*" type="tel" autoComplete="tel" aria-label="Phone number" required /></div>
        <div className="form-group">
          <select className="sai" name="role" defaultValue="" aria-label="Select a role" required>
            <option value="">Select a role*</option>
            <option value="Python Full Stack Developer">Python Full Stack Developer</option>
            <option value="AWS Cloud Engineer">AWS Cloud Engineer</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Mobile Application Developer">Mobile Application Developer</option>
            <option value="Digital Marketer">Digital Marketer</option>
          </select>
        </div>
        <div className="form-group careers-resume-group">
          <label htmlFor="careers-resume">Resume <span>(PDF, DOC, or DOCX; max 5 MB)</span></label>
          <input
            className="form-control"
            id="careers-resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-describedby="careers-resume-note"
            required
          />
          <small id="careers-resume-note">
            {supabaseConfigured
              ? 'Your resume will be stored privately with your application (maximum 5 MB).'
              : 'Temporary mode: your resume and details stay in this browser on this device and are not sent to our team.'}
          </small>
        </div>
        <div className="careers-form-honeypot" aria-hidden="true">
          <label htmlFor="careers-website">Leave this field empty</label>
          <input id="careers-website" name="website" type="text" tabIndex="-1" autoComplete="off" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Submitting…' : 'Submit application'}
          <i className="icofont-arrow-right" aria-hidden="true" />
        </button>
        {state.message && (
          <div className={`rtl-form-msg ${state.status}`} role={state.status === 'error' ? 'alert' : 'status'} aria-live="polite">
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}

function saveLocalCareerApplication(application) {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Browser storage is unavailable.'))
      return
    }

    const request = window.indexedDB.open('potla-career-applications', 1)
    request.onerror = () => reject(request.error || new Error('Could not open browser storage.'))
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains('applications')) {
        database.createObjectStore('applications', { keyPath: 'id' })
      }
    }
    request.onsuccess = () => {
      const database = request.result
      const id = crypto.randomUUID()
      const transaction = database.transaction('applications', 'readwrite')
      transaction.objectStore('applications').add({
        ...application,
        id,
        createdAt: new Date().toISOString(),
        resume: {
          name: application.resume.name,
          type: application.resume.type,
          size: application.resume.size,
          file: application.resume,
        },
      })
      transaction.oncomplete = () => {
        database.close()
        resolve(id)
      }
      transaction.onerror = () => {
        database.close()
        reject(transaction.error || new Error('Could not save the application.'))
      }
      transaction.onabort = () => {
        database.close()
        reject(transaction.error || new Error('Application storage was interrupted.'))
      }
    }
  })
}

export function NewsletterForm() {
  const [state, setState] = useState({ status: 'idle', message: '' })
  const onSubmit = (e) => {
    e.preventDefault()
    const email = e.currentTarget.elements.EMAIL.value
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ status: 'error', message: 'Please enter your email correctly.' })
      return
    }
    setState({ status: 'success', message: 'Thank you for subscribing!' })
    e.currentTarget.reset()
    setTimeout(() => setState({ status: 'idle', message: '' }), 4000)
  }
  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate>
      <input
        type="email"
        className="form-control"
        placeholder="Enter your email address"
        name="EMAIL"
        required
        autoComplete="off"
      />
      <button className="btn btn-primary" type="submit">Subscribe</button>
      <div id="validator-newsletter" className={`form-result ${state.status === 'success' ? 'validation-success' : state.status === 'error' ? 'validation-danger' : ''}`}>
        {state.message}
      </div>
    </form>
  )
}
