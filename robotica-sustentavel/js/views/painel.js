/* =============================================================
   views/painel.js — Painel de controle com abas de pedidos
   ============================================================= */

const PainelView = (() => {

  /* ── Dados de exemplo ── */

  // Alteração 1: O array começa vazio para receber os dados reais do Firebase
  let pedidosAgendados = [];

  const pedidosColetados = [
    {
      icon: 'ti-building-store',
      nome: 'Grupo Ambiental Norte S/A',
      endereco: 'Av. Santos Dumont, 5335 — Aldeota',
      dataColeta: '24/06/2026',
      pesado: false,
    },
    {
      icon: 'ti-user',
      nome: 'Fernanda Queiroz',
      endereco: 'R. Tibúrcio Cavalcante, 42 — Meireles',
      dataColeta: '25/06/2026',
      pesado: false,
    },
    {
      icon: 'ti-building',
      nome: 'Clínica Saúde Digital Ltda',
      endereco: 'Av. Dom Luís, 880 — Aldeota',
      dataColeta: '25/06/2026',
      pesado: true,
      peso: '47,2 kg',
    },
  ];

  const pedidosConcluidos = [
    {
      icon: 'ti-circle-check',
      nome: 'Universidade de Fortaleza — UNIFOR',
      endereco: 'Av. Washington Soares, 1321 — Edson Queiroz',
      dataConclusao: '20/06/2026',
      peso: '182,5 kg',
      itens: 64,
    },
    {
      icon: 'ti-circle-check',
      nome: 'Banco BNB — Agência Centro',
      endereco: 'Praça Castro Carreira, s/n — Centro',
      dataConclusao: '18/06/2026',
      peso: '93,8 kg',
      itens: 37,
    },
  ];

  /* ── Funções de renderização de HTML ── */

  function renderAgendados() {
    // Se não houver nenhum agendamento no banco, mostra um aviso amigável
    if (pedidosAgendados.length === 0) {
      return `<p style="padding: 20px; text-align: center; color: var(--rs-muted);">Nenhuma coleta agendada encontrada no momento.</p>`;
    }

    return pedidosAgendados.map(p => `
      <div class="order-card">
        <div class="order-icon"><i class="ti ${p.icon}" aria-hidden="true"></i></div>
        <div class="order-info">
          <div class="name">${p.nome}</div>
          <div class="addr">
            <i class="ti ti-map-pin" aria-hidden="true"></i> ${p.endereco}
          </div>
          <div class="order-badges">
            <span class="badge badge-amber">
              <i class="ti ti-clock" aria-hidden="true"></i> ${p.data}
            </span>
            <span class="badge badge-gray">${p.itens}</span>
          </div>
        </div>
        <div class="order-actions">
          <button class="action-btn">Ver detalhes</button>
          <button class="action-btn">Marcar coletado</button>
        </div>
      </div>
    `).join('');
  }

  function renderColetados() {
    return pedidosColetados.map(p => `
      <div class="order-card">
        <div class="order-icon"><i class="ti ${p.icon}" aria-hidden="true"></i></div>
        <div class="order-info">
          <div class="name">${p.nome}</div>
          <div class="addr">
            <i class="ti ti-map-pin" aria-hidden="true"></i> ${p.endereco}
          </div>
          <div class="meta">
            Coletado em ${p.dataColeta}${p.pesado ? ` · ${p.peso}` : ''}
          </div>
          <div class="order-badges">
            <span class="badge badge-green">
              <i class="ti ti-check" aria-hidden="true"></i> Coletado
            </span>
            ${p.pesado
        ? `<span class="badge badge-green">
                   <i class="ti ti-scale" aria-hidden="true"></i> Pesado
                 </span>`
        : `<span class="badge badge-unweighed">
                   <i class="ti ti-scale-off" aria-hidden="true"></i> Não pesado
                 </span>`
      }
          </div>
        </div>
        <div class="order-actions">
          ${!p.pesado
        ? `<button class="action-btn">Registrar peso</button>`
        : `<button class="action-btn">Concluir</button>`
      }
          <button class="action-btn">Ver detalhes</button>
        </div>
      </div>
    `).join('');
  }

  function renderConcluidos() {
    return pedidosConcluidos.map(p => `
      <div class="order-card">
        <div class="order-icon"><i class="ti ${p.icon}" aria-hidden="true"></i></div>
        <div class="order-info">
          <div class="name">${p.nome}</div>
          <div class="addr">
            <i class="ti ti-map-pin" aria-hidden="true"></i> ${p.endereco}
          </div>
          <div class="meta">
            Concluído em ${p.dataConclusao} · ${p.peso} · ${p.itens} itens
          </div>
          <div class="order-badges">
            <span class="badge badge-green">
              <i class="ti ti-circle-check" aria-hidden="true"></i> Concluído
            </span>
          </div>
        </div>
        <div class="order-actions">
          <button class="action-btn" onclick="App.showView('declaracao')">Declaração</button>
        </div>
      </div>
    `).join('');
  }

  /** Retorna o HTML completo da view de painel */
  function render() {
    const naocoletados = pedidosColetados.filter(p => !p.pesado).length;

    return `
      <div class="view-header">
        <h2>Painel de controle</h2>
        <p>Acompanhe o status de todas as coletas</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="label">Agendadas</div>
          <div class="value">${pedidosAgendados.length}</div>
          <div class="sub">esta semana</div>
        </div>
        <div class="stat-card">
          <div class="label">Coletadas</div>
          <div class="value">${pedidosColetados.length}</div>
          <div class="sub">${naocoletados} não pesada${naocoletados !== 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card">
          <div class="label">Concluídas</div>
          <div class="value">${pedidosConcluidos.length}</div>
          <div class="sub">este mês</div>
        </div>
      </div>

      <div class="tabs">
        <button class="tab active" onclick="App.showTab('agendadas')">Agendadas</button>
        <button class="tab"        onclick="App.showTab('coletadas')">Coletadas</button>
        <button class="tab"        onclick="App.showTab('concluidas')">Concluídas</button>
      </div>

      <div class="tab-content active" id="tab-agendadas">
        ${renderAgendados()}
      </div>

      <div class="tab-content" id="tab-coletadas">
        ${renderColetados()}
      </div>

      <div class="tab-content" id="tab-concluidas">
        ${renderConcluidos()}
      </div>
    `;
  }

  // ── Alteração 2: Nova função inserida bem aqui, logo após a função render() terminar ──
  function carregarDadosERenderizar() {
    const container = document.getElementById('view-painel');
    if (!container) return;
    
    // Coloca uma mensagem temporária na tela enquanto espera o Firebase responder
    container.innerHTML = '<p style="padding: 20px; text-align: center;">Carregando dados reais do Firebase...</p>';

    // Busca os dados na coleção "coletas" do banco
    firebase.firestore().collection("coletas").where("status", "==", "agendada").get()
      .then((querySnapshot) => {
        pedidosAgendados = []; // Limpa a lista local antes de preencher
        
        querySnapshot.forEach((doc) => {
          const dados = doc.data();
          
          // Trata a data gerada automaticamente pelo Firebase
          let dataFormatada = 'Data a definir';
          if (dados.dataCriacao && typeof dados.dataCriacao.toDate === 'function') {
            const dataObj = dados.dataCriacao.toDate();
            dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
          }

          // Adiciona o pedido real estruturado para o card de exibição
          pedidosAgendados.push({
            id: '#' + doc.id.substring(0, 5).toUpperCase(), // Reduz o ID grande do Firebase
            icon: 'ti-building-store', 
            nome: dados.nome || 'Sem Nome',
            endereco: dados.endereco || 'Sem Endereço',
            data: dataFormatada, 
            itens: dados.observacoes || 'Sem detalhes informados'
          });
        });
        
        // Com o array cheio de dados reais, renderiza a tela final
        container.innerHTML = render();
      })
      .catch((error) => {
        console.error("Erro ao carregar do Firebase: ", error);
        container.innerHTML = '<p style="padding: 20px; color: red; text-align: center;">Erro ao carregar dados do servidor.</p>';
      });
  }

  // ── Alteração 3: Exportação ajustada para expor tanto o render antigo quanto a nova função de carga ──
  return { 
    render, 
    carregarDadosERenderizar 
  };

})();