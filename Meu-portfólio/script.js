// Array de projetos para exibição
const projects = [
    {
        title: "Sistema de Gestão",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        description: "Sistema web completo para gestão empresarial com dashboard interativo, relatórios e controle de usuários.",
        tags: ["React", "Node.js", "MongoDB"],
        category: "web"
    },
    {
        title: "E-commerce App",
        image: "img/ecommerce.jpg",
        description: "Aplicativo mobile para e-commerce com funcionalidades de carrinho, pagamento e rastreamento de pedidos.",
        tags: ["React Native", "Firebase", "Redux"],
        category: "mobile"
    },
    {
        title: "Interface de Usuário",
        image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80",
        description: "Design de interface moderna para aplicativo de finanças pessoais com foco em usabilidade e acessibilidade.",
        tags: ["Vite", "UI/UX", "Prototyping"],
        category: "design"
    },
    {
        title: "Landing Page",
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        description: "Landing page responsiva para produto SaaS com animações, integração de formulário e otimização para SEO.",
        tags: ["HTML", "CSS", "JavaScript"],
        category: "web"
    },
    {
        title: "App de Notícias",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
        description: "Aplicativo de notícias em tempo real com sistema de notificações, modo offline e personalização de conteúdo.",
        tags: ["Flutter", "Dart", "REST API"],
        category: "mobile"
    },
    {
        title: "Design de Marca",
        image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80",
        description: "Identidade visual completa para startup de tecnologia, incluindo logo, paleta de cores e materiais de marketing.",
        tags: ["Branding", "Illustrator", "Photoshop"],
        category: "design"
    }
];

// Função para carregar os projetos na página
const loadProjects = (category = 'all') => {
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);
    
    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '<p class="no-projects">Nenhum projeto encontrado nesta categoria.</p>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
        
        // Adicionar comportamento de acessibilidade
        projectCard.setAttribute('tabindex', '0');
        projectCard.setAttribute('aria-label', `Projeto: ${project.title}`);
        
        // Adicionar evento de clique
        const handleClick = () => {
            openProjectModal(project);
        };
        
        // Adicionar eventos de acessibilidade
        projectCard.addEventListener('click', handleClick);
        projectCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        });
        
        projectsContainer.appendChild(projectCard);
    });
};

// Função para criar e abrir modal de projeto
const openProjectModal = (project) => {
    // Verificar se já existe um modal e removê-lo
    const existingModal = document.querySelector('.project-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    
    const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${project.title}</h3>
                <button class="modal-close" aria-label="Fechar modal">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${project.image}" alt="${project.title}" class="modal-image">
                <div class="modal-details">
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    document.body.appendChild(modal);
    
    // Prevenir rolagem do corpo
    document.body.style.overflow = 'hidden';
    
    // Animar entrada do modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Adicionar evento para fechar modal
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Fechar ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
};

// Função para filtrar projetos
const setupProjectFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Carregar projetos filtrados
            loadProjects(button.getAttribute('data-filter'));
        });
    });
};

// Função para aplicar efeitos de scroll
const handleScrollEffects = () => {
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.header');
    const scrollTopBtn = document.getElementById('scroll-top');
    let lastScrollTop = 0;
    let animationsReset = false;
    
    const resetAnimations = () => {
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        });
        
        // Resetar as barras de progresso de forma forçada
        if (window.resetProgressBars) {
            window.resetProgressBars();
            
            // Garantir que o estado da animação seja resetado
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                bar.classList.remove('animated');
                bar.style.width = '0';
            });
        }
        
        // Resetar ícones de tecnologia
        if (window.resetTechIcons) {
            window.resetTechIcons();
        }
        
        // Resetar estados de controle
        if (typeof animateTechIconsWhenVisible !== 'undefined') {
            animateTechIconsWhenVisible.sectionLeft = false;
            animateTechIconsWhenVisible.animated = false;
        }
        
        animationsReset = true;
    };
    
    // Tornar a função disponível globalmente
    window.resetAllAnimations = resetAnimations;
    
    const fadeInOnScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const triggerBottom = window.innerHeight * 0.8;
        
        // Detector de scroll para cima, perto do topo
        if (scrollTop < 300 && lastScrollTop > scrollTop && !animationsReset) {
            resetAnimations();
        }
        
        // Se estiver descendo a página novamente após reset
        if (scrollTop > 300 && animationsReset) {
            animationsReset = false;
        }
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
        
        // Controlar classe do cabeçalho ao rolar
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Controlar visibilidade do botão de voltar ao topo
        if (scrollTop > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
        
        // Salvar a posição atual de scroll para comparação futura
        lastScrollTop = scrollTop;
    };
    
    // Aplicar estilo inicial
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar posição inicial
    fadeInOnScroll();
    
    // Adicionar evento de scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Configurar botão de voltar ao topo
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Resetar animações quando clica no botão de voltar ao topo
            setTimeout(resetAnimations, 500);
        });
        
        scrollTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                // Resetar animações ao usar teclado para voltar ao topo
                setTimeout(resetAnimations, 500);
            }
        });
    }
};

// Função para controlar menu móvel
const handleMobileMenu = () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navLinks) return;
    
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        menuToggle.setAttribute(
            'aria-expanded', 
            navLinks.classList.contains('active') ? 'true' : 'false'
        );
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
};

// Função para animar habilidades técnicas
const animateTechSkills = () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    if (!progressBars.length) return;
    
    const animateProgressBar = (element) => {
        // Guardamos a largura original como atributo de dados se ainda não existir
        if (!element.dataset.originalWidth) {
            const width = element.getAttribute('style').replace('width: ', '').replace(';', '');
            element.dataset.originalWidth = width;
        }
        
        // Resetamos para zero
        element.style.width = '0';
        
        // Forçamos um reflow para garantir a animação
        void element.offsetWidth;
        
        // Aplicamos a largura depois de um pequeno delay
        setTimeout(() => {
            element.style.width = element.dataset.originalWidth;
        }, 50);
    };
    
    // Função para verificar se elemento está visível
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    };
    
    // Resetar animações de progresso
    const resetProgressBars = () => {
        progressBars.forEach(bar => {
            // Adicionar classe de resetting para desabilitar a transição durante o reset
            bar.classList.add('resetting');
            
            // Remove a classe animated de todas as barras
            bar.classList.remove('animated');
            
            // Reseta a largura para 0
            bar.style.width = '0';
            
            // Importante: forçar reflow para garantir que a animação seja replicada
            void bar.offsetWidth;
            
            // Remover a classe de resetting depois de um pequeno delay
            setTimeout(() => {
                bar.classList.remove('resetting');
            }, 50);
        });
        
        // Resetar o estado de animação
        hasAnimated = false;
    };
    
    // Variável para verificar se já animamos as barras
    let hasAnimated = false;
    // Rastrear a última posição de scroll
    let lastScrollTop = 0;
    
    // Verificar e animar barras visíveis
    const checkProgressBars = () => {
        // Busca a seção que contém as barras de progresso
        const skillsSection = document.querySelector('.progress-bars')?.closest('.skills-column');
        
        if (!skillsSection) return;
        
        // Pegar a posição atual de scroll
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Detectar direção do scroll
        const isScrollingUp = scrollTop < lastScrollTop;
        
        // Se estiver scrollando para cima e estiver próximo ao topo, resetar barras
        if (isScrollingUp && scrollTop < 300) {
            resetProgressBars();
        }
        
        // Verifica se a seção está visível
        const skillsSectionVisible = isInViewport(skillsSection);
        
        // Se a seção está visível e ainda não animamos, fazemos a animação
        if (skillsSectionVisible && !hasAnimated) {
            progressBars.forEach(bar => {
                animateProgressBar(bar);
                bar.classList.add('animated');
            });
            hasAnimated = true;
        }
        
        // Se a seção não está mais visível e tinha sido animada, resetamos
        if (!skillsSectionVisible && hasAnimated) {
            resetProgressBars();
        }
        
        // Atualizar a última posição de scroll
        lastScrollTop = scrollTop;
    };
    
    // Verificar na carga inicial e no scroll
    checkProgressBars();
    window.addEventListener('scroll', checkProgressBars);
    
    // Disponibilizar função de reset para outras partes do código
    window.resetProgressBars = resetProgressBars;
};

// Função para lidar com o formulário de contato
const handleContactForm = () => {
    const form = document.getElementById('form-contact');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simular envio de formulário
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // Simulando resposta de sucesso
        showAlert('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        
        // Limpar formulário
        form.reset();
    });
};

// Função para mostrar alertas/notificações
const showAlert = (message, type = 'info') => {
    // Remover alerta existente
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
            <button class="alert-close" aria-label="Fechar alerta">&times;</button>
        </div>
    `;
    
    // Adicionar ao corpo
    document.body.appendChild(alert);
    
    // Animar entrada
    setTimeout(() => {
        alert.classList.add('active');
    }, 10);
    
    // Configurar fechamento
    const closeAlert = () => {
        alert.classList.remove('active');
        setTimeout(() => {
            alert.remove();
        }, 300);
    };
    
    // Fechar ao clicar no botão
    alert.querySelector('.alert-close').addEventListener('click', closeAlert);
    
    // Fechar automaticamente após 5 segundos
    setTimeout(closeAlert, 5000);
};

// Adicionar efeito de partículas ao fundo
const createParticleEffect = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar o canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.15';
    
    document.body.appendChild(canvas);
    
    // Redimensionar o canvas
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Configurações de partículas
    const particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particleColors = ['#8257e6', '#4cc9f0', '#ffffff'];
    
    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.5
        });
    }
    
    // Função de animação
    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar e atualizar partículas
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Atualizar posição
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Limites do canvas
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
    };
    
    animate();
};

// Função para animar entrada de elementos com intervalo
const staggeredAnimation = () => {
    const animateElements = (elements, delay = 100) => {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * delay);
        });
    };
    
    // Resetar elementos para estado inicial
    const resetElements = (elements, transform) => {
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = transform;
        });
    };
    
    // Animar elementos do cabeçalho
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    animateElements(navItems, 100);
    
    // Animar ícones de tecnologia
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(20px)';
        icon.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    
    // Função para animar ícones quando visíveis
    const animateTechIconsWhenVisible = () => {
        const section = document.querySelector('.tech-icons').closest('.skills-column');
        if (!section) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Resetar animações quando próximo ao topo
        if (scrollTop < 300) {
            resetElements(techIcons, 'translateY(20px)');
            return;
        }
        
        // Verificar se a seção está visível
        const sectionVisible = section.getBoundingClientRect().top < window.innerHeight * 0.8;
        
        // Variável estática para rastrear se a seção saiu da visualização
        if (!animateTechIconsWhenVisible.sectionLeft) {
            animateTechIconsWhenVisible.sectionLeft = false;
        }
        
        // Se não estiver visível e estava anteriormente, marcar que saiu
        if (!sectionVisible && !animateTechIconsWhenVisible.sectionLeft) {
            animateTechIconsWhenVisible.sectionLeft = true;
        }
        
        // Se estiver visível agora e tinha saído anteriormente, reanimamos
        if (sectionVisible && animateTechIconsWhenVisible.sectionLeft) {
            resetElements(techIcons, 'translateY(20px)');
            animateElements(techIcons, 150);
            animateTechIconsWhenVisible.sectionLeft = false;
        } else if (sectionVisible && !animateTechIconsWhenVisible.animated) {
            // Primeira animação
            animateElements(techIcons, 150);
            animateTechIconsWhenVisible.animated = true;
        }
    };
    
    window.addEventListener('scroll', animateTechIconsWhenVisible);
    animateTechIconsWhenVisible(); // Verificar na carga inicial
    
    // Disponibilizar função globalmente
    window.resetTechIcons = () => resetElements(techIcons, 'translateY(20px)');
};

// Função para animações de digitação
const setupTypingEffect = () => {
    const textElement = document.querySelector('.profession');
    if (!textElement) return;
    
    const originalText = textElement.textContent;
    textElement.textContent = '';
    
    const typeText = () => {
        let charIndex = 0;
        
        const type = () => {
            if (charIndex < originalText.length) {
                textElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 30); // Velocidade de digitação
            }
        };
        
        type();
    };
    
    // Iniciar após 1 segundo
    setTimeout(typeText, 1000);
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupProjectFilters();
    handleScrollEffects();
    handleMobileMenu();
    animateTechSkills();
    handleContactForm();
    createParticleEffect();
    staggeredAnimation();
    setupTypingEffect();
    
    // Função global para resetar todas as animações
    window.resetAllAnimations = () => {
        // Resetar barras de progresso com uma implementação forçada
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.classList.remove('animated');
            bar.style.width = '0';
            // Forçar um reflow para garantir que a animação seja replicada
            void bar.offsetWidth;
        });
        
        // Chamar funções de reset específicas se disponíveis
        if (window.resetProgressBars) {
            window.resetProgressBars();
        }
        
        if (window.resetTechIcons) {
            window.resetTechIcons();
        }
    };
    
    // Configurar reset de animações para links de navegação que vão para o topo
    const topLinks = document.querySelectorAll('a[href="#about"], a[href="#"]');
    topLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                if (window.resetAllAnimations) {
                    window.resetAllAnimations();
                }
            }, 500);
        });
    });
    
    // Adicionar evento para botões de scroll para o topo (se existirem)
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (window.resetAllAnimations) {
                    window.resetAllAnimations();
                }
            }, 500);
        });
    }
});