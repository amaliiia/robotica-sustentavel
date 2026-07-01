/* =============================================================
   views/declaracao.js — Modelo de declaração de destinação
   ============================================================= */

const DeclaracaoView = (() => {

  /* ── Dados do documento de exemplo ── */

  const doc = {
    numero:          '2026/034',
    dataEmissao:     '20/06/2026',
    dataColeta:      '20/06/2026',
    condutor:        'Marcos Andrade',
    veiculo:         'VW Delivery — ABC-1234',

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
              Condutor responsável: <strong>${doc.condutor}</strong> ·
              Veículo: <strong>${doc.veiculo}</strong>
            </p>

            <!-- Assinaturas -->
            <div class="decl-sig">
              <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-name">
                  ${g.responsavel}<br>
                  <span>Representante do gerador</span>
                </div>
              </div>
              <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-name">
                  ${doc.condutor}<br>
                  <span>Resp. pela coleta — Robótica Sustentável</span>
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

  return { render };

})();
