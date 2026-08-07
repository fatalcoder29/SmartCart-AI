import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Bot, ShoppingBag } from 'lucide-react'
import { products, formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your SmartCart AI Stylist powered by Google Gemini. Ask about our collection, gifts, or styling. All prices in ₹.',
      products: [],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const { addToCart } = useCart()
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const quickPrompts = [
    'Recommend winter coats',
    'Gifts under 15000',
    'Best leather accessories',
    'Fabric and sizing guide',
  ]

  function matchLocalProducts(query) {
    const q = query.toLowerCase()
    let list = []
    if (q.includes('coat') || q.includes('outerwear') || q.includes('winter')) {
      list = products.filter((p) => p.category === 'outerwear')
    } else if (q.includes('gift') || q.includes('15000') || q.includes('under')) {
      list = products.filter((p) => p.price <= 15000)
    } else if (q.includes('leather') || q.includes('bag') || q.includes('accessories')) {
      list = products.filter((p) => p.category === 'leather')
    } else if (q.includes('knit') || q.includes('cashmere') || q.includes('scarf') || q.includes('fabric')) {
      list = products.filter((p) => p.category === 'knitwear')
    } else if (q.includes('shoe') || q.includes('boot') || q.includes('loafer') || q.includes('footwear')) {
      list = products.filter((p) => p.category === 'footwear')
    } else if (q.includes('size') || q.includes('sizing') || q.includes('fit')) {
      list = products.slice(0, 2)
    } else {
      list = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      )
      if (list.length === 0) list = products.slice(0, 3)
    }
    return list.slice(0, 3)
  }

  async function handleSend(userQuery) {
    const text = userQuery || input
    if (!text.trim()) return
    const userMsg = { id: Date.now().toString(), sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    if (!userQuery) setInput('')
    setIsTyping(true)
    let responseText = ''
    let matchedProducts = matchLocalProducts(text)
    try {
      const res = await api.aiChat(text)
      if (res && res.reply) {
        responseText = res.reply
        if (res.products?.length) {
          matchedProducts = res.products.map((p) => ({ ...p, id: p._id || p.id }))
        }
      }
    } catch {
      const q = text.toLowerCase()
      if (q.includes('coat') || q.includes('outerwear') || q.includes('winter')) {
        responseText = 'Here are our top Nordic outerwear pieces — warm, tailored, and built to last:'
      } else if (q.includes('gift') || q.includes('15000')) {
        responseText = 'Thoughtful luxury gifts under ₹15,000 from our current edit:'
      } else if (q.includes('leather')) {
        responseText = 'Our vegetable-tanned leather goods — compact, durable, everyday carry:'
      } else if (q.includes('size') || q.includes('fit') || q.includes('fabric')) {
        responseText = 'Most outerwear and knitwear run true to size (XS–XL). Leather is one-size. Footwear uses EU sizing.'
        matchedProducts = []
      } else {
        responseText = `Based on "${text}", here are curated pieces from Maren & Co (prices in ₹):`
      }
    } finally {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: responseText || 'I am your SmartCart AI stylist. Ask about coats, gifts, leather, or sizing — prices in ₹.',
          products: matchedProducts,
        },
      ])
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 safe-bottom sm:bottom-6 sm:right-6">
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} className="group relative flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-xs font-medium text-cream shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-terracotta sm:gap-2.5 sm:px-5 sm:py-3.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
          </span>
          <Sparkles className="h-4 w-4 text-cream transition duration-300 group-hover:rotate-12" />
          <span className="hidden sm:inline">Gemini AI Stylist</span>
          <span className="sm:hidden">AI</span>
        </button>
      ) : (
        <div className="animate-scale-in flex h-[min(540px,85dvh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream/95 shadow-2xl backdrop-blur-xl sm:w-[400px]">
          <div className="flex items-center justify-between border-b border-ink/10 bg-ink px-4 py-3.5 text-cream">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-cream">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-medium tracking-wide">SmartCart Gemini AI</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-cream/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Active AI Advisor
                </span>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-cream/70 hover:bg-white/10" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-ink text-cream rounded-br-none' : 'bg-cream-dark/80 text-ink border border-ink/5 rounded-bl-none'}`}>
                  {msg.text}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 grid w-full grid-cols-1 gap-2">
                    {msg.products.slice(0, 3).map((prod) => (
                      <div key={prod.id || prod._id} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream p-2.5 shadow-sm">
                        <img src={prod.image} alt={prod.name} onError={(e) => { e.currentTarget.src = getPlaceholderImage(prod.name, prod.category) }} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-xs font-medium">{prod.name}</h4>
                          <span className="text-[11px] font-semibold text-terracotta">{formatPrice(prod.price)}</span>
                        </div>
                        <button type="button" onClick={() => addToCart(prod.id || prod._id, (prod.sizes && prod.sizes[0]) || 'M', 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream hover:bg-terracotta">
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-cream-dark/50 px-3 py-2 rounded-xl w-fit">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px]">Analyzing…</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-ink/5 bg-cream/30 p-2 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-1.5">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => handleSend(prompt)} className="rounded-full border border-ink/10 bg-cream px-3 py-1 text-[11px] text-ink-muted hover:border-terracotta hover:text-terracotta shrink-0">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex items-center gap-2 border-t border-ink/10 bg-cream p-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Gemini AI..." className="flex-1 rounded-full border border-ink/10 bg-cream-dark/50 px-4 py-2 text-xs focus:border-terracotta focus:outline-none" />
            <button type="submit" disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream disabled:opacity-40 hover:bg-terracotta">
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
