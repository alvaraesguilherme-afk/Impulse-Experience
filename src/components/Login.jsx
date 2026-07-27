import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin, onCadastrar }) {
  const [pin, setPin] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

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
        <h1>Impulse Experience</h1>
        <p className="login-sub">Digite seu PIN para entrar</p>
        <form onSubmit={entrar}>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="PIN"
            className="pin-input"
          />
          {erro && <div className="login-erro">{erro}</div>}
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <button className="btn-link" onClick={onCadastrar}>Não tem conta? Cadastre-se</button>
      </div>
    </div>
  )
}
