/*
========================================
WE LIPO - LANDING PAGE JAVASCRIPT
========================================
*/

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - Inicializando scripts...');
    
    try {
        initializeCountdown();
        initializeHeaderScroll();
        initializeFAQ();
        initializeSmoothScroll();
        initializeScrollAnimations();
        initializeUserEngagement();
        initializeButtonTracking();
        initializeFormValidation();
        
        console.log('Todos os scripts inicializados com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar scripts:', error);
    }
});

/*
========================================
COUNTDOWN TIMER
========================================
*/
function initializeCountdown() {
    console.log('Inicializando countdown...');
    
    function updateCountdown() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const timeDifference = endOfDay - now;

        // Calcula horas, minutos e segundos restantes
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // Atualiza os elementos na tela
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');

        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');

        // Se chegou ao fim do dia, reinicia para o próximo dia
        if (timeDifference <= 0) {
            endOfDay.setDate(endOfDay.getDate() + 1);
            endOfDay.setHours(23, 59, 59, 999);
        }
    }

    // Inicializa o countdown
    updateCountdown();
    
    // Atualiza a cada segundo
    setInterval(updateCountdown, 1000);
}

/*
========================================
HEADER SCROLL EFFECT
========================================
*/
function initializeHeaderScroll() {
    console.log('Inicializando efeito de scroll do header...');
    
    const header = document.getElementById('header');
    
    if (!header) {
        console.warn('Header não encontrado');
        return;
    }

    let ticking = false;

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    // Evento de scroll otimizado com requestAnimationFrame
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
}

/*
========================================
FAQ ACCORDION
========================================
*/
function initializeFAQ() {
    console.log('Inicializando FAQ...');
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.warn('Nenhum item FAQ encontrado');
        return;
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerContent = item.querySelector('.faq-answer-content');

        if (!question || !answer || !answerContent) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Fecha todos os itens
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                if (faqAnswer) {
                    faqAnswer.style.height = '0';
                }
            });

            // Abre o item clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
                answer.style.height = answerContent.offsetHeight + 'px';
                
                // Scroll suave para o item aberto
                setTimeout(() => {
                    question.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            }
        });
    });
}

/*
========================================
SMOOTH SCROLL
========================================
*/
function initializeSmoothScroll() {
    console.log('Inicializando scroll suave...');
    
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcula a posição considerando o header fixo
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Analytics tracking para cliques em âncoras
                trackEvent('click', 'Navigation', href);
            }
        });
    });
}

/*
========================================
SCROLL ANIMATIONS
========================================
*/
function initializeScrollAnimations() {
    console.log('Inicializando animações de scroll...');
    
    // Verifica se o navegador suporta IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver não suportado');
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona animação de fade in
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                // Remove o observer após a animação
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa seções principais
    const sections = document.querySelectorAll('section, .benefit-card, .ingredient-card, .product-card, .testimonial-card, .nutrition-section');
    
    sections.forEach(section => {
        // Define estado inicial
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        observer.observe(section);
    });
}

/*
========================================
USER ENGAGEMENT TRACKING
========================================
*/
function initializeUserEngagement() {
    console.log('Inicializando tracking de engagement...');
    
    let timeOnPage = 0;
    let hasScrolled50Percent = false;
    let hasScrolled75Percent = false;
    
    // Contador de tempo na página
    const timeCounter = setInterval(() => {
        timeOnPage++;
        
        // Após 30 segundos, adiciona urgência visual
        if (timeOnPage === 30) {
            addUrgencyEffects();
        }
        
        // Após 60 segundos, tracking de engagement
        if (timeOnPage === 60) {
            trackEvent('engagement', 'time_on_page', '60_seconds');
        }
        
        // Após 2 minutos, tracking de interesse alto
        if (timeOnPage === 120) {
            trackEvent('engagement', 'high_interest', '2_minutes');
        }
        
    }, 1000);

    // Tracking de scroll depth
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent >= 50 && !hasScrolled50Percent) {
            hasScrolled50Percent = true;
            trackEvent('scroll', 'depth', '50_percent');
        }
        
        if (scrollPercent >= 75 && !hasScrolled75Percent) {
            hasScrolled75Percent = true;
            trackEvent('scroll', 'depth', '75_percent');
        }
    }, 1000));

    // Cleanup ao sair da página
    window.addEventListener('beforeunload', () => {
        clearInterval(timeCounter);
    });
}

/*
========================================
EFEITOS DE URGÊNCIA
========================================
*/
function addUrgencyEffects() {
    console.log('Adicionando efeitos de urgência...');
    
    // Adiciona animação de pulse nos botões CTA
    const ctaButtons = document.querySelectorAll('.button:not(.button-outline)');
    ctaButtons.forEach(button => {
        if (!button.classList.contains('animate')) {
            button.classList.add('animate');
        }
    });

    // Adiciona efeito de blink no banner de urgência
    const urgencyBanners = document.querySelectorAll('.urgency-banner, .countdown-alert');
    urgencyBanners.forEach(banner => {
        banner.style.animation = 'pulse 1.5s infinite';
    });
}

/*
========================================
BUTTON TRACKING
========================================
*/
function initializeButtonTracking() {
    console.log('Inicializando tracking de botões...');
    
    // Tracking de cliques nos botões principais
    const mainButtons = document.querySelectorAll('.button');
    
    mainButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonLocation = getButtonLocation(this);
            
            console.log('Botão clicado:', buttonText, 'em:', buttonLocation);
            trackEvent('button_click', buttonLocation, buttonText);
            
            // Vibração no mobile (se suportado)
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
    });

    // Tracking de cliques no WhatsApp
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            console.log('WhatsApp clicado');
            trackEvent('contact', 'whatsapp_click', 'floating_button');
        });
    }
}

/*
========================================
UTILITY FUNCTIONS
========================================
*/

// Throttle function para otimizar performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Identifica a localização do botão na página
function getButtonLocation(button) {
    const section = button.closest('section');
    if (section) {
        if (section.classList.contains('hero')) return 'hero';
        if (section.classList.contains('offer')) return 'offer';
        if (section.classList.contains('products')) return 'products';
        if (section.classList.contains('guarantee')) return 'guarantee';
        if (section.classList.contains('nutritional-info')) return 'nutritional-info';
    }
    if (button.classList.contains('whatsapp-float')) return 'whatsapp_float';
    return 'other';
}

// Função de tracking de eventos (compatível com GA4 e outras ferramentas)
function trackEvent(action, category, label, value) {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                action: action,
                category: category,
                label: label
            });
        }
        
        // Console log para debug
        console.log('Event tracked:', { action, category, label, value });
    } catch (error) {
        console.warn('Erro no tracking:', error);
    }
}

/*
========================================
FORMULÁRIO E VALIDAÇÕES
========================================
*/
function initializeFormValidation() {
    console.log('Inicializando validação de formulários...');
    
    const forms = document.querySelectorAll('form');
    
    if (forms.length === 0) {
        console.log('Nenhum formulário encontrado');
        return;
    }
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
            
            // Tracking de conversão
            trackEvent('form_submit', 'conversion', 'lead_form');
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Validação de email
        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Digite um email válido');
            isValid = false;
        }
        
        // Validação de telefone
        if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            showFieldError(field, 'Digite um telefone válido');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove mensagem anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#DC2626';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '5px';
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const regex = /^[\d\s\-\(\)\+]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/*
========================================
LAZY LOADING DE IMAGENS
========================================
*/
function initializeLazyLoading() {
    console.log('Inicializando lazy loading...');
    
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) {
        console.log('Nenhuma imagem com lazy loading encontrada');
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/*
========================================
DETECÇÃO DE ADBLOCK
========================================
*/
function detectAdBlock() {
    const adBlockDetected = typeof window.adBlockDetected !== 'undefined';
    
    if (adBlockDetected) {
        trackEvent('adblock', 'detected', 'user_has_adblock');
    }
}

/*
========================================
OTIMIZAÇÕES DE PERFORMANCE
========================================
*/

// Pré-carrega links importantes
function preloadImportantResources() {
    console.log('Pré-carregando recursos importantes...');
    
    const importantLinks = [
        'https://api.whatsapp.com'
    ];
    
    importantLinks.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'dns-prefetch';
        linkElement.href = link;
        document.head.appendChild(linkElement);
    });
}

// Carrega recursos não-críticos após o load
window.addEventListener('load', function() {
    console.log('Página carregada - Inicializando recursos não-críticos...');
    
    // Inicializa recursos não-críticos
    setTimeout(() => {
        initializeLazyLoading();
        detectAdBlock();
        preloadImportantResources();
    }, 1000);
});

/*
========================================
ERROR HANDLING
========================================
*/
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.message, 'em', e.filename, 'linha', e.lineno);
    
    // Log de erros para monitoramento
    trackEvent('javascript_error', 'error', e.message);
});

// Detecta problemas de performance
window.addEventListener('load', function() {
    if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Tempo de carregamento:', loadTime + 'ms');
        
        if (loadTime > 3000) {
            trackEvent('performance', 'slow_load', loadTime);
        }
    }
});

console.log('Script WE Lipo carregado com sucesso!');