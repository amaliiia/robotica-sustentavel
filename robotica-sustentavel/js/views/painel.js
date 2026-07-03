/* =============================================================
   views/painel.js — Painel de controle com abas de pedidos
   ============================================================= */

const PainelView = (() => {

  /* ── Dados de exemplo ── */

  // Alteração 1: O array começa vazio para receber os dados reais do Firebase
  let pedidosAgendados = [];

  let pedidosColetados = [];
  let pedidosConcluidos = [];

  /* ── Funções de renderização de HTML ── */

  function renderAgendados() {
    // Se não houver nenhum agendamento no banco, mostra um aviso amigável
    if (pedidosAgendados.length === 0) {
      return `<p style="padding: 20px; text-align: center; color: var(--rs-muted);">Nenhuma coleta agendada encontrada no momento.</p>`;
    }
    return pedidosAgendados.map((p, i) => `
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
          <button class="action-btn btn-detalhes" data-type="agendadas" data-idx="${i}">Ver detalhes</button>
          <button class="action-btn btn-marcar" data-type="agendadas" data-idx="${i}">Marcar coletado</button>
        </div>
      </div>
    `).join('');
  }

  function renderColetados() {
    return pedidosColetados.map((p, i) => `
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
        ? `<button class="action-btn btn-registrar-peso" data-type="coletadas" data-idx="${i}">Registrar peso</button>`
        : `<button class="action-btn btn-concluir" data-type="coletadas" data-idx="${i}">Concluir</button>`
      }
          <button class="action-btn btn-detalhes" data-type="coletadas" data-idx="${i}">Ver detalhes</button>
        </div>
      </div>
    `).join('');
  }

  function renderConcluidos() {
    return pedidosConcluidos.map((p, i) => `
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
          <button class="action-btn btn-detalhes" data-type="concluidas" data-idx="${i}">Ver detalhes</button>
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

        <!-- Novo modal de detalhes e registrar peso (invisível até acionado) -->
        <div id="modal-detalhes" class="modal-wrap" style="display:none">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-header-icon"><i class="ti ti-building-store" aria-hidden="true"></i></div>
              <div class="modal-header-info">
                <div class="title">Título</div>
                <div class="sub">Subtítulo</div>
              </div>
              <button class="modal-close" aria-label="Fechar"><i class="ti ti-x" aria-hidden="true"></i></button>
            </div>
            <div class="modal-body">
              <div class="status-row">
                <i class="ti ti-clock" aria-hidden="true"></i>
                <div>
                  <div class="s-label">Status atual</div>
                  <div class="s-val">—</div>
                </div>
                <span class="badge badge-amber" style="margin-left:auto">Status</span>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">CNPJ</span>
                  <span class="info-value cnpj">—</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Responsável</span>
                  <span class="info-value responsavel">—</span>
                </div>
                <div class="info-item">
                  <span class="info-label">E-mail</span>
                  <span class="info-value email">—</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Telefone</span>
                  <span class="info-value telefone">—</span>
                </div>
                <div class="info-item full">
                  <span class="info-label">Endereço de coleta</span>
                  <span class="info-value addr endereco">—</span>
                </div>
              </div>

              <div class="divider"></div>

              <div class="residuos-title">Resíduos declarados</div>
              <div class="residuos-list residuos-container">
                <!-- itens adicionados dinamicamente -->
              </div>

              <div class="divider"></div>

              <div class="info-item full">
                <span class="info-label">Observações</span>
                <span class="info-value observacoes">—</span>
              </div>

              <div class="divider"></div>

              <div class="modal-footer">
                <span class="footer-meta meta-info">Criado em —</span>
                <div class="footer-btns">
                  <button class="btn btn-ghost modal-close">Fechar</button>
                  <button class="btn btn-primary btn-open-peso">Registrar peso</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="modal-peso" class="modal-wrap" style="display:none">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-header-icon"><i class="ti ti-scale" aria-hidden="true"></i></div>
              <div class="modal-header-info">
                <div class="title">Registrar peso da coleta</div>
                <div class="sub">—</div>
              </div>
              <button class="modal-close" aria-label="Fechar"><i class="ti ti-x" aria-hidden="true"></i></button>
            </div>
            <div class="modal-body">

              <div class="peso-visual">
                <i class="ti ti-scale scale-icon" aria-hidden="true"></i>
                <div class="hint">Informe o peso total aferido na balança</div>
                <div class="peso-input-row">
                  <input id="peso-input-field" class="peso-input" type="number" placeholder="0,0" min="0" step="0.1" aria-label="Peso em quilogramas">
                  <span class="peso-unit">kg</span>
                </div>
              </div>

              <div class="aviso" id="peso-aviso" style="display:none">
                <i class="ti ti-alert-triangle" aria-hidden="true"></i>
                <span>Esta coleta está marcada como <strong>não pesada</strong>. Registre o peso para liberar a conclusão.</span>
              </div>

              <div class="obs-label">Observações (opcional)</div>
              <textarea id="peso-obs" class="obs-field" placeholder="Ex: parte do material foi separado para triagem"></textarea>

            </div>

            <div class="modal-footer">
              <span class="footer-meta" id="peso-footer-meta"><i class="ti ti-map-pin" style="font-size:13px;vertical-align:-2px;margin-right:4px" aria-hidden="true"></i>Coletado em —</span>
              <div class="footer-btns">
                <button class="btn btn-ghost modal-close">Cancelar</button>
                <button class="btn btn-amber btn-save-peso">Salvar peso</button>
              </div>
            </div>
          </div>
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
    firebase.firestore().collection("coletas").orderBy('dataCriacao', 'desc').get()
      .then((querySnapshot) => {
        pedidosAgendados = [];
        pedidosColetados = [];
        pedidosConcluidos = [];

        querySnapshot.forEach((doc) => {
          const dados = doc.data();
          const status = String(dados.status || '').toLowerCase();

          let categoria = 'agendadas';
          if (status.includes('conclu')) {
            categoria = 'concluidas';
          } else if (status.includes('colet')) {
            categoria = 'coletadas';
          }

          const item = {
            docId: doc.id,
            id: '#' + doc.id.substring(0, 5).toUpperCase(),
            icon: status.includes('conclu') ? 'ti-circle-check' : 'ti-building-store',
            nome: dados.nome || 'Sem Nome',
            endereco: dados.endereco || 'Sem Endereço',
            data: dados.dataCriacao ? dados.dataCriacao.toDate().toLocaleDateString('pt-BR') + ' às ' + dados.dataCriacao.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Data a definir',
            dataColeta: dados.dataColeta || '',
            dataConclusao: dados.dataConclusao || '',
            itens: dados.itens || dados.observacoes || 'Sem detalhes informados',
            documento: dados.documento || dados.cnpj || '',
            email: dados.email || '',
            telefone: dados.telefone || '',
            observacoes: dados.observacoes || '',
            status: dados.status || 'agendada',
            residuos: dados.residuos || [],
            pesado: !!dados.pesado,
            peso: dados.peso || ''
          };

          if (categoria === 'coletadas') {
            pedidosColetados.push(item);
          } else if (categoria === 'concluidas') {
            pedidosConcluidos.push(item);
          } else {
            pedidosAgendados.push(item);
          }
        });

        // Com os arrays preenchidos a partir do Firestore, renderiza a view final
        container.innerHTML = render();
        attachModalHandlers();
      })
      .catch((error) => {
        console.error("Erro ao carregar do Firebase: ", error);
        container.innerHTML = '<p style="padding: 20px; color: red; text-align: center;">Erro ao carregar dados do servidor.</p>';
      });
  }

  /* ── Handlers e utilitários do modal ── */
  let _currentTipo = null;
  let _currentIdx = null;

  function getArrayByType(type) {
    if (type === 'agendadas') return pedidosAgendados;
    if (type === 'coletadas') return pedidosColetados;
    if (type === 'concluidas') return pedidosConcluidos;
    return [];
  }

  function attachModalHandlers() {
    // detalhes
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
      btn.removeEventListener('click', btn._handler);
      const handler = (e) => {
        const type = btn.dataset.type;
        const idx = Number(btn.dataset.idx);
        openDetalhes(type, idx);
      };
      btn._handler = handler;
      btn.addEventListener('click', handler);
    });

    // marcar coletado (move agendada -> coletadas)
    document.querySelectorAll('.btn-marcar').forEach(btn => {
      btn.removeEventListener('click', btn._handler);
      const handler = (e) => {
        const idx = Number(btn.dataset.idx);
        const item = pedidosAgendados.splice(idx, 1)[0];
        if (item) {
          pedidosColetados.unshift({
            icon: 'ti-building-store',
            docId: item.docId,
            nome: item.nome,
            endereco: item.endereco,
            dataColeta: new Date().toLocaleDateString('pt-BR'),
            pesado: false,
            documento: item.documento,
            email: item.email,
            telefone: item.telefone,
            observacoes: item.observacoes,
            status: item.status,
            residuos: item.residuos
          });
          const container = document.getElementById('view-painel');
          if (container) container.innerHTML = render();
          attachModalHandlers();
        }
      };
      btn._handler = handler;
      btn.addEventListener('click', handler);
    });

    // abrir registrar peso (dos cards)
    document.querySelectorAll('.btn-registrar-peso').forEach(btn => {
      btn.removeEventListener('click', btn._handler);
      const handler = (e) => {
        const type = btn.dataset.type;
        const idx = Number(btn.dataset.idx);
        openPeso(type, idx);
      };
      btn._handler = handler;
      btn.addEventListener('click', handler);
    });

    // fechar modais
    document.querySelectorAll('#modal-detalhes .modal-close, #modal-peso .modal-close').forEach(btn => {
      btn.removeEventListener('click', btn._handler);
      const handler = hideModals;
      btn._handler = handler;
      btn.addEventListener('click', handler);
    });

    // botão dentro do modal de detalhes que abre o peso
    const openPesoBtn = document.querySelector('.btn-open-peso');
    if (openPesoBtn) {
      openPesoBtn.removeEventListener('click', openPesoBtn._handler);
      openPesoBtn._handler = () => {
        if (_currentTipo !== null && _currentIdx !== null) openPeso(_currentTipo, _currentIdx);
      };
      openPesoBtn.addEventListener('click', openPesoBtn._handler);
    }

    // salvar peso
    const saveBtn = document.querySelector('.btn-save-peso');
    if (saveBtn) {
      saveBtn.removeEventListener('click', saveBtn._handler);
      saveBtn._handler = () => {
        const val = document.getElementById('peso-input-field').value;
        const obs = document.getElementById('peso-obs').value;
        if (_currentTipo && typeof _currentIdx === 'number') {
          const arr = getArrayByType(_currentTipo);
          const p = arr[_currentIdx];
          if (p) {
            p.pesado = true;
            p.peso = (val ? `${val} kg` : p.peso || '0 kg');
            p.observacoes = obs || p.observacoes;
          }
        }
        hideModals();
        const container = document.getElementById('view-painel');
        if (container) container.innerHTML = render();
        attachModalHandlers();
      };
      saveBtn.addEventListener('click', saveBtn._handler);
    }
  }

  function openDetalhes(type, idx) {
    const arr = getArrayByType(type);
    const p = arr[idx];
    if (!p) return;
    _currentTipo = type; _currentIdx = idx;

    const modal = document.getElementById('modal-detalhes');
    if (!modal) return;
    modal.style.display = 'flex';

    const populate = (data) => {
      const formatDate = (value) => {
        if (!value) return '';
        if (typeof value.toDate === 'function') {
          return value.toDate().toLocaleDateString('pt-BR') + ' às ' + value.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return String(value);
      };

      const labelDate = data.data || data.dataColeta || data.dataConclusao || formatDate(data.dataCriacao) || '';
      modal.querySelector('.modal-header-info .title').textContent = data.nome || '—';
      modal.querySelector('.modal-header-info .sub').textContent = labelDate;
      const statusText = data.status ? String(data.status).replace(/(^|\s)\S/g, t => t.toUpperCase()) : (data.pesado ? 'Pesado' : (data.dataColeta ? 'Coletado' : 'Aguardando coleta'));
      modal.querySelector('.s-val').textContent = statusText;
      modal.querySelector('.meta-info').textContent = 'Criado em ' + (formatDate(data.dataCriacao) || data.data || data.dataColeta || data.dataConclusao || '—');
      modal.querySelector('.cnpj').textContent = data.documento || data.cnpj || '—';
      modal.querySelector('.responsavel').textContent = data.responsavel || data.documento || '—';
      modal.querySelector('.email').textContent = data.email || '—';
      modal.querySelector('.telefone').textContent = data.telefone || '—';
      modal.querySelector('.endereco').textContent = data.endereco || '—';
      modal.querySelector('.observacoes').textContent = data.observacoes || '—';

      const residuosContainer = modal.querySelector('.residuos-container');
      residuosContainer.innerHTML = '';
      if (data.residuos && data.residuos.length) {
        data.residuos.forEach(r => {
          const item = document.createElement('div');
          item.className = 'residuo-item';
          item.innerHTML = `<div class="residuo-icon"><i class="ti ti-cpu" aria-hidden="true"></i></div>
            <div class="residuo-info"><div class="rname">${r.descricao}</div><div class="rqtd">Qtd. estimada: ${r.qtd || '—'}</div></div>
            <span class="residuo-badge">~${(r.peso || '0')} kg est.</span>`;
          residuosContainer.appendChild(item);
        });
      } else {
        residuosContainer.innerHTML = '<div class="info-value">Nenhum item informado.</div>';
      }
    };

    if (p.docId) {
      firebase.firestore().collection('coletas').doc(p.docId).get()
        .then(snapshot => {
          if (!snapshot.exists) {
            populate(p);
            return;
          }
          populate({ docId: snapshot.id, ...snapshot.data(), nome: p.nome, endereco: p.endereco, data: p.data, dataColeta: p.dataColeta, dataConclusao: p.dataConclusao, peso: p.peso, status: p.status || 'agendada' });
        })
        .catch(() => {
          populate(p);
        });
    } else {
      populate(p);
    }
  }

  function openPeso(type, idx) {
    const arr = getArrayByType(type);
    const p = arr[idx];
    if (!p) return;
    _currentTipo = type; _currentIdx = idx;
    const modal = document.getElementById('modal-peso');
    if (!modal) return;
    modal.style.display = 'flex';
    // header sub
    modal.querySelector('.modal-header-info .sub').textContent = p.nome || '';
    // aviso: mostrar se não pesado
    const aviso = document.getElementById('peso-aviso');
    if (aviso) aviso.style.display = p.pesado ? 'none' : 'flex';
    // input de peso
    const pesoInput = document.getElementById('peso-input-field');
    if (pesoInput) pesoInput.value = p.peso ? String(p.peso).replace(' kg','') : '';
    // footer meta (local)
    const footerMeta = document.getElementById('peso-footer-meta');
    if (footerMeta) footerMeta.innerHTML = '<i class="ti ti-map-pin" style="font-size:13px;vertical-align:-2px;margin-right:4px" aria-hidden="true"></i>' + (p.dataColeta ? ('Coletado em ' + p.dataColeta + ' · ') : '') + (p.endereco || '—');
  }

  function hideModals() {
    const md = document.getElementById('modal-detalhes');
    const mp = document.getElementById('modal-peso');
    if (md) md.style.display = 'none';
    if (mp) mp.style.display = 'none';
    _currentTipo = null; _currentIdx = null;
  }

  // ── Alteração 3: Exportação ajustada para expor tanto o render antigo quanto a nova função de carga ──
  return { 
    render, 
    carregarDadosERenderizar 
  };

})();