document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const envelopeCover = document.getElementById('envelope-cover');
    const mainContent = document.getElementById('main-content');
    const particlesContainer = document.getElementById('particles');
    
    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isMusicPlaying = false;

    // Create background particles
    createParticles(particlesContainer, 25);

    // Initial interactions setup
    openBtn.addEventListener('click', () => {
        // Trigger Confetti
        fireConfetti();

        // Fade out envelope
        envelopeCover.classList.add('fade-out');

        // Play music
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicBtn.classList.remove('hidden');
            musicBtn.classList.add('playing');
        }).catch((err) => {
            console.log("Audio play prevented by browser, waiting for user interaction.", err);
            musicBtn.classList.remove('hidden');
            musicBtn.classList.add('paused');
        });

        // Show main content after a small delay
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            // Trigger intersection observer after content is visible
            initScrollAnimations();
            // Start countdown
            initCountdown();
        }, 800);
    });

    // Music Toggle
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.classList.add('paused');
            isMusicPlaying = false;
        } else {
            bgMusic.play();
            musicBtn.classList.remove('paused');
            musicBtn.classList.add('playing');
            isMusicPlaying = true;
        }
    });

    // --- Confetti Logic ---
    function fireConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ['#f3c6bd', '#e2a99d', '#ffd700'];

        (function frame() {
            confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 1000 });
            confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 1000 });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // --- Background Particles ---
    function createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 4 + 2; 
            const left = Math.random() * 100; 
            const delay = Math.random() * 10; 
            const duration = Math.random() * 12 + 10; 

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            container.appendChild(particle);
        }
    }

    // --- Scroll Reveal Animations ---
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealOnScroll.observe(el));
        
        // Ensure first card is active immediately
        setTimeout(() => {
            if(revealElements.length > 0) revealElements[0].classList.add('active');
        }, 100);
    }

    // --- Countdown Timer Logic ---
    function initCountdown() {
        // --- AQUÍ CAMBIAS LA FECHA DE TU FIESTA ---
        // Formato: "YYYY-MM-DDTHH:mm:ss"
        // Ejemplo: 29 de Junio del 2026 a las 16:00 (4:00 PM)
        const targetDate = new Date("2026-06-29T16:00:00");

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days < 10 ? "0" + days : days;
            hoursEl.innerText = hours < 10 ? "0" + hours : hours;
            minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
        }

        setInterval(updateTimer, 1000);
        updateTimer();
    }
});
