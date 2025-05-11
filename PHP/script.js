/**
 * script.js - Script principal para o site sobre PHP
 * 
 * Este arquivo contém todas as interações JavaScript para o site,
 * organizadas em funções específicas para cada funcionalidade.
 * 
 * Desenvolvido como um exemplo educacional simplificado.
 */

// Espera o DOM carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', function() {    // Inicializa todas as funcionalidades do site
    initMenuMobile();
    initScrollSpy();
    initBackToTop();
    initExecutarCodigo();
    initSoftwareInfo();
    initTabs();
    initAnimations();
});

/**
 * Inicializa o menu mobile para dispositivos menores
 * Esta função adiciona a funcionalidade de toggle para o menu em dispositivos móveis
 */
function initMenuMobile() {
    const menuButton = document.querySelector('.menu-mobile');
    const menu = document.querySelector('.menu');
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

/**
 * Implementa o scroll spy para destacar itens de menu conforme a rolagem
 * Esta função rastreia a posição da rolagem e atualiza os links de navegação
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.menu a');
    
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (section.getAttribute('id') === link.getAttribute('href').substring(1)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Inicializa o botão "Voltar ao topo"
 * Esta função mostra/esconde o botão conforme o usuário rola a página
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Inicializa o botão "Executar Código"
 * Esta função simula a execução do código PHP exibido no exemplo
 */
function initExecutarCodigo() {
    const executarButton = document.getElementById('executar-codigo');
    const resultadoCodigo = document.getElementById('resultado-codigo');
    
    if (executarButton && resultadoCodigo) {
        executarButton.addEventListener('click', function() {
            resultadoCodigo.style.display = 'block';
            resultadoCodigo.innerHTML = 'Olá, meu nome é João e tenho 30 anos. E sou especializado em: PHP, JavaScript, Python e Java.';
            animateTyping(resultadoCodigo);
        });
    }
}

/**
 * Anima o texto como se estivesse sendo digitado
 * @param {HTMLElement} element - O elemento que contém o texto a ser animado
 */
function animateTyping(element) {
    const text = element.innerHTML;
    element.innerHTML = '';
    let i = 0;
    
    function addChar() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(addChar, 20);
        }
    }
    
    addChar();
}

/**
 * Inicializa a exibição de informações sobre softwares
 * Esta função mostra detalhes sobre cada software ao clicar em seu ícone
 */
function initSoftwareInfo() {
    const softwareItems = document.querySelectorAll('.software-item');
    const softwareInfo = document.getElementById('software-info');
    
    if (softwareItems.length > 0 && softwareInfo) {
        softwareItems.forEach(item => {
            item.addEventListener('click', function() {
                const softwareName = this.getAttribute('data-name');
                const info = getSoftwareInfo(softwareName);
                softwareInfo.innerHTML = `<h4>${softwareName}</h4><p>${info}</p>`;
                softwareInfo.style.display = 'block';
                animateTyping(softwareInfo.querySelector('p'));
            });
        });
    }
}

function getSoftwareInfo(name) {
    const infoMap = {
        'WordPress': 'O sistema de gerenciamento de conteúdo mais popular do mundo, usado por mais de 40% dos sites na internet.',
        'Facebook': 'Uma das maiores redes sociais do mundo, construída originalmente com PHP.',
        'Drupal': 'Um CMS robusto frequentemente usado para sites corporativos e governamentais.',
        'Joomla': 'Um sistema de gerenciamento de conteúdo versátil e de código aberto.',
        'Magento': 'Uma das plataformas de e-commerce mais populares do mundo.',
        'MediaWiki': 'O software por trás da Wikipedia e outros projetos similares.',
        'Laravel': 'Um dos frameworks PHP mais populares para desenvolvimento web moderno.'
    };
    return infoMap[name] || 'Informações não disponíveis.';
}

/**
 * Inicializa o sistema de abas (tabs)
 * Esta função alterna entre diferentes conteúdos de abas
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(tb => tb.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.getAttribute('data-tab');
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }
}

/**
 * Inicializa o envio do formulário de contato
 * Esta função simula o envio de um formulário e exibe mensagens de resposta
 */
function initFormSubmit() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formStatus.innerHTML = 'Enviando mensagem...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            
            setTimeout(() => {
                formStatus.innerHTML = 'Mensagem enviada com sucesso!';
                formStatus.classList.add('success');
                contactForm.reset();
            }, 1500);
        });
    }
}

/**
 * Inicializa animações ao rolar a página
 * Esta função adiciona efeitos de aparecimento aos elementos quando ficam visíveis
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function animateVisibleElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateVisibleElements);
    animateVisibleElements();
}

/**
 * Inicializa exemplos de código com highlight de sintaxe
 * Esta função adiciona destaque de sintaxe aos blocos de código
 */
function initCodeHighlight() {
    const codeBlocks = document.querySelectorAll('.code-example code');
    
    if (window.hljs) {
        codeBlocks.forEach(block => {
            hljs.highlightBlock(block);
            formStatus.innerHTML = 'Enviando mensagem...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            
            // Timeout para simular o tempo de processamento
            setTimeout(() => {
                // Exibe mensagem de sucesso
                formStatus.innerHTML = `Obrigado ${nome}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`;
                formStatus.className = 'form-status success';
                
                // Limpa o formulário
                contactForm.reset();
            }, 1500);
        });
    }
}

/**
 * Inicializa o botão "Saiba Mais"
 * Esta função adiciona um comportamento de rolagem suave ao botão
 */
function initSaibaMais() {}

/**
 * Inicializa animações ao rolar a página
 * Esta função adiciona efeitos de aparecimento aos elementos quando ficam visíveis
 */
function initAnimations() {
    // Seleciona todos os elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Função para verificar se um elemento está visível na janela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Função para animar elementos visíveis
    function animateVisibleElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configura os elementos animados inicialmente
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Adiciona evento de rolagem para verificar e animar elementos
    window.addEventListener('scroll', animateVisibleElements);
    
    // Verifica elementos visíveis no carregamento inicial
    animateVisibleElements();
}

/**
 * Inicializa exemplos de código com highlight de sintaxe
 * Esta função adiciona destaque de sintaxe aos blocos de código
 */
function initCodeHighlight() {
    // Seleciona todos os blocos de código
    const codeBlocks = document.querySelectorAll('.code-example code');
    
    // Se existe uma biblioteca de highlight, aplica a todos os blocos
    if (window.hljs) {
        codeBlocks.forEach(block => {
            hljs.highlightBlock(block);
        });
    }
}

/**
 * Inicializa os tooltips para elementos com dicas
 * Esta função cria tooltips personalizados para elementos que possuem o atributo data-tooltip
 */
function initTooltips() {
    // Seleciona todos os elementos com tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    // Cria um elemento para o tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '0.9rem';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);
    
    // Adiciona eventos de mouse a cada elemento
    tooltipElements.forEach(element => {
        // Mostra o tooltip no mouseover
        element.addEventListener('mouseover', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            tooltip.textContent = tooltipText;
            tooltip.style.display = 'block';
            
            // Posiciona o tooltip próximo ao cursor
            updateTooltipPosition(e);
        });
        
        // Atualiza a posição do tooltip com o movimento do mouse
        element.addEventListener('mousemove', updateTooltipPosition);
        
        // Esconde o tooltip no mouseout
        element.addEventListener('mouseout', function() {
            tooltip.style.display = 'none';
        });
    });
    
    // Função para atualizar a posição do tooltip
    function updateTooltipPosition(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        // Ajusta para manter o tooltip dentro da janela
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Ajusta horizontalmente se necessário
        let finalX = x;
        if (x + tooltipWidth > windowWidth) {
            finalX = x - tooltipWidth - 20;
        }
        
        // Ajusta verticalmente se necessário
        let finalY = y;
        if (y + tooltipHeight > windowHeight) {
            finalY = y - tooltipHeight - 20;
        }
        
        tooltip.style.left = finalX + 'px';
        tooltip.style.top = finalY + 'px';
    }
}

/**
 * Adiciona contador de caracteres a campos de texto
 * Esta função mostra o número de caracteres digitados em áreas de texto
 */
function initCharacterCounter() {
    // Seleciona todas as áreas de texto que precisam de contador
    const textAreas = document.querySelectorAll('textarea[data-max-chars]');
    
    textAreas.forEach(textarea => {
        // Cria o elemento contador
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.8rem';
        counter.style.color = '#666';
        counter.style.marginTop = '5px';
        
        // Adiciona o contador após a área de texto
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        // Função para atualizar o contador
        function updateCounter() {
            const maxChars = parseInt(textarea.getAttribute('data-max-chars'));
            const currentChars = textarea.value.length;
            counter.textContent = `${currentChars} / ${maxChars} caracteres`;
            
            // Aplica estilo visual quando se aproxima/ultrapassa o limite
            if (currentChars > maxChars) {
                counter.style.color = 'red';
            } else if (currentChars > maxChars * 0.9) {
                counter.style.color = 'orange';
            } else {
                counter.style.color = '#666';
            }
        }
        
        // Atualiza o contador no carregamento e quando o usuário digita
        updateCounter();
        textarea.addEventListener('input', updateCounter);
    });
}

/**
 * Adiciona modo escuro/claro com persistência
 * Esta função implementa a alternância entre temas claro e escuro
 */
function initDarkMode() {
    // Seleciona o botão de alternância de tema
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        // Verifica se há preferência salva
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        // Função para ativar o modo escuro
        function enableDarkMode() {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            
            // Atualiza o ícone/texto do botão se necessário
            if (darkModeToggle.querySelector('i')) {
                darkModeToggle.querySelector('i').className = 'fas fa-sun';
            }
        }
        
        // Função para desativar o modo escuro
        function disableDarkMode() {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            
            // Atualiza o ícone/texto do botão se necessário
            if (darkModeToggle.querySelector('i')) {
                darkModeToggle.querySelector('i').className = 'fas fa-moon';
            }
        }
        
        // Aplica o tema conforme a preferência salva
        if (isDarkMode) {
            enableDarkMode();
        }
        
        // Adiciona evento de clique para alternar entre os modos
        darkModeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
}

/**
 * Inicializa todas as funcionalidades adicionais
 * Esta função deve ser chamada no carregamento da página
 */
function initAdditionalFeatures() {
    initCodeHighlight();
    initTooltips();
    initCharacterCounter();
    initDarkMode();
}

// Chama a inicialização de recursos adicionais após o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    initAdditionalFeatures();
});

