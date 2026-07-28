import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import GrupoSwitcher from './GrupoSwitcher'

export default function Supervisor({ usuario, grupoAtivo, podeAlternarGrupo, onMudarGrupo }) {
  const [avisos, setAvisos] = useState([])
  const [textoAviso, setTextoAviso] = useState('')

  useEffect(() => {
    carregarAvisos()
  }, [grupoAtivo])

  function carregarAvisos() {
    supabase.from('avisos').select('*').eq('genero', grupoAtivo).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAvisos(data || []))
  }

  async function enviarAviso(e) {
    e.preventDefault()
    if (!textoAviso.trim()) return
    await supabase.from('avisos').insert({ texto: textoAviso.trim(), autor: usuario.nome, genero: grupoAtivo })
    setTextoAviso('')
    carregarAvisos()
  }

  async function apagarAviso(id) {
    await supabase.from('avisos').delete().eq('id', id)
    carregarAvisos()
  }

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Avisos</h2>
      </header>

      {podeAlternarGrupo && <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />}

      <section className="secao">
        <form onSubmit={enviarAviso} className="form-aviso">
          <textarea
            value={textoAviso}
            onChange={e => setTextoAviso(e.target.value)}
            placeholder={`Escreva um aviso para a equipe ${grupoAtivo === 'masculino' ? 'Masculino' : 'Feminino'}...`}
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
    </div>
  )
}
