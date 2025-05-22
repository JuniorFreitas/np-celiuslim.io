// SCRIPT DO COUNTDOWN COM LOCALSTORAGE
// Função para inicializar o contador e gerenciar o localStorage
function initializeCountdown() {
    // Verifica no localStorage se já existe uma data alvo salva
    const savedTargetDate = localStorage.getItem('countdown_target_date');
    const savedStartDate = localStorage.getItem('countdown_start_date');
    
    // Data atual para comparações
    const now = new Date();
    const currentDateStr = now.toDateString(); // Para comparar se é um novo dia
    
    let targetDate;
    
    // Decidir se usa a data salva ou cria uma nova
    if (savedTargetDate && savedStartDate) {
        // Converter a string para objeto Date
        targetDate = new Date(parseInt(savedTargetDate));
        const startDate = new Date(savedStartDate);
        
        // Verificar se estamos em um novo dia (comparar apenas a data, não o horário)
        if (currentDateStr !== startDate.toDateString()) {
            // É um novo dia, resetar o contador para +1 dias a partir de agora
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 1);
            
            // Salvar a nova data alvo e a data de início
            localStorage.setItem('countdown_target_date', targetDate.getTime().toString());
            localStorage.setItem('countdown_start_date', now.toString());
        }
        // Verificar se a data já passou (contador zerou)
        else if (targetDate <= now) {
            // Contador chegou a zero, resetar para +1 dias
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 1);
            
            // Salvar a nova data alvo (mantém a mesma data de início para hoje)
            localStorage.setItem('countdown_target_date', targetDate.getTime().toString());
        }
    } else {
        // Primeira vez que o usuário visita, criar data alvo (+1 dias)
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        
        // Salvar a data alvo e a data de início
        localStorage.setItem('countdown_target_date', targetDate.getTime().toString());
        localStorage.setItem('countdown_start_date', now.toString());
    }
    
    return targetDate;
}

// Função para atualizar o contador
function updateCountdown() {
    // Obtém a data alvo que foi inicializada
    const targetDate = window.countdownTargetDate;
    
    // Data e hora atual
    const now = new Date();
    
    // Calcula a diferença em milissegundos
    let timeDifference = targetDate - now;
    
    // Se o contador chegou a zero, reinicializa
    if (timeDifference <= 0) {
        // Reset para +1 dias a partir de agora
        const newTargetDate = new Date();
        newTargetDate.setDate(newTargetDate.getDate() + 1);
        
        // Atualizar a variável global e o localStorage
        window.countdownTargetDate = newTargetDate;
        localStorage.setItem('countdown_target_date', newTargetDate.getTime().toString());
        
        // Recalcular a diferença com a nova data
        timeDifference = newTargetDate - now;
    }
    
    // Calcular os valores do contador
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    // Atualizar os elementos na página
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Inicializar o contador
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar a data alvo e salvar como variável global
    window.countdownTargetDate = initializeCountdown();
    
    // Iniciar o contador
    updateCountdown();
    
    // Atualizar a cada segundo
    setInterval(updateCountdown, 1000);
    
    // Header fixo com efeito de scroll
    window.addEventListener('scroll', function () {
        const header = document.getElementById('header');
        if (header && window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }
    });

    // Funcionalidade de FAQ com acordeão
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerContent = item.querySelector('.faq-answer-content');

        if (question && answer && answerContent) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Fechar todos os itens ativos
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    if (faqAnswer) faqAnswer.style.height = '0';
                });

                // Abrir o item clicado (se não estava ativo)
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.height = answerContent.offsetHeight + 'px';
                }
            });
        }
    });

    // Pop-up de desconto na saída
    let popupShown = false;

    document.addEventListener('mouseleave', function (e) {
        if (e.clientY < 0 && !popupShown) {
            const popup = document.getElementById('discount-popup');
            if (popup) {
                popup.classList.add('active');
                popupShown = true;
            }
        }
    });

    const closePopupBtn = document.getElementById('close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function () {
            const popup = document.getElementById('discount-popup');
            if (popup) {
                popup.classList.remove('active');
            }
        });
    }

    // Fechar popup clicando fora dele
    const popupOverlay = document.getElementById('discount-popup');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function (e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });
    }

    // Mostrar pop-up automaticamente após 30 segundos
    setTimeout(function () {
        if (!popupShown) {
            const popup = document.getElementById('discount-popup');
            if (popup) {
                popup.classList.add('active');
                popupShown = true;
            }
        }
    }, 30000);

    // Form de Desconto
    const discountForm = document.getElementById('discount-form');
    if (discountForm) {
        discountForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Seu cupom de desconto é: CELUSLIM10');
        });
    }

    // Scroll suave para os links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 100; // Ajuste conforme necessário
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Carregamento de imagens responsivo com IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imgObserver.unobserve(img);
                    }
                }
            });
        });

        // Observar todas as imagens com atributo loading="lazy" e data-src
        document.querySelectorAll('img[loading="lazy"][data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

    // Adicionar animação de entrada aos elementos quando entram na tela
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Aplicar animação a cards e seções
        const animatedElements = document.querySelectorAll('.benefit-card, .product-card, .ingredient-card, .video-card, .testimonial-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // Validação de formulário aprimorada
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        // Limpar erros anteriores
        clearError(input);

        // Validação baseada no tipo de campo
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um e-mail válido.';
            }
        } else if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\(\)\-\+]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Por favor, insira um número de telefone válido.';
            }
        }

        if (!isValid) {
            showError(input, errorMessage);
        }

        return isValid;
    }

    function showError(input, message) {
        input.style.borderColor = '#e74c3c';
        
        // Remover mensagem de erro existente
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Adicionar nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        input.parentNode.appendChild(errorDiv);
    }

    function clearError(input) {
        input.style.borderColor = '';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Funcionalidade para máscaras de telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    });

    // Funcionalidade para controles de vídeo personalizados
    const videos = document.querySelectorAll('.video-container video');
    videos.forEach(video => {
        video.addEventListener('loadedmetadata', function() {
            // Adicionar controles personalizados se necessário
            console.log(`Vídeo carregado: duração ${Math.floor(this.duration / 60)}:${Math.floor(this.duration % 60).toString().padStart(2, '0')}`);
        });

        // Pausar outros vídeos quando um começar a tocar
        video.addEventListener('play', function() {
            videos.forEach(otherVideo => {
                if (otherVideo !== this) {
                    otherVideo.pause();
                }
            });
        });

        // Adicionar loading lazy para vídeos
        video.addEventListener('loadstart', function() {
            this.style.opacity = '0.7';
        });

        video.addEventListener('canplay', function() {
            this.style.opacity = '1';
        });
    });

    console.log('CELU SLIM - Site carregado com sucesso!');
});