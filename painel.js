document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'SEUNEGOCIO_v1';
  let state = { produtos: [], categorias: [], modosVenda: [], customizar: {}, dadosLoja: {} };

  const $ = (sel) => document.querySelector(sel);
  const genId = () => Date.now() + Math.floor(Math.random() * 999);
  const fmtBR = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function loadState() { const raw = localStorage.getItem(STORAGE_KEY); if (raw) state = JSON.parse(raw); }

  // Categorias
  function renderCategorias() {
    const container = $('#category-tree');
    container.innerHTML = '';
    state.categorias.forEach(cat => {
      const d = document.createElement('details');
      const sum = document.createElement('summary'); sum.textContent = cat.nome;
      const btnDel = document.createElement('button'); btnDel.textContent = 'Excluir'; btnDel.className = 'btn-small btn-danger';
      btnDel.onclick = (ev) => { ev.stopPropagation(); if (confirm('Excluir categoria?')) { state.categorias = state.categorias.filter(c => c.id != cat.id); saveState(); renderAll(); } };
      sum.appendChild(btnDel);
      d.appendChild(sum);
      container.appendChild(d);
    });
  }
  function addCategoria(nome) { if (!nome) return; state.categorias.push({ id: genId(), nome, subcats: [] }); saveState(); renderAll(); }

  // Modos de Venda
  function renderModos() {
    const ul = $('#listaModosVenda');
    const sel = $('#prodModoVenda');
    ul.innerHTML = ''; sel.innerHTML = '<option value="">Modo de Venda</option>';
    state.modosVenda.forEach(m => {
      const li = document.createElement('li'); li.textContent = `${m.nome} ${m.fracao || ''}`;
      ul.appendChild(li);
      const opt = document.createElement('option'); opt.value = m.id; opt.textContent = m.nome; sel.appendChild(opt);
    });
  }
  function addModo(nome, fracao) { state.modosVenda.push({ id: genId(), nome, fracao }); saveState(); renderAll(); }

  // Produtos
  function renderProdutos() {
    const cont = $('#listaProdutosContainer');
    cont.innerHTML = '';
    if (!state.produtos.length) { cont.innerHTML = '<p>Nenhum produto cadastrado.</p>'; return; }
    state.produtos.forEach(prod => {
      const div = document.createElement('div'); div.className = 'product-item';
      const img = document.createElement('img'); img.src 
';
      const info = document.createElement('div'); info.innerHTML = `<strong>${prod.nome}</strong><br>${fmtBR(prod.preco)}`;
      const btn = document.createElement('button'); btn.textContent = 'Remover'; btn.className = 'btn-danger'; btn.onclick = () => { state.produtos = state.produtos.filter(p => p.id != prod.id); saveState(); renderAll(); };
      div.append(img, info, btn);
      cont.appendChild(div);
    });

= prod.imagem || '
