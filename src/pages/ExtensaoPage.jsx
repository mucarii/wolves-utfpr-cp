import { FaFootballBall, FaSchool, FaUsers, FaHandshake, FaMapMarkerAlt, FaUniversity, FaHeart } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const projects = [
  {
    icon: FaFootballBall,
    name: 'Futebol Americano para Todos',
    tag: 'Esporte & Comunidade',
    tagColor: 'bg-[#0c4dbe]',
    desc: 'Treinos abertos à comunidade de Cornélio Procópio — não é necessário ser aluno da UTFPR. O projeto apresenta o futebol americano a qualquer pessoa interessada, sem custo e sem exigência de experiência prévia.',
    highlight: 'Treinos: Ter, Qui 17h30 · Sáb 09h',
  },
  {
    icon: FaSchool,
    name: 'Wolves nas Escolas',
    tag: 'Educação',
    tagColor: 'bg-emerald-600',
    desc: 'Visitas a escolas públicas da cidade para apresentar o futebol americano, promover valores como trabalho em equipe, disciplina e fair play entre jovens estudantes do ensino fundamental e médio.',
    highlight: 'Público: ensino fundamental e médio',
  },
  {
    icon: FaHandshake,
    name: 'Flag Inclusivo',
    tag: 'Inclusão',
    tagColor: 'bg-orange-500',
    desc: 'Projeto de flag football voltado para ampliar a participação de grupos que ainda têm pouca representação no esporte — incluindo mulheres e pessoas que preferem a modalidade sem contato físico.',
    highlight: 'Modalidade: Flag Football',
  },
  {
    icon: FaHeart,
    name: 'Wolves na APAE',
    tag: 'Inclusão Social',
    tagColor: 'bg-pink-600',
    desc: 'Visitas e atividades de flag football com alunos da APAE de Cornélio Procópio. O projeto leva o esporte como ferramenta de integração, alegria e desenvolvimento para pessoas com deficiência intelectual.',
    highlight: 'Parceria: APAE Cornélio Procópio',
  },
]

export default function ExtensaoPage() {
  return (
    <div className="page-enter pb-20">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#00102e] via-[#0a0a0a] to-black pt-14 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <span className="text-[#ffc501] text-xs font-bold uppercase tracking-widest">Projeto de Extensão Universitária</span>
              <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
                Wolves UTFPR-CP<br />
                <span className="text-[#ffc501]">& Comunidade</span>
              </h1>
              <p className="text-gray-400 mt-5 text-lg leading-relaxed max-w-xl">
                O Wolves é um projeto de extensão da UTFPR — Campus Cornélio Procópio.
                Além das competições, o time leva o futebol americano para além dos muros da universidade,
                com ações voltadas para a comunidade local.
              </p>
            </div>

            {/* UTFPR logo box */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-3 shrink-0 shadow-2xl">
              <img
                src="/utfpr-logo.png"
                alt="UTFPR — Universidade Tecnológica Federal do Paraná"
                className="w-56 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="text-center mt-1">
                <div className="text-black font-black text-xs uppercase tracking-widest">Campus Cornélio Procópio</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-widest">Paraná — Brasil</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* O que é extensão */}
      <section className="py-16 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Entenda o projeto</span>
            <h2 className="text-3xl font-black text-white mt-2 mb-5 leading-tight">
              O que é um Projeto de Extensão Universitária?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Projetos de extensão são uma das três funções da universidade — ao lado do ensino e da pesquisa.
              Eles conectam a universidade com a sociedade, levando conhecimento, cultura e oportunidades
              para além do ambiente acadêmico.
            </p>
            <p className="text-gray-400 leading-relaxed">
              No caso do Wolves, o esporte é o elo entre a UTFPR-CP e a comunidade de Cornélio Procópio.
              O projeto promove saúde, integração social e o desenvolvimento de habilidades como liderança,
              trabalho em equipe e resiliência.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaUniversity, label: 'Ensino', desc: 'Formação de atletas e líderes dentro da universidade' },
              { icon: FaUsers, label: 'Comunidade', desc: 'Ações abertas para moradores de Cornélio Procópio' },
              { icon: FaFootballBall, label: 'Esporte', desc: 'Futebol americano como ferramenta de transformação' },
              { icon: FaHandshake, label: 'Inclusão', desc: 'Abertura para todas as idades, gêneros e perfis' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-[#111] border border-white/10 rounded-2xl p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-[#0c4dbe]/20 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#0c4dbe]" />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{label}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Ações em andamento</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Projetos para a Comunidade</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Iniciativas que levam o futebol americano e seus valores para além da universidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map(({ icon: Icon, name, tag, tagColor, desc, highlight }) => (
              <div key={name} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group flex flex-col">
                <div className="h-2 bg-[#0c4dbe]" />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0c4dbe]/15 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-[#0c4dbe]" />
                    </div>
                    <span className={`${tagColor} text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0`}>
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-lg mb-3 group-hover:text-[#6b90d4] transition-colors leading-snug">
                    {name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                  <div className="bg-black/30 rounded-xl px-4 py-2.5">
                    <span className="text-[#0c4dbe] text-xs font-semibold">{highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wolves nas Escolas — Vídeos */}
      <section className="py-16 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Projeto em ação</span>
            <h2 className="text-3xl font-black text-white mt-2">Wolves nas Escolas</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Ensinando flag football para crianças nas escolas públicas de Cornélio Procópio.
            </p>
          </div>
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/projeto-escola/wolves_projetoescola1.jpg"
              alt="Wolves nas Escolas — ensinando flag football para crianças"
              className="w-full max-h-[420px] object-cover object-center"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {['/projeto-escola/wolves_escola.mp4', '/projeto-escola/wolves_escola2.mp4', '/projeto-escola/wolves_escola3.mp4'].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                <video
                  src={src}
                  controls
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                  preload="metadata"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wolves na APAE — Fotos */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-pink-500 text-xs font-bold uppercase tracking-widest">Projeto em ação</span>
            <h2 className="text-3xl font-black text-white mt-2">Wolves na APAE</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Flag football como ferramenta de inclusão e alegria para alunos da APAE de Cornélio Procópio.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden border border-white/10 aspect-square">
                <img
                  src={`/projeto-apae/wolves_apae${n}.jpg`}
                  alt={`Wolves na APAE — foto ${n}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 flex items-center justify-center shrink-0">
              <FaMapMarkerAlt size={32} className="text-[#0c4dbe]" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Onde nos encontrar</div>
              <h3 className="text-white font-black text-2xl mb-1">UTFPR — Campus Cornélio Procópio</h3>
              <p className="text-gray-400 text-sm">Universidade Tecnológica Federal do Paraná · Cornélio Procópio, PR, Brasil</p>
            </div>
            <NavLink
              to="/treinos"
              className="btn-primary shrink-0 px-7 py-3.5 rounded-full text-white font-bold text-sm uppercase tracking-wide"
            >
              Ver horários
            </NavLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c4dbe] to-[#083a9e] p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Quer participar ou saber mais?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Fale com a gente pelo Instagram ou pelo formulário de contato.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://instagram.com/wolvesutfcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#0c4dbe] font-black px-8 py-4 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm"
                >
                  @wolvesutfcp
                </a>
                <NavLink
                  to="/contato"
                  className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide text-sm"
                >
                  Fale Conosco
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
