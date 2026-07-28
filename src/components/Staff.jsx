import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Staff({ grupoAtivo }) {
  const [equipe, setEquipe] = useState([])

  useEffect(() => {
    supabase.from('staff').select('nome, foto_url').eq('ativo', true).in('genero', [grupoAtivo, 'ambos']).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [grupoAtivo])

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <div>
          <h2>Equipe</h2>
          <span className="topo-sub">{equipe.length} pessoas</span>
        </div>
      </header>

      <section className="secao">
        <div className="staff-grid">
          {equipe.map(p => (
            <div key={p.nome} className="staff-card">
              {p.foto_url
                ? <img src={p.foto_url} alt="" className="staff-card-avatar" />
                : <span className="staff-card-avatar topo-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
              <span className="staff-card-nome">{p.nome}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
