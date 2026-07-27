import { useState } from 'react'
import Login from './components/Login'
import Staff from './components/Staff'
import Supervisor from './components/Supervisor'

const CHAVE_SESSAO = 'impulse_usuario'

function usuarioSalvo() {
  try {
    const bruto = localStorage.getItem(CHAVE_SESSAO)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export default function App() {
  const [usuario, setUsuario] = useState(usuarioSalvo)

  function entrar(dados) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados))
    setUsuario(dados)
  }

  function sair() {
    localStorage.removeItem(CHAVE_SESSAO)
    setUsuario(null)
  }

  if (!usuario) return <Login onLogin={entrar} />
  if (usuario.is_supervisor) return <Supervisor usuario={usuario} onSair={sair} />
  return <Staff usuario={usuario} onSair={sair} />
}
