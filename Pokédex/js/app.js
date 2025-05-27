// Constantes e variáveis globais
const API_URL = 'https://pokeapi.co/api/v2';
let currentPokemonData = null;
let currentLanguage = 'pt'; // Default language (Portuguese)
let compareData = null; // Dados do Pokémon para comparação

// Variáveis globais
const DEFAULT_LANGUAGE = 'pt-br';
let allPokemonList = []; // Lista com todos os Pokémon para autocompletar

// Mapeamento de tipos para cores de tema
const TYPE_COLORS = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

// Mapeamento de tipos para gradientes
const TYPE_GRADIENTS = {
    normal: 'linear-gradient(90deg, #A8A878 0%, #C6C6A7 100%)',
    fire: 'linear-gradient(90deg, #F08030 0%, #FA9356 100%)',
    water: 'linear-gradient(90deg, #6890F0 0%, #89A3F5 100%)',
    grass: 'linear-gradient(90deg, #78C850 0%, #98D873 100%)',
    electric: 'linear-gradient(90deg, #F8D030 0%, #FADB58 100%)',
    ice: 'linear-gradient(90deg, #98D8D8 0%, #BCE6E6 100%)',
    fighting: 'linear-gradient(90deg, #C03028 0%, #D4514A 100%)',
    poison: 'linear-gradient(90deg, #A040A0 0%, #BB60BB 100%)',
    ground: 'linear-gradient(90deg, #E0C068 0%, #E8D190 100%)',
    flying: 'linear-gradient(90deg, #A890F0 0%, #C2B0F6 100%)',
    psychic: 'linear-gradient(90deg, #F85888 0%, #FA86A9 100%)',
    bug: 'linear-gradient(90deg, #A8B820 0%, #C4D348 100%)',
    rock: 'linear-gradient(90deg, #B8A038 0%, #D1C166 100%)',
    ghost: 'linear-gradient(90deg, #705898 0%, #9274B1 100%)',
    dragon: 'linear-gradient(90deg, #7038F8 0%, #9673FF 100%)',
    dark: 'linear-gradient(90deg, #705848 0%, #92766A 100%)',
    steel: 'linear-gradient(90deg, #B8B8D0 0%, #D1D1E0 100%)',
    fairy: 'linear-gradient(90deg, #EE99AC 0%, #F4B5C4 100%)'
};

// Função para inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Anexar os event listeners
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);
    
    // Configurar sistema de abas
    setupTabs();
    
    // Configurar toggle de tema
    setupThemeToggle();

    // Configurar sistema de favoritos
    setupFavorites();
    
    // Configurar menu de favoritos
    setupFavoritesMenu();
    
    // Configurar modal de comparação
    setupCompareModal();
    
    // Configurar botão de compartilhamento
    setupShareButton();
    
    // Exibir histórico de pesquisa
    updateSearchHistoryUI();
    
    // Configurar sugestões de pesquisa
    setupSearchSuggestions();

    // Verificar se há um Pokémon específico na URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonParam = urlParams.get('pokemon');
    
    if (pokemonParam) {
        // Carregar o Pokémon da URL
        fetchPokemonData(pokemonParam);
    } else {
        // Carregar um Pokémon inicial (Por exemplo, Pikachu)
        fetchPokemonData(25);
    }
    
    // Carregar lista de todos os Pokémon para a função de autocompletar
    loadAllPokemonList();
});

// Função para configurar o menu de favoritos
function setupFavoritesMenu() {
    // Configurar botão para abrir menu
    const favoritesToggle = document.getElementById('favorites-toggle');
    const favoritesMenu = document.getElementById('favorites-menu');
    const closeButton = document.querySelector('.close-favorites');
    
    if (favoritesToggle && favoritesMenu) {
        favoritesToggle.addEventListener('click', () => {
            favoritesMenu.classList.add('show');
            updateFavoritesMenu();
        });
        
        // Botão para fechar menu
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                favoritesMenu.classList.remove('show');
            });
        }
        
        // Fechar ao clicar fora
        document.addEventListener('click', (event) => {
            if (!favoritesMenu.contains(event.target) && event.target !== favoritesToggle) {
                favoritesMenu.classList.remove('show');
            }
        });
    }
}

// Função para configurar o sistema de favoritos
function setupFavorites() {
    // Adicionar um botão de favorito ao cabeçalho
    const pokemonHeader = document.querySelector('.pokemon-header');
    const favoriteButton = document.createElement('button');
    favoriteButton.id = 'favorite-button';
    favoriteButton.classList.add('favorite-button');
    favoriteButton.innerHTML = '<span class="favorite-icon">☆</span>';
    favoriteButton.title = 'Adicionar aos favoritos';
    
    favoriteButton.addEventListener('click', toggleFavorite);
    
    // Inserir o botão no cabeçalho, após o container de nome
    const nameContainer = document.querySelector('.pokemon-name-container');
    if (nameContainer && pokemonHeader) {
        pokemonHeader.insertBefore(favoriteButton, nameContainer.nextSibling);
    }
}

// Função para alternar o status de favorito de um Pokémon
function toggleFavorite() {
    if (!currentPokemonData) return;
    
    const favoriteButton = document.getElementById('favorite-button');
    const favorites = getFavorites();
    
    // Verificar se o Pokémon já está nos favoritos
    const isFavorite = favorites.some(fav => fav.id === currentPokemonData.id);
    
    if (isFavorite) {
        // Remover dos favoritos
        const updatedFavorites = favorites.filter(fav => fav.id !== currentPokemonData.id);
        localStorage.setItem('pokedex-favorites', JSON.stringify(updatedFavorites));
        favoriteButton.innerHTML = '<span class="favorite-icon">☆</span>';
        favoriteButton.title = 'Adicionar aos favoritos';
        favoriteButton.classList.remove('favorite-active');
        
        showToast('Removido dos favoritos!');
    } else {
        // Adicionar aos favoritos
        const pokemonToSave = {
            id: currentPokemonData.id,
            name: currentPokemonData.name,
            sprite: currentPokemonData.sprites.front_default,
            types: currentPokemonData.types.map(t => t.type.name)
        };
        
        favorites.push(pokemonToSave);
        localStorage.setItem('pokedex-favorites', JSON.stringify(favorites));
        favoriteButton.innerHTML = '<span class="favorite-icon">★</span>';
        favoriteButton.title = 'Remover dos favoritos';
        favoriteButton.classList.add('favorite-active');
        
        showToast('Adicionado aos favoritos!');
    }
    
    // Atualizar o menu de favoritos se existir
    updateFavoritesMenu();
}

// Função para obter a lista de favoritos
function getFavorites() {
    const savedFavorites = localStorage.getItem('pokedex-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
}

// Função para atualizar o menu de favoritos
function updateFavoritesMenu() {
    const favoritesMenu = document.getElementById('favorites-menu');
    if (!favoritesMenu) return;
    
    const favorites = getFavorites();
    const menuContent = favoritesMenu.querySelector('.favorites-menu-header').nextElementSibling;
    
    // Limpar o conteúdo existente (preservando o cabeçalho)
    while (menuContent && menuContent.nextElementSibling) {
        favoritesMenu.removeChild(menuContent.nextElementSibling);
    }
    
    if (favorites.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'no-favorites';
        emptyMessage.textContent = 'Nenhum Pokémon favorito ainda!';
        favoritesMenu.appendChild(emptyMessage);
        return;
    }
    
    // Adicionar cada Pokémon favorito ao menu
    favorites.forEach(fav => {
        const favItem = document.createElement('div');
        favItem.classList.add('favorite-item');
        favItem.innerHTML = `
            <img src="${fav.sprite}" alt="${fav.name}">
            <div class="favorite-info">
                <span class="favorite-name">${formatPokemonName(fav.name)}</span>
                <div class="favorite-types">
                    ${fav.types.map(type => 
                        `<span class="type-badge type-${type}">${formatPokemonName(type)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        favItem.addEventListener('click', () => {
            fetchPokemonData(fav.id);
            favoritesMenu.classList.remove('show');
        });
        
        favoritesMenu.appendChild(favItem);
    });
}

// Função para exibir um toast
function showToast(message) {
    // Verificar se já existe um toast
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    // Atualizar mensagem e exibir
    toast.textContent = message;
    toast.classList.add('show');
    
    // Ocultar após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Função para configurar o sistema de abas
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Adicionar classe active ao painel correspondente
            const tabId = button.getAttribute('data-tab');
            const tabPanel = document.getElementById(`${tabId}-tab`);
            if (tabPanel) {
                tabPanel.classList.add('active');
            }
        });
    });
}

// Função para configurar o toggle de tema
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    
    // Verificar se há uma preferência de tema salva
    const savedTheme = localStorage.getItem('pokedex-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        toggleIcon.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            toggleIcon.textContent = '☀️';
            localStorage.setItem('pokedex-theme', 'dark');
        } else {
            toggleIcon.textContent = '🌙';
            localStorage.setItem('pokedex-theme', 'light');
        }
    });
}

// Função para lidar com a busca
async function handleSearch(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) return;

    try {
        // Mostrar indicador de carregamento
        showLoadingIndicator();
        
        // Verificar se é um número (ID) ou nome
        const isNumeric = !isNaN(searchTerm);
        await fetchPokemonData(searchTerm);
        
        // Adicionar ao histórico de busca
        addToSearchHistory(searchTerm);
        
        // Limpar o campo de busca
        searchInput.value = '';
    } catch (error) {
        showErrorMessage(`Pokémon não encontrado: ${error.message}`);
    } finally {
        // Esconder indicador de carregamento
        hideLoadingIndicator();
    }
}

// Função para adicionar termo ao histórico de busca
function addToSearchHistory(term) {
    let searchHistory = localStorage.getItem('pokedex-search-history');
    searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
    
    // Evitar duplicatas no histórico
    if (!searchHistory.includes(term)) {
        // Limitar a 10 itens no histórico
        if (searchHistory.length >= 10) {
            searchHistory.pop();
        }
        
        // Adicionar no início da lista
        searchHistory.unshift(term);
        localStorage.setItem('pokedex-search-history', JSON.stringify(searchHistory));
    }
    
    // Atualizar UI do histórico se existir
    updateSearchHistoryUI();
}

// Função para atualizar UI do histórico de busca
function updateSearchHistoryUI() {
    const historyContainer = document.getElementById('search-history-container');
    if (!historyContainer) return;
    
    const searchHistory = localStorage.getItem('pokedex-search-history');
    const historyItems = searchHistory ? JSON.parse(searchHistory) : [];
    
    historyContainer.innerHTML = '';
    
    if (historyItems.length === 0) {
        historyContainer.innerHTML = '<p>Nenhuma busca recente</p>';
        return;
    }
    
    const historyList = document.createElement('ul');
    historyList.classList.add('history-list');
    
    historyItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        listItem.addEventListener('click', () => {
            document.getElementById('search-input').value = item;
            document.getElementById('search-form').dispatchEvent(new Event('submit'));
        });
        
        historyList.appendChild(listItem);
    });
    
    historyContainer.appendChild(historyList);
}

// Função para buscar dados do Pokémon
async function fetchPokemonData(idOrName) {
    try {
        showLoadingIndicator();
        document.getElementById('error-message').style.display = 'none';
        
        // Verificar se os dados já estão em cache
        const cachedData = await getPokemonFromCache(idOrName);
        if (cachedData) {
            console.log('Usando dados em cache');
            currentPokemonData = cachedData;
            renderPokemonData();
            hideLoadingIndicator();
            addToSearchHistory(idOrName);
            return currentPokemonData;
        }
        
        // Buscar dados básicos do Pokémon
        const response = await fetch(`${API_URL}/pokemon/${idOrName}`);
        if (!response.ok) {
            hideLoadingIndicator();
            showErrorMessage(`Pokémon não encontrado. Verifique o nome ou ID digitado.`);
            return null;
        }
        
        const pokemon = await response.json();
        
        // Criar um objeto species padrão vazio para caso falhe a busca
        let species = {
            flavor_text_entries: [],
            egg_groups: [],
            varieties: []
        };
        
        // Buscar informações adicionais da espécie se disponíveis
        if (pokemon.species && pokemon.species.url) {
            try {
                const speciesResponse = await fetch(pokemon.species.url);
                if (speciesResponse.ok) {
                    const speciesData = await speciesResponse.json();
                    species = {
                        ...species,  // Manter os valores padrão como fallback
                        ...speciesData // Sobrescrever com os dados reais
                    };
                } else {
                    console.warn('Não foi possível buscar informações da espécie.');
                }
            } catch (speciesError) {
                console.error('Erro ao buscar informações da espécie:', speciesError);
            }
        } else {
            console.warn('URL da espécie não disponível para este Pokémon.');
        }

        // Buscar informações sobre a cadeia evolutiva
        let evolutionChain = { chain: null };
        if (species.evolution_chain && species.evolution_chain.url) {
            try {
                const evolutionResponse = await fetch(species.evolution_chain.url);
                if (evolutionResponse.ok) {
                    evolutionChain = await evolutionResponse.json();
                }
            } catch (error) {
                console.error('Erro ao buscar cadeia evolutiva:', error);
            }
        }

        // Combinar todos os dados
        currentPokemonData = {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height / 10, // Convertendo para metros
            weight: pokemon.weight / 10, // Convertendo para kg
            types: pokemon.types || [],
            abilities: pokemon.abilities || [],
            stats: pokemon.stats || [],
            sprites: pokemon.sprites || {},
            moves: pokemon.moves || [],
            species: species,
            evolutionChain: evolutionChain,
            species_data: species // Garantir que species_data está disponível
        };

        // Buscar localizações
        try {
            const locationsResponse = await fetch(`${API_URL}/pokemon/${pokemon.id}/encounters`);
            currentPokemonData.locations = locationsResponse.ok ? await locationsResponse.json() : [];
        } catch (error) {
            console.error('Erro ao buscar localizações:', error);
            currentPokemonData.locations = [];
        }

        // Verificar formas alternativas
        currentPokemonData.alternativeForms = [];
        if (species.varieties && species.varieties.length > 1) {
            // Buscar informações para cada forma alternativa
            const formPromises = species.varieties
                .filter(variety => !variety.is_default)
                .map(async variety => {
                    try {
                        if (variety.pokemon && variety.pokemon.url) {
                            const formResponse = await fetch(variety.pokemon.url);
                            if (formResponse.ok) {
                                return formResponse.json();
                            }
                        }
                    } catch (formError) {
                        console.error('Erro ao buscar forma alternativa:', formError);
                    }
                    return null;
                });
            
            const forms = await Promise.all(formPromises);
            currentPokemonData.alternativeForms = forms.filter(form => form !== null);
        }

        // Salvar dados no cache
        savePokemonToCache(currentPokemonData);

        // Renderizar os dados na UI
        renderPokemonData();
        
        // Adicionar ao histórico de busca
        addToSearchHistory(idOrName);
        
        hideLoadingIndicator();
        return currentPokemonData;
    } catch (error) {
        console.error('Erro ao buscar dados do Pokémon:', error);
        hideLoadingIndicator();
        showErrorMessage(`Erro ao buscar dados: ${error.message}`);
        return null;
    }
}

// Função para buscar dados do Pokémon no cache
async function getPokemonFromCache(idOrName) {
    try {
        // Verificar se o navegador suporta localStorage
        if (!('localStorage' in window)) {
            return null;
        }
        
        // Chaves para buscar o Pokémon
        const cacheKey = `pokemon-cache-${idOrName}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
            try {
                const data = JSON.parse(cachedData);
                const cacheTime = localStorage.getItem(`${cacheKey}-time`);
                
                // Verificar se o cache tem menos de 24 horas
                if (cacheTime && (Date.now() - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
                    // Atualizar o timestamp para marcar como recentemente usado (LRU)
                    localStorage.setItem(`${cacheKey}-time`, Date.now().toString());
                    
                    return data;
                }
            } catch (e) {
                console.error('Erro ao ler cache:', e);
                // Se houver erro ao ler o cache, remover a entrada inválida
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}-time`);
            }
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao acessar cache:', error);
        return null;
    }
}

// Função para salvar dados do Pokémon no cache
function savePokemonToCache(pokemonData) {
    try {
        // Verificar se o navegador suporta localStorage
        if (!('localStorage' in window)) {
            return;
        }
        
        // Limitar os dados para economizar espaço
        const minimalData = reduceDataSize(pokemonData);
        
        // Chaves para o cache
        const idKey = `pokemon-cache-${minimalData.id}`;
        const nameKey = `pokemon-cache-${minimalData.name}`;
        
        try {
            // Limpar espaço no cache se necessário antes de tentar salvar
            ensureStorageSpace();
            
            // Salvar os dados pelo ID
            localStorage.setItem(idKey, JSON.stringify(minimalData));
            localStorage.setItem(`${idKey}-time`, Date.now().toString());
            
            // Salvar também pelo nome para permitir busca por nome
            try {
                localStorage.setItem(nameKey, JSON.stringify(minimalData));
                localStorage.setItem(`${nameKey}-time`, Date.now().toString());
            } catch (e) {
                // Se não conseguir salvar por nome, pelo menos tentamos por ID
            }
        } catch (e) {
            // Erro ao salvar no cache, geralmente por falta de espaço
            // Tentamos limpar mais espaço e salvar apenas o essencial
            try {
                cleanupCache(0.5); // Limpar 50% do cache
                
                // Reduzir ainda mais os dados e tentar salvar
                const essentialData = reduceDataSize(pokemonData, true);
                localStorage.setItem(idKey, JSON.stringify(essentialData));
                localStorage.setItem(`${idKey}-time`, Date.now().toString());
            } catch (finalError) {
                // Se ainda falhar, simplesmente seguimos em frente
                // O cache não é essencial para o funcionamento
            }
        }
    } catch (error) {
        // Ignorar silenciosamente erros de cache - não são críticos
    }
}

// Função auxiliar para reduzir o tamanho dos dados armazenados
function reduceDataSize(pokemonData, minimalMode = false) {
    // Clonar para não modificar o original
    const data = { ...pokemonData };
    
    // Todos os modos de redução removem estes dados volumosos
    if (data.moves) {
        // Manter apenas informações básicas dos movimentos
        data.moves = data.moves.map(move => ({
            move: {
                name: move.move.name,
                url: move.move.url
            },
            version_group_details: move.version_group_details.slice(0, 1)
        }));
    }
    
    // Remover sprites desnecessários para economizar espaço
    if (data.sprites) {
        const sprites = {
            front_default: data.sprites.front_default,
            front_shiny: data.sprites.front_shiny
        };
        
        // Manter apenas sprites oficiais se disponíveis
        if (data.sprites.other && data.sprites.other['official-artwork']) {
            sprites.other = {
                'official-artwork': {
                    front_default: data.sprites.other['official-artwork'].front_default
                }
            };
        }
        
        data.sprites = sprites;
    }
    
    // Se precisamos economizar ainda mais espaço
    if (minimalMode) {
        // Remover descrições de texto longas
        if (data.species_data) {
            if (data.species_data.flavor_text_entries) {
                // Manter apenas a entrada em português
                const ptEntry = data.species_data.flavor_text_entries.find(
                    entry => entry.language.name === 'pt' || entry.language.name === 'pt-br'
                );
                data.species_data.flavor_text_entries = ptEntry ? [ptEntry] : [];
            }
            
            // Remover outras informações desnecessárias
            delete data.species_data.form_descriptions;
            delete data.species_data.pokedex_numbers;
            delete data.species_data.varieties;
        }
        
        // Simplificar mais
        delete data.held_items;
        delete data.game_indices;
        
        // Reduzir significativamente as localizações
        if (data.locations && data.locations.length > 5) {
            data.locations = data.locations.slice(0, 5);
        }
    }
    
    return data;
}

// Função para garantir que haja espaço no localStorage
function ensureStorageSpace() {
    try {
        // Verificar se estamos perto do limite (acima de 80% da capacidade)
        if (isStorageNearFull(0.8)) {
            // Limpar 30% do cache para abrir espaço
            cleanupCache(0.3);
        }
    } catch (e) {
        // Ignorar erros
    }
}

// Função para verificar se o armazenamento está quase cheio
function isStorageNearFull(threshold = 0.8) {
    try {
        const total = 5 * 1024 * 1024; // Estimativa de 5MB (varia por navegador)
        let used = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            used += (localStorage.getItem(key) || '').length;
        }
        
        return (used / total) > threshold;
    } catch (e) {
        return true; // Se não conseguimos verificar, assumir que está cheio
    }
}

// Função para limpar o cache usando estratégia LRU (Least Recently Used)
function cleanupCache(percentage = 0.3) {
    try {
        // Coletar todas as entradas relacionadas ao cache de Pokémon
        const cacheEntries = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Identificar chaves de cache de Pokémon
            if (key && key.startsWith('pokemon-cache-') && !key.endsWith('-time')) {
                const timeKey = `${key}-time`;
                const timestamp = localStorage.getItem(timeKey);
                
                if (timestamp) {
                    cacheEntries.push({
                        key,
                        timeKey,
                        timestamp: parseInt(timestamp)
                    });
                }
            }
        }
        
        // Ordenar por timestamp (mais antigo primeiro)
        cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
        
        // Calcular quantos itens remover
        const removeCount = Math.ceil(cacheEntries.length * percentage);
        
        // Remover os itens mais antigos
        for (let i = 0; i < removeCount && i < cacheEntries.length; i++) {
            localStorage.removeItem(cacheEntries[i].key);
            localStorage.removeItem(cacheEntries[i].timeKey);
        }
    } catch (e) {
        // Se falhar ao limpar adequadamente, limpar tudo relacionado a cache
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('pokemon-cache-')) {
                    localStorage.removeItem(key);
                }
            }
        } catch (finalError) {
            // Ignorar erros finais
        }
    }
}

// Função para atualizar o estado do botão de favoritos
function updateFavoriteButtonState() {
    if (!currentPokemonData) return;
    
    const favoriteButton = document.getElementById('favorite-button');
    if (!favoriteButton) return;
    
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === currentPokemonData.id);
    
    if (isFavorite) {
        favoriteButton.innerHTML = '<span class="favorite-icon">★</span>';
        favoriteButton.title = 'Remover dos favoritos';
        favoriteButton.classList.add('favorite-active');
    } else {
        favoriteButton.innerHTML = '<span class="favorite-icon">☆</span>';
        favoriteButton.title = 'Adicionar aos favoritos';
        favoriteButton.classList.remove('favorite-active');
    }
}

// Função para renderizar dados do Pokémon na UI
function renderPokemonData() {
    if (!currentPokemonData) {
        showErrorMessage("Não foi possível carregar os dados do Pokémon.");
        return;
    }
    
    try {
        // Atualizando os elementos da UI com os dados do Pokémon
        updateBasicInfo();
        updatePokemonImages();
        updateTypeInfo();
        
        if (currentPokemonData.stats && currentPokemonData.stats.length > 0) {
            updateStatsInfo();
        }
        
        if (currentPokemonData.abilities && currentPokemonData.abilities.length > 0) {
            updateAbilitiesInfo();
        }
        
        if (currentPokemonData.evolutionChain && currentPokemonData.evolutionChain.chain) {
            updateEvolutionChain();
        }
        
        if (currentPokemonData.moves && currentPokemonData.moves.length > 0) {
            updateMovesInfo();
        }
        
        if (currentPokemonData.locations) {
            updateLocationInfo();
        }
        
        // Verificar se é possível buscar formas alternativas
        if (currentPokemonData.species && currentPokemonData.species.varieties) {
            updateAlternativeForms();
        }
        
        // Verificar se pode calcular relações de dano
        if (currentPokemonData.types && currentPokemonData.types.length > 0) {
            updateDamageRelations();
        }
        
        // Atualizar estado do botão de favoritos
        updateFavoriteButtonState();
        
        // Definir tema baseado no tipo do Pokémon
        applyThemeBasedOnType();
        
        // Animar entrada dos elementos
        animateElements();
    } catch (error) {
        console.error("Erro ao renderizar dados do Pokémon:", error);
        showErrorMessage(`Erro ao exibir dados: ${error.message}`);
    }
}

// Função para aplicar tema com base no tipo do Pokémon
function applyThemeBasedOnType() {
    if (!currentPokemonData || !currentPokemonData.types || currentPokemonData.types.length === 0) return;
    
    // Obter o tipo primário (primeiro na lista)
    const primaryType = currentPokemonData.types[0].type.name;
    
    // Obter elemento do cabeçalho
    const pokemonHeader = document.querySelector('.pokemon-header');
    if (!pokemonHeader) return;
    
    // Aplicar cor de fundo baseada no tipo
    if (TYPE_GRADIENTS[primaryType]) {
        pokemonHeader.style.background = TYPE_GRADIENTS[primaryType];
    } else if (TYPE_COLORS[primaryType]) {
        pokemonHeader.style.backgroundColor = TYPE_COLORS[primaryType];
    }
    
    // Aplicar classe de tipo ao card principal
    const pokemonCard = document.querySelector('.pokemon-card');
    if (pokemonCard) {
        // Remover todas as classes de tipo anteriores
        Object.keys(TYPE_COLORS).forEach(type => {
            pokemonCard.classList.remove(`pokemon-type-${type}`);
        });
        
        // Adicionar classe de tipo atual
        pokemonCard.classList.add(`pokemon-type-${primaryType}`);
    }
}

// Função para animar elementos na entrada
function animateElements() {
    // Selecionar elementos para animar
    const elementsToAnimate = [
        '.pokemon-header',
        '.pokemon-images',
        '.pokemon-description',
        '.info-section',
        '.tabs-container'
    ];
    
    // Remover classes de animação anteriores
    document.querySelectorAll('.fade-in').forEach(element => {
        element.classList.remove('fade-in');
    });
    
    // Aplicar animações com delay progressivo
    elementsToAnimate.forEach((selector, index) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Remover para reiniciar a animação
            element.classList.remove('fade-in');
            
            // Aplicar com um pequeno atraso
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 100);
        });
    });
}

// Funções auxiliares para atualizar partes específicas da UI
function updateBasicInfo() {
    const pokemon = currentPokemonData;
    
    // Atualizar nome, ID, altura, peso
    document.getElementById('pokemon-name').textContent = formatPokemonName(pokemon.name);
    document.getElementById('pokemon-id').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    document.getElementById('pokemon-height').textContent = `${pokemon.height} m`;
    document.getElementById('pokemon-weight').textContent = `${pokemon.weight} kg`;
    
    // Atualizar descrição da Pokédex
    const description = getLocalizedDescription();
    document.getElementById('pokemon-description').textContent = description;
    
    // Atualizar grupo de ovos (verificando se species e egg_groups existem)
    let eggGroups = 'Não disponível';
    if (pokemon.species && pokemon.species.egg_groups && Array.isArray(pokemon.species.egg_groups)) {
        eggGroups = pokemon.species.egg_groups
            .map(group => formatPokemonName(group.name))
            .join(', ') || 'Desconhecido';
    }
    document.getElementById('egg-groups').textContent = eggGroups;
}

function updatePokemonImages() {
    const pokemon = currentPokemonData;
    
    // Atualizar imagem principal
    const mainImage = document.getElementById('main-pokemon-image');
    mainImage.src = (pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && 
                    pokemon.sprites.other['official-artwork'].front_default) || 
                    pokemon.sprites.front_default || 'img/placeholder.png';
    mainImage.alt = pokemon.name;
    
    // Atualizar pixel art
    const pixelArtImage = document.getElementById('pixel-art-image');
    pixelArtImage.src = pokemon.sprites.front_default || 'img/placeholder-pixel.png';
    pixelArtImage.alt = `${pokemon.name} pixel art`;
    
    // Atualizar modelos 3D
    const model3d = document.getElementById('model-3d');
    model3d.src = (pokemon.sprites.other && pokemon.sprites.other.home && 
                  pokemon.sprites.other.home.front_default) || 
                  (pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && 
                  pokemon.sprites.other['official-artwork'].front_default) || 
                  pokemon.sprites.front_default || 'img/placeholder-3d.png';
    model3d.alt = `${pokemon.name} 3D model`;
    
    // Adicionar sprites alternativos
    const spritesContainer = document.getElementById('sprites-container');
    spritesContainer.innerHTML = '';
    
    // Adicionar todos os sprites disponíveis
    const spriteKeys = [
        'front_default', 'back_default', 
        'front_shiny', 'back_shiny',
        'front_female', 'back_female',
        'front_shiny_female', 'back_shiny_female'
    ];
    
    spriteKeys.forEach(key => {
        if (pokemon.sprites[key]) {
            const spriteImg = document.createElement('img');
            spriteImg.src = pokemon.sprites[key];
            spriteImg.alt = `${pokemon.name} ${key.replace('_', ' ')}`;
            spriteImg.classList.add('sprite-thumbnail');
            spritesContainer.appendChild(spriteImg);
        }
    });
}

function updateTypeInfo() {
    const pokemon = currentPokemonData;
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = '';
    
    pokemon.types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        const typeName = typeInfo.type.name;
        typeElement.textContent = formatPokemonName(typeName);
        typeElement.classList.add('type-badge', `type-${typeName}`);
        typesContainer.appendChild(typeElement);
    });
}

function updateStatsInfo() {
    const pokemon = currentPokemonData;
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';
    
    // Obter os nomes localizados dos stats
    const statNames = {
        'hp': 'HP',
        'attack': 'Ataque',
        'defense': 'Defesa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defesa Especial',
        'speed': 'Velocidade'
    };
    
    pokemon.stats.forEach(stat => {
        const statName = statNames[stat.stat.name] || formatPokemonName(stat.stat.name);
        const baseValue = stat.base_stat;
        
        // Calcular valores mínimos e máximos
        // Fórmula simplificada: Min = (Base * 2) para nível 100 sem esforço e natureza
        // Max = (Base * 2 + 99) para nível 100 com esforço máximo e natureza benéfica
        const minValue = Math.floor((baseValue * 2) * 1);
        const maxValue = Math.floor((baseValue * 2 + 99) * 1.1);
        
        // Criar elemento de stat
        const statElement = document.createElement('div');
        statElement.classList.add('stat-row');
        statElement.innerHTML = `
            <div class="stat-name">${statName}</div>
            <div class="stat-values">
                <div class="stat-base">Base: ${baseValue}</div>
                <div class="stat-min">Mín: ${minValue}</div>
                <div class="stat-max">Máx: ${maxValue}</div>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${(baseValue / 255) * 100}%"></div>
            </div>
        `;
        
        statsContainer.appendChild(statElement);
    });
}

function updateAbilitiesInfo() {
    const pokemon = currentPokemonData;
    const abilitiesContainer = document.getElementById('abilities-container');
    abilitiesContainer.innerHTML = '<div class="loading-moves">Carregando habilidades...</div>';
    
    // Dicionário de tradução para nomes de habilidades
    const abilityNamesPtBr = {
        'stench': 'Fedor',
        'drizzle': 'Chuvisco',
        'speed-boost': 'Aumento de Velocidade',
        'battle-armor': 'Armadura de Batalha',
        'sturdy': 'Resistência',
        'damp': 'Umidade',
        'limber': 'Flexível',
        'sand-veil': 'Véu de Areia',
        'static': 'Estática',
        'volt-absorb': 'Absorção de Volt',
        'water-absorb': 'Absorção de Água',
        'oblivious': 'Distraído',
        'cloud-nine': 'Céu Limpo',
        'compound-eyes': 'Olhos Compostos',
        'insomnia': 'Insônia',
        'color-change': 'Mudança de Cor',
        'immunity': 'Imunidade',
        'flash-fire': 'Fogo Rápido',
        'shield-dust': 'Pó Escudo',
        'own-tempo': 'Ritmo Próprio',
        'suction-cups': 'Ventosas',
        'intimidate': 'Intimidação',
        'shadow-tag': 'Marca Sombria',
        'rough-skin': 'Pele Áspera',
        'wonder-guard': 'Proteção Maravilhosa',
        'levitate': 'Levitação',
        'effect-spore': 'Esporos de Efeito',
        'synchronize': 'Sincronizar',
        'clear-body': 'Corpo Limpo',
        'natural-cure': 'Cura Natural',
        'lightning-rod': 'Para-raios',
        'serene-grace': 'Graça Serena',
        'swift-swim': 'Nado Rápido',
        'chlorophyll': 'Clorofila',
        'illuminate': 'Iluminar',
        'trace': 'Rastrear',
        'huge-power': 'Poder Imenso',
        'poison-point': 'Ponto de Veneno',
        'inner-focus': 'Foco Interior',
        'magma-armor': 'Armadura de Magma',
        'water-veil': 'Véu de Água',
        'magnet-pull': 'Atração Magnética',
        'soundproof': 'À Prova de Som',
        'rain-dish': 'Prato de Chuva',
        'sand-stream': 'Fluxo de Areia',
        'pressure': 'Pressão',
        'thick-fat': 'Gordura Espessa',
        'early-bird': 'Pássaro Madrugador',
        'flame-body': 'Corpo de Chama',
        'run-away': 'Fuga',
        'keen-eye': 'Olho Aguçado',
        'hyper-cutter': 'Hiper Cortador',
        'pickup': 'Coletar',
        'truant': 'Vadio',
        'hustle': 'Pressa',
        'cute-charm': 'Charme Fofo',
        'plus': 'Mais',
        'minus': 'Menos',
        'forecast': 'Previsão',
        'sticky-hold': 'Pegajoso',
        'shed-skin': 'Trocar de Pele',
        'guts': 'Coragem',
        'marvel-scale': 'Escama Maravilha',
        'liquid-ooze': 'Lodo Líquido',
        'overgrow': 'Super Crescer',
        'blaze': 'Chama',
        'torrent': 'Torrente',
        'swarm': 'Enxame',
        'rock-head': 'Cabeça de Pedra',
        'drought': 'Seca',
        'arena-trap': 'Armadilha de Arena',
        'vital-spirit': 'Espírito Vital',
        'white-smoke': 'Fumaça Branca',
        'pure-power': 'Poder Puro',
        'shell-armor': 'Armadura de Concha',
        'air-lock': 'Bloqueio de Ar',
        'tangled-feet': 'Pés Enrolados',
        'motor-drive': 'Propulsão',
        'rivalry': 'Rivalidade',
        'steadfast': 'Firme',
        'snow-cloak': 'Manto de Neve',
        'gluttony': 'Gula',
        'anger-point': 'Ponto de Raiva',
        'unburden': 'Desencargo',
        'heatproof': 'À Prova de Calor',
        'simple': 'Simples',
        'dry-skin': 'Pele Seca',
        'download': 'Download',
        'iron-fist': 'Punho de Ferro',
        'poison-heal': 'Cura Venenosa',
        'adaptability': 'Adaptabilidade',
        'skill-link': 'Elo de Habilidade',
        'hydration': 'Hidratação',
        'solar-power': 'Poder Solar',
        'quick-feet': 'Pés Rápidos',
        'normalize': 'Normalizar',
        'sniper': 'Atirador de Elite',
        'magic-guard': 'Guarda Mágica',
        'no-guard': 'Sem Guarda',
        'stall': 'Protelar',
        'technician': 'Técnico',
        'leaf-guard': 'Guarda de Folha',
        'klutz': 'Desajeitado',
        'mold-breaker': 'Quebrador de Molde',
        'super-luck': 'Super Sorte',
        'aftermath': 'Consequência',
        'anticipation': 'Antecipação',
        'forewarn': 'Prever',
        'unaware': 'Inconsciente',
        'tinted-lens': 'Lentes Coloridas',
        'filter': 'Filtro',
        'slow-start': 'Início Lento',
        'scrappy': 'Valente',
        'storm-drain': 'Dreno de Tempestade',
        'ice-body': 'Corpo de Gelo',
        'solid-rock': 'Rocha Sólida',
        'snow-warning': 'Aviso de Neve',
        'honey-gather': 'Coletor de Mel',
        'frisk': 'Curioso',
        'reckless': 'Imprudente',
        'multitype': 'Multitipo',
        'flower-gift': 'Presente de Flor',
        'bad-dreams': 'Pesadelos',
        'pickpocket': 'Batedora de Carteira',
        'sheer-force': 'Força Pura',
        'contrary': 'Contrário',
        'unnerve': 'Nervosismo',
        'defiant': 'Desafiador',
        'defeatist': 'Derrotista',
        'cursed-body': 'Corpo Amaldiçoado',
        'healer': 'Curandeiro',
        'friend-guard': 'Guarda de Amigo',
        'weak-armor': 'Armadura Fraca',
        'heavy-metal': 'Metal Pesado',
        'light-metal': 'Metal Leve',
        'multiscale': 'Multiescalas',
        'toxic-boost': 'Impulso Tóxico',
        'flare-boost': 'Impulso de Chama',
        'harvest': 'Colheita',
        'telepathy': 'Telepatia',
        'moody': 'Temperamental',
        'overcoat': 'Sobretudo',
        'poison-touch': 'Toque Venenoso',
        'regenerator': 'Regenerador',
        'big-pecks': 'Grande Peito',
        'sand-rush': 'Pressa de Areia',
        'wonder-skin': 'Pele Maravilhosa',
        'analytic': 'Analítico',
        'illusion': 'Ilusão',
        'imposter': 'Impostor',
        'infiltrator': 'Infiltrador',
        'mummy': 'Múmia',
        'moxie': 'Determinação',
        'justified': 'Justificado',
        'rattled': 'Assustado',
        'magic-bounce': 'Salto Mágico',
        'sap-sipper': 'Sugador de Seiva',
        'prankster': 'Travesso',
        'sand-force': 'Força de Areia',
        'iron-barbs': 'Farpas de Ferro',
        'zen-mode': 'Modo Zen',
        'victory-star': 'Estrela da Vitória',
        'turboblaze': 'Turbo Chama',
        'teravolt': 'Teravolt',
        'aroma-veil': 'Véu de Aroma',
        'flower-veil': 'Véu de Flor',
        'cheek-pouch': 'Bolsa na Bochecha',
        'protean': 'Camaleônico',
        'fur-coat': 'Casaco de Pêlo',
        'magician': 'Mágico',
        'bulletproof': 'À Prova de Balas',
        'competitive': 'Competitivo',
        'strong-jaw': 'Mandíbula Forte',
        'refrigerate': 'Refrigerar',
        'sweet-veil': 'Véu Doce',
        'stance-change': 'Mudança de Postura',
        'gale-wings': 'Asas de Vendaval',
        'mega-launcher': 'Mega Lançador',
        'grass-pelt': 'Pelagem de Grama',
        'symbiosis': 'Simbiose',
        'tough-claws': 'Garras Duras',
        'pixilate': 'Encantado',
        'gooey': 'Gosmento',
        'aerilate': 'Aerar',
        'parental-bond': 'Laço Parental',
        'dark-aura': 'Aura Negra',
        'fairy-aura': 'Aura de Fada',
        'aura-break': 'Quebra de Aura',
        'primordial-sea': 'Mar Primordial',
        'desolate-land': 'Terra Desolada',
        'delta-stream': 'Corrente Delta',
        'stamina': 'Resistência',
        'wimp-out': 'Covarde',
        'emergency-exit': 'Saída de Emergência',
        'water-compaction': 'Compactação de Água',
        'merciless': 'Impiedoso',
        'shields-down': 'Escudos Baixos',
        'stakeout': 'Vigia',
        'water-bubble': 'Bolha de Água',
        'steelworker': 'Trabalhador de Aço',
        'berserk': 'Enfurecido',
        'slush-rush': 'Pressa na Neve',
        'long-reach': 'Alcance Longo',
        'liquid-voice': 'Voz Líquida',
        'triage': 'Triagem',
        'galvanize': 'Galvanizar',
        'surge-surfer': 'Surfista de Onda Elétrica',
        'schooling': 'Cardume',
        'disguise': 'Disfarce',
        'battle-bond': 'Laço de Batalha',
        'power-construct': 'Construção de Poder',
        'corrosion': 'Corrosão',
        'comatose': 'Comatoso',
        'queenly-majesty': 'Majestade Real',
        'innards-out': 'De Dentro para Fora',
        'dancer': 'Dançarino',
        'battery': 'Bateria',
        'fluffy': 'Fofo',
        'dazzling': 'Deslumbrante',
        'soul-heart': 'Coração de Alma',
        'tangling-hair': 'Cabelo Emaranhado',
        'receiver': 'Receptor',
        'power-of-alchemy': 'Poder da Alquimia',
        'beast-boost': 'Impulso de Fera',
        'rks-system': 'Sistema RKS',
        'electric-surge': 'Surto Elétrico',
        'psychic-surge': 'Surto Psíquico',
        'misty-surge': 'Surto Nebuloso',
        'grassy-surge': 'Surto Gramado',
        'full-metal-body': 'Corpo Totalmente Metálico',
        'shadow-shield': 'Escudo de Sombra',
        'prism-armor': 'Armadura Prismática',
        'neuroforce': 'Força Neural',
        'intrepid-sword': 'Espada Intrépida',
        'dauntless-shield': 'Escudo Destemido',
        'libero': 'Líbero',
        'ball-fetch': 'Buscar Bola',
        'cotton-down': 'Algodão Abaixo',
        'propeller-tail': 'Cauda de Hélice',
        'mirror-armor': 'Armadura Espelhada',
        'gulp-missile': 'Míssil Engolido',
        'stalwart': 'Firme',
        'steam-engine': 'Motor a Vapor',
        'punk-rock': 'Punk Rock',
        'sand-spit': 'Cuspir Areia',
        'ice-scales': 'Escamas de Gelo',
        'ripen': 'Amadurecer',
        'ice-face': 'Cara de Gelo',
        'power-spot': 'Ponto de Poder',
        'mimicry': 'Mimetismo',
        'screen-cleaner': 'Limpador de Tela',
        'steely-spirit': 'Espírito de Aço',
        'perish-body': 'Corpo Perecível',
        'wandering-spirit': 'Espírito Errante',
        'gorilla-tactics': 'Táticas de Gorila',
        'neutralizing-gas': 'Gás Neutralizante',
        'pastel-veil': 'Véu Pastel',
        'hunger-switch': 'Interruptor de Fome',
        'quick-draw': 'Saque Rápido',
        'unseen-fist': 'Punho Invisível',
        'curious-medicine': 'Medicina Curiosa',
        'transistor': 'Transistor',
        'dragons-maw': 'Mandíbula de Dragão',
        'chilling-neigh': 'Relincho Gelado',
        'grim-neigh': 'Relincho Sinistro',
        'as-one-glastrier': 'Como Um (Glastrier)',
        'as-one-spectrier': 'Como Um (Spectrier)',
    };
    
    // Descrições detalhadas em português para habilidades
    const abilityDescriptionsPtBr = {
        'overgrow': 'Aumenta o poder de movimentos do tipo Planta em 50% quando o HP está abaixo de 1/3 do máximo.',
        'blaze': 'Aumenta o poder de movimentos do tipo Fogo em 50% quando o HP está abaixo de 1/3 do máximo.',
        'torrent': 'Aumenta o poder de movimentos do tipo Água em 50% quando o HP está abaixo de 1/3 do máximo.',
        'swarm': 'Aumenta o poder de movimentos do tipo Inseto em 50% quando o HP está abaixo de 1/3 do máximo.',
        'shield-dust': 'Protege o Pokémon dos efeitos secundários dos ataques recebidos.',
        'shed-skin': 'O Pokémon tem 33% de chance de se curar de condições de status a cada turno.',
        'compound-eyes': 'Aumenta a precisão dos movimentos do Pokémon em 30%.',
        'keen-eye': 'Impede que a precisão do Pokémon seja reduzida por outros Pokémon.',
        'levitate': 'Concede imunidade a movimentos do tipo Terrestre.',
        'intimidate': 'Ao entrar em batalha, o Pokémon intimida os oponentes, reduzindo o status de Ataque deles.',
        'static': 'Quando atingido por um movimento de contato, tem 30% de chance de paralizar o atacante.',
        'lightning-rod': 'Atrai movimentos do tipo Elétrico e aumenta o Ataque Especial em 1 estágio quando atingido por um movimento desse tipo.',
        'sand-veil': 'Aumenta a evasão do Pokémon durante uma tempestade de areia.',
        'sturdy': 'O Pokémon não pode ser derrotado por um único ataque quando está com HP cheio. Sobrevive com 1 HP.',
        'limber': 'Impede que o Pokémon seja paralisado.',
        'cloud-nine': 'Cancela todos os efeitos climáticos enquanto o Pokémon está em batalha.',
        'arena-trap': 'Impede que Pokémon oponentes fujam ou sejam substituídos (a menos que sejam do tipo Voador ou tenham Levitação).',
        'water-absorb': 'Recupera 25% do HP máximo quando atingido por um movimento do tipo Água, em vez de receber dano.',
        'synchronize': 'Quando o Pokémon é afetado por Envenenamento, Paralisia ou Queimadura, o atacante também recebe a mesma condição.',
        'clear-body': 'Impede que os status do Pokémon sejam reduzidos por outros Pokémon.',
        'rock-head': 'Protege o Pokémon de dano de recuo em movimentos como Double-Edge.',
        'pressure': 'Quando um oponente usa um movimento contra este Pokémon, o PP do movimento é reduzido por 2 em vez de 1.',
        'pickup': 'O Pokémon pode encontrar itens após as batalhas ou quando usa um item em batalha.',
        'truant': 'O Pokémon só pode atacar em turnos alternados.',
        'guts': 'Aumenta o Ataque em 50% quando o Pokémon tem uma condição de status (queimadura, envenenamento, etc).',
        'drought': 'Muda o clima para ensolarado quando o Pokémon entra em batalha.',
        'drizzle': 'Muda o clima para chuvoso quando o Pokémon entra em batalha.',
        'sand-stream': 'Muda o clima para tempestade de areia quando o Pokémon entra em batalha.',
        'snow-warning': 'Muda o clima para granizo quando o Pokémon entra em batalha.',
        'flame-body': 'Quando atingido por um movimento de contato, tem 30% de chance de queimar o atacante.',
        'wonder-guard': 'Apenas movimentos super efetivos causam dano a este Pokémon.',
        'huge-power': 'Dobra o Ataque físico do Pokémon.',
        'insomnia': 'Impede que o Pokémon adormeça.',
        'thick-fat': 'Fornece resistência a movimentos dos tipos Fogo e Gelo, reduzindo o dano pela metade.',
        'natural-cure': 'Todas as condições de status são curadas quando o Pokémon é retirado da batalha.',
        'chlorophyll': 'Dobra a Velocidade do Pokémon sob luz solar forte.',
        'swift-swim': 'Dobra a Velocidade do Pokémon sob chuva.',
        'sand-rush': 'Dobra a Velocidade do Pokémon durante uma tempestade de areia.',
        'slush-rush': 'Dobra a Velocidade do Pokémon durante granizo.',
        'wonder-skin': 'Reduz a precisão de movimentos de status usados contra este Pokémon para 50%.',
        'protean': 'Muda o tipo do Pokémon para o mesmo tipo do movimento que ele está usando.',
        'battle-bond': 'Transforma Greninja em Ash-Greninja após derrotar um Pokémon, aumentando a força do movimento Água Shuriken.',
        'beast-boost': 'Aumenta o status mais alto do Pokémon quando ele derrota um oponente.',
        'speed-boost': 'Aumenta a Velocidade em 1 estágio a cada turno.',
        'prankster': 'Dá prioridade a movimentos de status, mas eles não afetam Pokémon do tipo Sombrio.',
        'adaptability': 'Aumenta o bônus STAB (Same Type Attack Bonus) de 1.5x para 2x.',
        'libero': 'Muda o tipo do Pokémon para corresponder ao tipo do movimento que ele está usando antes do ataque.',
        'poison-point': 'Quando atingido por um movimento de contato, tem 30% de chance de envenenar o atacante.',
        'flash-fire': 'Torna-se imune a movimentos do tipo Fogo e aumenta o poder dos seus próprios movimentos de Fogo em 50% quando atingido por um.',
        'rough-skin': 'Causa dano equivalente a 1/8 do HP máximo ao Pokémon que ataca com movimentos de contato.',
        'multiscale': 'Reduz o dano recebido em 50% quando o Pokémon está com HP cheio.',
        'regenerator': 'Recupera 1/3 do HP máximo quando é retirado da batalha.',
        'technician': 'Aumenta o poder de movimentos com poder base de 60 ou menos em 50%.',
        'serene-grace': 'Dobra a chance de efeitos secundários dos movimentos ocorrerem.',
        'filter': 'Reduz o dano de ataques super efetivos em 25%.',
        'magic-bounce': 'Reflete movimentos de status de volta ao oponente.',
        'disguise': 'Protege o Pokémon de um ataque uma única vez, deixando o disfarce "estourado".',
        'zen-mode': 'Muda a forma do Darmanitan quando seu HP cai para 50% ou menos.',
        'moxie': 'Aumenta o Ataque em 1 estágio após derrotar um oponente.',
        'justified': 'Aumenta o Ataque em 1 estágio quando atingido por um movimento do tipo Sombrio.',
    };
    
    // Função para obter nome traduzido ou formatado da habilidade
    function getLocalizedAbilityName(abilityName) {
        return abilityNamesPtBr[abilityName] || formatPokemonName(abilityName);
    }
    
    // Criar uma lista de promessas para buscar todas as habilidades
    const abilityPromises = pokemon.abilities.map(async (abilityInfo) => {
        try {
            const abilityResponse = await fetch(abilityInfo.ability.url);
            const ability = await abilityResponse.json();
            
            // Obter o nome original e traduzido da habilidade
            const originalName = abilityInfo.ability.name;
            const abilityName = getLocalizedAbilityName(originalName);
            
            // Tentar obter descrição em português da API
            let description = null;
            
            // Primeiro verificar entradas de texto em português brasileiro
            description = ability.flavor_text_entries.find(
                entry => entry.language.name === 'pt-br'
            )?.flavor_text;
            
            // Se não encontrar em pt-br, tentar em português de Portugal
            if (!description) {
                description = ability.flavor_text_entries.find(
                    entry => entry.language.name === 'pt'
                )?.flavor_text;
            }
            
            // Se não encontrar em português, tentar em inglês
            if (!description) {
                description = ability.flavor_text_entries.find(
                    entry => entry.language.name === 'en'
                )?.flavor_text;
            }
            
            // Tentar obter descrição mais detalhada do nosso dicionário
            const detailedDescription = abilityDescriptionsPtBr[originalName];
            
            // Obter efeito em jogo, se disponível na API
            const effectEntries = ability.effect_entries.find(
                entry => entry.language.name === 'en'
            );
            
            let gameEffect = '';
            if (effectEntries) {
                // Traduzir automaticamente o efeito do inglês para o português
                gameEffect = effectEntries.effect.replace(/\n/g, ' ');
                gameEffect = gameEffect
                    .replace("When this Pokémon", "Quando este Pokémon")
                    .replace("in battle", "em batalha")
                    .replace("This Pokémon", "Este Pokémon")
                    .replace("the opponent", "o oponente")
                    .replace("damage", "dano")
                    .replace("HP", "HP")
                    .replace("Attack", "Ataque")
                    .replace("Defense", "Defesa")
                    .replace("Special Attack", "Ataque Especial")
                    .replace("Special Defense", "Defesa Especial")
                    .replace("Speed", "Velocidade")
                    .replace("moves", "movimentos")
                    .replace("weather", "clima")
                    .replace("status condition", "condição de status")
                    .replace("Poison", "Veneno")
                    .replace("Paralysis", "Paralisia")
                    .replace("Burn", "Queimadura")
                    .replace("Sleep", "Sono")
                    .replace("Freeze", "Congelamento")
                    .replace("increases", "aumenta")
                    .replace("decreases", "diminui")
                    .replace("by 50%", "em 50%")
                    .replace("by 30%", "em 30%")
                    .replace("by 20%", "em 20%");
            }
            
            // Retornar todos os dados coletados para esta habilidade
            return {
                originalName,
                translatedName: abilityName,
                isHidden: abilityInfo.is_hidden,
                description: description ? description.replace(/\n/g, ' ').replace(/\f/g, ' ') : null,
                detailedDescription,
                gameEffect
            };
        } catch (error) {
            console.error(`Erro ao buscar detalhes da habilidade ${abilityInfo.ability.name}:`, error);
            // Retornar um objeto com informações mínimas em caso de erro
            return {
                originalName: abilityInfo.ability.name,
                translatedName: getLocalizedAbilityName(abilityInfo.ability.name),
                isHidden: abilityInfo.is_hidden,
                description: 'Erro ao carregar descrição.',
                detailedDescription: null,
                gameEffect: ''
            };
        }
    });
    
    // Esperar todas as promessas serem resolvidas antes de renderizar as habilidades
    Promise.all(abilityPromises)
        .then(abilities => {
            // Limpar o container de habilidades
            abilitiesContainer.innerHTML = '';
            
            // Renderizar cada habilidade com as informações corretas
            abilities.forEach(ability => {
                const abilityElement = document.createElement('div');
                abilityElement.classList.add('ability-item');
                
                // Construir o HTML com a descrição da habilidade
                let abilityHTML = `
                    <h4>${ability.translatedName} 
                        ${ability.isHidden ? '(Habilidade Oculta)' : ''}</h4>
                `;
                
                // Adicionar descrição da API, se disponível
                if (ability.description) {
                    abilityHTML += `<p class="ability-description">${ability.description}</p>`;
                }
                
                // Adicionar descrição mais detalhada, se disponível
                if (ability.detailedDescription) {
                    abilityHTML += `<p class="ability-detailed-description">${ability.detailedDescription}</p>`;
                } else if (!ability.description) {
                    abilityHTML += `<p class="ability-description">Descrição não disponível.</p>`;
                }
                
                // Adicionar efeito em jogo, se disponível
                if (ability.gameEffect) {
                    abilityHTML += `<p class="ability-game-effect"><strong>Efeito em jogo:</strong> ${ability.gameEffect}</p>`;
                }
                
                abilityElement.innerHTML = abilityHTML;
                abilitiesContainer.appendChild(abilityElement);
            });
        })
        .catch(error => {
            console.error('Erro ao processar habilidades:', error);
            abilitiesContainer.innerHTML = '<p class="error-message">Ocorreu um erro ao carregar as habilidades. Por favor, tente novamente.</p>';
        });
}

function updateEvolutionChain() {
    const evoChain = currentPokemonData.evolutionChain.chain;
    const evolutionContainer = document.getElementById('evolution-chain-container');
    evolutionContainer.innerHTML = '';
    
    // Função para processar a cadeia evolutiva
    function processEvolutionChain(chain, parentElement) {
        if (!chain) return;
        
        // Criar elemento para a evolução atual
        const evoData = chain.species;
        const pokemonId = evoData.url.split('/').filter(Boolean).pop();
        
        const evolutionItem = document.createElement('div');
        evolutionItem.classList.add('evolution-item');
        evolutionItem.style.cursor = 'pointer'; // Adicionar cursor pointer para indicar que é clicável
        
        // Adicionar evento de clique para navegar para o Pokémon
        evolutionItem.addEventListener('click', () => {
            fetchPokemonData(pokemonId);
            // Rolar para o topo da página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Adicionar imagem do Pokémon
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` || 'img/placeholder-pixel.png';
        img.alt = evoData.name;
        evolutionItem.appendChild(img);
        
        // Adicionar nome
        const nameEl = document.createElement('div');
        nameEl.classList.add('evolution-name');
        nameEl.textContent = formatPokemonName(evoData.name);
        evolutionItem.appendChild(nameEl);
        
        // Adicionar ID
        const idEl = document.createElement('div');
        idEl.classList.add('pokemon-id');
        idEl.textContent = `#${pokemonId.padStart(3, '0')}`;
        evolutionItem.appendChild(idEl);
        
        // Condições de evolução
        if (chain.evolution_details && chain.evolution_details.length > 0) {
            const conditionEl = document.createElement('div');
            conditionEl.classList.add('evolution-condition');
            
            // Simplificar condições para exibição
            const conditions = [];
            
            const detail = chain.evolution_details[0];
            
            if (detail.min_level) {
                conditions.push(`Nível ${detail.min_level}`);
            }
            
            if (detail.item) {
                conditions.push(`${formatPokemonName(detail.item.name)}`);
            }
            
            if (detail.trigger && detail.trigger.name === 'trade') {
                conditions.push('Troca');
            }
            
            if (detail.held_item) {
                conditions.push(`Segurando ${formatPokemonName(detail.held_item.name)}`);
            }
            
            conditionEl.textContent = conditions.join(', ') || 'Condição especial';
            evolutionItem.appendChild(conditionEl);
        }
        
        parentElement.appendChild(evolutionItem);
        
        // Processar evoluções seguintes recursivamente
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(nextEvolution => {
                processEvolutionChain(nextEvolution, parentElement);
            });
        }
    }
    
    // Iniciar o processamento com o primeiro Pokémon da cadeia
    processEvolutionChain(evoChain, evolutionContainer);
}

function updateMovesInfo() {
    const pokemon = currentPokemonData;
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = '<div class="loading-moves">Carregando movimentos...</div>';
    
    // Categorizar movimentos por método de aprendizagem
    const movesByMethod = {
        level: [],
        egg: [],
        tutor: [],
        machine: []
    };
    
    // Criar um array de promessas para buscar todos os movimentos
    const movePromises = pokemon.moves.map(async moveInfo => {
        try {
            // Obter detalhes do movimento
            const moveResponse = await fetch(moveInfo.move.url);
            const move = await moveResponse.json();
            
            // Encontrar descrição em português
            const description = move.flavor_text_entries.find(
                entry => entry.language.name === currentLanguage
            )?.flavor_text || 'Descrição não disponível.';
            
            // Filtrar para obter apenas as versões mais recentes (preferir versões mais recentes)
            // Ordenar as versões por mais recentes, priorizando Sword/Shield, Sun/Moon, X/Y, etc.
            const recentVersions = moveInfo.version_group_details.sort((a, b) => {
                // Lista de prioridade das versões (da mais nova para mais antiga)
                const versionPriority = [
                    'scarlet-violet', 'legends-arceus', 'brilliant-diamond-shining-pearl',
                    'sword-shield', 'lets-go-pikachu-lets-go-eevee', 'ultra-sun-ultra-moon',
                    'sun-moon', 'omega-ruby-alpha-sapphire', 'x-y', 'black-2-white-2',
                    'black-white', 'heartgold-soulsilver', 'platinum', 'diamond-pearl',
                    'firered-leafgreen', 'emerald', 'ruby-sapphire', 'crystal', 'gold-silver', 'yellow', 'red-blue'
                ];
                
                const indexA = versionPriority.indexOf(a.version_group.name);
                const indexB = versionPriority.indexOf(b.version_group.name);
                
                // Se não encontrar na lista, considerar como última prioridade
                const priorityA = indexA !== -1 ? indexA : 999;
                const priorityB = indexB !== -1 ? indexB : 999;
                
                return priorityA - priorityB;
            });
            
            // Usar apenas a versão mais recente disponível
            if (recentVersions.length > 0) {
                const latestVersion = recentVersions[0];
                const method = latestVersion.move_learn_method.name;
                let methodCategory = '';
                
                switch (method) {
                    case 'level-up':
                        methodCategory = 'level';
                        break;
                    case 'egg':
                        methodCategory = 'egg';
                        break;
                    case 'tutor':
                        methodCategory = 'tutor';
                        break;
                    case 'machine':
                        methodCategory = 'machine';
                        break;
                    default:
                        return true; // Ignorar outros métodos
                }
                
                // Adicionar movimento à categoria apropriada
                movesByMethod[methodCategory].push({
                    name: move.name,
                    level: latestVersion.level_learned_at,
                    power: move.power,
                    accuracy: move.accuracy,
                    pp: move.pp,
                    type: move.type.name,
                    damageClass: move.damage_class.name,
                    description: description
                });
            }
            
            return true; // Retornar true para indicar que o movimento foi processado
        } catch (error) {
            console.error(`Erro ao buscar detalhes do movimento ${moveInfo.move.name}:`, error);
            return false;
        }
    });
    
    // Esperar todas as promessas serem resolvidas antes de renderizar a UI
    Promise.all(movePromises)
        .then(() => {
            // Limpar o container
            movesContainer.innerHTML = '';
            
            // Criar abas para os diferentes métodos
            const tabsContainer = document.createElement('div');
            tabsContainer.classList.add('moves-tabs');
            
            const methodNames = {
                level: 'Por Nível',
                egg: 'Por Ovo',
                tutor: 'Por Professor',
                machine: 'Por TM/TR'
            };
            
            // Criar botões de aba
            Object.keys(methodNames).forEach((method, index) => {
                const tabButton = document.createElement('button');
                tabButton.classList.add('tab-button');
                if (index === 0) tabButton.classList.add('active');
                tabButton.textContent = methodNames[method];
                tabButton.addEventListener('click', () => {
                    // Esconder todas as tabelas de movimento
                    document.querySelectorAll('.moves-table').forEach(table => {
                        table.style.display = 'none';
                    });
                    
                    // Mostrar a tabela selecionada
                    const tableToShow = document.getElementById(`moves-${method}`);
                    if (tableToShow) tableToShow.style.display = 'table';
                    
                    // Atualizar estilo do botão ativo
                    document.querySelectorAll('.moves-tabs .tab-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    tabButton.classList.add('active');
                });
                
                tabsContainer.appendChild(tabButton);
            });
            
            movesContainer.appendChild(tabsContainer);
            
            // Criar tabelas para cada método
            Object.keys(movesByMethod).forEach((method, methodIndex) => {
                // Ordenar movimentos (por nível para level-up, alfabeticamente para outros)
                if (method === 'level') {
                    movesByMethod[method].sort((a, b) => a.level - b.level);
                } else {
                    movesByMethod[method].sort((a, b) => a.name.localeCompare(b.name));
                }
                
                // Criar tabela
                const table = document.createElement('table');
                table.id = `moves-${method}`;
                table.classList.add('moves-table');
                table.style.display = methodIndex === 0 ? 'table' : 'none'; // Mostrar a tabela de nível por padrão
                
                // Cabeçalho da tabela
                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                        <th>${method === 'level' ? 'Nível' : 'Método'}</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>Poder</th>
                        <th>Precisão</th>
                        <th>PP</th>
                    </tr>
                `;
                table.appendChild(thead);
                
                // Corpo da tabela
                const tbody = document.createElement('tbody');
                
                if (movesByMethod[method].length === 0) {
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `<td colspan="7" class="no-moves-message">Nenhum movimento encontrado nesta categoria.</td>`;
                    tbody.appendChild(emptyRow);
                } else {
                    movesByMethod[method].forEach(move => {
                        const row = document.createElement('tr');
                        
                        // Primeira coluna (nível ou método)
                        let methodCell = '';
                        if (method === 'level') {
                            methodCell = `<td>${move.level}</td>`;
                        } else if (method === 'egg') {
                            methodCell = '<td>Ovo</td>';
                        } else if (method === 'tutor') {
                            methodCell = '<td>Professor</td>';
                        } else if (method === 'machine') {
                            methodCell = '<td>TM/TR</td>';
                        }
                        
                        // Outras colunas
                        row.innerHTML = `
                            ${methodCell}
                            <td>${formatPokemonName(move.name)}</td>
                            <td><span class="type-badge type-${move.type}">${formatPokemonName(move.type)}</span></td>
                            <td>${getDamageClassIcon(move.damageClass)}</td>
                            <td>${move.power || '-'}</td>
                            <td>${move.accuracy ? `${move.accuracy}%` : '-'}</td>
                            <td>${move.pp}</td>
                        `;
                        
                        // Adicionar tooltip com descrição
                        row.title = move.description;
                        
                        tbody.appendChild(row);
                    });
                }
                
                table.appendChild(tbody);
                movesContainer.appendChild(table);
            });
        })
        .catch(error => {
            console.error('Erro ao processar movimentos:', error);
            movesContainer.innerHTML = '<p class="error-message">Erro ao carregar movimentos. Por favor, tente novamente.</p>';
        });
}

function updateLocationInfo() {
    const pokemon = currentPokemonData;
    const locationsContainer = document.getElementById('locations-container');
    locationsContainer.innerHTML = '';
    
    if (!pokemon.locations || pokemon.locations.length === 0) {
        locationsContainer.innerHTML = '<p>Nenhuma localização encontrada.</p>';
        return;
    }
    
    // Agrupar por versão/geração
    const locationsByVersion = {};
    
    pokemon.locations.forEach(location => {
        location.version_details.forEach(versionDetail => {
            const versionName = versionDetail.version.name;
            
            if (!locationsByVersion[versionName]) {
                locationsByVersion[versionName] = [];
            }
            
            locationsByVersion[versionName].push({
                name: location.location_area.name,
                rate: versionDetail.encounter_details.map(detail => detail.chance).reduce((acc, val) => acc + val, 0)
            });
        });
    });
    
    // Criar accordion para cada versão
    Object.keys(locationsByVersion).forEach(version => {
        const versionElement = document.createElement('div');
        versionElement.classList.add('version-accordion');
        
        const header = document.createElement('div');
        header.classList.add('accordion-header');
        header.innerHTML = `<h4>${formatPokemonName(version)}</h4>`;
        header.addEventListener('click', () => {
            content.classList.toggle('active');
        });
        
        const content = document.createElement('div');
        content.classList.add('accordion-content');
        
        // Lista de localizações
        const locationsList = document.createElement('ul');
        locationsByVersion[version].forEach(loc => {
            const locationItem = document.createElement('li');
            locationItem.innerHTML = `
                ${formatPokemonName(loc.name)} <span class="encounter-rate">(${loc.rate}%)</span>
            `;
            locationsList.appendChild(locationItem);
        });
        
        content.appendChild(locationsList);
        versionElement.appendChild(header);
        versionElement.appendChild(content);
        locationsContainer.appendChild(versionElement);
    });
}

function updateAlternativeForms() {
    const pokemon = currentPokemonData;
    const container = document.getElementById('alternative-forms-container');
    container.innerHTML = '<div class="loading-moves">Carregando formas alternativas...</div>';
    
    // Se não temos dados de espécie ou não há formas alternativas
    if (!pokemon.species_data && !pokemon.species) {
        container.innerHTML = '<p class="error-message">Não foi possível carregar informações sobre formas alternativas.</p>';
        return;
    }
    
    const species_data = pokemon.species_data || pokemon.species;
    
    // Verificar se há formas alternativas
    if (!species_data.varieties || species_data.varieties.length <= 1) {
        container.innerHTML = '<p>Este Pokémon não possui formas alternativas conhecidas.</p>';
        return;
    }
    
    // Incluir a forma atual como a primeira opção
    const currentForm = {
        is_default: true,
        pokemon: {
            name: pokemon.name,
            url: `${API_URL}/pokemon/${pokemon.id}`
        },
        data: pokemon,
        isLoaded: true
    };
    
    // Incluir a forma brilhante (shiny) como "forma alternativa"
    const shinyForm = {
        is_default: false,
        is_shiny: true,
        pokemon: {
            name: `${pokemon.name}-shiny`,
            url: null
        }
    };
    
    // Obter todas as variedades incluindo a padrão
    const allVarieties = [currentForm, ...species_data.varieties.filter(v => !v.is_default)];
    
    // Adicionar informações sobre a forma brilhante se tiver sprites
    if (pokemon.sprites && pokemon.sprites.front_shiny) {
        allVarieties.push(shinyForm);
    }
    
    // Criar um array de promessas para buscar todas as formas alternativas
    const formPromises = allVarieties.map(async (form, index) => {
        // Se for a forma atual ou shiny, não precisamos buscar dados
        if (form.isLoaded || form.is_shiny) {
            return form;
        }
        
        try {
            // Verificar se temos os dados em cache
            const formUrl = form.pokemon.url;
            const formId = formUrl.split('/').filter(Boolean).pop();
            const cachedFormData = await getPokemonFromCache(formId);
            
            let formData;
            if (cachedFormData) {
                form.data = cachedFormData;
            } else {
                // Buscar dados da forma alternativa
                const response = await fetch(formUrl);
                if (!response.ok) throw new Error(`Erro ao buscar forma alternativa: ${response.status}`);
                formData = await response.json();
                
                // Buscar dados da espécie (para descrição)
                try {
                    const speciesResponse = await fetch(formData.species.url);
                    if (speciesResponse.ok) {
                        const speciesData = await speciesResponse.json();
                        formData.species_data = speciesData;
                    }
                } catch (speciesError) {
                    console.error('Erro ao buscar espécie da forma:', speciesError);
                }
                
                // Salvar no cache
                savePokemonToCache(formData);
                form.data = formData;
            }
            
            return form;
        } catch (error) {
            console.error(`Erro ao buscar forma alternativa:`, error);
            return null;
        }
    });
    
    // Aguardar todas as promessas serem resolvidas
    Promise.all(formPromises)
        .then(formResults => {
            // Limpar o container
            container.innerHTML = '';
            
            // Filtrar resultados nulos
            const forms = formResults.filter(form => form !== null);
            
            if (forms.length === 0) {
                container.innerHTML = '<p>Este Pokémon não possui formas alternativas conhecidas.</p>';
                return;
            }
            
            // Adicionar cabeçalho explicativo
            const headerElement = document.createElement('div');
            headerElement.classList.add('forms-header');
            headerElement.innerHTML = `
                <p>Clique em qualquer forma para visualizar todas as informações detalhadas daquela forma.</p>
            `;
            container.appendChild(headerElement);
            
            // Processar e exibir cada forma
            forms.forEach(form => {
                if (!form.data && !form.is_shiny) return; // Pular se não tiver dados
                
                // Dados da forma atual ou da forma alternativa
                const formData = form.is_shiny ? pokemon : form.data;
                const isCurrentForm = form.is_default;
                
                // Criar elemento para a forma
                const formElement = document.createElement('div');
                formElement.classList.add('form-item');
                if (isCurrentForm) {
                    formElement.classList.add('current-form');
                }
                
                // Nome da forma
                let formName = formatPokemonName(formData.name);
                let formLabel = 'Forma Padrão';
                
                // Identificar o tipo de forma especial
                if (form.is_shiny) {
                    formName = `${formatPokemonName(pokemon.name)} Shiny`;
                    formLabel = 'Forma Brilhante';
                } else if (formData.name.includes('-mega-x')) {
                    formName = `Mega ${formatPokemonName(formData.name.split('-')[0])} X`;
                    formLabel = 'Mega Evolução X';
                } else if (formData.name.includes('-mega-y')) {
                    formName = `Mega ${formatPokemonName(formData.name.split('-')[0])} Y`;
                    formLabel = 'Mega Evolução Y';
                } else if (formData.name.includes('-mega')) {
                    formName = `Mega ${formatPokemonName(formData.name.split('-')[0])}`;
                    formLabel = 'Mega Evolução';
                } else if (formData.name.includes('-gmax')) {
                    formName = `Gigantamax ${formatPokemonName(formData.name.split('-')[0])}`;
                    formLabel = 'Forma Gigantamax';
                } else if (formData.name.includes('-alola')) {
                    formName = `${formatPokemonName(formData.name.split('-')[0])} de Alola`;
                    formLabel = 'Forma Regional';
                } else if (formData.name.includes('-galar')) {
                    formName = `${formatPokemonName(formData.name.split('-')[0])} de Galar`;
                    formLabel = 'Forma Regional';
                } else if (formData.name.includes('-hisui')) {
                    formName = `${formatPokemonName(formData.name.split('-')[0])} de Hisui`;
                    formLabel = 'Forma Regional';
                } else if (formData.name.includes('-paldea')) {
                    formName = `${formatPokemonName(formData.name.split('-')[0])} de Paldea`;
                    formLabel = 'Forma Regional';
                } else if (!isCurrentForm) {
                    formLabel = 'Forma Alternativa';
                }
                
                // Imagem da forma (fallback para placeholder se não existir)
                let formImageSrc = 'img/placeholder.png';
                if (form.is_shiny && formData.sprites && formData.sprites.front_shiny) {
                    formImageSrc = formData.sprites.front_shiny;
                } else if (formData.sprites && formData.sprites.front_default) {
                    formImageSrc = formData.sprites.front_default;
                } else if (formData.sprites && formData.sprites.other && 
                         formData.sprites.other['official-artwork'] && 
                         formData.sprites.other['official-artwork'].front_default) {
                    formImageSrc = formData.sprites.other['official-artwork'].front_default;
                }
                
                // Tipos da forma
                const formTypes = formData.types && formData.types.map(t => 
                    `<span class="type-badge type-${t.type.name}">${formatPokemonName(t.type.name)}</span>`
                ).join('');
                
                // Estatísticas completas
                let formStats = '';
                if (formData.stats) {
                    formStats = formData.stats.map(stat => {
                        const statName = {
                            'hp': 'HP',
                            'attack': 'Ataque',
                            'defense': 'Defesa',
                            'special-attack': 'Atq. Especial',
                            'special-defense': 'Def. Especial',
                            'speed': 'Velocidade'
                        }[stat.stat.name] || stat.stat.name;
                        
                        return `<div class="form-stat">${statName}: ${stat.base_stat}</div>`;
                    }).join('');
                }
                
                // Habilidades da forma
                let formAbilities = '';
                if (formData.abilities) {
                    formAbilities = formData.abilities.map(ability => 
                        `<div class="form-ability">${formatPokemonName(ability.ability.name)}${ability.is_hidden ? ' (Oculta)' : ''}</div>`
                    ).join('');
                }
                
                // Montar o HTML da forma
                formElement.innerHTML = `
                    <div class="form-badge">${formLabel}</div>
                    <h4>${formName}</h4>
                    <img src="${formImageSrc}" alt="${formName}" onerror="this.src='img/placeholder.png'">
                    <div class="form-types">${formTypes}</div>
                    <div class="form-details">
                        <h5>Estatísticas</h5>
                        <div class="form-stats">${formStats}</div>
                        <h5>Habilidades</h5>
                        <div class="form-abilities">${formAbilities}</div>
                    </div>
                `;
                
                // Adicionar botão para visualizar detalhes completos (exceto na forma atual)
                if (!isCurrentForm) {
                    const viewButton = document.createElement('button');
                    viewButton.classList.add('view-form-button');
                    viewButton.innerHTML = 'Visualizar Forma';
                    
                    // Adicionar evento de clique para carregar a forma
                    viewButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        
                        // Se for a forma brilhante, precisamos tratar diferente
                        if (form.is_shiny) {
                            // Não temos como carregar a forma shiny completamente, mostrar um toast
                            showToast('A forma brilhante tem apenas aparência diferente, todas as outras características são iguais à forma padrão.');
                            return;
                        }
                        
                        // Mostrar indicador de carregamento
                        showLoadingIndicator();
                        
                        // ID da forma para carregar
                        const formId = form.pokemon.url.split('/').filter(Boolean).pop();
                        
                        // Carregar a forma como Pokémon principal
                        fetchPokemonData(formId)
                            .then(() => {
                                // Rolar para o topo
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                
                                // Mudar para a aba de informações básicas
                                document.querySelector('.tab-button[data-tab="moves"]').click();
                                
                                // Mostrar toast informativo
                                showToast(`${formName} carregado com sucesso!`);
                            })
                            .catch(error => {
                                console.error('Erro ao carregar forma:', error);
                                showErrorMessage(`Erro ao carregar forma: ${error.message}`);
                            })
                            .finally(() => {
                                hideLoadingIndicator();
                            });
                    });
                    
                    formElement.appendChild(viewButton);
                } else {
                    const currentBadge = document.createElement('div');
                    currentBadge.classList.add('current-form-badge');
                    currentBadge.textContent = 'Forma Atual';
                    formElement.appendChild(currentBadge);
                }
                
                container.appendChild(formElement);
            });
        })
        .catch(error => {
            console.error('Erro ao processar formas alternativas:', error);
            container.innerHTML = '<p class="error-message">Não foi possível carregar informações sobre formas alternativas.</p>';
        });
}

function updateDamageRelations() {
    const pokemon = currentPokemonData;
    const damageContainer = document.getElementById('damage-relations-container');
    damageContainer.innerHTML = '';
    
    // Mostrar indicador de carregamento
    damageContainer.innerHTML = '<div class="loading-moves">Calculando relações de dano...</div>';
    
    // Buscar relações de dano para cada tipo do Pokémon
    const typePromises = pokemon.types.map(async typeInfo => {
        const response = await fetch(typeInfo.type.url);
        return response.json();
    });
    
    Promise.all(typePromises).then(typeDetails => {
        // Combinar relações de dano de todos os tipos
        const damageRelations = {
            double_damage_from: new Set(),
            half_damage_from: new Set(),
            no_damage_from: new Set(),
            normal_damage_from: new Set() // Adicionado para dano normal (1x)
        };
        
        // Lista de todos os tipos de Pokémon
        const allTypes = [
            'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 
            'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 
            'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
        ];
        
        // Inicialmente, considerar todos os tipos como causando dano normal
        allTypes.forEach(type => damageRelations.normal_damage_from.add(type));
        
        typeDetails.forEach(typeDetail => {
            typeDetail.damage_relations.double_damage_from.forEach(type => {
                // Verificar se este tipo já está na lista de tipos com metade do dano ou nenhum dano
                if (!damageRelations.half_damage_from.has(type.name) && 
                    !damageRelations.no_damage_from.has(type.name)) {
                    damageRelations.double_damage_from.add(type.name);
                    // Remover do dano normal se estiver lá
                    damageRelations.normal_damage_from.delete(type.name);
                }
            });
            
            typeDetail.damage_relations.half_damage_from.forEach(type => {
                // Se este tipo estiver na lista de dano duplo, removê-lo de lá
                damageRelations.double_damage_from.delete(type.name);
                
                // Se não estiver na lista de nenhum dano, adicioná-lo à lista de meio dano
                if (!damageRelations.no_damage_from.has(type.name)) {
                    damageRelations.half_damage_from.add(type.name);
                    // Remover do dano normal se estiver lá
                    damageRelations.normal_damage_from.delete(type.name);
                }
            });
            
            typeDetail.damage_relations.no_damage_from.forEach(type => {
                // Remover este tipo de outras listas
                damageRelations.double_damage_from.delete(type.name);
                damageRelations.half_damage_from.delete(type.name);
                damageRelations.normal_damage_from.delete(type.name);
                
                // Adicionar à lista de nenhum dano
                damageRelations.no_damage_from.add(type.name);
            });
        });
        
        // Limpar o container
        damageContainer.innerHTML = '';
        
        // Título da seção
        const titleElement = document.createElement('h3');
        titleElement.textContent = 'Dano recebido';
        titleElement.classList.add('damage-title');
        damageContainer.appendChild(titleElement);
        
        // Container para todas as relações de dano
        const damageRelationsElement = document.createElement('div');
        damageRelationsElement.classList.add('damage-relations-container');
        
        // Fraquezas (dano duplo)
        if (damageRelations.double_damage_from.size > 0) {
            const weaknessSection = document.createElement('div');
            weaknessSection.classList.add('damage-section', 'weakness-section');
            
            const weaknessTitle = document.createElement('div');
            weaknessTitle.classList.add('damage-section-title');
            weaknessTitle.textContent = 'Fraco contra...';
            weaknessSection.appendChild(weaknessTitle);
            
            const typeList = document.createElement('div');
            typeList.classList.add('damage-type-list');
            
            [...damageRelations.double_damage_from].sort().forEach(typeName => {
                const typeElement = document.createElement('div');
                typeElement.classList.add('damage-type-item', `type-${typeName}`);
                
                const typeContent = document.createElement('div');
                typeContent.classList.add('type-content');
                typeContent.innerHTML = `
                    ${formatPokemonName(typeName)}
                    <span class="damage-multiplier">× 2</span>
                `;
                
                typeElement.appendChild(typeContent);
                typeList.appendChild(typeElement);
            });
            
            weaknessSection.appendChild(typeList);
            damageRelationsElement.appendChild(weaknessSection);
        }
        
        // Resistências (meio dano)
        if (damageRelations.half_damage_from.size > 0) {
            const resistanceSection = document.createElement('div');
            resistanceSection.classList.add('damage-section', 'resistance-section');
            
            const resistanceTitle = document.createElement('div');
            resistanceTitle.classList.add('damage-section-title');
            resistanceTitle.textContent = 'Resistente contra...';
            resistanceSection.appendChild(resistanceTitle);
            
            const typeList = document.createElement('div');
            typeList.classList.add('damage-type-list');
            
            [...damageRelations.half_damage_from].sort().forEach(typeName => {
                const typeElement = document.createElement('div');
                typeElement.classList.add('damage-type-item', `type-${typeName}`);
                
                const typeContent = document.createElement('div');
                typeContent.classList.add('type-content');
                typeContent.innerHTML = `
                    ${formatPokemonName(typeName)}
                    <span class="damage-multiplier">× ½</span>
                `;
                
                typeElement.appendChild(typeContent);
                typeList.appendChild(typeElement);
            });
            
            resistanceSection.appendChild(typeList);
            damageRelationsElement.appendChild(resistanceSection);
        }
        
        // Imunidades (nenhum dano)
        if (damageRelations.no_damage_from.size > 0) {
            const immunitySection = document.createElement('div');
            immunitySection.classList.add('damage-section', 'immunity-section');
            
            const immunityTitle = document.createElement('div');
            immunityTitle.classList.add('damage-section-title');
            immunityTitle.textContent = 'Imune contra...';
            immunitySection.appendChild(immunityTitle);
            
            const typeList = document.createElement('div');
            typeList.classList.add('damage-type-list');
            
            [...damageRelations.no_damage_from].sort().forEach(typeName => {
                const typeElement = document.createElement('div');
                typeElement.classList.add('damage-type-item', `type-${typeName}`);
                
                const typeContent = document.createElement('div');
                typeContent.classList.add('type-content');
                typeContent.innerHTML = `
                    ${formatPokemonName(typeName)}
                    <span class="damage-multiplier">× 0</span>
                `;
                
                typeElement.appendChild(typeContent);
                typeList.appendChild(typeElement);
            });
            
            immunitySection.appendChild(typeList);
            damageRelationsElement.appendChild(immunitySection);
        }
        
        // Dano normal (1x)
        if (damageRelations.normal_damage_from.size > 0) {
            const normalSection = document.createElement('div');
            normalSection.classList.add('damage-section', 'normal-damage-section');
            
            const normalTitle = document.createElement('div');
            normalTitle.classList.add('damage-section-title');
            normalTitle.textContent = 'Dano normal de...';
            normalSection.appendChild(normalTitle);
            
            const typeList = document.createElement('div');
            typeList.classList.add('damage-type-list');
            
            // Organizar tipos em ordem alfabética
            [...damageRelations.normal_damage_from].sort().forEach(typeName => {
                const typeElement = document.createElement('div');
                typeElement.classList.add('damage-type-item', `type-${typeName}`);
                
                const typeContent = document.createElement('div');
                typeContent.classList.add('type-content');
                typeContent.innerHTML = `
                    ${formatPokemonName(typeName)}
                    <span class="damage-multiplier">× 1</span>
                `;
                
                typeElement.appendChild(typeContent);
                typeList.appendChild(typeElement);
            });
            
            normalSection.appendChild(typeList);
            damageRelationsElement.appendChild(normalSection);
        }
        
        damageContainer.appendChild(damageRelationsElement);
    }).catch(error => {
        console.error('Erro ao calcular relações de dano:', error);
        damageContainer.innerHTML = '<p class="error-message">Erro ao calcular relações de dano.</p>';
    });
}

// Funções utilitárias

function getLocalizedDescription() {
    const species = currentPokemonData.species;
    
    // Verificar se species e flavor_text_entries existem
    if (!species || !species.flavor_text_entries || !Array.isArray(species.flavor_text_entries)) {
        return 'Descrição não disponível.';
    }
    
    // Tentar encontrar uma entrada em português
    const ptEntry = species.flavor_text_entries.find(
        entry => entry.language.name === currentLanguage
    );
    
    if (ptEntry) {
        return ptEntry.flavor_text.replace(/\f/g, ' ');
    }
    
    // Caso não encontre, usar inglês como fallback
    const enEntry = species.flavor_text_entries.find(
        entry => entry.language.name === 'en'
    );
    
    return enEntry 
        ? enEntry.flavor_text.replace(/\f/g, ' ')
        : 'Descrição não disponível.';
}

function formatPokemonName(name) {
    if (!name) return '';
    
    // Remover hífens e underscores
    let formattedName = name.replace(/[-_]/g, ' ');
    
    // Capitalizar a primeira letra de cada palavra
    formattedName = formattedName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return formattedName;
}

function getDamageClassIcon(damageClass) {
    let iconHTML = '';
    
    switch (damageClass) {
        case 'physical':
            iconHTML = '<span class="damage-physical" title="Movimento Físico">Físico</span>';
            break;
        case 'special':
            iconHTML = '<span class="damage-special" title="Movimento Especial">Especial</span>';
            break;
        case 'status':
            iconHTML = '<span class="damage-status" title="Movimento de Status">Status</span>';
            break;
        default:
            iconHTML = `<span class="damage-unknown">${damageClass || 'Desconhecido'}</span>`;
    }
    
    return iconHTML;
}

function showLoadingIndicator() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Esconder após alguns segundos
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Função para configurar o modal de comparação
function setupCompareModal() {
    const compareButton = document.getElementById('compare-button');
    const compareModal = document.getElementById('compare-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const closeComparisonButton = document.getElementById('close-comparison');
    const compareSearchButton = document.getElementById('compare-search-button');
    const compareSearchInput = document.getElementById('compare-search-input');
    
    // Abrir modal ao clicar no botão de comparar
    if (compareButton && compareModal) {
        compareButton.addEventListener('click', () => {
            compareModal.classList.add('show');
            updateCompareModalPokemon1();
        });
        
        // Fechar modal pelos botões de fechar
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                compareModal.classList.remove('show');
            });
        }
        
        if (closeComparisonButton) {
            closeComparisonButton.addEventListener('click', () => {
                compareModal.classList.remove('show');
            });
        }
        
        // Buscar Pokémon para comparação
        if (compareSearchButton && compareSearchInput) {
            compareSearchButton.addEventListener('click', () => {
                const searchTerm = compareSearchInput.value.trim().toLowerCase();
                if (searchTerm) {
                    fetchPokemonForComparison(searchTerm);
                }
            });
            
            // Também permitir busca com a tecla Enter
            compareSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = compareSearchInput.value.trim().toLowerCase();
                    if (searchTerm) {
                        fetchPokemonForComparison(searchTerm);
                    }
                }
            });
        }
    }
}

// Atualizar o primeiro Pokémon no modal de comparação (Pokémon atual)
function updateCompareModalPokemon1() {
    if (!currentPokemonData) return;
    
    const compareContainer = document.getElementById('compare-pokemon-1');
    if (!compareContainer) return;
    
    const content = compareContainer.querySelector('.compare-pokemon-content');
    if (!content) return;
    
    // Limpar conteúdo anterior
    content.innerHTML = '';
    
    // Adicionar informações do Pokémon atual
    const pokemonInfo = document.createElement('div');
    pokemonInfo.classList.add('compare-info');
    
    const sprite = (currentPokemonData.sprites && currentPokemonData.sprites.front_default) || 'img/placeholder-pixel.png';
    const name = formatPokemonName(currentPokemonData.name);
    const types = currentPokemonData.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${formatPokemonName(t.type.name)}</span>`
    ).join('');
    
    pokemonInfo.innerHTML = `
        <img src="${sprite}" alt="${name}">
        <div>
            <h4>${name}</h4>
            <div class="pokemon-types">${types}</div>
        </div>
    `;
    
    content.appendChild(pokemonInfo);
    
    // Se já temos dados de comparação, atualizar os resultados
    if (compareData) {
        updateComparisonResults();
    }
}

// Buscar dados do Pokémon para comparação
async function fetchPokemonForComparison(idOrName) {
    try {
        showLoadingIndicator();
        
        // Verificar se os dados estão em cache
        const cachedData = await getPokemonFromCache(idOrName);
        if (cachedData) {
            compareData = cachedData;
            updateCompareModalPokemon2(cachedData);
            updateComparisonResults();
            hideLoadingIndicator();
            return;
        }
        
        // Se não estiver em cache, buscar da API
        const response = await fetch(`${API_URL}/pokemon/${idOrName.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }
        
        const data = await response.json();
        
        // Buscar detalhes da espécie (para descrição da Pokédex)
        const speciesResponse = await fetch(data.species.url);
        
        if (!speciesResponse.ok) {
            throw new Error('Espécie não encontrada');
        }
        
        const speciesData = await speciesResponse.json();
        
        // Incluir dados da espécie no objeto de dados do Pokémon
        data.species_data = speciesData;
        
        // Salvar no cache para uso futuro
        savePokemonToCache(data);
        
        // Atualizar estado global
        compareData = data;
        
        // Atualizar UI
        updateCompareModalPokemon2(data);
        updateComparisonResults();
        
        hideLoadingIndicator();
    } catch (error) {
        hideLoadingIndicator();
        showErrorMessage(`Erro ao buscar Pokémon para comparação: ${error.message}`);
        console.error('Erro ao buscar Pokémon:', error);
    }
}

// Atualizar o segundo Pokémon no modal de comparação
function updateCompareModalPokemon2(pokemonData) {
    if (!pokemonData) return;
    
    const compareContainer = document.getElementById('compare-pokemon-2');
    if (!compareContainer) return;
    
    const content = compareContainer.querySelector('.compare-pokemon-content');
    if (!content) return;
    
    // Limpar conteúdo anterior
    content.innerHTML = '';
    
    // Adicionar informações do Pokémon
    const pokemonInfo = document.createElement('div');
    pokemonInfo.classList.add('compare-info');
    
    const sprite = (pokemonData.sprites && pokemonData.sprites.front_default) || 'img/placeholder-pixel.png';
    const name = formatPokemonName(pokemonData.name);
    const types = pokemonData.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${formatPokemonName(t.type.name)}</span>`
    ).join('');
    
    pokemonInfo.innerHTML = `
        <img src="${sprite}" alt="${name}">
        <div>
            <h4>${name}</h4>
            <div class="pokemon-types">${types}</div>
        </div>
    `;
    
    content.appendChild(pokemonInfo);
}

// Atualizar os resultados da comparação
function updateComparisonResults() {
    // Verificar se temos ambos os Pokémon para comparação
    if (!currentPokemonData || !compareData) return;
    
    // Definir os objetos de Pokémon para comparação
    const pokemon1 = currentPokemonData;
    const pokemon2 = compareData;
    
    const resultsContainer = document.querySelector('.comparison-results');
    resultsContainer.classList.add('show');
    
    // Limpar conteúdo anterior
    resultsContainer.innerHTML = '';
    
    // Criar container para os cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'comparison-cards-container';
    
    // Função para criar card de Pokémon comparativo
    function createComparisonCard(pokemon, index) {
        const cardColor = index === 1 ? 'var(--secondary-color)' : 'var(--primary-color)';
        const cardClass = index === 1 ? 'comparison-card-1' : 'comparison-card-2';
        
        const card = document.createElement('div');
        card.className = `comparison-card ${cardClass}`;
        
        // Cabeçalho do card
        const header = document.createElement('div');
        header.className = 'comparison-card-header';
        header.style.backgroundColor = TYPE_COLORS[pokemon.types[0].type.name] || cardColor;
        
        // Nome e ID
        const nameContainer = document.createElement('div');
        nameContainer.className = 'comparison-name-container';
        
        const pokemonName = document.createElement('h3');
        pokemonName.textContent = formatPokemonName(pokemon.name);
        
        const pokemonId = document.createElement('div');
        pokemonId.className = 'pokemon-id';
        pokemonId.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
        
        nameContainer.appendChild(pokemonName);
        nameContainer.appendChild(pokemonId);
        
        // Tipos do Pokémon
        const typesContainer = document.createElement('div');
        typesContainer.className = 'pokemon-types';
        
        pokemon.types.forEach(typeData => {
            const typeBadge = document.createElement('span');
            typeBadge.className = `type-badge type-${typeData.type.name}`;
            typeBadge.textContent = formatPokemonName(typeData.type.name);
            typesContainer.appendChild(typeBadge);
        });
        
        // Montar cabeçalho
        header.appendChild(nameContainer);
        header.appendChild(typesContainer);
        
        // Imagem do Pokémon
        const imageContainer = document.createElement('div');
        imageContainer.className = 'comparison-image-container';
        
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default || 'img/placeholder-pixel.png';
        img.alt = pokemon.name;
        
        imageContainer.appendChild(img);
        
        // Estatísticas
        const statsContainer = document.createElement('div');
        statsContainer.className = 'comparison-stats-container';
        
        const statsTitle = document.createElement('h4');
        statsTitle.textContent = 'Estatísticas';
        statsTitle.className = 'comparison-section-title';
        statsContainer.appendChild(statsTitle);
        
        // Mapeamento das estatísticas em português
        const statNames = {
            'hp': 'HP',
            'attack': 'Ataque',
            'defense': 'Defesa',
            'special-attack': 'Atq. Especial',
            'special-defense': 'Def. Especial',
            'speed': 'Velocidade'
        };
        
        // Criar lista de estatísticas
        const statsList = document.createElement('div');
        statsList.className = 'comparison-stats-list';
        
        pokemon.stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'comparison-stat-item';
            
            const statName = document.createElement('div');
            statName.className = 'comparison-stat-name';
            statName.textContent = statNames[stat.stat.name] || stat.stat.name;
            
            const statValue = document.createElement('div');
            statValue.className = 'comparison-stat-value';
            statValue.textContent = stat.base_stat;
            
            // Barra de estatística
            const statBarContainer = document.createElement('div');
            statBarContainer.className = 'comparison-stat-bar-container';
            
            const statBar = document.createElement('div');
            statBar.className = 'comparison-stat-bar';
            // Largura da barra baseada no valor da estatística (máximo teórico de 255)
            const barWidth = (stat.base_stat / 255) * 100;
            statBar.style.width = `${barWidth}%`;
            statBar.style.backgroundColor = header.style.backgroundColor;
            
            statBarContainer.appendChild(statBar);
            
            // Montar item de estatística
            statItem.appendChild(statName);
            statItem.appendChild(statValue);
            statItem.appendChild(statBarContainer);
            
            statsList.appendChild(statItem);
        });
        
        statsContainer.appendChild(statsList);
        
        // Habilidades
        const abilitiesContainer = document.createElement('div');
        abilitiesContainer.className = 'comparison-abilities-container';
        
        const abilitiesTitle = document.createElement('h4');
        abilitiesTitle.textContent = 'Habilidades';
        abilitiesTitle.className = 'comparison-section-title';
        abilitiesContainer.appendChild(abilitiesTitle);
        
        const abilitiesList = document.createElement('div');
        abilitiesList.className = 'comparison-abilities-list';
        
        pokemon.abilities.forEach(ability => {
            const abilityItem = document.createElement('div');
            abilityItem.className = 'comparison-ability-item';
            
            abilityItem.textContent = formatPokemonName(ability.ability.name);
            if (ability.is_hidden) {
                abilityItem.textContent += ' (Oculta)';
                abilityItem.classList.add('hidden-ability');
            }
            
            abilitiesList.appendChild(abilityItem);
        });
        
        abilitiesContainer.appendChild(abilitiesList);
        
        // Montar card completo
        card.appendChild(header);
        card.appendChild(imageContainer);
        card.appendChild(statsContainer);
        card.appendChild(abilitiesContainer);
        
        return card;
    }
    
    // Criar cards para cada Pokémon
    cardsContainer.appendChild(createComparisonCard(pokemon1, 1));
    cardsContainer.appendChild(createComparisonCard(pokemon2, 2));
    
    // Adicionar ao container de resultados
    resultsContainer.appendChild(cardsContainer);
    
    // Adicionar legenda
    const legend = document.createElement('div');
    legend.className = 'comparison-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color legend-color-1"></div>
            <span>${formatPokemonName(pokemon1.name)}</span>
        </div>
        <div class="legend-item">
            <div class="legend-color legend-color-2"></div>
            <span>${formatPokemonName(pokemon2.name)}</span>
        </div>
    `;
    
    resultsContainer.appendChild(legend);
}

// Função para compartilhar Pokémon
function setupShareButton() {
    const shareButton = document.getElementById('share-button');
    
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            if (!currentPokemonData) return;
            
            // Criar URL para compartilhar
            const shareUrl = `${window.location.origin}${window.location.pathname}?pokemon=${currentPokemonData.id}`;
            
            // Verificar se a API de compartilhamento está disponível
            if (navigator.share) {
                navigator.share({
                    title: `Pokédex - ${formatPokemonName(currentPokemonData.name)}`,
                    text: `Confira as informações sobre ${formatPokemonName(currentPokemonData.name)} na Pokédex!`,
                    url: shareUrl
                })
                .catch(error => {
                    console.error('Erro ao compartilhar:', error);
                    copyToClipboard(shareUrl);
                });
            } else {
                // Fallback para copiar para a área de transferência
                copyToClipboard(shareUrl);
            }
        });
    }
}

// Função auxiliar para copiar texto para a área de transferência
function copyToClipboard(text) {
    // Criar elemento temporário
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    
    // Definir o valor e selecionar
    tempInput.value = text;
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Para dispositivos móveis
    
    // Copiar e remover o elemento
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Notificar o usuário
    showToast('Link copiado para a área de transferência!');
}

// Função para limpar completamente o cache do Pokédex
function clearPokedexCache() {
    try {
        // Coletar todas as chaves relacionadas ao cache
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('pokemon-cache-') || key.startsWith('pokedex-'))) {
                keysToRemove.push(key);
            }
        }
        
        // Remover todas as chaves coletadas
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log(`Cache da Pokédex limpo: ${keysToRemove.length} itens removidos.`);
        return true;
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        return false;
    }
}

// Expor a função globalmente para que possa ser chamada pelo usuário
window.clearPokedexCache = clearPokedexCache;

// Função para carregar lista completa de Pokémon
async function loadAllPokemonList() {
    try {
        // Verificar se já temos a lista em cache
        const cachedList = localStorage.getItem('pokedex-all-pokemon');
        if (cachedList) {
            allPokemonList = JSON.parse(cachedList);
            console.log('Lista de Pokémon carregada do cache:', allPokemonList.length);
            return;
        }
        
        // Se não tiver em cache, buscar da API
        // Primeiro, obtemos o número total de Pokémon
        const response = await fetch(`${API_URL}/pokemon?limit=1`);
        const data = await response.json();
        const totalCount = data.count;
        
        // Agora buscamos todos de uma vez
        const allResponse = await fetch(`${API_URL}/pokemon?limit=${totalCount}`);
        const allData = await allResponse.json();
        
        // Processar os resultados
        allPokemonList = allData.results.map((pokemon, index) => {
            // Extrair o ID do URL
            const urlParts = pokemon.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 2]);
            
            return {
                id: id,
                name: pokemon.name,
                displayName: formatPokemonName(pokemon.name),
                spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
        });
        
        // Salvar no localStorage para futuros acessos
        localStorage.setItem('pokedex-all-pokemon', JSON.stringify(allPokemonList));
        console.log('Lista de Pokémon carregada da API:', allPokemonList.length);
    } catch (error) {
        console.error('Erro ao carregar lista de Pokémon:', error);
    }
}

// Função para configurar as sugestões de pesquisa
function setupSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions-container');
    
    if (!searchInput || !suggestionsContainer) return;
    
    // Adicionar listener para o input
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
            suggestionsContainer.classList.remove('show');
        }
    });
}

// Função para lidar com a entrada do usuário no campo de pesquisa
function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const suggestionsContainer = document.getElementById('search-suggestions-container');
    
    // Se o termo de pesquisa estiver vazio, não mostramos sugestões
    if (!searchTerm) {
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    // Filtrar a lista de Pokémon
    const filteredPokemon = filterPokemonList(searchTerm);
    
    // Mostrar sugestões
    displaySuggestions(filteredPokemon);
}

// Função para filtrar a lista de Pokémon com base no termo de pesquisa
function filterPokemonList(term) {
    if (!allPokemonList.length) return [];
    
    // Verificar se o termo é um número
    const isNumeric = !isNaN(term) && term !== '';
    
    return allPokemonList
        .filter(pokemon => {
            const nameMatch = pokemon.name.toLowerCase().includes(term);
            const idMatch = isNumeric && pokemon.id.toString().includes(term);
            return nameMatch || idMatch;
        })
        .slice(0, 10); // Limitar a 10 resultados para não sobrecarregar
}

// Função para exibir as sugestões
function displaySuggestions(pokemonList) {
    const suggestionsContainer = document.getElementById('search-suggestions-container');
    
    // Limpar conteúdo atual
    suggestionsContainer.innerHTML = '';
    
    if (pokemonList.length === 0) {
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    // Criar lista de sugestões
    const suggestionList = document.createElement('ul');
    suggestionList.classList.add('suggestion-list');
    
    // Adicionar cada sugestão à lista
    pokemonList.forEach(pokemon => {
        const suggestionItem = document.createElement('li');
        suggestionItem.classList.add('suggestion-item');
        
        suggestionItem.innerHTML = `
            <div class="suggestion-item-content">
                <img src="${pokemon.spriteUrl}" alt="${pokemon.displayName}" onerror="this.src='img/placeholder.png'">
                <span class="suggestion-item-name">${pokemon.displayName}</span>
            </div>
            <span class="suggestion-item-id">#${pokemon.id.toString().padStart(3, '0')}</span>
        `;
        
        // Adicionar evento de clique para selecionar o Pokémon
        suggestionItem.addEventListener('click', () => {
            document.getElementById('search-input').value = pokemon.name;
            fetchPokemonData(pokemon.id);
            suggestionsContainer.classList.remove('show');
        });
        
        suggestionList.appendChild(suggestionItem);
    });
    
    // Adicionar lista ao contêiner
    suggestionsContainer.appendChild(suggestionList);
    
    // Mostrar o contêiner
    suggestionsContainer.classList.add('show');
}

// Função utilitária para debounce (evitar chamadas excessivas)
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}