import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold text-terracotta tracking-widest uppercase">
            Client Care & Inquiries
          </span>
          <h1 className="font-display mt-2 text-4xl md:text-5xl font-medium">Get in Touch</h1>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Have questions regarding sizing, custom tailoring, or an existing order? Our Oslo team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-ink/10 bg-cream/60 p-8 backdrop-blur-sm shadow-sm space-y-6">
              <h2 className="font-display text-2xl font-medium">Oslo Flagship & Atelier</h2>

              <div className="flex items-start gap-4 text-xs">
                <div className="rounded-xl bg-ink p-2.5 text-cream">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Atelier Address</h3>
                  <p className="text-ink-muted mt-1">Karl Johans gate 14<br />0154 Oslo, Norway</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs">
                <div className="rounded-xl bg-ink p-2.5 text-cream">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Email Support</h3>
                  <p className="text-ink-muted mt-1">care@marenco.oslo</p>
                  <p className="text-[10px] text-terracotta mt-0.5">Average response: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs">
                <div className="rounded-xl bg-ink p-2.5 text-cream">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Client Helpline</h3>
                  <p className="text-ink-muted mt-1">+47 22 84 90 00</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs">
                <div className="rounded-xl bg-ink p-2.5 text-cream">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-ink">Atelier Hours</h3>
                  <p className="text-ink-muted mt-1">Mon – Fri: 09:00 – 18:00 CET<br />Sat: 10:00 – 16:00 CET</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-ink/10 bg-cream/80 p-8 backdrop-blur-sm shadow-sm">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-medium">Message Sent Successfully</h2>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Thank you, {formData.name}. Our Oslo atelier advisor will review your message and reach out shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
                    }}
                    className="mt-6 rounded-full border border-ink/20 px-6 py-2.5 text-xs font-medium text-ink hover:bg-cream-dark"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  <h2 className="font-display text-2xl font-medium mb-6">Send us a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-ink mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Astrid Solberg"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-ink mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="astrid@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-ink mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Size & Fit Assistance">Size & Fit Assistance</option>
                      <option value="Returns & Exchanges">Returns & Exchanges</option>
                      <option value="Press & Atelier Visit">Press & Atelier Visit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-ink mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can our Oslo team assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-medium text-cream hover:bg-terracotta transition w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Transmit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
