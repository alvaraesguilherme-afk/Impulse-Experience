import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import GrupoSwitcher from './GrupoSwitcher'

export default function Home({ usuario, grupoAtivo, podeAlternarGrupo, onMudarGrupo }) {
  const [avisos, setAvisos] = useState([])

  useEffect(() => {
    supabase.from('avisos').select('*').eq('genero', grupoAtivo).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAvisos(data || []))
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

      {podeAlternarGrupo && <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />}

      <section className="secao">
        <h3>Avisos</h3>
        {avisos.length === 0 && <p className="vazio">Nenhum aviso ainda.</p>}
        <ul className="lista-avisos">
          {avisos.map(a => (
            <li key={a.id} className="aviso-item">
              <p>{a.texto}</p>
              <span className="aviso-data">{new Date(a.created_at).toLocaleString('pt-BR')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
