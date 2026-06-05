import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'

export default function ContatoPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Fale Conosco</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Contato</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-md">
            Entre em contato com a nossa equipe. Estamos à disposição para responder
            suas dúvidas, sugestões e parcerias.
          </p>

          <div className="space-y-5 mb-10">
            {[
              { icon: FaEnvelope, label: 'E-mail', value: 'contato@wolvesfc.com.br', href: 'mailto:contato@wolvesfc.com.br' },
              { icon: FaPhone, label: 'Telefone', value: '+55 (11) 9999-9999', href: 'tel:+5511999999999' },
              { icon: FaWhatsapp, label: 'WhatsApp', value: '+55 (11) 9999-9999', href: 'https://wa.me/5511999999999' },
              { icon: FaMapMarkerAlt, label: 'Endereço', value: 'Rua do Esporte, 100 — São Paulo, SP', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#0c4dbe]" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-white font-semibold hover:text-[#0c4dbe] transition-colors text-sm">
                      {value}
                    </a>
                  ) : (
                    <span className="text-white font-semibold text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-white/10 h-48 bg-[#111] flex items-center justify-center">
            <div className="text-center text-gray-600">
              <FaMapMarkerAlt size={32} className="mx-auto mb-2 text-[#0c4dbe]/40" />
              <p className="text-sm">São Paulo, SP</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-6">Enviar Mensagem</h2>

          {sent && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl px-4 py-3 mb-6 text-sm font-semibold">
              Mensagem enviada com sucesso! Retornaremos em breve.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Nome completo', type: 'text', placeholder: 'Seu nome' },
              { key: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
              { key: 'subject', label: 'Assunto', type: 'text', placeholder: 'Assunto da mensagem' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0c4dbe] transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Mensagem</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Escreva sua mensagem aqui..."
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0c4dbe] transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-xl text-white font-bold uppercase tracking-wide text-sm"
            >
              <span>Enviar Mensagem</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
