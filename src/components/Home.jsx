import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Perfil from './Perfil'

const MODULOS = [
  {
    id: 'apoio',
    nome: 'Apoio',
    desc: 'Recepção, chamada e tarefas',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'intercessao',
    nome: 'Intercessão',
    desc: 'Escala de oração do culto',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-4-3-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 8-8 11z" />
      </svg>
    ),
    iconeMasculino: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" /><path d="M6 8h12" />
      </svg>
    ),
  },
  {
    id: 'midia',
    nome: 'Mídia',
    desc: 'Fotos, vídeo e transmissão',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 'templo',
    nome: 'Templo',
    desc: 'Montagem e organização',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V10l7-6 7 6v11" /><path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
]

export default function Home({ usuario, grupoAtivo, online = new Set() }) {
  const [equipe, setEquipe] = useState([])
  const [avisos, setAvisos] = useState([])
  const [aberto, setAberto] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [modulo, setModulo] = useState(null)

  useEffect(() => {
    supabase.from('staff').select('id, nome, foto_url, is_supervisor, genero').eq('ativo', true).in('genero', [grupoAtivo, 'ambos']).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [grupoAtivo])

  useEffect(() => {
    supabase.from('avisos').select('*').eq('genero', grupoAtivo).order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setAvisos(data || []))
  }, [grupoAtivo])

  const equipeOnline = equipe.filter(p => online.has(p.id))
  const equipeOffline = equipe.filter(p => !online.has(p.id))

  if (selecionado) {
    return <Perfil usuario={selecionado} online={online.has(selecionado.id)} onVoltar={() => setSelecionado(null)} />
  }

  if (modulo) {
    return (
      <div className="tela">
        <header className="topo topo-minimal">
          <div className="topo-com-voltar">
            <button className="btn-voltar" onClick={() => setModulo(null)} aria-label="Voltar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2>{modulo.nome}</h2>
          </div>
        </header>
        <p className="secao-sub">{modulo.desc}</p>
        <p className="vazio">Essa área ainda está em construção.</p>
      </div>
    )
  }

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

      {avisos.length > 0 && (
        <section className="secao">
          <h3>Avisos</h3>
          <ul className="lista-avisos">
            {avisos.map(a => (
              <li key={a.id} className="aviso-item">
                <p>{a.texto}</p>
                <span className="aviso-data">{a.autor} · {new Date(a.created_at).toLocaleString('pt-BR')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="secao">
        <h3>Módulos</h3>
        <div className={`modulos-grid modulos-${grupoAtivo}`}>
          {MODULOS.map(m => (
            <button key={m.id} className="modulo-card" onClick={() => setModulo(m)}>
              <span className="modulo-icone" aria-hidden="true">
                {m.iconeMasculino && grupoAtivo === 'masculino' ? m.iconeMasculino : m.icone}
              </span>
              <span className="modulo-texto">
                <span className="modulo-titulo">{m.nome}</span>
                <span className="modulo-desc">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

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
            <>
              {equipeOnline.length > 0 && (
                <>
                  <div className="equipe-secao-titulo">Online — {equipeOnline.length}</div>
                  <ul className="equipe-lista">
                    {equipeOnline.map(p => (
                      <li key={p.id}>
                        <button className="equipe-lista-item" onClick={() => setSelecionado(p)}>
                          <span className="equipe-lista-avatar-wrap">
                            {p.foto_url
                              ? <img src={p.foto_url} alt="" className="equipe-lista-avatar" />
                              : <span className="equipe-lista-avatar topo-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
                            <span className="bolinha-status bolinha-status-online" aria-label="Online agora" />
                          </span>
                          <span className="equipe-lista-nome">{p.nome}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {equipeOffline.length > 0 && (
                <>
                  <div className="equipe-secao-titulo">Offline — {equipeOffline.length}</div>
                  <ul className="equipe-lista">
                    {equipeOffline.map(p => (
                      <li key={p.id}>
                        <button className="equipe-lista-item" onClick={() => setSelecionado(p)}>
                          <span className="equipe-lista-avatar-wrap">
                            {p.foto_url
                              ? <img src={p.foto_url} alt="" className="equipe-lista-avatar" />
                              : <span className="equipe-lista-avatar topo-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
                            <span className="bolinha-status bolinha-status-offline" aria-label="Offline" />
                          </span>
                          <span className="equipe-lista-nome equipe-lista-nome-offline">{p.nome}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
