import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
        <h1>Criar conta</h1>
        <p className="login-sub">Escolha um PIN para acessar depois</p>
        <form onSubmit={cadastrar}>
          <input
            type="text"
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            className="pin-input campo-nome"
          />
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Criar PIN"
            className="pin-input"
          />
          <input
            type="password"
            inputMode="numeric"
            value={confirmarPin}
            onChange={e => setConfirmarPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Confirmar PIN"
            className="pin-input"
          />
          {erro && <div className="login-erro">{erro}</div>}
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <button className="btn-link" onClick={onVoltar}>Já tenho conta, entrar</button>
      </div>
    </div>
  )
}
