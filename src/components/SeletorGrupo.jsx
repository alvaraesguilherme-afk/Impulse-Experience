import { useState } from 'react'

export default function SeletorGrupo({ onEscolher }) {
  const [selecionado, setSelecionado] = useState(null)

  return (
    <div className="tela tela-login">
      <div className="marca-app">Impulse Experience</div>
      <div className="login-card-wrap">
        <div className="login-card selecao-grupo-card">
          <h1>Qual é o seu Impulse?</h1>
          <p className="login-sub">Escolha pra continuar</p>
          <div className="selecao-grupo-opcoes">
            <button
              type="button"
              className={`selecao-grupo-btn selecao-grupo-btn-feminino ${selecionado === 'feminino' ? 'selecao-grupo-btn-selecionado' : ''}`}
              onClick={() => setSelecionado('feminino')}
              aria-pressed={selecionado === 'feminino'}
            >
              Impulse Feminino
            </button>
            <button
              type="button"
              className={`selecao-grupo-btn selecao-grupo-btn-masculino ${selecionado === 'masculino' ? 'selecao-grupo-btn-selecionado' : ''}`}
              onClick={() => setSelecionado('masculino')}
              aria-pressed={selecionado === 'masculino'}
            >
              Impulse Masculino
            </button>
          </div>
          <button
            type="button"
            className="btn-primary selecao-grupo-continuar"
            disabled={!selecionado}
            onClick={() => selecionado && onEscolher(selecionado)}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
