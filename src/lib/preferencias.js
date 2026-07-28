const CHAVE_SESSAO = 'impulse_usuario'
const CHAVE_GRUPO = 'impulse_grupo_ativo'

export function grupoAtivoSalvo() {
  try {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null')
    if (!usuario) return undefined
    if (usuario.genero === 'ambos') return localStorage.getItem(CHAVE_GRUPO) || 'masculino'
    return usuario.genero || 'masculino'
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
