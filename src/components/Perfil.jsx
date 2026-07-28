import { useState } from 'react'
import { supabase } from '../lib/supabase'

const LABEL_GENERO = {
  masculino: 'Impulse Masculino',
  feminino: 'Impulse Feminino',
  ambos: 'Impulse Masculino & Feminino',
}

const TAMANHO_MAX_FOTO = 5 * 1024 * 1024

export default function Perfil({ usuario, onVoltar, editavel, onFotoAtualizada, online }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function trocarFoto(e) {
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
    setEnviando(true)

    const extensao = arquivo.name.split('.').pop() || 'jpg'
    const caminho = `${crypto.randomUUID()}.${extensao}`
    const { error: erroUpload } = await supabase.storage.from('avatars').upload(caminho, arquivo)

    if (erroUpload) {
      setEnviando(false)
      setErro('Não deu pra enviar a foto, tenta de novo')
      return
    }

    const fotoUrl = supabase.storage.from('avatars').getPublicUrl(caminho).data.publicUrl
    await supabase.from('staff').update({ foto_url: fotoUrl }).eq('id', usuario.id)

    setEnviando(false)
    onFotoAtualizada?.(fotoUrl)
  }

  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <div className="topo-com-voltar">
          {onVoltar && (
            <button className="btn-voltar" onClick={onVoltar} aria-label="Voltar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <h2>Perfil</h2>
        </div>
      </header>

      <section className="perfil-secao">
        {editavel ? (
          <>
            <label htmlFor="perfil-foto" className="perfil-avatar-grande-wrap">
              {usuario.foto_url
                ? <img src={usuario.foto_url} alt="" className="perfil-avatar-grande" />
                : <span className="perfil-avatar-grande topo-avatar-vazio" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>}
              <span className="perfil-avatar-editar" aria-hidden="true">
                {enviando ? '…' : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                )}
              </span>
            </label>
            <input id="perfil-foto" type="file" accept="image/*" onChange={trocarFoto} className="sr-only" disabled={enviando} />
            {erro && <p className="login-erro" role="alert">{erro}</p>}
          </>
        ) : (
          usuario.foto_url
            ? <img src={usuario.foto_url} alt="" className="perfil-avatar-grande" />
            : <span className="perfil-avatar-grande topo-avatar-vazio" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>
        )}
        <h3 className="perfil-nome-grande">{usuario.nome}</h3>
        {usuario.genero && <span className="chip chip-lider">{LABEL_GENERO[usuario.genero]}</span>}
        {!editavel && (
          <span className={`chip-status ${online ? 'chip-status-online' : 'chip-status-offline'}`}>
            <span className="bolinha-online-inline" aria-hidden="true" />
            {online?.online_em
              ? `Online desde ${new Date(online.online_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
              : 'Offline'}
          </span>
        )}
      </section>

      <section className="secao">
        <h3>Papel</h3>
        <p className="secao-sub">{usuario.is_supervisor ? 'Supervisor' : 'Staff'}</p>
      </section>
    </div>
  )
}
