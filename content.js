/* ==========================================================
   ROMANTIC ANNIVERSARY WEBSITE - APP LOGIC & ENGINE
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STATE & CONSTANTS
    // ==========================================
    const START_DATE = new Date("2022-06-18T00:00:00+05:30"); // Relationship start
    
    // Typewriter content for final message
    const FINAL_LETTER_TEXT = `My dearest Munmun,

Thank you for every single smile,
every contagious laugh,
and every beautiful moment we have shared.

These past four years have been the happiest chapters of my life. Walking side by side with you has taught me the true meaning of warmth, kindness, and devotion.

You are my today, my tomorrow, and my forever.

Happy 4th Anniversary, my love. ❤️`;

    // ==========================================
    // 2. NIGHT SKY CANVAS ENGINE
    // ==========================================
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let clouds = [];
    let petals = [];
    let hearts = [];
    let fireworks = [];
    let skyAnimationActive = true;
    let fireworksActive = false;
    let petalDensityMultiplier = 1; // Doubles on proposal success

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
        initClouds();
    }
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars
    function initStars() {
        stars = [];
        const starCount = Math.floor((canvas.width * canvas.height) / 8000);
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.7), // mostly top 70% of screen
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                blinkSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    // Initialize clouds
    function initClouds() {
        clouds = [];
        const cloudCount = 4;
        for (let i = 0; i < cloudCount; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.45) + 50,
                width: Math.random() * 200 + 150,
                height: Math.random() * 80 + 40,
                speedX: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.06 + 0.03
            });
        }
    }

    // Spawn falling flower petal
    function spawnPetal() {
        if (petals.length > 40 * petalDensityMultiplier) return;
        petals.push({
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 1.0 + 0.8,
            speedX: Math.random() * 0.5 + 0.2, // drifts right
            angle: Math.random() * Math.PI * 2,
            spinSpeed: Math.random() * 0.02 - 0.01,
            swayRange: Math.random() * 2 + 1,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayOffset: Math.random() * Math.PI
        });
    }

    // Spawn floating heart
    function spawnHeart() {
        if (hearts.length > 25) return;
        hearts.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            size: Math.random() * 10 + 6,
            speedY: Math.random() * 0.8 + 0.4,
            speedX: Math.random() * 0.3 - 0.15,
            swing: Math.random() * 3 + 2,
            swingSpeed: Math.random() * 0.015 + 0.005,
            angle: Math.random() * Math.PI,
            opacity: Math.random() * 0.3 + 0.15
        });
    }

    // Draw bezier heart
    function drawHeart(x, y, size, fillStyle, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        ctx.fillStyle = fillStyle;
        ctx.shadowColor = fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }

    // Spawn firework
    function triggerFireworkBlast() {
        const x = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
        const y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.15);
        const colors = ['#ff5c8a', '#ff0054', '#ffd700', '#d694ff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particles = [];
        const particleCount = Math.floor(Math.random() * 40) + 40;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 4.5 + 1.5;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.008
            });
        }
        
        fireworks.push({ particles, color });
    }

    // Main animation loop
    function renderSky() {
        if (!skyAnimationActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Twinkling Stars
        stars.forEach(star => {
            star.alpha += star.blinkSpeed;
            if (star.alpha > 0.95 || star.alpha < 0.05) {
                star.blinkSpeed = -star.blinkSpeed;
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Draw Clouds
        clouds.forEach(cloud => {
            cloud.x += cloud.speedX;
            if (cloud.x - cloud.width > canvas.width) {
                cloud.x = -cloud.width;
            }
            
            ctx.save();
            ctx.globalAlpha = cloud.opacity;
            const grad = ctx.createRadialGradient(
                cloud.x + cloud.width/2, cloud.y + cloud.height/2, 10,
                cloud.x + cloud.width/2, cloud.y + cloud.height/2, cloud.width/2
            );
            grad.addColorStop(0, '#ffb6c1');
            grad.addColorStop(0.5, '#2d1b4e');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(cloud.x + cloud.width/2, cloud.y + cloud.height/2, cloud.width/2, cloud.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // 3. Draw Falling Petals
        if (Math.random() < 0.07 * petalDensityMultiplier) spawnPetal();
        petals.forEach((petal, index) => {
            petal.y += petal.speedY;
            petal.x += petal.speedX + Math.sin(petal.y * petal.swaySpeed + petal.swayOffset) * 0.4;
            petal.angle += petal.spinSpeed;

            if (petal.y > canvas.height + 20 || petal.x > canvas.width + 20) {
                petals.splice(index, 1);
                return;
            }

            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.angle);
            ctx.fillStyle = '#ffb6c1';
            ctx.shadowColor = '#ff758f';
            ctx.shadowBlur = 4;
            
            // Draw simple organic petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // 4. Draw Floating Hearts
        if (Math.random() < 0.04) spawnHeart();
        hearts.forEach((heart, index) => {
            heart.y -= heart.speedY;
            heart.angle += heart.swingSpeed;
            heart.x += heart.speedX + Math.sin(heart.angle) * 0.25;

            if (heart.y < -20 || heart.x < -20 || heart.x > canvas.width + 20) {
                hearts.splice(index, 1);
                return;
            }

            drawHeart(heart.x, heart.y, heart.size, '#ffb6c1', heart.opacity);
        });

        // 5. Draw Fireworks (on success)
        if (fireworksActive) {
            if (Math.random() < 0.04) triggerFireworkBlast();
            fireworks.forEach((fw, fwIndex) => {
                let particlesActive = false;
                
                fw.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.04; // gravity pull
                    p.alpha -= p.decay;
                    
                    if (p.alpha > 0) {
                        particlesActive = true;
                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = fw.color;
                        ctx.shadowColor = fw.color;
                        ctx.shadowBlur = 6;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                });

                if (!particlesActive) {
                    fireworks.splice(fwIndex, 1);
                }
            });
        }

        requestAnimationFrame(renderSky);
    }

    // Initialize Canvas sizes initially
    resizeCanvas();
    renderSky();

    // ==========================================
    // 3. BACKGROUND MUSIC (SYNTHESIZER)
    // ==========================================
    let audioCtx = null;
    let masterGain = null;
    let synthPlaying = false;
    let currentNoteIndex = 0;
    let synthTimeout = null;
    let musicVolume = 0.08; // Soft initial volume

    const noteFreqs = {
        'C3': 130.81, 'E3': 164.81, 'G3': 196.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
    };

    const romanticMelody = [
        { note: 'G4', dur: 1.2 }, { note: 'B4', dur: 1.2 }, { note: 'D5', dur: 1.2 }, { note: 'G5', dur: 2.4 },
        { note: 'E4', dur: 1.2 }, { note: 'G4', dur: 1.2 }, { note: 'C5', dur: 1.2 }, { note: 'E5', dur: 2.4 },
        { note: 'F4', dur: 1.2 }, { note: 'A4', dur: 1.2 }, { note: 'C5', dur: 1.2 }, { note: 'F5', dur: 2.4 },
        { note: 'D4', dur: 1.2 }, { note: 'F4', dur: 1.2 }, { note: 'A4', dur: 1.2 }, { note: 'D5', dur: 2.4 },
        { note: 'E4', dur: 1.2 }, { note: 'G4', dur: 1.2 }, { note: 'B4', dur: 1.2 }, { note: 'E5', dur: 2.4 }
    ];

    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
    }

    function playSynthNote() {
        if (!synthPlaying) return;

        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const noteObj = romanticMelody[currentNoteIndex];
        const freq = noteFreqs[noteObj.note] || 440;
        
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        const attack = 0.2;
        const decay = 0.3;
        const release = noteObj.dur - attack - decay + 0.8;

        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.5, now + attack);
        oscGain.gain.exponentialRampToValueAtTime(0.25, now + attack + decay);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay + release);

        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.35, now + attack);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + noteObj.dur);

        osc.connect(oscGain);
        subOsc.connect(subGain);
        oscGain.connect(filter);
        subGain.connect(filter);
        filter.connect(masterGain);

        osc.start(now);
        osc.stop(now + noteObj.dur + 1.0);
        subOsc.start(now);
        subOsc.stop(now + noteObj.dur + 1.0);

        currentNoteIndex = (currentNoteIndex + 1) % romanticMelody.length;
        bounceVisualizer();

        synthTimeout = setTimeout(playSynthNote, noteObj.dur * 1000);
    }

    function bounceVisualizer() {
        const spans = document.querySelectorAll('#music-visualizer span');
        spans.forEach(span => {
            span.style.animationDuration = (Math.random() * 0.5 + 0.3) + 's';
        });
    }

    function toggleSynth() {
        const visualizer = document.getElementById('music-visualizer');
        const musicBtn = document.getElementById('btn-music-toggle');
        
        if (synthPlaying) {
            synthPlaying = false;
            clearTimeout(synthTimeout);
            visualizer.classList.remove('active');
            musicBtn.querySelector('i').className = "fa-solid fa-volume-xmark";
        } else {
            synthPlaying = true;
            initAudio();
            playSynthNote();
            visualizer.classList.add('active');
            musicBtn.querySelector('i').className = "fa-solid fa-music";
        }
    }
    document.getElementById('btn-music-toggle').addEventListener('click', toggleSynth);

    // ==========================================
    // 4. SPLASH SCREEN & ENTRANCE GATES
    // ==========================================
    const splashScreen = document.getElementById('splash-screen');
    const musicContainer = document.getElementById('music-container');
    const mainContent = document.getElementById('main-content');

    let journeyStarted = false;

    function startJourney() {
        if (journeyStarted) return;
        journeyStarted = true;

        // Init music
        synthPlaying = true;
        initAudio();
        playSynthNote();
        
        // Show portal and animate it
        const portal = document.getElementById('heart-portal-overlay');
        const portalHeart = portal.querySelector('.portal-heart');
        portal.classList.remove('hidden');
        
        // Initial setup for GSAP animation
        gsap.set(portal, { opacity: 1 });
        gsap.set(portalHeart, { scale: 0, opacity: 1, rotation: 0 });
        
        // Timeline for the romantic portal zoom
        const tl = gsap.timeline({
            onComplete: () => {
                portal.classList.add('hidden');
            }
        });
        
        // Zoom heart and rotate it
        tl.to(portalHeart, {
            scale: 70,
            rotation: 360,
            duration: 1.6,
            ease: "power2.inOut"
        });
        
        // As the heart fills the screen, reveal the content
        tl.to(splashScreen, {
            opacity: 0,
            duration: 0.5
        }, "-=0.8");
        
        // Fade out the portal to show the main page
        tl.to(portal, {
            opacity: 0,
            duration: 0.6
        }, "-=0.4");

        // Reveal the main contents slightly before portal fades out completely
        setTimeout(() => {
            musicContainer.classList.remove('hidden');
            mainContent.classList.remove('hidden');
            document.getElementById('music-visualizer').classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            splashScreen.classList.add('hidden');
            
            // Start typewriter for Hero title
            typewriteHeroTitle();
            // Bind GSAP ScrollTriggers
            initGSAPScrollTriggers();
            // Start Letter Observer
            observeLetterSection();
            
            // Grand Heart Confetti Spray!
            if (typeof confetti !== 'undefined') {
                const duration = 2.5 * 1000;
                const end = Date.now() + duration;
                
                (function frame() {
                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.8 },
                        colors: ['#ff5c8a', '#ff0054', '#ffd700']
                    });
                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.8 },
                        colors: ['#ff5c8a', '#ff0054', '#ffd700']
                    });
                    
                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
        }, 900);
    }

    splashScreen.addEventListener('click', startJourney);
    splashScreen.addEventListener('touchstart', startJourney, { passive: true });

    // Typewriter effect for Hero Title
    const HERO_TITLE_TEXT = "Happy Anniversary My Love ❤️";
    function typewriteHeroTitle() {
        const titleEl = document.getElementById('hero-title');
        let index = 0;
        
        function type() {
            if (index <= HERO_TITLE_TEXT.length) {
                titleEl.textContent = HERO_TITLE_TEXT.substring(0, index);
                index++;
                setTimeout(type, 80 + Math.random() * 40);
            } else {
                // Animate subtitles and button fade in
                gsap.to('#hero-subtitle', { opacity: 1, duration: 1 });
                gsap.to('.scroll-btn', { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
            }
        }
        type();
    }

    // ==========================================
    // 5. GSAP SCROLLTRIGGER BINDINGS
    // ==========================================
    function initGSAPScrollTriggers() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Section Title Reveal
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // Timeline slide-in animations
        document.querySelectorAll('.timeline-item').forEach(item => {
            const isLeft = item.classList.contains('left-item');
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            });
            
            // Set initial state
            gsap.set(item, {
                x: isLeft ? -80 : 80,
                opacity: 0
            });
        });

        // Polaroid frames slide-up
        gsap.from('.polaroid-frame', {
            scrollTrigger: {
                trigger: '.masonry-gallery',
                start: 'top 75%'
            },
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Reason Cards zoom-in
        gsap.from('.reason-card-wrapper', {
            scrollTrigger: {
                trigger: '.reasons-grid',
                start: 'top 80%'
            },
            scale: 0.75,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: 'back.out(1.5)'
        });
    }

    // ==========================================
    // 6. POLAROID GALLERY LIGHTBOX
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.polaroid-frame').forEach(frame => {
        frame.addEventListener('click', () => {
            const imgSrc = frame.getAttribute('data-src');
            const imgCap = frame.getAttribute('data-caption');
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = imgCap;
            lightboxModal.classList.add('active');
        });
    });

    function closeLightbox() {
        lightboxModal.classList.remove('active');
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    // ==========================================
    // 7. LOVE COUNTER ENGINE
    // ==========================================
    const valYears = document.getElementById('count-years');
    const valMonths = document.getElementById('count-months');
    const valDays = document.getElementById('count-days');
    const valHours = document.getElementById('count-hours');
    const valMinutes = document.getElementById('count-minutes');
    const valSeconds = document.getElementById('count-seconds');

    function updateCounter() {
        const now = new Date();
        const diffMs = now.getTime() - START_DATE.getTime();

        const diffSeconds = Math.floor(diffMs / 1000);
        
        // Approximate calculation for beautiful display
        const totalDays = Math.floor(diffSeconds / (3600 * 24));
        const years = Math.floor(totalDays / 365.25);
        const remainingDaysAfterYears = Math.floor(totalDays % 365.25);
        const months = Math.floor(remainingDaysAfterYears / 30.44);
        const days = Math.floor(remainingDaysAfterYears % 30.44);
        
        const hours = Math.floor((diffSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;

        valYears.textContent = years;
        valMonths.textContent = months;
        valDays.textContent = days;
        valHours.textContent = hours < 10 ? '0' + hours : hours;
        valMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
        valSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Tick counter
    setInterval(updateCounter, 1000);
    updateCounter();

    // ==========================================
    // 8. REASONS WHY I LOVE YOU (FLIP CARDS)
    // ==========================================
    document.querySelectorAll('.reason-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // ==========================================
    // 9. LOVE LETTERS (ENVELOPES)
    // ==========================================
    document.querySelectorAll('.envelope').forEach(env => {
        env.addEventListener('click', (e) => {
            // If already open, clicking inside the sheet doesn't close
            if (env.classList.contains('open') && e.target.closest('.letter-sheet')) {
                return;
            }
            env.classList.toggle('open');
        });
    });

    // ==========================================
    // 10. MOVIE REEL SLIDESHOW (ROMANTIC VIDEO PLAYER)
    // ==========================================
    const movieSlides = document.querySelectorAll('.movie-slide');
    const btnMoviePrev = document.getElementById('btn-movie-prev');
    const btnMovieNext = document.getElementById('btn-movie-next');
    const btnMoviePlay = document.getElementById('btn-movie-play');
    
    let currentMovieIndex = 0;
    let moviePlaying = true;
    let movieInterval = null;

    function showSlide(index) {
        movieSlides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentMovieIndex = (currentMovieIndex + 1) % movieSlides.length;
        showSlide(currentMovieIndex);
    }

    function prevSlide() {
        currentMovieIndex = (currentMovieIndex - 1 + movieSlides.length) % movieSlides.length;
        showSlide(currentMovieIndex);
    }

    function startMovieTimer() {
        movieInterval = setInterval(nextSlide, 3500);
    }

    function stopMovieTimer() {
        clearInterval(movieInterval);
    }

    btnMovieNext.addEventListener('click', () => {
        prevNextAction(nextSlide);
    });

    btnMoviePrev.addEventListener('click', () => {
        prevNextAction(prevSlide);
    });

    function prevNextAction(action) {
        action();
        if (moviePlaying) {
            stopMovieTimer();
            startMovieTimer();
        }
    }

    btnMoviePlay.addEventListener('click', () => {
        if (moviePlaying) {
            moviePlaying = false;
            stopMovieTimer();
            btnMoviePlay.querySelector('i').className = "fa-solid fa-play";
        } else {
            moviePlaying = true;
            nextSlide();
            startMovieTimer();
            btnMoviePlay.querySelector('i').className = "fa-solid fa-pause";
        }
    });

    // Auto-start slideshow
    startMovieTimer();

    // ==========================================
    // 11. SURPRISE GIFT BOX
    // ==========================================
    const giftBox = document.getElementById('gift-box-el');
    const giftMsg = document.getElementById('gift-msg-el');
    let giftOpened = false;

    giftBox.addEventListener('click', () => {
        if (giftOpened) return;
        giftOpened = true;
        
        giftBox.classList.add('open');
        
        // Staggered reveal of message panel
        setTimeout(() => {
            giftMsg.classList.remove('hidden');
        }, 300);

        // Confetti burst
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.75 },
                colors: ['#ff5c8a', '#ff0054', '#ffd700']
            });
        }
    });

    // ==========================================
    // 12. FINAL LETTER TYPEWRITER
    // ==========================================
    let finalLetterTyped = false;

    function observeLetterSection() {
        const letterSection = document.getElementById('proposal-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !finalLetterTyped) {
                    finalLetterTyped = true;
                    setTimeout(typewriteFinalMessage, 400);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(letterSection);
    }

    function typewriteFinalMessage() {
        const msgEl = document.getElementById('final-message-text');
        let index = 0;
        msgEl.innerHTML = '';

        function type() {
            if (index < FINAL_LETTER_TEXT.length) {
                const char = FINAL_LETTER_TEXT.charAt(index);
                if (char === '\n') {
                    msgEl.appendChild(document.createElement('br'));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    msgEl.appendChild(span);
                }
                index++;
                const speed = char === ',' || char === '.' ? 250 : 35 + Math.random() * 20;
                setTimeout(type, speed);
            } else {
                // Letter completes, reveal glowing heart Proposal button
                document.getElementById('proposal-action-block').classList.remove('hidden');
            }
        }
        type();
    }

    // ==========================================
    // 13. PROPOSAL FINAL SUCCESS
    // ==========================================
    const btnProposal = document.getElementById('btn-proposal');
    const proposalSuccessOverlay = document.getElementById('proposal-success-overlay');

    btnProposal.addEventListener('click', () => {
        // Activate full screen fireworks
        fireworksActive = true;
        // Double petal fall density
        petalDensityMultiplier = 3.5;
        
        // Volume swell
        if (masterGain) {
            masterGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 3.0);
        }

        // Show proposal overlay
        proposalSuccessOverlay.classList.remove('hidden');
        setTimeout(() => {
            proposalSuccessOverlay.classList.add('active');
        }, 100);

        // Stagger continuous side confetti blasts
        let duration = 15 * 1000;
        let animationEnd = Date.now() + duration;
        let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        let interval = setInterval(function() {
            let timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            let particleCount = 50 * (timeLeft / duration);
            // double confetti splash
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    });

    // ==========================================
    // 14. CUSTOM CURSOR & HEART TRAIL SPAWNER
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 45; // trail spacing

    // Tracks mouse positions
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.music-btn') || e.target.closest('.polaroid-frame') || e.target.closest('.reason-card') || e.target.closest('.envelope') || e.target.closest('#gift-box-el')) {
            return;
        }

        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (dist > distanceThreshold) {
            createTrailHeart(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // Spawns floating trail heart particle
    function createTrailHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'trail-heart-particle';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        const trailEmojis = ['❤️', '💖', '💝', '💕', '✨', '🌸', '💫'];
        heart.innerText = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
        
        // Random drift direction and rotation
        const xOffset = (Math.random() - 0.5) * 50; 
        const yOffset = -(Math.random() * 60 + 35); 
        const rot = (Math.random() - 0.5) * 80;
        
        heart.style.setProperty('--x-offset', `${xOffset}px`);
        heart.style.setProperty('--y-offset', `${yOffset}px`);
        heart.style.setProperty('--rot-offset', `${rot}deg`);
        
        document.body.appendChild(heart);
        
        // Remove particle after float completes
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    // Interactive general touch/click particle spawner
    function createClickHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'click-heart-particle';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // Random paths
        const xOffset = (Math.random() - 0.5) * 120; 
        const yOffset = -(Math.random() * 120 + 80); 
        const rot = (Math.random() - 0.5) * 80;      
        
        heart.style.setProperty('--x-offset', `${xOffset}px`);
        heart.style.setProperty('--y-offset', `${yOffset}px`);
        heart.style.setProperty('--rot-offset', `${rot}deg`);
        
        heart.innerHTML = '❤️';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }

    // Click handler for mouse
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.music-btn') || e.target.closest('.polaroid-frame') || e.target.closest('.reason-card') || e.target.closest('.envelope') || e.target.closest('#gift-box-el')) return;
        createClickHeart(e.clientX, e.clientY);
    });

    // Touch handler for mobile trail & tap particles
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.music-btn') || e.target.closest('.polaroid-frame') || e.target.closest('.reason-card') || e.target.closest('.envelope') || e.target.closest('#gift-box-el')) return;
        const touch = e.touches[0];
        
        const dist = Math.hypot(touch.clientX - lastX, touch.clientY - lastY);
        if (dist > distanceThreshold) {
            createTrailHeart(touch.clientX, touch.clientY);
            lastX = touch.clientX;
            lastY = touch.clientY;
        }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.music-btn') || e.target.closest('.polaroid-frame') || e.target.closest('.reason-card') || e.target.closest('.envelope') || e.target.closest('#gift-box-el')) return;
        const touch = e.touches[0];
        createClickHeart(touch.clientX, touch.clientY);
    }, { passive: true });

});
