import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PinField from './PinField'

const TAMANHO_MAX_FOTO = 5 * 1024 * 1024

export default function Cadastro({ onCadastrado, onVoltar }) {
  const [nome, setNome] = useState('')
  const [pin, setPin] = useState('')
  const [confirmarPin, setConfirmarPin] = useState('')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function escolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    if (!arquivo.type.startsWith('image/')) {
      setErro('Escolha um arquivo de imagem')
      return
    }
    if (arquivo.size > TAMANHO_MAX_FOTO) {
      setErro('A foto precisa ter até 5MB')
      return
    }
    setErro('')
    setFoto(arquivo)
    setFotoPreview(URL.createObjectURL(arquivo))
  }

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')

    if (nome.trim().length < 2) {
      setErro('Digite seu nome completo')
      return
    }
    if (pin.length < 4) {
      setErro('A senha precisa ter pelo menos 4 números')
      return
    }
    if (pin !== confirmarPin) {
      setErro('As senhas não são iguais')
      return
    }

    setCarregando(true)

    let fotoUrl = null
    if (foto) {
      const extensao = foto.name.split('.').pop() || 'jpg'
      const caminho = `${crypto.randomUUID()}.${extensao}`
      const { error: erroUpload } = await supabase.storage.from('avatars').upload(caminho, foto)
      if (!erroUpload) {
        fotoUrl = supabase.storage.from('avatars').getPublicUrl(caminho).data.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('staff')
      .insert({ nome: nome.trim(), pin, is_supervisor: false, ativo: true, foto_url: fotoUrl })
      .select('id, nome, is_supervisor, foto_url')
      .single()
    setCarregando(false)

    if (error) {
      setErro(error.code === '23505' ? 'Essa senha já está em uso, escolha outra' : 'Não deu pra cadastrar, tenta de novo')
      return
    }
    onCadastrado(data)
  }

  return (
    <div className="tela tela-login">
      <div className="marca-app">Impulse Experience</div>
      <div className="login-card-wrap">
        <label htmlFor="cadastro-foto" className="login-avatar-topo login-avatar-clicavel">
          {fotoPreview ? (
            <img src={fotoPreview} alt="" className="login-avatar-img" />
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="17" y1="11" x2="23" y2="11" />
            </svg>
          )}
          <span className="login-avatar-editar" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
        </label>
        <input
          id="cadastro-foto"
          type="file"
          accept="image/*"
          onChange={escolherFoto}
          className="sr-only"
        />

        <div className="login-card">
          <h1>Criar conta</h1>
          <p className="login-sub">Escolha o nome e a senha que vai usar</p>
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
              label="Criar senha"
              placeholder="Criar senha"
              value={pin}
              onChange={setPin}
            />
            <PinField
              id="cadastro-confirmar-pin"
              label="Confirmar senha"
              placeholder="Confirmar senha"
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
    </div>
  )
}
