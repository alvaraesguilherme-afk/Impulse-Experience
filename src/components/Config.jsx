const VERSAO_APP = '1.0.0'

export default function Config({ usuario, onSair }) {
  return (
    <div className="tela">
      <header className="topo topo-minimal">
        <h2>Configurações</h2>
      </header>

      <section className="secao">
        <h3>Conta</h3>
        <div className="config-linha">
          <span>Logado como</span>
          <span className="config-valor">{usuario.nome}</span>
        </div>
      </section>

      <section className="secao">
        <h3>Sobre o aplicativo</h3>
        <div className="config-linha">
          <span>Nome</span>
          <span className="config-valor">Impulse Experience</span>
        </div>
        <div className="config-linha">
          <span>Versão</span>
          <span className="config-valor">{VERSAO_APP}</span>
        </div>
        <div className="config-linha">
          <span>Desenvolvido por</span>
          <span className="config-valor">Guilherme Alvarães</span>
        </div>
      </section>

      <button className="link-sair" onClick={onSair}>Sair da conta</button>
    </div>
  )
}
