const CHAVE_TEMA = 'impulse_tema'
const CHAVE_ACCENT = 'impulse_accent'
const CHAVE_SESSAO = 'impulse_usuario'
const CHAVE_GRUPO = 'impulse_grupo_ativo'

export const TEMAS = [
  { id: 'escuro', label: 'Escuro' },
  { id: 'claro', label: 'Claro' },
  { id: 'auto', label: 'Automático' },
]

export const CORES = [
  { id: 'roxo', label: 'Roxo', cor: '#7C5CFC' },
  { id: 'azul', label: 'Azul', cor: '#2563EB' },
  { id: 'verde', label: 'Verde', cor: '#16A34A' },
  { id: 'rosa', label: 'Rosa', cor: '#DB2777' },
  { id: 'laranja', label: 'Laranja', cor: '#EA580C' },
  { id: 'vermelho', label: 'Vermelho', cor: '#DC2626' },
]

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

function temaPadrao(grupoAtivo) {
  return grupoAtivo === 'feminino' ? 'claro' : 'escuro'
}

function accentPadrao(grupoAtivo) {
  if (grupoAtivo === 'feminino') return 'rosa'
  if (grupoAtivo === 'masculino') return 'azul'
  return 'roxo'
}

export function getTema(grupoAtivo = grupoAtivoSalvo()) {
  return localStorage.getItem(CHAVE_TEMA) || temaPadrao(grupoAtivo)
}

export function getAccent(grupoAtivo = grupoAtivoSalvo()) {
  return localStorage.getItem(CHAVE_ACCENT) || accentPadrao(grupoAtivo)
}

export function aplicarPreferencias(grupoAtivo = grupoAtivoSalvo()) {
  const tema = getTema(grupoAtivo)
  const accent = getAccent(grupoAtivo)
  const root = document.documentElement

  const escuro = tema === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : tema === 'escuro'

  if (escuro) root.removeAttribute('data-tema')
  else root.setAttribute('data-tema', 'claro')

  if (accent === 'roxo') root.removeAttribute('data-accent')
  else root.setAttribute('data-accent', accent)
}

export function setTema(tema, grupoAtivo) {
  localStorage.setItem(CHAVE_TEMA, tema)
  aplicarPreferencias(grupoAtivo)
}

export function setAccent(accent, grupoAtivo) {
  localStorage.setItem(CHAVE_ACCENT, accent)
  aplicarPreferencias(grupoAtivo)
}
