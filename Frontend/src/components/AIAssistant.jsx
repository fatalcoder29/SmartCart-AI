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
      text: 'Hello! I am your SmartCart AI Stylist & Shopping Assistant powered by Google Gemini. Ask me anything about our collection, gift suggestions, or styling tips.',
      products: [],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const { addToCart } = useCart()
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickPrompts = [
    '✨ Recommend winter coats',
    '🎁 Gifts under €200',
    '👜 Best leather accessories',
    '🧵 Fabric & sizing guide',
  ]

  async function handleSend(userQuery) {
    const text = userQuery || input
    if (!text.trim()) return

    const userMsg = { id: Date.now().toString(), sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    if (!userQuery) setInput('')
    setIsTyping(true)

    let responseText = ''
    let matchedProducts = []

    try {
      // Send real API request to Backend Gemini AI Endpoint
      const res = await api.aiChat(text)
      if (res && res.reply) {
        responseText = res.reply
      }
    } catch {
      // Fallback matching logic
      const queryLower = text.toLowerCase()
      if (queryLower.includes('coat') || queryLower.includes('outerwear')) {
        responseText = 'Here are our top-rated Nordic outerwear pieces designed for warmth and timeless style:'
        matchedProducts = products.filter((p) => p.category === 'outerwear')
      } else if (queryLower.includes('gift') || queryLower.includes('200')) {
        responseText = 'These handcrafted items make thoughtful, luxurious gifts:'
        matchedProducts = products.filter((p) => p.price <= 200)
      } else {
        responseText = `Based on your query "${text}", here are curated items from our collection:`
        matchedProducts = products.slice(0, 3)
      }
    } finally {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: responseText || 'I am ready to assist with your shopping choices!',
          products: matchedProducts,
        },
      ])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-ink px-5 py-3.5 text-xs font-medium text-cream shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-terracotta"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
          </span>
          <Sparkles className="h-4 w-4 text-cream transition duration-300 group-hover:rotate-12" />
          <span>Gemini AI Stylist</span>
        </button>
      ) : (
        <div className="flex h-[540px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream/95 shadow-2xl backdrop-blur-xl transition-all duration-300">
          {/* Header */}
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
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-cream/70 hover:bg-white/10 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-ink text-cream rounded-br-none'
                      : 'bg-cream-dark/80 text-ink border border-ink/5 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Inline Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 grid w-full grid-cols-1 gap-2">
                    {msg.products.slice(0, 3).map((prod) => (
                      <div
                        key={prod.id || prod._id}
                        className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream p-2.5 shadow-sm transition hover:border-terracotta/50"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onError={(e) => {
                            e.currentTarget.src = getPlaceholderImage(prod.name, prod.category)
                          }}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-xs font-medium">{prod.name}</h4>
                          <span className="text-[11px] font-semibold text-terracotta">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(prod.id || prod._id, (prod.sizes && prod.sizes[0]) || 'M', 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream transition hover:bg-terracotta"
                          title="Add to Cart"
                        >
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
                <span className="ml-1 text-[11px]">Gemini AI analyzing request...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="border-t border-ink/5 bg-cream/30 p-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt.replace(/^[✨🎁👜🧵]\s*/, ''))}
                  className="rounded-full border border-ink/10 bg-cream px-3 py-1 text-[11px] text-ink-muted transition hover:border-terracotta hover:text-terracotta shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-cream p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini AI..."
              className="flex-1 rounded-full border border-ink/10 bg-cream-dark/50 px-4 py-2 text-xs focus:border-terracotta focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream transition disabled:opacity-40 hover:bg-terracotta"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
