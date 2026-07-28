import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { aplicarPreferencias } from './lib/preferencias'
import Splash from './components/Splash'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Home from './components/Home'
import Supervisor from './components/Supervisor'
import Perfil from './components/Perfil'
import Config from './components/Config'
import NavBar from './components/NavBar'

const CHAVE_SESSAO = 'impulse_usuario'
const CHAVE_GRUPO = 'impulse_grupo_ativo'

const NAV_STAFF = [
  { id: 'home', label: 'Home' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'config', label: 'Config' },
]

const NAV_SUPERVISOR = [
  { id: 'home', label: 'Home' },
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

function grupoInicial(usuario) {
  if (!usuario) return 'masculino'
  if (usuario.genero === 'ambos') return localStorage.getItem(CHAVE_GRUPO) || 'masculino'
  return usuario.genero || 'masculino'
}

export default function App() {
  const [usuario, setUsuario] = useState(usuarioSalvo)
  const [grupoAtivo, setGrupoAtivo] = useState(() => grupoInicial(usuarioSalvo()))
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
    const grupo = grupoInicial(dados)
    setGrupoAtivo(grupo)
    aplicarPreferencias(grupo)
    setAba(dados.is_supervisor ? 'avisos' : 'home')
    setUsuario(dados)
  }

  function sair() {
    localStorage.removeItem(CHAVE_SESSAO)
    setTelaAuth('login')
    setUsuario(null)
    aplicarPreferencias(undefined)
  }

  function mudarGrupo(g) {
    setGrupoAtivo(g)
    if (usuario?.genero === 'ambos') localStorage.setItem(CHAVE_GRUPO, g)
    aplicarPreferencias(g)
  }

  function atualizarFoto(fotoUrl) {
    const atualizado = { ...usuario, foto_url: fotoUrl }
    setUsuario(atualizado)
    if (localStorage.getItem(CHAVE_SESSAO)) {
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(atualizado))
    }
  }

  async function recarregarUsuario() {
    const { data } = await supabase
      .from('staff')
      .select('id, nome, is_supervisor, foto_url, genero')
      .eq('id', usuario.id)
      .maybeSingle()

    if (!data) return false

    setUsuario(data)
    const grupo = grupoInicial(data)
    setGrupoAtivo(grupo)
    aplicarPreferencias(grupo)
    if (localStorage.getItem(CHAVE_SESSAO)) {
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(data))
    }
    return true
  }

  if (splash) return <Splash saindo={splashSaindo} />
  if (!usuario) {
    return telaAuth === 'cadastro'
      ? <Cadastro onCadastrado={entrar} onVoltar={() => setTelaAuth('login')} />
      : <Login onLogin={entrar} onCadastrar={() => setTelaAuth('cadastro')} />
  }

  const nav = usuario.is_supervisor ? NAV_SUPERVISOR : NAV_STAFF
  const podeAlternarGrupo = usuario.genero === 'ambos'

  function conteudo() {
    if (aba === 'perfil') return <Perfil usuario={usuario} editavel onFotoAtualizada={atualizarFoto} />
    if (aba === 'config') {
      return (
        <Config
          usuario={usuario}
          onSair={sair}
          grupoAtivo={grupoAtivo}
          podeAlternarGrupo={podeAlternarGrupo}
          onMudarGrupo={mudarGrupo}
          onRecarregar={recarregarUsuario}
        />
      )
    }
    if (aba === 'home') return <Home usuario={usuario} grupoAtivo={grupoAtivo} />
    if (usuario.is_supervisor) return <Supervisor usuario={usuario} grupoAtivo={grupoAtivo} />
    return <Home usuario={usuario} grupoAtivo={grupoAtivo} />
  }

  return (
    <div className="app-shell">
      {conteudo()}
      <NavBar itens={nav} ativa={aba} onMudar={setAba} />
    </div>
  )
}
