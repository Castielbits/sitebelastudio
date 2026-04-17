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

    // ── Reviews Data (Google Reviews — Bela Studio) ──
    const reviewsData = [
        { author: "Edmar Alves", date: "há 1 ano", rating: 5, text: "Super recomendo esse Studio! A Isabella (Bella) é uma profissional muito competente e super dedicada, atendimento super gentil de toda equipe e adora celebrar e cativar seus clientes com mimos em datas comemorativas, aniversários, eventos para saúde e bem estar. Além de oferecer o serviço de Pilates têm parcerias com profissionais de nutrição, massagistas, entre outros que fazem atendimentos agendados no local. Super indico e sou muito grato a Bela e às meninas por todo trabalho comigo em mais de 3 anos, onde pude melhorar muito minhas dores lombares e desenvolver meu equilíbrio e fortalecimento de corpo e mente. Gratidão!" },
        { author: "Davi Ladislau Ferreira", date: "há 1 ano", rating: 5, text: "Adorei a minha experiência no Bela Studio Pilates e Reabilitação! Desde o primeiro dia, fui recebido com um sorriso caloroso e uma energia super positiva. O ambiente é limpo, aconchegante e perfeito para relaxar e se concentrar nos exercícios. Os instrutores são incrivelmente atenciosos e realmente entendem das necessidades individuais de cada aluno. Sabem como motivar e adaptar as aulas para todos os níveis. É um lugar maravilhoso! Impossível sair de lá sem se sentir renovado e mais leve." },
        { author: "Tarley Lana", date: "há 1 ano", rating: 5, text: "Estou extremamente satisfeito com minha experiência no Bela Studio de Pilates e Reabilitação. Minha condição física melhorou muito. Antes de começar, sofria bastante com dores durante as corridas, mas desde que iniciei o Pilates, essas dores praticamente desapareceram. Toda a equipe é extremamente atenciosa e dedicada. Recomendo o Bela Studio a todos que desejam melhorar sua saúde!" },
        { author: "Felipe Pedrosa", date: "há 1 ano", rating: 5, text: "Doze meses. Esse é o tempo em que estou sendo assistido pelo Espaço Bela Studio e Pilates. Premiado com duas hérnias de disco, a atividade é um remédio que eu não deixo de usar. No estúdio, com ótimas profissionais, esse remédio deixou de ser amargo para se tornar prazeroso. Obrigado, equipe!" },
        { author: "João Guimarães", date: "há 1 ano", rating: 5, text: "Bem impressionado nestes quase dois meses que pratico pilates na Bela Studio. Muito profissionalismo e comprometimento de toda equipe. Agradeço a Isabela, Fernanda, Ana e Bruna pelo carinho e dedicação." },
        { author: "Clô Guimarães", date: "há 1 ano", rating: 5, text: "Apesar de ter começado a fazer pilates há quase dois meses, já posso dizer com convicção que essa clínica é de ótima qualidade, com uma equipe excelente e um ambiente muito agradável!!! Estou amando!!! 🥰" },
        { author: "Gabriela Mendes Felisberto", date: "há 1 ano", rating: 5, text: "Super recomendo o Bela Studio, ambiente agradável, acolhedor, e profissionais capacitadas para nos atender. Confiei a recuperação da minha mãe nas profissionais e tenho visto resultados muito positivos." },
        { author: "Ana Sá", date: "há 1 ano", rating: 5, text: "Estou muito satisfeita tanto com as instalações quanto com as profissionais. São todos muito competentes e atenciosos. O espaço é perfeito para um atendimento personalizado." },
        { author: "Juliane Rezende", date: "há 1 ano", rating: 5, text: "Excelente ambiente, com profissionais maravilhosos! Cliente há mais de 5 anos, fiz o melhor investimento da minha vida, só tenho gratidão pelo atendimento, amizade, gentileza e atenção! Obrigada à equipe do Bela Studio Pilates e Reabilitação." },
        { author: "Sandro Pardini", date: "há 4 anos", rating: 5, text: "Profissionais competentes! Eu e minha família (minha esposa, filha e a nossa tia de 94 anos somos clientes) temos muito a agradecer pela dedicação, empenho e disposição para com todos nós. Muito obrigado!" },
        { author: "Elza Sabino Montalvão", date: "há 1 ano", rating: 5, text: "Muito satisfeita pelo atendimento que me foi dado na clínica, em especial meu agradecimento à Naiara que me atendeu com muita simpatia e competência." },
        { author: "Cristiana Pôssas", date: "há 2 anos", rating: 5, text: "O Studio Bela é ótimo! Amo o atendimento das fisioterapeutas! O cuidado e a competência são suas marcas registradas. Super recomendo! A nutricionista Aline também é maravilhosa! Muito atenciosa e sempre disposta a nos ajudar. Obtive ótimos resultados com as suas orientações!" },
        { author: "Flaviana Coelho", date: "há 3 anos", rating: 5, text: "Experiência incrível! Profissionais competentes, atenciosas e com escuta ativa! Minha família e eu temos muito a agradecer pela dedicação, empenho e disposição para com todas nós! Muito obrigada e em especial a você Bela, gratidão! ❤" },
        { author: "Jessica de Oliveira", date: "há 4 anos", rating: 5, text: "Bela e Mariana são profissionais excelentes, atenciosas e que estimulam a gente a dar o nosso melhor, sempre com muita segurança. O espaço é muito limpo, organizado e convidativo. Já fiz pilates em muitos lugares e cidades diferentes e, sem dúvida, tem sido minha melhor experiência até hoje. Super recomendo/adoro!!! ❤" },
        { author: "Jessica Kellen", date: "há 1 ano", rating: 5, text: "Se tem um espaço que faz o melhor para as suas clientes e parceiras é o Bela Studio, muito bem gerenciado e cuidado, indico sem pensar duas vezes!" },
        { author: "Lorena Sthefanie", date: "há 1 ano", rating: 5, text: "Um lugar aconchegante, lindo 😻😻😻 ótimos profissionais, principalmente a Isabela. Tenho um carinho enorme por ela. ❤️❤️" },
        { author: "Israel Lisboa", date: "há 1 ano", rating: 5, text: "Excelente! Ambiente aconchegante, profissionais excelentes! Recomendo demais! Parabéns pelo trabalho incrível de vocês!" },
        { author: "Francine Santana", date: "há 1 ano", rating: 5, text: "Espaço bem montado, com equipamentos novos, limpo, ambiente aconchegante e gostoso. Profissionais bem educados e atenciosos, energia boa." },
        { author: "Victor Rafael", date: "há 1 ano", rating: 5, text: "Excelente atendimento! Clínica muito organizada, aparelhos novos e bem conservados e excelentes profissionais!" },
        { author: "Magleyvison Gomes", date: "há 1 ano", rating: 5, text: "Local de fácil acesso e com ótima infraestrutura, equipamentos bem conservados e limpos! A equipe também é show de bola, super indico!" },
        { author: "Thalita Coutinho de Oliveira", date: "há 1 ano", rating: 5, text: "Profissionais competentes e atenciosos. Sempre comprometidos com o bem-estar de cada aluno." },
        { author: "Elaine Oliveira", date: "há 1 ano", rating: 3, text: "Avaliação feita e toda aula preciso contar minha avaliação para a instrutora." },
        { author: "Priscila Deise Pinto", date: "há 1 ano", rating: 5, text: "Recomendo o Bela Studio Fisioterapia, equipe com atendimento maravilhoso, atenciosas, que estão sempre buscando atendimento de qualidade, se atualizando!" },
        { author: "Karina Arruda da Cruz Avelar", date: "há 1 ano", rating: 5, text: "Muito bem atendida por todas as profissionais. Super recomendo!" },
        { author: "Cleuzimar Pereira", date: "há 1 ano", rating: 5, text: "Muito bom, ambiente tranquilo e muitos exercícios, para melhorar nossa qualidade de vida. Super indico." },
        { author: "Firminia Reis", date: "há 1 ano", rating: 5, text: "Atendimento excelente! O tratamento proposto pela Bela me proporcionou qualidade de vida! Gratidão!" },
        { author: "Bruna Ferreira", date: "há 1 ano", rating: 5, text: "A melhor clínica de fisioterapia e pilates de Contagem, excelência na estrutura e no atendimento, super indico!" },
        { author: "Iury Mendes", date: "há 1 ano", rating: 5, text: "Melhor lugar para fazer sua reabilitação de lesões e para relaxamento do estresse do dia a dia também!" },
        { author: "Ueriston Montalvão", date: "há 1 ano", rating: 5, text: "Excelente atendimento e serviço, estão todos de parabéns. Com certeza retornarei." },
        { author: "Cidinha Diniz", date: "há 1 ano", rating: 5, text: "Quando fiz pilates fui muito bem atendida pela Isabela." },
        { author: "Gisele de Lacerda", date: "há 1 ano", rating: 5, text: "A Bela e sua equipe são excelentes profissionais!" },
        { author: "Camila Lais Oliveira", date: "há 1 ano", rating: 5, text: "Excelente espaço, muito organizado, profissionais extremamente qualificados. Ótimo atendimento…" },
        { author: "Juliana Brito", date: "há 1 ano", rating: 5, text: "Profissionais educados, capacitados e ótimo espaço físico." },
        { author: "Andre Araújo", date: "há 1 ano", rating: 5, text: "Atendimento ótimo, profissionais de primeira qualidade, super indico." },
        { author: "Igor Hespanha", date: "há 1 ano", rating: 5, text: "Que atendimento brilhante, pessoas certas no lugar certo, completamente imprescindível e perfeito, com preço justo." },
        { author: "Ligia", date: "há 1 ano", rating: 5, text: "Ambiente agradável, com profissionais capacitados e atenciosos!" },
        { author: "Ana Carolina Vidal Torres", date: "há 1 ano", rating: 5, text: "Clínica excelente, atendimento maravilhoso e o pilates é de alta qualidade!!!" },
        { author: "Samuel Barreto", date: "há 1 ano", rating: 5, text: "Muito bom atendimento com excelentes profissionais!" },
        { author: "Verinaldo Firmino", date: "há 1 ano", rating: 5, text: "Profissionais SUPER capacitados. Ótimo atendimento." },
        { author: "Rachel Guimaraes", date: "há 2 anos", rating: 4, text: "Muito bem estruturado e profissionais gentis e atenciosos." },
        { author: "Ariane Correa", date: "há 1 ano", rating: 5, text: "Atendimento com excelência, profissionalismo, cuidado e carinho." },
        { author: "Mariangele Montalvão", date: "há 1 ano", rating: 5, text: "Eficiência e carisma, encantada com o atendimento da Naiara 😍." },
        { author: "Thiago Batista", date: "há 1 ano", rating: 5, text: "Clínica excelente, com ótimos profissionais." },
        { author: "Giazi Cavalcante", date: "há 3 anos", rating: 5, text: "Excelentes profissionais. Ambiente ótimo. Adoro." },
        { author: "Débora Novaes", date: "há 1 ano", rating: 5, text: "Atendimento com excelência. Super indico 😍" },
        { author: "Andrezão Trooper", date: "há 1 ano", rating: 5, text: "Excelente, atendimento espetacular." },
        { author: "Andreza Pires", date: "há 1 ano", rating: 5, text: "Profissional exímia, dedicada e apaixonada." },
        { author: "Vanessa Campos Lisboa", date: "há 1 ano", rating: 5, text: "Sucesso!" },
        { author: "Andre Rocha de Souza", date: "há 5 anos", rating: 5, text: "Ótimo!" },
        { author: "Patrícia Mendes", date: "há 1 ano", rating: 5, text: "Atendimento diferenciado." },
        { author: "Ednéia Machado", date: "há 3 semanas", rating: 5, text: "" },
        { author: "Jose Lima", date: "há 3 meses", rating: 5, text: "" },
        { author: "Anusca Dias", date: "há 1 ano", rating: 5, text: "" },
        { author: "Angelica Correa", date: "há 1 ano", rating: 5, text: "" },
        { author: "Carolina Mendes Bittencourt", date: "há 1 ano", rating: 5, text: "" },
        { author: "Thaissa Gonçalves", date: "há 1 ano", rating: 5, text: "" },
        { author: "Marcelo Cardoso", date: "há 1 ano", rating: 5, text: "" },
        { author: "Naiara Montalvão", date: "há 1 ano", rating: 5, text: "" },
        { author: "Eduardo Marzzo Gomes Ribeiro", date: "há 1 ano", rating: 5, text: "" },
        { author: "Mara Núbia Sabino Montalvão", date: "há 1 ano", rating: 5, text: "" },
        { author: "Gabriela Mendes e Silva", date: "há 1 ano", rating: 5, text: "" },
        { author: "J. Carpini", date: "há 1 ano", rating: 5, text: "" },
        { author: "Martha Flor", date: "há 1 ano", rating: 5, text: "" },
        { author: "Gleiciellen Fernandes", date: "há 1 ano", rating: 5, text: "" },
        { author: "Neide Pardinho", date: "há 1 ano", rating: 5, text: "" },
        { author: "Ana Carolina S. Barreto", date: "há 1 ano", rating: 5, text: "" },
        { author: "Gabriel Santos", date: "há 1 ano", rating: 5, text: "" },
        { author: "Natalia A. Gabriel", date: "há 1 ano", rating: 5, text: "" },
        { author: "Fabio Lucio Costa", date: "há 1 ano", rating: 5, text: "" },
        { author: "Erinelcia Mendonça", date: "há 2 anos", rating: 5, text: "" },
        { author: "Helbert Fernandes", date: "há 3 anos", rating: 5, text: "" },
        { author: "Renata Diniz", date: "há 3 anos", rating: 5, text: "" },
        { author: "Simone Nascimento", date: "há 5 anos", rating: 5, text: "" }
    ];

    function renderReviews() {
        const track = document.getElementById('rcTrack');
        if (!track) return;
        const palette = ['#00796B','#1565C0','#6A1B9A','#E65100','#2E7D32','#C2185B','#00838F','#4E342E','#4527A0','#B71C1C','#5D4037','#37474F','#AD1457','#283593','#0277BD','#558B2F','#EF6C00','#7B1FA2'];
        const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        track.innerHTML = reviewsData.map((r, i) => {
            const initial = r.author.trim().charAt(0).toUpperCase();
            const color = palette[i % palette.length];
            const rounded = Math.round(r.rating);
            const stars = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
            const subtitle = `Avaliação no Google · ${escape(r.date)}`;
            const body = r.text
                ? `<p class="rc-text">${escape(r.text)}</p>`
                : `<p class="rc-text rc-text-empty">Avaliou o Bela Studio com ${rounded} ${rounded === 1 ? 'estrela' : 'estrelas'}.</p>`;
            return `
                <div class="review-card">
                    <div class="rc-header">
                        <div class="rc-avatar" style="background:${color};">${escape(initial)}</div>
                        <div class="rc-info">
                            <strong>${escape(r.author)}</strong>
                            <span>${subtitle}</span>
                        </div>
                        <div class="rc-google-dot"><span style="color:#4285F4;font-weight:700;font-size:1rem;">G</span></div>
                    </div>
                    <div class="rc-stars">${stars}</div>
                    ${body}
                </div>
            `;
        }).join('');
    }
    renderReviews();

    // ── Reviews Carousel ──
    const rcTrack = document.getElementById('rcTrack');
    const rcStage = document.getElementById('rcStage');
    if (rcTrack && rcStage) {
        const rcCards   = [...rcTrack.querySelectorAll('.review-card')];
        const rcCounter = document.getElementById('rcCounter');
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

            if (rcCounter) rcCounter.textContent = `${current + 1} / ${total}`;
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
