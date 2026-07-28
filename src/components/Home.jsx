export default function Home({ usuario }) {
  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <div className="topo-usuario">
          {usuario.foto_url
            ? <img src={usuario.foto_url} alt="" className="topo-avatar topo-avatar-pequeno" />
            : <span className="topo-avatar topo-avatar-pequeno topo-avatar-vazio" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>}
          <span className="topo-saudacao">Olá, {usuario.nome}</span>
        </div>
      </header>

      <div className="home-marca">
        Impulse<br />
        <span className="home-marca-gradiente">Experience</span>
      </div>
    </div>
  )
}
