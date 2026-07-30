function NavIcon({ id, active }) {
  const color = active ? 'var(--accent-light)' : 'var(--text-faint)'
  const s = { width: 22, height: 22 }
  const icons = {
    home: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    staff: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    avisos: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a2 2 0 1 1-3.2 2.4" /></svg>,
    perfil: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M6 16c.5-2 2-3 3-3s2.5 1 3 3" /><line x1="14" y1="8" x2="18" y2="8" /><line x1="14" y1="12" x2="18" y2="12" /></svg>,
    config: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  }
  return icons[id] || null
}

export default function NavBar({ itens, ativa, onMudar, usuario }) {
  return (
    <div className="nav-mobile">
      <div className="nav-grommet" aria-hidden="true" />
      <div className="nav-credencial">
        {usuario?.foto_url
          ? <img src={usuario.foto_url} alt="" className="nav-credencial-foto" />
          : <span className="nav-credencial-foto topo-avatar-vazio" aria-hidden="true">{usuario?.nome?.charAt(0).toUpperCase()}</span>}
        <span className="nav-credencial-nome">{usuario?.nome}</span>
        <span className="nav-credencial-cargo">{usuario?.is_supervisor ? 'Supervisor' : 'Staff'}</span>
      </div>
      <div className="nav-perfuracao" aria-hidden="true" />
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
