export default function GrupoSwitcher({ grupo, onMudar }) {
  return (
    <div className="grupo-switcher" role="radiogroup" aria-label="Grupo Impulse Masculino ou Feminino">
      <button
        type="button"
        role="radio"
        aria-checked={grupo === 'masculino'}
        className={`grupo-btn ${grupo === 'masculino' ? 'grupo-btn-ativo' : ''}`}
        onClick={() => onMudar('masculino')}
      >
        Masculino
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={grupo === 'feminino'}
        className={`grupo-btn ${grupo === 'feminino' ? 'grupo-btn-ativo' : ''}`}
        onClick={() => onMudar('feminino')}
      >
        Feminino
      </button>
    </div>
  )
}
