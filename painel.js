// =========================
// Estado inicial da loja
// =========================
let state = {
    dadosLoja: {
        nome: "",
        telefone: "",
        pix: "",
        banco: "",
        endereco: "",
        logo: "",
        horario: ""
    },
    produtos: [],
    clientes: [],
    cupons: [],
    publicidade: {
        texto: "",
        bannerImg: "",
        bannerLink: "",
        carrossel: [],
        redesSociais: {
            instagram: "",
            facebook: "",
            whatsapp: ""
        }
    },
    cobertura: [],
    customizacao: {
        corPrimaria: "#3498db",
        fonte: "Arial",
        modoEscuro: false,
        musicaAmbiente: ""
    }
};

// =========================
// Funções utilitárias
// =========================

// Salvar estado no navegador
function salvarLocal() {
    localStorage.setItem("painelState", JSON.stringify(state));
    alert("💾 Configurações salvas no dispositivo!");
}

// Carregar estado do navegador
function carregarLocal() {
    const saved = localStorage.getItem("painelState");
    if (saved) {
        state = JSON.parse(saved);
        console.log("🔄 Estado carregado:", state);
    }
}

// =========================
// Produtos
// =========================
function adicionarProduto() {
    const nome = document.getElementById("prodNome").value.trim();
    const preco = parseFloat(document.getElementById("prodPreco").value);
    const imagem = document.getElementById("prodImagem").value.trim();
    const descricao = document.getElementById("prodDescricao").value.trim();
    const destaque = document.getElementById("prodDestaque").checked;
    const ativo = document.getElementById("prodAtivo").checked;

    if (!nome || isNaN(preco)) return alert("Preencha nome e preço!");

    const produto = {
        nome,
        preco,
        imagem,
        descricao,
        destaque,
        ativo
    };
    state.produtos.push(produto);
    atualizarListaProdutos();
    salvarLocal();
}

// Atualiza lista visual de produtos
function atualizarListaProdutos() {
    const container = document.getElementById("listaProdutosContainer");
    container.innerHTML = "";
    state.produtos.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <strong>${p.nome}</strong> - R$ ${p.preco.toFixed(2)}
            ${p.ativo ? "✅" : "❌"}
            <button onclick="removerProduto(${i})">🗑️</button>
        `;
        container.appendChild(div);
    });
}

function removerProduto(index) {
    if (confirm("Remover produto?")) {
        state.produtos.splice(index, 1);
        atualizarListaProdutos();
        salvarLocal();
    }
}

// =========================
// Clientes
// =========================
function adicionarCliente() {
    const inputs = document.querySelectorAll("#clientes .form-grid input, #clientes .form-grid textarea");
    const cliente = {
        nome: inputs[0].value.trim(),
        telefone: inputs[1].value.trim(),
        endereco: inputs[2].value.trim(),
        bairro: inputs[3].value.trim(),
        obs: inputs[4].value.trim(),
        notificacoes: inputs[5].checked
    };
    if (!cliente.nome) return alert("Preencha o nome do cliente!");
    state.clientes.push(cliente);
    salvarLocal();
    alert("✅ Cliente adicionado!");
}

// =========================
// Cupons
// =========================
function adicionarCupom() {
    const inputs = document.querySelectorAll("#cupons .form-grid input, #cupons .form-grid select, #cupons .form-grid textarea");
    const cupom = {
        codigo: inputs[0].value.trim(),
        tipo: inputs[1].value,
        valor: parseFloat(inputs[2].value),
        validade: inputs[3].value,
        pedidoMin: parseFloat(inputs[4].value),
        limiteUso: parseInt(inputs[5].value),
        mensagem: inputs[6].value.trim(),
        ativo: inputs[7].checked
    };
    if (!cupom.codigo) return alert("Preencha o código do cupom!");
    state.cupons.push(cupom);
    salvarLocal();
    alert("✅ Cupom criado!");
}

// =========================
// Publicidade
// =========================
function salvarPublicidade() {
    const grid = document.querySelectorAll("#publicidade .form-grid input, #publicidade .form-grid textarea");
    state.publicidade.texto = grid[0].value.trim();
    state.publicidade.bannerImg = grid[1].value.trim();
    state.publicidade.bannerLink = grid[2].value.trim();
    state.publicidade.carrossel = grid[3].value.trim().split("\n").filter(l => l);
    state.publicidade.redesSociais.instagram = grid[4].value.trim();
    state.publicidade.redesSociais.facebook = grid[5].value.trim();
    state.publicidade.redesSociais.whatsapp = grid[6].value.trim();
    salvarLocal();
    alert("✅ Publicidade salva!");
}

// =========================
// Dados da Loja
// =========================
function salvarDadosLoja() {
    const grid = document.querySelectorAll("#dados-loja .form-grid input, #dados-loja .form-grid textarea");
    state.dadosLoja.nome = grid[0].value.trim();
    state.dadosLoja.telefone = grid[1].value.trim();
    state.dadosLoja.pix = grid[2].value.trim();
    state.dadosLoja.banco = grid[3].value.trim();
    state.dadosLoja.endereco = grid[4].value.trim();
    state.dadosLoja.logo = grid[5].value.trim();
    state.dadosLoja.horario = grid[6].value.trim();
    salvarLocal();
    alert("✅ Dados da loja salvos!");
}

// =========================
// Cobertura
// =========================
function adicionarBairro() {
    const inputs = document.querySelectorAll("#cobertura .form-grid input");
    const bairro = {
        nome: inputs[0].value.trim(),
        taxa: parseFloat(inputs[1].value),
        tempo: parseInt(inputs[2].value)
    };
    if (!bairro.nome) return alert("Preencha o bairro!");
    state.cobertura.push(bairro);
    salvarLocal();
    alert("✅ Bairro adicionado!");
}

// =========================
// Customização
// =========================
function salvarCustomizacao() {
    const grid = document.querySelectorAll("#customizar .form-grid input, #customizar .form-grid label input");
    state.customizacao.corPrimaria = grid[0].value;
    state.customizacao.fonte = grid[1].value.trim() || "Arial";
    state.customizacao.modoEscuro = grid[2].checked;
    state.customizacao.musicaAmbiente = grid[3].value.trim();
    salvarLocal();
    alert("🎨 Customização salva!");
}

// =========================
// Publicar no Totem via JSONBin
// =========================
function publicarTotem() {
    const binId = document.getElementById("jsonbinId").value.trim();
    const masterKey = document.getElementById("masterKey").value.trim();

    if (!binId || !masterKey) {
        alert("⚠️ Configure o JSONBin ID e a Master Key antes de publicar!");
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
    .then(res => {
        if (!res.ok) throw new Error("Erro ao publicar no JSONBin");
        return res.json();
    })
    .then(json => {
        alert("✅ Publicado no Totem com sucesso!");
        console.log(json);
    })
    .catch(err => {
        console.error(err);
        alert("❌ Falha ao publicar. Verifique suas credenciais.");
    });
}

// =========================
// Inicialização
// =========================
window.onload = function() {
    carregarLocal();
    atualizarListaProdutos();
};
