document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. ESTADO CENTRAL DO PAINEL
    // =================================================================
    let state = {
        produtos: [],
        categorias: [],
        modoVenda: [],
        clientes: [],
        cupons: [],
        publicidade: {},
        dadosLoja: {},
        cobertura: [],
        customizar: {},
    };

    let produtoEditandoId = null;

    // =================================================================
    // 2. SELETORES DE ELEMENTOS DO HTML (DOM)
    // =================================================================
    const menuContainer = document.getElementById('menu');
    const tabs = document.querySelectorAll('main .tab');
    
    // Aba de Produtos
    const prodNomeInput = document.getElementById('prodNome');
    const prodPrecoInput = document.getElementById('prodPreco');
    const prodImagemInput = document.getElementById('prodImagem');
    const prodDescricaoInput = document.getElementById('prodDescricao');
    const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
    const listaProdutosContainer = document.getElementById('listaProdutosContainer');
    
    // Aba de Configurações
    const btnPublicar = document.getElementById('btnPublicar');
    const btnExportar = document.querySelector('.btn-secondary:nth-of-type(1)');
    const btnImportar = document.querySelector('.btn-secondary:nth-of-type(2)');
    const btnRestaurarPadrao = document.getElementById('btnRestaurarPadrao');

    // Aba de Categorias
    const formNovaCategoria = document.querySelector('#categorias .form-group button');
    const listaCategorias = document.getElementById('category-tree');

    // =================================================================
    // 3. FUNÇÕES PRINCIPAIS
    // =================================================================

    // --- NAVEGAÇÃO E UI GERAL ---
    function setupTabs() {
        const TABS_CONFIG = [
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'categorias', label: '🗂️ Categorias' },
            { id: 'modo-venda', label: '⚖️ Modo de Venda' },
            { id: 'produtos', label: '📦 Produtos' },
            { id: 'clientes', label: '👥 Clientes' },
            { id: 'cupons', label: '🎟️ Cupons' },
            { id: 'publicidade', label: '📢 Publicidade' },
            { id: 'dados-loja', label: '🗝️ Dados da Loja' },
            { id: 'cobertura', label: '🗺️ Cobertura' },
            { id: 'customizar', label: '🎨 Customizar' },
            { id: 'config', label: '⚙️ Configurações' }
        ];
        TABS_CONFIG.forEach(tabInfo => {
            const button = document.createElement('button');
            button.dataset.tab = tabInfo.id;
            button.innerHTML = tabInfo.label;
            menuContainer.appendChild(button);
        });
        const menuButtons = document.querySelectorAll('#menu button');
        menuContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const targetTabId = e.target.dataset.tab;
                tabs.forEach(tab => tab.classList.remove('active'));
                const targetTab = document.getElementById(targetTabId);
                if (targetTab) targetTab.classList.add('active');
                menuButtons.forEach(button => button.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
        if (menuButtons.length > 0) menuButtons[0].click();
    }
    
    function setupDashboardChart() {
        const ctx = document.getElementById('vendasChart').getContext('2d');
        new Chart(ctx, { type: 'line', data: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], datasets: [{ label: 'Vendas da Semana (Exemplo)', data: [120, 190, 300, 500, 200, 300, 450], backgroundColor: 'rgba(52, 152, 219, 0.2)', borderColor: 'rgba(52, 152, 219, 1)', borderWidth: 2, tension: 0.3 }] }, options: { responsive: true, scales: { y: { beginAtZero: true } } } });
    }

    // --- LÓGICA DA ABA PRODUTOS ---
    function renderizarProdutos() {
        listaProdutosContainer.innerHTML = '';
        if (state.produtos.length === 0) {
            listaProdutosContainer.innerHTML = '<p>Nenhum produto adicionado ainda.</p>';
            return;
        }
        state.produtos.forEach((produto) => {
            const produtoDiv = document.createElement('div');
            produtoDiv.className = 'product-item';
            produtoDiv.innerHTML = `
                <img src="${produto.imagem || 'https://via.placeholder.com/50'}" alt="Imagem">
                <div><strong>${produto.nome}</strong><br><span>R$ ${produto.preco.toFixed(2)}</span></div>
                <button class="btn-secondary btn-small" data-id="${produto.id}">Editar</button>
                <button class="btn-danger btn-small" data-id="${produto.id}">Remover</button>
            `;
            listaProdutosContainer.appendChild(produtoDiv);
        });
    }

    function adicionarOuAtualizarProduto() {
        const nome = prodNomeInput.value.trim();
        const preco = parseFloat(prodPrecoInput.value);
        if (!nome || isNaN(preco)) {
            alert('Nome e Preço são obrigatórios!');
            return;
        }

        if (produtoEditandoId) {
            const produtoExistente = state.produtos.find(p => p.id === produtoEditandoId);
            if (produtoExistente) {
                produtoExistente.nome = nome;
                produtoExistente.preco = preco;
                produtoExistente.imagem = prodImagemInput.value.trim();
                produtoExistente.descricao = prodDescricaoInput.value.trim();
            }
            produtoEditandoId = null;
            btnAdicionarProduto.textContent = 'Adicionar Produto';
            alert("Produto atualizado com sucesso!");
        } else {
            const novoProduto = {
                id: Date.now(),
                nome,
                preco,
                imagem: prodImagemInput.value.trim(),
                descricao: prodDescricaoInput.value.trim(),
            };
            state.produtos.push(novoProduto);
            alert("Produto adicionado com sucesso!");
        }

        limparCamposProduto();
        renderizarProdutos();
    }

    function editarProduto(id) {
        const produto = state.produtos.find(p => p.id === parseInt(id));
        if (produto) {
            prodNomeInput.value = produto.nome;
            prodPrecoInput.value = produto.preco;
            prodImagemInput.value = produto.imagem;
            prodDescricaoInput.value = produto.descricao;
            produtoEditandoId = produto.id;
            btnAdicionarProduto.textContent = 'Salvar Alterações';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function removerProduto(id) {
        const confirmacao = confirm("Tem certeza que deseja remover este produto?");
        if (confirmacao) {
            state.produtos = state.produtos.filter(p => p.id !== parseInt(id));
            renderizarProdutos();
            alert("Produto removido com sucesso!");
        }
    }

    function limparCamposProduto() {
        prodNomeInput.value = '';
        prodPrecoInput.value = '';
        prodImagemInput.value = '';
        prodDescricaoInput.value = '';
    }

    // --- LÓGICA DA ABA CATEGORIAS ---
    function renderizarCategorias() {
        listaCategorias.innerHTML = '';
        if (state.categorias.length === 0) {
            listaCategorias.innerHTML = '<p>Nenhuma categoria adicionada.</p>';
            return;
        }

        state.categorias.forEach(cat => {
            const details = document.createElement('details');
            details.innerHTML = `
                <summary>${cat.nome} <button class="btn-small btn-danger" data-id="${cat.id}">Excluir</button></summary>
                <ul>
                    ${cat.subcategorias.map(sub => `
                        <li>${sub.nome} <button class="btn-small btn-danger" data-sub-id="${sub.id}" data-cat-id="${cat.id}">Excluir</button></li>
                    `).join('')}
                    <li><input type="text" placeholder="Nova Subcategoria"><button class="btn-small" data-cat-id="${cat.id}">Adicionar</button></li>
                </ul>
            `;
            listaCategorias.appendChild(details);
        });
    }

    function adicionarCategoria() {
        const input = document.querySelector('#categorias input[type="text"]');
        const nome = input.value.trim();
        if (nome) {
            const novaCategoria = {
                id: Date.now(),
                nome,
                subcategorias: []
            };
            state.categorias.push(novaCategoria);
            input.value = '';
            renderizarCategorias();
        }
    }

    function gerenciarSubcategorias(e) {
        if (e.target.matches('.btn-small')) {
            const catId = parseInt(e.target.dataset.catId);
            const categoria = state.categorias.find(c => c.id === catId);
            if (!categoria) return;

            const input = e.target.previousElementSibling;
            if (input.value) {
                const novaSub = {
                    id: Date.now(),
                    nome: input.value.trim()
                };
                categoria.subcategorias.push(novaSub);
                input.value = '';
                renderizarCategorias();
            }
        }
        if (e.target.matches('[data-sub-id]')) {
            const catId = parseInt(e.target.dataset.catId);
            const subId = parseInt(e.target.dataset.subId);
            const categoria = state.categorias.find(c => c.id === catId);
            if (categoria) {
                categoria.subcategorias = categoria.subcategorias.filter(sub => sub.id !== subId);
                renderizarCategorias();
            }
        }
    }

    function removerCategoria(e) {
        if (e.target.matches('.btn-danger')) {
            const id = parseInt(e.target.dataset.id);
            state.categorias = state.categorias.filter(c => c.id !== id);
            renderizarCategorias();
        }
    }
    
    // --- LÓGICA DA ABA CONFIGURAÇÕES ---
    function coletarDadosDoPainel() {
        // Coleta de dados de outras abas (exemplo)
        const customizarTab = document.getElementById('customizar');
        state.customizar.corPrincipal = customizarTab.querySelector('input[type="color"]').value;
        console.log("Dados coletados:", state);
    }

    async function publicarDados() {
        if (!confirm("Publicar os dados atuais no totem? Isso irá sobrescrever a versão online.")) return;
        coletarDadosDoPainel();

        const binId = document.getElementById('binId').value;
        const masterKey = document.getElementById('masterKey').value;
        if (!masterKey || !binId) {
            alert("Erro: O BIN ID e a Master Key são obrigatórios!");
            return;
        }
        
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Master-Key': masterKey },
                body: JSON.stringify(state)
            });
            if (!response.ok) throw new Error(`Erro na publicação: ${response.statusText}`);
            alert("✅ Sucesso! Os dados foram publicados e seu totem está atualizado.");
        } catch (error) {
            console.error("Falha na Publicação:", error);
            alert(`❌ Falha ao publicar os dados. Verifique o console (F12).`);
        }
    }

    async function importarDados() {
        if (!confirm("Importar os dados online do totem? Isso irá sobrescrever os dados locais do painel.")) return;

        const binId = document.getElementById('binId').value;
        const masterKey = document.getElementById('masterKey').value;
        if (!masterKey || !binId) {
            alert("Erro: O BIN ID e a Master Key são obrigatórios!");
            return;
        }

        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
                headers: { 'X-Master-Key': masterKey }
            });

            if (!response.ok) throw new Error(`Erro na importação: ${response.statusText}`);
            
            const data = await response.json();
            state = data.record;
            
            // Renderizar as abas com os dados importados
            renderizarProdutos();
            renderizarCategorias();
            
            alert("✅ Sucesso! Os dados foram importados.");
        } catch (error) {
            console.error("Falha na Importação:", error);
            alert(`❌ Falha ao importar os dados. Verifique o console (F12).`);
        }
    }

    function restaurarPadrao() {
        const senha = prompt("Para restaurar, digite a senha (1234):");
        if (senha === "1234") {
            if (confirm("TEM CERTEZA? Todos os dados não publicados serão perdidos.")) {
                state.produtos = [];
                state.categorias = [];
                state.modoVenda = [];
                state.clientes = [];
                state.cupons = [];
                state.publicidade = {};
                state.dadosLoja = {};
                state.cobertura = [];
                state.customizar = {};

                renderizarProdutos();
                renderizarCategorias();
                alert("Painel restaurado para os padrões.");
            }
        } else if (senha !== null) {
            alert("Senha incorreta.");
        }
    }

    // =================================================================
    // 4. EVENT LISTENERS
    // =================================================================
    btnAdicionarProduto.addEventListener('click', adicionarOuAtualizarProduto);
    listaProdutosContainer.addEventListener('click', (e) => {
        if (e.target.matches('.btn-danger')) {
            removerProduto(e.target.dataset.id);
        } else if (e.target.matches('.btn-secondary')) {
            editarProduto(e.target.dataset.id);
        }
    });

    formNovaCategoria.addEventListener('click', adicionarCategoria);
    listaCategorias.addEventListener('click', (e) => {
        removerCategoria(e);
        gerenciarSubcategorias(e);
    });

    btnPublicar.addEventListener('click', publicarDados);
    btnImportar.addEventListener('click', importarDados);
    btnRestaurarPadrao.addEventListener('click', restaurarPadrao);

    // =================================================================
    // 5. INICIALIZAÇÃO
    // =================================================================
    setupTabs();
    setupDashboardChart();
    renderizarProdutos();
    renderizarCategorias();
});
