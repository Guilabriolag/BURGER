// =========================
// Estado inicial
// =========================
let state = {
    loja: {
        nome: "",
        telefone: "",
        pix: "",
        banco: "",
        endereco: "",
        horario: "",
        logo: "",
        corPrimaria: "#3498db",
        fonte: "Arial",
        modoEscuro: false,
        musicaAmbiente: ""
    },
    produtos: [],
    clientes: [],
    cupons: [],
    publicidade: {
        texto: "",
        banner: "",
        link: "",
        carrossel: [],
        redesSociais: { instagram:"", facebook:"", whatsapp:"" }
    },
    cobertura: []
};

// =========================
// Funções utilitárias
// =========================

// Salvar estado no localStorage
function salvarLocal() {
    localStorage.setItem("painelState", JSON.stringify(state));
    alert("💾 Configurações salvas no dispositivo!");
}

// Carregar estado do localStorage
function carregarLocal() {
    const saved = localStorage.getItem("painelState");
    if (saved) {
        state = JSON.parse(saved);
        console.log("🔄 Estado carregado:", state);
        atualizarInterface();
    }
}

// Atualiza inputs da interface com os dados do state
function atualizarInterface() {
    // Loja
    const l = state.loja;
    document.querySelector('input[placeholder="Nome da Loja"]').value = l.nome;
    document.querySelector('input[placeholder="Telefone"]').value = l.telefone;
    document.querySelector('input[placeholder="PIX"]').value = l.pix;
    document.querySelector('input[placeholder="Banco"]').value = l.banco;
    document.querySelector('textarea[placeholder="Endereço"]').value = l.endereco;
    document.querySelector('textarea[placeholder="Horários de Funcionamento"]').value = l.horario;
    document.querySelector('input[placeholder="Logo (URL)"]').value = l.logo;
    document.querySelector('input[type="color"]').value = l.corPrimaria;
    document.querySelector('input[placeholder^="Fonte"]').value = l.fonte;
    document.querySelector('input[type="checkbox"]').checked = l.modoEscuro;
    document.querySelector('input[placeholder="URL Música Ambiente"]').value = l.musicaAmbiente;

    // Publicidade
    const p = state.publicidade;
    const pubInputs = document.querySelectorAll("#publicidade input, #publicidade textarea");
    pubInputs[0].value = p.texto;
    pubInputs[1].value = p.banner;
    pubInputs[2].value = p.link;
    pubInputs[3].value = p.carrossel.join("\n");
    pubInputs[4].value = p.redesSociais.instagram;
    pubInputs[5].value = p.redesSociais.facebook;
    pubInputs[6].value = p.redesSociais.whatsapp;

    // Produtos
    atualizarListaProdutos();

    // Clientes
    atualizarListaClientes();

    // Cupons
    atualizarListaCupons();

    // Cobertura
    atualizarListaCobertura();
}

// =========================
// Abas: Produtos
// =========================
function atualizarListaProdutos() {
    const container = document.getElementById("listaProdutosContainer");
    container.innerHTML = "";
    state.produtos.forEach((p, i)=>{
        const div = document.createElement("div");
        div.className = "item-container";
        div.innerHTML = `
            <strong>${p.nome}</strong>
            <span>R$ ${parseFloat(p.preco).toFixed(2)}</span>
            <span>${p.categoria} | ${p.subcategoria}</span>
            <span>${p.modoVenda}</span>
            <button onclick="removerProduto(${i})" class="btn-danger">Excluir</button>
        `;
        container.appendChild(div);
    });
}

function adicionarProduto() {
    const nome = document.getElementById("prodNome").value;
    const preco = parseFloat(document.getElementById("prodPreco").value) || 0;
    const imagem = document.getElementById("prodImagem").value;
    const descricao = document.getElementById("prodDescricao").value;
    const categoria = document.getElementById("prodCategoria").value;
    const subcategoria = document.getElementById("prodSubcategoria").value;
    const modoVenda = document.getElementById("prodModoVenda").value;
    const estoque = parseInt(document.getElementById("prodEstoque").value) || 0;
    const destaque = document.getElementById("prodDestaque").checked;
    const ativo = document.getElementById("prodAtivo").checked;

    state.produtos.push({nome, preco, imagem, descricao, categoria, subcategoria, modoVenda, estoque, destaque, ativo});
    salvarLocal();
    atualizarListaProdutos();
}

// Remove produto
function removerProduto(index) {
    state.produtos.splice(index, 1);
    salvarLocal();
    atualizarListaProdutos();
}

// =========================
// Abas: Clientes
// =========================
function atualizarListaClientes() {
    const container = document.getElementById("clientesContainer");
    if(!container) return;
    container.innerHTML = "";
    state.clientes.forEach((c,i)=>{
        const div = document.createElement("div");
        div.className = "item-container";
        div.innerHTML = `<strong>${c.nome}</strong> | ${c.telefone} | ${c.bairro} <button onclick="removerCliente(${i})" class="btn-danger">Excluir</button>`;
        container.appendChild(div);
    });
}

function adicionarCliente() {
    const inputs = document.querySelectorAll("#clientes input, #clientes textarea, #clientes label input");
    const cliente = {
        nome: inputs[0].value,
        telefone: inputs[1].value,
        endereco: inputs[2].value,
        bairro: inputs[3].value,
        observacoes: inputs[4].value,
        notificacoes: inputs[5].checked
    };
    state.clientes.push(cliente);
    salvarLocal();
    atualizarListaClientes();
}

function removerCliente(i){ state.clientes.splice(i,1); salvarLocal(); atualizarListaClientes(); }

// =========================
// Abas: Cupons
// =========================
function atualizarListaCupons() {
    const container = document.getElementById("cuponsContainer");
    if(!container) return;
    container.innerHTML = "";
    state.cupons.forEach((c,i)=>{
        const div = document.createElement("div");
        div.className = "item-container";
        div.innerHTML = `<strong>${c.codigo}</strong> | ${c.tipo}${c.valor} | Validade: ${c.validade} <button onclick="removerCupom(${i})" class="btn-danger">Excluir</button>`;
        container.appendChild(div);
    });
}

function adicionarCupom() {
    const inputs = document.querySelectorAll("#cupons input, #cupons select, #cupons textarea, #cupons label input");
    const cupom = {
        codigo: inputs[0].value,
        tipo: inputs[1].value,
        valor: parseFloat(inputs[2].value)||0,
        validade: inputs[3].value,
        pedidoMinimo: parseFloat(inputs[4].value)||0,
        limiteUso: parseInt(inputs[5].value)||0,
        mensagem: inputs[6].value,
        ativo: inputs[7].checked
    };
    state.cupons.push(cupom);
    salvarLocal();
    atualizarListaCupons();
}

function removerCupom(i){ state.cupons.splice(i,1); salvarLocal(); atualizarListaCupons(); }

// =========================
// Abas: Cobertura
// =========================
function atualizarListaCobertura() {
    const container = document.getElementById("coberturaContainer");
    if(!container) return;
    container.innerHTML = "";
    state.cobertura.forEach((c,i)=>{
        const div = document.createElement("div");
        div.className = "item-container";
        div.innerHTML = `<strong>${c.bairro}</strong> | R$ ${c.taxa} | ${c.tempo} min <button onclick="removerCobertura(${i})" class="btn-danger">Excluir</button>`;
        container.appendChild(div);
    });
}

function adicionarCobertura() {
    const inputs = document.querySelectorAll("#cobertura input");
    const bairro = inputs[0].value;
    const taxa = parseFloat(inputs[1].value)||0;
    const tempo = parseInt(inputs[2].value)||0;
    state.cobertura.push({bairro, taxa, tempo});
    salvarLocal();
    atualizarListaCobertura();
}

function removerCobertura(i){ state.cobertura.splice(i,1); salvarLocal(); atualizarListaCobertura(); }

// =========================
// Publicidade
// =========================
function salvarPublicidade() {
    const inputs = document.querySelectorAll("#publicidade input, #publicidade textarea");
    state.publicidade.texto = inputs[0].value;
    state.publicidade.banner = inputs[1].value;
    state.publicidade.link = inputs[2].value;
    state.publicidade.carrossel = inputs[3].value.split("\n").map(s=>s.trim()).filter(s=>s);
    state.publicidade.redesSociais.instagram = inputs[4].value;
    state.publicidade.redesSociais.facebook = inputs[5].value;
    state.publicidade.redesSociais.whatsapp = inputs[6].value;
    salvarLocal();
    alert("Publicidade salva!");
}

// =========================
// Dados da Loja
// =========================
function salvarDadosLoja() {
    const inputs = document.querySelectorAll('#dados-loja input, #dados-loja textarea, #customizar input, #customizar textarea, #customizar label input');
    state.loja.nome = inputs[0].value;
    state.loja.telefone = inputs[1].value;
    state.loja.pix = inputs[2].value;
    state.loja.banco = inputs[3].value;
    state.loja.endereco = inputs[4].value;
    state.loja.logo = inputs[5].value;
    state.loja.horario = inputs[6].value;
    state.loja.corPrimaria = inputs[7].value;
    state.loja.fonte = inputs[8].value;
    state.loja.modoEscuro = inputs[9].checked;
    state.loja.musicaAmbiente = inputs[10].value;
    salvarLocal();
    alert("Dados da loja salvos!");
}

// =========================
// Publicar no JSONBin
// =========================
function publicarTotem() {
    const binId = document.getElementById("jsonbinId").value.trim();
    const masterKey = document.getElementById("masterKey").value.trim();
    if(!binId || !masterKey){ alert("Configure JSONBin ID e Master Key!"); return; }

    fetch(`https://api.jsonbin.io/v3/b/${binId}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json","X-Master-Key": masterKey},
        body: JSON.stringify(state)
    })
    .then(res=>{ if(!res.ok) throw new Error("Erro JSONBin"); return res.json(); })
    .then(j=>{ alert("✅ Publicado com sucesso!"); console.log(j); })
    .catch(e=>{ console.error(e); alert("❌ Falha ao publicar!"); });
}

// =========================
// Inicialização
// =========================
window.onload = function() {
    carregarLocal();
    // Adiciona listeners dos botões
    document.getElementById("btnAdicionarProduto")?.addEventListener("click", adicionarProduto);
    document.querySelector("#clientes button")?.addEventListener("click", adicionarCliente);
    document.querySelector("#cupons button")?.addEventListener("click", adicionarCupom);
    document.querySelector("#publicidade button")?.addEventListener("click", salvarPublicidade);
    document.querySelector("#cobertura button")?.addEventListener("click", adicionarCobertura);
};
