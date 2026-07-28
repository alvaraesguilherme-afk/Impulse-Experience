const LABEL_GENERO = {
  masculino: 'Impulse Masculino',
  feminino: 'Impulse Feminino',
}

export default function Perfil({ usuario }) {
  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Perfil</h2>
      </header>

      <section className="perfil-secao">
        {usuario.foto_url
          ? <img src={usuario.foto_url} alt="" className="perfil-avatar-grande" />
          : <span className="perfil-avatar-grande topo-avatar-vazio" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>}
        <h3 className="perfil-nome-grande">{usuario.nome}</h3>
        {usuario.genero && <span className="chip chip-lider">{LABEL_GENERO[usuario.genero]}</span>}
      </section>

      <section className="secao">
        <h3>Papel</h3>
        <p className="secao-sub">{usuario.is_supervisor ? 'Supervisor' : 'Staff'}</p>
      </section>
    </div>
  )
}
