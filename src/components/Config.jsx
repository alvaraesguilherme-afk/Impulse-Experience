import { useState } from 'react'
import GrupoSwitcher from './GrupoSwitcher'

const VERSAO_APP = '1.0.0'

export default function Config({ usuario, onSair, grupoAtivo, podeAlternarGrupo, onMudarGrupo, onRecarregar, versaoPc, onAlternarVersaoPc }) {
  const [recarregando, setRecarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function handleRecarregar() {
    setRecarregando(true)
    setMensagem('')
    const ok = await onRecarregar()
    setRecarregando(false)
    setMensagem(ok ? 'Atualizado!' : 'Não deu, tenta de novo')
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

      <div className="config-bloco">
        <h3>Exibição</h3>
        <div className="config-linha">
          <span>Versão atual</span>
          <span className="config-valor">{versaoPc ? 'PC' : 'Celular'}</span>
        </div>
        <button className="btn-recarregar" onClick={onAlternarVersaoPc}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          {versaoPc ? 'Mudar para versão de celular' : 'Mudar para versão de PC'}
        </button>
      </div>

      {podeAlternarGrupo && (
        <div className="config-bloco">
          <h3>Grupo</h3>
          <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />
        </div>
      )}

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
