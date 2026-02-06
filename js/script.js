// Game state
let noCount = 0;
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionCard = document.getElementById('question-card');
const successCard = document.getElementById('success-card');

const phrases = [
    "No 😢",
    "¿Estás segura?",
    "¿De verdad?",
    "¡Piénsalo bien!",
    "¡Mira que lloro!",
    "¡Me estás rompiendo el corazón! 💔",
    "¡No seas mala!",
    "¡Va, di que sí!",
    "¡Por favor! 🥺",
    "¡No tienes opción! 😈"
];

// Event Listeners
noBtn.addEventListener('click', handleNoInteraction);
yesBtn.addEventListener('click', handleYesClick);

function handleNoInteraction() {
    noCount++;

    // Reverted to font-size (Physical Growth) as requested.
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);

    // Dynamic Max Size to prevent breaking mobile layout
    const isMobile = window.innerWidth < 768;
    const maxSize = isMobile ? 35 : 60; // Stricter cap on mobile

    if (currentSize < maxSize) {
        // Slower growth factor on mobile to make it last longer without breaking
        const growthFactor = isMobile ? 1.1 : 1.2;
        const newSize = Math.min(currentSize * growthFactor, maxSize);
        yesBtn.style.fontSize = `${newSize}px`;
    }

    // Change text of No button
    const index = Math.min(noCount, phrases.length - 1);
    noBtn.textContent = phrases[index];
}

function handleYesClick() {
    launchConfetti();
    questionCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    startCarouselAutoPlay();
}

// --- CLUE / HINT LOGIC ---
window.toggleHint = function (card, secretText, titleText) {
    if (card.classList.contains('active')) {
        card.classList.remove('active');
        const textEl = card.querySelector('.hint-text');
        textEl.textContent = titleText;
        textEl.style.color = "var(--primary-color)";
        return;
    }
    document.querySelectorAll('.hint-card').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.title) {
            const t = c.querySelector('.hint-text');
            t.textContent = c.dataset.title;
            t.style.color = "";
        }
    });
    card.classList.add('active');
    const textEl = card.querySelector('.hint-text');
    textEl.style.opacity = '0';
    setTimeout(() => {
        textEl.textContent = secretText;
        textEl.style.color = "#800f2f";
        textEl.style.opacity = '1';
    }, 150);
}

// --- CAROUSEL LOGIC ---
let currentSlide = 0;
let autoPlayInterval;

window.moveCarousel = function (direction) {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startCarouselAutoPlay() {
    autoPlayInterval = setInterval(() => {
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 3000);
}

// Confetti & Hearts
function launchConfetti() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff3366', '#ff85a1', '#ffffff'] });
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff3366', '#ff85a1', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff3366', '#ff85a1', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function createHearts() {
    const bg = document.querySelector('.background-hearts');
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-bg');
        heart.innerHTML = ['❤️', '💖', '🌹', '🥰'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        bg.appendChild(heart);
    }
}
createHearts();

// --- NEW ENHANCEMENTS ---

// 1. Loading Screen
window.addEventListener('load', () => {
    // Force scroll to top on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-hidden');

            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// 2. Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

// 3. Heart Trail
let lastHeartTime = 0;

function createTrailHeart(x, y) {
    const now = Date.now();
    if (now - lastHeartTime < 150) return;
    lastHeartTime = now;

    const heart = document.createElement('div');
    heart.classList.add('trail-heart');
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const randomX = (Math.random() - 0.5) * 20;
    heart.style.transform = `translate(-50%, -50%) translate(${randomX}px, 0)`;

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Desktop
document.addEventListener('click', (e) => {
    createTrailHeart(e.clientX, e.clientY);
});

// Mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createTrailHeart(touch.clientX, touch.clientY);
});
