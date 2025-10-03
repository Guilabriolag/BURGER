// ===============================
// Painel Administrativo - painel.js
// ===============================

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

// ===============================
// Navegação entre abas
// ===============================
const tabs = document.querySelectorAll(".tab");
const menuItems = document.querySelectorAll("#menu-bar li");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// ===============================
// LocalStorage
// ===============================
function salvarLocal() {
  localStorage.setItem("painelState", JSON.stringify(state));
  alert("💾 Salvo localmente!");
}

function carregarLocal() {
  const saved = localStorage.getItem("painelState");
  if (saved) {
    state = JSON.parse(saved);
    atualizarCategoriasUI();
    atualizarProdutosUI();
    atualizarPreview();
  }
}

// ===============================
// Publicar no JSONBin
// ===============================
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

// ===============================
// Restaurar padrão
// ===============================
function restaurarPadrao() {
  const senha = prompt("Senha para restaurar padrão:");
  if (senha !== "1234") {
    alert("❌ Senha incorreta");
    return;
  }
  state = {
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
  salvarLocal();
  atualizarCategoriasUI();
  atualizarProdutosUI();
  atualizarPreview();
}

// ===============================
// CRUD - Categorias
// ===============================
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

// ===============================
// CRUD - Produtos
// ===============================
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

function editarProduto(index) {
  const p = state.produtos[index];
  document.getElementById("prodNome").value = p.nome;
  document.getElementById("prodPreco").value = p.preco;
  document.getElementById("prodImagem").value = p.imagem;
  document.getElementById("prodDescricao").value = p.descricao;
  document.getElementById("prodCategoria").value = p.categoria;
  document.getElementById("prodSubcategoria").value = p.subcategoria;
  document.getElementById("prodModoVenda").value = p.modoVenda;
  document.getElementById("prodEstoque").value = p.estoque;
  document.getElementById("prodDestaque").checked = p.destaque;
  document.getElementById("prodAtivo").checked = p.ativo;

  produtoEditandoIndex = index;
  btnAdicionarProduto.textContent = "Salvar Alterações";
}

function removerProduto(index) {
  if (confirm("Excluir produto?")) {
    state.produtos.splice(index, 1);
    atualizarProdutosUI();
    salvarLocal();
    atualizarPreview();
  }
}

// ===============================
// Preview em tempo real
// ===============================
function atualizarPreview()
