import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home({ usuario, grupoAtivo }) {
  const [equipe, setEquipe] = useState([])

  useEffect(() => {
    supabase.from('staff').select('nome, is_supervisor, foto_url').eq('ativo', true).in('genero', [grupoAtivo, 'ambos']).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [grupoAtivo])

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <div className="topo-usuario">
          {usuario.foto_url
            ? <img src={usuario.foto_url} alt="" className="topo-avatar topo-avatar-pequeno" />
            : <span className="topo-avatar topo-avatar-pequeno topo-avatar-vazio" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>}
          <span className="topo-saudacao">Olá, {usuario.nome}</span>
        </div>
      </header>

      <div className="home-marca">
        Impulse<br />
        <span className="home-marca-gradiente">Experience</span>
      </div>

      <section className="secao">
        <h3>Staff</h3>
        {equipe.length === 0 && <p className="vazio">Ninguém por aqui ainda.</p>}
        <div className="staff-grid">
          {equipe.map(p => (
            <div key={p.nome} className="staff-card">
              {p.foto_url
                ? <img src={p.foto_url} alt="" className="staff-card-avatar" />
                : <span className="staff-card-avatar topo-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
              <span className="staff-card-nome">{p.nome}</span>
              {p.is_supervisor && <span className="staff-card-badge">Líder</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
