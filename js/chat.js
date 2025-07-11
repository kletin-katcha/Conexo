// =================================================================================
//  CONECTARE - CHAT JAVASCRIPT FILE
//  Author: Gemini (adaptado da sua versão funcional)
//  Description: Client-side logic for the chat functionality, including bot responses,
//               typing indicator, and message status (sent, delivered, read),
//               agora com um layout inspirado no Discord para a lista de amigos,
//               e funcionalidades de anexar arquivos, enviar emojis e GIFs.
//               NOVIDADE: Mensagens de voz simuladas e status de "Visto por Último".
//               REVISÃO: Sistema de emoji completamente refeito para ser mais interativo.
// =================================================================================

// Objeto global Chat para encapsular a lógica
const Chat = {
    // Referências para os elementos DOM
    messagesContainer: null,
    messageInput: null,
    sendMessageBtn: null,
    emojiToggleBtn: null,
    emojiPicker: null, // Agora é o container principal do picker
    closeEmojiPickerBtn: null, // Novo botão de fechar
    emojiSearchInput: null, // Novo input de busca
    emojiCategoriesNav: null, // Nova navegação de categorias
    emojiGridContainer: null, // Novo container para as grades de emoji

    chatWindow: null, // A janela de chat completa
    chatPartnerImage: null,
    chatPartnerName: null,
    chatPartnerStatus: null,
    noChatSelectedMessage: null, // Mensagem "Selecione um amigo"

    directMessagesList: null, // Lista para mensagens diretas
    friendSearchInput: null,

    friendsHeaderTitle: null, // Título "Amigos"

    typingIndicator: null,

    // Referências para o modal de todos os amigos
    allFriendsModal: null,
    modalOnlineFriendsList: null,
    modalOfflineFriendsList: null,

    // Referências para o GIF Picker
    gifToggleBtn: null,
    gifPickerModal: null,
    closeGifPickerBtn: null,
    gifSearchInput: null,
    gifResultsContainer: null,
    gifLoadingMessage: null,
    gifNoResultsMessage: null,

    // Referências para anexar arquivos
    fileAttachmentBtn: null,
    fileAttachmentInput: null,

    // Referências para o menu de opções do chat e modal de confirmação
    moreOptionsBtn: null,
    chatOptionsMenu: null,
    clearChatBtn: null,
    clearChatConfirmationModal: null,
    confirmClearChatBtn: null,
    cancelClearChatBtn: null,
    clearChatConfirmModalCloseBtn: null,

    // NOVO: Referências para mensagem de voz
    voiceMessageBtn: null,
    voiceRecordingIndicator: null,
    recordingTimerDisplay: null,
    isRecordingVoice: false,
    recordingStartTime: 0,
    recordingInterval: null,

    // Giphy API Key (Substitua por sua chave real do Giphy Developers)
    GIPHY_API_KEY: 'B8JjBSTQaX5Rjf4RarsxK1Kj96N3r0NA', // <-- CHAVE REAL INSERIDA AQUI

    // Dados de emojis organizados por categoria
    emojiData: {
        'smileys': {
            icon: '😀',
            title: 'Smileys & Emoção',
            emojis: ['😀', '😂', '😍', '🤩', '😎', '🥳', '🤔', '👍', '👎', '👏', '😊', '😇', '🥰', '😘', '🤗', '😏', '😐', '😑', '😒', '🙄', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '🥺', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '👻', '👽', '🤖', '💩']
        },
        'people': {
            icon: '👋',
            title: 'Pessoas',
            emojis: ['👋', '🙏', '💪', '🚶', '🏃', '💃', '🕺', '👯', '👫', '👬', '👭', '🧑‍🤝‍🧑', '👨‍👩‍👧‍👦', '👩‍👩‍👧‍👦', '👨‍👨‍👧‍👦', '👶', '👧', '👦', '👩', '👨', '👵', '👴', '👱‍♀️', '👱‍♂️', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🎓', '👨‍🎓', '👩‍🏫', '👨‍🏫', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎤', '👨‍🎤', '👩‍�', '👨‍🎨', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍🚒', '👨‍🚒', '🕵️‍♀️', '🕵️‍♂️', '💂‍♀️', '💂‍♂️', '🧕', '🧑‍🦱', '🧑‍🦰', '🧑‍🦳', '🧑‍🦲', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '🧙‍♀️', '🧙‍♂️', '🧚‍♀️', '🧚‍♂️', '🧛‍♀️', '🧛‍♂️', '🧜‍♀️', '🧜‍♂️', '🧝‍♀️', '🧝‍♂️', '🧞‍♀️', '🧞‍♂️', '🧟‍♀️', '🧟‍♂️']
        },
        'animals': {
            icon: '🐶',
            title: 'Animais & Natureza',
            emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦋', '🐝', '🐞', '🐠', '🐳', '🐬', '🐢', '🐍', '🦎', '🦖', '🦕', '🕷️', '🕸️', '🌸', '🌹', '🌺', '🌻', '🌼', '🌳', '🌲', '🌴', '🌵', '🌾', '🍄', '🍂', '🍁', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '⭐️', '🌟', '💫', '✨', '⚡', '🔥', '💥', '☄️', '☀️', '🌈', '🌧️', '☁️', '☔', '🌊', '🌬️', '🌪️', '🌫️', '💧', '💦']
        },
        'food': {
            icon: '🍕',
            title: 'Comida & Bebida',
            emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🌮', '🌯', '🥙', '🍝', '🍜', '🍲', '🍣', '🍤', '🍚', '🍙', '🍞', '🥐', '🥖', '🧀', '🥚', '🍳', '🥓', '🥩', '🍗', '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🍄', '🌰', '🥜', '🍯', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤']
        },
        'activities': {
            icon: '⚽',
            title: 'Atividades',
            emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🥅', '⛳', '🎯', '🏹', '🎣', '🥊', '🥋', '⛸️', '⛷️', '🏂', '🏋️‍♀️', '🏋️‍♂️', '🤸‍♀️', '🤸‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🤺', '🤼‍♀️', '🤼‍♂️', '🤽‍♀️', '🤽‍♂️', '🚴‍♀️', '🚴‍♂️', '🚵‍♀️', '🚵‍♂️', '🏇', '🏌️‍♀️', '🏌️‍♂️', '🏄‍♀️', '🏄‍♂️', '🚣‍♀️', '🚣‍♂️', '🏊‍♀️', '🏊‍♂️', '🧜‍♀️', '🧜‍♂️', '🎮', '🕹️', '🎲', '🧩', '🎭', '🎨', '🧵', '🧶', '🎼', '🎵', '🎶', '🎤', '🎧', '🥁', '🎷', '🎺', '🎸', '🎻', '🎹', '🎬', '🎪', '🎫', '🏆', '🏅', '🎖️', '🎗️', '🎁', '🎈', '🎉', '🎊', '🎀', '🪄', '🔮']
        },
        'travel': {
            icon: '✈️',
            title: 'Viagens & Lugares',
            emojis: ['✈️', '🚀', '🛸', '🛰️', '🚁', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🚲', '🛵', '🏍️', '🛣️', '🛤️', '🌉', 'tunnel', 'ferry', 'boat', '🚢', '⚓', '⛵', '🗺️', '🧭', '🏨', 'motel', 'bed', 'building', 'house', 'cityscape', 'sunrise', 'sunset']
        },
        'objects': {
            icon: '💡',
            title: 'Objetos',
            emojis: ['💡', '📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '💾', '💿', '📀', '🔋', '🔌', '💡', '🔦', '🕯️', '🗑️', '🛢️', '💸', '💰', '💳', '💎', '⚖️', '🔨', '⛏️', '🔧', '🔩', '⚙️', '⛓️', '🔪', '🗡️', '🔫', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '💈', '⚗️', '🔭', '🔬', '🕳️', '💊', '🩹', '💉', '🩸', '🧬', '🦠', '🧪', '🌡️', '🚽', '🚿', '🛁', '🧼', '🪥', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🪠', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🖼️', 'mirror', 'window', 'umbrella', 'bag', 'purse', 'wallet', 'luggage']
        },
        'symbols': {
            icon: '❤️',
            title: 'Símbolos',
            emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '💫', '💥', '🔥', '💯', '✅', '☑️', '✔️', '❌', '❎', '✖️', '❓', '❔', '❕', '❗', '⁉️', '‼', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '♾️', '©️', '®️', '™️', '〰️', '〽️', '▪️', '▫️', '🔺', '🔻', '🔲', '🔳', '⚫', '⚪', '🔴', '🔵', '🟩', '🟧', '🟨', '🟦', '🟪', '🟫', '⬛', '⬜']
        }
    },

    humorAtual: ['normal', 'engraçado', 'ranzinza'][Math.floor(Math.random() * ['normal', 'engraçado', 'ranzinza'].length)],

    // Dados dos amigos (substituindo 'conversas' por 'amigos' para melhor semântica)
    amigos: {
        'ana': {
            name: 'Ana Livia',
            avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg',
            status: 'online', // online, offline, away, dnd
            lastSeen: 'Online', // Será atualizado para hora ou "Online"
            messages: []
        },
        'carlos': {
            name: 'Carlos Souza',
            avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg',
            status: 'offline',
            lastSeen: 'Visto por último: 18:30', // Exemplo de "Visto por último"
            messages: []
        }
    },

    amigoAtivoId: null,

    // Dicionários de respostas
    anaResponses: {
        'bom dia': ["Bom dia, tudo bem?", "Bom dia! Como você está?", "Bom dia!", "Oi, bom dia!"],
        'boa tarde': ["Boa tarde! Tudo tranquilo?", "Boa tarde! Como está sendo sua tarde?", "Boa tarde! Alguma novidade?"],
        'boa noite': ["Boa noite! Tudo em paz?", "Boa noite! Descansando já?", "Boa noite! Como foi o dia?"],
        'oi': ["Oi! Tudo bem?", "Olá! Como vai?", "E aí! Tudo em ordem?", "Oi! Que bom te ver por aqui!"],
        'ola': ["Oi! Tudo bem?", "Olá! Como vai?", "E aí! Tudo em ordem?", "Oi! Que bom te ver por aqui!"],
        'tudo bem': ["Tudo ótimo por aqui! E com você?", "Vou bem, obrigada! E você, como está?", "Tudo tranquilo! E por aí, alguma novidade?", "Estou super bem! E você, o que me conta de bom?"],
        'como vai': ["Tudo ótimo por aqui! E com você?", "Vou bem, obrigada! E você, como está?", "Tudo tranquilo! E por aí, alguma novidade?", "Estou super bem! E você, o que me conta de bom?"],
        'estou bem': ["Que bom! E você?", "Que ótimo! E por aí?", "Ah, que bom! E vc?", "Legal! E você?"],
        'o que voce faz': ["Estou aqui, pronta pra conversar! E você, o que está aprontando?", "No momento, estou focada em te dar a melhor experiência de chat! E você?", "Estou sempre aprendendo e pronta para interagir! O que você está fazendo de bom?"],
        'o que esta fazendo': ["Estou aqui, pronta para conversar! E você, o que está aprontando?", "No momento, estou focada em te dar a melhor experiência de chat! E você?", "Estou sempre aprendendo e pronta para interagir! O que você está fazendo de bom?"],
        'ajuda': ["Claro! Diga-me o que você precisa.", "Posso tentar ajudar! Qual é a sua dúvida?", "Conte comigo! No que posso ser útil?"],
        'obrigado': ["De nada!", "Disponha!", "Imagina! Fico feliz em ajudar."],
        'tchau': ["Até mais!", "Tchau! Se cuida!", "Até logo!"],
        'qual seu nome': ["Meu nome é Ana Livia, prazer em te conhecer!", "Pode me chamar de Ana. E o seu?"],
        'piada': ["Por que o tomate não anda de bicicleta? Porque ele refoga! 😂", "O que o pato disse para a pata? Vem Quá!", "Qual é o animal mais antigo do mundo? A zebra, porque ela é preta e branca!"],
        'filme': ['Ah, sim! Qual filme você está pensando em ver? Tenho algumas sugestões se quiser!', 'Filme é sempre uma boa pedida! Me diz o que você gosta de assistir.'],
        'cinema': ['Cinema é uma ótima ideia! Tem algum gênero que você prefere?', 'Adoro ir ao cinema! Qual filme está em cartaz que te interessa?'],
        'link': ['O link é esse: [link fictício]. Me diz o que achou depois! Mal posso esperar pra saber sua opinião.', 'Aqui está o link: [link fictício]. Espero que seja útil!'],
        'marcar': ['Perfeito! Me avisa o dia e a hora que fica bom para você. Podemos ver um filme ou só bater um papo.', 'Ótimo! Que dia e hora seriam bons para você?'],
        'fim de semana': ['Sim! O que você tem em mente para o fim de semana? Adoro planejar algo divertido!', 'O fim de semana está chegando! Algum plano especial?'],
        'legal': ['Que bom que achou legal!', 'Fico feliz que tenha gostado!'],
        'default': ["Não entendi. Poderia reformular?", "Hmm, não entendi. Pode repetir?", "Desculpe, não peguei essa. Pode explicar melhor?", "Não entendi. O que você quis dizer?", "Pode me dar mais detalhes? Não entendi muito bem."]
    },
    carlosResponses: { // Renomeado para Carlos
        'bom dia': [
            "Bom dia!", "E aí, boa tarde.", "Bom diaaa ☀️", "Oi, bom dia! Tudo certo?",
            "Bom dia, dormiu bem?", "Bom dia! Acordou cedo hoje?", "Bom dia! Já tomou café?",
            "Bom dia! Bora começar o dia?"
        ],
        'boa tarde': [
            "Boa tarde!", "E aí, boa tarde.", "Boa tarde! Já almoçou?", "Oi! Boa tarde ☀️",
            "Boa tarde, tudo certo por aí?", "Boa tarde! Como tá o dia?", "Boa tarde! Muito calor aí?",
            "Boa tarde, como vai?"
        ],
        'boa noite': [
            "Boa noite!", "Oi, boa noite.", "Boa noite! Descansando?", "Boa noite 🌙",
            "Boa noite! Foi puxado o dia?", "Boa noite! Já de pijama?", "Boa noite! Até amanhã."
        ],
        'oi': [
            "Oi!", "Oii", "E aí!", "Oi, tudo bem?", "Oi, sumido 😄", "Oi, como cê tá?",
            "Oi, o que manda?", "Fala!"
        ],
        'ola': [
            "Olá!", "Oi!", "Oii", "E aí!", "Oi, tudo certo?"
        ],
        'tudo bem': [
            "Tudo sim, e contigo?", "Tudo tranquilo! E aí?", "Tô bem! E você?",
            "Tudo certo por aqui.", "Na paz. E por aí?",
            "Tudo nos conformes!"
        ],
        'como vai': [
            "Vou bem, e você?", "Tudo certo, e aí?", "Na correria, mas bem. E você?",
            "Tô indo! E você?", "Tô legal, e tu?"
        ],
        'estou bem': ["Que bom!", "Fico feliz 🙂", "Aí sim!", "Ótimo saber!", "Boa!", "Maravilha!",
            "Que notícia boa!"
        ],
        'o que voce faz': [
            "Nada demais, e você?", "Tô aqui de bobeira.", "Só conversando por aqui.",
            "Tava esperando você aparecer.", "Passando o tempo, e você?", "Tô online só, e você?",
            "Tô pensando na vida, haha."
        ],
        'o que esta fazendo': [
            "Nada demais, e você?", "Tô aqui de bobeira.", "Só conversando por aqui.",
            "Tava esperando você aparecer.", "Passando o tempo, e você?", "Tô online só, e você?",
            "Tô pensando na vida, haha."
        ],
        'ajuda': [
            "Claro, no que posso ajudar?", "Manda aí!", "Pode falar, tô aqui.",
            "Tô ouvindo, fala aí.", "Pode contar comigo!", "No que posso ser útil!"
        ],
        'obrigado': [
            "De nada!", "Imagina!", "Tamo junto!", "Disponha 🙂", "É nóis!", "Que nada!",
            "Fico feliz em ajudar!"
        ],
        'tchau': [
            "Tchau!", "Falou!", "Até mais!", "Se cuida!", "Fui!", "A gente se fala!",
            "Até a próxima!"
        ],
        'qual seu nome': [
            "Ah, meu nome? Eu sou só um bot 😅", "Pode me chamar de Chatzinho mesmo.",
            "Ainda não tenho nome... me dá um?", "Nome? Vixi, não pensei nisso!",
            "Sou só eu mesmo, do outro lado da tela.", "Não tenho um nome formal, mas pode me chamar do que quiser!"
        ],
        'piada': [
            "Por que o lápis foi pro médico? Porque ele tava sem ponta! 😄",
            "O que o zero disse pro oito? Que cinto maneiro! 😂",
            "Sabe por que o computador foi preso? Porque executou um programa!",
            "O que a impressora falou pra folha? Tá na minha!",
            "O que o pato disse para a pata? Vem Quá!",
            "Qual é o animal mais antigo do mundo? A zebra, porque ela é preta e branca!"
        ],
        'filme': [
            'Ah, sim! Qual filme você está pensando em ver? Tenho algumas sugestões se quiser!',
            'Filme é sempre uma boa pedida! Me diz o que você gosta de assistir.',
            'Adoro um bom filme! Qual gênero você curte mais?',
            'Já viu algum filme bom ultimamente? Me indica um!'
        ],
        'cinema': [
            'Cinema é uma ótima ideia! Tem algum gênero que você prefere?',
            'Adoro ir ao cinema! Qual filme está em cartaz que te interessa?',
            'Pipoca e cinema, combinação perfeita! Qual a boa de hoje!'
        ],
        'link': [
            'O link é esse: [link fictício]. Me diz o que achou depois! Mal posso esperar pra saber sua opinião.',
            'Aqui está o link: [link fictício]. Espero que seja útil!',
            'Consegui o link! É [link fictício]. Dá uma olhada lá!',
            'Prontinho, o link é [link fictício]. Qualquer coisa me avisa!'
        ],
        'marcar': [
            'Perfeito! Me avisa o dia e a hora que fica bom para você. Podemos ver um filme ou só bater um papo.',
            'Ótimo! Que dia e hora seriam bons para você?',
            'Combinado! Qual dia e horário funcionam melhor pra você?',
            'Bora marcar! Me fala sua disponibilidade.'
        ],
        'fim de semana': [
            'Sim! O que você tem em mente para o fim de semana? Adoro planejar algo divertido!',
            'O fim de semana está chegando! Algum plano especial?',
            'Fim de semana é tudo de bom! O que você vai aprontar?',
            'Ansioso(a) para o fim de semana? O que vai fazer de bom?'
        ],
        'legal': [
            'Que bom que achou legal!', 'Fico feliz que tenha gostado!', 'Né?!', 'Demais!',
            'Pois é!', 'Concordo!', 'Massa!'
        ],
        'foto': [
            'Sim, enviei uma foto nova! Gostou? É do meu último projeto.',
            'Mandei uma foto sim! Me diz o que achou.',
            'Chegou a foto? Espero que goste!',
            'Tirei uma foto agora, quer ver?'
        ],
        'projeto': [
            'Ah, o projeto! Estou trabalhando em uma nova funcionalidade que vai ser bem legal. Quer saber mais?',
            'O projeto está a todo vapor! Em breve teremos novidades.',
            'O projeto tá dando trabalho, mas vai ficar incrível!',
            'Foco total no projeto! E você, algum projeto novo?'
        ],
        'novidade': [
            'Sempre tem novidade por aqui! E você, alguma coisa boa pra contar?',
            'Novidades? Sempre! E por aí, o que de bom?',
            'A vida é cheia de novidades, né? Qual a sua mais recente?'
        ],
        'musica': [
            'Música é sempre bom! Qual som você tem escutado ultimamente?',
            'Música é vida! Qual a sua playlist do momento?',
            'Me indica uma música boa! Tô precisando de novidades.',
            'Qual sua banda/artista favorito(a)?'
        ],
        'jogos': [
            'Jogos! Esse é o forte. Tem algum jogo novo que você está de olho?',
            'Adoro jogos! Qual você tem jogado ultimamente?',
            'Bora jogar alguma coisa? Qual seu jogo preferido?',
            'Qual seu console favorito?'
        ],
        'o que vai fazer hoje': [
            "Ah, nada demais, só relaxar. E você?", "Tenho umas coisas pra resolver, mas nada muito sério. E você, o que vai fazer?",
            "Ainda não sei, tô pensando em algo legal. Alguma sugestão?", "Tô pensando em maratonar uma série. E você?"
        ],
        'quais seus planos': [
            "Por enquanto, só curtir. E os seus?", "Meus planos são bem tranquilos hoje. E os seus?",
            "Ainda tô decidindo, a vida é cheia de possibilidades, né? Haha."
        ],
        'como foi seu dia': [
            "Foi tranquilo, e o seu?", "Bem corrido, mas consegui fazer tudo. E o seu?",
            "Normal, nada de muito emocionante. E o seu, como foi?", "Foi bom, obrigada por perguntar! E o seu?"
        ],
        'ta chovendo ai': [
            "Aqui tá solzão! E aí?", "Tá nublado, mas sem chuva. E por aí?",
            "Chovendo um pouco, mas nada demais.", "Sim, tá caindo uma chuvinha. E aí?"
        ],
        'como ta o tempo': [
            "Aqui tá solzão! E aí?", "Tá nublado, mas sem chuva. E por aí?",
            "Chovendo um pouco, mas nada demais.", "O tempo tá meio doido, né? Aqui tá [sol/chuva/nublado]."
        ],
        'o que voce comeu': [
            "Ainda não comi, tô pensando no que fazer. E você?", "Já almocei/jantei, tava bom demais! E você?",
            "Comi uma coisa simples, mas gostosa. E você?"
        ],
        'ta com fome': [
            "Tô com uma fominha sim, pensando no que beliscar.", "Um pouco! E você?",
            "Não muito, acabei de comer."
        ],
        'que massa': [
            "Né?!", "Demais!", "Pois é!", "Concordo!", "Massa mesmo!", "Muito bom!"
        ],
        'serio': [
            "Sério!", "Juro!", "Pode crer!", "Sim, de verdade!", "Seríssimo!"
        ],
        'jura': [
            "Sério!", "Juro!", "Pode crer!", "Sim, de verdade!", "Juro por tudo!"
        ],
        'nao acredito': [
            "Pois é, acontece!", "Acredite!", "É pra rir, né?", "Pode acreditar!"
        ],
        'me conta mais': [
            "O que você quer saber?", "Sobre o que?", "Pode perguntar!", "Estou ouvindo!"
        ],
        'o que voce acha': [
            "Hmm, difícil dizer...", "Acho que depende.", "Tenho que pensar um pouco.",
            "Minha opinião é que...", "Acho que é uma boa ideia!"
        ],
        'desculpa': [
            "De boa!", "Sem problemas!", "Relaxa!", "Tranquilo!", "Acontece!"
        ],
        'saudade': [
            "Eu também!", "Muita!", "Que bom que lembrou!", "Saudade demais!"
        ],
        'e ai': [
            "Tudo certo?", "Na paz?", "Qual a boa?", "Tudo tranquilo?"
        ],
        'default': [
            "Não entendi 🤔", "Como assim?", "Pode repetir?", "Não peguei...",
            "Hã?", "Pode explicar melhor?", "Fala de novo, por favor.",
            "Desculpe, não entendi o que você quis dizer.", "Poderia ser mais específico?"
        ]
    },


    init() {
        // Carrega as conversas salvas no sessionStorage
        const salvas = JSON.parse(sessionStorage.getItem('todasConversas')) || {};
        // Mescla os dados dos amigos salvos com os dados padrão, garantindo a estrutura
        for (const id in this.amigos) {
            if (salvas[id]) {
                this.amigos[id] = { ...this.amigos[id], ...salvas[id], messages: salvas[id].messages || [] };
            }
        }
        this.cacheDOMElements(); // Garante que os elementos DOM sejam armazenados em cache
        this.renderEmojiPicker(); // <--- CHAME AQUI PRIMEIRO
        this.renderizarListaAmigos(); // Renderiza a lista de amigos inicialmente
        this.addEventListeners();
    },

    cacheDOMElements() {
        this.messagesContainer = document.getElementById('message-area');
        this.messageInput = document.getElementById('chat-input');
        this.sendMessageBtn = document.getElementById('send-message-btn');
        this.emojiToggleBtn = document.getElementById('emoji-toggle-btn');
        this.emojiPicker = document.getElementById('emoji-picker'); // Agora é o container principal
        
        if (this.emojiPicker) {
            this.closeEmojiPickerBtn = this.emojiPicker.querySelector('.close-emoji-picker-btn');
            this.emojiSearchInput = document.getElementById('emoji-search-input');
            this.emojiCategoriesNav = document.getElementById('emoji-categories-nav');
            this.emojiGridContainer = document.getElementById('emoji-grid-container');
        } else {
            console.error("ERRO: Elemento 'emoji-picker' não encontrado no DOM. O seletor de emojis não funcionará.");
        }

        this.chatWindow = document.getElementById('chat-window');
        this.chatPartnerImage = document.getElementById('chat-window-avatar');
        this.chatPartnerName = document.getElementById('chat-window-name');
        this.chatPartnerStatus = document.getElementById('chat-window-status');
        this.noChatSelectedMessage = document.getElementById('no-chat-selected-message');

        this.directMessagesList = document.getElementById('direct-messages-list');
        this.friendSearchInput = document.querySelector('.friends-sidebar .search-bar input[type="search"]');

        this.friendsHeaderTitle = document.getElementById('friends-header-title');

        this.typingIndicator = document.getElementById('typing-indicator');

        this.allFriendsModal = document.getElementById('all-friends-modal');
        this.modalOnlineFriendsList = document.getElementById('modal-online-friends-list');
        this.modalOfflineFriendsList = document.getElementById('modal-offline-friends-list');

        this.gifToggleBtn = document.getElementById('gif-toggle-btn');
        this.gifPickerModal = document.getElementById('gif-picker-modal');
        this.closeGifPickerBtn = document.getElementById('close-gif-picker');
        this.gifSearchInput = document.getElementById('gif-search-input');
        this.gifResultsContainer = document.getElementById('gif-results-container');
        this.gifLoadingMessage = document.getElementById('gif-loading-message');
        this.gifNoResultsMessage = document.getElementById('gif-no-results-message');

        // Referências para anexar arquivos
        this.fileAttachmentBtn = document.getElementById('file-attachment-btn');
        this.fileAttachmentInput = document.getElementById('file-attachment-input');

        // Referências para o menu de opções do chat e modal de confirmação
        this.moreOptionsBtn = document.getElementById('more-options-btn');
        this.chatOptionsMenu = document.getElementById('chat-options-menu');
        this.clearChatBtn = document.getElementById('clear-chat-btn');
        this.clearChatConfirmationModal = document.getElementById('clear-chat-confirmation-modal');
        this.confirmClearChatBtn = document.getElementById('confirm-clear-chat-btn');
        this.cancelClearChatBtn = document.getElementById('cancel-clear-chat-btn');
        this.clearChatConfirmModalCloseBtn = document.getElementById('clear-chat-confirm-modal-close-btn');

        // NOVO: Referências para mensagem de voz
        this.voiceMessageBtn = document.getElementById('voice-message-btn');
        this.voiceRecordingIndicator = document.getElementById('voice-recording-indicator');
        this.recordingTimerDisplay = document.getElementById('recording-timer');
    },

    addEventListeners() {
        // Event listener para o título "Amigos"
        if (this.friendsHeaderTitle) {
            this.friendsHeaderTitle.addEventListener('click', () => {
                this.resetChatView();
            });
        }

        // Event listener para o botão de enviar mensagem
        if (this.sendMessageBtn) {
            this.sendMessageBtn.onclick = () => {
                const texto = this.messageInput.value.trim();
                console.log("Tentando enviar mensagem. Texto:", texto, "ID do Amigo Ativo:", this.amigoAtivoId); // Log de depuração

                if (!this.amigoAtivoId) {
                    console.error("Nenhum amigo ativo selecionado. Mensagem não enviada. Por favor, clique em um amigo na barra lateral para iniciar uma conversa.");
                    return;
                }

                if (!texto) { // Verifica se o texto está realmente vazio após o trim
                    console.warn("O texto da mensagem está vazio. Não enviando.");
                    return;
                }

                // Não verifica mais se é URL de GIF aqui, pois o GIF é enviado pelo picker
                this.adicionarMensagem(this.amigoAtivoId, texto, 'sent', 'sent', 'text');
                
                this.messageInput.value = '';
                if (this.emojiPicker) this.emojiPicker.classList.add('hidden');

                const sentMessageIndex = this.amigos[this.amigoAtivoId].messages.length - 1;

                // Atraso para "delivered"
                setTimeout(() => {
                    if (this.amigos[this.amigoAtivoId].messages[sentMessageIndex].contentType === 'text') {
                        this.atualizarMensagem(this.amigoAtivoId, sentMessageIndex, texto, 'sent', 'delivered');
                    }
                }, 500); // 0.5 segundos para Delivered

                if (this.typingIndicator) {
                    const currentFriend = this.amigos[this.amigoAtivoId];
                    if (currentFriend) {
                        this.typingIndicator.querySelector('.typing-avatar').src = currentFriend.avatar;
                    }
                    this.typingIndicator.classList.remove('hidden');
                }
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

                // Atraso para resposta do bot e "read"
                setTimeout(() => {
                    const resposta = this.gerarResposta(texto);
                    if (this.typingIndicator) this.typingIndicator.classList.add('hidden');

                    this.adicionarMensagem(this.amigoAtivoId, resposta, 'received', 'read', 'text'); // Respostas do bot são sempre texto

                    if (this.amigos[this.amigoAtivoId].messages[sentMessageIndex].contentType === 'text') {
                        this.atualizarMensagem(this.amigoAtivoId, sentMessageIndex, texto, 'sent', 'read');
                    }
                    this.tocarSom();
                }, 2500); // 2.5 segundos para resposta do bot e Read
            };
        }

        // Event listener para enviar mensagem ao pressionar Enter
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessageBtn.click();
                }
            });
        }

        // Event listener para a pesquisa de amigos
        if (this.friendSearchInput) {
            this.friendSearchInput.addEventListener('input', (event) => {
                this.renderizarListaAmigos(event.target.value);
            });
        }

        // Lógica para o NOVO Emoji Picker
        if (this.emojiToggleBtn && this.emojiPicker) {
            this.emojiToggleBtn.addEventListener('click', (e) => {
                console.log("Emoji toggle button clicked!"); // Log para verificar o clique
                e.stopPropagation();
                this.emojiPicker.classList.toggle('hidden');
                if (!this.emojiPicker.classList.contains('hidden')) {
                    if (this.gifPickerModal) this.gifPickerModal.classList.add('hidden'); // Fecha o GIF picker
                    if (this.voiceRecordingIndicator) this.voiceRecordingIndicator.classList.add('hidden'); // Esconde o indicador de voz
                    if (this.emojiSearchInput) this.emojiSearchInput.value = ''; // Limpa a busca
                    this.filterEmojis(''); // Reseta o filtro
                }
            });

            if (this.closeEmojiPickerBtn) { // Verificação adicional
                this.closeEmojiPickerBtn.addEventListener('click', () => this.emojiPicker.classList.add('hidden'));
            }

            document.addEventListener('click', (e) => {
                if (this.emojiPicker && !this.emojiPicker.contains(e.target) && e.target !== this.emojiToggleBtn) {
                    this.emojiPicker.classList.add('hidden');
                }
            });

            if (this.emojiSearchInput) { // Verificação adicional
                this.emojiSearchInput.addEventListener('input', (e) => this.filterEmojis(e.target.value));
            }

            if (this.emojiGridContainer) { // Verificação adicional
                this.emojiGridContainer.addEventListener('click', (e) => {
                    const emojiBtn = e.target.closest('.emoji-btn');
                    if (emojiBtn) {
                        const emoji = emojiBtn.textContent;
                        const start = this.messageInput.selectionStart;
                        const end = this.messageInput.selectionEnd;
                        this.messageInput.value = this.messageInput.value.substring(0, start) + emoji + this.messageInput.value.substring(end);
                        this.messageInput.focus();
                        this.messageInput.selectionEnd = start + emoji.length;
                        this.emojiPicker.classList.add('hidden');
                        this.sendMessageBtn.click(); // Envia a mensagem com o emoji
                    }
                });
            }
        } else {
            console.warn("Botão de emoji ou seletor de emojis não encontrados. A funcionalidade de emoji pode estar desabilitada.");
        }

        // Event listeners para o GIF Picker
        if (this.gifToggleBtn && this.gifPickerModal) {
            this.gifToggleBtn.addEventListener('click', () => this.openGifPicker());
            if (this.closeGifPickerBtn) { // Verificação adicional
                this.closeGifPickerBtn.addEventListener('click', () => this.closeGifPicker());
            }
            this.gifPickerModal.addEventListener('click', (e) => {
                if (e.target === this.gifPickerModal) { // Fecha se clicar fora do conteúdo
                    this.closeGifPicker();
                }
            });
            // Debounce para a busca de GIFs
            let searchTimeout;
            if (this.gifSearchInput) { // Verificação adicional
                this.gifSearchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.fetchGifs(e.target.value);
                    }, 500); // Atraso de 500ms para começar a buscar
                });
            }
            if (this.gifResultsContainer) { // Verificação adicional
                this.gifResultsContainer.addEventListener('click', (e) => this.handleGifSelection(e));
            }
        }

        // Event listeners para anexar arquivos
        if (this.fileAttachmentBtn) {
            this.fileAttachmentBtn.addEventListener('click', () => {
                this.fileAttachmentInput.click();
            });
        }

        if (this.fileAttachmentInput) {
            this.fileAttachmentInput.addEventListener('change', (e) => this.handleFileAttachment(e));
        }

        // Lógica para o menu de opções do chat (três pontinhos)
        if (this.moreOptionsBtn && this.chatOptionsMenu) {
            this.moreOptionsBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique se propague para o document
                this.chatOptionsMenu.classList.toggle('hidden');
            });

            // Fecha o menu se clicar fora dele
            document.addEventListener('click', (e) => {
                if (this.chatOptionsMenu && !this.chatOptionsMenu.contains(e.target) && e.target !== this.moreOptionsBtn) {
                    this.chatOptionsMenu.classList.add('hidden');
                }
            });
        }

        // Lógica para o botão "Limpar Conversa" e modal de confirmação
        if (this.clearChatBtn) {
            this.clearChatBtn.addEventListener('click', () => {
                this.chatOptionsMenu.classList.add('hidden'); // Esconde o menu de opções
                this.openClearChatConfirmationModal();
            });
        }

        if (this.confirmClearChatBtn) {
            this.confirmClearChatBtn.addEventListener('click', () => this.clearActiveChat());
        }

        if (this.cancelClearChatBtn) {
            this.cancelClearChatBtn.addEventListener('click', () => this.closeClearChatConfirmationModal());
        }

        if (this.clearChatConfirmModalCloseBtn) {
            this.clearChatConfirmModalCloseBtn.addEventListener('click', () => this.closeClearChatConfirmationModal());
        }

        if (this.clearChatConfirmationModal) {
            this.clearChatConfirmationModal.addEventListener('click', (e) => {
                if (e.target === this.clearChatConfirmationModal) {
                    this.closeClearChatConfirmationModal();
                }
            });
        }

        // NOVO: Event listeners para mensagem de voz
        if (this.voiceMessageBtn) {
            // MOUSE EVENTS
            this.voiceMessageBtn.addEventListener('mousedown', (e) => this.startVoiceRecording(e));
            document.addEventListener('mouseup', (e) => this.stopVoiceRecording(e));

            // TOUCH EVENTS for mobile
            this.voiceMessageBtn.addEventListener('touchstart', (e) => this.startVoiceRecording(e), { passive: false });
            document.addEventListener('touchend', (e) => this.stopVoiceRecording(e));
        }
    },

    // NOVO: Função para resetar a visualização do chat
    resetChatView() {
        document.querySelectorAll('.friend-item').forEach(item => {
            item.classList.remove('active');
        });
        this.amigoAtivoId = null; // Reseta o amigo ativo
        this.chatWindow.classList.add('hidden'); // Esconde a janela de chat
        this.noChatSelectedMessage.classList.remove('hidden'); // Mostra a mensagem de seleção
        this.messagesContainer.innerHTML = ''; // Limpa as mensagens
    },

    // Função para renderizar a lista de amigos na sidebar principal (Mensagens Diretas)
    renderizarListaAmigos(filtro = '') {
        this.directMessagesList.innerHTML = ''; // Limpa a lista de mensagens diretas

        // Apenas Ana e Carlos aparecerão na lista de Mensagens Diretas, com seus status fixos
        const amigosParaDM = ['ana', 'carlos'];

        amigosParaDM.forEach(id => {
            const amigo = this.amigos[id];
            const lowerCaseName = amigo.name.toLowerCase();

            if (filtro === '' || lowerCaseName.includes(filtro.toLowerCase())) {
                const friendItem = document.createElement('li');
                friendItem.classList.add('friend-item');
                friendItem.dataset.friendId = id;

                // Adiciona a classe 'active' se for o amigo ativo
                if (id === this.amigoAtivoId) {
                    friendItem.classList.add('active');
                }

                // Determina o status a ser exibido
                let statusDotClass = '';
                let statusTextContent = '';

                if (amigo.status === 'online') {
                    statusDotClass = 'status-online';
                    statusTextContent = 'Online';
                } else {
                    statusDotClass = 'status-offline';
                    statusTextContent = amigo.lastSeen; // Usa o "Visto por último" para offline
                }

                friendItem.innerHTML = `
                    <img src="${amigo.avatar}" alt="Avatar de ${amigo.name}" class="friend-avatar">
                    <div class="friend-details">
                        <span class="friend-name">${amigo.name}</span>
                        <span class="friend-status">
                            <span class="friend-status-dot ${statusDotClass}"></span>
                            ${statusTextContent}
                        </span>
                    </div>
                `;

                friendItem.addEventListener('click', () => {
                    this.selecionarAmigo(id);
                });

                this.directMessagesList.appendChild(friendItem);
            }
        });
    },

    // NOVO: Função para renderizar a lista de todos os amigos no modal
    renderAllFriendsInModal() {
        if (!this.modalOnlineFriendsList || !this.modalOfflineFriendsList) return;

        this.modalOnlineFriendsList.innerHTML = '';
        this.modalOfflineFriendsList.innerHTML = '';

        for (const id in this.amigos) {
            const amigo = this.amigos[id];
            const friendItem = document.createElement('li');
            friendItem.classList.add('modal-friend-item');
            friendItem.dataset.friendId = id;

            let statusDotClass = '';
            let statusTextContent = '';

            if (amigo.status === 'online') {
                statusDotClass = 'status-online';
                statusTextContent = 'Online';
            } else {
                statusDotClass = 'status-offline';
                statusTextContent = amigo.lastSeen;
            }

            friendItem.innerHTML = `
                <img src="${amigo.avatar}" alt="Avatar de ${amigo.name}" class="modal-friend-avatar">
                <div class="friend-details">
                    <span class="modal-friend-name">${amigo.name}</span>
                    <span class="modal-friend-status">
                        <span class="modal-friend-status-dot ${statusDotClass}"></span>
                        ${statusTextContent}
                    </span>
                </div>
            `;

            friendItem.addEventListener('click', () => {
                this.selecionarAmigo(id);
                this.allFriendsModal.classList.add('hidden'); // Fecha o modal ao selecionar um amigo
            });

            if (amigo.status === 'online' || amigo.status === 'away' || amigo.status === 'dnd') {
                this.modalOnlineFriendsList.appendChild(friendItem);
            } else {
                this.modalOfflineFriendsList.appendChild(friendItem);
            }
        }
    },


    // Função para selecionar um amigo e exibir o chat
    selecionarAmigo(id) {
        // Remove a classe 'active' de todos os amigos
        document.querySelectorAll('.friend-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona a classe 'active' ao amigo clicado
        const selectedFriendItem = document.querySelector(`.friend-item[data-friend-id="${id}"]`);
        if (selectedFriendItem) {
            selectedFriendItem.classList.add('active');
        }

        this.amigoAtivoId = id;
        const amigoAtivo = this.amigos[this.amigoAtivoId];

        // Atualiza o cabeçalho do chat
        this.chatPartnerName.textContent = amigoAtivo.name;
        this.chatPartnerImage.src = amigoAtivo.avatar;
        // Atualiza o status no cabeçalho do chat
        this.chatPartnerStatus.textContent = amigoAtivo.status === 'online' ? 'Online' : amigoAtivo.lastSeen;

        // Mostra a janela de chat e esconde a mensagem "Selecione um amigo"
        this.chatWindow.classList.remove('hidden');
        this.noChatSelectedMessage.classList.add('hidden');

        // Marca todas as mensagens recebidas como lidas ao selecionar a conversa
        if (this.amigos[this.amigoAtivoId] && this.amigos[this.amigoAtivoId].messages) {
            this.amigos[this.amigoAtivoId].messages.forEach(msg => {
                if (msg.tipo === 'received' && msg.status !== 'read') {
                    msg.status = 'read';
                }
            });
            sessionStorage.setItem('todasConversas', JSON.stringify(this.amigos));
        }

        this.renderizarMensagens(); // Renderiza as mensagens do amigo ativo
    },

    // Função para renderizar as mensagens na janela de chat
    renderizarMensagens() {
        if (!this.messagesContainer) return;
        this.messagesContainer.innerHTML = '';

        if (this.amigoAtivoId && this.amigos[this.amigoAtivoId] && this.amigos[this.amigoAtivoId].messages) {
            this.amigos[this.amigoAtivoId].messages.forEach(m => {
                const div = document.createElement('div');
                div.className = `message ${m.tipo}`;

                if (m.contentType === 'gif') {
                    div.classList.add('gif-message');
                    const img = document.createElement('img');
                    img.src = m.texto; // A URL do GIF é o 'texto'
                    img.alt = 'GIF';
                    div.appendChild(img);
                } else if (m.contentType === 'image') {
                    div.classList.add('image-message');
                    const img = document.createElement('img');
                    img.src = m.texto;
                    img.alt = 'Imagem anexada';
                    div.appendChild(img);
                } else if (m.contentType === 'video') {
                    div.classList.add('video-message');
                    const video = document.createElement('video');
                    video.src = m.texto;
                    video.controls = true;
                    video.autoplay = false; // Não auto-play para evitar sobrecarga
                    video.loop = false;
                    video.muted = true; // Começa mutado
                    div.appendChild(video);
                } else if (m.contentType === 'voice') { // NOVO: Renderiza mensagem de voz
                    div.classList.add('voice-message');
                    const icon = document.createElement('i');
                    icon.classList.add('fa-solid', 'fa-microphone-alt');
                    const textSpan = document.createElement('span');
                    textSpan.textContent = m.texto; // Ex: "Mensagem de Voz (0:15)"
                    div.appendChild(icon);
                    div.appendChild(textSpan);
                }
                else {
                    const p = document.createElement('p');
                    p.textContent = m.texto;
                    div.appendChild(p);
                }

                const timestampSpan = document.createElement('span');
                timestampSpan.classList.add('timestamp');
                timestampSpan.textContent = m.timestamp;
                div.appendChild(timestampSpan);

                // Status icons only for text messages
                if (m.tipo === 'sent' && m.contentType === 'text') {
                    const statusIcon = document.createElement('i');
                    statusIcon.classList.add('fas', 'message-status-icon');

                    if (m.status === 'sent') {
                        statusIcon.classList.add('fa-check', 'text-gray-400');
                    } else if (m.status === 'delivered') {
                        statusIcon.classList.add('fa-check-double', 'text-gray-400');
                    } else if (m.status === 'read') {
                        statusIcon.classList.add('fa-check-double', 'text-blue-500');
                    }
                    div.appendChild(statusIcon);
                }
                this.messagesContainer.appendChild(div);
            });
        }

        if (this.typingIndicator) {
            this.messagesContainer.appendChild(this.typingIndicator);
        }

        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },

    // Função para adicionar uma nova mensagem à conversa
    adicionarMensagem(amigoId, texto, tipo, status = null, contentType = 'text') {
        if (!this.amigos[amigoId]) {
            this.amigos[amigoId] = { messages: [] };
        }
        if (tipo === 'sent' && status === null) {
            status = 'sent';
        }
        this.amigos[amigoId].messages.push({ texto, tipo, status, timestamp: this.getCurrentTime(), contentType });
        sessionStorage.setItem('todasConversas', JSON.stringify(this.amigos));
        this.renderizarMensagens();
        this.renderizarListaAmigos(); // Atualiza a lista para mostrar a última mensagem
    },

    // Função para atualizar uma mensagem existente
    atualizarMensagem(amigoId, index, novoTexto, novoTipo, novoStatus = null) {
        if (this.amigos[amigoId] && this.amigos[amigoId].messages && this.amigos[amigoId].messages[index]) {
            this.amigos[amigoId].messages[index].texto = novoTexto;
            this.amigos[amigoId].messages[index].tipo = novoTipo;
            if (novoStatus !== null) {
                this.amigos[amigoId].messages[index].status = novoStatus;
            }
            sessionStorage.setItem('todasConversas', JSON.stringify(this.amigos));
            this.renderizarMensagens();
            this.renderizarListaAmigos();
        }
    },

    // Função para gerar respostas do bot com base no humor
    gerarResposta(texto) {
        let responsesDict;
        if (this.amigoAtivoId === 'ana') {
            responsesDict = this.anaResponses;
        } else if (this.amigoAtivoId === 'carlos') {
            responsesDict = this.carlosResponses; // Usará as respostas do Carlos
        }
        else {
            return "Desculpe, não consigo conversar com este amigo.";
        }

        const lowerCaseMessage = texto.toLowerCase();
        let matchedResponse = responsesDict['default'];
        let applyHumor = true;

        const directResponseKeywords = ['bom dia', 'boa tarde', 'boa noite', 'oi', 'ola', 'tudo bem', 'como vai', 'obrigado', 'tchau', 'qual seu nome', 'estou bem', 'estou otimo', 'estou otima', 'to bem', 'to otimo', 'to otima', 'e vc', 'e voce', 'e tu'];


        for (const keyword in responsesDict) {
            if (lowerCaseMessage.includes(keyword)) {
                matchedResponse = responsesDict[keyword];
                if (directResponseKeywords.includes(keyword)) {
                    applyHumor = false;
                }
                break;
            }
        }

        let finalResponse = Array.isArray(matchedResponse) ? matchedResponse[Math.floor(Math.random() * matchedResponse.length)] : matchedResponse;

        if (applyHumor && this.amigoAtivoId === 'ana') {
            switch (this.humorAtual) {
                case 'engraçado':
                    finalResponse += " 😂";
                    break;
                case 'ranzinza':
                    finalResponse = "Aff... " + finalResponse.toLowerCase();
                    break;
            }
        }
        return finalResponse;
    },
    // Retorna a hora atual formatada (HH:MM)
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    // --- Lógica do NOVO Emoji Picker ---
    renderEmojiPicker() {
        if (!this.emojiCategoriesNav || !this.emojiGridContainer) {
            console.error("Elementos do emoji picker não encontrados. Não foi possível renderizar o picker.");
            return;
        }

        this.emojiCategoriesNav.innerHTML = '';
        this.emojiGridContainer.innerHTML = '';

        for (const categoryKey in this.emojiData) {
            const category = this.emojiData[categoryKey];

            // Cria botão de navegação para a categoria
            const categoryBtn = document.createElement('button');
            categoryBtn.classList.add('emoji-category-btn');
            categoryBtn.dataset.category = categoryKey;
            categoryBtn.textContent = category.icon;
            categoryBtn.title = category.title;
            categoryBtn.addEventListener('click', () => this.scrollToEmojiCategory(categoryKey));
            this.emojiCategoriesNav.appendChild(categoryBtn);

            // Cria seção de grade para a categoria
            const categorySection = document.createElement('div');
            categorySection.classList.add('emoji-category-section');
            categorySection.id = `emoji-category-${categoryKey}`;
            categorySection.innerHTML = `<h5>${category.title}</h5><div class="emoji-grid"></div>`;

            const emojiGrid = categorySection.querySelector('.emoji-grid');
            category.emojis.forEach(emoji => {
                const emojiBtn = document.createElement('button');
                emojiBtn.classList.add('emoji-btn');
                emojiBtn.textContent = emoji;
                emojiGrid.appendChild(emojiBtn);
            });
            this.emojiGridContainer.appendChild(categorySection);
        }
    },

    filterEmojis(query) {
        if (!this.emojiGridContainer) return; // Adicionado null check

        const lowerCaseQuery = query.toLowerCase();
        const allEmojiSections = this.emojiGridContainer.querySelectorAll('.emoji-category-section');

        allEmojiSections.forEach(section => {
            let sectionHasVisibleEmojis = false;
            const emojisInGrid = section.querySelectorAll('.emoji-btn');
            emojisInGrid.forEach(emojiBtn => {
                const emojiText = emojiBtn.textContent;
                // Para busca, podemos usar uma biblioteca de busca de emojis se for mais complexo,
                // mas para este exemplo, uma busca simples por texto funciona.
                // A maioria dos emojis não tem "nomes" no texto, então a busca será limitada.
                // Uma melhoria seria ter um mapeamento de emoji para palavras-chave.
                const isMatch = emojiText.includes(lowerCaseQuery) || (query === '' && true); // Mostra tudo se a busca estiver vazia

                emojiBtn.style.display = isMatch ? 'block' : 'none';
                if (isMatch) {
                    sectionHasVisibleEmojis = true;
                }
            });

            // Mostra ou esconde a seção inteira se não houver emojis correspondentes
            section.style.display = sectionHasVisibleEmojis ? 'block' : 'none';
        });
    },

    scrollToEmojiCategory(categoryKey) {
        if (!this.emojiGridContainer || !this.emojiCategoriesNav) return; // Adicionado null check

        const targetElement = document.getElementById(`emoji-category-${categoryKey}`);
        if (targetElement) {
            this.emojiGridContainer.scrollTop = targetElement.offsetTop - this.emojiGridContainer.offsetTop;
            // Atualiza o estado ativo do botão de categoria
            this.emojiCategoriesNav.querySelectorAll('.emoji-category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeCategoryBtn = document.querySelector(`.emoji-category-btn[data-category="${categoryKey}"]`);
            if (activeCategoryBtn) { // Adicionado null check
                activeCategoryBtn.classList.add('active');
            }
        }
    },

    // --- Lógica do GIF Picker (NOVO) ---
    openGifPicker() {
        if (this.gifPickerModal) {
            this.gifPickerModal.classList.remove('hidden');
            if (this.emojiPicker) this.emojiPicker.classList.add('hidden'); // Fecha o emoji picker se o GIF picker for aberto
            if (this.voiceRecordingIndicator) this.voiceRecordingIndicator.classList.add('hidden'); // Esconde o indicador de voz
            if (this.gifSearchInput) this.gifSearchInput.value = ''; // Limpa a busca anterior
            if (this.gifResultsContainer) this.gifResultsContainer.innerHTML = ''; // Limpa resultados anteriores
            if (this.gifNoResultsMessage) this.gifNoResultsMessage.classList.add('hidden');
            if (this.gifLoadingMessage) this.gifLoadingMessage.classList.add('hidden');
            this.fetchGifs('trending'); // Carrega GIFs em alta ao abrir
        }
    },

    closeGifPicker() {
        if (this.gifPickerModal) {
            this.gifPickerModal.classList.add('hidden');
        }
    },

    async fetchGifs(query) {
        if (!this.GIPHY_API_KEY || this.GIPHY_API_KEY === 'YOUR_GIPHY_API_KEY') {
            console.error("Giphy API Key não configurada. Por favor, obtenha uma chave em developers.giphy.com e substitua 'YOUR_GIPHY_API_KEY' no main.js.");
            if (this.gifResultsContainer) this.gifResultsContainer.innerHTML = '';
            if (this.gifNoResultsMessage) {
                this.gifNoResultsMessage.textContent = "Erro: Chave da API do Giphy não configurada.";
                this.gifNoResultsMessage.classList.remove('hidden');
            }
            if (this.gifLoadingMessage) this.gifLoadingMessage.classList.add('hidden');
            return;
        }

        if (this.gifResultsContainer) this.gifResultsContainer.innerHTML = '';
        if (this.gifNoResultsMessage) this.gifNoResultsMessage.classList.add('hidden');
        if (this.gifLoadingMessage) this.gifLoadingMessage.classList.remove('hidden');

        const endpoint = query === 'trending' ?
            `https://api.giphy.com/v1/gifs/trending?api_key=${this.GIPHY_API_KEY}&limit=20` :
            `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20`;

        try {
            const response = await fetch(endpoint);
            const data = await response.json();

            if (this.gifLoadingMessage) this.gifLoadingMessage.classList.add('hidden');

            if (data.data && data.data.length > 0) {
                this.renderGifs(data.data);
            } else {
                if (this.gifNoResultsMessage) {
                    this.gifNoResultsMessage.textContent = "Nenhum GIF encontrado para sua busca.";
                    this.gifNoResultsMessage.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error("Erro ao buscar GIFs:", error);
            if (this.gifLoadingMessage) this.gifLoadingMessage.classList.add('hidden');
            if (this.gifNoResultsMessage) {
                this.gifNoResultsMessage.textContent = "Erro ao carregar GIFs. Tente novamente mais tarde.";
                this.gifNoResultsMessage.classList.remove('hidden');
            }
        }
    },

    renderGifs(gifs) {
        if (!this.gifResultsContainer) return; // Adicionado null check

        this.gifResultsContainer.innerHTML = '';
        gifs.forEach(gif => {
            // Usamos 'downsized_medium' para uma versão mais leve do GIF para exibição na grade
            const gifUrl = gif.images.downsized_medium.url;
            const gifItem = document.createElement('img');
            gifItem.classList.add('gif-item');
            gifItem.src = gifUrl;
            gifItem.alt = gif.title || 'GIF';
            gifItem.dataset.gifUrl = gif.images.original.url; // Salva a URL original para o envio
            this.gifResultsContainer.appendChild(gifItem);
        });
    },

    handleGifSelection(event) {
        const selectedGif = event.target.closest('.gif-item');
        if (selectedGif) {
            const gifUrl = selectedGif.dataset.gifUrl;
            if (this.amigoAtivoId) {
                this.adicionarMensagem(this.amigoAtivoId, gifUrl, 'sent', 'sent', 'gif');
                this.closeGifPicker();
            }
        }
    },

    // Função para lidar com o anexo de arquivos (imagens e vídeos)
    handleFileAttachment(event) {
        const file = event.target.files[0];
        if (!file || !this.amigoAtivoId) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileUrl = e.target.result;
            let contentType = '';

            if (file.type.startsWith('image/')) {
                contentType = 'image';
            } else if (file.type.startsWith('video/')) {
                contentType = 'video';
            } else {
                console.warn('Tipo de arquivo não suportado para anexo:', file.type);
                return;
            }

            this.adicionarMensagem(this.amigoAtivoId, fileUrl, 'sent', 'sent', contentType);
            // Limpa o input de arquivo para permitir o upload do mesmo arquivo novamente
            event.target.value = ''; 
        };
        reader.readAsDataURL(file);
    },

    // Funções para limpar o chat
    openClearChatConfirmationModal() {
        if (this.clearChatConfirmationModal) {
            this.clearChatConfirmationModal.classList.remove('hidden');
        }
    },

    closeClearChatConfirmationModal() {
        if (this.clearChatConfirmationModal) {
            this.clearChatConfirmationModal.classList.add('hidden');
        }
    },

    clearActiveChat() {
        if (this.amigoAtivoId && this.amigos[this.amigoAtivoId]) {
            this.amigos[this.amigoAtivoId].messages = []; // Limpa o array de mensagens
            sessionStorage.setItem('todasConversas', JSON.stringify(this.amigos)); // Salva no sessionStorage
            this.renderizarMensagens(); // Re-renderiza a área de mensagens (ficará vazia)
            this.closeClearChatConfirmationModal(); // Fecha o modal de confirmação
            console.log(`Chat com ${this.amigos[this.amigoAtivoId].name} limpo.`);
        }
    },

    // NOVO: Lógica para Mensagens de Voz Simuladas
    startVoiceRecording(e) {
        // Previne o comportamento padrão do touch para evitar scroll
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        if (!this.amigoAtivoId) {
            console.warn("Nenhum amigo ativo selecionado para gravar mensagem de voz.");
            return;
        }

        this.isRecordingVoice = true;
        this.recordingStartTime = Date.now();
        if (this.voiceMessageBtn) this.voiceMessageBtn.classList.add('recording');
        if (this.voiceRecordingIndicator) this.voiceRecordingIndicator.classList.remove('hidden');
        if (this.messageInput) this.messageInput.disabled = true; // Desabilita o input de texto
        if (this.sendMessageBtn) this.sendMessageBtn.disabled = true; // Desabilita o botão de enviar texto

        // Esconde outros pickers
        if (this.emojiPicker) this.emojiPicker.classList.add('hidden');
        if (this.gifPickerModal) this.gifPickerModal.classList.add('hidden');

        // Inicia o timer de gravação
        let seconds = 0;
        if (this.recordingTimerDisplay) this.recordingTimerDisplay.textContent = '0:00';
        this.recordingInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            if (this.recordingTimerDisplay) this.recordingTimerDisplay.textContent = `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
        }, 1000);
    },

    stopVoiceRecording(e) {
        if (!this.isRecordingVoice) return;

        // Previne o comportamento padrão do touch
        if (e.type === 'touchend') {
            e.preventDefault();
        }

        this.isRecordingVoice = false;
        clearInterval(this.recordingInterval);
        if (this.voiceMessageBtn) this.voiceMessageBtn.classList.remove('recording');
        if (this.voiceRecordingIndicator) this.voiceRecordingIndicator.classList.add('hidden');
        if (this.messageInput) this.messageInput.disabled = false; // Habilita o input de texto
        if (this.sendMessageBtn) this.sendMessageBtn.disabled = false; // Habilita o botão de enviar texto

        const recordingDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000); // Duração em segundos

        if (recordingDuration > 0) { // Envia apenas se a gravação durou mais de 0 segundos
            const minutes = Math.floor(recordingDuration / 60);
            const seconds = recordingDuration % 60;
            const formattedDuration = `${minutes}:${String(seconds).padStart(2, '0')}`;
            const messageText = `Mensagem de Voz (${formattedDuration})`;

            this.adicionarMensagem(this.amigoAtivoId, messageText, 'sent', 'sent', 'voice');

            // Simula a resposta do bot após a mensagem de voz
            if (this.typingIndicator) {
                const currentFriend = this.amigos[this.amigoAtivoId];
                if (currentFriend) {
                    this.typingIndicator.querySelector('.typing-avatar').src = currentFriend.avatar;
                }
                this.typingIndicator.classList.remove('hidden');
            }
            if (this.messagesContainer) this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

            setTimeout(() => {
                const resposta = this.gerarResposta("mensagem de voz"); // Usa uma keyword genérica para a resposta do bot
                if (this.typingIndicator) this.typingIndicator.classList.add('hidden');
                this.adicionarMensagem(this.amigoAtivoId, resposta, 'received', 'read', 'text');
                this.tocarSom();
            }, 2500); // Atraso para a resposta do bot
        } else {
            console.log("Gravação de voz muito curta, não enviada.");
        }
    },

    // Adiciona um som ao receber uma mensagem (opcional)
    tocarSom() {
        // Você pode adicionar um elemento de áudio no HTML e reproduzi-lo aqui
        // Ex: const audio = new Audio('caminho/para/seu/som.mp3'); audio.play();
        console.log("Som de mensagem recebida (simulado)");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Chat.init(); // Inicializa o objeto Chat quando o DOM estiver pronto
});
