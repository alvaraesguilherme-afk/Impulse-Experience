import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'

export default function Cadastro({ onCadastrado, onVoltar }) {
  const [nome, setNome] = useState('')
  const [pin, setPin] = useState('')
  const [confirmarPin, setConfirmarPin] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')

    if (nome.trim().length < 2) {
      setErro('Digite seu nome completo')
      return
    }
    if (pin.length < 4) {
      setErro('O PIN precisa ter pelo menos 4 números')
      return
    }
    if (pin !== confirmarPin) {
      setErro('Os PINs não são iguais')
      return
    }

    setCarregando(true)
    const { data, error } = await supabase
      .from('staff')
      .insert({ nome: nome.trim(), pin, is_supervisor: false, ativo: true })
      .select('id, nome, is_supervisor')
      .single()
    setCarregando(false)

    if (error) {
      setErro(error.code === '23505' ? 'Esse PIN já está em uso, escolha outro' : 'Não deu pra cadastrar, tenta de novo')
      return
    }
    onCadastrado(data)
  }

  return (
    <div className="tela tela-login">
      <div className="login-card">
        <div className="login-avatar" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <h1>Criar conta</h1>
        <p className="login-sub">Escolha um PIN para acessar depois</p>
        <form onSubmit={cadastrar} noValidate>
          <div className="campo-pin-wrap">
            <label htmlFor="cadastro-nome" className="sr-only">Seu nome</label>
            <span className="campo-icone" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="cadastro-nome"
              type="text"
              autoFocus
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="pin-input campo-nome campo-com-icone"
            />
          </div>
          <PinField
            id="cadastro-pin"
            label="Criar PIN"
            placeholder="Criar PIN"
            value={pin}
            onChange={setPin}
          />
          <PinField
            id="cadastro-confirmar-pin"
            label="Confirmar PIN"
            placeholder="Confirmar PIN"
            value={confirmarPin}
            onChange={setConfirmarPin}
          />
          {erro && <div className="login-erro" role="alert">{erro}</div>}
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <button className="btn-link" onClick={onVoltar}>Já tenho conta, entrar</button>
      </div>
    </div>
  )
}
