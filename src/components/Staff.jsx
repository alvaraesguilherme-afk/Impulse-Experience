import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Perfil from './Perfil'

export default function Staff({ grupoAtivo }) {
  const [equipe, setEquipe] = useState([])
  const [aberto, setAberto] = useState(false)
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    supabase.from('staff').select('nome, foto_url, is_supervisor, genero').eq('ativo', true).in('genero', [grupoAtivo, 'ambos']).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [grupoAtivo])

  if (selecionado) {
    return <Perfil usuario={selecionado} onVoltar={() => setSelecionado(null)} />
  }

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Equipe</h2>
      </header>

      <section className="secao">
        <div className={`equipe-card ${aberto ? 'equipe-card-aberto' : ''}`}>
          <button className="equipe-card-cabeca" onClick={() => setAberto(v => !v)} aria-expanded={aberto}>
            <span className="equipe-card-titulo">Equipe</span>
            <span className="equipe-card-count">{equipe.length}</span>
            <svg className="equipe-card-seta" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {aberto && (
            <ul className="equipe-lista">
              {equipe.map(p => (
                <li key={p.nome}>
                  <button className="equipe-lista-item" onClick={() => setSelecionado(p)}>
                    {p.foto_url
                      ? <img src={p.foto_url} alt="" className="equipe-lista-avatar" />
                      : <span className="equipe-lista-avatar topo-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
                    <span className="equipe-lista-nome">{p.nome}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
