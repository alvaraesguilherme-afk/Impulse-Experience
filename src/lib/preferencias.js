const CHAVE_SESSAO = 'impulse_usuario'
const CHAVE_GRUPO = 'impulse_grupo_ativo'
const CHAVE_PREVIEW = 'impulse_grupo_preview'
const CHAVE_VERSAO_PC = 'impulse_versao_pc'

export function versaoPcSalva() {
  try {
    return localStorage.getItem(CHAVE_VERSAO_PC) === '1'
  } catch {
    return false
  }
}

export function setVersaoPc(ativa) {
  try {
    if (ativa) localStorage.setItem(CHAVE_VERSAO_PC, '1')
    else localStorage.removeItem(CHAVE_VERSAO_PC)
  } catch {
    // ignora
  }
}

export function aplicarVersaoPc(ativa = versaoPcSalva()) {
  const root = document.documentElement
  if (ativa) root.setAttribute('data-versao', 'pc')
  else root.removeAttribute('data-versao')
}

export function grupoPreviewSalvo() {
  try {
    return localStorage.getItem(CHAVE_PREVIEW) || undefined
  } catch {
    return undefined
  }
}

export function setGrupoPreview(grupo) {
  try {
    localStorage.setItem(CHAVE_PREVIEW, grupo)
  } catch {
    // ignora
  }
}

export function limparGrupoPreview() {
  try {
    localStorage.removeItem(CHAVE_PREVIEW)
  } catch {
    // ignora
  }
}

export function grupoAtivoSalvo() {
  try {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null')
    if (usuario) {
      if (usuario.genero === 'ambos') return localStorage.getItem(CHAVE_GRUPO) || 'masculino'
      return usuario.genero || 'masculino'
    }
    return grupoPreviewSalvo()
  } catch {
    return undefined
  }
}

export function aplicarPreferencias(grupoAtivo = grupoAtivoSalvo()) {
  const root = document.documentElement
  if (grupoAtivo === 'feminino' || grupoAtivo === 'masculino') {
    root.setAttribute('data-grupo', grupoAtivo)
  } else {
    root.removeAttribute('data-grupo')
  }
}
