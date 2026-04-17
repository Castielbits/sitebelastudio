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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

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
            window.open(`https://wa.me/5531988633814?text=${encodeURIComponent(msg)}`, '_blank');
            const successEl = document.getElementById('formSuccess');
            if (successEl) {
                successEl.classList.add('visible');
                this.reset();
            }
        });
    }



    // ── Gallery Carousel ──
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryDotsContainer = document.getElementById('galleryDots');

    if (galleryTrack && galleryDotsContainer) {
        const gallerySlides = [...galleryTrack.querySelectorAll('.gallery-carousel-slide')];
        const totalSlides = gallerySlides.length;
        let galleryCurrent = 0;
        let galleryAutoplayId = null;

        function getVisibleCount() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function getMaxIndex() {
            return Math.max(0, totalSlides - getVisibleCount());
        }

        function buildDots() {
            galleryDotsContainer.innerHTML = '';
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('button');
                dot.className = 'gallery-dot';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    stopGalleryAutoplay();
                    galleryGoTo(i);
                    startGalleryAutoplay();
                });
                galleryDotsContainer.appendChild(dot);
            }
        }

        function updateGalleryDots() {
            const dots = galleryDotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === galleryCurrent));
        }

        function galleryGoTo(index) {
            const maxIdx = getMaxIndex();
            galleryCurrent = Math.max(0, Math.min(index, maxIdx));
            const slidePercent = 100 / getVisibleCount();
            galleryTrack.style.transform = `translateX(-${galleryCurrent * slidePercent}%)`;
            updateGalleryDots();
        }

        function startGalleryAutoplay() {
            galleryAutoplayId = setInterval(() => {
                const maxIdx = getMaxIndex();
                galleryGoTo(galleryCurrent >= maxIdx ? 0 : galleryCurrent + 1);
            }, 4000);
        }

        function stopGalleryAutoplay() {
            clearInterval(galleryAutoplayId);
        }



        // Touch/drag support
        let gDragStartX = null;
        const stage = galleryTrack.parentElement;

        stage.addEventListener('touchstart', e => {
            gDragStartX = e.touches[0].clientX;
            galleryTrack.style.transition = 'none';
        }, { passive: true });

        stage.addEventListener('touchend', e => {
            if (gDragStartX === null) return;
            const dx = e.changedTouches[0].clientX - gDragStartX;
            gDragStartX = null;
            galleryTrack.style.transition = '';
            if (Math.abs(dx) > 40) {
                stopGalleryAutoplay();
                galleryGoTo(galleryCurrent + (dx < 0 ? 1 : -1));
                startGalleryAutoplay();
            } else {
                galleryGoTo(galleryCurrent);
            }
        });

        // Mouse support for desktop
        stage.addEventListener('mousedown', e => {
            gDragStartX = e.clientX;
            galleryTrack.style.transition = 'none';
        });

        const handleMouseUp = (e) => {
            if (gDragStartX === null) return;
            const dx = e.clientX - gDragStartX;
            gDragStartX = null;
            galleryTrack.style.transition = '';
            if (Math.abs(dx) > 40) {
                stopGalleryAutoplay();
                galleryGoTo(galleryCurrent + (dx < 0 ? 1 : -1));
                startGalleryAutoplay();
            } else {
                galleryGoTo(galleryCurrent);
            }
        };

        stage.addEventListener('mouseup', handleMouseUp);
        stage.addEventListener('mouseleave', handleMouseUp);

        window.addEventListener('resize', () => {
            buildDots();
            galleryGoTo(Math.min(galleryCurrent, getMaxIndex()));
        }, { passive: true });

        buildDots();
        galleryGoTo(0);
        startGalleryAutoplay();
    }

    // ── Reviews Carousel ──
    const rcTrack = document.getElementById('rcTrack');
    const rcStage = document.getElementById('rcStage');
    if (rcTrack && rcStage) {
        const rcCards   = [...rcTrack.querySelectorAll('.review-card')];
        const rcDots    = [...document.querySelectorAll('.rc-dot')];
        const rcPrev    = document.getElementById('rcPrev');
        const rcNext    = document.getElementById('rcNext');
        const total     = rcCards.length;
        let current     = 0;
        let autoplayId  = null;

        function getCardWidth() {
            return rcCards[0].offsetWidth + 28; // card + gap
        }

        function updateCarousel() {
            const cardW     = getCardWidth();
            const stageW    = rcStage.offsetWidth;
            const offset    = stageW / 2 - rcCards[0].offsetWidth / 2 - current * cardW;
            rcTrack.style.transform = `translateX(${offset}px)`;

            rcCards.forEach((card, i) => {
                card.classList.remove('rc-active', 'rc-adjacent');
                const diff = Math.abs(i - current);
                if (diff === 0) card.classList.add('rc-active');
                else if (diff === 1) card.classList.add('rc-adjacent');
            });

            rcDots.forEach((dot, i) => dot.classList.toggle('active', i === current));
        }

        function goTo(index) {
            current = (index + total) % total;
            updateCarousel();
        }

        function startAutoplay() {
            autoplayId = setInterval(() => goTo(current + 1), 5000);
        }
        function stopAutoplay() { clearInterval(autoplayId); }

        rcPrev.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
        rcNext.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
        rcDots.forEach((dot, i) => dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));

        // Click on side cards advances the carousel
        rcCards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (i !== current) { stopAutoplay(); goTo(i); startAutoplay(); }
            });
        });

        // Pause autoplay on hover
        rcStage.addEventListener('mouseenter', stopAutoplay);
        rcStage.addEventListener('mouseleave', startAutoplay);

        // Touch / drag support (pointer events — funciona em touch e mouse)
        let dragStartX = null;
        let dragStartY = null;
        let isDraggingH = false;

        rcStage.addEventListener('pointerdown', e => {
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            isDraggingH = false;
            rcTrack.style.transition = 'none';
            rcStage.setPointerCapture(e.pointerId);
        });

        rcStage.addEventListener('pointermove', e => {
            if (dragStartX === null) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;

            // Decide direção na primeira movimentação significativa
            if (!isDraggingH && Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            if (!isDraggingH) {
                if (Math.abs(dx) < Math.abs(dy)) { dragStartX = null; return; } // scroll vertical — abandona
                isDraggingH = true;
            }

            e.preventDefault();
            const cardW  = getCardWidth();
            const stageW = rcStage.offsetWidth;
            const base   = stageW / 2 - rcCards[0].offsetWidth / 2 - current * cardW;
            rcTrack.style.transform = `translateX(${base + dx}px)`;
        }, { passive: false });

        rcStage.addEventListener('pointerup', e => {
            if (dragStartX === null) return;
            const dx = e.clientX - dragStartX;
            dragStartX = null;
            isDraggingH = false;
            rcTrack.style.transition = '';
            if (Math.abs(dx) > 50) { stopAutoplay(); goTo(current + (dx < 0 ? 1 : -1)); startAutoplay(); }
            else updateCarousel();
        });

        rcStage.addEventListener('pointercancel', () => {
            dragStartX = null;
            isDraggingH = false;
            rcTrack.style.transition = '';
            updateCarousel();
        });

        // Recalculate on resize
        window.addEventListener('resize', updateCarousel, { passive: true });

        goTo(0);
        startAutoplay();
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
                    if (!counter.hasAttribute('data-target')) return;
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

    // Instagram embeds — força o processamento dos blockquotes
    function processInstagramEmbeds() {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            return true;
        }
        return false;
    }

    if (!processInstagramEmbeds()) {
        let igAttempts = 0;
        const igInterval = setInterval(() => {
            igAttempts++;
            if (processInstagramEmbeds() || igAttempts > 50) {
                clearInterval(igInterval);
            }
        }, 250);
    }

    // Google Review Counters Animation
    const googleReviewCounters = document.querySelectorAll('.google-review-counter');
    if (googleReviewCounters.length > 0) {
        const reviewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const target = +entry.target.getAttribute('data-target');
                    let current = 0;
                    const updateCount = () => {
                        const inc = target / 30; // aprox 30 frames
                        current += inc;
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current);
                            setTimeout(updateCount, 40);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    
                    let delay = 300;
                    // Se estiver no topo da página, agurada a tela de abertura (splash) passar (+- 3.5s)
                    if (entry.target.closest('#home') || entry.target.closest('.header')) {
                        delay = 3500;
                    }
                    setTimeout(updateCount, delay);
                }
            });
        }, { threshold: 0.1 });
        
        googleReviewCounters.forEach(counter => {
            reviewObserver.observe(counter);
        });
    }
});
