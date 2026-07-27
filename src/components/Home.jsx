import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home({ usuario, onSair }) {
  const [avisos, setAvisos] = useState([])

  useEffect(() => {
    supabase.from('avisos').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAvisos(data || []))
  }, [])

  return (
    <div className="tela">
      <header className="topo">
        <div>
          <h2>Olá, {usuario.nome}</h2>
          <span className="topo-sub">Impulse Experience</span>
        </div>
        <button className="btn-sair" onClick={onSair}>Sair</button>
      </header>

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
