// Estado inicial
let state = {
  loja: {
    nome: "",
    telefone: "",
    pix: "",
    banco: "",
    endereco: "",
    logo: "",
    horarios: "",
    corPrimaria: "#3498db",
    corSecundaria: "#95a5a6",
    fundo: "",
    botaoCarrinho: "",
    modoEscuro: false,
    musicaAmbiente: ""
  },
  categorias: [],
  subcategorias: [],
  modosVenda: [],
  produtos: [],
  clientes: [],
  cupons: [],
  publicidade: {
    banner: { texto: "", imagem: "", link: "" },
    carrossel: [],
    redesSociais: { instagram: "", facebook: "", whatsapp: "" }
  },
  cobertura: []
};

let produtoEditandoIndex = null;

// Navegação entre abas
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#menu-bar li");
  const tabs = document.querySelectorAll(".tab");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-tab");

      // Remove 'active' de todas as abas e botões
      tabs.forEach(tab => tab.classList.remove("active"));
      menuItems.forEach(btn => btn.classList.remove("active"));

      // Ativa a aba correspondente e o botão
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
        item.classList.add("active");
      }
    });
  });

  // Ativa a primeira aba por padrão
  const firstTab = document.querySelector(".tab");
  if (firstTab) firstTab.classList.add("active");
});

// LocalStorage
function salvarLocal() {
  localStorage.setItem("painelState", JSON.stringify(state));
  alert("💾 Salvo localmente!");
}

function carregarLocal() {
  const saved = localStorage.getItem("painelState");
  if (saved) {
    state = JSON.parse(saved);
    atualizarCategoriasUI();
    atualizarModosVendaUI();
    atualizarProdutosUI();
    atualizarPreview();
  }
}

// Publicar no JSONBin
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();

  if (!binId || !masterKey) {
    alert("⚠️ Configure o JSONBin ID e a Master Key");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": masterKey
    },
    body: JSON.stringify(state)
  })
    .then(res => res.json())
    .then(json => alert("✅ Publicado com sucesso!"))
    .catch(() => alert("❌ Erro ao publicar."));
}

// Restaurar padrão
function restaurarPadrao() {
  if (confirm("Tem certeza que deseja restaurar o painel?")) {
    localStorage.removeItem("painelState");
    location.reload();
  }
}

// CRUD - Categorias
const btnAdicionarCategoria = document.getElementById("btnAdicionarCategoria");
const inputCategoria = document.getElementById("novaCategoria");
const categoryTree = document.getElementById("category-tree");
const selectProdCategoria = document.getElementById("prodCategoria");

btnAdicionarCategoria.addEventListener("click", () => {
  const nome = inputCategoria.value.trim();
  if (!nome) return alert("⚠️ Digite um nome de categoria!");
  state.categorias.push({ nome });
  inputCategoria.value = "";
  atualizarCategoriasUI();
  salvarLocal();
  atualizarPreview();
});

function atualizarCategoriasUI() {
  categoryTree.innerHTML = state.categorias
    .map((c, i) => `
      <div class="categoria">
        ${c.nome}
        <button onclick="removerCategoria(${i})" class="btn-danger">X</button>
      </div>
    `)
    .join("");

  selectProdCategoria.innerHTML = state.categorias
    .map(c => `<option value="${c.nome}">${c.nome}</option>`)
    .join("");
}

function removerCategoria(index) {
  if (confirm("Excluir categoria?")) {
    state.categorias.splice(index, 1);
    atualizarCategoriasUI();
    salvarLocal();
    atualizarPreview();
  }
}

// CRUD - Modo de Venda
const btnAdicionarModoVenda = document.getElementById("btnAdicionarModoVenda");
const inputModoVenda = document.getElementById("novoModoVenda");
const modoVendaLista = document.getElementById("modoVendaLista");
const selectProdModoVenda = document.getElementById("prodModoVenda");

btnAdicionarModoVenda.addEventListener("click", () => {
  const modo = inputModoVenda.value.trim();
  if (!modo) return alert("⚠️ Digite um modo de venda!");
  state.modosVenda.push(modo);
  inputModoVenda.value = "";
  atualizarModosVendaUI();
  salvarLocal();
});

function atualizarModosVendaUI() {
  modoVendaLista.innerHTML = state.modosVenda
    .map((m, i) => `
      <div class="categoria">
        ${m}
        <button onclick="removerModoVenda(${i})" class="btn-danger">X</button>
      </div>
    `)
    .join("");

  selectProdModoVenda.innerHTML = state.modosVenda
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");
}

function removerModoVenda(index) {
  if (confirm("Excluir modo de venda?")) {
    state.modosVenda.splice(index, 1);
    atualizarModosVendaUI();
    salvarLocal();
  }
}

// CRUD - Produtos
const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
const listaProdutosContainer = document.getElementById("listaProdutosContainer");

btnAdicionarProduto.addEventListener("click", () => {
  const produto = {
    nome: document.getElementById("prodNome").value,
    preco: parseFloat(document.get    atualizarProdutosUI();
    atualizarPreview();
  }
}

// Publicar no JSONBin
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();

  if (!binId || !masterKey) {
    alert("⚠️ Configure o JSONBin ID e a Master Key");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": masterKey
    },
    body: JSON.stringify(state)
  })
    .then(res => res.json())
    .then(json => alert("✅ Publicado com sucesso!"))
    .catch(() => alert("❌ Erro ao publicar."));
}

// Restaurar padrão
function restaurarPadrao() {
  if (confirm("Tem certeza que deseja restaurar o painel?")) {
    localStorage.removeItem("painelState");
    location.reload();
  }
}

// CRUD - Categorias
const btnAdicionarCategoria = document.getElementById("btnAdicionarCategoria");
const inputCategoria = document.getElementById("novaCategoria");
const categoryTree = document.getElementById("category-tree");
const selectProdCategoria = document.getElementById("prodCategoria");

btnAdicionarCategoria.addEventListener("click", () => {
  const nome = inputCategoria.value.trim();
  if (!nome) return alert("⚠️ Digite um nome de categoria!");
  state.categorias.push({ nome });
  inputCategoria.value = "";
  atualizarCategoriasUI();
  salvarLocal();
  atualizarPreview();
});

function atualizarCategoriasUI() {
  categoryTree.innerHTML = state.categorias
    .map((c, i) => `
      <div class="categoria">
        ${c.nome}
        <button onclick="removerCategoria(${i})" class="btn-danger">X</button>
      </div>
    `)
    .join("");

  selectProdCategoria.innerHTML = state.categorias
    .map(c => `<option value="${c.nome}">${c.nome}</option>`)
    .join("");
}

function removerCategoria(index) {
  if (confirm("Excluir categoria?")) {
    state.categorias.splice(index, 1);
    atualizarCategoriasUI();
    salvarLocal();
    atualizarPreview();
  }
}

// CRUD - Modo de Venda
const btnAdicionarModoVenda = document.getElementById("btnAdicionarModoVenda");
const inputModoVenda = document.getElementById("novoModoVenda");
const modoVendaLista = document.getElementById("modoVendaLista");
const selectProdModoVenda = document.getElementById("prodModoVenda");

btnAdicionarModoVenda.addEventListener("click", () => {
  const modo = inputModoVenda.value.trim();
  if (!modo) return alert("⚠️ Digite um modo de venda!");
  state.modosVenda.push(modo);
  inputModoVenda.value = "";
  atualizarModosVendaUI();
  salvarLocal();
});

function atualizarModosVendaUI() {
  modoVendaLista.innerHTML = state.modosVenda
    .map((m, i) => `
      <div class="categoria">
        ${m}
        <button onclick="removerModoVenda(${i})" class="btn-danger">X</button>
      </div>
    `)
    .join("");

  selectProdModoVenda.innerHTML = state.modosVenda
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");
}

function removerModoVenda(index) {
  if (confirm("Excluir modo de venda?")) {
    state.modosVenda.splice(index, 1);
    atualizarModosVendaUI();
    salvarLocal();
  }
}

// CRUD - Produtos
const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
const listaProdutosContainer = document.getElementById("listaProdutosContainer");

btnAdicionarProduto.addEventListener("click", () => {
  const produto = {
    nome: document.getElementById("prodNome").value,
    preco: parseFloat(document.getElementById("prodPreco").value) || 0,
    imagem: document.getElementById("prodImagem").value,
    descricao: document.getElementById("prodDescricao").value,
    categoria: document.getElementById("prodCategoria").value,
    subcategoria: document.getElementById("prodSubcategoria").value,
    modoVenda: document.getElementById("prodModoVenda").value,
    estoque: parseInt(document.getElementById("prodEstoque").value) || 0,
    destaque: document.getElementById("prodDestaque").checked,
    ativo: document.getElementById("prodAtivo").checked
  };

  if (!produto.nome || produto.preco <= 0) {
    return alert("⚠️ Nome e preço obrigatórios!");
  }

  if (produtoEditandoIndex !== null) {
    state.produtos[produtoEditandoIndex] = produto;
    produtoEditandoIndex = null;
    btnAdicionarProduto.textContent = "Adicionar Produto";
  } else {
    state.produtos.push(produto);
  }

  limparFormularioProduto();
  atualizarProdutosUI();
  salvarLocal();
  atualizarPreview();
});

function limparFormularioProduto() {
  document.getElementById("prodNome").value = "";
  document.getElementById("prodPreco").value = "";
  document.getElementById("prodImagem").value = "";
  document.getElementById("prodDescricao").value = "";
  document.getElementById("prodCategoria").value = "";
  document.getElementById("prodSubcategoria").value = "";
  document.getElementById("prodModoVenda").value = "";
  document.getElementById("prodEstoque").value = "";
  document.getElementById("prodDestaque").checked = false;
  document.getElementById("prodAtivo").checked = false;
}

function atualizarProdutosUI() {
  listaProdutosContainer.innerHTML = state.produtos
    .map((p, i) => `
      <div class="produto-card">
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="info">
          <h3>${p.nome}</h3>
          <p>R$ ${p.preco.toFixed(2)}</p>
          <p>${p.categoria}</p>
        </div>
        <div class="actions">
          <button onclick="editarProduto(${i})" class="btn-secondary">✏️ Editar</button>
          <button onclick="removerProduto(${i})" class="btn-danger">🗑️ Excluir</button>
        </div>
      </div>
    `)
    .join("");
}
function atualizarPreview() {
  const iframe = document.getElementById("previewIframe");
  iframe.srcdoc = gerarTotemHTML();
}

function gerarTotemHTML() {
  return `
    <html>
      <head>
        <title>${state.loja.nome}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: ${state.loja.fundo || "#fff"};
            color: ${state.loja.modoEscuro ? "#eee" : "#333"};
            padding: 20px;
          }
          .produto {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }
          .produto img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <h1>${state.loja.nome}</h1>
        <h2>Produtos:</h2>
        ${state.produtos
          .map(
            p => `
          <div class="produto">
            <img src="${p.imagem}" alt="${p.nome}">
            <div>
              <strong>${p.nome}</strong><br>
              R$ ${p.preco.toFixed(2)}<br>
              ${p.descricao}
            </div>
          </div>
        `
          )
          .join("")}
      </body>
    </html>
  `;
}
window.onload = () => {
  carregarLocal();
  atualizarCategoriasUI();
  atualizarModosVendaUI();
  atualizarProdutosUI();
  atualizarPreview();
};
window.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const menuItems = document.querySelectorAll("#menu-bar li");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-tab");
      tabs.forEach(tab => tab.classList.remove("active"));
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
      }

      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Ativa a primeira aba por padrão
  const firstTab = document.querySelector(".tab");
  if (firstTab) firstTab.classList.add("active");
});
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#menu-bar li");
  const tabs = document.querySelectorAll("main > section.tab");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-tab");

      // Remove 'active' de todas as abas e botões
      tabs.forEach(tab => tab.classList.remove("active"));
      menuItems.forEach(btn => btn.classList.remove("active"));

      // Ativa a aba correspondente e o botão
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
        item.classList.add("active");
      }
    });
  });
});
