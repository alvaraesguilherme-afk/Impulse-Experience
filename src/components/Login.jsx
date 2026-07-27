import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'

export default function Login({ onLogin, onCadastrar }) {
  const [pin, setPin] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarAjudaPin, setMostrarAjudaPin] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    if (!pin) return
    setCarregando(true)
    setErro('')

    const { data, error } = await supabase
      .from('staff')
      .select('id, nome, is_supervisor')
      .eq('pin', pin)
      .eq('ativo', true)
      .maybeSingle()

    setCarregando(false)

    if (error || !data) {
      setErro('PIN inválido')
      return
    }
    onLogin(data)
  }

  return (
    <div className="tela tela-login">
      <div className="login-card">
        <div className="login-avatar" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1>Impulse Experience</h1>
        <p className="login-sub">Digite seu PIN para entrar</p>
        <form onSubmit={entrar} noValidate>
          <PinField
            id="login-pin"
            label="Seu PIN"
            placeholder="PIN"
            value={pin}
            onChange={setPin}
            autoFocus
          />
          {erro && <div className="login-erro" role="alert">{erro}</div>}
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          className="btn-link"
          onClick={() => setMostrarAjudaPin(v => !v)}
          aria-expanded={mostrarAjudaPin}
        >
          Esqueci meu PIN
        </button>
        {mostrarAjudaPin && (
          <p className="ajuda-pin">Peça pro supervisor do evento consultar ou trocar seu PIN.</p>
        )}

        <button className="btn-link" onClick={onCadastrar}>Não tem conta? Cadastre-se</button>
      </div>
    </div>
  )
}
