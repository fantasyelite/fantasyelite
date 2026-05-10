
/* ===========================
   FANTASY ELITE — JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Age Verification Gate ===
    const ageGate = document.getElementById('ageGate');
    const ageAccept = document.getElementById('ageAccept');
    const ageDeny = document.getElementById('ageDeny');

    // Check if already verified this session
    if (sessionStorage.getItem('ageVerified') === 'true') {
        ageGate.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        document.body.style.overflow = 'hidden';
    }

    ageAccept.addEventListener('click', () => {
        sessionStorage.setItem('ageVerified', 'true');
        ageGate.classList.add('hidden');
        document.body.style.overflow = '';
    });

    ageDeny.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => preloader.classList.add('hidden'), 800);
    }

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // === Mobile Menu ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Scroll Reveal Animation ===
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === Animated Counter ===
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(eased * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // === Form Handling ===
    const customForm = document.getElementById('customForm');
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    function showModal() {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeModal.addEventListener('click', hideModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) hideModal();
    });

    // Custom Fantasy Form
    customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(customForm);
        const data = Object.fromEntries(formData);
        
        // Validate consent
        if (!document.getElementById('consent').checked) {
            alert('Debes confirmar que eres mayor de edad.');
            return;
        }

        // Simulate sending (replace with actual backend)
        const submitBtn = customForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            showModal();
            customForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // Contact Form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!document.getElementById('cAge').checked) {
            alert('Debes confirmar que eres mayor de edad.');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            showModal();
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // === Parallax Hero Image ===
    const heroBgImg = document.querySelector('.hero-bg-img');
    
    if (heroBgImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBgImg.style.transform = `scale(${1.05 + scrolled * 0.0003}) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // === Service Cards - Tilt Effect ===
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (window.innerWidth > 768) {
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // === Keyboard - Close menu on Escape ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (successModal.classList.contains('active')) {
                hideModal();
            }
        }
    });

});
