const positions = ['Quarterback', 'Linemen', 'Wide Receiver / TE', 'Running Back', 'Defesa']

const players = [
  { name: 'Matheus Rodrigues', number: 1, pos: 'Quarterback', country: 'BRA' },
  { name: 'Carlos Henrique', number: 50, pos: 'Linemen', country: 'BRA' },
  { name: 'Diego Souza', number: 52, pos: 'Linemen', country: 'BRA' },
  { name: 'Leonardo Castro', number: 55, pos: 'Linemen', country: 'BRA' },
  { name: 'André Lima', number: 58, pos: 'Linemen', country: 'BRA' },
  { name: 'Felipe Torres', number: 80, pos: 'Wide Receiver / TE', country: 'BRA' },
  { name: 'Bruno Alves', number: 84, pos: 'Wide Receiver / TE', country: 'BRA' },
  { name: 'Thiago Moreira', number: 88, pos: 'Wide Receiver / TE', country: 'BRA' },
  { name: 'Rafael Cunha', number: 32, pos: 'Running Back', country: 'BRA' },
  { name: 'Lucas Ferreira', number: 35, pos: 'Running Back', country: 'BRA' },
  { name: 'Rodrigo Melo', number: 90, pos: 'Defesa', country: 'BRA' },
  { name: 'Eduardo Nunes', number: 93, pos: 'Defesa', country: 'BRA' },
  { name: 'Gabriel Pinto', number: 22, pos: 'Defesa', country: 'BRA' },
]

const posColors = {
  'Quarterback': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Linemen': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Wide Receiver / TE': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Running Back': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Defesa': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

function PlayerCard({ player }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 card-hover group text-center">
      <div className="w-20 h-20 rounded-full bg-[#0c4dbe]/20 border-2 border-[#0c4dbe]/30 flex items-center justify-center mx-auto mb-4 group-hover:border-[#0c4dbe] transition-colors">
        <span className="text-3xl font-black text-[#0c4dbe]">{player.number}</span>
      </div>
      <h3 className="text-white font-bold text-base mb-2">{player.name}</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${posColors[player.pos]}`}>
          {player.pos}
        </span>
        <span className="text-xs text-gray-500 font-mono">{player.country}</span>
      </div>
    </div>
  )
}

export default function TimePage() {
  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Futebol Americano · Elenco 2026</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">O Time</h1>
        <p className="text-gray-400 mt-3">Conheça os atletas que vestem o uniforme do Wolves UTFPR-CP.</p>
      </div>

      {/* Formation graphic */}
      <div className="bg-[#0a1a0a] border border-white/10 rounded-3xl p-8 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <h2 className="text-white font-bold text-center mb-2 relative z-10">Formação Ofensiva</h2>
        <p className="text-gray-500 text-xs text-center mb-6 relative z-10 uppercase tracking-widest">Pro Set — 1 RB · 2 WR · 1 TE</p>
        <div className="relative z-10 flex flex-col items-center gap-5 py-4">
          {[
            ['WR', 'LT', 'LG', 'C', 'RG', 'RT', 'TE'],
            ['WR', '', '', 'QB', '', '', ''],
            ['', '', '', 'RB', '', '', ''],
          ].map((row, i) => (
            <div key={i} className="flex gap-2 justify-center">
              {row.map((pos, j) => pos ? (
                <div key={j} className="w-12 h-12 rounded-full bg-[#0c4dbe] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{pos}</span>
                </div>
              ) : (
                <div key={j} className="w-12 h-12" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Players by position */}
      {positions.map(pos => {
        const group = players.filter(p => p.pos === pos)
        if (!group.length) return null
        return (
          <div key={pos} className="mb-12">
            <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
              {pos}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.map(player => <PlayerCard key={player.number} player={player} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
