import { useState } from 'react'

const IconOlho = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconOlhoFechado = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const IconCadeado = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export default function PinField({ id, label, value, onChange, placeholder, autoFocus, maxLength = 6 }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="campo-pin-wrap">
      <label htmlFor={id} className="sr-only">{label}</label>
      <span className="campo-icone" aria-hidden="true">{IconCadeado}</span>
      <input
        id={id}
        type={visivel ? 'text' : 'password'}
        inputMode="numeric"
        autoFocus={autoFocus}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, maxLength))}
        placeholder={placeholder}
        className="pin-input campo-com-icone"
      />
      <button
        type="button"
        className="btn-olho"
        onClick={() => setVisivel(v => !v)}
        aria-label={visivel ? 'Ocultar PIN' : 'Mostrar PIN'}
        aria-pressed={visivel}
      >
        {visivel ? IconOlhoFechado : IconOlho}
      </button>
    </div>
  )
}
