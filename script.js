// === AUDIO SYSTEM (RETRO 8-BIT SOUNDS) ===
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration, vol) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function playHoverSound() {
    if (!audioCtx) return;
    playTone(440, 'square', 0.1, 0.02);
}

function playSelectSound() {
    initAudio();
    playTone(600, 'square', 0.1, 0.05);
    setTimeout(() => playTone(800, 'square', 0.15, 0.05), 100);
}

function playBackSound() {
    initAudio();
    playTone(300, 'sawtooth', 0.1, 0.05);
    setTimeout(() => playTone(200, 'sawtooth', 0.15, 0.05), 100);
}

function updateMusicIcon() {
    const icon = document.getElementById('music-icon');
    if (!icon) return;
    icon.className = isPlaying
        ? 'fas fa-volume-up text-white'
        : 'fas fa-volume-mute text-white';
}

function startBackgroundMusic() {
    if (musicStarted) return;

    musicStarted = true;
    bgm.volume = 0.05;
    bgm.play().then(() => {
        isPlaying = true;
        updateMusicIcon();
    }).catch(() => {
        isPlaying = false;
        updateMusicIcon();
    });
}

function toggleMusic() {
    if (!musicStarted) {
        startBackgroundMusic();
        return;
    }

    if (isPlaying) {
        bgm.pause();
        isPlaying = false;
    } else {
        bgm.play().catch(() => {});
        isPlaying = true;
    }
    updateMusicIcon();
}

const bgm = document.getElementById('bgm');
const icon = document.getElementById('music-icon');
let isPlaying = false;
let musicStarted = false;

function switchView(targetViewId, isBack = false) {
    if (isBack) {
        playBackSound();
    } else {
        playSelectSound();
    }

    const views = document.querySelectorAll('.game-view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.add('active');
        targetView.scrollTop = 0;
    }
}

const projectsData = {
    'parking-car': {
        title: 'Parking Car',
        badge: 'Pathfinding Puzzle',
        color: '#38bdf8',
        desc: 'Unity puzzle game where players draw paths to park cars while avoiding dynamic obstacles. 10 progressive levels designed with increasing difficulty. Implemented Line Renderer mechanics and complex collision logic.',
        video: './assets/VanPrj/parking/gameplay.mp4',
        images: ['./assets/VanPrj/parking/parking1.png', './assets/VanPrj/parking/parking2.png', './assets/VanPrj/parking/parking3.png'],
        links: `
            <a href="https://vantrannnn.itch.io/parking-car" target="_blank" class="text-xs font-bold text-black bg-[#38bdf8] px-4 py-2 rounded hover:bg-white transition-colors">PLAY GAME</a>
            <a href="https://github.com/VanTrannnn/ParkingCar" target="_blank" class="text-xs font-bold text-[#38bdf8] border border-[#38bdf8] px-4 py-2 rounded hover:bg-[#38bdf8] hover:text-black transition-colors">GITHUB</a>
        `
    },
    'ball-nim': {
        title: 'Ball Nim',
        badge: 'Logic Strategy',
        color: '#38bdf8',
        desc: 'Mathematical strategy game based on the classic Nim logic, challenging players to optimize moves and outsmart AI. Implemented an intelligent AI opponent utilizing the Nim-sum mathematical algorithm for three difficulty levels. Developed a responsive UI system with dynamic object scaling using Unity grid layout group to fit any quantity of items.',
        video: './assets/VanPrj/ballnim/gameplay.mp4',
        images: ['./assets/VanPrj/ballnim/nim1.png', './assets/VanPrj/ballnim/nim2.png', './assets/VanPrj/ballnim/nim3.png'],
        links: `
            <a href="https://vantrannnn.itch.io/ballnim" target="_blank" class="text-xs font-bold text-black bg-[#38bdf8] px-4 py-2 rounded hover:bg-white transition-colors">PLAY GAME</a>
            <a href="https://github.com/VanTrannnn/BallNim" target="_blank" class="text-xs font-bold text-[#38bdf8] border border-[#38bdf8] px-4 py-2 rounded hover:bg-[#38bdf8] hover:text-black transition-colors">GITHUB</a>
        `
    },
    'word-game': {
        title: 'Word Game',
        badge: 'Word Puzzle',
        color: '#38bdf8',
        isPortrait: true,
        desc: 'Mobile word-puzzle game inspired by Wordle, focusing on logic and vocabulary. Implemented 3-state word check (Green/Yellow/Gray). Features dynamic levels from a 5,757-word dictionary and in-game currency for hint system.',
        video: './assets/VanPrj/wordgame/gameplay.mp4',
        images: ['./assets/VanPrj/wordgame/word1.png', './assets/VanPrj/wordgame/word2.png', './assets/VanPrj/wordgame/word3.png'],
        links: `
            <a href="https://github.com/VanTrannnn/WordGame" target="_blank" class="text-xs font-bold text-[#38bdf8] border border-[#38bdf8] px-4 py-2 rounded hover:bg-[#38bdf8] hover:text-black transition-colors">GITHUB REPO</a>
        `
    },
    'grill-sort': {
        title: 'Grill Sort',
        badge: 'Sorting Puzzle (Prototype)',
        color: '#eab308',
        isPortrait: true,
        desc: 'A casual sorting puzzle game where players arrange ingredients on grilling skewers. Currently in active development, focusing on building core sorting algorithms, prototype mechanics, and optimizing drag-and-drop logic in Unity.',
        video: './assets/VanPrj/grillsort/gameplay.mp4',
        images: ['./assets/VanPrj/grillsort/grill1.png', './assets/VanPrj/grillsort/grill2.png'],
        links: `
            <span class="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded bg-gray-800/50 cursor-not-allowed">PLAY GAME (SOON)</span>
            <a href="https://github.com/VanTrannnn/" target="_blank" class="text-xs font-bold text-[#eab308] border border-[#eab308] px-4 py-2 rounded hover:bg-[#eab308] hover:text-black transition-colors">GITHUB REPO</a>
        `
    }
};

const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');

function openModal(projectId) {
    playSelectSound();

    const data = projectsData[projectId];
    if (!data) return;

    const badge = document.getElementById('modal-badge');
    badge.textContent = data.badge;
    badge.style.color = data.color;
    badge.style.borderColor = `${data.color}80`;
    badge.style.backgroundColor = `${data.color}33`;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').innerHTML = data.desc;
    document.getElementById('modal-links').innerHTML = data.links;

    const imgContainer = document.getElementById('modal-img-container');
    const thumbContainer = document.getElementById('modal-thumbnails');
    const isPortrait = data.isPortrait === true;

    imgContainer.innerHTML = '';

    const mainImg = document.createElement('img');
    mainImg.id = 'modal-main-img';

    if (isPortrait) {
        imgContainer.className = 'w-full h-[400px] md:h-[500px] bg-[#050505] rounded-lg border border-gray-700 overflow-hidden relative flex justify-center items-center';
        mainImg.className = 'h-full w-auto max-w-full object-contain transition-opacity duration-300';
    } else {
        imgContainer.className = 'w-full h-48 md:h-80 bg-black rounded-lg border border-gray-700 overflow-hidden relative flex justify-center items-center';
        mainImg.className = 'w-full h-full object-cover transition-opacity duration-300';
    }

    if (data.video) {
        const videoEl = document.createElement('video');
        videoEl.id = 'modal-main-video';
        videoEl.src = data.video;
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.muted = true;
        videoEl.loop = true;

        if (isPortrait) {
            videoEl.className = 'h-full w-auto max-w-full object-contain';
        } else {
            videoEl.className = 'w-full h-full object-cover';
        }

        imgContainer.appendChild(videoEl);
    } else {
        mainImg.src = data.images[0] || '';
        imgContainer.appendChild(mainImg);
    }

    thumbContainer.innerHTML = '';

    function setMainMedia(type, src) {
        imgContainer.innerHTML = '';
        if (type === 'video') {
            const videoEl = document.createElement('video');
            videoEl.src = src;
            videoEl.controls = true;
            videoEl.autoplay = true;
            if (isPortrait) {
                videoEl.className = 'h-full w-auto max-w-full object-contain transition-opacity duration-300';
            } else {
                videoEl.className = 'w-full h-full object-cover transition-opacity duration-300';
            }
            imgContainer.appendChild(videoEl);
        } else {
            mainImg.style.opacity = 0;
            imgContainer.appendChild(mainImg);
            setTimeout(() => {
                mainImg.src = src;
                mainImg.style.opacity = 1;
            }, 50);
        }
    }

    if (data.video) {
        const videoThumbContainer = document.createElement('div');
        videoThumbContainer.className = 'relative cursor-pointer group flex-shrink-0';

        const thumb = document.createElement('img');
        thumb.src = data.images[0] || 'https://placehold.co/100x100?text=Video';

        if (isPortrait) {
            thumb.className = `w-12 h-20 md:w-16 md:h-28 object-cover rounded border-2 transition-colors border-[${data.color}] opacity-80 group-hover:opacity-100`;
        } else {
            thumb.className = `w-20 h-14 md:w-24 md:h-16 object-cover rounded border-2 transition-colors border-[${data.color}] opacity-80 group-hover:opacity-100`;
        }
        thumb.style.borderColor = data.color;

        const playIcon = document.createElement('div');
        playIcon.className = 'absolute inset-0 flex items-center justify-center text-white drop-shadow-md text-xs md:text-sm';
        playIcon.innerHTML = '<i class="fa-solid fa-play"></i>';

        videoThumbContainer.appendChild(thumb);
        videoThumbContainer.appendChild(playIcon);

        videoThumbContainer.addEventListener('mouseenter', playHoverSound);
        videoThumbContainer.onclick = () => {
            playSelectSound();
            setMainMedia('video', data.video);

            Array.from(thumbContainer.querySelectorAll('img')).forEach(child => child.style.borderColor = '#374151');
            thumb.style.borderColor = data.color;
        };

        thumbContainer.appendChild(videoThumbContainer);
    }

    data.images.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;

        if (isPortrait) {
            thumb.className = `w-12 h-20 md:w-16 md:h-28 object-cover rounded cursor-pointer border-2 transition-colors hover:border-white ${(!data.video && index === 0) ? 'border-[' + data.color + ']' : 'border-gray-700'} flex-shrink-0`;
        } else {
            thumb.className = `w-20 h-14 md:w-24 md:h-16 object-cover rounded cursor-pointer border-2 transition-colors hover:border-white ${(!data.video && index === 0) ? 'border-[' + data.color + ']' : 'border-gray-700'} flex-shrink-0`;
        }

        if (!data.video && index === 0) thumb.style.borderColor = data.color;

        thumb.addEventListener('mouseenter', playHoverSound);

        thumb.onclick = () => {
            playSelectSound();
            setMainMedia('image', imgSrc);

            Array.from(thumbContainer.querySelectorAll('img')).forEach(child => child.style.borderColor = '#374151');
            thumb.style.borderColor = data.color;
        };
        thumbContainer.appendChild(thumb);
    });

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeModal(event) {
    if (!event || event.target === modal || !event.target.closest('#modal-content')) {
        playBackSound();

        modal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

window.switchView = switchView;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMusic = toggleMusic;

document.addEventListener('DOMContentLoaded', () => {
    updateMusicIcon();
    document.addEventListener('click', startBackgroundMusic, { once: true });
    document.addEventListener('touchstart', startBackgroundMusic, { once: true });

    document.body.addEventListener('click', initAudio, { once: true });

    document.querySelectorAll('div[onclick*="openModal("], div[onclick*="switchView(\'view-project-humada\'"]')
        .forEach(card => {
            card.classList.add('project-card');
            card.classList.toggle('p1', !card.closest('#view-p2') && !card.closest('#view-all-projects')?.classList.contains('p2'));

            card.addEventListener('click', (event) => {
                card.classList.add('is-selected');
                clearTimeout(card._selectedTimer);
                card._selectedTimer = setTimeout(() => card.classList.remove('is-selected'), 700);

                const ripple = document.createElement('span');
                ripple.className = 'project-card-ripple';
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 1.25;
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                card.appendChild(ripple);
                setTimeout(() => ripple.remove(), 650);
            });
        });

    const hoverElements = document.querySelectorAll('.nav-tab, .player-card, .cursor-pointer, .btn-back, a, button');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        if (modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    }
});