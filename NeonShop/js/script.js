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
            "Por favor, preencha todos os campos.";

        return;
    }

    const usuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

    mensagem.innerHTML =
        "Cadastro bem-sucedido!";

    setTimeout(() => {

        window.location.href = "login.html";

    }, 1500);
}

/* LOGIN */

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

    if (usuarioSalvo == null) {

        mensagem.innerHTML =
            "Usuário não cadastrado.";

        return;
    }

    if (
        email === usuarioSalvo.email &&
        senha === usuarioSalvo.senha
    ) {

        mensagem.innerHTML =
            "Login bem-sucedido!";

        localStorage.setItem(
            "logado",
            "true"
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

/* CARRINHO */

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

        }else{

            alert("Estoque máximo atingido!");
        }

    }else{

        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1,
            estoque: estoque
        });
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    alert(nome + " adicionado ao carrinho!");
}

/* MOSTRAR CARRINHO */

function carregarCarrinho(){

    const container =
        document.getElementById(
            "carrinho-produtos"
        );

    const totalHTML =
        document.getElementById("total");

    if(!container) return;

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

    totalHTML.innerHTML =
        "TOTAL: R$ " +
        total.toFixed(2);
}

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

    carrinho.splice(index, 1);

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    carregarCarrinho();
}

carregarCarrinho();