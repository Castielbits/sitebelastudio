document.addEventListener('DOMContentLoaded', () => {
    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
        }, { passive: true });
    }

    // Custom Cursor (only on devices with fine pointer)
    if (window.matchMedia('(pointer: fine)').matches) {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');

        if (dot && ring) {
            let ringX = 0, ringY = 0;
            let mouseX = 0, mouseY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX + 'px';
                dot.style.top  = mouseY + 'px';
            }, { passive: true });

            // Ring follows with smooth lag
            (function animateRing() {
                ringX += (mouseX - ringX) * 0.12;
                ringY += (mouseY - ringY) * 0.12;
                ring.style.left = ringX + 'px';
                ring.style.top  = ringY + 'px';
                requestAnimationFrame(animateRing);
            })();

            // Expand on interactive elements
            const hoverTargets = document.querySelectorAll('a, button, [role="button"]');
            hoverTargets.forEach(el => {
                el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
                el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
            });
        }
    }

    // Intro Splash Screen
    const splash = document.getElementById('introSplash');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hide');
            splash.addEventListener('transitionend', () => {
                splash.remove();
            });
        }, 3000);
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileToggle && desktopNav) {
        mobileToggle.addEventListener('click', () => {
            desktopNav.style.display = desktopNav.style.display === 'block' ? 'none' : 'block';
            desktopNav.classList.toggle('active');
        });

        // Fecha o menu ao clicar em qualquer link
        desktopNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                desktopNav.style.display = 'none';
                desktopNav.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .ig-embed-wrapper');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Testimonials Carousel
    const track = document.getElementById('review-track');
    if (track) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        const totalCards = track.children.length;
        
        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            // Fecha todos
            document.querySelectorAll('.faq-question').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.classList.remove('open');
            });
            // Abre o clicado (se estava fechado)
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                btn.nextElementSibling.classList.add('open');
            }
        });
    });

    // Contact Form — redirect to WhatsApp with pre-filled message
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value.trim();
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const msg = `Olá! Me chamo ${name} e gostaria de agendar uma avaliação. Meu telefone: ${phone}`;
            window.open(`https://wa.me/553182230326?text=${encodeURIComponent(msg)}`, '_blank');
            const successEl = document.getElementById('formSuccess');
            if (successEl) {
                successEl.classList.add('visible');
                this.reset();
            }
        });
    }

    // Draggable Gallery Grid
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        galleryGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - galleryGrid.offsetLeft;
            scrollLeft = galleryGrid.scrollLeft;
        });

        galleryGrid.addEventListener('mouseleave', () => {
            isDown = false;
        });

        galleryGrid.addEventListener('mouseup', () => {
            isDown = false;
        });

        galleryGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryGrid.offsetLeft;
            const walk = (x - startX) * 2; // scroll speed multiplier
            galleryGrid.scrollLeft = scrollLeft - walk;
        });
    }

    // Animated Numbers Counter
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        let animated = false;
        const counters = document.querySelectorAll('.stat-number');
        const speed = 150; 

        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
            }
        }, { threshold: 0.5 });
        
        counterObserver.observe(statsSection);
    }
});
