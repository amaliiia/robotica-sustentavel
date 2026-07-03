/* =============================================================
   app.js — Controlador principal da aplicação
   Responsável por: navegação entre views e inicialização.
   ============================================================= */

const App = (() => {

  /** IDs de todas as views registradas */
  const VIEW_IDS = ['coleta', 'painel', 'rotas', 'declaracao'];

  /**
   * Exibe a view solicitada e atualiza o estado ativo no menu.
   * @param {string} id - ID da view (sem prefixo 'view-')
   */
  function showView(id) {
    VIEW_IDS.forEach(v => {
      document.getElementById(`view-${v}`)?.classList.remove('active');
      document.getElementById(`nav-${v}`)?.classList.remove('active');
    });

    document.getElementById(`view-${id}`)?.classList.add('active');
    document.getElementById(`nav-${id}`)?.classList.add('active');

    // ── ALTERAÇÃO: Se a view acessada for o painel, atualiza os dados do Firebase ──
    if (id === 'painel') {
      PainelView.carregarDadosERenderizar();
    }
    // quando abrir declaração, carrega as coletas concluídas para popular o seletor
    if (id === 'declaracao') {
      DeclaracaoView.carregarDadosERenderizar();
    }
  }

  /**
   * Troca a aba ativa dentro de um grupo de tabs.
   * Espera que os elementos sigam a convenção:
   * - Tab: elemento que recebeu o click (event.target)
   * - Conteúdo: <div id="tab-{id}">
   * @param {string} id - ID da aba (sem prefixo 'tab-')
   */
  function showTab(id) {
    const allContents = document.querySelectorAll('.tab-content');
    const allTabs = document.querySelectorAll('.tab');

    allContents.forEach(t => t.classList.remove('active'));
    allTabs.forEach(t => t.classList.remove('active'));

    document.getElementById(`tab-${id}`)?.classList.add('active');
    event.target.classList.add('active');
  }

  /**
   * Inicializa a aplicação:
   * - Renderiza o HTML de cada view no seu container
   * - Exibe a view padrão (coleta)
   */
  function init() {
    // Cada módulo de view expõe um método render() que retorna HTML
    const views = {
      coleta: ColetaView.render(),
      // Aqui o painel vai renderizar sua versão "vazia" inicialmente.
      // Quando o usuário clicar na tela do painel, a função showView() acima atualizará os dados.
      painel: PainelView.render(),
      rotas: RotasView.render(),
      declaracao: DeclaracaoView.render(),
    };

    VIEW_IDS.forEach(id => {
      const container = document.getElementById(`view-${id}`);
      if (container && views[id]) {
        container.innerHTML = views[id];
      }
    });

    showView('coleta');
  }

  // API pública
  return { init, showView, showTab };

})();