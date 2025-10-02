// Estado inicial
let state = {
    loja: { nome:"", logo:"", telefone:"", pix:"", banco:"", endereco:"", horario:"", corPrimaria:"#3498db", fonte:"Arial", modoEscuro:false },
    produtos: [],
    clientes: [],
    cupons: [],
    publicidade: { texto:"", banner:"", link:"", carrossel:[], redesSociais:{ instagram:"", facebook:"", whatsapp:"" } },
    cobertura: []
};

// =========================
// LocalStorage
// =========================
function salvarLocal() {
    localStorage.setItem("painelState", JSON.stringify(state));
    alert("💾 Configurações salvas no dispositivo!");
}

function carregarLocal() {
    const saved = localStorage.getItem("painelState");
    if(saved){
        state = JSON.parse(saved);
        console.log("🔄 Estado carregado:", state);
    }
}

// =========================
// Publicar no JSONBin
// =========================
function publicarTotem() {
    const binId = document.getElementById("jsonbinId").value.trim();
    const masterKey = document.getElementById("masterKey").value.trim();
    if(!binId || !masterKey){
        alert("⚠️ Configure JSONBin ID e Master Key!");
        return;
    }

    fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method:"PUT",
        headers:{ "Content-Type":"application/json", "X-Master-Key": masterKey },
        body: JSON.stringify(state)
    })
    .then(res=>{ if(!res.ok) throw new Error("Erro ao publicar"); return res.json() })
    .then(json=>{ alert("✅ Publicado com sucesso!"); console.log(json) })
    .catch(err=>{ console.error(err); alert("❌ Falha ao publicar.") });
}

// =========================
// Inicialização
// =========================
window.onload = function(){
    carregarLocal();
};
