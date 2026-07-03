/* =============================================================
   views/declaracao.js — Modelo de declaração de destinação
   ============================================================= */

const DeclaracaoView = (() => {

  let coletasConcluidas = [];
  let coletaSelecionada = null;

  const doc = {
    numero:          '2026/034',
    dataEmissao:     '20/06/2026',
    dataColeta:      '20/06/2026',
    condutor:        'Marcos Andrade',

    gerador: {
      razaoSocial:  'Universidade de Fortaleza — UNIFOR',
      cnpj:         '07.227.851/0001-17',
      endereco:     'Av. Washington Soares, 1321 — Edson Queiroz',
      responsavel:  'Dr. Antônio Pinheiro',
      email:        'ambiental@unifor.br',
      telefone:     '(85) 3477-3000',
    },

    residuos: [
      { descricao: 'Computadores (CPU + monitor)', qtd: 22, peso: 66.0,  destino: 'Desmontagem e reciclagem' },
      { descricao: 'Notebooks e tablets',          qtd: 18, peso: 27.0,  destino: 'Desmontagem e reciclagem' },
      { descricao: 'Impressoras e periféricos',    qtd: 14, peso: 56.0,  destino: 'Desmontagem e reciclagem' },
      { descricao: 'Baterias e fontes',            qtd: 10, peso: 33.5,  destino: 'Reciclagem especializada' },
    ],
  };

  /** Calcula o peso total dos resíduos */
  function totalPeso() {
    return doc.residuos.reduce((sum, r) => sum + r.peso, 0).toFixed(1);
  }

  /** Gera as linhas da tabela de resíduos */
  function renderLinhasResiduos() {
    return doc.residuos.map(r => `
      <tr>
        <td>${r.descricao}</td>
        <td>${r.qtd}</td>
        <td>${r.peso.toFixed(1)}</td>
        <td>${r.destino}</td>
      </tr>
    `).join('');
  }

  /** Retorna o HTML completo da view de declaração */
  function render() {
    const g = doc.gerador;

    return `
      <div class="view-header">
        <h2>Declaração de destinação</h2>
        <p>Documento para coletas concluídas</p>
      </div>

      <div class="decl-selector-card">
        <div class="decl-selector-label">
          <i class="ti ti-circle-check" aria-hidden="true"></i>
          Coleta concluída
        </div>
        <div class="decl-selector-row">
          <select id="decl-select" class="decl-select">
            <option value="">Selecione uma coleta concluída...</option>
            <option value="1">#2026/034 — Universidade de Fortaleza (UNIFOR) · 20/06/2026</option>
            <option value="2">#2026/033 — Banco BNB — Agência Centro · 18/06/2026</option>
            <option value="3">#2026/031 — Clínica Saúde Digital Ltda · 15/06/2026</option>
          </select>
        </div>
      </div>

      <div class="decl-container">

        <!-- Barra superior -->
        <div class="decl-topbar">
          <h3>
            <i class="ti ti-file-certificate" aria-hidden="true"
               style="font-size:16px; vertical-align:-2px; margin-right:7px"></i>
            Pré-visualização do documento
          </h3>
          <div class="decl-topbar-actions">
            <button class="btn btn-ghost btn-sm"
                    style="color:#fff; border-color:rgba(255,255,255,0.3)"
                    onclick="window.print()">
              <i class="ti ti-printer" aria-hidden="true"></i> Imprimir
            </button>
            <button class="btn btn-amber btn-sm">
              <i class="ti ti-download" aria-hidden="true"></i> Baixar PDF
            </button>
          </div>
        </div>

        <!-- Corpo do documento -->
        <div class="decl-preview">

          <!-- Cabeçalho do documento -->
          <div class="decl-header">
            <div class="decl-logo-block">
              <div class="inst">Robótica <span>Sustentável</span></div>
              <div class="sub">
                CNPJ: 00.000.000/0001-00 · contato@roboticasustentavel.com.br<br>
                Fortaleza — CE
              </div>
            </div>
            <div class="decl-title-block">
              <div class="title">Declaração de Destinação Ambientalmente Adequada</div>
              <div class="num">Nº ${doc.numero} · emitida em ${doc.dataEmissao}</div>
            </div>
          </div>

          <!-- Corpo -->
          <div class="decl-body">

            <p style="margin-bottom:12px">
              O Instituto <strong>Robótica Sustentável</strong>, por meio deste documento, declara
              que recebeu, coletou e encaminhou para destinação ambientalmente adequada os resíduos
              eletroeletrônicos descritos abaixo, em conformidade com a
              <strong>Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010)</strong>
              e demais normas vigentes.
            </p>

            <h4>Dados do gerador</h4>
            <div class="decl-info-box">
              <div><strong>Razão social:</strong> ${g.razaoSocial}</div>
              <div><strong>CNPJ:</strong> ${g.cnpj}</div>
              <div><strong>Endereço:</strong> ${g.endereco}</div>
              <div><strong>Responsável:</strong> ${g.responsavel}</div>
              <div><strong>E-mail:</strong> ${g.email}</div>
              <div><strong>Telefone:</strong> ${g.telefone}</div>
            </div>

            <h4>Resíduos coletados</h4>
            <table class="decl-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Qtd.</th>
                  <th>Peso (kg)</th>
                  <th>Destino final</th>
                </tr>
              </thead>
              <tbody>
                ${renderLinhasResiduos()}
                <tr>
                  <td colspan="2" style="text-align:right; font-weight:500">Total</td>
                  <td style="font-weight:500">${totalPeso()} kg</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>

            <p style="margin-bottom:14px; font-size:12px">
              Data da coleta: <strong>${doc.dataColeta}</strong> ·
              Condutor responsável: <strong>${doc.condutor}</strong>
            </p>

            <!-- Assinatura -->
            <div class="decl-sig">
              <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-name">
                  ${g.responsavel}<br>
                  <span>Representante do gerador</span>
                </div>
              </div>
            </div>

            <div class="decl-footer">
              Este documento tem validade legal para fins de comprovação de destinação
              ambientalmente adequada de resíduos eletroeletrônicos.<br>
              Robótica Sustentável · Fortaleza, CE · www.roboticasustentavel.com.br
            </div>

          </div>
        </div>
      </div>
    `;
  }

  /* ── Carregamento das coletas concluídas e comportamento do select ── */
  function carregarDadosERenderizar() {
    const container = document.getElementById('view-declaracao');
    if (!container) return;

    container.innerHTML = render();
    // busca coletas com status 'concluida' e popula o select
    firebase.firestore().collection('coletas').where('status', '==', 'concluida').get()
      .then(qs => {
        coletasConcluidas = [];
        qs.forEach(s => {
          const d = s.data();
          coletasConcluidas.push({
            docId: s.id,
            nome: d.nome || (d.gerador && d.gerador.razaoSocial) || 'Sem nome',
            endereco: d.endereco || (d.gerador && d.gerador.endereco) || '',
            dataColeta: d.dataColeta ? (typeof d.dataColeta.toDate === 'function' ? d.dataColeta.toDate().toLocaleDateString('pt-BR') : d.dataColeta) : '',
            gerador: d.gerador || {},
            residuos: d.residuos || [],
            documento: d.documento || d.cnpj || ''
          });
        });
        populateSelect();
        attachSelectHandler();
      })
      .catch(err => {
        console.error('Erro ao carregar coletas concluídas:', err);
        populateSelect();
        attachSelectHandler();
      });
  }

  function populateSelect() {
    const select = document.getElementById('decl-select');
    if (!select) return;
    // mantém opção placeholder e adiciona as coletas carregadas
    select.innerHTML = '<option value="">Selecione uma coleta concluída...</option>';
    coletasConcluidas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.docId;
      opt.textContent = `${c.nome} · ${c.dataColeta || ''}`.trim();
      select.appendChild(opt);
    });
  }

  function attachSelectHandler() {
    const select = document.getElementById('decl-select');
    if (!select) return;
    select.removeEventListener('change', select._handler);
    select._handler = (e) => {
      const id = e.target.value;
      if (!id) {
        // sem seleção: mantém o documento padrão
        renderContainer();
        return;
      }
      // tenta encontrar nos já carregados
      const found = coletasConcluidas.find(c => c.docId === id);
      if (found) {
        // popula doc a partir do registro encontrado
        doc.dataColeta = found.dataColeta || doc.dataColeta;
        doc.condutor = found.condutor || doc.condutor;
        doc.gerador = Object.keys(found.gerador || {}).length ? found.gerador : {
          razaoSocial: found.nome,
          cnpj: found.documento || '',
          endereco: found.endereco || '',
          responsavel: found.nome,
          email: found.email || '',
          telefone: found.telefone || ''
        };
        doc.residuos = found.residuos || [];
        renderContainer();
        return;
      }

      // fallback: busca documento completo no Firestore
      firebase.firestore().collection('coletas').doc(id).get()
        .then(snap => {
          if (!snap.exists) return;
          const d = snap.data();
          doc.dataColeta = d.dataColeta ? (typeof d.dataColeta.toDate === 'function' ? d.dataColeta.toDate().toLocaleDateString('pt-BR') : d.dataColeta) : doc.dataColeta;
          doc.condutor = d.condutor || doc.condutor;
          doc.gerador = d.gerador || doc.gerador;
          doc.residuos = d.residuos || [];
          renderContainer();
        })
        .catch(err => console.error('Erro ao buscar coleta:', err));
    };
    select.addEventListener('change', select._handler);
  }

  function renderContainer() {
    const container = document.getElementById('view-declaracao');
    if (!container) return;
    container.innerHTML = render();
    populateSelect();
    attachSelectHandler();
  }

  return { render, carregarDadosERenderizar };

})();
