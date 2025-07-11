/*
========================================
BEAUTY LIFE SHOT - LANDING PAGE JAVASCRIPT
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

        if (!question || !answer) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Fecha todos os itens
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // Abre o item clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
                
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
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Para cards com delay
                if (entry.target.classList.contains('delay-animation')) {
                    const cards = entry.target.querySelectorAll('.benefit-card, .product-card, .testimonial-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos para animar
    const elementsToAnimate = document.querySelectorAll(
        '.benefits, .products, .testimonials, .guarantee, .how-to-use, .why-use'
    );

    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(element);
    });
}

/*
========================================
USER ENGAGEMENT
========================================
*/
function initializeUserEngagement() {
    console.log('Inicializando engajamento do usuário...');
    
    // Tracking de tempo na página
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 1;
        
        // Triggers especiais baseados no tempo
        if (timeOnPage === 30) {
            trackEvent('engagement', 'Time on Page', '30 seconds');
        } else if (timeOnPage === 60) {
            trackEvent('engagement', 'Time on Page', '1 minute');
            addUrgencyEffects();
        } else if (timeOnPage === 120) {
            trackEvent('engagement', 'Time on Page', '2 minutes');
        }
    }, 1000);

    // Tracking de scroll
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            if (maxScroll >= 25 && maxScroll < 30) {
                trackEvent('engagement', 'Scroll Depth', '25%');
            } else if (maxScroll >= 50 && maxScroll < 55) {
                trackEvent('engagement', 'Scroll Depth', '50%');
            } else if (maxScroll >= 75 && maxScroll < 80) {
                trackEvent('engagement', 'Scroll Depth', '75%');
            } else if (maxScroll >= 90) {
                trackEvent('engagement', 'Scroll Depth', '90%');
            }
        }
    }, 250));

    // Tracking de exit intent (apenas desktop)
    if (window.innerWidth > 768) {
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY <= 0) {
                trackEvent('engagement', 'Exit Intent', 'Mouse Leave');
            }
        });
    }
}

/*
========================================
URGENCY EFFECTS
========================================
*/
function addUrgencyEffects() {
    console.log('Adicionando efeitos de urgência...');
    
    // Adiciona animação extra ao countdown
    const countdownNumbers = document.querySelectorAll('.countdown-number');
    countdownNumbers.forEach(number => {
        number.style.animation = 'pulse 1s infinite';
    });

    // Adiciona efeito nos botões principais
    const mainButtons = document.querySelectorAll('.button.animate');
    mainButtons.forEach(button => {
        button.style.animation = 'pulse 1.5s infinite';
    });
}

/*
========================================
BUTTON TRACKING
========================================
*/
function initializeButtonTracking() {
    console.log('Inicializando tracking de botões...');
    
    const buttons = document.querySelectorAll('.button, .product-card .button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonLocation = getButtonLocation(this);
            
            trackEvent('click', 'Button', `${buttonText} - ${buttonLocation}`);
            
            // Para botões de produto
            if (this.closest('.product-card')) {
                const productName = this.closest('.product-card').querySelector('h3')?.textContent || 'Unknown';
                trackEvent('click', 'Product Button', productName);
            }
        });
    });
}

/*
========================================
UTILITIES
========================================
*/
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
    }
}

function getButtonLocation(button) {
    if (button.closest('.hero')) return 'Hero';
    if (button.closest('.products')) return 'Products';
    if (button.closest('.cta-main')) return 'CTA Main';
    if (button.closest('.footer')) return 'Footer';
    return 'Other';
}

function trackEvent(action, category, label, value) {
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
        fbq('trackCustom', `${category}_${action}`, {
            label: label,
            value: value
        });
    }
    
    // Console log para desenvolvimento
    console.log(`Event: ${action} | Category: ${category} | Label: ${label}`);
}

/*
========================================
FORM VALIDATION
========================================
*/
function initializeFormValidation() {
    console.log('Inicializando validação de formulários...');
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
            
            // Tracking de envio de formulário
            trackEvent('submit', 'Form', 'Contact Form');
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    fields.forEach(field => {
        clearFieldError(field);
        
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Digite um email válido');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showFieldError(field, 'Digite um telefone válido');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#EF4444';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

/*
========================================
LAZY LOADING
========================================
*/
function initializeLazyLoading() {
    console.log('Inicializando lazy loading...');
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/*
========================================
PERFORMANCE MONITORING
========================================
*/
function preloadImportantResources() {
    // Preload de imagens importantes
    const importantImages = [
        './images/lifeshot-produto.webp',
        './images/mulher_lifeshot.webp'
    ];
    
    importantImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Chama o preload quando necessário
window.addEventListener('load', preloadImportantResources);

/*
========================================
MOBILE OPTIMIZATIONS
========================================
*/
function initializeMobileOptimizations() {
    if (window.innerWidth <= 768) {
        // Reduz animações em mobile para melhor performance
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.3s !important;
                animation-delay: 0s !important;
                transition-duration: 0.3s !important;
                transition-delay: 0s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializa otimizações mobile
initializeMobileOptimizations(); 