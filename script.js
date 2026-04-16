let apiKey = localStorage.getItem('lullaby_api_key') || '';
let nightMode = localStorage.getItem('lullaby_night_mode') === 'true';
let autoRedirect = localStorage.getItem('lullaby_auto_redirect') === 'true';
let immersiveMode = localStorage.getItem('lullaby_immersive') !== 'false';
let isPlaying = false;
let isLoading = false;
let settingsOpen = false;
let videoId = null;
let videoTitle = '';
let videoChannel = '';
let timerMinutes = 0;
let timerEnd = null;
let timerInterval = null;

const RELAXATION_TERMS = [
    'rain sounds', 'thunderstorm', 'ocean waves', 'forest ambience',
    'campfire crackling', 'fireplace cozy', 'river stream', 'snow falling',
    'night crickets', 'waterfall sounds', 'birds chirping',
    'lo-fi beats', 'soft piano', 'ambient music', 'calm guitar',
    'asmr whisper', 'asmr soft spoken', 'asmr rain',
    'cozy cabin ambience', 'library study', 'train journey rain',
    'video essay', 'documentary', 'iceberg explained',
    'creepypasta narration', 'mystery story',
    'aquarium fish', 'northern lights timelapse'
];

const app = document.querySelector('#app');
const html = document.documentElement;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initParticles();
    
    html.setAttribute('data-theme', nightMode ? 'night' : 'light');
    const apiKeyInput = document.querySelector('#api-key-input');
    const toggleAutoRedirectEl = document.querySelector('#toggle-auto-redirect');
    const toggleImmersiveEl = document.querySelector('#toggle-immersive');
    apiKeyInput.value = apiKey;
    toggleAutoRedirectEl.checked = autoRedirect;
    toggleImmersiveEl.checked = immersiveMode;
    
    initEventListeners();
    initKeyboardShortcuts();
    addRandomRotations();
});

function initParticles() {
    const container = document.querySelector('#particles-container');
    const count = window.innerWidth < 768 ? 20 : 38;

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.classList.add('particle');

        const size = Math.random() * 6 + 3;
        const left = Math.random() * 100;
        const duration = Math.random() * 19 + 16;
        const delay = Math.random() * 20;

        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${left}%`;
        dot.style.animationDuration = `${duration}s`;
        dot.style.animationDelay = `${delay}s`;

        container.appendChild(dot);
    }
}

function initEventListeners() {
    const btnDream = document.querySelector('#btn-dream');
    const btnNextDream = document.querySelector('#btn-next-dream');
    const btnNextFloat = document.querySelector('#nextBtn');
    const searchInput = document.querySelector('#searchInput');
    const btnClearSearch = document.querySelector('#clearBtn');
    const btnNightMode = document.querySelector('#nightModeBtn');
    const btnSettings = document.querySelector('#settingsBtn');
    const btnCloseSettings = document.querySelector('#btn-close-settings');
    const overlay = document.querySelector('#overlay');
    const btnSaveKey = document.querySelector('#btn-save-key');
    const btnToggleKeyVis = document.querySelector('#btn-toggle-key-vis');
    const toggleAutoRedirectEl = document.querySelector('#toggle-auto-redirect');
    const toggleImmersiveEl = document.querySelector('#toggle-immersive');
    const btnBackHome = document.querySelector('#homeBtn');
    const btnCancelTimer = document.querySelector('#btn-cancel-timer');

    btnDream.addEventListener('click', findVideo);
    btnNextDream.addEventListener('click', findVideo);
    btnNextFloat.addEventListener('click', findVideo);

    searchInput.addEventListener('input', () => {
        btnClearSearch.classList.toggle('hidden', !searchInput.value);
    });

    btnClearSearch.addEventListener('click', () => {
        searchInput.value = '';
        btnClearSearch.classList.add('hidden');
        searchInput.focus();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            findVideo();
        }
    });

    btnNightMode.addEventListener('click', toggleNightMode);

    btnSettings.addEventListener('click', openSettings);
    btnCloseSettings.addEventListener('click', closeSettings);
    overlay.addEventListener('click', closeSettings);

    btnSaveKey.addEventListener('click', saveApiKey);
    btnToggleKeyVis.addEventListener('click', () => {
        const inp = document.querySelector('#api-key-input');
        inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    toggleAutoRedirectEl.addEventListener('change', () => {
        autoRedirect = toggleAutoRedirectEl.checked;
        localStorage.setItem('lullaby_auto_redirect', autoRedirect);
    });

    toggleImmersiveEl.addEventListener('change', () => {
        immersiveMode = toggleImmersiveEl.checked;
        localStorage.setItem('lullaby_immersive', immersiveMode);
        updateImmersive();
    });

    btnBackHome.addEventListener('click', goHome);

    const timerPresets = document.querySelectorAll('.timer-preset');
    timerPresets.forEach((btn) => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes, 10);
            setActiveTimerPreset(btn);
            startSleepTimer(minutes);
        });
    });

    btnCancelTimer.addEventListener('click', () => {
        startSleepTimer(0);
        const all = document.querySelectorAll('.timer-preset');
        all.forEach((b) => b.classList.remove('active'));
        if (all[0]) all[0].classList.add('active');
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
            e.preventDefault();
            findVideo();
        }

        if (e.code === 'KeyN') {
            toggleNightMode();
        }

        if (e.code === 'Escape') {
            if (settingsOpen) closeSettings();
            else if (isPlaying) goHome();
        }
    });
}

function addRandomRotations() {
    const title = document.querySelector('.hero-title');
    if (title) {
        const r = (Math.random() * 1.6 - 0.8).toFixed(2);
        title.style.transform = `rotate(${r}deg)`;
    }

    const notes = document.querySelectorAll('.project-badge, .mini-note');
    notes.forEach((el) => {
        const turn = (Math.random() * 3 - 1.5).toFixed(2);
        el.style.transform = `rotate(${turn}deg)`;
    });
}

async function findVideo() {
    if (isLoading) return;

    if (!apiKey) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `
            <i data-lucide="key-round" class="icon-sm toast-icon"></i>
            <span>Add a YouTube API key in the settings.</span>
        `;
        document.querySelector('#toast-container').appendChild(toast);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [toast] });
        }
        setTimeout(() => toast.remove(), 3800);
        
        openSettings();
        document.querySelector('#api-key-input').focus();
        return;
    }

    setLoading(true);

    try {
        const video = await getVideo();

        if (!video) {
            showToast('No results found. Try a different search term.', 'search-x');
            setLoading(false);
            return;
        }

        if (autoRedirect) {
            window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
            showToast('Opening YouTube...', 'external-link');
            setLoading(false);
            return;
        }

        showVideo(video);
    } catch (err) {
        console.log('Error:', err);
        showToast('Something went wrong. Please try again.', 'alert-triangle');
        setLoading(false);
    }
}

async function getVideo() {
    const searchInput = document.querySelector('#searchInput');
    const userQuery = searchInput.value.trim();
    const query = userQuery || pickRandom(RELAXATION_TERMS);
    const nowYear = new Date().getFullYear();
    const randomYear = 2010 + Math.floor(Math.random() * (nowYear - 2010));
    const randomMonth = Math.floor(Math.random() * 12);
    const publishedAfter = new Date(randomYear, randomMonth, 1).toISOString();
    const publishedBefore = new Date(randomYear, randomMonth + 3, 1).toISOString();

    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
        maxResults: '50',
        publishedAfter: publishedAfter,
        publishedBefore: publishedBefore,
        order: pickRandom(['relevance', 'date', 'viewCount', 'rating']),
        safeSearch: 'strict',
        key: apiKey,
    });
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?${params}`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return getVideoFallback(query);
    }

    const item = pickRandom(data.items);
    return {
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || '',
    };
}

async function getVideoFallback(query) {
    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
        maxResults: '25',
        order: pickRandom(['relevance', 'date', 'viewCount']),
        safeSearch: 'strict',
        key: apiKey,
    });
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?${params}`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
        return null;
    }

    const item = pickRandom(data.items);
    return {
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || '',
    };
}

let ytPlayer = null;

window.onYouTubeIframeAPIReady = function () {
    console.log('YouTube IFrame API ready');
};

function showVideo(video) {
    videoId = video.id;
    videoTitle = video.title;
    videoChannel = video.channel;
    isPlaying = true;

    const videoTitleEl = document.querySelector('#video-title');
    const videoChannelEl = document.querySelector('#video-channel');
    const btnYoutubeLink = document.querySelector('#btn-youtube-link');
    const heroSection = document.querySelector('#hero-section');
    const videoSection = document.querySelector('#video-section');

    videoTitleEl.textContent = decodeHtmlEntities(video.title);
    videoChannelEl.textContent = video.channel;
    btnYoutubeLink.href = `https://www.youtube.com/watch?v=${video.id}`;

    heroSection.classList.add('hidden');
    videoSection.classList.remove('hidden');

    if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById(video.id);
    } else {
        ytPlayer = new YT.Player('yt-player', {
            videoId: video.id,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
                fs: 1,
                playsinline: 1,
                origin: window.location.origin,
            },
            events: {
                onReady: (event) => event.target.playVideo(),
                onStateChange: onPlayerStateChange,
                onError: onPlayerError,
            },
        });
    }

    updateImmersive();
    setLoading(false);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        findVideo();
    }
}

function onPlayerError(event) {
    console.log('Player error:', event.data);
    if (event.data === 2 || event.data === 100 || event.data === 150 || event.data === 153) {
        showToast('Video unavailable, drawing another...', 'alert-circle');
        setTimeout(() => findVideo(), 1000);
    }
}

function goHome() {
    isPlaying = false;
    videoId = null;

    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        ytPlayer.stopVideo();
    }

    const videoSection = document.querySelector('#video-section');
    const heroSection = document.querySelector('#hero-section');

    videoSection.classList.add('hidden');
    heroSection.classList.remove('hidden');
    app.classList.remove('immersive-active');
}

function toggleNightMode() {
    nightMode = !nightMode;
    html.setAttribute('data-theme', nightMode ? 'night' : 'light');
    localStorage.setItem('lullaby_night_mode', nightMode);

    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (nightMode) {
        toast.innerHTML = `
            <i data-lucide="moon" class="icon-sm toast-icon"></i>
            <span>Night mode is on.</span>
        `;
    } else {
        toast.innerHTML = `
            <i data-lucide="sun" class="icon-sm toast-icon"></i>
            <span>Light mode is on.</span>
        `;
    }
    document.querySelector('#toast-container').appendChild(toast);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [toast] });
    }
    setTimeout(() => toast.remove(), 3800);
}

function openSettings() {
    settingsOpen = true;

    const settingsPanel = document.querySelector('#settings-panel');
    const overlay = document.querySelector('#overlay');

    settingsPanel.classList.remove('hidden');
    settingsPanel.offsetHeight;
    settingsPanel.classList.add('visible');

    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
}

function closeSettings() {
    settingsOpen = false;

    const settingsPanel = document.querySelector('#settings-panel');
    const overlay = document.querySelector('#overlay');

    settingsPanel.classList.remove('visible');
    overlay.classList.remove('visible');

    setTimeout(() => {
        settingsPanel.classList.add('hidden');
        overlay.classList.add('hidden');
    }, 600);
}

function saveApiKey() {
    const apiKeyInput = document.querySelector('#api-key-input');
    const key = apiKeyInput.value.trim();
    apiKey = key;
    localStorage.setItem('lullaby_api_key', key);

    if (key) {
        showToast('API key saved.', 'key-round');
    } else {
        showToast('API key cleared.', 'key-round');
    }
}

function startSleepTimer(minutes) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    timerMinutes = minutes;

    const sleepTimerDisplay = document.querySelector('#sleep-timer-display');
    const timerBadge = document.querySelector('#timer-badge');

    if (minutes === 0) {
        timerEnd = null;
        sleepTimerDisplay.classList.add('hidden');
        timerBadge.classList.add('hidden');
        return;
    }

    timerEnd = Date.now() + minutes * 60 * 1000;
    const totalMs = minutes * 60 * 1000;
    const circumference = 2 * Math.PI * 52;

    sleepTimerDisplay.classList.remove('hidden');
    timerBadge.classList.remove('hidden');

    showToast(`Timer set for ${minutes} min.`, 'timer');

    timerInterval = setInterval(() => {
        const remaining = timerEnd - Date.now();

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerEnd = null;
            timerMinutes = 0;

            sleepTimerDisplay.classList.add('hidden');
            timerBadge.classList.add('hidden');

            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
                ytPlayer.pauseVideo();
            }

            showToast('The timer has gone off. Sweet dreams.', 'moon');
            return;
        }

        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const timerCountdown = document.querySelector('#timer-countdown');
        const timerBadgeText = document.querySelector('#timer-badge-text');
        const timerRingProgress = document.querySelector('#timer-ring-progress');

        timerCountdown.textContent = timeStr;
        timerBadgeText.textContent = timeStr;

        const elapsed = totalMs - remaining;
        const progress = elapsed / totalMs;
        const offset = circumference * (1 - progress);
        timerRingProgress.style.strokeDashoffset = offset;
    }, 1000);
}

function setActiveTimerPreset(activeBtn) {
    const presets = document.querySelectorAll('.timer-preset');
    presets.forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');
}

function updateImmersive() {
    if (immersiveMode && isPlaying) {
        app.classList.add('immersive-active');
    } else {
        app.classList.remove('immersive-active');
    }
}

function setLoading(loading) {
    isLoading = loading;
    const btnDream = document.querySelector('#btn-dream');
    btnDream.classList.toggle('loading', loading);

    const label = btnDream.querySelector('.btn-dream-label');
    if (label) {
        label.textContent = loading ? 'Searching...' : 'Draw';
    }
}

function showToast(message, iconName = 'info') {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="icon-sm toast-icon"></i>
        <span>${message}</span>
    `;

    const toastContainer = document.querySelector('#toast-container');
    toastContainer.appendChild(toast);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [toast] });
    }

    setTimeout(() => {
        toast.remove();
    }, 3800);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function decodeHtmlEntities(text) {
    const ta = document.createElement('textarea');
    ta.innerHTML = text;
    return ta.value;
}
