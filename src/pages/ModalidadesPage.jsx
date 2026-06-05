import { FaFootballBall, FaShieldAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

export default function ModalidadesPage() {
  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-14">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Estrutura Esportiva</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Modalidades</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
          O Wolves UTFPR-CP compete em duas modalidades de futebol americano — full pad e flag football.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Full Pad */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group">
          <div className="bg-gradient-to-br from-[#0c4dbe] to-[#00102e] h-48 flex items-center justify-center relative">
            <span className="text-[180px] font-black text-white/10 select-none leading-none absolute">W</span>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FaFootballBall size={36} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Modalidade Principal</span>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-white font-black text-2xl mb-1 group-hover:text-[#6b90d4] transition-colors">
              Futebol Americano
            </h2>
            <p className="text-[#0c4dbe] font-bold text-sm uppercase tracking-widest mb-4">Full Pad</p>
            <p className="text-gray-400 leading-relaxed mb-6">
              A modalidade completa com equipamento — capacete, ombreira, joelheira e caneleira. Os atletas disputam
              partidas de tackle em competições regionais e nacionais, enfrentando equipes de outras universidades e
              clubes do Paraná e do Brasil.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Contato físico', value: 'Tackle' },
                { label: 'Equipamento', value: 'Completo' },
                { label: 'Nível', value: 'Amador / Universitário' },
                { label: 'Treinos', value: 'Ter, Qui e Sáb' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black/30 rounded-xl p-3">
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-white font-bold text-sm">{value}</div>
                </div>
              ))}
            </div>
            <NavLink
              to="/treinos"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white font-bold text-sm uppercase tracking-wide"
            >
              <FaCalendarAlt size={14} />
              Ver horários de treino
            </NavLink>
          </div>
        </div>

        {/* Flag Football */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group">
          <div className="bg-gradient-to-br from-orange-600 to-orange-900 h-48 flex items-center justify-center relative">
            <span className="text-[180px] font-black text-white/10 select-none leading-none absolute">W</span>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt size={36} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-200">Flag Football</span>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-white font-black text-2xl mb-1 group-hover:text-orange-400 transition-colors">
              Flag Football
            </h2>
            <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-4">Sem contato</p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Versão do futebol americano sem contato físico direto — o marcador arranca a flag da cintura do
              portador da bola no lugar do tackle. É uma modalidade mais acessível, aberta a mais idades e muito
              popular em torneios regionais e campeonatos estaduais do Paraná.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Contato físico', value: 'Sem tackle' },
                { label: 'Equipamento', value: 'Belt + Flag' },
                { label: 'Nível', value: 'Amador / Regional' },
                { label: 'Treinos', value: 'Ter, Qui e Sáb' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black/30 rounded-xl p-3">
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-white font-bold text-sm">{value}</div>
                </div>
              ))}
            </div>
            <NavLink
              to="/treinos"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white font-bold text-sm uppercase tracking-wide border-2 border-orange-500 hover:bg-orange-500/20 transition-colors"
            >
              <FaCalendarAlt size={14} />
              Ver horários de treino
            </NavLink>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c4dbe] to-[#083a9e] p-10 text-center">
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
            <FaUsers size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Faça parte do time</h2>
          <p className="text-blue-100 mb-7 max-w-md mx-auto">
            Os treinos são abertos — full pad ou flag, não importa. Apareça na UTFPR CP e venha jogar!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink
              to="/treinos"
              className="bg-white text-[#0c4dbe] font-black px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm"
            >
              Ver Horários
            </NavLink>
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
