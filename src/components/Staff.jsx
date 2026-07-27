import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Staff({ onSair }) {
  const [equipe, setEquipe] = useState([])

  useEffect(() => {
    supabase.from('staff').select('nome, is_supervisor').eq('ativo', true).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [])

  return (
    <div className="tela">
      <header className="topo">
        <div>
          <h2>Equipe</h2>
          <span className="topo-sub">{equipe.length} pessoas</span>
        </div>
        <button className="btn-sair" onClick={onSair}>Sair</button>
      </header>

      <section className="secao">
        <div className="chips">
          {equipe.map(p => (
            <span key={p.nome} className={`chip ${p.is_supervisor ? 'chip-lider' : ''}`}>{p.nome}</span>
          ))}
        </div>
      </section>
    </div>
  )
}
