// Play main menu music until a battle is started
let mainMenuMusic;
let musicStarted = false;

function playMainMenuMusic() {
  if (!mainMenuMusic) {
    mainMenuMusic = new Audio('../main menu.mp3');
    mainMenuMusic.loop = true;
    mainMenuMusic.volume = 0.7;
  }
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
