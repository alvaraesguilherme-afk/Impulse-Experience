import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'

export default function Login({ onLogin, onCadastrar, onTrocarGrupo }) {
  const [nomes, setNomes] = useState([])
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarAjudaPin, setMostrarAjudaPin] = useState(false)
  const [listaAberta, setListaAberta] = useState(false)
  const campoRef = useRef(null)

  useEffect(() => {
    supabase.from('staff').select('nome').eq('ativo', true).order('nome')
      .then(({ data }) => setNomes((data || []).map(p => p.nome)))
  }, [])

  useEffect(() => {
    function fecharSeClicarFora(e) {
      if (campoRef.current && !campoRef.current.contains(e.target)) {
        setListaAberta(false)
      }
    }
    document.addEventListener('mousedown', fecharSeClicarFora)
    document.addEventListener('touchstart', fecharSeClicarFora)
    return () => {
      document.removeEventListener('mousedown', fecharSeClicarFora)
      document.removeEventListener('touchstart', fecharSeClicarFora)
    }
  }, [])

  const nomesFiltrados = nome.trim()
    ? nomes.filter(n => n.toLowerCase().includes(nome.trim().toLowerCase()))
    : nomes

  function escolherNome(n) {
    setNome(n)
    setListaAberta(false)
  }

  async function entrar(e) {
    e.preventDefault()
    if (!nome.trim() || !senha) return
    setCarregando(true)
    setErro('')

    const { data, error } = await supabase
      .from('staff')
      .select('id, nome, is_supervisor, foto_url, genero')
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

  return (
    <div className="tela tela-login">
      <div className="topo-marca-wrap">
        <div className="marca-app">Impulse Experience</div>
        <button type="button" className="link-trocar-grupo" onClick={onTrocarGrupo}>Trocar grupo</button>
      </div>
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
            <div className="campo-pin-wrap campo-autocomplete" ref={campoRef}>
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
                autoComplete="off"
                value={nome}
                onChange={e => { setNome(e.target.value); setListaAberta(true) }}
                onFocus={() => setListaAberta(true)}
                placeholder="Toque para escolher seu nome"
                className="pin-input campo-nome campo-com-icone"
                role="combobox"
                aria-expanded={listaAberta}
                aria-autocomplete="list"
              />
              {listaAberta && nomesFiltrados.length > 0 && (
                <ul className="autocomplete-lista">
                  {nomesFiltrados.map(n => (
                    <li key={n}>
                      <button type="button" className="autocomplete-item" onClick={() => escolherNome(n)}>
                        {n}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {listaAberta && nome.trim() && nomesFiltrados.length === 0 && (
                <ul className="autocomplete-lista">
                  <li className="autocomplete-vazio">Nenhum nome encontrado</li>
                </ul>
              )}
            </div>
            <PinField
              id="login-senha"
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

          <button className="btn-link" onClick={onCadastrar}>Não tem conta? Cadastre-se</button>
        </div>
      </div>
    </div>
  )
}
