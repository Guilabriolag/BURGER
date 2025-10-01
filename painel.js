document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. ESTADO CENTRAL DO PAINEL
    // =================================================================
    let state = {
        produtos: [],
        customizar: {},
        dadosLoja: {},
        // ...outros módulos
    };

    // =================================================================
    // 2. SELETORES DE ELEMENTOS DO HTML (DOM)
    // =================================================================
    const menuContainer = document.getElementById('menu');
    const tabs = document.querySelectorAll('main .tab');
    
    // Aba de Produtos
    const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
    const listaProdutosContainer = document.getElementById('listaProdutosContainer');
    
    // Aba de Configurações
    const btnPublicar = document.getElementById('btnPublicar');
    const btnRestaurarPadrao = document.getElementById('btnRestaurarPadrao');

    // =================================================================
    // 3. FUNÇÕES PRINCIPAIS
    // =================================================================

    // --- NAVEGAÇÃO E UI GERAL ---
    function setupTabs() {
        const TABS_CONFIG = [ { id: 'dashboard', label: '📊 Dashboard' }, { id: 'categorias', label: '🗂️ Categorias' }, { id: 'modo-venda', label: '⚖️ Modo de Venda' }, { id: 'produtos', label: '📦 Produtos' }, { id: 'clientes', label: '👥 Clientes' }, { id: 'cupons', label: '🎟️ Cupons' }, { id: 'publicidade', label: '📢 Publicidade' }, { id: 'dados-loja', label: '🗝️ Dados da Loja' }, { id: 'cobertura', label: '🗺️ Cobertura' }, { id: 'customizar', label: '🎨 Customizar' }, { id: 'config', label: '⚙️ Configurações' } ];
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
        state.produtos.forEach((produto, index) => {
            const produtoDiv = document.createElement('div');
            produtoDiv.className = 'product-item';
            produtoDiv.innerHTML = `
                <img src="${produto.imagem || 'https://via.placeholder.com/50'}" alt="Imagem">
                <div><strong>${produto.nome}</strong><br><span>R$ ${produto.preco}</span></div>
                <button class="btn-danger" data-index="${index}">Remover</button>
            `;
            listaProdutosContainer.appendChild(produtoDiv);
        });
    }

    function adicionarProduto() {
        const nome = document.getElementById('prodNome').value.trim();
        const preco = parseFloat(document.getElementById('prodPreco').value);
        if (!nome || isNaN(preco)) {
            alert('Nome e Preço são obrigatórios!');
            return;
        }
        const novoProduto = {
            id: Date.now(),
            nome,
            preco,
            imagem: document.getElementById('prodImagem').value.trim(),
            descricao: document.getElementById('prodDescricao').value.trim(),
            // ...outros campos
        };
        state.produtos.push(novoProduto);
        document.getElementById('prodNome').value = '';
        document.getElementById('prodPreco').value = '';
        document.getElementById('prodImagem').value = '';
        document.getElementById('prodDescricao').value = '';
        renderizarProdutos();
    }

    function removerProduto(index) {
        state.produtos.splice(index, 1);
        renderizarProdutos();
    }

    // --- LÓGICA DA ABA CONFIGURAÇÕES ---
    function coletarDadosDoPainel() {
        // Coleta de outras abas (exemplo)
        const customizarTab = document.getElementById('customizar');
        state.customizar.corPrincipal = customizarTab.querySelector('input[type="color"]').value;
        // ...coletar outros dados aqui
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

    function restaurarPadrao() {
        const senha = prompt("Para restaurar, digite a senha (1234):");
        if (senha === "1234") {
            if (confirm("TEM CERTEZA? Todos os dados não publicados serão perdidos.")) {
                state.produtos = [];
                // Resetar outros estados...
                renderizarProdutos();
                alert("Painel restaurado para os padrões.");
            }
        } else if (senha !== null) {
            alert("Senha incorreta.");
        }
    }

    // =================================================================
    // 4. EVENT LISTENERS
    // =================================================================
    btnAdicionarProduto.addEventListener('click', adicionarProduto);
    listaProdutosContainer.addEventListener('click', (e) => {
        if (e.target.matches('.btn-danger')) {
            removerProduto(e.target.dataset.index);
        }
    });
    btnPublicar.addEventListener('click', publicarDados);
    btnRestaurarPadrao.addEventListener('click', restaurarPadrao);

    // =================================================================
    // 5. INICIALIZAÇÃO
    // =================================================================
    setupTabs();
    setupDashboardChart();
    renderizarProdutos();
});
