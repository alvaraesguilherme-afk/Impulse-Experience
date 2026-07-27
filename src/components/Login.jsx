import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'
import { getPerfis } from '../lib/perfisLembrados'

const IconPessoa = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function Login({ onLogin, onCadastrar }) {
  const [perfis] = useState(getPerfis)
  const [view, setView] = useState(() => (getPerfis().length > 0 ? 'lista' : 'form'))
  const [perfilAtivo, setPerfilAtivo] = useState(null)

  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarAjudaPin, setMostrarAjudaPin] = useState(false)

  function selecionarPerfil(p) {
    setPerfilAtivo(p)
    setSenha('')
    setErro('')
    setView('senha')
  }

  async function entrarComPerfil(e) {
    e.preventDefault()
    if (!senha) return
    setCarregando(true)
    setErro('')

    const { data, error } = await supabase
      .from('staff')
      .select('id, nome, is_supervisor, foto_url')
      .eq('id', perfilAtivo.id)
      .eq('pin', senha)
      .eq('ativo', true)
      .maybeSingle()

    setCarregando(false)

    if (error || !data) {
      setErro('Senha inválida')
      return
    }
    onLogin(data)
  }

  async function entrarManual(e) {
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
    onLogin(data)
  }

  const avatarFoto = view === 'senha' ? perfilAtivo?.foto_url : null

  return (
    <div className="tela tela-login">
      <div className="marca-app">Impulse Experience</div>
      <div className="login-card-wrap">
        <div className="login-avatar-topo" aria-hidden="true">
          {avatarFoto ? <img src={avatarFoto} alt="" className="login-avatar-img" /> : IconPessoa}
        </div>
        <div className="login-card">
          {view === 'lista' && (
            <>
              <h1>Entrar</h1>
              <p className="login-sub">Escolha seu nome</p>
              <ul className="lista-perfis">
                {perfis.map(p => (
                  <li key={p.id}>
                    <button type="button" className="perfil-item" onClick={() => selecionarPerfil(p)}>
                      {p.foto_url
                        ? <img src={p.foto_url} alt="" className="perfil-avatar" />
                        : <span className="perfil-avatar perfil-avatar-vazio" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>}
                      <span className="perfil-nome">{p.nome}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn-link" onClick={() => setView('form')}>+ Usar outro nome</button>
            </>
          )}

          {view === 'senha' && perfilAtivo && (
            <>
              <h1>Olá, {perfilAtivo.nome}</h1>
              <p className="login-sub">Digite sua senha para entrar</p>
              <form onSubmit={entrarComPerfil} noValidate>
                <PinField
                  id="login-senha"
                  label="Sua senha"
                  placeholder="Senha"
                  value={senha}
                  onChange={setSenha}
                  autoFocus
                />
                <div className="login-opcoes login-opcoes-centro">
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
              <button
                type="button"
                className="btn-link"
                onClick={() => setView(perfis.length > 0 ? 'lista' : 'form')}
              >
                Trocar de usuário
              </button>
            </>
          )}

          {view === 'form' && (
            <>
              <h1>Entrar</h1>
              <p className="login-sub">Acesse com seu nome e senha</p>
              <form onSubmit={entrarManual} noValidate>
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
                  id="login-senha-manual"
                  label="Sua senha"
                  placeholder="Senha"
                  value={senha}
                  onChange={setSenha}
                />
                <div className="login-opcoes login-opcoes-centro">
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
              {perfis.length > 0 && (
                <button type="button" className="btn-link" onClick={() => setView('lista')}>
                  Ver nomes salvos neste aparelho
                </button>
              )}
              <button className="btn-link" onClick={onCadastrar}>Não tem conta? Cadastre-se</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
