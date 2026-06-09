import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { FaEnvelope, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaExternalLinkAlt, FaPaperPlane } from 'react-icons/fa'

const defaults = {
  email: 'wolvescp.utfpr@gmail.com',
  instagram: 'wolvesutfcp',
  whatsapp: '5543999999999',
  endereco: 'UTFPR — Campus Cornélio Procópio',
  enderecoSub: 'Av. Alberto Carazzai, 1640 · Cornélio Procópio, PR',
}

const emptyForm = { nome: '', email: '', assunto: '', mensagem: '' }

export default function ContatoPage() {
  const [info, setInfo] = useState(defaults)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    getDoc(doc(db, 'config', 'contato')).then(snap => {
      if (snap.exists()) setInfo({ ...defaults, ...snap.data() })
    })
  }, [])

  const contacts = [
    {
      icon: FaEnvelope,
      label: 'E-mail',
      value: info.email,
      href: `mailto:${info.email}`,
      description: 'Dúvidas, parcerias e informações gerais',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: FaInstagram,
      label: 'Instagram',
      value: `@${info.instagram}`,
      href: `https://instagram.com/${info.instagram}`,
      description: 'Acompanhe fotos, treinos e jogos',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: 'Fale com a gente',
      href: `https://wa.me/${info.whatsapp}`,
      description: 'Atendimento rápido pelo WhatsApp',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Endereço',
      value: info.endereco,
      sub: info.enderecoSub,
      href: `https://maps.google.com/?q=${encodeURIComponent(info.endereco)}`,
      description: 'Encontre-nos no campus',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const lines = [
      `*Mensagem via site — Wolves UTFPR-CP*`,
      ``,
      `*Nome:* ${form.nome}`,
      form.email ? `*E-mail:* ${form.email}` : null,
      form.assunto ? `*Assunto:* ${form.assunto}` : null,
      ``,
      form.mensagem,
    ].filter(l => l !== null).join('\n')

    window.open(`https://wa.me/${info.whatsapp}?text=${encodeURIComponent(lines)}`, '_blank')
    setForm(emptyForm)
  }

  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0c4dbe] transition-colors"
  const labelClass = "text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2"

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-5xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Fale Conosco</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Contato</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
          Entre em contato com o Wolves UTFPR-CP. Estamos sempre abertos para dúvidas, parcerias e novos atletas.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {contacts.map(({ icon: Icon, label, value, sub, href, description, color, bg }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={`group flex items-start gap-5 p-6 rounded-2xl border ${bg} hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
              <Icon size={22} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</div>
              <div className="text-white font-bold text-base truncate">{value}</div>
              {sub && <div className="text-gray-400 text-xs mt-0.5">{sub}</div>}
              <div className="text-gray-500 text-xs mt-2">{description}</div>
            </div>
            <FaExternalLinkAlt size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors mt-1 shrink-0" />
          </a>
        ))}
      </div>

      {/* Formulário */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 mb-12">
        <div className="mb-6">
          <h2 className="text-white font-black text-xl">Envie uma mensagem</h2>
          <p className="text-gray-500 text-sm mt-1">Preencha o formulário e será redirecionado para o nosso WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Seu nome"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail <span className="text-gray-600 normal-case tracking-normal font-normal">(opcional)</span></label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Assunto <span className="text-gray-600 normal-case tracking-normal font-normal">(opcional)</span></label>
            <input
              type="text"
              value={form.assunto}
              onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
              placeholder="Ex: Quero entrar para o time, Parceria..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Mensagem</label>
            <textarea
              required
              rows={5}
              value={form.mensagem}
              onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
              placeholder="Escreva sua mensagem aqui..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            <FaWhatsapp size={16} />
            Enviar pelo WhatsApp
            <FaPaperPlane size={12} />
          </button>
        </form>
      </div>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden border border-white/10 h-80">
        <iframe
          title="UTFPR Cornélio Procópio"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.964!2d-50.6484!3d-23.1745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c3e9a5a5a5a5a5%3A0x0!2sUTFPR+-+Campus+Corn%C3%A9lio+Proc%C3%B3pio!5e0!3m2!1spt-BR!2sbr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
