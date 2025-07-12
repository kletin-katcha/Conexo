// =================================================================================
//  CONECTARE - MAIN JAVASCRIPT FILE
//  Author: Gemini
//  Description: All client-side logic for the Conectare social platform.
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Conectare DOM loaded. Initializing scripts.");

    // ======= Global Initializer =======
    // Esta função é executada em cada carregamento de página e inicializa recursos comuns.
    const initGlobalFeatures = () => {
        ThemeManager.init();
        MusicPlayer.init();
    };

    // ======= Page-Specific Initializers =======
    // Determina a página atual e executa seus scripts específicos.
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === 'index.html' || currentPage === '') {
        // A página inicial pode não ter o Feed.init() se for apenas login
        // Se index.html é a página de login, Feed.init() não deve ser chamado aqui.
        // Se index.html é o feed, então está correto.
        // Por enquanto, vou assumir que 'feed.html' é a página principal do feed.
    } else if (currentPage === 'feed.html') { // Adicionado para garantir que o Feed.init seja chamado no feed.html
        Feed.init();
    } else if (currentPage === 'profile.html') {
        Profile.init();
    } else if (currentPage === 'search.html') {
        Explore.init(); // Inicializa a lógica da página Explorar
    } else if (currentPage === 'notificacoes.html') {
        Notifications.init(); // Inicializa a lógica da página Notificações
    } else if (currentPage === 'comunidade.html') {
        Communities.init(); // Inicializa a lógica da página Comunidades
    } else if (currentPage === 'chat.html') {
        Chat.init();
    } else if (currentPage === 'game.html') { // <--- NOVO: Inicializa a Central de Jogos
        GXCorner.init();
    }

    // Executa recursos globais em todas as páginas
    initGlobalFeatures();
});


// =================================
//  GERENCIADOR DE TEMA (MODO ESCURO/CLARO)
// =================================
const ThemeManager = {
    body: document.body,
    lightThemeBtn: document.getElementById('theme-toggle-light'),
    darkThemeBtn: document.getElementById('theme-toggle-dark'),

    init() {
        // Esta verificação garante que adicionamos listeners apenas se os botões existirem na página
        if (this.lightThemeBtn && this.darkThemeBtn) {
            this.lightThemeBtn.addEventListener('click', () => this.setTheme('light-theme'));
            this.darkThemeBtn.addEventListener('click', () => this.setTheme('dark-theme'));
        }
        this.loadTheme();
    },

    setTheme(themeName) {
        localStorage.setItem('theme', themeName);
        this.body.className = themeName;
        this.updateButtons(themeName);
    },

    loadTheme() {
        const storedTheme = localStorage.getItem('theme') || 'light-theme';
        this.body.className = storedTheme;
        this.updateButtons(storedTheme);
    },

    updateButtons(activeTheme) {
        if (!this.lightThemeBtn || !this.darkThemeBtn) return;

        if (activeTheme === 'light-theme') {
            this.lightThemeBtn.classList.add('active');
            this.darkThemeBtn.classList.remove('active');
        } else {
            this.darkThemeBtn.classList.add('active');
            this.lightThemeBtn.classList.remove('active');
        }
    }
};


// =================================
//  PLAYER DE MÚSICA FLUTUANTE ARRASTÁVEL
// =================================
const MusicPlayer = {
    // Estado
    isPlaying: false,
    isPanelOpen: false,
    isDragging: false,
    wasDragged: false,
    currentTrackIndex: 0,
    offsetX: 0,
    offsetY: 0,
    // AQUI É ONDE VOCÊ VAI ADICIONAR SUAS MÚSICAS!
    // IMPORTANTE: 'src' DEVE SER UMA URL PÚBLICA DIRETA PARA O ARQUIVO DE ÁUDIO (ex: .mp3, .wav).
    // Links de visualização ou pasta do Google Drive NÃO FUNCIONARÃO.
    // 'artwork' também deve ser uma URL pública para a imagem da capa.
    playlist: [
        { title: "Comfort", artist: "Aventure (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-comfort.mp3", artwork: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop" }, // Exemplo de artwork
        { title: "Orange Clouds", artist: "Aventure (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-orangeclouds.mp3", artwork: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop" }, // Exemplo de artwork
        { title: "The Sunday", artist: "Melatone (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-thesunday.mp3", artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop" }, // Exemplo de artwork
        { title: "Caramel", artist: "Sleep Token", src: "../music/Caramel.mp3", artwork: "../images/Caramel.jpg" } // Exemplo de artwork

    ],

    init() {
        if (!document.getElementById('music-player-fab')) return;
        this.cacheDOMElements();
        this.addEventListeners();
        // Não tenta reproduzir automaticamente no init, apenas carrega a primeira faixa
        this.loadTrack(this.currentTrackIndex, false);
        this.renderPlaylist();
        // Define o volume inicial do elemento de áudio
        this.audio.volume = this.volumeSlider.value;
    },

    cacheDOMElements() {
        this.fab = document.getElementById('music-player-fab');
        this.toggleBtn = document.getElementById('music-toggle-fab');
        this.panel = document.getElementById('music-player-panel');
        this.audio = document.getElementById('audio-element');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackTitle = document.getElementById('track-title');
        this.trackArtist = document.getElementById('track-artist');
        this.trackArtwork = document.getElementById('track-artwork');
        this.fabArtwork = this.toggleBtn.querySelector('img');
        this.nextBtn = document.getElementById('next-track-btn');
        this.prevBtn = document.getElementById('prev-track-btn');
        this.playlistToggleBtn = document.getElementById('playlist-toggle-btn');
        this.playlistView = document.getElementById('playlist-view');
        this.playlistList = this.playlistView.querySelector('ul');
    },

    addEventListeners() {
        // Arrastar e Soltar
        this.toggleBtn.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());
        this.toggleBtn.addEventListener('touchstart', (e) => this.dragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.dragEnd());

        // Controles do Player
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.playlistToggleBtn.addEventListener('click', () => this.togglePlaylist());
    },

    dragStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.wasDragged = false;
        this.fab.classList.add('dragging');

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        this.offsetX = clientX - this.fab.offsetLeft;
        this.offsetY = clientY - this.fab.offsetTop;
    },

    drag(e) {
        if (!this.isDragging) return;
        this.wasDragged = true;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        let newX = clientX - this.offsetX;
        let newY = clientY - this.offsetY;

        // Restringe dentro da viewport
        const fabRect = this.fab.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - fabRect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - fabRect.height));

        this.fab.style.left = `${newX}px`;
        this.fab.style.top = `${newY}px`;
        this.fab.style.bottom = 'auto';
        this.fab.style.right = 'auto';
    },

    dragEnd() {
        this.isDragging = false;
        this.fab.classList.remove('dragging');
        // Usa um timeout para distinguir entre arrastar e clicar
        setTimeout(() => { this.wasDragged = false; }, 0);
    },

    togglePanel() {
        if (this.wasDragged) return;
        this.isPanelOpen = !this.isPanelOpen;
        this.panel.classList.toggle('hidden', !this.isPanelOpen);
    },

    togglePlayPause() {
        if (this.audio.paused) {
            // Tenta reproduzir e captura qualquer erro (como bloqueio de autoplay)
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseIcon();
                console.log("Áudio iniciado com sucesso.");
            }).catch(error => {
                console.error("Erro ao tentar reproduzir áudio:", error);
                // Mensagem para o usuário (opcional, mas útil para depuração)
                // alert("Não foi possível reproduzir o áudio. Por favor, interaja com a página.");
                this.isPlaying = false; // Garante que o estado de reprodução está correto
                this.updatePlayPauseIcon(); // Atualiza o ícone para pausado
            });
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayPauseIcon();
            console.log("Áudio pausado.");
        }
    },

    updatePlayPauseIcon() {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    },

    loadTrack(index, shouldPlay = true) {
        this.currentTrackIndex = index;
        const track = this.playlist[index];

        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        this.trackArtwork.src = track.artwork;
        this.fabArtwork.src = track.artwork;
        this.audio.src = track.src;

        if (shouldPlay) {
            // Tenta reproduzir e captura qualquer erro (como bloqueio de autoplay)
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseIcon();
                console.log(`Música "${track.title}" carregada e iniciada com sucesso.`);
            }).catch(error => {
                console.error(`Erro ao carregar e reproduzir áudio "${track.title}":`, error);
                // Se o autoplay for bloqueado aqui, o ícone permanecerá como "play"
                this.isPlaying = false;
                this.updatePlayPauseIcon();
            });
        } else {
            this.isPlaying = false;
            this.updatePlayPauseIcon();
        }
        this.updatePlaylistUI();
    },

    nextTrack() {
        const newIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(newIndex);
    },

    prevTrack() {
        const newIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(newIndex);
    },

    setVolume(value) {
        this.audio.volume = value;
    },

    renderPlaylist() {
        this.playlistList.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.innerHTML = `<span>${track.title}</span><small>${track.artist}</small>`;
            li.addEventListener('click', () => this.loadTrack(index));
            this.playlistList.appendChild(li);
        });
        this.updatePlaylistUI();
    },

    updatePlaylistUI() {
        this.playlistList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('playing', parseInt(li.dataset.index) === this.currentTrackIndex);
        });
    },

    togglePlaylist() {
        this.playlistView.classList.toggle('hidden');
    }
};


// =================================
//  FUNCIONALIDADE DO FEED
// =================================
const Feed = {
    // Stories do usuário (armazenadas no sessionStorage)
    userStories: [],
    // Stories simuladas de outros usuários
    simulatedStories: {
        'ana': [
            { id: 'ana1', type: 'image', src: 'https://i.pinimg.com/1200x/8c/08/47/8c08476cefaf90f3a64408b286857e43.jpg', caption: 'Dia incrível na montanha! ⛰️', timestamp: '1h' }
            // Removida a postagem "Pôr do sol perfeito! 🌅"
        ],
        'carlos': [
            { id: 'carlos1', type: 'image', src: 'https://i.pinimg.com/736x/88/c2/5c/88c25cfe14f8e720f9ac2941dd7bd440.jpg', caption: 'Novo setup gamer! 🎮', timestamp: '2h' }
        ]
    },
    currentStoryIndex: 0,
    currentStoryUser: null,
    storyInterval: null,
    posts: [], // Array para armazenar todos os posts, incluindo comentários
    currentPostIdForComments: null, // Novo: ID do post atualmente aberto no modal de comentários


    init() {
        if (!document.querySelector('.content-feed')) return;
        this.cacheDOMElements();
        this.loadUserStories(); // Carrega os stories do usuário
        this.renderStories(); // Renderiza a seção de stories
        this.loadPosts(); // Carrega os posts e seus comentários do sessionStorage
        this.addEventListeners();
        this.renderPosts(); // Renderiza todos os posts carregados
    },

    cacheDOMElements() {
        this.postInput = document.getElementById('post-input');
        this.publishBtn = document.getElementById('post-text-btn'); // ID corrigido
        this.imageBtn = document.getElementById('post-image-btn');
        this.videoBtn = document.getElementById('post-video-btn');
        this.audioBtn = document.getElementById('post-audio-btn');
        this.imageUploadInput = document.getElementById('image-upload-input');
        // Adicione inputs para vídeo e áudio se ainda não existirem no HTML
        if (!document.getElementById('video-upload-input')) {
            const videoInput = document.createElement('input');
            videoInput.type = 'file';
            videoInput.id = 'video-upload-input';
            videoInput.accept = 'video/*';
            videoInput.style.display = 'none';
            document.body.appendChild(videoInput);
        }
        this.videoUploadInput = document.getElementById('video-upload-input');

        if (!document.getElementById('audio-upload-input')) {
            const audioInput = document.createElement('input');
            audioInput.type = 'file';
            audioInput.id = 'audio-upload-input';
            audioInput.accept = 'audio/*';
            audioInput.style.display = 'none';
            document.body.appendChild(audioInput);
        }
        this.audioUploadInput = document.getElementById('audio-upload-input');


        this.feedContainer = document.getElementById('feed-container');
        
        // Comentários: Referências para o modal de comentários
        this.commentsModal = document.getElementById('comments-modal');
        this.closeCommentsModalBtn = document.getElementById('close-comments-modal');
        this.commentsList = document.getElementById('comments-list');
        this.newCommentInput = document.getElementById('new-comment-input');
        this.sendCommentBtn = document.getElementById('send-comment-btn');
        this.noCommentsMessage = document.getElementById('no-comments-message');


        // Elementos do Modal de Story
        this.addStoryModal = document.getElementById('add-story-modal');
        this.closeStoryModalBtn = document.getElementById('close-story-modal');
        this.storyMediaInput = document.getElementById('story-media-input');
        this.storyMediaLabel = document.querySelector('.story-media-label');
        this.storyMediaPreview = document.getElementById('story-media-preview');
        this.storyCaptionInput = document.getElementById('story-caption-input');
        this.postStoryBtn = document.getElementById('post-story-btn');
        this.yourStoryItem = document.getElementById('your-story-item'); // Seu story na lista

        // Elementos do Story Viewer
        this.storyViewerModal = document.createElement('div');
        this.storyViewerModal.id = 'story-viewer-modal';
        this.storyViewerModal.classList.add('modal-overlay', 'hidden');
        this.storyViewerModal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal-btn" id="close-story-viewer">&times;</button>
                <div class="story-viewer-content">
                    <div class="story-viewer-progress-bar">
                        <div class="story-viewer-progress"></div>
                    </div>
                    <div class="story-viewer-user-info">
                        <img src="" alt="Avatar" id="story-viewer-avatar">
                        <span id="story-viewer-username"></span>
                    </div>
                    <div id="story-viewer-media"></div>
                    <p class="story-viewer-caption" id="story-viewer-caption"></p>
                    <button class="story-viewer-nav-btn prev" id="story-viewer-prev">&lt;</button>
                    <button class="story-viewer-nav-btn next" id="story-viewer-next">&gt;</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.storyViewerModal);

        this.closeStoryViewerBtn = document.getElementById('close-story-viewer');
        this.storyViewerMedia = document.getElementById('story-viewer-media');
        this.storyViewerCaption = document.getElementById('story-viewer-caption');
        this.storyViewerProgressBar = document.querySelector('#story-viewer-modal .story-viewer-progress');
        this.storyViewerAvatar = document.getElementById('story-viewer-avatar');
        this.storyViewerUsername = document.getElementById('story-viewer-username');
        this.storyViewerPrevBtn = document.getElementById('story-viewer-prev');
        this.storyViewerNextBtn = document.getElementById('story-viewer-next');
    },

    addEventListeners() {
        this.publishBtn.addEventListener('click', () => this.createPostFromInput());
        this.imageBtn.addEventListener('click', () => this.imageUploadInput.click());
        this.videoBtn.addEventListener('click', () => this.videoUploadInput.click());
        this.audioBtn.addEventListener('click', () => this.audioUploadInput.click());

        this.imageUploadInput.addEventListener('change', (e) => this.handleFileUpload(e, 'image'));
        this.videoUploadInput.addEventListener('change', (e) => this.handleFileUpload(e, 'video'));
        this.audioUploadInput.addEventListener('change', (e) => this.handleFileUpload(e, 'audio'));

        // Delegação de eventos para posts criados dinamicamente
        this.feedContainer.addEventListener('click', (e) => {
            const postCard = e.target.closest('.post-card');
            if (!postCard) return; // Garante que o clique está dentro de um post

            const postId = postCard.dataset.postId;

            if (e.target.closest('.like-btn')) {
                this.toggleLike(e.target.closest('.like-btn'));
            }
            if (e.target.closest('.comment-btn')) {
                this.openCommentsModal(postId);
            }
            if (e.target.closest('.share-btn')) { // Adicionado listener para o botão de compartilhar
                this.sharePost(postId);
            }
            if (e.target.closest('.play-music-post-btn')) {
                this.playMusicFromPost(e.target.closest('.play-music-post-btn'));
            }
        });

        // Event listeners para o modal de comentários
        if (this.commentsModal) {
            this.commentsModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.closest('.close-modal-btn')) {
                    this.closeCommentsModal();
                }
            });
        }
        if (this.sendCommentBtn) {
            this.sendCommentBtn.addEventListener('click', () => this.addComment());
        }
        if (this.newCommentInput) {
            this.newCommentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendCommentBtn.click();
                }
            });
        }

        // Event listeners para Stories
        if (this.yourStoryItem) {
            this.yourStoryItem.addEventListener('click', () => this.openAddStoryModal());
        }
        if (this.addStoryModal) {
            this.addStoryModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.closest('.close-modal-btn')) {
                    this.closeAddStoryModal();
                }
            });
        }
        if (this.storyMediaInput) {
            this.storyMediaInput.addEventListener('change', (e) => this.previewStoryMedia(e));
        }
        if (this.postStoryBtn) {
            this.postStoryBtn.addEventListener('click', (e) => this.publishStory(e));
        }

        // Event listeners para o Story Viewer
        if (this.closeStoryViewerBtn) {
            this.closeStoryViewerBtn.addEventListener('click', () => this.closeStoryViewer());
        }
        if (this.storyViewerModal) {
            this.storyViewerModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeStoryViewer();
                }
            });
        }
        if (this.storyViewerPrevBtn) {
            this.storyViewerPrevBtn.addEventListener('click', () => this.showPreviousStory());
        }
        if (this.storyViewerNextBtn) {
            this.storyViewerNextBtn.addEventListener('click', () => this.showNextStory());
        }

        // Adicionar event listeners para os stories simulados
        document.querySelectorAll('.story-item[data-story-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                const userId = item.dataset.storyId;
                this.openStoryViewer(userId);
            });
        });
    },

    // --- Lógica de Stories ---
    loadUserStories() {
        const storedStories = sessionStorage.getItem('userStories');
        if (storedStories) {
            this.userStories = JSON.parse(storedStories);
        }
    },

    saveUserStories() {
        sessionStorage.setItem('userStories', JSON.stringify(this.userStories));
    },

    renderStories() {
        // Atualiza o "Seu story"
        if (this.userStories.length > 0) {
            const lastStory = this.userStories[this.userStories.length - 1];
            this.yourStoryItem.classList.add('your-story');
            const avatarDiv = this.yourStoryItem.querySelector('.story-avatar');
            avatarDiv.innerHTML = ''; // Limpa o ícone de '+'
            if (lastStory.type === 'image') {
                const img = document.createElement('img');
                img.src = lastStory.src;
                img.alt = 'Seu Story';
                avatarDiv.appendChild(img);
            } else if (lastStory.type === 'video') {
                const video = document.createElement('video');
                video.src = lastStory.src;
                video.muted = true; // Stories geralmente são mutados por padrão
                video.autoplay = true;
                video.loop = true;
                avatarDiv.appendChild(video);
            }
        } else {
            this.yourStoryItem.classList.remove('your-story');
            this.yourStoryItem.querySelector('.story-avatar').innerHTML = '<i class="fa-solid fa-plus"></i>';
        }
    },

    openAddStoryModal() {
        this.addStoryModal.classList.remove('hidden');
        // Resetar o formulário do story
        this.storyMediaPreview.innerHTML = '';
        this.storyMediaPreview.classList.add('hidden');
        this.storyMediaLabel.classList.remove('hidden');
        this.storyMediaInput.value = '';
        this.storyCaptionInput.value = '';
    },

    closeAddStoryModal() {
        this.addStoryModal.classList.add('hidden');
    },

    previewStoryMedia(event) {
        const file = event.target.files[0];
        if (!file) {
            this.storyMediaPreview.innerHTML = '';
            this.storyMediaPreview.classList.add('hidden');
            this.storyMediaLabel.classList.remove('hidden');
            return;
        }

        this.storyMediaLabel.classList.add('hidden');
        this.storyMediaPreview.classList.remove('hidden');
        this.storyMediaPreview.innerHTML = ''; // Limpa qualquer preview anterior

        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = e.target.result;
                this.storyMediaPreview.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true;
                this.storyMediaPreview.appendChild(video);
            }
        };
        reader.readAsDataURL(file);
    },

    publishStory(event) {
        event.preventDefault();
        const file = this.storyMediaInput.files[0];
        const caption = this.storyCaptionInput.value.trim();

        if (!file) {
            // Use a custom modal or toast instead of alert()
            Notifications.showToast('Por favor, selecione uma imagem ou vídeo para o seu story.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const newStory = {
                id: Date.now().toString(),
                userId: 'you', // Para identificar o story do usuário
                type: file.type.startsWith('image/') ? 'image' : 'video',
                src: e.target.result,
                caption: caption,
                timestamp: 'agora' // Ou formatar data/hora real
            };
            this.userStories.push(newStory);
            this.saveUserStories();
            this.renderStories(); // Atualiza a exibição do seu story
            this.closeAddStoryModal();
            Notifications.showToast('Seu story foi publicado!');
        };
        reader.readAsDataURL(file);
    },

    openStoryViewer(userId) {
        this.currentStoryUser = userId;
        let storiesToView = [];
        let userAvatar = '';
        let userName = '';

        if (userId === 'you') {
            storiesToView = this.userStories;
            userAvatar = 'https://i.pinimg.com/736x/6a/bc/d9/6abcd9f34ebc8fd7dce5b3edf69a0126.jpg'; // Seu avatar
            userName = 'Você';
        } else {
            storiesToView = this.simulatedStories[userId];
            // Buscar avatar e nome do usuário simulado
            const simulatedUser = document.querySelector(`.story-item[data-story-id="${userId}"]`);
            if (simulatedUser) {
                userAvatar = simulatedUser.querySelector('.story-avatar img').src;
                userName = simulatedUser.querySelector('span').textContent;
            }
        }

        if (storiesToView && storiesToView.length > 0) {
            this.storyViewerAvatar.src = userAvatar;
            this.storyViewerUsername.textContent = userName;
            this.currentStoryIndex = 0;
            this.storyViewerModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Evita o scroll do body
            this.showStory(storiesToView[this.currentStoryIndex]);
        } else {
            Notifications.showToast('Nenhum story disponível para este usuário.');
        }
    },

    showStory(story) {
        if (this.storyInterval) {
            clearInterval(this.storyInterval);
        }
        this.storyViewerMedia.innerHTML = '';
        this.storyViewerCaption.textContent = story.caption;

        if (story.type === 'image') {
            const img = document.createElement('img');
            img.src = story.src;
            this.storyViewerMedia.appendChild(img);
            this.startStoryProgressBar(5000); // 5 segundos para imagem
        } else if (story.type === 'video') {
            const video = document.createElement('video');
            video.src = story.src;
            video.controls = false; // Sem controles para simular story
            video.autoplay = true;
            video.muted = true; // Vídeos de story geralmente começam mutados
            video.loop = false;
            video.onloadedmetadata = () => {
                this.startStoryProgressBar(video.duration * 1000); // Duração do vídeo
            };
            video.onended = () => {
                this.showNextStory();
            };
            this.storyViewerMedia.appendChild(video);
        }
    },

    startStoryProgressBar(duration) {
        let startTime = null;
        const animateProgress = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            this.storyViewerProgressBar.style.width = `${progress * 100}%`;

            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            } else {
                // Se for imagem, avança para o próximo story após a duração
                if (this.currentStoryUser === 'you' && this.userStories[this.currentStoryIndex].type === 'image' ||
                    this.currentStoryUser !== 'you' && this.simulatedStories[this.currentStoryUser][this.currentStoryIndex].type === 'image') {
                    this.showNextStory();
                }
            }
        };
        requestAnimationFrame(animateProgress);
    },

    showNextStory() {
        let stories = (this.currentStoryUser === 'you') ? this.userStories : this.simulatedStories[this.currentStoryUser];
        this.currentStoryIndex++;
        if (this.currentStoryIndex < stories.length) {
            this.showStory(stories[this.currentStoryIndex]);
        } else {
            this.closeStoryViewer();
        }
    },

    showPreviousStory() {
        let stories = (this.currentStoryUser === 'you') ? this.userStories : this.simulatedStories[this.currentStoryUser];
        this.currentStoryIndex--;
        if (this.currentStoryIndex >= 0) {
            this.showStory(stories[this.currentStoryIndex]);
        } else {
            this.currentStoryIndex = 0; // Volta para o primeiro story
        }
    },

    closeStoryViewer() {
        this.storyViewerModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restaura o scroll do body
        if (this.storyInterval) {
            clearInterval(this.storyInterval);
        }
        // Pausa qualquer vídeo que esteja tocando no viewer
        const currentMedia = this.storyViewerMedia.querySelector('video');
        if (currentMedia) {
            currentMedia.pause();
        }
    },

    // --- Lógica de Posts e Comentários ---
    loadPosts() {
        const storedPosts = sessionStorage.getItem('feedPosts');
        if (storedPosts) {
            this.posts = JSON.parse(storedPosts);
        } else {
            // Se não houver posts salvos, carrega os posts iniciais
            this.posts = [
                {
                    id: 'post-music-1',
                    type: 'music',
                    user: 'Synthwave Lover',
                    avatar: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop',
                    time: '1h',
                    content: MusicPlayer.playlist[0],
                    likes: 15,
                    comments: [
                        { user: 'Você', avatar: 'https://i.pinimg.com/736x/6a/bc/d9/6abcd9f34ebc8fd7dce5b3edf69a0126.jpg', text: 'Adorei essa música!', time: '5m' },
                        { user: 'Ana Livia', avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', text: 'Vibe perfeita para acodar!', time: '2m' }
                    ]
                },
                {
                    id: 'post-text-1',
                    type: 'text',
                    user: 'Ana Livia',
                    avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg',
                    time: '2h',
                    content: 'Explorando o novo design da plataforma! Achei super futurista e clean. O que vocês acharam do modo escuro? 🚀',
                    likes: 28,
                    comments: [
                        { user: 'Marcos Vale', avatar: 'https://i.pinimg.com/736x/0f/1f/6b/0f1f6bcc56cfa1481fa9c07280cc0717.jpg', message: 'curtiu sua foto.', isNew: true, postThumb: 'https://images.unsplash.com/photo-1542158399-885435b64234?q=80&w=100&auto=format&fit=crop', text: 'Ficou show! Curti demais o dark mode.', time: '10m' }
                    ]
                }
            ];
        }
    },

    savePosts() {
        sessionStorage.setItem('feedPosts', JSON.stringify(this.posts));
    },

    renderPosts() {
        this.feedContainer.innerHTML = ''; // Limpa o feed antes de renderizar
        this.posts.forEach(post => this.renderPost(post));
    },

    createPostFromInput() {
        const text = this.postInput.value;
        if (!text.trim()) return;

        const newPostId = `post-${Date.now()}`;
        const postData = {
            id: newPostId,
            type: 'text',
            user: 'Você',
            avatar: 'https://i.pinimg.com/736x/6a/bc/d9/6abcd9f34ebc8fd7dce5b3edf69a0126.jpg',
            time: 'agora',
            content: text,
            likes: 0,
            comments: [] // Inicializa com array de comentários vazio
        };
        this.posts.unshift(postData); // Adiciona o novo post no início
        this.savePosts();
        this.renderPost(postData, true); // Renderiza o novo post
        this.postInput.value = '';
    },

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const newPostId = `post-${Date.now()}`;
            const postData = {
                id: newPostId,
                type: type,
                user: 'Você',
                avatar: 'https://i.pinimg.com/736x/6a/bc/d9/6abcd9f34ebc8fd7dce5b3edf69a0126.jpg',
                time: 'agora',
                content: {
                    src: e.target.result, // Data URL para arquivos locais temporários
                    text: this.postInput.value,
                    title: file.name,
                    artist: 'Você' // Para posts de áudio/música
                },
                likes: 0,
                comments: [] // Inicializa com array de comentários vazio
            };
            this.posts.unshift(postData); // Adiciona o novo post no início
            this.savePosts();
            this.renderPost(postData, true); // Renderiza o novo post
            this.postInput.value = '';
        };
        reader.readAsDataURL(file);
    },

    renderPost(data, isNew = false) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.dataset.postId = data.id; // Adiciona o ID do post como data attribute

        let contentHTML = '';
        switch (data.type) {
            case 'text':
                contentHTML = `<p>${data.content.replace(/\n/g, '<br>')}</p>`;
                break;
            case 'image':
                contentHTML = `${data.content.text ? `<p>${data.content.text}</p>` : ''}<img src="${data.content.src}" alt="Post de imagem" class="post-media">`;
                break;
            case 'video':
                contentHTML = `${data.content.text ? `<p>${data.content.text}</p>` : ''}<video src="${data.content.src}" controls class="post-media"></video>`;
                break;
            case 'audio':
            case 'music':
                 contentHTML = `
                    ${data.content.text ? `<p>${data.content.text}</p>` : ''}
                    <div class="music-player-post" data-src="${data.content.src}">
                        <img src="${data.content.artwork || 'https://placehold.co/80x80/2a2a2e/white?text=Music'}" alt="Capa da música" class="music-artwork">
                        <div class="music-info">
                            <div class="music-details">
                                <h3>${data.content.title}</h3>
                                <p>${data.content.artist}</p>
                            </div>
                            <button class="play-music-post-btn"><i class="fa-solid fa-play"></i></button>
                        </div>
                    </div>`;
                postCard.classList.add('music-post');
                break;
        }

        postCard.innerHTML = `
            <div class="post-header">
                <img src="${data.avatar}" alt="Avatar do Usuário" class="post-avatar">
                <div class="post-user-info">
                    <span class="post-username">${data.user}</span>
                    <span class="post-timestamp">· ${data.time}</span>
                </div>
            </div>
            <div class="post-content">${contentHTML}</div>
            <div class="post-footer">
                <button class="footer-action like-btn"><i class="fa-regular fa-heart"></i> <span>${data.likes}</span></button>
                <button class="footer-action comment-btn"><i class="fa-regular fa-comment"></i> <span>${data.comments.length}</span></button>
                <button class="footer-action share-btn"><i class="fa-solid fa-share-nodes"></i></button>
            </div>`;

        if (isNew) {
            this.feedContainer.prepend(postCard);
        } else {
            this.feedContainer.appendChild(postCard);
        }
    },

    toggleLike(likeButton) {
        likeButton.classList.toggle('liked');
        const icon = likeButton.querySelector('i');
        const countSpan = likeButton.querySelector('span');
        let count = parseInt(countSpan.textContent);

        if (likeButton.classList.contains('liked')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            count++;
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            count--;
        }
        countSpan.textContent = count;

        // Atualiza o número de likes no objeto do post
        const postId = likeButton.closest('.post-card').dataset.postId;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes = count;
            this.savePosts();
        }
    },

    openCommentsModal(postId) {
        this.currentPostIdForComments = postId;
        this.renderComments(postId);
        if (this.commentsModal) {
            this.commentsModal.classList.remove('hidden');
        }
    },

    closeCommentsModal() {
        if (this.commentsModal) {
            this.commentsModal.classList.add('hidden');
            this.currentPostIdForComments = null; // Limpa o ID do post ativo
            this.newCommentInput.value = ''; // Limpa o input de comentário
        }
    },

    renderComments(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !this.commentsList) return;

        this.commentsList.innerHTML = ''; // Limpa os comentários existentes

        if (post.comments.length === 0) {
            this.noCommentsMessage.classList.remove('hidden');
        } else {
            this.noCommentsMessage.classList.add('hidden');
            post.comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment-item');
                commentItem.innerHTML = `
                    <img src="${comment.avatar}" alt="Avatar" class="comment-avatar">
                    <div class="comment-body">
                        <strong>${comment.user}</strong>
                        <p>${comment.text}</p>
                        <span class="comment-timestamp">${comment.time}</span>
                    </div>
                `;
                this.commentsList.appendChild(commentItem);
            });
        }
        this.commentsList.scrollTop = this.commentsList.scrollHeight; // Rola para o final
    },

    addComment() {
        const commentText = this.newCommentInput.value.trim();
        if (!commentText || !this.currentPostIdForComments) return;

        const post = this.posts.find(p => p.id === this.currentPostIdForComments);
        if (post) {
            const newComment = {
                user: 'Você', // Usuário atual
                avatar: 'https://placehold.co/32x32/5e5ce5/white?text=U', // Avatar do usuário atual
                text: commentText,
                time: 'agora' // Pode ser formatado para uma data/hora real
            };
            post.comments.push(newComment);
            this.savePosts(); // Salva os posts atualizados no sessionStorage
            this.renderComments(this.currentPostIdForComments); // Re-renderiza os comentários
            this.newCommentInput.value = ''; // Limpa o input
            // Atualiza a contagem de comentários no post do feed
            const postCardElement = document.querySelector(`.post-card[data-post-id="${this.currentPostIdForComments}"]`);
            if (postCardElement) {
                const commentCountSpan = postCardElement.querySelector('.comment-btn span');
                commentCountSpan.textContent = post.comments.length;
            }
        }
    },

    sharePost(postId) {
        // Simula o compartilhamento copiando o link do post para a área de transferência
        // Em um ambiente real, seria um link para a página do post.
        const postLink = `https://conectare.com/feed.html#post-${postId}`; // Link simulado
        
        // Usa document.execCommand('copy') como fallback para navigator.clipboard.writeText
        // devido a possíveis restrições de iframe.
        const tempInput = document.createElement('input');
        tempInput.value = postLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            Notifications.showToast('Link do post copiado para a área de transferência!');
        } catch (err) {
            console.error('Falha ao copiar o link:', err);
            Notifications.showToast('Não foi possível copiar o link. Por favor, copie manualmente: ' + postLink);
        }
        document.body.removeChild(tempInput);
    },

    playMusicFromPost(button) {
        const post = button.closest('.music-player-post');
        const src = post.dataset.src;
        const title = post.querySelector('h3').textContent;
        const artist = post.querySelector('p').textContent;
        const artwork = post.querySelector('img').src;

        const trackData = { title, artist, src, artwork };

        // Adiciona a música à playlist se não estiver lá
        const trackIndex = MusicPlayer.playlist.findIndex(t => t.src === src);
        if (trackIndex === -1) {
            MusicPlayer.playlist.push(trackData);
            MusicPlayer.renderPlaylist();
            MusicPlayer.loadTrack(MusicPlayer.playlist.length - 1);
        } else {
            MusicPlayer.loadTrack(trackIndex);
        }
    }
};

// =================================
//  LÓGICA DA PÁGINA DE PERFIL
// =================================
const Profile = {
    // Estado
    editingHighlightElement: null,

    init() {
        if (!document.querySelector('.content-profile')) return;

        // --- Seletores de Elementos ---
        // Modais
        this.settingsModal = document.getElementById('settings-modal');
        this.editProfileModal = document.getElementById('edit-profile-modal');
        this.highlightModal = document.getElementById('highlight-modal');

        // Botões e Gatilhos
        // Alterado de 'config-btn' para 'open-settings-modal-btn'
        this.openSettingsModalBtn = document.getElementById('open-settings-modal-btn');
        this.editProfileFromSettingsBtn = document.getElementById('edit-profile-from-settings');
        this.openEditModalBtn = document.getElementById('open-edit-profile-modal-btn');
        this.editBannerTrigger = document.getElementById('edit-banner-trigger');
        this.editPicTrigger = document.getElementById('edit-pic-trigger');
        this.addHighlightBtn = document.getElementById('add-highlight-btn');
        this.changeHighlightPhotoTrigger = document.getElementById('change-highlight-photo-trigger');
        this.deleteHighlightBtn = document.getElementById('delete-highlight-btn');
        this.logoutBtn = document.getElementById('logout-btn'); // NOVO: Botão de Sair

        // Formulários e Inputs
        this.editProfileForm = document.getElementById('edit-profile-form');
        this.highlightForm = document.getElementById('highlight-form');
        this.bannerUploadInput = document.getElementById('banner-upload-input');
        this.profilePicUploadInput = document.getElementById('profile-pic-upload-input');
        this.highlightImageInput = document.getElementById('highlight-image-input');

        // Contêineres e Exibições
        this.highlightsContainer = document.getElementById('highlights-container');
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        this.addEventListeners();
    },

    addEventListeners() {
        // --- Lógica de Abertura/Fechamento de Modal ---
        // Verifica se openSettingsModalBtn existe antes de adicionar o listener
        if (this.openSettingsModalBtn) {
            this.openSettingsModalBtn.addEventListener('click', () => this.openModal(this.settingsModal));
        }
        // Verifica se openEditModalBtn existe antes de adicionar o listener
        if (this.openEditModalBtn) {
            this.openEditModalBtn.addEventListener('click', () => this.openModal(this.editProfileModal));
        }

        // Verifica se editProfileFromSettingsBtn existe antes de adicionar o listener
        if (this.editProfileFromSettingsBtn) {
            this.editProfileFromSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(this.settingsModal);
                this.openModal(this.editProfileModal);
            });
        }

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.closest('.close-modal-btn')) {
                    this.closeModal(modal);
                }
            });
        });

        // --- Envio de Formulário ---
        if (this.editProfileForm) {
            this.editProfileForm.addEventListener('submit', (e) => this.saveProfileChanges(e));
        }
        if (this.highlightForm) {
            this.highlightForm.addEventListener('submit', (e) => this.saveHighlightChanges(e));
        }

        // --- Upload de Imagens ---
        if (this.editBannerTrigger) {
            this.editBannerTrigger.addEventListener('click', () => this.bannerUploadInput.click());
        }
        if (this.editPicTrigger) {
            this.editPicTrigger.addEventListener('click', () => this.profilePicUploadInput.click());
        }
        if (this.changeHighlightPhotoTrigger) {
            this.changeHighlightPhotoTrigger.addEventListener('click', () => this.highlightImageInput.click());
        }

        if (this.bannerUploadInput) {
            this.bannerUploadInput.addEventListener('change', (e) => this.previewImage(e, 'banner-display'));
        }
        if (this.profilePicUploadInput) {
            this.profilePicUploadInput.addEventListener('change', (e) => this.previewImage(e, 'profile-pic-display'));
        }
        if (this.highlightImageInput) {
            this.highlightImageInput.addEventListener('change', (e) => this.previewImage(e, 'highlight-image-preview-img'));
        }

        // --- Lógica de Destaques ---
        if (this.addHighlightBtn) {
            this.addHighlightBtn.addEventListener('click', () => this.openHighlightModal());
        }
        if (this.highlightsContainer) {
            this.highlightsContainer.addEventListener('click', (e) => {
                const highlightItem = e.target.closest('.highlight-item');
                if (highlightItem) {
                    this.openHighlightModal(highlightItem);
                }
            });
        }
        if (this.deleteHighlightBtn) {
            this.deleteHighlightBtn.addEventListener('click', () => this.deleteHighlight());
        }

        // --- Abas ---
        this.tabLinks.forEach(link => {
            link.addEventListener('click', () => this.activateTab(link));
        });

        // NOVO: Listener para o botão de Sair
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    },

    // --- Gerenciamento de Modal ---
    openModal(modal) {
        if (modal) { // Adiciona verificação para garantir que o modal existe
            modal.classList.remove('hidden');
            if (modal.id === 'edit-profile-modal') {
                this.loadProfileDataIntoForm();
            }
        }
    },

    closeModal(modal) {
        if (modal) { // Adiciona verificação para garantir que o modal existe
            modal.classList.add('hidden');
        }
    },

    // --- Edição de Perfil ---
    loadProfileDataIntoForm() {
        // Verifica se os elementos existem antes de tentar acessá-los
        const profileNameInput = document.getElementById('profile-name-input');
        const profileBioInput = document.getElementById('profile-bio-input');
        const profileLocationInput = document.getElementById('profile-location-input');
        const profileLinkInput = document.getElementById('profile-link-input');

        const profileNameDisplay = document.getElementById('profile-name-display');
        const profileBioDisplay = document.getElementById('profile-bio-display');
        const profileLocationDisplay = document.getElementById('profile-location-display');
        const profileLinkDisplay = document.getElementById('profile-link-display');

        if (profileNameInput && profileNameDisplay) {
            profileNameInput.value = profileNameDisplay.textContent;
        }
        if (profileBioInput && profileBioDisplay) {
            profileBioInput.value = profileBioDisplay.textContent;
        }
        if (profileLocationInput && profileLocationDisplay) {
            profileLocationInput.value = profileLocationDisplay.textContent;
        }
        if (profileLinkInput && profileLinkDisplay) {
            profileLinkInput.value = profileLinkDisplay.href;
        }
    },

    saveProfileChanges(event) {
        event.preventDefault();

        const newName = document.getElementById('profile-name-input').value;
        const newBio = document.getElementById('profile-bio-input').value;
        const newLocation = document.getElementById('profile-location-input').value;
        const newLink = document.getElementById('profile-link-input').value;

        document.getElementById('profile-name-display').textContent = newName;
        document.getElementById('profile-bio-display').textContent = newBio;
        document.getElementById('profile-location-display').textContent = newLocation;

        const linkElement = document.getElementById('profile-link-display');
        linkElement.href = newLink;
        linkElement.textContent = newLink.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

        this.closeModal(this.editProfileModal);
    },

    // --- Edição de Destaques ---
    openHighlightModal(element = null) {
        this.editingHighlightElement = element;
        const titleInput = document.getElementById('highlight-title-input');
        const imagePreview = document.getElementById('highlight-image-preview-img');
        const modalTitle = document.getElementById('highlight-modal-title');

        if (element) { // Editando destaque existente
            modalTitle.textContent = "Editar Destaque";
            titleInput.value = element.querySelector('span').textContent;
            imagePreview.src = element.querySelector('img').src;
            this.deleteHighlightBtn.classList.remove('hidden');
        } else { // Criando novo destaque
            modalTitle.textContent = "Adicionar Destaque";
            if (this.highlightForm) { // Verifica se o formulário existe
                this.highlightForm.reset();
            }
            imagePreview.src = 'https://placehold.co/100x100/e5e5e5/9ca3af?text=+';
            this.deleteHighlightBtn.classList.add('hidden');
        }
        this.openModal(this.highlightModal);
    },

    saveHighlightChanges(event) {
        event.preventDefault();
        const newTitle = document.getElementById('highlight-title-input').value;
        const newImageSrc = document.getElementById('highlight-image-preview-img').src;

        if (this.editingHighlightElement) { // Atualiza existente
            this.editingHighlightElement.querySelector('img').src = newImageSrc;
            this.editingHighlightElement.querySelector('span').textContent = newTitle;
        } else { // Cria novo
            const newHighlight = document.createElement('div');
            newHighlight.className = 'highlight-item';
            newHighlight.dataset.highlightId = Date.now(); // ID único
            newHighlight.innerHTML = `
                <img src="${newImageSrc}" alt="${newTitle}">
                <span>${newTitle}</span>
            `;
            this.highlightsContainer.insertBefore(newHighlight, this.addHighlightBtn);
        }
        this.closeModal(this.highlightModal);
    },

    deleteHighlight() {
        if (this.editingHighlightElement) {
            this.editingHighlightElement.remove();
            this.closeModal(this.highlightModal);
        }
    },

    // --- Lógica de Logout (NOVO) ---
    handleLogout() {
        // Limpa todos os dados relevantes do localStorage e sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        console.log("Dados de sessão limpos. Redirecionando para a página inicial.");
        // Redireciona para a página inicial
        window.location.href = 'index.html';
    },

    // --- Utilitários Gerais ---
    previewImage(event, displayElementId) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById(displayElementId).src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    activateTab(clickedLink) {
        const tabId = clickedLink.dataset.tab;
        this.tabLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
        this.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    }
};

// =================================
//  LÓGICA DA PÁGINA EXPLORAR
// =================================
const Explore = {
    // Dados de usuários simulados para a aba 'Pessoas'
    users: [
        { id: 'ana', name: 'Ana Livia', bio: 'Desenvolvedora Web | UI/UX Designer', avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', isFollowing: false },
        { id: 'marcos', name: 'Marcos Vale', bio: 'Engenheiro de Software | Entusiasta de IA', avatar: 'https://i.pinimg.com/736x/0f/1f/6b/0f1f6bcc56cfa1481fa9c07280cc0717.jpg', isFollowing: true },
        { id: 'carlos', name: 'Carlos Souza', bio: 'Criador de Conteúdo | Gamer', avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg', isFollowing: false },
        { id: 'juliana', name: 'Juliana Reis', bio: 'Fotógrafa | Viajante', avatar: 'https://i.pinimg.com/736x/24/91/a6/2491a6aad04c52f42af5b2d100f4efc2.jpg', isFollowing: false }
    ],

    init() {
        if (!document.querySelector('.content-explore')) return;

        this.tabLinks = document.querySelectorAll('.content-explore .tab-link');
        this.tabPanes = document.querySelectorAll('.content-explore .tab-pane');
        this.exploreSearchInput = document.getElementById('explore-search-input'); // Adicionado o input de busca

        this.loadFollowStatus(); // Carrega o status de "seguindo" do sessionStorage
        this.addEventListeners();
        this.renderPeopleTab(); // Renderiza a aba de pessoas com o status inicial
    },

    addEventListeners() {
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.activateTab(tabId);
                // Re-renderiza a aba de pessoas caso ela seja ativada
                if (tabId === 'pessoas') {
                    this.renderPeopleTab();
                }
            });
        });

        // Listener para o input de busca
        if (this.exploreSearchInput) {
            this.exploreSearchInput.addEventListener('input', (event) => {
                this.filterContent(event.target.value);
            });
        }

        // Delegação de eventos para os botões "Seguir"
        document.querySelector('#pessoas .user-card-grid').addEventListener('click', (e) => {
            const followBtn = e.target.closest('.follow-btn');
            if (followBtn) {
                const userId = followBtn.dataset.userId;
                this.toggleFollow(userId);
            }
        });
    },

    loadFollowStatus() {
        const savedFollowStatus = JSON.parse(sessionStorage.getItem('followedUsers')) || {};
        this.users.forEach(user => {
            if (savedFollowStatus[user.id] !== undefined) {
                user.isFollowing = savedFollowStatus[user.id];
            }
        });
    },

    saveFollowStatus() {
        const followStatusToSave = {};
        this.users.forEach(user => {
            followStatusToSave[user.id] = user.isFollowing;
        });
        sessionStorage.setItem('followedUsers', JSON.stringify(followStatusToSave));
    },

    toggleFollow(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isFollowing = !user.isFollowing;
            this.saveFollowStatus();
            this.renderPeopleTab(); // Re-renderiza a aba de pessoas para atualizar o botão
        }
    },

    renderPeopleTab() {
        const peopleTabPane = document.getElementById('pessoas');
        if (!peopleTabPane) return;

        const userCardGrid = peopleTabPane.querySelector('.user-card-grid');
        if (!userCardGrid) return;

        userCardGrid.innerHTML = ''; // Limpa o conteúdo existente

        this.users.forEach(user => {
            const buttonClass = user.isFollowing ? 'following' : '';
            const buttonText = user.isFollowing ? 'Seguindo' : 'Seguir';

            const userCardHtml = `
                <div class="user-card">
                    <img src="${user.avatar}" alt="Avatar ${user.name}">
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.bio}</p>
                    </div>
                    <button class="follow-btn ${buttonClass}" data-user-id="${user.id}">${buttonText}</button>
                </div>
            `;
            userCardGrid.insertAdjacentHTML('beforeend', userCardHtml);
        });
    },

    activateTab(clickedLink) {
        const tabId = clickedLink.dataset.tab;

        this.tabLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');

        this.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    },

    filterContent(query) {
        const lowerCaseQuery = query.toLowerCase();
        const activeTabId = document.querySelector('.tab-link.active').dataset.tab;
        const activeGrid = document.querySelector(`#${activeTabId} .content-grid, #${activeTabId} .user-card-grid`);

        if (!activeGrid) return;

        // Esconde todos os itens inicialmente
        Array.from(activeGrid.children).forEach(item => item.style.display = 'none');

        // Filtra com base na aba ativa
        if (activeTabId === 'para-voce') {
            Array.from(activeGrid.children).forEach(item => {
                const titleElement = item.querySelector('.grid-item-overlay h3');
                if (titleElement && titleElement.textContent.toLowerCase().includes(lowerCaseQuery)) {
                    item.style.display = 'flex'; // Use flex for grid items to ensure proper display
                }
            });
        } else if (activeTabId === 'videos' || activeTabId === 'musicas') {
            Array.from(activeGrid.children).forEach(item => {
                const titleElement = item.querySelector('.media-content h3');
                const descElement = item.querySelector('.media-content p');
                if ((titleElement && titleElement.textContent.toLowerCase().includes(lowerCaseQuery)) ||
                    (descElement && descElement.textContent.toLowerCase().includes(lowerCaseQuery))) {
                    item.style.display = 'block';
                }
            });
        } else if (activeTabId === 'pessoas') {
            // Re-renderiza a aba de pessoas com base no filtro
            const filteredUsers = this.users.filter(user =>
                user.name.toLowerCase().includes(lowerCaseQuery) ||
                user.bio.toLowerCase().includes(lowerCaseQuery)
            );

            // Seleciona a grade correta para a aba de pessoas
            const userCardGrid = document.querySelector('#pessoas .user-card-grid');
            if (userCardGrid) {
                userCardGrid.innerHTML = ''; // Limpa o conteúdo existente

                filteredUsers.forEach(user => {
                    const buttonClass = user.isFollowing ? 'following' : '';
                    const buttonText = user.isFollowing ? 'Seguindo' : 'Seguir';

                    const userCardHtml = `
                        <div class="user-card">
                            <img src="${user.avatar}" alt="Avatar ${user.name}">
                            <div class="user-info">
                                <h3>${user.name}</h3>
                                <p>${user.bio}</p>
                            </div>
                            <button class="follow-btn ${buttonClass}" data-user-id="${user.id}">${buttonText}</button>
                        </div>
                    `;
                    userCardGrid.insertAdjacentHTML('beforeend', userCardHtml);
                });
            }
        }
    }
};

// =================================
//  LÓGICA DA PÁGINA DE NOTIFICAÇÕES
// =================================
const Notifications = {
    // Dados iniciais das notificações
    initialNotifications: [
        { id: '1', type: 'follow', user: 'Ana Livia', avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', message: 'começou a seguir você.', isNew: true, actionBtn: { text: 'Seguir de volta', class: 'btn-primary', action: 'follow-back' } },
        { id: '2', type: 'like', user: 'Marcos Vale', avatar: 'https://i.pinimg.com/736x/0f/1f/6b/0f1f6bcc56cfa1481fa9c07280cc0717.jpg', message: 'curtiu sua foto.', isNew: true, postThumb: 'https://images.unsplash.com/photo-1542158399-885435b64234?q=80&w=100&auto=format&fit=crop', actionBtn: { text: 'Ver Publicação', class: 'btn-secondary', action: 'view-post' } },
        { id: '3', type: 'comment', user: 'Juliana Reis', avatar: 'https://i.pinimg.com/736x/c1/91/c2/c191c270d09a22bdfae381286de3f15d.jpg', message: 'comentou: "Que lugar incrível! 🤩"', isNew: false, postThumb: 'https://images.unsplash.com/photo-1542158399-885435b64234?q=80&w=100&auto=format&fit=crop', actionBtn: { text: 'Responder', class: 'btn-primary', action: 'reply-comment' } },
        { id: '4', type: 'suggestion', user: 'Carlos Souza', avatar: 'https://i.pinimg.com/736x/08/c1/28/08c1288be8e1ca74b47dbddea5933dce.jpg', message: 'Você talvez conheça <strong>Carlos Souza</strong>.', isNew: false, actionBtn: { text: 'Seguir', class: 'btn-primary', action: 'follow' } },
        { id: '5', type: 'community-invite', user: 'Retrô Gaming', avatar: 'https://i.pinimg.com/736x/cf/7e/47/cf7e47f38c1557617953d3b61726d5ab.jpg', message: 'Você foi convidado para a comunidade <strong>Retrô Gaming</strong>.', isNew: true, actionBtn: { text: 'Aceitar', class: 'btn-primary', action: 'accept-community' } },
        { id: '6', type: 'mention', user: 'Synthwave Lover', avatar: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop', message: 'mencionou você em uma publicação.', isNew: false, actionBtn: { text: 'Ver Publicação', class: 'btn-secondary', action: 'view-post' } },
        { id: '7', type: 'event', user: 'Emanuel', avatar: 'imagens/Emanuel.jpg', message: 'Lembrete: Sua aula de <strong>"Programação do Zero ao Avançado"</strong> começa em 30 minutos.', isNew: true, actionBtn: { text: 'Ver Detalhes', class: 'btn-secondary', action: 'view-details' } },
        { id: '8', type: 'system', user: 'Conectare Suporte', avatar: 'https://i.pinimg.com/736x/e3/19/36/e31936c2ffddedc3123b0ae87e916cb4.jpg', message: 'Sua senha foi alterada com sucesso. Se não foi você, entre em contato.', isNew: true, actionBtn: { text: 'Saiba Mais', class: 'btn-secondary', action: 'get-help' } }
    ],
    notifications: [], // Array que conterá as notificações ativas
    activeTab: 'all', // Aba ativa por padrão

    init() {
        if (!document.querySelector('.content-notifications')) return;

        this.cacheDOMElements();
        this.loadNotifications();
        // Não marca todas como lidas no init para permitir que novas notificações apareçam como "Novas"
        this.addEventListeners();
        this.renderNotifications();
        this.startSimulatedNewNotifications(); // Inicia o gerador de novas notificações
    },

    cacheDOMElements() {
        this.clearAllBtn = document.querySelector('.btn-clear-all');
        this.notificationsTabLinks = document.querySelectorAll('.notifications-tab-link');
        this.notificationsTabPanes = document.querySelectorAll('.tab-pane'); // Todos os painéis de abas

        // Listas de notificação por aba
        this.notificationListAll = document.getElementById('notificationListAll');
        this.notificationListEngagement = document.getElementById('notificationListEngagement');
        this.notificationListRequests = document.getElementById('notificationListRequests');
        this.notificationListEvents = document.getElementById('notificationListEvents');
        this.notificationListSystem = document.getElementById('notificationListSystem');

        // Mensagens de "nenhuma notificação" por aba
        this.noNotificationsMessageAll = document.getElementById('no-notifications-message-all');
        this.noNotificationsMessageEngagement = document.getElementById('no-notifications-message-engagement');
        this.noNotificationsMessageRequests = document.getElementById('no-notifications-message-requests');
        this.noNotificationsMessageEvents = document.getElementById('no-notifications-message-events');
        this.noNotificationsMessageSystem = document.getElementById('no-notifications-message-system');


        // Elementos do modal de confirmação
        this.confirmationModal = document.getElementById('confirmation-modal');
        this.confirmClearAllBtn = document.getElementById('confirm-clear-all-btn');
        this.cancelClearAllBtn = document.getElementById('cancel-clear-all-btn');
        this.confirmModalCloseBtn = document.getElementById('confirm-modal-close-btn');

        // Elementos do novo modal de detalhes do evento
        this.eventDetailsModal = document.getElementById('event-details-modal');
        this.eventModalAvatar = document.getElementById('event-modal-avatar'); // NOVO: Referência para o avatar do evento
        this.eventModalTitle = document.getElementById('event-modal-title');
        this.eventModalTime = document.getElementById('event-modal-time');
        this.eventModalDescription = document.getElementById('event-modal-description');
        this.eventModalLocation = document.getElementById('event-modal-location');
        this.eventModalCloseBtn = document.getElementById('event-details-modal-close-btn');

        // Elementos da Toast Message
        this.toastMessage = document.getElementById('toast-message');
        this.toastText = document.getElementById('toast-text');
    },

    addEventListeners() {
        if (this.clearAllBtn) {
            this.clearAllBtn.addEventListener('click', () => this.openConfirmationModal());
        }

        // Listeners para o modal de confirmação
        if (this.confirmClearAllBtn) {
            this.confirmClearAllBtn.addEventListener('click', () => this.confirmClearAll());
        }
        if (this.cancelClearAllBtn) {
            this.cancelClearAllBtn.addEventListener('click', () => this.closeConfirmationModal());
        }
        if (this.confirmModalCloseBtn) {
            this.confirmModalCloseBtn.addEventListener('click', () => this.closeConfirmationModal());
        }
        // Fechar modal clicando fora do conteúdo
        if (this.confirmationModal) {
            this.confirmationModal.addEventListener('click', (e) => {
                if (e.target === this.confirmationModal) {
                    this.closeConfirmationModal();
                }
            });
        }

        // Listeners para o novo modal de detalhes do evento
        if (this.eventModalCloseBtn) {
            this.eventModalCloseBtn.addEventListener('click', () => this.closeEventDetailsModal());
        }
        if (this.eventDetailsModal) {
            this.eventDetailsModal.addEventListener('click', (e) => {
                if (e.target === this.eventDetailsModal) {
                    this.closeEventDetailsModal();
                }
            });
        }

        // Listeners para as abas de notificação
        this.notificationsTabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.activateTab(tabId);
            });
        });

        // Delegação de eventos para os botões dentro das notificações
        // Usamos document para capturar cliques em qualquer notificação, já que elas são dinâmicas
        document.addEventListener('click', (e) => {
            const notificationItem = e.target.closest('.notification-item');
            if (!notificationItem) return; // Não é um item de notificação

            const notificationId = notificationItem.dataset.notificationId;
            const dismissBtn = e.target.closest('.dismiss-notification-btn');
            const actionBtn = e.target.closest('.action-button');

            if (dismissBtn) {
                this.dismissNotification(notificationId);
            } else if (actionBtn) {
                const actionType = actionBtn.dataset.action;
                this.handleNotificationAction(notificationId, actionType, actionBtn);
            } else {
                // Se clicou no item da notificação, mas não em um botão de ação ou dismiss,
                // marca como lida e remove o badge "Novo"
                this.markNotificationAsRead(notificationId);
            }
        });
    },

    // Carrega notificações do sessionStorage ou usa as iniciais
    loadNotifications() {
        const savedNotifications = sessionStorage.getItem('notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        } else {
            // Cria uma cópia profunda para não modificar o array inicial
            this.notifications = JSON.parse(JSON.stringify(this.initialNotifications));
        }
    },

    // Salva o estado atual das notificações no sessionStorage
    saveNotifications() {
        sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
    },

    // Marca uma notificação específica como lida
    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && notification.isNew) {
            notification.isNew = false;
            this.saveNotifications();
            this.renderNotifications(); // Re-renderiza para atualizar o estado visual
        }
    },

    // Adiciona uma nova notificação ao array e re-renderiza
    addNotification(notificationData) {
        // Ensure the notification has a unique ID and is marked as new
        notificationData.id = Date.now().toString(); // Simple unique ID
        notificationData.isNew = true;
        this.notifications.unshift(notificationData); // Add to the beginning
        this.saveNotifications();
        this.renderNotifications(); // Re-render to show the new notification
        // Adiciona a classe para a animação de entrada
        setTimeout(() => {
            const newItem = document.querySelector(`[data-notification-id="${notificationData.id}"]`);
            if (newItem) {
                newItem.classList.add('animate-in');
            }
        }, 50); // Pequeno atraso para garantir que o elemento esteja no DOM
    },

    // Renderiza as notificações na UI com base na aba ativa
    renderNotifications() {
        // Limpa todas as listas de notificação
        this.notificationListAll.innerHTML = '';
        this.notificationListEngagement.innerHTML = '';
        this.notificationListRequests.innerHTML = '';
        this.notificationListEvents.innerHTML = '';
        this.notificationListSystem.innerHTML = '';

        // Esconde todas as mensagens de "nenhuma notificação"
        this.noNotificationsMessageAll.classList.add('hidden');
        this.noNotificationsMessageEngagement.classList.add('hidden');
        this.noNotificationsMessageRequests.classList.add('hidden');
        this.noNotificationsMessageEvents.classList.add('hidden');
        this.noNotificationsMessageSystem.classList.add('hidden');

        // Filtra e renderiza as notificações para cada lista
        let hasNotificationsInAnyTab = false;

        const filteredAll = this.notifications;
        const filteredEngagement = this.notifications.filter(n => ['like', 'comment', 'mention'].includes(n.type));
        const filteredRequests = this.notifications.filter(n => ['follow', 'community-invite', 'suggestion'].includes(n.type));
        const filteredEvents = this.notifications.filter(n => n.type === 'event');
        const filteredSystem = this.notifications.filter(n => n.type === 'system');

        this.appendNotificationsToList(filteredAll, this.notificationListAll, this.noNotificationsMessageAll);
        this.appendNotificationsToList(filteredEngagement, this.notificationListEngagement, this.noNotificationsMessageEngagement);
        this.appendNotificationsToList(filteredRequests, this.notificationListRequests, this.noNotificationsMessageRequests);
        this.appendNotificationsToList(filteredEvents, this.notificationListEvents, this.noNotificationsMessageEvents);
        this.appendNotificationsToList(filteredSystem, this.notificationListSystem, this.noNotificationsMessageSystem);

        // Verifica se há alguma notificação em qualquer aba para mostrar/esconder o botão "Limpar tudo"
        hasNotificationsInAnyTab = this.notifications.length > 0;
        this.clearAllBtn.classList.toggle('hidden', !hasNotificationsInAnyTab);
    },

    appendNotificationsToList(notificationsArray, listElement, emptyMessageElement) {
        if (notificationsArray.length === 0) {
            emptyMessageElement.classList.remove('hidden');
            emptyMessageElement.style.display = 'block'; // Garante que esteja visível
        } else {
            emptyMessageElement.classList.add('hidden');
            emptyMessageElement.style.display = 'none'; // Garante que esteja oculto
            notificationsArray.forEach(notification => {
                let iconClass = '';
                let iconColor = '';
                switch (notification.type) {
                    case 'follow': iconClass = 'fa-user-plus'; iconColor = 'follow'; break;
                    case 'like': iconClass = 'fa-heart'; iconColor = 'like'; break;
                    case 'comment': iconClass = 'fa-comment'; iconColor = 'comment'; break;
                    case 'suggestion': iconClass = 'fa-lightbulb'; iconColor = 'suggestion'; break;
                    case 'community-invite': iconClass = 'fa-users'; iconColor = 'community'; break;
                    case 'mention': iconClass = 'fa-at'; iconColor = 'mention'; break;
                    case 'event': iconClass = 'fa-calendar-days'; iconColor = 'event'; break;
                    case 'system': iconClass = 'fa-info-circle'; iconColor = 'system'; break; // Novo ícone e cor para sistema
                }

                const newBadge = notification.isNew ? '<span class="new-notification-badge">Novo</span>' : '';
                const postThumb = notification.postThumb ? `<img src="${notification.postThumb}" alt="Post" class="notification-post-thumb">` : '';
                const actionButton = notification.actionBtn ?
                    `<button class="${notification.actionBtn.class} action-button" data-action="${notification.actionBtn.action}">${notification.actionBtn.text}</button>` : '';

                const notificationHtml = `
                    <div class="notification-item ${notification.isNew ? 'new' : ''}" data-notification-id="${notification.id}">
                        <div class="notification-icon-wrapper">
                            <i class="fa-solid ${iconClass} notification-icon ${iconColor}"></i>
                        </div>
                        <div class="notification-content">
                            <img src="${notification.avatar}" alt="Avatar" class="notification-avatar">
                            <p><strong>${notification.user}</strong> ${notification.message}</p>
                            ${newBadge}
                        </div>
                        ${postThumb}
                        ${actionButton}
                        <button class="dismiss-notification-btn" title="Descartar Notificação"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `;
                listElement.insertAdjacentHTML('beforeend', notificationHtml);
            });
        }
    },

    activateTab(tabId) {
        this.activeTab = tabId;
        // Remove 'active' de todas as abas e painéis
        this.notificationsTabLinks.forEach(link => link.classList.remove('active'));
        this.notificationsTabPanes.forEach(pane => pane.classList.remove('active'));

        // Adiciona 'active' à aba e painel clicados
        document.querySelector(`.notifications-tab-link[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // Re-renderiza as notificações para a aba ativa
        this.renderNotifications();
    },

    openConfirmationModal() {
        if (this.confirmationModal) {
            this.confirmationModal.classList.remove('hidden');
        }
    },

    closeConfirmationModal() {
        if (this.confirmationModal) {
            this.confirmationModal.classList.add('hidden');
        }
    },

    confirmClearAll() {
        // Adiciona a classe 'dismissing' a todas as notificações existentes para a animação
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.classList.add('dismissing');
        });

        // Espera a animação terminar antes de limpar o conteúdo e os dados
        setTimeout(() => {
            this.notifications = []; // Limpa todas as notificações
            this.saveNotifications(); // Salva o estado vazio
            this.renderNotifications(); // Re-renderiza (mostrará a mensagem de "nenhuma notificação")
            this.closeConfirmationModal();
            this.showToast('Todas as notificações foram limpas!'); // Mostra a toast de sucesso
        }, 400); // Tempo da animação CSS
    },

    dismissNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            const notificationItem = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.add('dismissing');
                notificationItem.addEventListener('transitionend', () => { // Use transitionend for CSS transitions
                    this.notifications.splice(index, 1); // Remove do array
                    this.saveNotifications(); // Salva o novo estado
                    this.renderNotifications(); // Re-renderiza
                }, { once: true });
            }
        }
    },

    // Adiciona 'actionButton' como parâmetro para manipulação do botão
    handleNotificationAction(notificationId, actionType, actionButton = null) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        console.log(`Ação "${actionType}" na notificação ${notificationId}`);

        // Aplica feedback visual imediato ao botão clicado PRIMEIRO
        if (actionButton) {
            switch (actionType) {
                case 'follow-back':
                case 'follow':
                    actionButton.textContent = actionType === 'follow' ? 'Seguindo!' : 'Seguindo de volta!';
                    actionButton.disabled = true;
                    actionButton.classList.remove('btn-primary');
                    actionButton.classList.add('btn-secondary', 'followed-action');
                    break;
                case 'reply-comment': // Novo caso para responder comentário
                    // Apenas atualiza o visual, não faz nada funcional
                    actionButton.textContent = 'Respondido!';
                    actionButton.disabled = true;
                    actionButton.classList.remove('btn-primary');
                    actionButton.classList.add('btn-secondary', 'replied-action');
                    break;
                case 'accept-community':
                    actionButton.textContent = 'Aceito!';
                    actionButton.disabled = true;
                    actionButton.classList.remove('btn-primary');
                    actionButton.classList.add('btn-secondary', 'accepted-action');
                    break;
                case 'view-post':
                case 'get-help': // Novo caso para ajuda do sistema
                    actionButton.textContent = 'Abrindo...';
                    actionButton.disabled = true;
                    break;
                // Adicione outros casos para feedback visual de botões aqui, se necessário
            }
        }

        // Agora, lida com a lógica de dados e outras atualizações de UI que podem re-renderizar partes do DOM
        switch (actionType) {
            case 'follow-back':
            case 'follow':
                console.log(`Usuário ${notification.user} agora está sendo seguido.`);
                const userInExplore = Explore.users.find(u => u.name === notification.user);
                if (userInExplore) {
                    userInExplore.isFollowing = true;
                    Explore.saveFollowStatus();
                    // Se a aba 'pessoas' estiver ativa, re-renderiza.
                    // Isso acontece DEPOIS que as classes do botão já foram modificadas.
                    if (document.querySelector('.tab-link[data-tab="pessoas"]') && document.querySelector('.tab-link[data-tab="pessoas"]').classList.contains('active')) {
                        Explore.renderPeopleTab();
                    }
                }
                this.showToast(`Você começou a seguir ${notification.user}!`);
                setTimeout(() => {
                    this.dismissNotification(notificationId);
                }, 1500); // Atraso maior para ver o feedback
                break;
            case 'like': // Ação de 'like' não tem botão na notificação, mas se tivesse...
                console.log(`Usuário ${notification.user} curtiu sua foto.`);
                this.showToast(`Você curtiu a publicação de ${notification.user}!`);
                setTimeout(() => {
                    this.dismissNotification(notificationId);
                }, 1500);
                break;
            case 'reply-comment': // Novo: Ação de responder comentário
                // Ação funcional removida, apenas feedback visual
                console.log(`Ação de responder comentário simulada para ${notification.user}. Nenhuma ação funcional.`);
                this.showToast(`Você respondeu ao comentário de ${notification.user}!`);
                setTimeout(() => {
                    this.dismissNotification(notificationId);
                }, 1500);
                break;
            case 'accept-community':
                console.log(`Convite para a comunidade "${notification.user}" aceito.`);
                this.showToast(`Você entrou na comunidade ${notification.user}!`);
                setTimeout(() => {
                    this.dismissNotification(notificationId);
                }, 1500);
                break;
            case 'view-post':
                console.log(`Redirecionando para a publicação mencionada por ${notification.user}.`);
                this.showToast(`Redirecionando para a publicação de ${notification.user}...`);
                setTimeout(() => {
                    window.location.href = 'feed.html'; // Redireciona para a página do feed
                    this.dismissNotification(notificationId); // Descarta a notificação após a ação
                }, 700); // Pequeno atraso para a toast
                break;
            case 'view-details':
                console.log(`Visualizando detalhes do evento "${notification.user}".`);
                this.openEventDetailsModal(notification);
                // Não descarta a notificação aqui, pois o usuário pode querer vê-la novamente após fechar o modal
                break;
            case 'get-help': // Novo: Ação de ajuda do sistema
                console.log(`Abrindo página de ajuda para notificação do sistema.`);
                this.showToast(`Abrindo central de ajuda...`);
                setTimeout(() => {
                    // Redireciona para a página de ajuda
                    window.location.href = 'ajuda.html';
                    this.dismissNotification(notificationId);
                }, 700);
                break;
            default:
                console.warn(`Ação desconhecida: ${actionType}`);
                this.dismissNotification(notificationId); // Ainda descarta para limpar a notificação
                break;
        }
    },

    // NOVO: Função para abrir o modal de detalhes do evento
    openEventDetailsModal(notification) {
        if (this.eventDetailsModal) {
            this.eventModalTitle.textContent = notification.user;
            this.eventModalDescription.innerHTML = notification.message.replace('Lembrete: ', ''); // Remove "Lembrete:"
            // Mock de dados adicionais para o evento, já que não estão no objeto notification
            this.eventModalTime.textContent = 'Hoje, 19:00 - 20:30';
            this.eventModalLocation.textContent = 'Online (Link será enviado)';
            // Define a imagem do avatar do Emanuel
            this.eventModalAvatar.src = notification.avatar;

            this.eventDetailsModal.classList.remove('hidden');
            // Adiciona listener para o botão "Participar Agora"
            const joinWorkshopBtn = document.getElementById('join-workshop-btn');
            if (joinWorkshopBtn) {
                joinWorkshopBtn.onclick = () => {
                    window.location.href = `workshop.html?title=${encodeURIComponent(notification.user)}`;
                };
            }
        }
    },

    // NOVO: Função para fechar o modal de detalhes do evento
    closeEventDetailsModal() {
        if (this.eventDetailsModal) {
            this.eventDetailsModal.classList.add('hidden');
        }
    },

    // NOVO: Função para exibir a mensagem de toast
    showToast(message) {
        if (this.toastMessage && this.toastText) {
            this.toastText.textContent = message;
            this.toastMessage.classList.add('show');
            setTimeout(() => {
                this.toastMessage.classList.remove('show');
            }, 3000); // Esconde a mensagem após 3 segundos
        }
    },

    // NOVO: Simula a chegada de novas notificações em tempo real
    startSimulatedNewNotifications() {
        // Notificações simuladas que podem aparecer dinamicamente
        const newSimulatedNotifications = [
            { type: 'like', user: 'Gabriel S.', avatar: 'https://i.pinimg.com/736x/84/d4/b3/84d4b3288bbde06f3d67584964108440.jpg', message: 'curtiu sua foto mais recente.', postThumb: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=100&auto=format&fit=crop' },
            { type: 'comment', user: 'Beatriz M.', avatar: 'https://placehold.co/40x40/8a2be2/white?text=B', message: 'comentou: "Que vibe boa! ✨"', postThumb: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=100&auto=format&fit=crop' },
            { type: 'follow', user: 'Lucas P.', avatar: 'https://placehold.co/40x40/3cb371/white?text=L', message: 'começou a seguir você.', actionBtn: { text: 'Seguir de volta', class: 'btn-primary', action: 'follow-back' } },
            // Removida a notificação de evento genérica
            { type: 'system', user: 'Conectare Suporte', avatar: 'https://placehold.co/40x40/65676b/white?text=S', message: 'Uma nova atualização de segurança foi aplicada à sua conta.', actionBtn: { text: 'Saiba Mais', class: 'btn-secondary', action: 'get-help' } }
        ];

        let notificationCounter = 0;
        setInterval(() => {
            const newNotification = newSimulatedNotifications[notificationCounter % newSimulatedNotifications.length];
            // Cria uma cópia para garantir que o ID seja único e não afete o array original
            const notificationToAdd = JSON.parse(JSON.stringify(newNotification));
            this.addNotification(notificationToAdd);
            notificationCounter++;
        }, 18000); // Alterado para 18 segundos (entre 15 e 20)
    }
};

// =================================
//  LÓGICA DA PÁGINA DE COMUNIDADES
// =================================
const Communities = {
    init() {
        if (!document.querySelector('.content-communities')) return;

        this.joinButtons = document.querySelectorAll('.community-card .btn-primary, .community-card .btn-secondary'); // Seleciona ambos
        this.addEventListeners();
    },

    addEventListeners() {
        this.joinButtons.forEach(button => {
            button.addEventListener('click', (e) => this.toggleJoin(e.currentTarget));
        });
    },

    toggleJoin(button) {
        button.classList.toggle('joined');
        if (button.classList.contains('joined')) {
            button.textContent = 'Entrou';
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        } else {
            button.textContent = 'Juntar-se';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        }
    }
};