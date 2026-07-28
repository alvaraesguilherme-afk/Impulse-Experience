const CHAVE_TEMA = 'impulse_tema'
const CHAVE_ACCENT = 'impulse_accent'

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

export function getTema() {
  return localStorage.getItem(CHAVE_TEMA) || 'escuro'
}

export function getAccent() {
  return localStorage.getItem(CHAVE_ACCENT) || 'roxo'
}

export function aplicarPreferencias() {
  const tema = getTema()
  const accent = getAccent()
  const root = document.documentElement

  const escuro = tema === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : tema === 'escuro'

  if (escuro) root.removeAttribute('data-tema')
  else root.setAttribute('data-tema', 'claro')

  if (accent === 'roxo') root.removeAttribute('data-accent')
  else root.setAttribute('data-accent', accent)
}

export function setTema(tema) {
  localStorage.setItem(CHAVE_TEMA, tema)
  aplicarPreferencias()
}

export function setAccent(accent) {
  localStorage.setItem(CHAVE_ACCENT, accent)
  aplicarPreferencias()
}
