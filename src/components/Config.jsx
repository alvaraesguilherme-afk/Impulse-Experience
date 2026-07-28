import { useState } from 'react'
import { TEMAS, CORES, getTema, getAccent, setTema, setAccent } from '../lib/preferencias'
import GrupoSwitcher from './GrupoSwitcher'

const VERSAO_APP = '1.0.0'

export default function Config({ usuario, onSair, grupoAtivo, podeAlternarGrupo, onMudarGrupo }) {
  const [tema, setTemaState] = useState(getTema)
  const [accent, setAccentState] = useState(getAccent)

  function escolherTema(id) {
    setTema(id)
    setTemaState(id)
  }

  function escolherAccent(id) {
    setAccent(id)
    setAccentState(id)
  }

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Configurações</h2>
      </header>

      <section className="secao">
        <h3>Conta</h3>
        <div className="config-linha">
          <span>Logado como</span>
          <span className="config-valor">{usuario.nome}</span>
        </div>
      </section>

      {podeAlternarGrupo && (
        <section className="secao">
          <h3>Grupo</h3>
          <p className="secao-sub">Você tem acesso aos dois — escolha qual área ver agora.</p>
          <GrupoSwitcher grupo={grupoAtivo} onMudar={onMudarGrupo} />
        </section>
      )}

      <section className="secao">
        <h3>Aparência</h3>
        <p className="secao-sub">Tema</p>
        <div className="genero-opcoes aparencia-temas">
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

        <p className="secao-sub">Cor de destaque</p>
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
      </section>

      <section className="secao">
        <h3>Sobre o aplicativo</h3>
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
      </section>

      <button className="link-sair" onClick={onSair}>Sair da conta</button>
    </div>
  )
}
