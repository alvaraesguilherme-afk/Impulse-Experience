export default function ToastEntradas({ toasts }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-entrada-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast-entrada">
          <span className="toast-entrada-dot" aria-hidden="true" />
          <span>{t.nome} entrou agora</span>
        </div>
      ))}
    </div>
  )
}
