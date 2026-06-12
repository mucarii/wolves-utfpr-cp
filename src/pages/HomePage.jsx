import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import usePageTitle from '../hooks/usePageTitle'
import HeroSection from '../components/HeroSection'
import NewsCards from '../components/NewsCards'
import { FaTrophy, FaUsers, FaFootballBall, FaArrowRight, FaClock, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const DEFAULT_STATS = [
  { label: 'Atletas',       value: '45+', dark: true },
  { label: 'Posts no Insta', value: '50',  dark: false },
  { label: 'Seguidores',    value: '825', dark: false },
  { label: 'Modalidades',   value: '2',   dark: true },
]

const DEFAULT_SCHEDULE = [
  { day: 'Terça-feira',   time: '17h30' },
  { day: 'Quinta-feira',  time: '17h30' },
  { day: 'Sábado',        time: '09h00' },
]

const DEFAULT_HIGHLIGHTS = [
  { icon: FaTrophy,       title: 'Campeões',          desc: 'Títulos em campeonatos de tackle e flag no cenário paranaense e nacional.' },
  { icon: FaFootballBall, title: 'Futebol Americano', desc: 'Full pad e Flag Football com atletas da UTFPR-CP.' },
  { icon: FaUsers,        title: '825 Seguidores',    desc: 'Comunidade crescendo. Siga @wolvesutfcp e acompanhe cada jogo.' },
]

export default function HomePage() {
  usePageTitle()
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)

  useEffect(() => {
    getDoc(doc(db, 'config', 'home')).then(snap => {
      if (snap.exists()) {
        if (snap.data().stats?.length) setStats(snap.data().stats)
      }
    }).catch(() => {})

    getDoc(doc(db, 'config', 'treinos')).then(snap => {
      if (snap.exists() && snap.data().schedule?.length) setSchedule(snap.data().schedule)
    }).catch(() => {})
  }, [])

  return (
    <div className="page-enter">
      {/* Hero Slider */}
      <HeroSection />

      {/* Quick info strip */}
      <section className="bg-[#0c4dbe] py-10 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8">
          {DEFAULT_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 text-white">
              <div className="w-11 h-11 rounded-xl bg-[#ffc501] flex items-center justify-center shrink-0">
                <Icon size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">{title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Treinos card */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Treinos */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col justify-between card-hover">
            <div>
              <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Abertas para todos</span>
              <h2 className="text-2xl font-black text-white mt-2 mb-4">Vem treinar com a gente!</h2>
              <div className="space-y-3 mb-6">
                {schedule.map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-3">
                    <span className="text-white font-semibold text-sm">{day}</span>
                    <div className="flex items-center gap-2 text-[#0c4dbe] font-black text-sm">
                      <FaClock size={12} />
                      {time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <FaMapMarkerAlt size={13} className="text-[#0c4dbe]" />
                UTFPR — Campus Cornélio Procópio, PR
              </div>
            </div>
            <NavLink
              to="/treinos"
              className="btn-primary mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-bold text-sm uppercase tracking-wide"
            >
              <span>Saiba mais</span>
              <FaArrowRight size={13} />
            </NavLink>
          </div>

          {/* Instagram CTA */}
          <div className="rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-8 flex flex-col justify-between card-hover">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10">
              <FaInstagram size={40} className="text-white mb-4 opacity-90" />
              <h2 className="text-2xl font-black text-white mb-3">Siga o Wolves UTFPR-CP</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Acompanhe jogos, treinos, bastidores e muito mais pelo Instagram do time.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block mb-6">
                <span className="text-white font-black text-lg">@wolvesutfcp</span>
              </div>
            </div>
            <a
              href="https://instagram.com/wolvesutfcp"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 mt-6 bg-white text-gray-900 font-black px-6 py-3.5 rounded-full text-sm uppercase tracking-wide hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FaInstagram size={16} />
              Seguir no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-10 px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Quem somos</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-6 leading-tight">
              O time de futebol americano<br />da UTFPR-CP
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              Os Wolves UTFPR-CP são o time de futebol americano e flag football
              da UTFPR — Campus Cornélio Procópio. Nascemos da paixão pelo esporte e pelo desejo de levar o jogo
              ao mais alto nível competitivo do Paraná.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Nossos treinos são abertos a qualquer interessado. Não precisa ter experiência —
              só precisar de vontade e garra. Vem ser um Wolves!
            </p>
            <NavLink
              to="/time"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm uppercase tracking-wide"
            >
              <span>Conheça o Elenco</span>
              <FaArrowRight size={13} />
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value, dark }) => (
              <div key={label} className={`${dark ? 'bg-[#ffc501]' : 'bg-[#111]'} border border-white/10 rounded-2xl p-8 text-center card-hover`}>
                <div className={`text-5xl font-black mb-2 ${dark ? 'text-black' : 'text-white'}`}>{value}</div>
                <div className={`text-sm uppercase tracking-wider font-medium ${dark ? 'text-black/60' : 'text-gray-400'}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <NewsCards />

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c4dbe] to-[#083a9e] p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Vem ser um Wolves!</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Treinos abertos, sem necessidade de experiência. Apareça na UTFPR CP e venha jogar futebol americano!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <NavLink to="/treinos" className="bg-white text-[#0c4dbe] font-black px-8 py-4 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm">
                  Ver Horários de Treino
                </NavLink>
                <NavLink to="/loja" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide text-sm">
                  Loja Oficial
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
