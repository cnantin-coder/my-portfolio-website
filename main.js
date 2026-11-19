/**
 * Shared site-wide utilities for navigation, active link states,
 * image fallback handling, floating music player, and currency formatting.
 */

const MUSIC_CONFIG = {
  src: 'audio/NaParaBang.mp3',
  title: 'Na Para Bang - Mariah Deborah',
  artist: "Cassandra's Playlist",
  defaultVolume: 0.65,
  storageKey: 'portfolio_music_volume',
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  highlightActiveNavigation();
  initImageFallbacks();
  updateFooterYear();
  initFloatingMusicPlayer();
});

/**
 * Toggles the responsive mobile navigation drawer.
 */
function initMobileNavigation() {
  const toggleButton = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (!toggleButton || !mobileDrawer) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobileDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Marks the current navigation link as active based on the URL filename.
 */
function highlightActiveNavigation() {
  const path = window.location.pathname;
  const currentFile = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  const assignmentPages = [
    'assignments.html',
    'assignment1.html',
    'assignment2.html',
    'assignment3.html',
    'assignment4.html',
  ];

  document.querySelectorAll('[data-nav-target]').forEach((link) => {
    const target = link.getAttribute('data-nav-target');
    const isMatch =
      target === currentFile ||
      (target === 'assignments.html' && assignmentPages.includes(currentFile));

    if (isMatch) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Provides graceful fallback rendering if an image fails to load.
 */
function initImageFallbacks() {
  document.querySelectorAll('.portrait-frame img').forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.closest('.portrait-frame');
      if (frame) {
        frame.classList.add('is-broken');
      }
    });
  });
}

/**
 * Updates the copyright year automatically if #current-year exists.
 */
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/**
 * Creates and controls the shared fixed pink floating music player across all pages.
 * Never autoplays; playback starts strictly on user click.
 */
function initFloatingMusicPlayer() {
  if (document.getElementById('floating-music-widget')) {
    return;
  }

  let savedVolume = MUSIC_CONFIG.defaultVolume;
  try {
    const stored = window.localStorage.getItem(MUSIC_CONFIG.storageKey);
    if (stored !== null) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
        savedVolume = parsed;
      }
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }

  const audio = document.createElement('audio');
  audio.src = MUSIC_CONFIG.src;
  audio.loop = true;
  audio.preload = 'metadata';
  audio.volume = savedVolume;

  const widget = document.createElement('aside');
  widget.id = 'floating-music-widget';
  widget.className = 'music-widget';
  widget.setAttribute('aria-label', 'Background Music Player');

  widget.innerHTML = `
    <div id="music-player-card" class="music-card" role="region" aria-label="Now Playing Controls">
      <div class="music-card-top">
        <div class="music-meta">
          <p id="music-status-text" class="music-status">Paused</p>
          <p class="music-title"></p>
          <p class="music-artist"></p>
        </div>
        <button
          type="button"
          id="music-card-close"
          class="music-close"
          aria-label="Minimize music details"
          title="Minimize"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="music-volume-row">
        <button
          type="button"
          id="music-mute-btn"
          class="music-mute-btn"
          aria-label="Mute or unmute volume"
          title="Mute / Unmute"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
        <label for="music-volume-slider" class="sr-only">Music Volume</label>
        <input
          type="range"
          id="music-volume-slider"
          class="music-volume-slider"
          min="0"
          max="1"
          step="0.05"
          value="${savedVolume}"
        />
        <span id="music-volume-value" class="music-volume-value tabular">${Math.round(savedVolume * 100)}%</span>
      </div>
    </div>

    <button
      type="button"
      id="music-toggle-btn"
      class="music-fab"
      aria-label="Play background music"
      aria-pressed="false"
      title="Play music"
    >
      <svg class="icon-music" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <svg class="icon-pause" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1.2"></rect>
        <rect x="14" y="5" width="4" height="14" rx="1.2"></rect>
      </svg>
    </button>
  `;

  widget.querySelector('.music-title').textContent = MUSIC_CONFIG.title;
  widget.querySelector('.music-artist').textContent = MUSIC_CONFIG.artist;

  document.body.appendChild(audio);
  document.body.appendChild(widget);

  const toggleBtn = document.getElementById('music-toggle-btn');
  const card = document.getElementById('music-player-card');
  const closeBtn = document.getElementById('music-card-close');
  const statusText = document.getElementById('music-status-text');
  const muteBtn = document.getElementById('music-mute-btn');
  const volumeSlider = document.getElementById('music-volume-slider');
  const volumeValue = document.getElementById('music-volume-value');

  let lastNonZeroVolume = savedVolume > 0 ? savedVolume : MUSIC_CONFIG.defaultVolume;

  function syncPlayerUI(isPlaying) {
    toggleBtn.classList.toggle('is-playing', isPlaying);
    toggleBtn.setAttribute('aria-pressed', String(isPlaying));
    toggleBtn.setAttribute(
      'aria-label',
      isPlaying ? 'Pause background music' : 'Play background music'
    );
    toggleBtn.title = isPlaying ? 'Pause music' : 'Play music';
    statusText.textContent = isPlaying ? 'Now Playing' : 'Paused';
  }

  function updateVolume(newVol) {
    const clamped = Math.max(0, Math.min(1, Number(newVol)));
    audio.volume = clamped;
    audio.muted = clamped === 0;
    volumeSlider.value = String(clamped);
    volumeValue.textContent = `${Math.round(clamped * 100)}%`;

    if (clamped > 0) {
      lastNonZeroVolume = clamped;
    }

    try {
      window.localStorage.setItem(MUSIC_CONFIG.storageKey, String(clamped));
    } catch {
      // Ignore storage errors
    }
  }

  toggleBtn.addEventListener('click', () => {
    card.classList.add('is-open');

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          syncPlayerUI(true);
        })
        .catch(() => {
          statusText.textContent = 'Audio unavailable';
          syncPlayerUI(false);
        });
    } else {
      audio.pause();
      syncPlayerUI(false);
    }
  });

  closeBtn.addEventListener('click', () => {
    card.classList.remove('is-open');
  });

  volumeSlider.addEventListener('input', (event) => {
    updateVolume(event.target.value);
  });

  muteBtn.addEventListener('click', () => {
    if (audio.volume === 0 || audio.muted) {
      updateVolume(lastNonZeroVolume);
    } else {
      updateVolume(0);
    }
  });

  audio.addEventListener('pause', () => syncPlayerUI(false));
  audio.addEventListener('play', () => syncPlayerUI(true));
}

/**
 * Formats a numeric value in Philippine Peso (₱).
 * Keeps exact integer amounts clean (e.g. ₱14,000) and displays 2 decimals when fractional.
 * @param {number} amount
 * @returns {string}
 */
window.formatPeso = function formatPeso(amount) {
  const hasDecimals = Math.abs(amount - Math.round(amount)) > 1e-6;
  const formatted = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `₱${formatted}`;
};

/**
 * Helper to show or clear a validation error box.
 * @param {HTMLElement | null} element
 * @param {string} message
 */
window.setFeedbackError = function setFeedbackError(element, message) {
  if (!element) return;
  if (message) {
    element.textContent = message;
    element.classList.add('is-visible');
  } else {
    element.textContent = '';
    element.classList.remove('is-visible');
  }
};
