let desconto = 0;

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
            preco,
            imagem,
            quantidade: 1,
            estoque
        });

        mostrarToast(
            nome + " adicionado!"
        );
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );
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
            produto.preco *
            produto.quantidade;

        container.innerHTML += `
        
        <div class="produto">

            <img src="${produto.imagem}">

            <h3>${produto.nome}</h3>

            <span>
                R$ ${produto.preco.toFixed(2)}
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

function filtrarProdutos(categoria){

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const categoriaProduto =
            produto.dataset.categoria;

        if(
            categoria === "todos" ||
            categoriaProduto === categoria
        ){

            produto.style.display = "block";

        }else{

            produto.style.display = "none";
        }
    });
}
function pesquisarProdutos(){

    const input =
        document.getElementById("pesquisa");

    const filtro =
        input.value.toLowerCase();

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const nome =
            produto.querySelector("h3")
            .innerText
            .toLowerCase();

        if(nome.includes(filtro)){

            produto.style.display = "block";

        }else{

            produto.style.display = "none";
        }
    });
}
function toggleFavorito(elemento){

    const produto =
        elemento.parentElement;

    const nome =
        produto.querySelector("h3")
        .innerText;

    const preco =
        produto.querySelector("span")
        .innerText;

    const imagem =
        produto.querySelector("img").src;

    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "favoritos"
            )
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

        elemento.classList.remove(
            "ativo"
        );

    }else{

        favoritos.push({
            nome: nome,
            preco: preco,
            imagem: imagem
        });

        elemento.classList.add(
            "ativo"
        );
    }

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );
}

function carregarFavoritos(){

    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "favoritos"
            )
        ) || [];

    const produtos =
        document.querySelectorAll(
            ".produto"
        );

    produtos.forEach(produto => {

        const nome =
            produto.querySelector("h3")
            .innerText;

        const coracao =
            produto.querySelector(
                ".favorito"
            );

        let existe =
            favoritos.find(
                item => item.nome === nome
            );

        if(existe){

            coracao.classList.add(
                "ativo"
            );
        }
    });
}

carregarFavoritos();

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

        mensagem.innerHTML =
            "Cupom de 10% aplicado!";

    }else if(cupom === "GAMER20"){

        desconto = 20;

        mensagem.innerHTML =
            "Cupom de 20% aplicado!";

    }else if(cupom === "VIP50"){

        desconto = 50;

        mensagem.innerHTML =
            "Cupom VIP de 50% aplicado!";

    }else{

        desconto = 0;

        mensagem.innerHTML =
            "Cupom inválido.";
    }

    carregarCarrinho();
}

function abrirPix(){

    const modal =
        document.getElementById("pix-modal");

    const totalHTML =
        document.getElementById("total");

    const pixTotal =
        document.getElementById("pix-total");

    pixTotal.innerHTML =
        totalHTML.innerHTML;

    modal.style.display = "flex";
}

function fecharPix(){

    document.getElementById(
        "pix-modal"
    ).style.display = "none";
}

function confirmarPagamento(){

    alert("Pagamento aprovado!");

    localStorage.removeItem("carrinho");

    window.location.href =
        "index.html";
}
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

carregarTema();

function adicionarProdutoAdmin(){

    const nome =
        document.getElementById(
            "produto-nome"
        ).value;

    const preco =
        document.getElementById(
            "produto-preco"
        ).value;

    const imagem =
        document.getElementById(
            "produto-imagem"
        ).value;

    const categoria =
        document.getElementById(
            "produto-categoria"
        ).value;

    const estoque =
        document.getElementById(
            "produto-estoque"
        ).value;

    const mensagem =
        document.getElementById(
            "admin-msg"
        );

    if(
        nome === "" ||
        preco === "" ||
        imagem === "" ||
        categoria === "" ||
        estoque === ""
    ){

        mensagem.innerHTML =
            "Preencha todos os campos.";

        return;
    }

    let produtos =
        JSON.parse(
            localStorage.getItem(
                "produtos"
            )
        ) || [];

    produtos.push({
        nome: nome,
        preco: preco,
        imagem: imagem,
        categoria: categoria,
        estoque: estoque
    });

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

    mensagem.innerHTML =
        "Produto adicionado!";
}

function carregarProdutos(){

    const lista =
        document.getElementById(
            "lista-produtos"
        );

    if(!lista) return;

    let produtos =
        JSON.parse(
            localStorage.getItem(
                "produtos"
            )
        ) || [];

    produtos.forEach(produto => {

        lista.innerHTML += `
        
        <div
            class="produto"
            data-categoria="${produto.categoria}"
        >

            <div
                class="favorito"
                onclick="toggleFavorito(this)"
            >
                ❤
            </div>

            <img src="${produto.imagem}">

            <h3>${produto.nome}</h3>

            <p>
                Categoria:
                ${produto.categoria}
            </p>

            <span>
                R$ ${Number(produto.preco)
                    .toFixed(2)}
            </span>

            <button onclick="adicionarCarrinho(
                '${produto.nome}',
                ${produto.preco},
                '${produto.imagem}',
                ${produto.estoque}
            )">
                Comprar
            </button>

        </div>
        `;
    });
}

carregarProdutos();

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

carregarPerfil();

function logout(){

    localStorage.removeItem("logado");

    alert("Logout realizado!");

    window.location.href =
        "login.html";
}

window.addEventListener("load", () => {

    const loading =
        document.getElementById("loading");

    setTimeout(() => {

        loading.style.opacity = "0";

        loading.style.visibility =
            "hidden";

    }, 3000);
});

function carregarPaginaFavoritos(){

    const lista =
        document.getElementById(
            "favoritos-lista"
        );

    if(!lista) return;

    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "favoritos"
            )
        ) || [];

    lista.innerHTML = "";

    favoritos.forEach(produto => {

        lista.innerHTML += `
        
        <div class="produto">

            <div
                class="favorito ativo"
            >
                ❤
            </div>

            <img src="${produto.imagem}">

            <h3>${produto.nome}</h3>

            <span>
                ${produto.preco}
            </span>

            <button onclick="adicionarCarrinho(
                '${produto.nome}',
                199.99,
                '${produto.imagem}',
                10
            )">
                Comprar
            </button>

        </div>
        `;
    });
}

carregarPaginaFavoritos();

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