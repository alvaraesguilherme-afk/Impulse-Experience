import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import GrupoSwitcher from './GrupoSwitcher'

export default function Staff({ grupoAtivo, podeAlternarGrupo, onMudarGrupo }) {
  const [equipe, setEquipe] = useState([])

  useEffect(() => {
    supabase.from('staff').select('nome, is_supervisor').eq('ativo', true).in('genero', [grupoAtivo, 'ambos']).order('nome')
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

      {podeAlternarGrupo && <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />}

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
