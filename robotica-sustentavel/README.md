# Robótica Sustentável — Painel de Monitoramento

Sistema de monitoramento para instituto de reciclagem de resíduos eletrônicos.

---

## Estrutura do projeto

```
robotica-sustentavel/
│
├── index.html                  # Ponto de entrada — monta o layout e carrega os módulos
│
├── css/
│   ├── base.css                # Variáveis de cor, reset, tipografia, botões, formulários, badges, tabs
│   ├── sidebar.css             # Barra lateral e itens de navegação
│   ├── components.css          # Cards de métricas, cards de pedido, painel de rotas, declaração
│   └── views.css               # Layout da área de conteúdo e cabeçalhos de view
│
└── js/
    ├── app.js                  # Controlador principal: navegação entre views e inicialização
    └── views/
        ├── coleta.js           # Formulário de solicitação de coleta
        ├── painel.js           # Painel de controle com abas (agendadas / coletadas / concluídas)
        ├── rotas.js            # Painel de rotas com integração ao Google Maps
        └── declaracao.js       # Modelo de declaração de destinação ambientalmente adequada
```

---

## Como usar

Abra `index.html` diretamente no navegador — não é necessário servidor.

> **Nota:** a funcionalidade de upload de foto (`ColetaView`) usa `URL.createObjectURL`,
> que funciona em todos os navegadores modernos sem configuração adicional.

---

## Módulos JavaScript

Cada módulo segue o padrão **IIFE** (`(() => { ... })()`), expondo apenas uma API pública:

| Módulo            | API pública                                              |
|-------------------|----------------------------------------------------------|
| `App`             | `init()`, `showView(id)`, `showTab(id)`                  |
| `ColetaView`      | `render()`, `triggerUpload()`, `previewPhoto()`, `limpar()`, `agendar()` |
| `PainelView`      | `render()`                                               |
| `RotasView`       | `render()`                                               |
| `DeclaracaoView`  | `render()`                                               |

---

## Próximos passos sugeridos

- **Backend:** integrar `ColetaView.agendar()` com uma API REST para persistir os pedidos
- **PDF real:** usar uma biblioteca como `jsPDF` no botão "Baixar PDF" da declaração
- **Rotas dinâmicas:** conectar a API do Google Maps Directions para calcular percursos reais
- **Autenticação:** adicionar tela de login antes de exibir o painel
