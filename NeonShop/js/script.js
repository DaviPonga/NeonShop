// =============================================
// NEONSHOP - script.js ATUALIZADO COM FIREBASE
// =============================================

import {
    auth,
    db,
    cadastrarFirebase,
    loginFirebase,
    logoutFirebase,
    observarLogin,
    salvarPedido,
    buscarMeusPedidos,
    buscarNomeUsuario
} from "./firebase.js";

let desconto = 0;

/* =========================
TOAST
========================= */
function mostrarToast(texto) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerHTML = texto;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

/* =========================
CADASTRO (Firebase)
========================= */
window.cadastrar = async function () {
    const nome  = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const msg   = document.getElementById("mensagem");

    if (!nome || !email || !senha) {
        msg.innerHTML = "Preencha todos os campos.";
        return;
    }
    if (senha.length < 6) {
        msg.innerHTML = "A senha precisa ter pelo menos 6 caracteres.";
        return;
    }

    try {
        msg.innerHTML = "Criando conta...";
        await cadastrarFirebase(nome, email, senha);
        mostrarToast("Conta criada com sucesso!");
        setTimeout(() => window.location.href = "index.html", 1500);
    } catch (e) {
        msg.innerHTML = traduzirErroFirebase(e.code);
    }
};

/* =========================
LOGIN (Firebase)
========================= */
window.login = async function () {
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const msg   = document.getElementById("mensagem");

    if (!email || !senha) {
        msg.innerHTML = "Preencha todos os campos.";
        return;
    }

    try {
        msg.innerHTML = "Entrando...";
        await loginFirebase(email, senha);
        mostrarToast("Login realizado!");
        setTimeout(() => window.location.href = "index.html", 1000);
    } catch (e) {
        msg.innerHTML = traduzirErroFirebase(e.code);
    }
};

/* =========================
LOGOUT (Firebase)
========================= */
window.logout = async function () {
    await logoutFirebase();
    mostrarToast("Logout realizado!");
    setTimeout(() => window.location.href = "login.html", 1000);
};

/* =========================
TRADUZIR ERROS FIREBASE
========================= */
function traduzirErroFirebase(code) {
    const erros = {
        "auth/email-already-in-use": "Este email já está cadastrado.",
        "auth/invalid-email": "Email inválido.",
        "auth/weak-password": "Senha muito fraca (mínimo 6 caracteres).",
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/invalid-credential": "Email ou senha incorretos.",
        "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
        "auth/network-request-failed": "Erro de conexão. Verifique sua internet."
    };
    return erros[code] || "Erro: " + code;
}

/* =========================
CARRINHO (localStorage)
========================= */
window.adicionarCarrinho = function (nome, preco, imagem, estoque) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let existente = carrinho.find(p => p.nome === nome);

    if (existente) {
        if (existente.quantidade < existente.estoque) {
            existente.quantidade++;
            mostrarToast("Quantidade aumentada!");
        } else {
            mostrarToast("Estoque máximo atingido!");
        }
    } else {
        carrinho.push({ nome, preco: Number(preco), imagem, quantidade: 1, estoque: Number(estoque) });
        mostrarToast(nome + " adicionado!");
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
};

/* =========================
CARREGAR CARRINHO
========================= */
function carregarCarrinho() {
    const container = document.getElementById("carrinho-produtos");
    const totalHTML = document.getElementById("total");
    if (!container || !totalHTML) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let total = 0;
    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#aaa;font-size:20px;grid-column:1/-1;padding:40px 0;">Seu carrinho está vazio 🛒</p>`;
        totalHTML.innerHTML = "TOTAL: R$ 0,00";
        return;
    }

    carrinho.forEach((produto, index) => {
        total += Number(produto.preco) * produto.quantidade;
        container.innerHTML += `
        <div class="produto">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <span>R$ ${Number(produto.preco).toFixed(2)}</span>
            <p>Quantidade: ${produto.quantidade} / ${produto.estoque}</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
                <button onclick="aumentarQuantidade(${index})" style="width:auto;padding:10px 20px;margin:0;">+</button>
                <button onclick="diminuirQuantidade(${index})" style="width:auto;padding:10px 20px;margin:0;">−</button>
                <button onclick="removerCarrinho(${index})" style="width:auto;padding:10px 20px;margin:0;background:#ff0066;">✕</button>
            </div>
        </div>`;
    });

    let totalFinal = total - (total * desconto / 100);
    totalHTML.innerHTML = `TOTAL: R$ ${totalFinal.toFixed(2)}`;

    // Atualiza total do modal PIX
    const pixTotal = document.getElementById("pix-total");
    if (pixTotal) pixTotal.innerHTML = `R$ ${totalFinal.toFixed(2)}`;
}

window.aumentarQuantidade = function (index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho[index].quantidade < carrinho[index].estoque) {
        carrinho[index].quantidade++;
    } else {
        mostrarToast("Limite do estoque!");
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
};

window.diminuirQuantidade = function (index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
};

window.removerCarrinho = function (index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarToast("Produto removido!");
    carregarCarrinho();
    atualizarContadorCarrinho();
};

/* =========================
PESQUISA
========================= */
window.pesquisarProdutos = function () {
    const input = document.getElementById("pesquisa");
    if (!input) return;
    const filtro = input.value.toLowerCase();
    document.querySelectorAll(".produto").forEach(p => {
        const nome = p.querySelector("h3")?.innerText.toLowerCase() || "";
        p.style.display = nome.includes(filtro) ? "block" : "none";
    });
};

/* =========================
FILTRAR CATEGORIAS
========================= */
window.filtrarProdutos = function (categoria) {
    document.querySelectorAll(".produto").forEach(p => {
        p.style.display =
            categoria === "todos" || p.dataset.categoria === categoria
            ? "block" : "none";
    });
};

/* =========================
FAVORITOS
========================= */
window.toggleFavorito = function (el) {
    const produto = el.parentElement;
    const nome    = produto.querySelector("h3").innerText;
    const preco   = produto.querySelector("span").innerText;
    const imagem  = produto.querySelector("img").src;

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let existe    = favoritos.find(i => i.nome === nome);

    if (existe) {
        favoritos = favoritos.filter(i => i.nome !== nome);
        el.classList.remove("ativo");
        mostrarToast("Removido dos favoritos!");
    } else {
        favoritos.push({ nome, preco, imagem });
        el.classList.add("ativo");
        mostrarToast("Adicionado aos favoritos! ❤");
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
};

function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    document.querySelectorAll(".produto").forEach(p => {
        const nome   = p.querySelector("h3")?.innerText;
        const coracao = p.querySelector(".favorito");
        if (!coracao || !nome) return;
        if (favoritos.find(i => i.nome === nome)) coracao.classList.add("ativo");
    });
}

/* =========================
CUPOM
========================= */
window.aplicarCupom = function () {
    const cupom = document.getElementById("cupom")?.value.toUpperCase();
    const msg   = document.getElementById("mensagem-cupom");
    const cupons = { "NEON10": 10, "GAMER20": 20, "VIP50": 50 };
    desconto = cupons[cupom] || 0;
    msg.innerHTML = desconto > 0 ? `✅ Cupom ${desconto}% aplicado!` : "❌ Cupom inválido.";
    carregarCarrinho();
};

/* =========================
TEMA
========================= */
window.trocarTema = function () {
    document.body.classList.toggle("light-mode");
    const tema = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("tema", tema);
    document.querySelector(".tema-btn").textContent = tema === "light" ? "☀️" : "🌙";
};

function carregarTema() {
    if (localStorage.getItem("tema") === "light") {
        document.body.classList.add("light-mode");
        const btn = document.querySelector(".tema-btn");
        if (btn) btn.textContent = "☀️";
    }
}

/* =========================
PIX / FINALIZAR COMPRA
========================= */
window.abrirPix = function () {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) {
        mostrarToast("Carrinho vazio!");
        return;
    }
    const modal = document.getElementById("pix-modal");
    if (modal) modal.style.display = "flex";
};

window.fecharPix = function () {
    const modal = document.getElementById("pix-modal");
    if (modal) modal.style.display = "none";
};

window.confirmarPagamento = async function () {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) return;

    let total = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);
    let totalFinal = total - (total * desconto / 100);

    // Adicionar frete se calculado
    const frete = parseFloat(localStorage.getItem("frete") || 0);
    totalFinal += frete;

    let pedidoId = Date.now().toString();

    try {
        if (auth.currentUser) {
            pedidoId = await salvarPedido(carrinho, totalFinal);
        }
    } catch (e) {
        console.warn("Pedido não salvo no Firebase:", e);
    }

    // Adicionar pontos de fidelidade
    const pontosGanhos = Math.floor(totalFinal * 10);
    const pontosAtuais = parseInt(localStorage.getItem("neon-pontos") || "0");
    localStorage.setItem("neon-pontos", pontosAtuais + pontosGanhos);

    mostrarToast("✅ Pagamento aprovado! +" + pontosGanhos + " pontos!");
    localStorage.removeItem("carrinho");
    localStorage.removeItem("frete");
    localStorage.setItem("ultimo-pedido", pedidoId);
    localStorage.setItem("pontos-ganhos", pontosGanhos);
    atualizarContadorCarrinho();

    setTimeout(() => {
        fecharPix();
        window.location.href = "confirmacao.html?id=" + pedidoId;
    }, 1500);
};

/* =========================
PERFIL (Firebase)
========================= */
async function carregarPerfil() {
    const nomeEl  = document.getElementById("perfil-nome");
    const emailEl = document.getElementById("perfil-email");
    const pedidosEl = document.getElementById("perfil-pedidos");
    if (!nomeEl) return;

    observarLogin(async (user) => {
        if (user) {
            emailEl && (emailEl.innerHTML = user.email);
            try {
                const nome = await buscarNomeUsuario();
                nomeEl.innerHTML = nome || user.email;
            } catch {
                nomeEl.innerHTML = user.email;
            }

            // Carregar pedidos
            if (pedidosEl) {
                try {
                    const pedidos = await buscarMeusPedidos();
                    if (pedidos.length === 0) {
                        pedidosEl.innerHTML = "<p style='color:#aaa'>Nenhum pedido ainda.</p>";
                    } else {
                        pedidosEl.innerHTML = pedidos.map(p => `
                            <div style="background:#1a1a1a;border:1px solid rgba(0,255,255,0.2);border-radius:12px;padding:15px;margin-bottom:12px;text-align:left;">
                                <p style="color:cyan;font-weight:bold;">Pedido #${p.id.slice(-6).toUpperCase()}</p>
                                <p style="color:#aaa;font-size:14px;">${p.itens.length} item(s) · R$ ${Number(p.total).toFixed(2)}</p>
                                <p style="color:#666;font-size:12px;">Status: ${p.status}</p>
                            </div>
                        `).join("");
                    }
                } catch {
                    pedidosEl.innerHTML = "<p style='color:#aaa'>Erro ao carregar pedidos.</p>";
                }
            }
        } else {
            nomeEl.innerHTML = "Não logado";
            emailEl && (emailEl.innerHTML = "Faça login para ver seus dados");
        }
    });
}

/* =========================
CONTADOR CARRINHO
========================= */
function atualizarContadorCarrinho() {
    const contador = document.getElementById("contador-carrinho");
    if (!contador) return;
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const total = carrinho.reduce((s, p) => s + p.quantidade, 0);
    contador.innerHTML = total;
}

/* =========================
NAVBAR: mostrar nome do usuário logado
========================= */
function atualizarNavbarLogin() {
    observarLogin(async (user) => {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (!loginLink) return;
        if (user) {
            try {
                const nome = await buscarNomeUsuario();
                loginLink.textContent = nome ? nome.split(" ")[0] : "Perfil";
                loginLink.href = "perfil.html";
            } catch {
                loginLink.textContent = "Perfil";
                loginLink.href = "perfil.html";
            }
        }
    });
}

/* =========================
LOADING
========================= */
window.addEventListener("load", () => {
    carregarCarrinho();
    atualizarContadorCarrinho();
    carregarFavoritos();
    carregarTema();
    carregarPerfil();
    atualizarNavbarLogin();

    const loading = document.getElementById("loading");
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = "0";
            loading.style.visibility = "hidden";
        }, 2000);
    }
});