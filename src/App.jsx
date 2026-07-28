import { useEffect, useState } from 'react'
import Splash from './components/Splash'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Home from './components/Home'
import Staff from './components/Staff'
import Supervisor from './components/Supervisor'
import Perfil from './components/Perfil'
import Config from './components/Config'
import NavBar from './components/NavBar'

const CHAVE_SESSAO = 'impulse_usuario'

const NAV_STAFF = [
  { id: 'home', label: 'Início' },
  { id: 'staff', label: 'Equipe' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'config', label: 'Config' },
]

const NAV_SUPERVISOR = [
  { id: 'avisos', label: 'Avisos' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'config', label: 'Config' },
]

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
  const [aba, setAba] = useState('home')
  const [telaAuth, setTelaAuth] = useState('login')
  const [splash, setSplash] = useState(true)
  const [splashSaindo, setSplashSaindo] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSplashSaindo(true), 2400)
    const t2 = setTimeout(() => setSplash(false), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function entrar(dados, lembrar = true) {
    if (lembrar) {
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados))
    }
    setAba(dados.is_supervisor ? 'avisos' : 'home')
    setUsuario(dados)
  }

  function sair() {
    localStorage.removeItem(CHAVE_SESSAO)
    setTelaAuth('login')
    setUsuario(null)
  }

  if (splash) return <Splash saindo={splashSaindo} />
  if (!usuario) {
    return telaAuth === 'cadastro'
      ? <Cadastro onCadastrado={entrar} onVoltar={() => setTelaAuth('login')} />
      : <Login onLogin={entrar} onCadastrar={() => setTelaAuth('cadastro')} />
  }

  const nav = usuario.is_supervisor ? NAV_SUPERVISOR : NAV_STAFF

  function conteudo() {
    if (aba === 'perfil') return <Perfil usuario={usuario} />
    if (aba === 'config') return <Config usuario={usuario} onSair={sair} />
    if (usuario.is_supervisor) return <Supervisor usuario={usuario} />
    if (aba === 'staff') return <Staff />
    return <Home usuario={usuario} />
  }

  return (
    <div className="app-shell">
      {conteudo()}
      <NavBar itens={nav} ativa={aba} onMudar={setAba} />
    </div>
  )
}
