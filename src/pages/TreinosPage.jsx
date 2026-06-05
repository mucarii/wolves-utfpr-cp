import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFootballBall, FaUserPlus } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const schedule = [
  { day: 'Terça-feira', time: '17h30', type: 'Treino Geral', icon: FaFootballBall, color: 'bg-[#0c4dbe]' },
  { day: 'Quinta-feira', time: '17h30', type: 'Treino Técnico', icon: FaFootballBall, color: 'bg-[#0c4dbe]' },
  { day: 'Sábado', time: '09h00', type: 'Treino & Scrimmage', icon: FaFootballBall, color: 'bg-emerald-600' },
]

export default function TreinosPage() {
  return (
    <div className="page-enter pt-10 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Venha jogar</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Treinos</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
          Os treinos são abertos. Se você quer conhecer o futebol americano ou já tem experiência,
          apareça em um dos nossos dias e venha fazer parte do time!
        </p>
      </div>

      {/* Schedule cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {schedule.map(({ day, time, type, icon: Icon, color }) => (
          <div key={day} className="bg-[#111] border border-white/10 rounded-2xl p-8 card-hover text-center">
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
              <Icon size={28} className="text-white" />
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">{type}</div>
            <h3 className="text-white font-black text-xl mb-2">{day}</h3>
            <div className="flex items-center justify-center gap-2 text-[#0c4dbe] text-2xl font-black">
              <FaClock size={18} />
              {time}
            </div>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-20 h-20 rounded-2xl bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 flex items-center justify-center shrink-0">
          <FaMapMarkerAlt size={32} className="text-[#0c4dbe]" />
        </div>
        <div>
          <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Localização</div>
          <h3 className="text-white font-black text-2xl mb-2">UTFPR — Campus Cornélio Procópio</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Universidade Tecnológica Federal do Paraná<br />
            Cornélio Procópio — PR, Brasil
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c4dbe] to-[#083a9e] p-10 text-center">
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
            <FaUserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Quer entrar para o time?</h2>
          <p className="text-blue-100 mb-7 max-w-md mx-auto">
            Apareça em qualquer treino, ou mande uma mensagem para o Instagram do clube.
            Sem necessidade de experiência prévia!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://instagram.com/wolvesutfcp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0c4dbe] font-black px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm"
            >
              @wolvesutfcp no Instagram
            </a>
            <NavLink
              to="/contato"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide text-sm"
            >
              Fale Conosco
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
