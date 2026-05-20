// =============================================
// CHAT DE SUPORTE SIMULADO
// =============================================

const respostas = {
    'oi': 'Olá! Bem-vindo ao suporte da NeonShop! 😊 Como posso te ajudar hoje?',
    'olá': 'Olá! Bem-vindo ao suporte da NeonShop! 😊 Como posso te ajudar hoje?',
    'ola': 'Olá! Como posso te ajudar hoje?',
    'prazo': 'Jogos digitais são entregues em até **24 horas** por email após a confirmação do pagamento. Produtos físicos variam de 3 a 15 dias úteis dependendo da sua região! 🚚',
    'frete': 'O frete é calculado pelo seu CEP! Acesse o carrinho, informe seu CEP e veremos as opções. O frete parte de R$ 15,90 para o Sudeste! 📦',
    'pix': 'Aceitamos pagamento via PIX! Após finalizar o carrinho, será exibido um QR Code para pagamento. A confirmação é instantânea! ⚡',
    'pagamento': 'Aceitamos PIX! É rápido, seguro e sem taxas adicionais. ✅',
    'devolução': 'Aceitamos devoluções em até 7 dias após o recebimento do produto. Entre em contato pelo email suporte@neonshop.com 📧',
    'cupom': 'Temos cupons ativos agora! Use **NEON10** para 10%, **GAMER20** para 20% ou **VIP50** para 50% de desconto! 🎁',
    'desconto': 'Temos cupons incríveis! Use **NEON10** (10%), **GAMER20** (20%) ou **VIP50** (50%) no carrinho! 🎁',
    'produto': 'Trabalhamos com mouses, teclados, fones, monitores, cadeiras e jogos digitais! Acesse a página de Categorias para explorar tudo 🎮',
    'jogo': 'Vendemos jogos digitais! A chave é entregue por email em até 24h após o pagamento. Temos Cyberpunk, GTA V, Elden Ring, Minecraft e muito mais! 🕹️',
    'garantia': 'Todos os produtos físicos têm garantia de 12 meses. Jogos digitais são chaves originais com garantia de funcionamento! ✅',
    'pedido': 'Para acompanhar seu pedido, acesse a página de **Perfil** e veja a aba "Meus Pedidos". Lá você encontra o status de todas as suas compras! 📦',
    'cancelar': 'Pedidos podem ser cancelados antes do envio. Entre em contato pelo suporte@neonshop.com com o número do seu pedido! 📧',
    'obrigado': 'Fico feliz em ajudar! 😊 Qualquer dúvida, é só chamar. Boa compra na NeonShop! 🛒',
    'tchau': 'Até mais! 👋 Boa compra na NeonShop! Se precisar de ajuda, estarei aqui! 😊',
    'default': 'Entendi! Vou passar sua mensagem para um especialista. Enquanto isso, posso te ajudar com informações sobre prazo de entrega, formas de pagamento, cupons de desconto ou status do seu pedido. O que prefere? 😊'
};

function getRespostaBot(msg) {
    const lower = msg.toLowerCase();
    for (const [key, val] of Object.entries(respostas)) {
        if (key !== 'default' && lower.includes(key)) return val;
    }
    return respostas.default;
}

function criarChat() {
    if (document.getElementById('chat-fab')) return;

    const html = `
    <button class="chat-fab" id="chat-fab" onclick="toggleChat()" title="Suporte ao vivo">
        💬
        <span class="chat-badge-notif" id="chat-notif-badge">1</span>
    </button>

    <div class="chat-window" id="chat-window">
        <div class="chat-head">
            <div class="agent-avatar">🤖</div>
            <div class="agent-info">
                <h4>NeonBot</h4>
                <span><span class="online-dot"></span>Online agora</span>
            </div>
            <button class="chat-close" onclick="toggleChat()">✕</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="msg bot">
                <div class="msg-avatar">🤖</div>
                <div>
                    <div class="msg-bubble">Olá! 👋 Sou o NeonBot, assistente virtual da NeonShop. Como posso te ajudar hoje?</div>
                    <div class="msg-time">agora</div>
                </div>
            </div>
        </div>
        <div class="chat-typing" id="chat-typing">
            <div class="msg-avatar" style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,cyan,#0077ff);display:flex;align-items:center;justify-content:center;font-size:14px;">🤖</div>
            <div class="typing-dots"><span></span><span></span><span></span></div>
        </div>
        <div class="chat-quick" id="chat-quick">
            <button class="quick-btn" onclick="enviarRapido('Prazo de entrega')">⏱ Prazo</button>
            <button class="quick-btn" onclick="enviarRapido('Cupons de desconto')">🎁 Cupons</button>
            <button class="quick-btn" onclick="enviarRapido('Como pagar com PIX')">💳 PIX</button>
            <button class="quick-btn" onclick="enviarRapido('Ver meu pedido')">📦 Pedido</button>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Digite sua mensagem..." onkeydown="if(event.key==='Enter')enviarMensagem()">
            <button class="chat-send" onclick="enviarMensagem()">➤</button>
        </div>
    </div>`;

    const el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el.firstElementChild);
    document.body.appendChild(el.lastElementChild);
}

window.toggleChat = function() {
    const win = document.getElementById('chat-window');
    const badge = document.getElementById('chat-notif-badge');
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
        badge.style.display = 'none';
        document.getElementById('chat-input')?.focus();
    }
};

function addMsg(texto, tipo) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
    const div = document.createElement('div');
    div.className = 'msg ' + tipo;
    if (tipo === 'bot') {
        div.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div>
                <div class="msg-bubble">${texto}</div>
                <div class="msg-time">${now}</div>
            </div>`;
    } else {
        div.innerHTML = `
            <div>
                <div class="msg-bubble">${texto}</div>
                <div class="msg-time" style="text-align:right">${now}</div>
            </div>
            <div class="msg-avatar">😎</div>`;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

window.enviarMensagem = function() {
    const input = document.getElementById('chat-input');
    const texto = input?.value.trim();
    if (!texto) return;
    input.value = '';
    addMsg(texto, 'user');
    // Esconder botões rápidos após primeira mensagem
    const quick = document.getElementById('chat-quick');
    if (quick) quick.style.display = 'none';
    // Mostrar typing
    const typing = document.getElementById('chat-typing');
    if (typing) typing.classList.add('show');
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
        if (typing) typing.classList.remove('show');
        addMsg(getRespostaBot(texto), 'bot');
    }, delay);
};

window.enviarRapido = function(texto) {
    const input = document.getElementById('chat-input');
    if (input) input.value = texto;
    enviarMensagem();
};

// =============================================
// SISTEMA DE NOTIFICAÇÕES
// =============================================

const NOTIFICACOES = [
    { id:1, icon:'🔥', titulo:'Promoção relâmpago!', texto:'VIP50: 50% de desconto em tudo por tempo limitado!', time:'agora', unread:true },
    { id:2, icon:'🎮', titulo:'Novo jogo disponível', texto:'Starfield chegou na NeonShop! RPG espacial da Bethesda.', time:'1h atrás', unread:true },
    { id:3, icon:'🚚', titulo:'Frete grátis hoje!', texto:'Pedidos acima de R$ 299 têm frete grátis hoje!', time:'3h atrás', unread:false },
    { id:4, icon:'⭐', titulo:'Novidade: Avaliações', texto:'Agora você pode avaliar os produtos que comprou!', time:'1d atrás', unread:false },
];

function criarNotificacoes() {
    if (document.getElementById('notif-panel')) return;

    const unread = NOTIFICACOES.filter(n => n.unread).length;

    const html = `
    <div id="notif-panel" class="notif-panel">
        <div class="notif-head">
            <h4>🔔 Notificações</h4>
            <button onclick="marcarTodasLidas()">Marcar todas como lidas</button>
        </div>
        <div class="notif-list" id="notif-list"></div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    renderNotificacoes();

    // Adicionar sino na navbar
    const menu = document.querySelector('.menu');
    if (menu && !document.getElementById('notif-bell-btn')) {
        const bell = document.createElement('button');
        bell.id = 'notif-bell-btn';
        bell.className = 'notif-bell';
        bell.style.cssText = 'background:none;border:none;color:#aaa;cursor:pointer;font-size:20px;position:relative;padding:4px;width:auto;margin:0;transition:0.2s;';
        bell.innerHTML = `🔔<span class="notif-count" id="notif-count">${unread}</span>`;
        bell.onclick = toggleNotif;
        bell.title = 'Notificações';
        menu.insertBefore(bell, menu.lastElementChild);
    }
}

function renderNotificacoes() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    if (NOTIFICACOES.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:30px;color:#555;">Nenhuma notificação</div>';
        return;
    }
    list.innerHTML = NOTIFICACOES.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="lerNotif(${n.id})">
            <div class="notif-icon">${n.icon}</div>
            <div class="notif-text">
                <h5>${n.titulo}</h5>
                <p>${n.texto}</p>
                <div class="notif-time">${n.time}</div>
            </div>
            ${n.unread ? '<div class="notif-unread-dot"></div>' : ''}
        </div>`).join('');
}

window.toggleNotif = function() {
    document.getElementById('notif-panel')?.classList.toggle('open');
    document.getElementById('chat-window')?.classList.remove('open');
};

window.lerNotif = function(id) {
    const n = NOTIFICACOES.find(n => n.id === id);
    if (n) n.unread = false;
    const unread = NOTIFICACOES.filter(n => n.unread).length;
    const count = document.getElementById('notif-count');
    if (count) count.textContent = unread || '';
    if (count) count.style.display = unread ? 'flex' : 'none';
    renderNotificacoes();
};

window.marcarTodasLidas = function() {
    NOTIFICACOES.forEach(n => n.unread = false);
    const count = document.getElementById('notif-count');
    if (count) count.style.display = 'none';
    renderNotificacoes();
};

// Fechar ao clicar fora
document.addEventListener('click', e => {
    const panel = document.getElementById('notif-panel');
    const bell  = document.getElementById('notif-bell-btn');
    if (panel && !panel.contains(e.target) && !bell?.contains(e.target)) {
        panel.classList.remove('open');
    }
});

// =============================================
// SISTEMA DE PONTOS
// =============================================

window.getPontos = function() {
    return parseInt(localStorage.getItem('neon-pontos') || '0');
};

window.adicionarPontos = function(valor) {
    const atual = getPontos();
    const ganhos = Math.floor(valor * 10); // 10 pontos por R$1
    const novo = atual + ganhos;
    localStorage.setItem('neon-pontos', novo);
    return ganhos;
};

window.getNivel = function() {
    const p = getPontos();
    if (p >= 10000) return { nivel: 'Lendário 👑', cor: '#ffd700', next: null };
    if (p >= 5000)  return { nivel: 'Diamante 💎', cor: '#00cfff', next: 10000 };
    if (p >= 2000)  return { nivel: 'Ouro ⭐', cor: '#ffa500', next: 5000 };
    if (p >= 500)   return { nivel: 'Prata 🥈', cor: '#aaa', next: 2000 };
    return { nivel: 'Bronze 🥉', cor: '#cd7f32', next: 500 };
};

// Inicializar tudo quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    criarChat();
    criarNotificacoes();
});