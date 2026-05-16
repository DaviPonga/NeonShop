let desconto = 0;

/* =========================
TOAST
========================= */

function mostrarToast(texto){

    const toast =
        document.getElementById("toast");

    if(!toast) return;

    toast.innerHTML = texto;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}

/* =========================
CADASTRO
========================= */

function cadastrar() {

    const nome =
        document.getElementById("nome").value;

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const mensagem =
        document.getElementById("mensagem");

    if (
        nome === "" ||
        email === "" ||
        senha === ""
    ) {

        mensagem.innerHTML =
            "Preencha todos os campos.";

        return;
    }

    const usuario = {
        nome,
        email,
        senha
    };

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

    mensagem.innerHTML =
        "Cadastro realizado!";

    mostrarToast(
        "Conta criada com sucesso!"
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1500);
}

/* =========================
LOGIN
========================= */

function login() {

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const mensagem =
        document.getElementById("mensagem");

    const usuarioSalvo =
        JSON.parse(
            localStorage.getItem("usuario")
        );

    if (!usuarioSalvo) {

        mensagem.innerHTML =
            "Usuário não encontrado.";

        return;
    }

    if (
        email === usuarioSalvo.email &&
        senha === usuarioSalvo.senha
    ) {

        mensagem.innerHTML =
            "Login realizado!";

        localStorage.setItem(
            "logado",
            "true"
        );

        mostrarToast(
            "Login realizado!"
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1500);

    } else {

        mensagem.innerHTML =
            "Email ou senha incorretos.";
    }
}

/* =========================
CARRINHO
========================= */

function adicionarCarrinho(
    nome,
    preco,
    imagem,
    estoque
){

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    let produtoExistente =
        carrinho.find(
            produto => produto.nome === nome
        );

    if(produtoExistente){

        if(
            produtoExistente.quantidade <
            produtoExistente.estoque
        ){

            produtoExistente.quantidade++;

            mostrarToast(
                "Quantidade aumentada!"
            );

        }else{

            mostrarToast(
                "Estoque máximo atingido!"
            );
        }

    }else{

        carrinho.push({
            nome,
            preco: Number(preco),
            imagem,
            quantidade: 1,
            estoque: Number(estoque)
        });

        mostrarToast(
            nome + " adicionado!"
        );
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    carregarCarrinho();
}

/* =========================
CARREGAR CARRINHO
========================= */

function carregarCarrinho(){

    const container =
        document.getElementById(
            "carrinho-produtos"
        );

    const totalHTML =
        document.getElementById("total");

    if(!container || !totalHTML) return;

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    let total = 0;

    container.innerHTML = "";

    carrinho.forEach((produto, index) => {

        total +=
            Number(produto.preco) *
            produto.quantidade;

        container.innerHTML += `
        
        <div class="produto">

            <img src="${produto.imagem}">

            <h3>${produto.nome}</h3>

            <span>
                R$ ${Number(produto.preco).toFixed(2)}
            </span>

            <p>
                Quantidade:
                ${produto.quantidade}
            </p>

            <p>
                Estoque:
                ${produto.estoque}
            </p>

            <button onclick="aumentarQuantidade(${index})">
                +
            </button>

            <button onclick="diminuirQuantidade(${index})">
                -
            </button>

            <button onclick="removerCarrinho(${index})">
                Remover
            </button>

        </div>
        `;
    });

    let totalFinal =
        total - (total * desconto / 100);

    totalHTML.innerHTML =
        `TOTAL: R$ ${totalFinal.toFixed(2)}`;
}

/* =========================
QUANTIDADE
========================= */

function aumentarQuantidade(index){

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    if(
        carrinho[index].quantidade <
        carrinho[index].estoque
    ){

        carrinho[index].quantidade++;

    }else{

        mostrarToast(
            "Limite do estoque!"
        );
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    carregarCarrinho();
}

function diminuirQuantidade(index){

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    if(
        carrinho[index].quantidade > 1
    ){

        carrinho[index].quantidade--;

    }else{

        carrinho.splice(index,1);
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    carregarCarrinho();
}

function removerCarrinho(index){

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    carrinho.splice(index,1);

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    mostrarToast(
        "Produto removido!"
    );

    carregarCarrinho();
}

/* =========================
PESQUISA
========================= */

function pesquisarProdutos(){

    const input =
        document.getElementById("pesquisa");

    if(!input) return;

    const filtro =
        input.value.toLowerCase();

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const nome =
            produto.querySelector("h3")
            .innerText
            .toLowerCase();

        produto.style.display =
            nome.includes(filtro)
            ? "block"
            : "none";
    });
}

/* =========================
CATEGORIAS
========================= */

function filtrarProdutos(categoria){

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const categoriaProduto =
            produto.dataset.categoria;

        produto.style.display =
            categoria === "todos" ||
            categoriaProduto === categoria
            ? "block"
            : "none";
    });
}

/* =========================
FAVORITOS
========================= */

function toggleFavorito(elemento){

    const produto =
        elemento.parentElement;

    const nome =
        produto.querySelector("h3").innerText;

    const preco =
        produto.querySelector("span").innerText;

    const imagem =
        produto.querySelector("img").src;

    let favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    let existe =
        favoritos.find(
            item => item.nome === nome
        );

    if(existe){

        favoritos =
            favoritos.filter(
                item => item.nome !== nome
            );

        elemento.classList.remove("ativo");

    }else{

        favoritos.push({
            nome,
            preco,
            imagem
        });

        elemento.classList.add("ativo");
    }

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );
}

function carregarFavoritos(){

    let favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const nome =
            produto.querySelector("h3").innerText;

        const coracao =
            produto.querySelector(".favorito");

        if(!coracao) return;

        let existe =
            favoritos.find(
                item => item.nome === nome
            );

        if(existe){

            coracao.classList.add("ativo");
        }
    });
}

/* =========================
CUPOM
========================= */

function aplicarCupom(){

    const cupom =
        document.getElementById("cupom")
        .value
        .toUpperCase();

    const mensagem =
        document.getElementById(
            "mensagem-cupom"
        );

    if(cupom === "NEON10"){

        desconto = 10;

    }else if(cupom === "GAMER20"){

        desconto = 20;

    }else if(cupom === "VIP50"){

        desconto = 50;

    }else{

        desconto = 0;
    }

    mensagem.innerHTML =
        desconto > 0
        ? `Cupom ${desconto}% aplicado!`
        : "Cupom inválido.";

    carregarCarrinho();
}

/* =========================
TEMA
========================= */

function trocarTema(){

    document.body.classList.toggle(
        "light-mode"
    );

    if(
        document.body.classList.contains(
            "light-mode"
        )
    ){

        localStorage.setItem(
            "tema",
            "light"
        );

    }else{

        localStorage.setItem(
            "tema",
            "dark"
        );
    }
}

function carregarTema(){

    const tema =
        localStorage.getItem("tema");

    if(tema === "light"){

        document.body.classList.add(
            "light-mode"
        );
    }
}

/* =========================
PIX
========================= */

function abrirPix(){

    const modal =
        document.getElementById("pix-modal");

    if(!modal) return;

    modal.style.display = "flex";
}

function fecharPix(){

    const modal =
        document.getElementById("pix-modal");

    if(!modal) return;

    modal.style.display = "none";
}

function confirmarPagamento(){

    mostrarToast(
        "Pagamento aprovado!"
    );

    localStorage.removeItem("carrinho");

    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 1500);
}

/* =========================
PERFIL
========================= */

function carregarPerfil(){

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );

    if(!usuario) return;

    const nome =
        document.getElementById(
            "perfil-nome"
        );

    const email =
        document.getElementById(
            "perfil-email"
        );

    if(nome){

        nome.innerHTML =
            usuario.nome;
    }

    if(email){

        email.innerHTML =
            usuario.email;
    }
}

function logout(){

    localStorage.removeItem("logado");

    mostrarToast(
        "Logout realizado!"
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1000);
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

    const loading =
        document.getElementById("loading");

    if(!loading) return;

    setTimeout(() => {

        loading.style.opacity = "0";

        loading.style.visibility =
            "hidden";

    }, 2000);
});
/* =========================
CONTADOR CARRINHO
========================= */

function atualizarContadorCarrinho(){

    const contador =
        document.getElementById(
            "contador-carrinho"
        );

    if(!contador) return;

    let carrinho =
        JSON.parse(
            localStorage.getItem(
                "carrinho"
            )
        ) || [];

    let totalItens = 0;

    carrinho.forEach(produto => {

        totalItens += produto.quantidade;
    });

    contador.innerHTML =
        totalItens;
}