// 1️⃣ Estado inicial
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
    banner: { texto:"", imagem:"", link:"" },
    carrossel: [],
    redesSociais: { instagram:"", facebook:"", whatsapp:"" }
  },
  cobertura: []
};

// 2️⃣ Seleção de abas
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// 3️⃣ Toggle Menu
const sidebar = document.getElementById('sidebar');
document.getElementById('toggleMenu').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// 4️⃣ Salvar e carregar localStorage
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
  alert("💾 Salvo localmente!");
}
function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if(saved) {
    state = JSON.parse(saved);
    alert("🔄 Carregado do dispositivo!");
    atualizarPreview();
  }
}

// 5️⃣ Publicar no JSONBin
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if(!binId || !masterKey) { alert("⚠️ Configure JSONBin ID e Master Key"); return; }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  }).then(res => res.json())
    .then(json => alert("✅ Publicado com sucesso!"))
    .catch(err => alert("❌ Erro ao publicar."));
}

// 6️⃣ Restaurar padrão
function restaurarPadrao() {
  const senha = prompt("Senha para restaurar padrão:");
  if(senha !== "1234"){ alert("❌ Senha incorreta"); return; }
  state = { loja:{...}, categorias:[], produtos:[], clientes:[], cupons:[], publicidade:{banner:{texto:"",imagem:"",link:""},carrossel:[],redesSociais:{instagram:"",facebook:"",whatsapp:""}}, cobertura:[]};
  salvarLocal();
  atualizarPreview();
}

// 7️⃣ Atualizar preview
function atualizarPreview(){
  const iframe = document.getElementById('previewIframe');
  iframe.srcdoc = gerarTotemHTML();
}

// 8️⃣ Gerar Totem HTML (simplificado)
function gerarTotemHTML(){
  return `
    <html>
      <head><title>${state.loja.nome}</title></head>
      <body style="font-family:Arial,sans-serif;">
        <header style="background:${state.loja.corPrimaria};color:#fff;padding:10px;text-align:center;">
          <img src="${state.loja.logo}" style="height:40px;">
          <h1>${state.loja.nome}</h1>
        </header>
        <main>
          <h2>Produtos:</h2>
          <ul>
            ${state.produtos.map(p=>`<li>${p.nome} - R$ ${p.preco}</li>`).join('')}
          </ul>
        </main>
      </body>
    </html>
  `;
}

// Inicialização
window.onload = () => { carregarLocal(); };
