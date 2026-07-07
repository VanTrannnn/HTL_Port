// === HUMADA'S STORIES: nội dung được tách riêng ra file project-humada.html ===
// File này chỉ lo việc: tải nội dung khi cần, mở/đóng modal ảnh, và chạy slider.
// Lưu ý: fetch() cần trang được mở qua http/https (vd: `npx serve`, GitHub Pages...),
// mở trực tiếp bằng file:// trên một số trình duyệt sẽ chặn fetch nội dung local.

let humadaLoaded = false;

async function loadHumadaContent() {
    if (humadaLoaded) return;
    const container = document.getElementById('view-project-humada');
    if (!container) return;

    try {
        const res = await fetch('project-humada.html');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        container.innerHTML = await res.text();
        humadaLoaded = true;

        // Đưa modal ảnh ra làm con trực tiếp của <body> để tránh bị kẹt/clip
        // bởi các ancestor có overflow-hidden / filter / transform (vd: hiệu ứng CRT).
        const hm = document.getElementById('humadaModal');
        if (hm && hm.parentElement !== document.body) {
            document.body.appendChild(hm);
        }

        initHumadaSlider();
    } catch (err) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-10 gap-3">
                <p class="text-red-400 text-sm">Không tải được nội dung "Humada's Stories".</p>
                <p class="text-gray-500 text-xs">Hãy mở trang này qua một local server (không mở trực tiếp bằng file://).</p>
            </div>`;
        console.error('Failed to load project-humada.html', err);
    }
}

// Tự tải nội dung ngay khi người dùng chuyển sang view này
document.addEventListener('viewchange', (e) => {
    if (e.detail && e.detail.id === 'view-project-humada') {
        loadHumadaContent();
    }
});

function scrollThumbSlider(id, delta) {
    const el = document.getElementById(id);
    if (el) el.scrollBy({ left: delta, behavior: 'smooth' });
}

function openHumadaModal(imgEl) {
    const modal = document.getElementById('humadaModal');
    if (!modal) return;
    document.getElementById('humadaModalImg').src = imgEl.src;
    document.getElementById('humadaModalImg').alt = imgEl.alt;
    document.getElementById('humadaModalTitle').textContent = imgEl.dataset.title || imgEl.alt;
    document.getElementById('humadaModalContent').textContent = imgEl.dataset.content || '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeHumadaModal() {
    const modal = document.getElementById('humadaModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function initHumadaSlider() {
    const humadaView = document.querySelector('.humada-view-slider');
    if (!humadaView) return;

    const trackV = humadaView.querySelector('.humada-view-track');
    const slidesV = Array.from(humadaView.querySelectorAll('.humada-view-slide'));
    const prevV = humadaView.querySelector('.humada-view-prev');
    const nextV = humadaView.querySelector('.humada-view-next');
    const dotsV = humadaView.querySelector('.humada-view-dots');
    let activeV = 0;

    function updateHumadaView(index) {
        activeV = ((index % slidesV.length) + slidesV.length) % slidesV.length;
        trackV.style.transform = `translateX(-${activeV * 100}%)`;
        dotsV.querySelectorAll('.humada-view-dot').forEach((dot, di) => {
            dot.classList.toggle('active', di === activeV);
        });
    }

    slidesV.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'humada-view-dot';
        dot.addEventListener('click', () => updateHumadaView(i));
        dotsV.appendChild(dot);
    });

    prevV.addEventListener('click', () => updateHumadaView(activeV - 1));
    nextV.addEventListener('click', () => updateHumadaView(activeV + 1));

    updateHumadaView(0);

    // Autoplay: chuyển ảnh mỗi 3.5s, dừng khi hover/chạm
    let humadaViewAutoplay = null;
    function startHumadaViewAutoplay() {
        stopHumadaViewAutoplay();
        humadaViewAutoplay = setInterval(() => updateHumadaView(activeV + 1), 3500);
    }
    function stopHumadaViewAutoplay() {
        if (humadaViewAutoplay) {
            clearInterval(humadaViewAutoplay);
            humadaViewAutoplay = null;
        }
    }

    humadaView.addEventListener('mouseenter', stopHumadaViewAutoplay);
    humadaView.addEventListener('mouseleave', startHumadaViewAutoplay);
    humadaView.addEventListener('touchstart', stopHumadaViewAutoplay, { passive: true });
    humadaView.addEventListener('touchend', () => { setTimeout(startHumadaViewAutoplay, 1200); }, { passive: true });

    startHumadaViewAutoplay();
}

window.openHumadaModal = openHumadaModal;
window.closeHumadaModal = closeHumadaModal;
window.scrollThumbSlider = scrollThumbSlider;
