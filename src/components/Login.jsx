import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'

export default function Login({ onLogin, onCadastrar }) {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(true)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarAjudaPin, setMostrarAjudaPin] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    if (!nome.trim() || !senha) return
    setCarregando(true)
    setErro('')

    const { data, error } = await supabase
      .from('staff')
      .select('id, nome, is_supervisor, foto_url')
      .ilike('nome', nome.trim())
      .eq('pin', senha)
      .eq('ativo', true)
      .maybeSingle()

    setCarregando(false)

    if (error || !data) {
      setErro('Nome ou senha inválidos')
      return
    }
    onLogin(data, lembrar)
  }

  return (
    <div className="tela tela-login">
      <div className="marca-app">Impulse Experience</div>
      <div className="login-card-wrap">
        <div className="login-avatar-topo" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="login-card">
          <h1>Entrar</h1>
          <p className="login-sub">Acesse com seu nome e senha</p>
          <form onSubmit={entrar} noValidate>
            <label htmlFor="login-nome" className="sr-only">Seu nome</label>
            <div className="campo-pin-wrap">
              <span className="campo-icone" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="login-nome"
                type="text"
                autoFocus
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="pin-input campo-nome campo-com-icone"
              />
            </div>
            <PinField
              id="login-senha"
              label="Sua senha"
              placeholder="Senha"
              value={senha}
              onChange={setSenha}
            />

            <div className="login-opcoes">
              <label className="check-lembrar">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={e => setLembrar(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <button
                type="button"
                className="link-esqueci"
                onClick={() => setMostrarAjudaPin(v => !v)}
                aria-expanded={mostrarAjudaPin}
              >
                Esqueci minha senha
              </button>
            </div>

            {erro && <div className="login-erro" role="alert">{erro}</div>}
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {mostrarAjudaPin && (
            <p className="ajuda-pin">Peça pro supervisor do evento consultar ou trocar sua senha.</p>
          )}

          <button className="btn-link" onClick={onCadastrar}>Não tem conta? Cadastre-se</button>
        </div>
      </div>
    </div>
  )
}
