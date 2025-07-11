// =================================================================================
//  CONECTARE - WORKSHOP JAVASCRIPT FILE
//  Author: Gemini
//  Description: Client-side logic for the simulated workshop/live environment.
//               Includes chat interaction and page navigation.
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const workshopPageTitle = document.getElementById('workshop-page-title');
    const workshopPageCloseBtn = document.getElementById('workshop-page-close-btn');
    const leaveWorkshopBtn = document.getElementById('leave-workshop-btn');
    const workshopChatMessages = document.getElementById('workshop-chat-messages');
    const workshopChatInput = document.getElementById('workshop-chat-input');
    // CORREÇÃO: workshopSendChatBtn deve referenciar o botão de envio, não o input
    const workshopSendChatBtn = document.getElementById('workshop-send-chat-btn'); 
    const workshopMainImage = document.getElementById('workshop-main-image'); // Referência à imagem principal
    const simulatedCursor = document.getElementById('simulated-cursor'); // Referência ao cursor simulado
    const codeTypingArea = document.getElementById('workshop-code-area'); // Área para digitar o código (alterado para o ID correto)
    const liveIndicator = document.querySelector('.live-indicator'); // Referência ao indicador de "AO VIVO"

    // Obtém o título do workshop dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventTitle = urlParams.get('title') || 'Programação do Zero ao Avançado'; // Título padrão se não for passado

    if (workshopPageTitle) {
        workshopPageTitle.textContent = eventTitle;
        document.title = `${eventTitle} - Conectare Live`; // Atualiza o título da aba do navegador
    }

    // Função para adicionar uma mensagem ao chat
    function addChatMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('workshop-chat-message');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        if (isUser) {
            messageDiv.style.alignSelf = 'flex-end'; // Alinha as mensagens do usuário à direita
            messageDiv.style.backgroundColor = 'var(--accent-dark)'; // Cor de fundo da mensagem do usuário
            messageDiv.style.color = 'white';
        }
        workshopChatMessages.appendChild(messageDiv);
        // Rola para o final do chat
        workshopChatMessages.scrollTop = workshopChatMessages.scrollHeight;
    }

    // Simula mensagens aleatórias de outros participantes
    const simulatedParticipants = [
        'Ana Livia', 'Carlos Souza', 'Usuário Desconhecido', 'Dev Júnior',
        'Comentarista Pro', 'Curioso Tech', 'Maria Programadora', 'João Coder',
        'Iniciante Entusiasmado', 'Mestre Python', 'Web Dev Fan', 'Game Dev',
        'Data Scientist', 'UX/UI Lover',
        'Backend Builder'
    ];
    const simulatedResponses = [
        "Que legal!",
        "Entendi, muito bom!",
        "Essa dica é ouro!",
        "Faz sentido!",
        "Obrigado por compartilhar!",
        "Já estou usando no meu projeto!",
        "Poderia repetir a última parte?",
        "Qual a melhor forma de aplicar isso?",
        "Incrível!",
        "Adorei a explicação!"
    ];

    let messageInterval;

    function startSimulatedChat() {
        messageInterval = setInterval(() => {
            const randomParticipant = simulatedParticipants[Math.floor(Math.random() * simulatedParticipants.length)];
            const randomMessage = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
            addChatMessage(randomParticipant, randomMessage);
        }, 5000 + Math.random() * 5000); // Envia mensagem a cada 5-10 segundos
    }

    function stopSimulatedChat() {
        clearInterval(messageInterval);
    }

    // Apenas uma imagem será exibida, sem rotação.
    // O efeito de digitação e o cursor simulado foram removidos.

    // Efeito de digitação simulado (funções mantidas, mas não chamadas no init)
    function startSimulatedTypingEffect(snippet) {
        // Esta função não será mais chamada no init.
        // Se quiser reativar, chame-a onde for necessário.
        codeTypingArea.textContent = snippet; // Apenas exibe o código completo
        codeTypingArea.style.borderRight = 'none'; // Garante que o cursor não apareça
    }

    function stopSimulatedTypingEffect() {
        // Esta função não será mais chamada no init.
    }

    // Movimento do cursor simulado (funções mantidas, mas não chamadas no init)
    function moveCursorRandomly() {
        // Esta função não será mais chamada no init.
    }

    function startCursorMovement() {
        // Esta função não será mais chamada no init.
    }

    function stopCursorMovement() {
        // Esta função não será mais chamada no init.
    }


    // Event listener para enviar mensagens
    if (workshopSendChatBtn) {
        workshopSendChatBtn.addEventListener('click', () => {
            const message = workshopChatInput.value.trim();
            if (message) {
                addChatMessage('Você', message, true); // Adiciona a mensagem do usuário
                workshopChatInput.value = ''; // Limpa o input
            }
        });
    }

    // Permite enviar mensagens com a tecla Enter
    if (workshopChatInput) {
        workshopChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Previne nova linha no input
                workshopSendChatBtn.click(); // Dispara o clique do botão de enviar
            }
        });
    }

    // Event listener para fechar/sair do workshop
    function leaveWorkshop() {
        stopSimulatedChat(); // Para as mensagens simuladas
        window.location.href = 'notificacoes.html'; // Redireciona de volta para as notificações
    }

    if (workshopPageCloseBtn) {
        workshopPageCloseBtn.addEventListener('click', leaveWorkshop);
    }
    if (leaveWorkshopBtn) {
        leaveWorkshopBtn.addEventListener('click', leaveWorkshop);
    }

    // Inicia o chat simulado e define a imagem principal
    startSimulatedChat();
    // Define a imagem principal para a imagem que você enviou
    workshopMainImage.src = 'https://code.visualstudio.com/assets/docs/getstarted/getting-started/terminal-new-file.png';
    // Define o código inicial na área de código (sem efeito de digitação)
    codeTypingArea.textContent = `// Exemplo de estrutura HTML básica
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Primeiro Código</title>
</head>
<body>
    <h1>Olá, Mundo da Programação!</h1>
</body>
</html>`;
    // Garante que o indicador de live esteja como "AO VIVO"
    liveIndicator.textContent = 'Pausado';
    liveIndicator.style.backgroundColor = '#e0ae24ff';

    // Adiciona as mensagens iniciais e a mensagem de "Emanuel"
    addChatMessage('Emanuel', 'Olá a todos! Sejam bem-vindos ao workshop de Programação do Zero ao Avançado!');
    addChatMessage('Você', 'Cheguei um pouco atrasado, mas estou animado para aprender!', true);
    addChatMessage('Ana Livia', 'O áudio está ótimo!');
    addChatMessage('Carlos Souza', 'Ansioso para a parte de lógica!');
    addChatMessage('Emanuel', 'Hoje vamos cobrir desde os fundamentos até conceitos mais avançados de forma prática.');
    // Nova mensagem de Emanuel indicando que ele saiu
    addChatMessage('Emanuel', 'Pessoal, vou dar uma pequena pausa e já volto! Fiquem à vontade para tirar dúvidas no chat.');
});