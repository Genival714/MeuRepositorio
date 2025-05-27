// Controle de música de fundo
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [
            'Music/Battle Zone Routes 225-227 & Stark Mountain (Night)[Pokémon  Diamond & Pearl].mp3',
            'Music/Pokémon Diamond, Pearl & Platinum - Champion Cynthia Battle Music (HQ).mp3',
            'Music/Pokémon Omega Ruby & Alpha Sapphire - Giratina Battle Music (HQ).mp3',
            'Music/Pokémon Diamond, Pearl & Platinum - Team Galactic Commander Battle Music (HQ).mp3',
            'Music/Pokémon Omega Ruby & Alpha Sapphire - Frontier Brain Battle Music (HQ).mp3',
            'Music/Pokémon HeartGold & SoulSilver - Super Ancient Pokémon Battle Music (HQ).mp3',
            'Music/Pokémon Omega Ruby & Alpha Sapphire - Vs Rayquaza (Highest Quality).mp3',
            'Music/Pokémon Omega Ruby & Alpha Sapphire - Vs Zinnia (Highest Quality).mp3',
            'Music/Pokémon Diamond, Pearl & Platinum - Elite Four Battle Music (HQ).mp3',
            'Music/Pokémon Omega Ruby & Alpha Sapphire - Rival Battle Music (HQ).mp3',
            'Music/Pokémon HeartGold & SoulSilver - Champion & Red Battle Music (HQ).mp3',
            'Music/Pokemon FireRed LeafGreen- Trainer Battle!.mp3'
        ];
        this.currentTrackIndex = 0;
        this.audio.src = this.playlist[this.currentTrackIndex];
        this.isPlaying = false;
        this.volume = 0.5;  // Volume padrão (50%)
        this.isMinimized = false; // Controla o estado minimizado
        this.autoplayRequested = false; // Indica se houve pedido para autoplay
        
        // Configuração inicial
        this.audio.volume = this.volume;
        
        // Evento para quando a música terminar
        this.audio.addEventListener('ended', () => this.playNextTrack());
        
        // Evento para atualizar o progresso da música
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Evento para quando os metadados estiverem carregados
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Salvar estado no localStorage
        this.loadSettings();
    }
    
    loadSettings() {
        // Carregar configurações salvas anteriormente
        const savedVolume = localStorage.getItem('pokedex-music-volume');
        const savedState = localStorage.getItem('pokedex-music-playing');
        const savedTrackIndex = localStorage.getItem('pokedex-music-track');
        const savedMinimized = localStorage.getItem('pokedex-music-minimized');
        
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.audio.volume = this.volume;
        }
        
        if (savedTrackIndex !== null) {
            this.currentTrackIndex = parseInt(savedTrackIndex);
            this.audio.src = this.playlist[this.currentTrackIndex];
        }
        
        if (savedMinimized === 'true') {
            this.isMinimized = true;
        }
        
        // Apenas marca que o autoplay foi solicitado, mas não reproduz automaticamente
        if (savedState === 'true') {
            this.autoplayRequested = true;
            // Não chamamos this.play() aqui para evitar o erro de autoplay
        }
    }
    
    saveSettings() {
        localStorage.setItem('pokedex-music-volume', this.volume);
        localStorage.setItem('pokedex-music-playing', this.isPlaying);
        localStorage.setItem('pokedex-music-track', this.currentTrackIndex);
        localStorage.setItem('pokedex-music-minimized', this.isMinimized);
    }
    
    play() {
        // Alguns navegadores bloqueiam autoplay, então precisamos verificar
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.saveSettings();
            this.updateControls();
        }).catch(error => {
            console.log('Interação do usuário necessária para reproduzir música.');
            this.isPlaying = false;
            this.updateControls();
            
            // Adiciona um indicador visual de que a interação é necessária
            const toggleButton = document.getElementById('toggle-music');
            if (toggleButton) {
                toggleButton.classList.add('needs-interaction');
                const iconElement = toggleButton.querySelector('.audio-icon');
                if (iconElement) {
                    iconElement.textContent = '🔈';
                }
            }
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.saveSettings();
        this.updateControls();
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const container = document.querySelector('.audio-controls');
        if (container) {
            if (this.isMinimized) {
                container.classList.add('minimized');
            } else {
                container.classList.remove('minimized');
            }
            
            // Atualiza o ícone no botão de minimizar
            const minimizeButton = document.getElementById('minimize-button');
            if (minimizeButton) {
                const iconElement = minimizeButton.querySelector('.audio-icon');
                iconElement.textContent = this.isMinimized ? '➡️' : '⬅️';
            }
        }
        this.saveSettings();
    }
    
    playNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.audio.src = this.playlist[this.currentTrackIndex];
        if (this.isPlaying) {
            this.play();
        }
        this.saveSettings();
        this.updateTrackInfo();
    }
    
    playPreviousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.audio.src = this.playlist[this.currentTrackIndex];
        if (this.isPlaying) {
            this.play();
        }
        this.saveSettings();
        this.updateTrackInfo();
    }
    
    updateTrackInfo() {
        const trackInfo = document.getElementById('current-track-info');
        if (trackInfo) {
            // Extrair só o nome da música do caminho completo
            const fullPath = this.playlist[this.currentTrackIndex];
            const fileName = fullPath.split('/').pop().replace('.mp3', '');
            trackInfo.textContent = fileName;
        }
    }
    
    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar && !isNaN(this.audio.duration)) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        // Atualizar o tempo atual
        this.updateCurrentTime();
    }
    
    updateCurrentTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        const durationElement = document.getElementById('duration');
        if (durationElement && !isNaN(this.audio.duration)) {
            durationElement.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    seekTo(percentage) {
        const newTime = this.audio.duration * (percentage / 100);
        if (!isNaN(newTime)) {
            this.audio.currentTime = newTime;
        }
    }
    
    updateControls() {
        const toggleButton = document.getElementById('toggle-music');
        if (toggleButton) {
            const iconElement = toggleButton.querySelector('.audio-icon');
            
            // Remove o indicador de necessidade de interação
            toggleButton.classList.remove('needs-interaction');
            
            // Atualiza o ícone
            updateVolumeIcon(iconElement, this.volume);
        }
    }
    
    getCurrentTrackName() {
        const fullPath = this.playlist[this.currentTrackIndex];
        return fullPath.split('/').pop().replace('.mp3', '');
    }
    
    setVolume(value) {
        // Garantir que o volume esteja entre 0 e 1
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.saveSettings();
    }
    
    increaseVolume(step = 0.1) {
        this.setVolume(this.volume + step);
    }
    
    decreaseVolume(step = 0.1) {
        this.setVolume(this.volume - step);
    }
    
    getVolume() {
        return this.volume;
    }
    
    updateVolumeUI(volumeSlider) {
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
    }
}

// Instância global para o player de áudio
const audioPlayer = new AudioPlayer();

// Funções para controlar o player a partir da UI
function setupAudioControls() {
    const container = document.createElement('div');
    container.className = 'audio-controls';
    
    if (audioPlayer.isMinimized) {
        container.classList.add('minimized');
    }
    
    container.innerHTML = `
        <button id="previous-track" class="audio-button" title="Música anterior">
            <span class="audio-icon">⏮️</span>
        </button>
        <button id="toggle-music" class="audio-button" title="Reproduzir/Pausar">
            <span class="audio-icon">🔇</span>
        </button>
        <button id="next-track" class="audio-button" title="Próxima música">
            <span class="audio-icon">⏭️</span>
        </button>
        <div class="volume-control">
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${audioPlayer.getVolume()}" title="Volume">
        </div>
        <div id="track-info">
            <span id="current-track-info">${audioPlayer.getCurrentTrackName()}</span>
            <div class="time-display">
                <span id="current-time">0:00</span> / <span id="duration">0:00</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        <button id="minimize-button" class="audio-button minimize-button" title="Minimizar/Expandir">
            <span class="audio-icon">${audioPlayer.isMinimized ? '➡️' : '⬅️'}</span>
        </button>
        <div class="minimized-icon">🎵</div>
        <div class="expand-indicator">➡️</div>
    `;
    
    // Adicionar ao container principal
    const appContainer = document.querySelector('.container');
    appContainer.appendChild(container);
    
    // Event listeners
    const toggleButton = document.getElementById('toggle-music');
    const prevButton = document.getElementById('previous-track');
    const nextButton = document.getElementById('next-track');
    const volumeSlider = document.getElementById('volume-slider');
    const minimizeButton = document.getElementById('minimize-button');
    const progressContainer = document.querySelector('.progress-container');
    
    // Permitir clicar no player inteiro quando estiver minimizado para expandir
    container.addEventListener('click', (e) => {
        if (audioPlayer.isMinimized && e.target !== minimizeButton) {
            audioPlayer.toggleMinimize();
            e.stopPropagation(); // Impedir que o clique acione outros elementos
        }
    });
    
    toggleButton.addEventListener('click', () => {
        const isPlaying = audioPlayer.toggle();
        toggleButton.querySelector('.audio-icon').textContent = isPlaying ? '🔊' : '🔇';
        
        // Adiciona classe à página para indicar que houve interação
        document.body.classList.add('user-interacted');
    });
    
    prevButton.addEventListener('click', () => {
        audioPlayer.playPreviousTrack();
    });
    
    nextButton.addEventListener('click', () => {
        audioPlayer.playNextTrack();
    });
    
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.setVolume(parseFloat(e.target.value));
        // Atualizar ícone com base no volume
        updateVolumeIcon(toggleButton.querySelector('.audio-icon'), audioPlayer.getVolume());
    });
    
    minimizeButton.addEventListener('click', (e) => {
        audioPlayer.toggleMinimize();
        e.stopPropagation(); // Impedir que o evento propague para o container
    });
    
    // Permitir clicar na barra de progresso para buscar uma posição
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audioPlayer.seekTo(pos * 100);
        });
    }
    
    // Atualizar ícone inicial
    updateVolumeIcon(toggleButton.querySelector('.audio-icon'), audioPlayer.getVolume());
    
    // Se estiver minimizado, atualizar o ícone
    if (audioPlayer.isMinimized) {
        minimizeButton.querySelector('.audio-icon').textContent = '➡️';
    }
    
    // Se estiver tocando, atualizar o ícone
    if (audioPlayer.isPlaying) {
        toggleButton.querySelector('.audio-icon').textContent = '🔊';
    }
    
    // Atualizar informações da faixa inicial
    audioPlayer.updateTrackInfo();
    
    // Iniciar a atualização do progresso
    audioPlayer.updateProgress();
    
    // Se o autoplay foi solicitado nas configurações, tentar reproduzir após a primeira interação do usuário
    if (audioPlayer.autoplayRequested) {
        // Esperamos qualquer interação do usuário para começar a tocar
        const startPlayback = () => {
            if (!audioPlayer.isPlaying) {
                audioPlayer.play();
            }
            // Removemos os listeners após a primeira interação
            document.removeEventListener('click', startPlayback);
            document.removeEventListener('keydown', startPlayback);
            document.removeEventListener('touchstart', startPlayback);
        };
        
        document.addEventListener('click', startPlayback);
        document.addEventListener('keydown', startPlayback);
        document.addEventListener('touchstart', startPlayback);
        
        // Adiciona um estilo pulsante para indicar que está aguardando interação
        toggleButton.classList.add('waiting-interaction');
    }
}

// Função para atualizar o ícone com base no volume
function updateVolumeIcon(iconElement, volume) {
    if (!audioPlayer.isPlaying) {
        iconElement.textContent = '🔇';
        return;
    }
    
    if (volume === 0) {
        iconElement.textContent = '🔇';
    } else if (volume < 0.3) {
        iconElement.textContent = '🔈';
    } else if (volume < 0.7) {
        iconElement.textContent = '🔉';
    } else {
        iconElement.textContent = '🔊';
    }
} 