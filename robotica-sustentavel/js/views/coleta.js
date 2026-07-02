/* =============================================================
   views/coleta.js — Formulário de solicitação de coleta
   ============================================================= */

const ColetaView = (() => {

  /** Retorna o HTML completo da view de coleta */
  function render() {
    return `
      <div class="view-header">
        <h2>Solicitar coleta</h2>
        <p>Preencha o formulário para agendar uma coleta de resíduos eletrônicos</p>
      </div>

      <div class="form-grid">

        <div class="form-group">
          <label for="c-nome">Nome completo / empresa</label>
          <input id="c-nome" type="text" placeholder="João Silva ou Tech Ltda">
        </div>

        <div class="form-group">
          <label for="c-doc">CPF / CNPJ</label>
          <input id="c-doc" type="text" placeholder="000.000.000-00">
        </div>

        <div class="form-group">
          <label for="c-email">E-mail</label>
          <input id="c-email" type="email" placeholder="contato@empresa.com">
        </div>

        <div class="form-group">
          <label for="c-tel">Telefone / WhatsApp</label>
          <input id="c-tel" type="tel" placeholder="(85) 9 0000-0000">
        </div>

        <div class="form-group full">
          <label for="c-endereco">Endereço completo para coleta</label>
          <input id="c-endereco" type="text" placeholder="Rua, número, bairro, cidade — CEP">
        </div>

        <div class="form-group full">
          <label for="c-obs">Observações sobre os resíduos</label>
          <textarea id="c-obs" placeholder="Descreva os itens a serem coletados (computadores, celulares, baterias, etc.)"></textarea>
        </div>

        <div class="form-group full">
          <label>
            Foto do resíduo
            <span style="color:#aaa; font-weight:400">(opcional)</span>
          </label>
          <div class="upload-area" onclick="ColetaView.triggerUpload()">
            <i class="ti ti-photo-up" aria-hidden="true"></i>
            <span class="upload-hint">Arraste ou clique para enviar uma foto</span>
            <div class="upload-opt">JPG, PNG ou HEIF — máx. 10 MB</div>
            <input id="c-foto" type="file" accept="image/*" style="display:none"
                   onchange="ColetaView.previewPhoto(this)">
          </div>
          <div id="c-foto-preview"></div>
        </div>

      </div>

      <div class="form-actions">
        <button class="btn btn-ghost" onclick="ColetaView.limpar()">Limpar</button>
        <button class="btn btn-primary" onclick="ColetaView.agendar()">
          <i class="ti ti-calendar-check" aria-hidden="true"></i> Agendar coleta
        </button>
      </div>
    `;
  }

  /** Abre o seletor de arquivo nativo */
  function triggerUpload() {
    document.getElementById('c-foto')?.click();
  }

  /** Mostra pré-visualização da imagem selecionada */
  function previewPhoto(input) {
    const preview = document.getElementById('c-foto-preview');
    if (!input.files || !input.files[0] || !preview) return;

    const url = URL.createObjectURL(input.files[0]);
    preview.innerHTML = `
      <img src="${url}" alt="Pré-visualização do resíduo"
           style="max-height:120px; border-radius:8px; margin-top:8px; border:1px solid var(--rs-border)">
    `;
  }

  /** Limpa todos os campos do formulário */
  function limpar() {
    ['c-nome', 'c-doc', 'c-email', 'c-tel', 'c-endereco', 'c-obs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const preview = document.getElementById('c-foto-preview');
    if (preview) preview.innerHTML = '';
  }

  /** Valida e envia o agendamento para o Firebase */
  function agendar() {
    const nome = document.getElementById('c-nome')?.value.trim();
    const docIdent = document.getElementById('c-doc')?.value.trim(); // Ajustado para pegar o CPF/CNPJ
    const email = document.getElementById('c-email')?.value.trim();
    const tel = document.getElementById('c-tel')?.value.trim();
    const endereco = document.getElementById('c-endereco')?.value.trim();
    const obs = document.getElementById('c-obs')?.value.trim();

    if (!nome || !email || !endereco) {
      alert('Preencha pelo menos nome, e-mail e endereço para agendar.');
      return;
    }

    // Muda o texto do botão para dar feedback ao usuário
    const btn = event.target;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> Agendando...';
    btn.disabled = true;

    // Salva no Firestore na coleção "coletas"
    firebase.firestore().collection("coletas").add({
      nome: nome,
      documento: docIdent,
      email: email,
      telefone: tel,
      endereco: endereco,
      observacoes: obs,
      status: "agendada", // Adicionamos um status inicial
      dataCriacao: firebase.firestore.FieldValue.serverTimestamp() // Data atual do servidor
    })
      .then((docRef) => {
        alert(`Coleta agendada com sucesso!\nID: ${docRef.id}`);
        limpar();
      })
      .catch((error) => {
        console.error("Erro ao agendar: ", error);
        alert("Ocorreu um erro ao agendar. Tente novamente.");
      })
      .finally(() => {
        // Restaura o botão
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
      });
  }

  return { render, triggerUpload, previewPhoto, limpar, agendar };

})();
