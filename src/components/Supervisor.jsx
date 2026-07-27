import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const hoje = () => new Date().toISOString().slice(0, 10)

export default function Supervisor({ usuario, onSair }) {
  const [aba, setAba] = useState('avisos')
  const [avisos, setAvisos] = useState([])
  const [textoAviso, setTextoAviso] = useState('')
  const [equipe, setEquipe] = useState([])
  const [chamada, setChamada] = useState({})

  useEffect(() => {
    carregarAvisos()
    supabase.from('staff').select('id, nome').eq('ativo', true).order('nome')
      .then(({ data }) => setEquipe(data || []))
  }, [])

  useEffect(() => {
    if (aba !== 'chamada' && aba !== 'faltas') return
    supabase.from('chamada').select('staff_nome, status, obs').eq('data', hoje())
      .then(({ data }) => {
        const mapa = {}
        for (const c of data || []) mapa[c.staff_nome] = c.status
        setChamada(mapa)
      })
  }, [aba])

  function carregarAvisos() {
    supabase.from('avisos').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAvisos(data || []))
  }

  async function enviarAviso(e) {
    e.preventDefault()
    if (!textoAviso.trim()) return
    await supabase.from('avisos').insert({ texto: textoAviso.trim(), autor: usuario.nome })
    setTextoAviso('')
    carregarAvisos()
  }

  async function apagarAviso(id) {
    await supabase.from('avisos').delete().eq('id', id)
    carregarAvisos()
  }

  async function marcar(nome, status) {
    setChamada(prev => ({ ...prev, [nome]: status }))
    await supabase.from('chamada').upsert(
      { staff_nome: nome, data: hoje(), status },
      { onConflict: 'staff_nome,data' },
    )
  }

  const ausentes = equipe.filter(p => chamada[p.nome] === 'ausente')

  return (
    <div className="tela">
      <header className="topo">
        <div>
          <h2>Painel do Supervisor</h2>
          <span className="topo-sub">{usuario.nome}</span>
        </div>
        <button className="btn-sair" onClick={onSair}>Sair</button>
      </header>

      <nav className="tabs">
        <button className={aba === 'avisos' ? 'tab-ativa' : ''} onClick={() => setAba('avisos')}>Avisos</button>
        <button className={aba === 'chamada' ? 'tab-ativa' : ''} onClick={() => setAba('chamada')}>Chamada</button>
        <button className={aba === 'faltas' ? 'tab-ativa' : ''} onClick={() => setAba('faltas')}>Faltas</button>
      </nav>

      {aba === 'avisos' && (
        <section className="secao">
          <form onSubmit={enviarAviso} className="form-aviso">
            <textarea
              value={textoAviso}
              onChange={e => setTextoAviso(e.target.value)}
              placeholder="Escreva um aviso para a equipe..."
              rows={3}
            />
            <button type="submit" className="btn-primary">Enviar aviso</button>
          </form>
          <ul className="lista-avisos">
            {avisos.map(a => (
              <li key={a.id} className="aviso-item">
                <p>{a.texto}</p>
                <div className="aviso-rodape">
                  <span className="aviso-data">{a.autor} · {new Date(a.created_at).toLocaleString('pt-BR')}</span>
                  <button className="btn-apagar" onClick={() => apagarAviso(a.id)}>Apagar</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {aba === 'chamada' && (
        <section className="secao">
          <p className="secao-sub">Chamada de hoje ({hoje()})</p>
          <ul className="lista-chamada">
            {equipe.map(p => (
              <li key={p.id} className="chamada-item">
                <span>{p.nome}</span>
                <div className="chamada-botoes">
                  <button
                    className={chamada[p.nome] === 'presente' ? 'btn-presente ativo' : 'btn-presente'}
                    onClick={() => marcar(p.nome, 'presente')}
                  >Presente</button>
                  <button
                    className={chamada[p.nome] === 'ausente' ? 'btn-ausente ativo' : 'btn-ausente'}
                    onClick={() => marcar(p.nome, 'ausente')}
                  >Ausente</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {aba === 'faltas' && (
        <section className="secao">
          <p className="secao-sub">Ausentes hoje ({hoje()})</p>
          {ausentes.length === 0 && <p className="vazio">Ninguém marcado como ausente.</p>}
          <div className="chips">
            {ausentes.map(p => <span key={p.id} className="chip chip-ausente">{p.nome}</span>)}
          </div>
        </section>
      )}
    </div>
  )
}
