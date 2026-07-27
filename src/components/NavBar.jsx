function NavIcon({ id, active }) {
  const color = active ? 'var(--accent-light)' : 'var(--text-faint)'
  const s = { width: 22, height: 22 }
  const icons = {
    home: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    staff: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    avisos: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a2 2 0 1 1-3.2 2.4" /></svg>,
    chamada: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M9 12l2 2 4-4" /></svg>,
    faltas: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  }
  return icons[id] || null
}

export default function NavBar({ itens, ativa, onMudar }) {
  return (
    <div className="nav-mobile">
      {itens.map(item => {
        const active = ativa === item.id
        return (
          <div
            key={item.id}
            onClick={() => onMudar(item.id)}
            className={`nav-item ${active ? 'nav-item-active' : ''}`}
          >
            <div className="nav-icon"><NavIcon id={item.id} active={active} /></div>
            <span>{item.label}</span>
            <div className="nav-indicator" style={{ width: active ? 20 : 0, opacity: active ? 1 : 0 }} />
          </div>
        )
      })}
    </div>
  )
}
