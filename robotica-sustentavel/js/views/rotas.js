/* =============================================================
   views/rotas.js — Painel de rotas de coleta
   ============================================================= */

const RotasView = (() => {

  /* ── Dados de exemplo ── */

  const partidaBase = {
    label: 'Ponto de partida',
    endereco: 'R. Equador, 44 — Previdência, Fortaleza',
    distancia: '—',
  };

  const paradas = [
    {
      num: 1,
      endereco: 'Av. Beira Mar, 3000 — Meireles (InfoTech Soluções)',
      distancia: '4,2 km',
    },
    {
      num: 2,
      endereco: 'R. Nogueira Acioli, 120 — Aldeota (C. E. Martins)',
      distancia: '+2,7 km',
    },
    {
      num: 3,
      endereco: 'R. Padre Mororó, 38 — Centro (E.E. Menezes Pimentel)',
      distancia: '+3,5 km',
    },
  ];

  const resumo = {
    distancia:    '10,4 km',
    tempo:        '~35 min',
    combustivel:  '~1,2 L',
    coletas:      3,
  };

  /* Monta a URL do Google Maps com todas as paradas */
  function buildMapsUrl() {
    const base    = encodeURIComponent(partidaBase.endereco + ', Fortaleza');
    const destinos = paradas
      .map(p => encodeURIComponent(p.endereco.split('(')[0].trim() + ', Fortaleza'))
      .join('/');
    return `https://www.google.com/maps/dir/${base}/${destinos}`;
  }

  /** Retorna o HTML completo da view de rotas */
  function render() {
    const stopsHtml = paradas.map(p => `
      <div class="stop-item">
        <div class="stop-num">${p.num}</div>
        <div class="stop-addr">${p.endereco}</div>
        <div class="stop-dist">${p.distancia}</div>
      </div>
    `).join('');

    return `
      <div class="view-header">
        <h2>Rotas de coleta</h2>
        <p>Otimize o trajeto do dia para economizar combustível</p>
      </div>

      <div class="route-controls">
        <h3>
          <i class="ti ti-list-numbers" aria-hidden="true"
             style="font-size:15px; vertical-align:-2px; margin-right:6px"></i>
          Paradas do dia — 28/06/2026
        </h3>

        <div class="stop-list">

          <!-- Ponto de partida -->
          <div class="stop-item">
            <div class="stop-num">P</div>
            <div class="stop-addr">
              <strong>Ponto de partida:</strong> ${partidaBase.endereco}
            </div>
            <div class="stop-dist">${partidaBase.distancia}</div>
          </div>

          ${stopsHtml}
        </div>

        <div class="route-actions">
          <button class="btn btn-primary btn-sm">
            <i class="ti ti-route" aria-hidden="true"></i> Recalcular rota
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="ti ti-plus" aria-hidden="true"></i> Adicionar parada
          </button>
        </div>
      </div>

      <div class="route-map">
        <div class="map-placeholder">
          <i class="ti ti-map-2" aria-hidden="true"></i>
          <p style="font-weight:500; color:var(--rs-green-dark)">Rota otimizada disponível</p>
          <p>${paradas.length} paradas · percurso circular</p>
          <button class="open-map-btn" onclick="window.open('${buildMapsUrl()}', '_blank')">
            <i class="ti ti-external-link" aria-hidden="true"></i> Abrir no Google Maps
          </button>
        </div>
      </div>

      <div class="route-summary">
        <div class="route-stat">
          <div class="rs-v">${resumo.distancia}</div>
          <div class="rs-l">distância total</div>
        </div>
        <div class="route-stat">
          <div class="rs-v">${resumo.tempo}</div>
          <div class="rs-l">tempo estimado</div>
        </div>
        <div class="route-stat">
          <div class="rs-v">${resumo.combustivel}</div>
          <div class="rs-l">combustível est.</div>
        </div>
        <div class="route-stat">
          <div class="rs-v">${resumo.coletas} coletas</div>
          <div class="rs-l">no percurso</div>
        </div>
      </div>
    `;
  }

  return { render };

})();
