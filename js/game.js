// =================================================================================
//  CONECTARE - GAME HUB JAVASCRIPT FILE (GX Corner equivalent)
//  Author: Gemini
//  Description: Client-side logic for the Game Hub functionality, including
//               displaying news, free games, upcoming releases, popular streams,
//               and playable online games via iframe.
// =================================================================================

const GXCorner = {
    // Dados simulados para a Central de Jogos
    data: {
        news: [
            {
                id: 'news1',
                title: 'Novo RPG Cyberpunk Lançado!',
                snippet: 'Um mundo distópico e cheio de neon te espera neste novo RPG de mundo aberto. Prepare-se para horas de exploração e combates intensos.',
                image: 'https://geeknfeminist.com.br/wp-content/uploads/2023/07/imagem_2023-07-11_170928566.png',
                link: 'https://fictional-news.com/cyberpunk-rpg',
                date: '10 de Julho de 2025'
            },
            {
                id: 'news2',
                title: 'Atualização Gigante para "Planetas Perdidos" Chega!',
                snippet: 'Explore novas galáxias, enfrente inimigos inéditos e descubra segredos antigos na maior atualização de Planetas Perdidos até agora.',
                image: 'https://assets-prd.ignimgs.com/2022/03/08/lostplanetextreme-1646762414709.jpg',
                link: 'https://fictional-news.com/planetas-perdidos-update',
                date: '8 de Julho de 2025'
            },
            {
                id: 'news3',
                title: 'Indie Game "Sonhos Pixelados" Vence Prêmio!',
                snippet: 'Com gráficos retrô e uma história emocionante, este pequeno jogo independente conquistou corações e o prêmio de Jogo do Ano Indie.',
                image: 'https://static0.hardcoregamerimages.com/wordpress/wp-content/uploads/2024/12/indie_game_awards_recipients_header.jpg',
                link: 'https://fictional-news.com/sonhos-pixelados-premio',
                date: '5 de Julho de 2025'
            },
            {
                id: 'news4',
                title: 'Anunciado Novo Console da Próxima Geração!',
                snippet: 'Finalmente! A Nintendo confirmou, nesta terça-feira (7), a chegada do Switch 2, nova e esperada geração de sua linha de consoles.',
                image: 'https://img.odcdn.com.br/wp-content/uploads/2024/02/Nintendo-Switch.jpg',
                link: 'https://fictional-news.com/quantum-x-reveal',
                date: '3 de Julho de 2025'
            }
        ],
        freeGames: [
            {
                id: 'free1',
                title: 'Valorant',
                platform: 'PC',
                description: 'VALORANT é um jogo de tiro tático 5v5 ambientado no cenário global. Os membros do Game Pass podem vincular seu perfil do Xbox à sua conta da Riot para desbloquear todos os Agentes atuais e futuros.',
                image: 'https://tse4.mm.bing.net/th/id/OIP.TWSo_lejU0wlsp6jut5LOwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
                status: 'available' // 'available' ou 'claimed'
            },
            {
                id: 'free2',
                title: 'Grand Theft Auto V',
                platform: 'PC, Console',
                description: 'O jogo foi projetado ao redor de três protagonistas a fim de inovar a estrutura principal da série e impedir que ela estagnasse em formatos mais antigos.!',
                image: 'https://images.hindustantimes.com/tech/img/2023/09/19/1600x900/GTA_5_1694957815248_1695088760785.png',
                status: 'available'
            },
            {
                id: 'free3',
                title: 'Mistério da Mansão Assombrada',
                platform: 'PC',
                description: 'Desvende os segredos de uma mansão abandonada neste jogo de terror psicológico. Resgate agora e jogue no escuro!',
                image: 'https://tse3.mm.bing.net/th/id/OIP.J5_Wijgj7xNV1GumS9_XpgHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3',
                status: 'available'
            }
        ],
        upcomingGames: [
            {
                id: 'upcoming1',
                title: 'Crônicas do Dragão: Ascensão',
                releaseDate: '15 de Agosto de 2025',
                platform: 'PC, PS5, Xbox Series X',
                image: 'https://cinepop.com.br/wp-content/uploads/2022/03/game-of-thrones-the-rise-of-the-dragon-3-1-696x514.jpg'
            },
            {
                id: 'upcoming2',
                title: 'Simulador de Vida 2026',
                releaseDate: '20 de Setembro de 2025',
                platform: 'PC',
                image: 'https://media.vandal.net/i/1280x720/3-2024/21/20243211822796_1.jpg'
            },
            {
                id: 'upcoming3',
                title: 'A Queda de Neo-Londres',
                releaseDate: '10 de Outubro de 2025',
                platform: 'PC, PS5',
                image: 'https://cdnb.artstation.com/p/assets/images/images/045/358/223/large/sheheryar-ahmed-fb6eafe5-a03e-476a-95d3-7ef104434001.jpg?1642532667'
            }
        ],
        streams: [
            {
                id: 'stream1',
                streamer: 'GamerGaláxia',
                game: 'Planetas Perdidos',
                viewers: '1.2K',
                thumbnail: 'https://p4.wallpaperbetter.com/wallpaper/194/321/93/lost-planet-video-games-concept-art-snow-winter-weapon-wallpaper-preview.jpg',
                isLive: true
            },
            {
                id: 'stream2',
                streamer: 'MestreDosPixels',
                game: 'Sonhos Pixelados',
                viewers: '850',
                thumbnail: 'https://th.bing.com/th/id/R.d6613fb8189406828e7c5ed3ab5bae35?rik=WzZzUXNdpG%2buqA&riu=http%3a%2f%2fwww.gamerinfo.com.br%2fwp-content%2fuploads%2f2020%2f01%2fjogos-em-pixel-art-para-pc-stardew-valley.jpg&ehk=lL2t64iWhEzCosN3IG9rV1ztgcaxIQ8kglGUBIVTtes%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
                isLive: true
            },
            {
                id: 'stream3',
                streamer: 'RainhaDoFPS',
                game: 'Zona de Batalha',
                viewers: '2.5K',
                thumbnail: 'https://occ-0-3604-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABbLAwE4KyLBX-OtM4aDTpP_FB-Hh449v2N6J5IVh2WR2nJruC68mgjRb0D5kWrUKwhWtfveimLjkbwGN8P_koBLFci7GKNNmNEck.jpg?r=5cc',
                isLive: false // Exemplo de stream offline
            },
            {
                id: 'stream4',
                streamer: 'OVelhoGamer',
                game: 'Retrô Mania',
                viewers: '300',
                thumbnail: 'https://th.bing.com/th/id/R.aee3976e81d2793da478a097c340d1ba?rik=02FkWfEww3zz8A&pid=ImgRaw&r=0',
                isLive: true
            }
        ],
        // Dados para Jogos Online - Seleção de jogos mais "passa tempo" e viciantes
        onlineGames: [
            {
                id: 'dino-game',
                title: 'Jogo do Dinossauro',
                description: 'Corra e pule sobre os cactos neste clássico jogo offline do Chrome!',
                image: 'https://uploads.jovemnerd.com.br/wp-content/uploads/2020/04/jogo-dinossauro-google.png', // Imagem placeholder para o jogo do Dino
                // ATENÇÃO: Esta URL é um exemplo. É CRÍTICO testar se ela permite embedding.
                // Recomenda-se buscar por uma versão embeddable ou hospedar você mesmo.
                gameUrl: 'https://chromedino.com/'
            },
            {
                id: 'flappy-bird',
                title: 'Flappy Bird',
                description: 'Toque para voar e desvie dos canos neste jogo viciante de um toque. Qual a sua maior pontuação?',
                image: 'https://th.bing.com/th/id/R.94928f1065508fcc0b0c993595facf47?rik=3oC93CVded1MQg&pid=ImgRaw&r=0d', // Imagem placeholder para Flappy Bird
                // ATENÇÃO: Esta URL é um exemplo. É CRÍTICO testar se ela permite embedding.
                // Recomenda-se buscar por "open source HTML5 Flappy Bird game" para hospedar você mesmo.
                gameUrl: 'https://flappybird.io/' // URL de um clone de Flappy Bird (pode não permitir embedding)
            }
        ]
    },

    init() {
        // Verifica se estamos na página correta antes de inicializar
        if (!document.querySelector('.content-game')) return;

        this.cacheDOMElements();
        this.addEventListeners();
        this.loadClaimedGames(); // Carrega o status dos jogos resgatados
        this.renderContent('noticias'); // Renderiza a aba de notícias por padrão
    },

    cacheDOMElements() {
        this.tabLinks = document.querySelectorAll('.game-content-tabs .tab-link');
        this.tabPanes = document.querySelectorAll('.game-content-tabs .tab-pane');
        this.newsGrid = document.getElementById('news-grid');
        this.freeGamesGrid = document.getElementById('free-games-grid');
        this.upcomingGamesGrid = document.getElementById('upcoming-games-grid');
        this.streamsGrid = document.getElementById('streams-grid');
        this.onlineGamesGrid = document.getElementById('online-games-grid'); // NOVO: Grid para jogos online
        this.gameSearchInput = document.getElementById('game-search-input');

        // Elementos do Modal de Jogo
        this.gamePlayModal = document.getElementById('game-play-modal');
        this.gameModalTitle = document.getElementById('game-modal-title');
        this.gameIframe = document.getElementById('game-iframe');
        this.gameModalCloseBtn = document.getElementById('game-modal-close-btn');
    },

    addEventListeners() {
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.activateTab(tabId);
            });
        });

        // Delegação de eventos para botões de "Resgatar" e "Jogar Agora"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('claim-game-btn')) {
                const gameId = e.target.dataset.gameId;
                this.claimGame(gameId, e.target);
            }
            if (e.target.classList.contains('play-online-game-btn')) { // NOVO: Listener para jogar online
                const gameId = e.target.dataset.gameId;
                this.openGameModal(gameId);
            }
            // Adicionado listener para botões "no-action-btn"
            if (e.target.classList.contains('no-action-btn')) {
                e.preventDefault(); // Previne qualquer ação padrão do botão
                console.log("Botão clicado, mas sem ação definida.");
            }
        });

        // Listener para fechar o modal de jogo
        if (this.gameModalCloseBtn) {
            this.gameModalCloseBtn.addEventListener('click', () => this.closeGameModal());
        }
        // Fechar modal clicando fora (no overlay)
        if (this.gamePlayModal) {
            this.gamePlayModal.addEventListener('click', (e) => {
                if (e.target === this.gamePlayModal) {
                    this.closeGameModal();
                }
            });
        }


        // Event listener para a busca
        if (this.gameSearchInput) {
            this.gameSearchInput.addEventListener('input', (e) => this.filterContent(e.target.value));
        }
    },

    activateTab(tabId) {
        // Remove 'active' de todas as abas e painéis
        this.tabLinks.forEach(link => link.classList.remove('active'));
        this.tabPanes.forEach(pane => pane.classList.remove('active'));

        // Adiciona 'active' à aba e painel clicados
        document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // Renderiza o conteúdo da aba ativa
        this.renderContent(tabId);
    },

    renderContent(tabId) {
        // Limpa o conteúdo anterior de todas as grids antes de renderizar
        this.newsGrid.innerHTML = '';
        this.freeGamesGrid.innerHTML = '';
        this.upcomingGamesGrid.innerHTML = '';
        this.streamsGrid.innerHTML = '';
        this.onlineGamesGrid.innerHTML = ''; // NOVO: Limpa a grid de jogos online

        switch (tabId) {
            case 'noticias':
                this.data.news.forEach(item => {
                    // Botão "Ler Mais" que não faz nada
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.snippet}</p>
                                <div class="game-card-actions">
                                    <button class="btn-primary no-action-btn" style="width: 100%;">Ler Mais <i class="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.newsGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'gratis':
                this.data.freeGames.forEach(item => {
                    const isClaimed = this.getClaimStatus(item.id);
                    const buttonClass = isClaimed ? 'btn-secondary claimed' : 'btn-primary';
                    const buttonText = isClaimed ? 'Resgatado <i class="fa-solid fa-check"></i>' : 'Resgatar <i class="fa-solid fa-download"></i>';
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div class="game-card-actions">
                                    <button class="${buttonClass} claim-game-btn" data-game-id="${item.id}" ${isClaimed ? 'disabled' : ''}>
                                        ${buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.freeGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'lancamentos':
                this.data.upcomingGames.forEach(item => {
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>Plataformas: ${item.platform}</p>
                                <p>Lançamento: <strong>${item.releaseDate}</strong></p>
                                <div class="game-card-actions">
                                    <button class="btn-secondary" disabled>Em Breve <i class="fa-solid fa-calendar-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.upcomingGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'streams':
                this.data.streams.forEach(item => {
                    const liveBadge = item.isLive ? '<span class="stream-live-badge">AO VIVO</span>' : '';
                    const viewersInfo = item.isLive ? `<div class="stream-viewer-count"><i class="fa-solid fa-eye"></i> ${item.viewers}</div>` : '';
                    // Botão "Assistir Agora" que não faz nada
                    const buttonText = item.isLive ? 'Assistir Agora' : 'Ver Canal';
                    const card = `
                        <div class="stream-card">
                            <div style="position: relative;">
                                <img src="${item.thumbnail}" alt="Stream de ${item.streamer}" class="stream-thumbnail">
                                ${liveBadge}
                            </div>
                            <div class="stream-info">
                                <h3>${item.streamer}</h3>
                                <p>Jogando: ${item.game}</p>
                                ${viewersInfo}
                                <div class="game-card-actions" style="margin-top: 15px;">
                                    <button class="btn-primary no-action-btn" style="width: 100%;">${buttonText} <i class="fa-solid fa-play"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.streamsGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'jogos-online': // NOVO: Renderiza jogos online
                this.data.onlineGames.forEach(item => {
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div class="game-card-actions">
                                    <button class="btn-primary play-online-game-btn" data-game-id="${item.id}">
                                        Jogar Agora <i class="fa-solid fa-play"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.onlineGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
        }
    },

    // Funções para simular o resgate de jogos grátis
    loadClaimedGames() {
        const claimedGames = JSON.parse(localStorage.getItem('claimedGames')) || [];
        this.claimedGames = new Set(claimedGames); // Usar um Set para busca rápida
    },

    saveClaimedGames() {
        localStorage.setItem('claimedGames', JSON.stringify(Array.from(this.claimedGames)));
    },

    getClaimStatus(gameId) {
        return this.claimedGames.has(gameId);
    },

    claimGame(gameId, buttonElement) {
        if (!this.getClaimStatus(gameId)) {
            this.claimedGames.add(gameId);
            this.saveClaimedGames();

            buttonElement.classList.remove('btn-primary');
            buttonElement.classList.add('btn-secondary', 'claimed');
            buttonElement.innerHTML = 'Resgatado <i class="fa-solid fa-check"></i>';
            buttonElement.disabled = true;

            // Opcional: Adicionar uma notificação ou mensagem de sucesso simulada
            console.log(`Jogo ${gameId} resgatado com sucesso!`);
        }
    },

    // NOVO: Funções para o Modal de Jogo
    openGameModal(gameId) {
        const game = this.data.onlineGames.find(g => g.id === gameId);
        if (game) {
            this.gameModalTitle.textContent = game.title;
            this.gameIframe.src = game.gameUrl;
            this.gamePlayModal.classList.remove('hidden');
            // Opcional: Adicionar classe para desabilitar scroll do body
            document.body.style.overflow = 'hidden';
        }
    },

    closeGameModal() {
        this.gamePlayModal.classList.add('hidden');
        this.gameIframe.src = ''; // Limpa o src para parar o jogo/áudio
        document.body.style.overflow = ''; // Restaura o scroll do body
    },

    // Função de busca (simples, filtra pelo título)
    filterContent(query) {
        const lowerCaseQuery = query.toLowerCase();
        const currentTabId = document.querySelector('.game-content-tabs .tab-link.active').dataset.tab;
        let filteredData = [];

        // Limpa todas as grids antes de filtrar
        this.newsGrid.innerHTML = '';
        this.freeGamesGrid.innerHTML = '';
        this.upcomingGamesGrid.innerHTML = '';
        this.streamsGrid.innerHTML = '';
        this.onlineGamesGrid.innerHTML = '';

        switch (currentTabId) {
            case 'noticias':
                filteredData = this.data.news.filter(item => item.title.toLowerCase().includes(lowerCaseQuery) || item.snippet.toLowerCase().includes(lowerCaseQuery));
                filteredData.forEach(item => {
                    // Botão "Ler Mais" que não faz nada
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.snippet}</p>
                                <div class="game-card-actions">
                                    <button class="btn-primary no-action-btn" style="width: 100%;">Ler Mais <i class="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.newsGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'gratis':
                filteredData = this.data.freeGames.filter(item => item.title.toLowerCase().includes(lowerCaseQuery) || item.description.toLowerCase().includes(lowerCaseQuery));
                filteredData.forEach(item => {
                    const isClaimed = this.getClaimStatus(item.id);
                    const buttonClass = isClaimed ? 'btn-secondary claimed' : 'btn-primary';
                    const buttonText = isClaimed ? 'Resgatado <i class="fa-solid fa-check"></i>' : 'Resgatar <i class="fa-solid fa-download"></i>';
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div class="game-card-actions">
                                    <button class="${buttonClass} claim-game-btn" data-game-id="${item.id}" ${isClaimed ? 'disabled' : ''}>
                                        ${buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.freeGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'lancamentos':
                filteredData = this.data.upcomingGames.filter(item => item.title.toLowerCase().includes(lowerCaseQuery) || item.platform.toLowerCase().includes(lowerCaseQuery));
                filteredData.forEach(item => {
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>Plataformas: ${item.platform}</p>
                                <p>Lançamento: <strong>${item.releaseDate}</strong></p>
                                <div class="game-card-actions">
                                    <button class="btn-secondary" disabled>Em Breve <i class="fa-solid fa-calendar-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.upcomingGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'streams':
                filteredData = this.data.streams.filter(item => item.streamer.toLowerCase().includes(lowerCaseQuery) || item.game.toLowerCase().includes(lowerCaseQuery));
                filteredData.forEach(item => {
                    const liveBadge = item.isLive ? '<span class="stream-live-badge">AO VIVO</span>' : '';
                    const viewersInfo = item.isLive ? `<div class="stream-viewer-count"><i class="fa-solid fa-eye"></i> ${item.viewers}</div>` : '';
                    // Botão "Assistir Agora" que não faz nada
                    const buttonText = item.isLive ? 'Assistir Agora' : 'Ver Canal';
                    const card = `
                        <div class="stream-card">
                            <div style="position: relative;">
                                <img src="${item.thumbnail}" alt="Stream de ${item.streamer}" class="stream-thumbnail">
                                ${liveBadge}
                            </div>
                            <div class="stream-info">
                                <h3>${item.streamer}</h3>
                                <p>Jogando: ${item.game}</p>
                                ${viewersInfo}
                                <div class="game-card-actions" style="margin-top: 15px;">
                                    <button class="btn-primary no-action-btn" style="width: 100%;">${buttonText} <i class="fa-solid fa-play"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.streamsGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
            case 'jogos-online': // NOVO: Filtra e renderiza jogos online
                filteredData = this.data.onlineGames.filter(item => item.title.toLowerCase().includes(lowerCaseQuery) || item.description.toLowerCase().includes(lowerCaseQuery));
                filteredData.forEach(item => {
                    const card = `
                        <div class="game-card">
                            <img src="${item.image}" alt="${item.title}" class="game-card-image">
                            <div class="game-card-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div class="game-card-actions">
                                    <button class="btn-primary play-online-game-btn" data-game-id="${item.id}">
                                        Jogar Agora <i class="fa-solid fa-play"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    this.onlineGamesGrid.insertAdjacentHTML('beforeend', card);
                });
                break;
        }
    }
};
