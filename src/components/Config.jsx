import { useState } from 'react'
import { TEMAS, CORES, getTema, getAccent, setTema, setAccent } from '../lib/preferencias'
import GrupoSwitcher from './GrupoSwitcher'

const VERSAO_APP = '1.0.0'

export default function Config({ usuario, onSair, grupoAtivo, podeAlternarGrupo, onMudarGrupo, onRecarregar }) {
  const [tema, setTemaState] = useState(() => getTema(grupoAtivo))
  const [accent, setAccentState] = useState(() => getAccent(grupoAtivo))
  const [recarregando, setRecarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function handleRecarregar() {
    setRecarregando(true)
    setMensagem('')
    const ok = await onRecarregar()
    setRecarregando(false)
    setMensagem(ok ? 'Atualizado!' : 'Não deu, tenta de novo')
  }

  function escolherTema(id) {
    setTema(id, grupoAtivo)
    setTemaState(id)
  }

  function escolherAccent(id) {
    setAccent(id, grupoAtivo)
    setAccentState(id)
  }

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Configurações</h2>
      </header>

      <div className="config-bloco">
        <h3>Conta</h3>
        <div className="config-linha">
          <span>Logado como</span>
          <span className="config-valor">{usuario.nome}</span>
        </div>
        <button className="btn-recarregar" onClick={handleRecarregar} disabled={recarregando}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={recarregando ? 'girando' : ''}>
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {recarregando ? 'Atualizando...' : 'Atualizar dados'}
        </button>
        {mensagem && <span className="config-mensagem">{mensagem}</span>}
      </div>

      {podeAlternarGrupo && (
        <div className="config-bloco">
          <h3>Grupo</h3>
          <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />
        </div>
      )}

      <div className="config-bloco">
        <h3>Tema</h3>
        <div className="genero-opcoes">
          {TEMAS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`genero-btn ${tema === t.id ? 'genero-btn-ativo' : ''}`}
              onClick={() => escolherTema(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="config-bloco">
        <h3>Cor de destaque</h3>
        <div className="aparencia-swatches">
          {CORES.map(c => (
            <button
              key={c.id}
              type="button"
              className={`swatch ${accent === c.id ? 'swatch-ativo' : ''}`}
              style={{ background: c.cor }}
              onClick={() => escolherAccent(c.id)}
              aria-label={c.label}
              aria-pressed={accent === c.id}
            />
          ))}
        </div>
      </div>

      <div className="config-bloco">
        <h3>Sobre</h3>
        <div className="config-linha">
          <span>Nome</span>
          <span className="config-valor">Impulse Experience</span>
        </div>
        <div className="config-linha">
          <span>Versão</span>
          <span className="config-valor">{VERSAO_APP}</span>
        </div>
        <div className="config-linha">
          <span>Desenvolvido por</span>
          <span className="config-valor">Guilherme Alvarães</span>
        </div>
      </div>

      <button className="link-sair" onClick={onSair}>Sair da conta</button>
    </div>
  )
}
