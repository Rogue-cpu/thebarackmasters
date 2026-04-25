// Play main menu music until a battle is started
let mainMenuMusic;
let musicStarted = false;
const AUDIO_SETTINGS_KEY = 'bm_audio_settings';

function getMenuMusicVolume() {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!raw) return 0.7;
    const parsed = JSON.parse(raw);
    const music = Number(parsed && parsed.music);
    const clamped = Number.isFinite(music) ? Math.max(0, Math.min(1, music)) : 0.65;
    return clamped * 0.7;
  } catch (err) {
    return 0.7;
  }
}

function applyMainMenuMusicVolume() {
  if (!mainMenuMusic) return;
  try {
    mainMenuMusic.volume = getMenuMusicVolume();
  } catch (err) {}
}

window.setMainMenuMusicVolume = function setMainMenuMusicVolume(volume) {
  if (!mainMenuMusic) return;
  try {
    mainMenuMusic.volume = Math.max(0, Math.min(1, Number(volume) || 0));
  } catch (err) {}
};

function playMainMenuMusic() {
  if (!mainMenuMusic) {
    mainMenuMusic = new Audio('../main menu.mp3');
    mainMenuMusic.loop = true;
    mainMenuMusic.volume = getMenuMusicVolume();
  }
  applyMainMenuMusicVolume();
  mainMenuMusic.play().then(() => {
    musicStarted = true;
  }).catch(() => {
    // If playback fails, keep waiting for user gesture
    musicStarted = false;
  });
}

function stopMainMenuMusic() {
  if (mainMenuMusic) {
    mainMenuMusic.pause();
    mainMenuMusic.currentTime = 0;
  }
}

// Play music on first user interaction or immediately if allowed
function tryStartMenuMusic() {
  if (!musicStarted) {
    playMainMenuMusic();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  applyMainMenuMusicVolume();
  // Try to play immediately (may fail due to autoplay policy)
  tryStartMenuMusic();
  // Fallback: play on any user interaction, and keep listening until it works
  const gestureHandler = () => {
    if (!musicStarted) {
      playMainMenuMusic();
    }
    if (musicStarted) {
      ['click','keydown','touchstart'].forEach(evt => {
        window.removeEventListener(evt, gestureHandler);
      });
    }
  };
  ['click','keydown','touchstart'].forEach(evt => {
    window.addEventListener(evt, gestureHandler);
  });
  // Stop menu music when battle starts (overlay-start or side-panel-start)
  const startBtns = [
    document.getElementById('overlay-start'),
    document.getElementById('side-panel-start')
  ];
  startBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', stopMainMenuMusic);
    }
  });
});
