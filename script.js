// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des fonctionnalités
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initReservationForm();
    initSmoothScrolling();
});

// Navigation avec effet glace
function initNavbar() {
    const navbar = document.querySelector('.glass-navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet de scroll sur la navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        });
    });
    
    // Animation des liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animations au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.region-card, .service-card, .contact-info, .contact-form');
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const data = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                region: document.getElementById('region').value,
                message: document.getElementById('message').value
            };
            
            // Validation
            if (!validateContactForm(data)) {
                return;
            }
            
            // Simulation d'envoi
            showLoadingState(this);
            
            setTimeout(() => {
                showSuccessMessage('Votre message a été envoyé avec succès !');
                this.reset();
                hideLoadingState(this);
            }, 2000);
        });
    }
}

// Formulaire de réservation
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        // Validation en temps réel
        const inputs = reservationForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Soumission de la réservation
function submitReservation() {
    const form = document.getElementById('reservationForm');
    const formData = new FormData(form);
    
    const data = {
        nom: document.getElementById('reservationNom').value,
        email: document.getElementById('reservationEmail').value,
        telephone: document.getElementById('reservationTelephone').value,
        region: document.getElementById('reservationRegion').value,
        dateDepart: document.getElementById('dateDepart').value,
        dateRetour: document.getElementById('dateRetour').value,
        nombrePersonnes: document.getElementById('nombrePersonnes').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('reservationMessage').value
    };
    
    // Validation
    if (!validateReservationForm(data)) {
        return;
    }
    
    // Simulation d'envoi
    const submitBtn = document.querySelector('[onclick="submitReservation()"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage('Votre réservation a été confirmée ! Nous vous contacterons sous peu.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
        modal.hide();
    }, 2000);
}

// Validation du formulaire de contact
function validateContactForm(data) {
    let isValid = true;
    const errors = [];
    
    if (!data.nom.trim()) {
        errors.push('Le nom est requis');
        isValid = false;
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('Un email valide est requis');
        isValid = false;
    }
    
    if (!data.message.trim()) {
        errors.push('Le message est requis');
        isValid = false;
    }
    
    if (!isValid) {
        showErrorMessage(errors.join('<br>'));
    }
    
    return isValid;
}

// Validation du formulaire de réservation
function validateReservationForm(data) {
    let isValid = true;
    const errors = [];
    
    if (!data.nom.trim()) {
        errors.push('Le nom est requis');
        isValid = false;
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('Un email valide est requis');
        isValid = false;
    }
    
    if (!data.telephone.trim()) {
        errors.push('Le téléphone est requis');
        isValid = false;
    }
    
    if (!data.region) {
        errors.push('La région est requise');
        isValid = false;
    }
    
    if (!data.dateDepart) {
        errors.push('La date de départ est requise');
        isValid = false;
    }
    
    if (!data.dateRetour) {
        errors.push('La date de retour est requise');
        isValid = false;
    }
    
    if (data.dateDepart && data.dateRetour && new Date(data.dateRetour) <= new Date(data.dateDepart)) {
        errors.push('La date de retour doit être postérieure à la date de départ');
        isValid = false;
    }
    
    if (!isValid) {
        showErrorMessage(errors.join('<br>'));
    }
    
    return isValid;
}

// Validation d'un champ individuel
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Supprimer les anciens messages d'erreur
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation selon le type de champ
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Ce champ est requis';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Email invalide';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Numéro de téléphone invalide';
    }
    
    if (!isValid) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger small mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('is-invalid');
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    
    return isValid;
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation téléphone
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// État de chargement
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';
        submitBtn.disabled = true;
    }
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = 'Envoyer le message';
        submitBtn.disabled = false;
    }
}

// Messages de notification
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Supprimer les anciennes notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustement pour la navbar fixe
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation des cartes au hover
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.region-card, .service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Effet parallaxe sur le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Lazy loading des images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialisation du lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Performance: Debounce pour les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimisation des événements de scroll
const debouncedScrollHandler = debounce(function() {
    // Code d'optimisation du scroll
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
