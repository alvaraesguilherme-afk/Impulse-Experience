const CHAVE = 'impulse_perfis'
const MAX_PERFIS = 8

export function getPerfis() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? JSON.parse(bruto) : []
  } catch {
    return []
  }
}

export function salvarPerfil({ id, nome, foto_url }) {
  const atuais = getPerfis().filter(p => p.id !== id)
  atuais.unshift({ id, nome, foto_url: foto_url || null })
  localStorage.setItem(CHAVE, JSON.stringify(atuais.slice(0, MAX_PERFIS)))
}

export function removerPerfil(id) {
  localStorage.setItem(CHAVE, JSON.stringify(getPerfis().filter(p => p.id !== id)))
}
