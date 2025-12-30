const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const shipOverlay = document.getElementById('ship-overlay');
const shipGrid = document.getElementById('ship-grid');
const overlayCancel = document.getElementById('overlay-cancel');
const overlayStart = document.getElementById('overlay-start');
const playerRaceLabel = document.getElementById('player-race-label');
const enemyRaceLabel = document.getElementById('enemy-race-label');
const playerShipImg = document.getElementById('player-ship-img');
const enemyShipImg = document.getElementById('enemy-ship-img');
const playerCaptainName = document.getElementById('player-captain-name');
const enemyCaptainName = document.getElementById('enemy-captain-name');
const playerRaceTag = document.getElementById('player-race-tag');
const enemyRaceTag = document.getElementById('enemy-race-tag');
const playerCrewBarEl = document.getElementById('crew-bar');
const enemyCrewBarEl = document.getElementById('enemy-crew-bar');
const playerBatteryGridEl = document.getElementById('battery-grid');
const enemyBatteryGridEl = document.getElementById('enemy-battery-grid');
const playerEnergyTextEl = document.getElementById('hud-batt');
const enemyEnergyTextEl = document.getElementById('enemy-hud-batt');
const avatarWrap = document.getElementById('avatar-wrap');

const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');

const PANEL_WIDTH = 260; // width reserved for right-side HUD + margin
function fit() {
  const pad = 24; // total padding (12px left + 12px top/bottom)
  const w = Math.max(200, window.innerWidth - PANEL_WIDTH - pad);
  const h = Math.max(200, window.innerHeight - 24);
  canvas.width = w;
  canvas.height = h;
  // size canvas element to match
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
window.addEventListener('resize', fit);
fit();

// Ship types (simple placeholders; tweak stats as desired)
const DEFAULT_TRAIL_COLORS = {core:[255,200,120], mid:[200,100,40]};

const SHIP_TYPES = [
  {id:'servos',name:'Servos',classLabel:'Commander Frigate',size:14,speed:140,hp:60,fireRate:300,color:'#4ef',spriteAngleOffset:-Math.PI/2,spriteScale:0.058,trailColors:{core:[120,210,255],mid:[40,140,255]},
    special:{
      type:'orbitTurret',
      cost:16,
      duration:9,
      cooldown:7,
      turret:{
        orbitRadius:56,
        orbitSpeed:1.65,
        beamRange:260,
        beamDamagePerSecond:34,
        beamWidth:6,
        pdRange:170,
        maxPdShots:3,
        pdRegen:1.15
      }
    },
    projectile:{
      style:'default',
      damage:12,
      speed:440,
      ttl:1.8,
      muzzleOffset:16
    }
  },
  {id:'lulian',name:'Lulian',classLabel:'Titan Battleship',size:28,speed:120,hp:240,fireRate:650,color:'#f6a94f',spriteAngleOffset:Math.PI/2,spriteScale:0.11,trailColors:{core:[255,255,255],mid:[220,220,220]},
    special:{
      type:'waveMotionGun',
      cost:80,
      duration:2.6,
      drainPerSecond:90,
      damagePerSecond:220,
      width:28,
      length:980,
      flash:0.25
    },
    projectile:{
      style:'plasmaOrb',
      radius:11,
      tailLength:52,
      tailWidth:22,
      core:[255,255,255],
      mid:[240,240,255],
      rim:[200,220,255],
      speed:360,
      ttl:2.8,
      muzzleOffset:30,
      damage:26
    }
  },
  {id:'obama',name:'Humper Cruiser',classLabel:'Hopebringer Cruiser',size:24,speed:155,hp:150,fireRate:420,color:'#f8b2ff',spriteAngleOffset:Math.PI,spriteScale:0.12,overlayRotation:90,trailColors:{core:[255,220,150],mid:[255,150,90]},
    projectile:{
      style:'plasmaOrb',
      radius:9,
      tailLength:48,
      tailWidth:18,
      core:[255,255,255],
      mid:[255,200,120],
      rim:[255,120,60],
      speed:400,
      ttl:2.2,
      muzzleOffset:22,
      damage:18
    }
  },
  {id:'bad_ghost',name:'Bad Ghost',classLabel:'Stinker',size:9,speed:205,hp:85,fireRate:250,color:'#aef',spriteAngleOffset:Math.PI/2,spriteScale:0.05,trailColors:{core:[210,170,110],mid:[150,90,40]},
    special:{
      type:'fartCloud',
      cost:14,
      duration:0.35,
      cooldown:4.5,
      fart:{
        radius:72,
        maxRadius:108,
        duration:5.8,
        damagePerSecond:22,
        drift:34,
        opacity:0.68,
        swirlCount:4,
        puffCount:8,
        wispCount:12,
        colors:{
          core:[255,255,210],
          mid:[210,230,120],
          outer:[70,110,40],
          accent:[255,190,120]
        }
      }
    },
    projectile:{
      style:'default',
      damage:10,
      speed:520,
      ttl:1.5,
      muzzleOffset:14
    }
  },
  {id:'lunarian',name:'Lunarian',classLabel:'Moon Lance',size:16,speed:165,hp:130,fireRate:480,color:'#dde6ff',spriteAngleOffset:-Math.PI/2,spriteScale:0.08,trailColors:{core:[200,140,255],mid:[130,70,210]},
    special:{
      type:'lunarCloak',
      cost:12,
      duration: Infinity,
      cooldown:5,
      fadeIn:0.35,
      fadeOut:0.55,
      visibility:0.18,
      enemyVisibility:0,
      drainPerSecond:28
    },
    projectile:{
      style:'plasmaBolt',
      length:34,
      radius:4.5,
      core:[240,230,255],
      mid:[200,150,255],
      tail:[110,50,180],
      speed:520,
      ttl:2.4,
      muzzleOffset:18,
      damage:14
    }
  }
];

const SHIP_SPRITES = {};
function preloadShipSprites(){
  SHIP_TYPES.forEach(type=>{
    const img = new Image();
    img.onload = ()=>{ SHIP_SPRITES[type.id] = img; };
    img.onerror = ()=>{};
    img.src = `assets/ships/${type.id}.png`;
  });
}

const CAPTAIN_DIR = 'data/captains';
const DEFAULT_CAPTAIN_NAMES = ['Captain Nova','Commander Alys','Captain Thorn','Legate Myr'];
let captainData = { default: [...DEFAULT_CAPTAIN_NAMES] };
const captainAssignments = {A:'',B:''};

let selectionA = SHIP_TYPES[0], selectionB = SHIP_TYPES[1];

function buildShipPicker(){
  if(!shipGrid) return;
  shipGrid.innerHTML = '';
  SHIP_TYPES.forEach(type=>{
    const card = document.createElement('div');
    card.className = 'ship-card';
    card.dataset.shipId = type.id;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="ship-card-img">
        <img src="assets/ships/${type.id}.png" alt="${type.name} sprite">
      </div>
      <div class="ship-card-name">${type.name}</div>
      ${type.classLabel ? `<div class="ship-card-role">${type.classLabel}</div>` : ''}
      <div style="font-size:12px;color:#89a">Crew ${type.hp} · Speed ${type.speed}</div>
    `;
    const img = card.querySelector('img');
    if(img){
      if(typeof type.overlayRotation === 'number') img.style.transform = `rotate(${type.overlayRotation}deg)`;
      else img.style.transform = '';
    }
    const selectShip = ()=> handleShipChoice(type);
    card.addEventListener('click', selectShip);
    card.addEventListener('keydown', (evt)=>{
      if(evt.key === 'Enter' || evt.key === ' '){ evt.preventDefault(); selectShip(); }
    });
    shipGrid.appendChild(card);
  });
  updateOverlaySelection();
}

function handleShipChoice(type){
  if(!type) return;
  const changed = !selectionA || selectionA.id !== type.id;
  if(changed && isShipOverlayVisible()) playUiNav();
  selectionA = type;
  selectionB = pickRandomEnemy();
  ensureCaptainsAssigned(true);
  updateSelectionUI();
}

function pickRandomEnemy(){
  if(!SHIP_TYPES.length) return selectionB;
  const idx = Math.floor(Math.random()*SHIP_TYPES.length);
  return SHIP_TYPES[Math.max(0, Math.min(idx, SHIP_TYPES.length-1))];
}

function updateSegmentMeter(container, baseClass, emptyClass, percent, segments = 8){
  if(!container) return;
  while(container.children.length < segments){
    const seg = document.createElement('div');
    seg.classList.add(baseClass);
    container.appendChild(seg);
  }
  while(container.children.length > segments){
    container.removeChild(container.lastChild);
  }
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * segments);
  for(let i=0;i<container.children.length;i++){
    const seg = container.children[i];
    if(i < filled) seg.classList.remove(emptyClass);
    else seg.classList.add(emptyClass);
  }
}

function initializeHudMeters(){
  updateSegmentMeter(playerCrewBarEl, 'crew-seg', 'empty', 0, CREW_SEGMENTS);
  updateSegmentMeter(playerBatteryGridEl, 'battery-seg', 'drained', 0, BATTERY_SEGMENTS);
  if(playerEnergyTextEl) playerEnergyTextEl.textContent = '0%';
  updateSegmentMeter(enemyCrewBarEl, 'crew-seg', 'empty', 0, CREW_SEGMENTS);
  updateSegmentMeter(enemyBatteryGridEl, 'battery-seg', 'drained', 0, BATTERY_SEGMENTS);
  if(enemyEnergyTextEl) enemyEnergyTextEl.textContent = '0%';
}

function updateSelectionUI(){
  updatePanelDisplay('A', selectionA, playerRaceLabel, playerShipImg, playerCaptainName);
  updatePanelDisplay('B', selectionB, enemyRaceLabel, enemyShipImg, enemyCaptainName);
  loadAvatarsFor(selectionA.id);
  loadEnemyAvatarsFor(selectionB.id);
  enemyAvatarState = 'idle';
  updateEnemyAvatarImg();
  loadSfxFor(selectionA.id);
  ensureSfxForRace(selectionB.id);
  updateOverlaySelection();
}

function updatePanelDisplay(team, shipType, raceEl, shipImgEl, captainEl){
  if(raceEl) raceEl.textContent = shipType.name;
  if(team === 'A' && playerRaceTag) playerRaceTag.textContent = shipType.name;
  if(team === 'B' && enemyRaceTag) enemyRaceTag.textContent = shipType.name;
  if(shipImgEl){
    const sprite = SHIP_SPRITES[shipType.id];
    shipImgEl.src = sprite ? sprite.src : `assets/ships/${shipType.id}.png`;
    shipImgEl.alt = `${shipType.name} ship sprite`;
    if(typeof shipType.overlayRotation === 'number'){
      shipImgEl.style.transform = `rotate(${shipType.overlayRotation}deg)`;
    } else {
      shipImgEl.style.transform = '';
    }
  }
  if(captainEl){
    const assigned = captainAssignments[team];
    captainEl.textContent = assigned || 'Awaiting Captain';
  }
}

function updateOverlaySelection(){
  if(!shipGrid) return;
  const nodes = shipGrid.children;
  for(let i=0;i<nodes.length;i++){
    const node = nodes[i];
    node.classList.toggle('selected', node.dataset.shipId === selectionA.id);
  }
  if(isShipOverlayVisible()) focusSelectedShipCard();
}

function focusSelectedShipCard(){
  if(!shipGrid) return;
  if(!isShipOverlayVisible()) return;
  const card = shipGrid.querySelector(`.ship-card[data-ship-id="${selectionA.id}"]`);
  if(card) card.focus();
}

function getShipCardElements(){
  if(!shipGrid) return [];
  return Array.from(shipGrid.querySelectorAll('.ship-card'));
}

function getShipCardColumnCount(cards){
  if(!cards.length) return 1;
  const baseTop = cards[0].offsetTop;
  for(let i=1;i<cards.length;i++){
    if(cards[i].offsetTop > baseTop + 4) return i;
  }
  return cards.length;
}

function handleShipPickerNavigation(e){
  if(!isShipOverlayVisible()) return false;
  const cards = getShipCardElements();
  if(!cards.length) return false;
  const columns = Math.max(1, getShipCardColumnCount(cards));
  let currentIndex = cards.findIndex(card=> card.dataset.shipId === selectionA.id);
  if(currentIndex < 0) currentIndex = 0;
  let targetIndex = currentIndex;
  const lower = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if(lower === 'd' || e.key === 'ArrowRight'){
    targetIndex = Math.min(cards.length-1, currentIndex+1);
  } else if(lower === 'a' || e.key === 'ArrowLeft'){
    targetIndex = Math.max(0, currentIndex-1);
  } else if(lower === 's' || e.key === 'ArrowDown'){
    targetIndex = Math.min(cards.length-1, currentIndex + columns);
  } else if(lower === 'w' || e.key === 'ArrowUp'){
    targetIndex = Math.max(0, currentIndex - columns);
  } else {
    return false;
  }
  if(targetIndex !== currentIndex){
    const targetCard = cards[targetIndex];
    const targetId = targetCard ? targetCard.dataset.shipId : null;
    const type = targetId ? SHIP_TYPES.find(t=> t.id === targetId) : null;
    if(type) handleShipChoice(type);
    if(targetCard) targetCard.focus();
  }
  return true;
}

function handleOverlayKeydown(e){
  if(!isShipOverlayVisible()) return false;
  if(handleShipPickerNavigation(e)){
    e.preventDefault();
    return true;
  }
  if(e.key === 'Enter'){
    if(overlayStart){
      overlayStart.focus();
      playUiClick();
      overlayStart.click();
    }
    e.preventDefault();
    return true;
  }
  if(e.code === 'Space' || e.key === ' '){
    e.preventDefault();
    return true;
  }
  if(e.key === 'Escape'){
    if(overlayCancel) overlayCancel.click();
    e.preventDefault();
    return true;
  }
  return false;
}

function handleOverlayKeyup(e){
  if(!isShipOverlayVisible()) return false;
  const lower = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if(lower === 'w' || lower === 'a' || lower === 's' || lower === 'd' || e.key.startsWith('Arrow') || e.key === 'Escape' || e.code === 'Space' || e.key === ' '){
    e.preventDefault();
    return true;
  }
  if(e.key === 'Enter'){
    e.preventDefault();
    return true;
  }
  return false;
}

function ensureCaptainsAssigned(force=false){
  if(force || !captainAssignments.A) captainAssignments.A = pickCaptainName(selectionA.id);
  if(force || !captainAssignments.B) captainAssignments.B = pickCaptainName(selectionB.id);
}

function pickCaptainName(raceId){
  const pool = (captainData[raceId] && captainData[raceId].length) ? captainData[raceId]
    : (captainData.default && captainData.default.length ? captainData.default : DEFAULT_CAPTAIN_NAMES);
  if(!pool.length) return 'Captain';
  const idx = Math.floor(Math.random()*pool.length);
  return pool[Math.max(0, Math.min(idx, pool.length-1))];
}

function loadCaptainData(){
  const loaders = SHIP_TYPES.map(type=> fetchCaptainList(type.id));
  loaders.push(fetchCaptainList('default'));
  Promise.all(loaders)
    .then(()=>{
      ensureCaptainsAssigned(true);
      updateSelectionUI();
    })
    .catch(()=>{});
}

function fetchCaptainList(raceId){
  const url = `${CAPTAIN_DIR}/${raceId}.json`;
  return fetch(url)
    .then(resp=> resp.ok ? resp.json() : Promise.reject())
    .then(data=>{
      const names = Array.isArray(data) ? data : (data && Array.isArray(data.names) ? data.names : []);
      if(names.length) captainData[raceId] = names;
    })
    .catch(()=>{});
}

function showShipOverlay(){
  running = false;
  stopBattleMusic();
  resetVictoryState();
  if(shipOverlay){
    shipOverlay.classList.remove('hidden');
    updateOverlaySelection();
  }
  drawPaused();
}

function hideShipOverlay(){
  if(shipOverlay) shipOverlay.classList.add('hidden');
}

function ensureUiClickSound(){
  if(uiClickAudio) return uiClickAudio;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = UI_CLICK_SOUND;
  uiClickAudio = audio;
  return audio;
}

function playUiClick(){
  const audio = ensureUiClickSound();
  if(!audio) return;
  try{
    audio.currentTime = 0;
    audio.play();
  }catch(err){}
}

function ensureUiNavSound(){
  if(uiNavAudio) return uiNavAudio;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = UI_NAV_SOUND;
  uiNavAudio = audio;
  return audio;
}

function playUiNav(){
  const audio = ensureUiNavSound();
  if(!audio) return;
  try{
    audio.currentTime = 0;
    audio.play();
  }catch(err){}
}

function isShipOverlayVisible(){
  return shipOverlay && !shipOverlay.classList.contains('hidden');
}

function startBattle(){
  hideShipOverlay();
  resetVictoryState();
  resetAvatarFeed();
  spawnBattle();
  playBattleMusic();
  running = true;
  last = performance.now();
  loop(last);
}

const CREW_SEGMENTS = 8;
const BATTERY_SEGMENTS = 6;

// Game state
let running=false; let ships=[], bullets=[];
let stars = [], planets = [];
let starLayers = [];
let particles = [];
let explosions = [];
let fartClouds = [];
const sectorFartClouds = Object.create(null);
// avatar assets and audio cues
const AVATAR_STATES = ['idle','thrust','left','right','fire','special','victory'];
const AVATAR_IMAGE_EXTENSIONS = ['png','webp','jpg','jpeg'];
const AVATARS = {}; // raceId -> {state: Image}
let avatarState = 'idle';
let enemyAvatarState = 'idle';
let currentAvatarRace = null;
let currentEnemyRace = null;
let lastShotTime = 0;
let specialActiveUntil = 0;
let avatarFeedLost = false;
let avatarVictoryLock = false;
let enemyAvatarVictoryLock = false;
const SFX_CUES = ['thrust','fire','hit','special'];
const UI_CLICK_SOUND = 'assets/sfx/ui_select.wav';
const UI_NAV_SOUND = 'assets/sfx/ui_nav.mp3';
let uiClickAudio = null;
let uiNavAudio = null;
const SFX_CACHE = {};
let currentSfxRace = null;
const SHIP_DEATH_SOUND = 'assets/sfx/death.mp3';
let deathAudioTemplate = null;
let deathAudioTried = false;
const FART_CLOUD_SOUND = '../fart_IXihrxq.mp3';
let fartCloudAudioTemplate = null;
let fartCloudAudioTried = false;
const DEFAULT_VICTORY_THEME = 'assets/sfx/victory.mp3';
const VICTORY_THEME_MAP = {
  default: DEFAULT_VICTORY_THEME,
  bad_ghost: 'assets/music/victory/bad_ghost.mp3'
};
const victoryAudioCache = {};
const victoryState = {active:false, ship:null, start:0, duration:2800};
const VICTORY_AFTERGLOW = 2400; // extra hold so the scene can fade out
const pendingVictory = {active:false, winner:null, start:0};
const VICTORY_DELAY_MS = 2200;
const BGM = { src: 'assets/music/battle.mp3', track: null };
const CAMERA_CONFIG = {
  closeZoom: 1.22,
  farZoom: 0.72,
  lerp: 0.08,
  padding: 180
};
const cameraState = {x: canvas.width/2, y: canvas.height/2, scale: 1};
const PLANET_CONFIG = {
  count: 2,
  minRadius: 24,
  maxRadius: 44,
  ringChance: 0.35,
  palettes: [
    {light: '#cfe7ff', mid: '#4b8cc9', dark: '#16243a', accent: 'rgba(255,255,255,0.32)', ring: 'rgba(164,196,255,0.55)'},
    {light: '#ffe4c1', mid: '#d78f4f', dark: '#412014', accent: 'rgba(255,255,255,0.22)', ring: 'rgba(255,214,170,0.45)'},
    {light: '#f1e4ff', mid: '#a77cd6', dark: '#3a1a5c', accent: 'rgba(255,255,255,0.28)', ring: 'rgba(235,189,255,0.42)'},
    {light: '#dff1c4', mid: '#6a9c5d', dark: '#253623', accent: 'rgba(255,255,255,0.2)', ring: 'rgba(198,255,189,0.4)'}
  ]
};
const SECTOR_PADDING = 220;
const SECTOR_EXIT_BUFFER = 140;
const SECTOR_ENTRY_OFFSET_X = 110;
const SECTOR_ENTRY_OFFSET_Y = 80;

function loadAvatarsFor(raceId){
  currentAvatarRace = raceId;
  ensureAvatarSetLoaded(raceId);
  updateAvatarImg();
}

function loadEnemyAvatarsFor(raceId){
  currentEnemyRace = raceId;
  ensureAvatarSetLoaded(raceId);
  updateEnemyAvatarImg();
}

function ensureAvatarSetLoaded(raceId){
  if(!raceId) return;
  if(AVATARS[raceId]) return;
  AVATARS[raceId] = {};
  AVATAR_STATES.forEach(state=>{
    const img = new Image();
    const basePaths = [
      `assets/avatars/${raceId}/${state}`,
      `assets/avatars/${state}`,
      `assets/avatars/${raceId}/idle`,
      `assets/avatars/idle`
    ];
    const sources = [];
    const seenSources = new Set();
    basePaths.forEach(base=>{
      AVATAR_IMAGE_EXTENSIONS.forEach(ext=>{
        const candidate = `${base}.${ext}`;
        if(seenSources.has(candidate)) return;
        sources.push(candidate);
        seenSources.add(candidate);
      });
    });
    const tryNext = ()=>{
      const next = sources.shift();
      if(!next){ AVATARS[raceId][state] = null; return; }
      img.src = next;
    };
    img.onload = ()=>{
      AVATARS[raceId][state] = img;
      if(raceId === currentAvatarRace && state === avatarState) updateAvatarImg();
      if(raceId === currentEnemyRace && state === enemyAvatarState) updateEnemyAvatarImg();
    };
    img.onerror = ()=> tryNext();
    tryNext();
  });
}

function triggerAvatarStatic(){
  avatarFeedLost = true;
  avatarState = 'static';
  if(avatarWrap) avatarWrap.classList.add('signal-lost');
  updateAvatarImg();
}

function resetAvatarFeed(){
  avatarFeedLost = false;
  avatarState = 'idle';
  if(avatarWrap) avatarWrap.classList.remove('signal-lost');
  updateAvatarImg();
}
function ensureSfxForRace(raceId){
  if(!raceId) return null;
  const store = SFX_CACHE[raceId] || (SFX_CACHE[raceId] = {});
  SFX_CUES.forEach(cue=>{
    if(store[cue]) return;
    const audio = new Audio();
    audio.preload = 'auto';
    const sources = [
      `assets/sfx/${raceId}/${cue}.ogg`,
      `assets/sfx/${raceId}/${cue}.mp3`,
      `assets/sfx/${raceId}/${cue}.wav`,
      `assets/sfx/${cue}.ogg`,
      `assets/sfx/${cue}.mp3`,
      `assets/sfx/${cue}.wav`
    ];
    const tryNext = ()=>{
      if(!sources.length) return;
      audio.src = sources.shift();
      try{ audio.load(); }catch(err){}
    };
    audio.oncanplaythrough = ()=>{
      store[cue] = audio;
    };
    audio.onerror = ()=>{
      if(sources.length) tryNext();
    };
    tryNext();
  });
  return store;
}

function loadSfxFor(raceId){
  if(!raceId) return;
  currentSfxRace = raceId;
  ensureSfxForRace(raceId);
}

function ensureBattleMusic(){
  if(BGM.track) return BGM.track;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = true;
  audio.volume = 0.65;
  audio.src = BGM.src;
  BGM.track = audio;
  return audio;
}

function playBattleMusic(){
  const track = ensureBattleMusic();
  try{
    track.currentTime = 0;
    track.play();
  }catch(err){}
}

function stopBattleMusic(){
  if(!BGM.track) return;
  try{ BGM.track.pause(); }catch(err){}
  BGM.track.currentTime = 0;
}

function ensureDeathAudio(){
  if(deathAudioTemplate || deathAudioTried) return deathAudioTemplate;
  deathAudioTried = true;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = SHIP_DEATH_SOUND;
  deathAudioTemplate = audio;
  return deathAudioTemplate;
}

function playShipDeath(){
  const template = ensureDeathAudio();
  if(!template) return;
  try{
    const clip = template.cloneNode(true);
    clip.volume = 0.85;
    clip.play();
  }catch(err){}
}

function ensureFartCloudAudio(){
  if(fartCloudAudioTemplate || fartCloudAudioTried) return fartCloudAudioTemplate;
  fartCloudAudioTried = true;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = FART_CLOUD_SOUND;
  fartCloudAudioTemplate = audio;
  return fartCloudAudioTemplate;
}

function playFartCloudSound(){
  const template = ensureFartCloudAudio();
  if(!template) return;
  try{
    const clip = template.cloneNode(true);
    clip.volume = 0.85;
    clip.play();
  }catch(err){}
}

function getVictoryThemeSource(raceId){
  if(raceId && VICTORY_THEME_MAP[raceId]) return VICTORY_THEME_MAP[raceId];
  return VICTORY_THEME_MAP.default || DEFAULT_VICTORY_THEME;
}

function ensureVictoryAudio(raceId){
  const src = getVictoryThemeSource(raceId);
  if(victoryAudioCache[src]) return victoryAudioCache[src];
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = src;
  victoryAudioCache[src] = audio;
  return audio;
}

function playVictorySound(raceId){
  const template = ensureVictoryAudio(raceId);
  if(!template) return;
  try{
    const clip = template.cloneNode(true);
    clip.volume = 0.9;
    clip.play();
  }catch(err){}
}

function triggerVictory(winner){
  if(!winner) return;
  victoryState.active = true;
  victoryState.ship = winner;
  victoryState.start = performance.now();
  stopBattleMusic();
  const winnerRace = winner && winner.type ? winner.type.id : null;
  playVictorySound(winnerRace);
  if(winner.team === 'A'){
    if(avatarFeedLost){
      avatarFeedLost = false;
      if(avatarWrap) avatarWrap.classList.remove('signal-lost');
    }
    avatarVictoryLock = true;
    avatarState = 'victory';
    updateAvatarImg();
  } else if(winner.team === 'B'){
    enemyAvatarVictoryLock = true;
    enemyAvatarState = 'victory';
    updateEnemyAvatarImg();
  }
}

function resetVictoryState(){
  victoryState.active = false;
  victoryState.ship = null;
  victoryState.start = 0;
  pendingVictory.active = false;
  pendingVictory.winner = null;
  pendingVictory.start = 0;
  avatarVictoryLock = false;
  enemyAvatarVictoryLock = false;
}

function scheduleVictory(winner){
  if(!winner) return;
  pendingVictory.active = true;
  pendingVictory.winner = winner;
  pendingVictory.start = performance.now();
  stopBattleMusic();
}

function getSfxClip(cue, raceId){
  if(!raceId) return null;
  const store = ensureSfxForRace(raceId);
  if(!store) return null;
  return store[cue] || null;
}

function playSfx(cue, raceId){
  if(!cue) return;
  let clip = raceId ? getSfxClip(cue, raceId) : null;
  if(!clip && currentSfxRace) clip = getSfxClip(cue, currentSfxRace);
  if(!clip){
    const fallbackRace = Object.keys(SFX_CACHE).find(id=> SFX_CACHE[id] && SFX_CACHE[id][cue]);
    if(fallbackRace) clip = SFX_CACHE[fallbackRace][cue];
  }
  if(!clip) return;
  try{
    clip.currentTime = 0;
    clip.play();
  }catch(err){}
}

function getAvatarFrame(raceId, state){
  if(!raceId) return null;
  const set = AVATARS[raceId];
  if(!set) return null;
  return set[state] || set.idle || null;
}

function updateAvatarImg(){
  const el = document.getElementById('avatar-img');
  if(!el) return;
  const img = getAvatarFrame(currentAvatarRace, avatarState);
  el.src = (img && img.src) ? img.src : '';
}

function updateEnemyAvatarImg(){
  const el = document.getElementById('enemy-avatar-img');
  if(!el) return;
  const img = getAvatarFrame(currentEnemyRace, enemyAvatarState);
  el.src = img && img.src ? img.src : '';
}

function deriveShipAvatarState(ship, now){
  if(!ship) return 'idle';
  if(ship.activeSpecial) return 'special';
  if(ship.isWarping && ship.isWarping()) return 'special';
  if(now - (ship.lastShotAt || 0) < 320) return 'fire';
  if(ship.lastTurnDir === 'left') return 'left';
  if(ship.lastTurnDir === 'right') return 'right';
  const speed = Math.hypot(ship.vx || 0, ship.vy || 0);
  if(speed > 40) return 'thrust';
  return 'idle';
}
const keys = {w:false,a:false,s:false,d:false,space:false,shift:false};
let currentSector = {sx:0,sy:0};

function makeSectorKey(sx, sy){
  return `${sx}|${sy}`;
}

function syncSectorClouds(sx, sy, clouds){
  sectorFartClouds[makeSectorKey(sx,sy)] = clouds;
}

function getCloudsForSector(sx, sy){
  const key = makeSectorKey(sx,sy);
  return sectorFartClouds[key] || null;
}

function clearAllSectorClouds(){
  Object.keys(sectorFartClouds).forEach(key=> delete sectorFartClouds[key]);
}

window.addEventListener('keydown',(e)=>{
  if(handleOverlayKeydown(e)) return;
  if(e.key==='w') keys.w=true;
  if(e.key==='ArrowUp'){ keys.w=true; e.preventDefault(); }
  if(e.key==='a') keys.a=true;
  if(e.key==='ArrowLeft'){ keys.a=true; e.preventDefault(); }
  if(e.key==='s') keys.s=true;
  if(e.key==='ArrowDown'){ keys.s=true; e.preventDefault(); }
  if(e.key==='d') keys.d=true;
  if(e.key==='ArrowRight'){ keys.d=true; e.preventDefault(); }
  if(e.code==='Space') { keys.space=true; e.preventDefault(); }
  if(e.key==='Shift' || e.code==='ShiftLeft' || e.code==='ShiftRight') keys.shift=true;
});
window.addEventListener('keyup',(e)=>{
  if(handleOverlayKeyup(e)) return;
  if(e.key==='w') keys.w=false;
  if(e.key==='ArrowUp'){ keys.w=false; e.preventDefault(); }
  if(e.key==='a') keys.a=false;
  if(e.key==='ArrowLeft'){ keys.a=false; e.preventDefault(); }
  if(e.key==='s') keys.s=false;
  if(e.key==='ArrowDown'){ keys.s=false; e.preventDefault(); }
  if(e.key==='d') keys.d=false;
  if(e.key==='ArrowRight'){ keys.d=false; e.preventDefault(); }
  if(e.code==='Space') keys.space=false;
  if(e.key==='Shift' || e.code==='ShiftLeft' || e.code==='ShiftRight') keys.shift=false;
});

class Ship{
  constructor(type,x,y,team){
    this.type=type; this.x=x; this.y=y; this.team=team; this.hp=type.hp;
    this.size = type.size; this.color=type.color; this.cool=0; this.angle=0;
    this.speed = type.speed; this.fireRate = type.fireRate;
    this.vx = 0; this.vy = 0; this.control = false; this.maxSpeed = type.speed*1.2;
    this.spriteAngleOffset = type.spriteAngleOffset || 0;
    this.spriteScale = type.spriteScale || null;
    this.trailColors = type.trailColors || DEFAULT_TRAIL_COLORS;
    this.trail = [];
    this.maxEnergy = type.energyCapacity || 100;
    this.energy = this.maxEnergy;
    this.energyCost = type.energyCost || 8;
    this.energyRegen = type.energyRegen || 20;
    this._playedDeath = false;
    this.invulnerable = false;
    this.warp = null;
    this.prevAngle = this.angle;
    this.lastTurnDir = 'none';
    this.lastShotAt = 0;
    this.thrusting = false;
    this.cloakOpacity = 1;
    this.cloakActive = false;
    this.specialConfig = type.special || null;
    this.activeSpecial = null;
    this.specialCooldown = 0;
    this.specialLatch = false;
    this.projectileConfig = type.projectile || null;
    this.ai = this.control ? null : {
      mode: 'approach',
      timer: 0,
      strafeDir: Math.random()<0.5 ? 1 : -1,
      dodgeCooldown: 0,
      dodgeAngle: 0
    };
  }
  beginWarpFrom(fromX, fromY, duration=0.75){
    const toX = this.x;
    const toY = this.y;
    const dx = toX - fromX;
    const dy = toY - fromY;
    this.warp = {
      from:{x:fromX,y:fromY},
      to:{x:toX,y:toY},
      age:0,
      duration,
      angle: Math.atan2(dy, dx || 0)
    };
    this.invulnerable = true;
    this.x = fromX;
    this.y = fromY;
    this.vx = 0;
    this.vy = 0;
  }
  update(dt){
    if(this.processWarp(dt)){
      this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen * dt);
      return;
    }
    this.thrusting = false;
    if(this.control){
      // player control: WASD rotate/thrust, space to fire
      const rotSpeed = 3.5; // radians/sec
      if(keys.a) this.angle -= rotSpeed*dt;
      if(keys.d) this.angle += rotSpeed*dt;
      const thrust = 300; // accel
      if(keys.w){
        this.vx += Math.cos(this.angle)*thrust*dt;
        this.vy += Math.sin(this.angle)*thrust*dt;
        this.markThrust();
      }
      if(keys.s){ this.vx *= 0.96; this.vy *= 0.96; }
      // speed cap
      const sp = Math.hypot(this.vx,this.vy);
      if(sp > this.maxSpeed){ this.vx = this.vx/sp * this.maxSpeed; this.vy = this.vy/sp * this.maxSpeed; }
      this.x += this.vx*dt; this.y += this.vy*dt;
      this.cool -= dt*1000;
      if(keys.space && this.cool<=0){
        if(this.shoot(this.angle)) this.cool = this.fireRate;
      }
      if(keys.shift){
        if(!this.specialLatch){
          this.attemptSpecial();
          this.specialLatch = true;
        }
      } else {
        this.specialLatch = false;
      }
    } else {
      this.updateAI(dt);
    }
    if(this.thrusting) this.emitEngineExhaust();
    const turnDelta = normalizeAngle(this.angle - this.prevAngle);
    if(turnDelta > 0.05) this.lastTurnDir = 'right';
    else if(turnDelta < -0.05) this.lastTurnDir = 'left';
    else this.lastTurnDir = 'none';
    this.prevAngle = this.angle;
    if(this.trail.length){
      this.trail.forEach(seg=> seg.life -= dt*2.2);
      this.trail = this.trail.filter(seg=> seg.life>0);
    }
    this.updateSpecial(dt);
    this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen * dt);
  }
  canUseSpecial(){
    if(!this.specialConfig) return false;
    if(this.activeSpecial){
      return this.activeSpecial.type === 'lunarCloak';
    }
    if(this.specialCooldown > 0) return false;
    const cost = this.specialConfig.cost || 0;
    return this.energy >= cost;
  }
  attemptSpecial(){
    if(!this.canUseSpecial()) return false;
    if(this.activeSpecial && this.activeSpecial.type === 'lunarCloak'){
      this.activeSpecial = null;
      this.endCloak();
      this.specialCooldown = this.specialConfig.cooldown || 0;
      return true;
    }
    const conf = this.specialConfig || {};
    const spec = {
      type: conf.type || 'special',
      age: 0,
      duration: conf.duration || 1.2,
      width: conf.width || 20,
      length: conf.length || 600,
      damagePerSecond: conf.damagePerSecond || 150,
      drainPerSecond: conf.drainPerSecond || 0,
      flash: conf.flash || 0,
      config: conf
    };
    const cost = conf.cost || 0;
    this.energy = Math.max(0, this.energy - cost);
    this.activeSpecial = spec;
    this.specialCooldown = conf.cooldown || 0;
    if(spec.type === 'lunarCloak'){
      this.cloakActive = true;
      this.cloakOpacity = 1;
      if(!this.control) this.trail = [];
    }
    if(this.control){
      if(spec.type !== 'fartCloud'){
        playSfx('special', this.type.id);
      }
      const now = performance.now ? performance.now() : Date.now();
      const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 1400;
      specialActiveUntil = now + durMs;
    }
    return true;
  }
  updateSpecial(dt){
    if(this.specialCooldown > 0) this.specialCooldown = Math.max(0, this.specialCooldown - dt);
    const spec = this.activeSpecial;
    if(!spec) return;
    spec.age += dt;
    if(spec.drainPerSecond){
      this.energy = Math.max(0, this.energy - spec.drainPerSecond * dt);
      if(this.energy <= 0.5) spec.age = spec.duration;
    }
    switch(spec.type){
      case 'waveMotionGun':
        this.updateWaveMotionGun(spec, dt);
        break;
      case 'lunarCloak':
        this.updateCloak(spec, dt);
        break;
      case 'fartCloud':
        this.updateFartCloud(spec, dt);
        break;
      case 'orbitTurret':
        this.updateOrbitTurret(spec, dt);
        break;
      default:
        break;
    }
    if(spec.age >= spec.duration || this.hp <= 0){
      if(spec.type === 'lunarCloak') this.endCloak();
      this.activeSpecial = null;
    }
  }
  updateWaveMotionGun(spec, dt){
    const dirX = Math.cos(this.angle);
    const dirY = Math.sin(this.angle);
    const startX = this.x + dirX * this.size*0.8;
    const startY = this.y + dirY * this.size*0.8;
    const len = spec.length || 800;
    const width = (spec.width || 20) + Math.sin(spec.age*15) * 2;
    spec.hazeTimer = (spec.hazeTimer || 0) - dt;
    if(spec.hazeTimer <= 0){
      spec.hazeTimer = 0.035;
      particles.push({
        x: startX + dirX * (Math.random()*len*0.9),
        y: startY + dirY * (Math.random()*len*0.9),
        vx: (Math.random()-0.5)*25,
        vy: (Math.random()-0.5)*25,
        life: 0.12 + Math.random()*0.18,
        size: 2.6 + Math.random()*1.2,
        core: [255,255,255],
        mid: [120,190,255]
      });
    }
    spec.muzzleTimer = (spec.muzzleTimer || 0) - dt;
    if(spec.muzzleTimer <= 0){
      spec.muzzleTimer = 0.12;
      particles.push({
        x: startX,
        y: startY,
        vx: dirX * (40 + Math.random()*80) + (Math.random()-0.5)*40,
        vy: dirY * (40 + Math.random()*80) + (Math.random()-0.5)*40,
        life: 0.18 + Math.random()*0.2,
        size: width*0.55,
        core: [255,230,190],
        mid: [255,140,80]
      });
    }
    ships.forEach(target=>{
      if(target === this || target.team === this.team || target.hp<=0) return;
      const relX = target.x - startX;
      const relY = target.y - startY;
      const proj = relX*dirX + relY*dirY;
      if(proj < -target.size || proj > len) return;
      const closestX = startX + dirX*proj;
      const closestY = startY + dirY*proj;
      const dist = Math.hypot(target.x - closestX, target.y - closestY);
      if(dist <= width + target.size*0.35){
        applyDamage(target, spec.damagePerSecond * dt);
      }
    });
    if(spec.flash && Math.random() < 0.65){
      particles.push({
        x: startX + dirX * (Math.random() * len),
        y: startY + dirY * (Math.random() * len),
        vx: (Math.random()-0.5)*40,
        vy: (Math.random()-0.5)*40,
        life: 0.15 + Math.random()*0.2,
        size: 1 + Math.random()*1.2,
        core: [255,230,200],
        mid: [180,220,255]
      });
    }
  }
  updateCloak(spec, dt){
    const conf = spec.config || this.specialConfig || {};
    const fadeIn = conf.fadeIn || 0.3;
    const fadeOut = conf.fadeOut || 0.35;
    const playerVisibility = ('visibility' in conf) ? conf.visibility : 0.2;
    const enemyVisibility = ('enemyVisibility' in conf) ? conf.enemyVisibility : playerVisibility;
    const baseVisibility = this.control ? playerVisibility : enemyVisibility;
    const minAlpha = Math.max(0, Math.min(1, baseVisibility));
    const duration = spec.duration || conf.duration || 3;
    const age = spec.age;
    let alpha = minAlpha;
    if(age < fadeIn){
      const t = Math.min(1, age / fadeIn);
      alpha = lerp(1, minAlpha, t);
    } else if(duration - age < fadeOut){
      const remaining = Math.max(0, duration - age);
      const t = 1 - Math.min(1, remaining / fadeOut);
      alpha = lerp(minAlpha, 1, t);
    }
    this.cloakOpacity = alpha;
    this.cloakActive = true;
    if(Math.random() < 0.08){
      particles.push({
        x: this.x + (Math.random()-0.5)*this.size,
        y: this.y + (Math.random()-0.5)*this.size,
        vx: (Math.random()-0.5)*30,
        vy: (Math.random()-0.5)*30,
        life: 0.25,
        size: 1.2,
        core: [200,220,255],
        mid: [120,180,255]
      });
    }
  }
  updateFartCloud(spec, dt){
    if(spec.spawned) return;
    this.releaseFartCloud(spec);
    spec.spawned = true;
  }
  releaseFartCloud(spec){
    const conf = spec.config || this.specialConfig || {};
    const fart = conf.fart || {};
    const baseRadius = fart.radius || 70;
    const maxRadius = fart.maxRadius || baseRadius * 1.35;
    const duration = fart.duration || 5.5;
    const drift = fart.drift || 24;
    const heading = this.angle + (Math.random()-0.5) * 0.5;
    const spawnRadius = this.size + baseRadius * 0.15;
    const colors = fart.colors || {
      core: [255,245,190],
      mid: [210,200,120],
      outer: [80,90,40],
      accent: [255,190,120]
    };
    const swirlCount = fart.swirlCount || 3;
    const puffCount = fart.puffCount || 6;
    const wispCount = fart.wispCount || 10;
    const cloud = {
      x: this.x + Math.cos(this.angle) * spawnRadius,
      y: this.y + Math.sin(this.angle) * spawnRadius,
      vx: Math.cos(heading) * drift,
      vy: Math.sin(heading) * drift,
      baseRadius: baseRadius * 0.75,
      maxRadius,
      expandTime: fart.expandTime || 1.1,
      duration,
      damagePerSecond: fart.damagePerSecond || 20,
      opacity: fart.opacity || 0.65,
      team: this.team,
      age: 0,
      noiseSeed: Math.random()*Math.PI*2,
      colors,
      swirls: [],
      puffs: [],
      wisps: [],
      displayRadius: baseRadius,
      driftDecay: fart.driftDecay || 0.992,
      windAngle: heading + (Math.random()-0.5)*0.6,
      windStrength: drift * (0.55 + Math.random()*0.65),
      windTimer: 0,
      textureSeed: Math.random()*Math.PI*2
    };
    for(let i=0;i<swirlCount;i++){
      cloud.swirls.push({
        angle: Math.random()*Math.PI*2,
        radius: baseRadius * (0.35 + Math.random()*0.25),
        speed: (fart.swirlSpeed || 0.8) * (Math.random()<0.5 ? -1 : 1),
        alpha: 0.25 + Math.random()*0.35
      });
    }
    for(let i=0;i<puffCount;i++){
      const wobbleSpeed = 0.6 + Math.random()*1.2;
      cloud.puffs.push({
        offsetRadius: baseRadius * (0.25 + Math.random()*0.85),
        offsetAngle: Math.random()*Math.PI*2,
        radius: baseRadius * (0.25 + Math.random()*0.45),
        squash: 0.55 + Math.random()*0.4,
        wobbleSpeed,
        wobblePhase: Math.random()*Math.PI*2,
        wobbleAmount: baseRadius * (0.08 + Math.random()*0.12),
        alpha: 0.25 + Math.random()*0.4,
        jitter: 0.85 + Math.random()*0.25
      });
    }
    for(let i=0;i<wispCount;i++){
      cloud.wisps.push({
        angle: Math.random()*Math.PI*2,
        distance: baseRadius * (0.15 + Math.random()*0.9),
        driftSpeed: (Math.random()*0.4 + 0.2) * maxRadius,
        length: baseRadius * (0.25 + Math.random()*0.35),
        thickness: 1 + Math.random()*1.5,
        alpha: 0.2 + Math.random()*0.35,
        offset: Math.random()*Math.PI*2
      });
    }
    fartClouds.push(cloud);
    playFartCloudSound();
  }
  updateOrbitTurret(spec, dt){
    const conf = spec.config || this.specialConfig || {};
    const turretConf = conf.turret || {};
    if(!spec.turret){
      spec.turret = {
        angle: Math.random()*Math.PI*2,
        radius: turretConf.orbitRadius || this.size*2.5,
        pdReserve: turretConf.maxPdShots || 3,
        pdFlash: 0,
        beamPulse: 0
      };
    }
    const turret = spec.turret;
    const orbitSpeed = turretConf.orbitSpeed || 1.6;
    turret.angle += orbitSpeed * dt;
    const desiredRadius = turretConf.orbitRadius || this.size * 2.4;
    turret.radius = turret.radius ? lerp(turret.radius, desiredRadius, dt*3.2) : desiredRadius;
    turret.x = this.x + Math.cos(turret.angle) * turret.radius;
    turret.y = this.y + Math.sin(turret.angle) * turret.radius;
    turret.pdFlash = Math.max(0, turret.pdFlash - dt*3.5);
    turret.beamPulse = Math.max(0, (turret.beamPulse || 0) - dt*1.6);

    const maxPd = Math.max(1, turretConf.maxPdShots || 3);
    const regen = Math.max(0, turretConf.pdRegen || 1.1);
    turret.pdReserve = Math.min(maxPd, (turret.pdReserve ?? maxPd) + regen * dt);

    const pdRange = turretConf.pdRange || 160;
    let shotsLeft = Math.floor(turret.pdReserve);
    if(shotsLeft > 0 && bullets.length){
      for(let i=0;i<bullets.length && shotsLeft>0;i++){
        const b = bullets[i];
        if(!b || b.team === this.team || b.ttl <= 0) continue;
        const dist = Math.hypot(b.x - turret.x, b.y - turret.y);
        if(dist <= pdRange){
          b.ttl = 0;
          shotsLeft--;
          turret.pdReserve = Math.max(0, turret.pdReserve - 1);
          turret.pdFlash = 0.22;
          particles.push({
            x: turret.x + (Math.random()-0.5)*6,
            y: turret.y + (Math.random()-0.5)*6,
            vx: (Math.random()-0.5)*60,
            vy: (Math.random()-0.5)*60,
            life: 0.18 + Math.random()*0.18,
            size: 0.9 + Math.random()*0.7,
            core: [190,255,255],
            mid: [90,180,255]
          });
        }
      }
    }

    const beamRange = turretConf.beamRange || 260;
    const beamDps = turretConf.beamDamagePerSecond || 30;
    let target = null;
    let bestDist = beamRange;
    ships.forEach(other=>{
      if(!other || other === this || other.team === this.team) return;
      if(other.hp <= 0 || other.isWarping()) return;
      const dist = Math.hypot(other.x - turret.x, other.y - turret.y);
      if(dist < bestDist){
        bestDist = dist;
        target = other;
      }
    });
    turret.target = target || null;
    if(target){
      applyDamage(target, beamDps * dt);
      turret.beamPulse = Math.min(1, (turret.beamPulse || 0) + dt*2.4);
      turret.targetPos = {x: target.x, y: target.y};
    } else {
      turret.targetPos = null;
    }
  }
  updateAI(dt){
    const ai = this.ai || (this.ai = {mode:'approach',timer:0,strafeDir:1,dodgeCooldown:0,dodgeAngle:0});
    const enemies = ships.filter(s=>s.team!==this.team && s.hp>0 && !s.isWarping());
    if(!enemies.length) return;
    const target = enemies.reduce((a,b)=> distance(this,b) < distance(this,a) ? b : a, enemies[0]);
    ai.target = target;
    const nowMs = performance.now ? performance.now() : Date.now();
    const targetInvisible = target && target.isCloaked && target.isCloaked();
    if(!ai.lastKnownTarget) ai.lastKnownTarget = {x: target.x, y: target.y, time: nowMs};
    if(targetInvisible){
      if(!ai.phantomTarget || ai.phantomTarget.expire < nowMs){
        if(ai.lastKnownTarget && Math.random() < 0.7){
          ai.phantomTarget = {x: ai.lastKnownTarget.x, y: ai.lastKnownTarget.y, expire: nowMs + 1400};
        } else {
          const randAngle = Math.random()*Math.PI*2;
          const randDist = 140 + Math.random()*220;
          ai.phantomTarget = {x: this.x + Math.cos(randAngle)*randDist, y: this.y + Math.sin(randAngle)*randDist, expire: nowMs + 900};
        }
      }
    } else {
      ai.lastKnownTarget = {x: target.x, y: target.y, time: nowMs};
      ai.phantomTarget = null;
    }
    const anchor = targetInvisible ? (ai.phantomTarget || ai.lastKnownTarget || target) : target;
    const dx = anchor.x - this.x;
    const dy = anchor.y - this.y;
    const dist = Math.hypot(dx,dy) || 0.0001;
    const preferRange = this.size*6 + 80;
    const virtualTarget = targetInvisible ? Object.assign({}, target, {x: anchor.x, y: anchor.y, vx: 0, vy: 0}) : target;
    let aimAngle = computeLeadAngle(this, virtualTarget, 420) ?? Math.atan2(dy,dx);
    if(targetInvisible) aimAngle += (Math.random()-0.5)*0.35;

    // turn toward aim smoothly
    const turnRate = 2.8; // radians/sec
    this.angle = rotateToward(this.angle, aimAngle, turnRate*dt);

    // evaluate incoming bullets for dodge
    if(ai.dodgeCooldown <= 0){
      const threat = bullets.find(b=> b.team!==this.team && willBulletHit(this, b));
      if(threat){
        ai.mode = 'evade';
        ai.timer = 0.5 + Math.random()*0.5;
        ai.dodgeAngle = Math.atan2(dy,dx) + (Math.random()<0.5 ? Math.PI/2 : -Math.PI/2);
        ai.dodgeCooldown = 1.5;
      }
    } else ai.dodgeCooldown -= dt;

    ai.timer -= dt;
    if(ai.mode === 'evade'){
      const accel = this.speed * 0.9;
      this.vx += Math.cos(ai.dodgeAngle) * accel * dt;
      this.vy += Math.sin(ai.dodgeAngle) * accel * dt;
      this.markThrust();
      if(ai.timer <= 0) ai.mode = 'strafe';
    } else {
      if(dist > preferRange * 1.25) ai.mode = 'approach';
      else if(dist < preferRange * 0.75) ai.mode = 'retreat';
      else if(ai.mode !== 'strafe') ai.mode = 'strafe';

      switch(ai.mode){
        case 'approach': {
          const accel = this.speed * 0.65;
          this.vx += Math.cos(this.angle) * accel * dt;
          this.vy += Math.sin(this.angle) * accel * dt;
          this.markThrust();
          break;
        }
        case 'retreat': {
          const accel = this.speed * 0.7;
          this.vx -= Math.cos(this.angle) * accel * dt;
          this.vy -= Math.sin(this.angle) * accel * dt;
          this.markThrust();
          break;
        }
        case 'strafe': default: {
          if(ai.timer <= 0){
            ai.timer = 0.8 + Math.random()*0.8;
            ai.strafeDir *= -1;
          }
          const perp = this.angle + ai.strafeDir * Math.PI/2;
          const accel = this.speed * 0.55;
          this.vx += Math.cos(perp) * accel * dt;
          this.vy += Math.sin(perp) * accel * dt;
          this.markThrust();
          // nudge toward preferred radius
          const radialAdjust = (dist - preferRange) / preferRange;
          this.vx += Math.cos(this.angle) * this.speed * -radialAdjust * 0.15 * dt;
          this.vy += Math.sin(this.angle) * this.speed * -radialAdjust * 0.15 * dt;
          break;
        }
      }
    }
    // idle kick so AI doesn't stall when velocity drops too low
    const velocity = Math.hypot(this.vx, this.vy);
    const desiredMomentum = this.speed * 0.35;
    if(velocity < desiredMomentum){
      const heading = ai.mode === 'retreat'
        ? this.angle + Math.PI
        : (ai.mode === 'evade' && Number.isFinite(ai.dodgeAngle) ? ai.dodgeAngle : this.angle);
      const booster = this.speed * (0.55 + Math.random()*0.25);
      this.vx += Math.cos(heading) * booster * dt;
      this.vy += Math.sin(heading) * booster * dt;
      this.markThrust();
    }

    // apply damping and movement
    const damping = this.speed > 110 ? 0.992 : 0.985;
    this.vx *= damping;
    this.vy *= damping;
    this.x += this.vx*dt;
    this.y += this.vy*dt;

    // firing logic
    const shotRange = preferRange * 1.4;
    const canSeeTarget = !targetInvisible;
    if(this.specialConfig && !this.activeSpecial && this.canUseSpecial()){
      let shouldUse = false;
      if(this.specialConfig.type === 'waveMotionGun'){
        const specRange = (this.specialConfig.length || 600) * 0.85;
        shouldUse = dist <= specRange;
      } else if(this.specialConfig.type === 'lunarCloak'){
        shouldUse = dist < preferRange * 0.9 || this.hp < this.type.hp * 0.45;
        if(!shouldUse && Math.random() < 0.04) shouldUse = true;
      } else if(this.specialConfig.type === 'orbitTurret'){
        const beamRange = (this.specialConfig.turret && this.specialConfig.turret.beamRange) || preferRange;
        shouldUse = dist <= beamRange * 0.95;
      }
      if(shouldUse){
        this.attemptSpecial();
      }
    }
    this.cool -= dt*1000;
    if(canSeeTarget && dist < shotRange && this.cool <= 0){
      if(this.shoot(aimAngle)){
        this.cool = this.fireRate * (0.7 + Math.random()*0.6);
      }
    }
  }
  processWarp(dt){
    if(!this.warp) return false;
    const warp = this.warp;
    warp.age += dt;
    const progress = Math.min(1, warp.age / warp.duration);
    const eased = easeOutCubic(progress);
    this.x = lerp(warp.from.x, warp.to.x, eased);
    this.y = lerp(warp.from.y, warp.to.y, eased);
    if(progress >= 1){
      this.warp = null;
      this.invulnerable = false;
      this.x = warp.to.x;
      this.y = warp.to.y;
      return false;
    }
    return true;
  }
  isWarping(){
    return !!this.warp;
  }
  shoot(angle){
    const energyCost = this.energyCost || 8;
    if(this.energy < energyCost) return false;
    this.energy = Math.max(0, this.energy - energyCost);
    const projectile = this.projectileConfig || {};
    const speed = projectile.speed || 420;
    const ttl = projectile.ttl || 2;
    const muzzleOffset = projectile.muzzleOffset || this.size;
    const damage = projectile.damage != null ? projectile.damage : 12;
    const originX = this.x + Math.cos(angle) * muzzleOffset;
    const originY = this.y + Math.sin(angle) * muzzleOffset;
    bullets.push({
      x: originX,
      y: originY,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      team: this.team,
      ttl,
      damage,
      raceId: this.type.id,
      projectile
    });
    this.lastShotAt = performance.now ? performance.now() : Date.now();
    if(this.control){
      lastShotTime = performance.now();
    }
    playSfx('fire', this.type.id);
    return true;
  }
  draw(ctx){
    const warping = this.isWarping();
    if(warping){
      this.drawWarpStreak(ctx);
      return;
    }
    const cloakAlpha = this.isCloaked() ? (this.cloakOpacity ?? 0.2) : 1;
    ctx.save();
    ctx.globalAlpha *= cloakAlpha;
    this.drawTrail(ctx);
    // soft glow behind ship
    const glowRadius = this.size * 1.6;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
    g.addColorStop(0, this.team==='A' ? 'rgba(120,220,255,0.08)' : 'rgba(120,255,150,0.06)');
    g.addColorStop(0.6, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x,this.y,glowRadius,0,Math.PI*2); ctx.fill();

    ctx.save();
    ctx.translate(this.x,this.y);
    const sprite = SHIP_SPRITES[this.type.id];
    if(sprite){
      ctx.rotate(this.angle + this.spriteAngleOffset);
      const scale = this.spriteScale || (this.size*2 / sprite.height);
      const w = sprite.width * scale;
      const h = sprite.height * scale;
      ctx.drawImage(sprite,-w/2,-h/2,w,h);
    } else {
      ctx.rotate(this.angle);
      // body
      ctx.fillStyle = this.color; ctx.strokeStyle = '#000';
      roundRect(ctx,-this.size/1.5,-this.size/1.2,this.size*1.6,this.size*1.2,4,true,false);
      ctx.fillStyle = '#fff'; ctx.fillRect(this.size*0.2,-this.size*0.25,4,4);
    }
    ctx.restore();
    if(this.type.id === 'obama'){
      this.drawObamaIonTrails(ctx);
    }
    // small engine flare for player (screen-space so appears regardless of sprite)
    if(this.control && keys.w){
      const fx = this.x - Math.cos(this.angle)*this.size*0.9;
      const fy = this.y - Math.sin(this.angle)*this.size*0.9;
      const fg = ctx.createRadialGradient(fx,fy,0,fx,fy,this.size*0.8);
      fg.addColorStop(0, rgba(this.trailColors.core, 0.95));
      fg.addColorStop(0.3, rgba(this.trailColors.mid, 0.7));
      fg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx,fy,this.size*0.65,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
    this.drawSpecial(ctx);
  }
  // Render the clustered white ion exhaust jets unique to Obama's cruiser.
  drawObamaIonTrails(ctx){
    if(this.type.id !== 'obama') return;
    if(this.isCloaked() && !this.control) return;
    const ports = this.getObamaIonPorts();
    if(!ports.length) return;
    const thrustFactor = this.thrusting ? 1 : 0.35;
    const backDirX = -Math.cos(this.angle);
    const backDirY = -Math.sin(this.angle);
    const length = this.size * (0.9 + thrustFactor*0.55);
    const width = Math.max(0.9, this.size * 0.15);
    const time = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ports.forEach((port, idx)=>{
      const flicker = 0.85 + Math.sin(time*0.006 + idx*0.8) * 0.15;
      const tipX = port.x + backDirX * length;
      const tipY = port.y + backDirY * length;
      const grad = ctx.createLinearGradient(port.x, port.y, tipX, tipY);
      grad.addColorStop(0, rgba([255,255,255], 0.8 * flicker));
      grad.addColorStop(0.35, rgba([210,235,255], 0.45 * flicker));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = width * (0.85 + 0.08 * (1 - idx/ports.length));
      ctx.beginPath();
      ctx.moveTo(port.x, port.y);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      const glow = ctx.createRadialGradient(port.x, port.y, 0, port.x, port.y, width*1.6);
      glow.addColorStop(0, rgba([255,255,255], 0.75));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(port.x, port.y, width*1.2, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.restore();
  }
  getObamaIonPorts(){
    if(this.type.id !== 'obama') return [];
    const offsets = [-1.05, -0.45, 0.45, 1.05];
    const lateralSpan = this.size * 0.32;
    const rearOffset = this.size * 0.55;
    const sideDirX = Math.cos(this.angle + Math.PI/2);
    const sideDirY = Math.sin(this.angle + Math.PI/2);
    const backDirX = -Math.cos(this.angle);
    const backDirY = -Math.sin(this.angle);
    return offsets.map(mult=>{
      const lateral = mult * lateralSpan;
      return {
        x: this.x + sideDirX * lateral + backDirX * rearOffset,
        y: this.y + sideDirY * lateral + backDirY * rearOffset
      };
    });
  }
  drawSpecial(ctx){
    const spec = this.activeSpecial;
    if(!spec) return;
    switch(spec.type){
      case 'waveMotionGun':
        this.drawWaveMotionGun(ctx, spec);
        break;
      case 'lunarCloak':
        // Cloak has no explicit drawing; optionally we could add shimmer particles later.
        break;
      case 'orbitTurret':
        this.drawOrbitTurret(ctx, spec);
        break;
      default:
        break;
    }
  }
  isCloaked(){
    return !!(this.activeSpecial && this.activeSpecial.type === 'lunarCloak');
  }
  endCloak(){
    this.cloakActive = false;
    this.cloakOpacity = 1;
  }
  drawWaveMotionGun(ctx, spec){
    const dirX = Math.cos(this.angle);
    const dirY = Math.sin(this.angle);
    const startX = this.x + dirX * this.size*0.8;
    const startY = this.y + dirY * this.size*0.8;
    const len = spec.length || 800;
    const pulse = 0.9 + Math.sin(spec.age*12)*0.12;
    const width = (spec.width || 20) * pulse;
    const auraWidth = width * 1.9;
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(this.angle);
    ctx.globalCompositeOperation = 'lighter';

    const auraGrad = ctx.createLinearGradient(0, 0, len, 0);
    auraGrad.addColorStop(0, 'rgba(255,255,255,0.28)');
    auraGrad.addColorStop(0.35, 'rgba(120,200,255,0.32)');
    auraGrad.addColorStop(0.7, 'rgba(30,110,255,0.24)');
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-len*0.06, -auraWidth/2, len*1.12, auraWidth);

    const hullGrad = ctx.createLinearGradient(0, 0, len, 0);
    hullGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    hullGrad.addColorStop(0.2, 'rgba(170,240,255,0.9)');
    hullGrad.addColorStop(0.55, 'rgba(70,170,255,0.85)');
    hullGrad.addColorStop(1, 'rgba(10,50,255,0.35)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = hullGrad;
    ctx.fillRect(0, -width/2, len, width);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(0, -width*0.25, len, width*0.5);

    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = width*0.12;
    ctx.beginPath();
    ctx.moveTo(0, width*0.35);
    ctx.lineTo(len*0.98, width*0.15);
    ctx.moveTo(0, -width*0.35);
    ctx.lineTo(len*0.95, -width*0.18);
    ctx.stroke();

    ctx.globalAlpha = 1;
    const muzzleRadius = Math.max(width*0.9, this.size*0.9);
    const muzzleGrad = ctx.createRadialGradient(0,0,muzzleRadius*0.1,0,0,muzzleRadius*2.2);
    muzzleGrad.addColorStop(0,'rgba(255,255,255,0.9)');
    muzzleGrad.addColorStop(0.35,'rgba(255,200,160,0.85)');
    muzzleGrad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = muzzleGrad;
    ctx.beginPath();
    ctx.arc(0,0,muzzleRadius*2.2,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
  drawOrbitTurret(ctx, spec){
    const turret = spec && spec.turret;
    if(!turret) return;
    const conf = spec.config || this.specialConfig || {};
    const turretConf = conf.turret || {};
    const orbitRadius = turretConf.orbitRadius || this.size*2.4;

    ctx.save();
    ctx.strokeStyle = 'rgba(140,220,255,0.18)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, orbitRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();

    const liveTarget = turret.target && turret.target.hp > 0 ? turret.target : null;
    const targetPos = liveTarget ? {x: turret.target.x, y: turret.target.y} : (turret.targetPos || null);
    if(targetPos){
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const width = (turretConf.beamWidth || 6) * (0.6 + (turret.beamPulse || 0));
      const beamGrad = ctx.createLinearGradient(turret.x, turret.y, targetPos.x, targetPos.y);
      beamGrad.addColorStop(0, 'rgba(190,255,255,0.95)');
      beamGrad.addColorStop(0.5, 'rgba(90,200,255,0.75)');
      beamGrad.addColorStop(1, 'rgba(30,120,255,0.35)');
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = Math.max(2.5, width);
      ctx.beginPath();
      ctx.moveTo(turret.x, turret.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(turret.x, turret.y);
    const bodyRadius = Math.max(7, this.size*0.7);
    const glow = ctx.createRadialGradient(0,0,0,0,0,bodyRadius*2.2);
    glow.addColorStop(0, 'rgba(200,255,255,0.65)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0,0,bodyRadius*2.2,0,Math.PI*2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    const housing = ctx.createRadialGradient(0,0,bodyRadius*0.2,0,0,bodyRadius);
    housing.addColorStop(0, 'rgba(255,255,255,0.95)');
    housing.addColorStop(0.7, 'rgba(120,210,255,0.9)');
    housing.addColorStop(1, 'rgba(20,70,150,0.95)');
    ctx.fillStyle = housing;
    ctx.beginPath();
    ctx.arc(0,0,bodyRadius,0,Math.PI*2);
    ctx.fill();

    const iris = ctx.createRadialGradient(0,0,bodyRadius*0.1,0,0,bodyRadius*0.65);
    iris.addColorStop(0, 'rgba(255,255,255,1)');
    iris.addColorStop(1, 'rgba(70,180,255,0.7)');
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(0,0,bodyRadius*0.7,0,Math.PI*2);
    ctx.fill();

    if(turret.pdFlash > 0){
      ctx.globalAlpha = turret.pdFlash;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0,0,bodyRadius*1.4,0,Math.PI*2);
      ctx.stroke();
    }

    ctx.restore();
  }
  addTrailSample(x,y,angle){
    this.trail.unshift({x,y,angle,life:1});
    if(this.trail.length>28) this.trail.pop();
  }
  markThrust(){
    this.thrusting = true;
  }
  emitEngineExhaust(){
    if(this.isCloaked() && !this.control) return;
    const backx = this.x - Math.cos(this.angle)*this.size*0.9;
    const backy = this.y - Math.sin(this.angle)*this.size*0.9;
    for(let p=0;p<2;p++){
      particles.push({
        x: backx + (Math.random()-0.5)*3,
        y: backy + (Math.random()-0.5)*3,
        vx: -Math.cos(this.angle)*(80+Math.random()*30) + (Math.random()-0.5)*8,
        vy: -Math.sin(this.angle)*(80+Math.random()*30) + (Math.random()-0.5)*8,
        life: 0.35 + Math.random()*0.2,
        size: 0.9 + Math.random()*1.1,
        core: this.trailColors.core,
        mid: this.trailColors.mid
      });
    }
    this.addTrailSample(backx, backy, this.angle);
    if(this.type.id === 'obama'){
      this.emitObamaIonExhaust();
    }
  }
  // Emit short-lived particles from each Obama exhaust port to reinforce the ion jets.
  emitObamaIonExhaust(){
    if(this.type.id !== 'obama') return;
    const ports = this.getObamaIonPorts();
    if(!ports.length) return;
    const backDirX = -Math.cos(this.angle);
    const backDirY = -Math.sin(this.angle);
    ports.forEach(port=>{
      particles.push({
        x: port.x + (Math.random()-0.5)*1.2,
        y: port.y + (Math.random()-0.5)*1.2,
        vx: backDirX*(100+Math.random()*60) + (Math.random()-0.5)*14,
        vy: backDirY*(100+Math.random()*60) + (Math.random()-0.5)*14,
        life: 0.22 + Math.random()*0.18,
        size: 0.65 + Math.random()*0.5,
        core: [255,255,255],
        mid: [200,240,255]
      });
    });
  }
  drawTrail(ctx){
    if(this.isCloaked() && !this.control) return;
    if(this.trail.length < 3) return;
    const pts = this.trail.map((seg, idx, arr)=>{
      const t = idx/Math.max(1, arr.length-1);
      const concave = t*t * this.size * 1.4;
      const bend = seg.angle + Math.PI/2;
      const dir = -1; // pull trail inward for concave arc
      return {
        x: seg.x + Math.cos(bend)*concave*dir,
        y: seg.y + Math.sin(bend)*concave*dir
      };
    });
    const head = pts[0];
    const tail = pts[pts.length-1];
    const tracePath = ()=>{
      ctx.beginPath();
      ctx.moveTo(head.x, head.y);
      for(let i=1;i<pts.length;i++){
        const prev = pts[i-1];
        const curr = pts[i];
        const midx = (prev.x + curr.x)/2;
        const midy = (prev.y + curr.y)/2;
        ctx.quadraticCurveTo(prev.x, prev.y, midx, midy);
      }
    };
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const baseWidth = Math.max(1.2, this.size*0.5);
    const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    gradient.addColorStop(0, rgba(this.trailColors.core, 0.85));
    gradient.addColorStop(0.6, rgba(this.trailColors.mid, 0.4));
    gradient.addColorStop(1, rgba(this.trailColors.mid, 0));
    tracePath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = baseWidth;
    ctx.stroke();
    tracePath();
    ctx.strokeStyle = rgba(this.trailColors.core, 0.45);
    ctx.lineWidth = baseWidth*0.35;
    ctx.stroke();
    ctx.restore();
  }
  drawWarpStreak(ctx){
    const warp = this.warp;
    if(!warp) return;
    const progress = Math.min(1, warp.age / warp.duration);
    const inv = 1 - progress;
    const distanceToTarget = Math.hypot(warp.to.x - warp.from.x, warp.to.y - warp.from.y);
    const streakLen = Math.max(this.size*4, distanceToTarget * (1 - progress) + this.size*2);
    const bodyWidth = this.size * (1.2 + inv*1.5);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(warp.angle || 0);
    const grad = ctx.createLinearGradient(-streakLen,0,this.size*1.5,0);
    grad.addColorStop(0,'rgba(0,0,0,0)');
    grad.addColorStop(0.35, rgba(this.trailColors.mid, 0.25 + 0.25*inv));
    grad.addColorStop(1, rgba(this.trailColors.core, 0.85));
    ctx.fillStyle = grad;
    const halfW = bodyWidth/2;
    ctx.beginPath();
    ctx.moveTo(-streakLen, -halfW);
    ctx.lineTo(this.size*1.6, -halfW);
    ctx.quadraticCurveTo(this.size*2.0,0,this.size*1.6,halfW);
    ctx.lineTo(-streakLen, halfW);
    ctx.quadraticCurveTo(-streakLen - halfW,0,-streakLen,-halfW);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if(typeof r==='number') r = {tl:r,tr:r,br:r,bl:r};
  ctx.beginPath(); ctx.moveTo(x+r.tl,y); ctx.lineTo(x+w-r.tr,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r.tr);
  ctx.lineTo(x+w,y+h-r.br); ctx.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
  ctx.lineTo(x+r.bl,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r.bl);
  ctx.lineTo(x,y+r.tl); ctx.quadraticCurveTo(x,y,x+r.tl,y);
  ctx.closePath(); if(fill) ctx.fill(); if(stroke) ctx.stroke();
}

function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

function rgba(rgb, alpha){ return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`; }

function getVictoryProgress(){
  if(!victoryState.active) return 0;
  const elapsed = performance.now() - victoryState.start;
  return Math.min(1, elapsed / victoryState.duration);
}

function getCameraTarget(){
  const progress = getVictoryProgress();
  if(progress > 0 && victoryState.ship){
    const ease = easeOutCubic(progress);
    const baseX = canvas.width/2;
    const baseY = canvas.height/2;
    const focus = victoryState.ship;
    return {
      x: lerp(baseX, focus.x, ease),
      y: lerp(baseY, focus.y, ease),
      scale: 1 + ease * 0.95
    };
  }

  const activeShips = ships.filter(s=> s && s.hp>0);
  if(!activeShips.length){
    cameraState.x = lerp(cameraState.x, canvas.width/2, CAMERA_CONFIG.lerp);
    cameraState.y = lerp(cameraState.y, canvas.height/2, CAMERA_CONFIG.lerp);
    cameraState.scale = lerp(cameraState.scale, 1, CAMERA_CONFIG.lerp);
    return {...cameraState};
  }

  let minX = activeShips[0].x, maxX = activeShips[0].x;
  let minY = activeShips[0].y, maxY = activeShips[0].y;
  activeShips.forEach(ship=>{
    minX = Math.min(minX, ship.x);
    maxX = Math.max(maxX, ship.x);
    minY = Math.min(minY, ship.y);
    maxY = Math.max(maxY, ship.y);
  });
  const padding = CAMERA_CONFIG.padding;
  const width = Math.max(1, (maxX - minX) + padding);
  const height = Math.max(1, (maxY - minY) + padding);
  const span = Math.max(width / canvas.width, height / canvas.height);
  const normalized = Math.min(1, Math.max(0, span));
  const targetScale = lerp(CAMERA_CONFIG.closeZoom, CAMERA_CONFIG.farZoom, normalized);
  const targetX = (minX + maxX)/2;
  const targetY = (minY + maxY)/2;

  cameraState.x = lerp(cameraState.x, targetX, CAMERA_CONFIG.lerp);
  cameraState.y = lerp(cameraState.y, targetY, CAMERA_CONFIG.lerp);
  cameraState.scale = lerp(cameraState.scale, targetScale, CAMERA_CONFIG.lerp*0.9);
  return {...cameraState};
}

function applyCameraTransform(ctx){
  const cam = getCameraTarget();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(cam.scale, cam.scale);
  ctx.translate(-cam.x, -cam.y);
}

function lerp(a,b,t){ return a + (b-a)*Math.min(Math.max(t,0),1); }

function easeOutCubic(t){
  const clamped = Math.min(Math.max(t,0),1);
  const inv = 1 - clamped;
  return 1 - inv*inv*inv;
}

function normalizeAngle(a){
  while(a > Math.PI) a -= Math.PI*2;
  while(a < -Math.PI) a += Math.PI*2;
  return a;
}

function rotateToward(current, target, maxDelta){
  const diff = normalizeAngle(target - current);
  const clamped = Math.max(-maxDelta, Math.min(maxDelta, diff));
  return normalizeAngle(current + clamped);
}

function computeLeadAngle(shooter, target, projectileSpeed){
  const relX = target.x - shooter.x;
  const relY = target.y - shooter.y;
  const relVx = (target.vx || 0) - (shooter.vx || 0);
  const relVy = (target.vy || 0) - (shooter.vy || 0);
  const a = relVx*relVx + relVy*relVy - projectileSpeed*projectileSpeed;
  const b = 2*(relX*relVx + relY*relVy);
  const c = relX*relX + relY*relY;
  if(Math.abs(a) < 1e-6){
    if(Math.abs(b) < 1e-6) return Math.atan2(relY, relX);
    const t = -c / b;
    if(t <= 0) return Math.atan2(relY, relX);
    return Math.atan2(relY + relVy*t, relX + relVx*t);
  }
  const disc = b*b - 4*a*c;
  if(disc < 0) return Math.atan2(relY, relX);
  const sqrt = Math.sqrt(disc);
  const t1 = (-b + sqrt)/(2*a);
  const t2 = (-b - sqrt)/(2*a);
  const time = Math.min(t1,t2) > 0 ? Math.min(t1,t2) : Math.max(t1,t2);
  if(!isFinite(time) || time <= 0) return Math.atan2(relY, relX);
  const aimX = relX + relVx * time;
  const aimY = relY + relVy * time;
  return Math.atan2(aimY, aimX);
}

function willBulletHit(ship, bullet){
  const relX = ship.x - bullet.x;
  const relY = ship.y - bullet.y;
  const speedSq = bullet.dx*bullet.dx + bullet.dy*bullet.dy;
  if(speedSq < 1) return false;
  const t = (relX*bullet.dx + relY*bullet.dy) / speedSq;
  if(t < 0 || t > 0.9) return false;
  const closestX = bullet.x + bullet.dx * t;
  const closestY = bullet.y + bullet.dy * t;
  const dist = Math.hypot(closestX - ship.x, closestY - ship.y);
  return dist < ship.size * 1.3;
}

function spawnExplosion(ship){
  const colors = ship.trailColors || DEFAULT_TRAIL_COLORS;
  const core = colors.core || DEFAULT_TRAIL_COLORS.core;
  const mid = colors.mid || DEFAULT_TRAIL_COLORS.mid;
  const burstCount = 18 + Math.floor(ship.size * 1.8);
  for(let i=0;i<burstCount;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = 80 + Math.random()*220;
    particles.push({
      x: ship.x + Math.cos(angle)*2,
      y: ship.y + Math.sin(angle)*2,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      life: 0.6 + Math.random()*0.7,
      size: 2.5 + Math.random()*4,
      sizeDecay: 0.9,
      core,
      mid
    });
  }
  explosions.push({
    x: ship.x,
    y: ship.y,
    age: 0,
    duration: 0.8,
    maxRadius: ship.size * 6
  });
}

function randBetween(min, max){
  return min + Math.random() * (max - min);
}

function wrapToRange(value, min, max){
  const span = max - min;
  if(span <= 0) return value;
  let v = (value - min) % span;
  if(v < 0) v += span;
  return min + v;
}

function generatePlanets(){
  const list = [];
  const count = Math.max(1, PLANET_CONFIG.count);
  for(let i=0;i<count;i++) list.push(createPlanet());
  return list;
}

function createPlanet(){
  const palette = PLANET_CONFIG.palettes[Math.floor(Math.random()*PLANET_CONFIG.palettes.length)];
  const radius = randBetween(PLANET_CONFIG.minRadius, PLANET_CONFIG.maxRadius);
  const ring = Math.random() < PLANET_CONFIG.ringChance ? {
    tilt: randBetween(-0.35, 0.35),
    scale: randBetween(1.5, 2.1),
    width: randBetween(0.12, 0.2),
    color: palette.ring || 'rgba(200,210,255,0.45)'
  } : null;
  const bands = [];
  const bandCount = 2 + Math.floor(Math.random()*2);
  for(let i=0;i<bandCount;i++){
    bands.push({
      angle: Math.random()*Math.PI,
      squish: randBetween(0.45, 0.8),
      alpha: randBetween(0.05, 0.12)
    });
  }
  return {
    x: randBetween(-SECTOR_PADDING*0.5, canvas.width + SECTOR_PADDING*0.5),
    y: randBetween(-SECTOR_PADDING*0.5, canvas.height + SECTOR_PADDING*0.5),
    r: radius,
    palette,
    ring,
    bands,
    hitFlash: 0
  };
}

function drawPlanet(ctx, planet){
  if(!planet) return;
  ctx.save();
  ctx.translate(planet.x, planet.y);

  if(planet.ring){
    ctx.save();
    ctx.rotate(planet.ring.tilt);
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = planet.ring.color;
    ctx.lineWidth = planet.r * planet.ring.width;
    ctx.beginPath();
    ctx.ellipse(0,0, planet.r * planet.ring.scale, planet.r * 0.6, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 0.22;
    ctx.lineWidth *= 0.6;
    ctx.beginPath();
    ctx.ellipse(0,0, planet.r * (planet.ring.scale + 0.25), planet.r * 0.65, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  const grad = ctx.createRadialGradient(-planet.r*0.4, -planet.r*0.5, planet.r*0.2, 0, 0, planet.r*1.15);
  grad.addColorStop(0, planet.palette.light);
  grad.addColorStop(0.55, planet.palette.mid);
  grad.addColorStop(1, planet.palette.dark);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0,0, planet.r, 0, Math.PI*2);
  ctx.fill();

  planet.bands.forEach(band=>{
    ctx.globalAlpha = band.alpha;
    ctx.fillStyle = planet.palette.accent;
    ctx.beginPath();
    ctx.ellipse(0, 0, planet.r*0.95, planet.r * band.squish, band.angle, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-planet.r*0.2, -planet.r*0.25, planet.r*0.65, Math.PI*0.2, Math.PI*1.1);
  ctx.stroke();

  const flash = planet.hitFlash ? Math.max(0, 1 - (performance.now() - planet.hitFlash)/280) : 0;
  if(flash > 0){
    ctx.globalAlpha = flash * 0.55;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(0,0, planet.r*1.05, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function spawnPlanetImpact(planet, bullet){
  if(!planet) return;
  const impactAngle = Math.atan2(bullet.dy || 0, bullet.dx || 1);
  const impactX = bullet.x;
  const impactY = bullet.y;
  for(let i=0;i<5;i++){
    particles.push({
      x: impactX,
      y: impactY,
      vx: Math.cos(impactAngle + (Math.random()-0.5)*0.9) * (70 + Math.random()*90),
      vy: Math.sin(impactAngle + (Math.random()-0.5)*0.9) * (70 + Math.random()*90),
      life: 0.28 + Math.random()*0.25,
      size: 0.8 + Math.random()*0.8,
      core: [255, 230, 180],
      mid: [210, 170, 120],
      damp: 0.9
    });
  }
  planet.hitFlash = performance.now();
}

function updateFartClouds(dt){
  if(!fartClouds.length) return;
  fartClouds.forEach(cloud=>{
    if(cloud.dead) return;
    cloud.age += dt;
    if(cloud.age >= (cloud.duration || 1)){
      cloud.dead = true;
      return;
    }
    cloud.windTimer -= dt;
    if(cloud.windTimer <= 0){
      cloud.windTimer = 1.4 + Math.random()*1.6;
      cloud.windAngle += (Math.random()-0.5)*0.9;
      cloud.windStrength *= 0.6 + Math.random()*0.8;
    }
    const gust = cloud.windStrength || 0;
    cloud.vx += Math.cos(cloud.windAngle || 0) * gust * 0.12 * dt;
    cloud.vy += Math.sin(cloud.windAngle || 0) * gust * 0.12 * dt;
    cloud.x += (cloud.vx || 0) * dt;
    cloud.y += (cloud.vy || 0) * dt;
    cloud.vx *= cloud.driftDecay || 0.995;
    cloud.vy *= cloud.driftDecay || 0.995;
    const expandTime = Math.max(0.01, cloud.expandTime || 1);
    const t = Math.min(1, cloud.age / expandTime);
    const targetRadius = lerp(cloud.baseRadius || cloud.radius || 60, cloud.maxRadius || 90, t);
    const pulse = 1 + Math.sin((cloud.age + (cloud.noiseSeed || 0))*3.2) * 0.12;
    cloud.currentRadius = targetRadius;
    cloud.displayRadius = targetRadius * pulse;
    if(cloud.swirls){
      cloud.swirls.forEach(swirl=>{
        swirl.angle += swirl.speed * dt;
      });
    }
    if(cloud.puffs){
      cloud.puffs.forEach(puff=>{
        puff.offsetAngle += puff.wobbleSpeed * dt * 0.35;
        puff.wobblePhase += puff.wobbleSpeed * dt;
      });
    }
    if(cloud.wisps){
      const minDist = (cloud.baseRadius || 40) * 0.15;
      const maxDist = (cloud.maxRadius || 120) * 1.15;
      cloud.wisps.forEach(wisp=>{
        wisp.angle += dt * 0.35;
        wisp.distance += (wisp.driftSpeed || 10) * dt * 0.1;
        if(wisp.distance > maxDist) wisp.distance = minDist + Math.random()*(maxDist-minDist);
        if(wisp.distance < minDist) wisp.distance = minDist;
      });
    }
    const dps = cloud.damagePerSecond || 18;
    ships.forEach(ship=>{
      if(ship.team === cloud.team || ship.hp <= 0 || ship.isWarping()) return;
      const dist = Math.hypot(ship.x - cloud.x, ship.y - cloud.y);
      if(dist <= targetRadius){
        applyDamage(ship, dps * dt);
      }
    });
  });
  fartClouds = fartClouds.filter(cloud=> !cloud.dead);
}

function drawFartClouds(ctx){
  if(!fartClouds.length) return;
  fartClouds.forEach(cloud=>{
    const radius = Math.max(8, cloud.displayRadius || cloud.currentRadius || cloud.baseRadius || 0);
    if(radius <= 0) return;
    const lifetime = Math.max(0.0001, cloud.duration || 1);
    const remaining = Math.max(0, 1 - cloud.age / lifetime);
    const alpha = (cloud.opacity || 0.65) * remaining;
    if(alpha <= 0.02) return;

    const colors = cloud.colors || {};
    const inner = colors.core || [255,210,120];
    const mid = colors.mid || [230,150,60];
    const outer = colors.outer || [120,60,10];
    const accent = colors.accent || [255,190,120];
    const seed = cloud.textureSeed ?? cloud.noiseSeed ?? 0;
    const nebulaAngle = (seed * 0.37 + cloud.age*0.05) % (Math.PI*2);
    const veilTilt = 0.7 + Math.sin(seed + cloud.age*0.42)*0.18;
    const mixColor = (a,b,t)=>[
      Math.round(a[0] + (b[0]-a[0])*t),
      Math.round(a[1] + (b[1]-a[1])*t),
      Math.round(a[2] + (b[2]-a[2])*t)
    ];
    const iridescent = mixColor(inner, accent, 0.55);
    const deep = mixColor(mid, outer, 0.7);
    const faint = mixColor(accent, [255,255,255], 0.4);

    ctx.save();
    ctx.translate(cloud.x, cloud.y);
    ctx.globalCompositeOperation = 'lighter';

    ctx.save();
    ctx.rotate(nebulaAngle);
    ctx.globalAlpha = alpha * 0.55;
    const veilGrad = ctx.createLinearGradient(-radius*1.8, 0, radius*1.8, 0);
    veilGrad.addColorStop(0, rgba(outer, 0));
    veilGrad.addColorStop(0.35, rgba(deep, 0.35));
    veilGrad.addColorStop(0.65, rgba(iridescent, 0.25));
    veilGrad.addColorStop(1, rgba(outer, 0));
    ctx.fillStyle = veilGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius*1.9, radius*veilTilt*1.25, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    const halo = ctx.createRadialGradient(0,0,radius*0.35,0,0,radius*1.6);
    halo.addColorStop(0, rgba(inner, 0.28));
    halo.addColorStop(0.6, rgba(mid, 0.08));
    halo.addColorStop(1, rgba(outer, 0));
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0,0,radius*1.5,0,Math.PI*2);
    ctx.fill();

    const lobeCount = cloud.lobeCount || 18;
    const angleStep = (Math.PI*2) / lobeCount;
    ctx.globalAlpha = alpha * 0.95;
    ctx.beginPath();
    for(let i=0;i<=lobeCount;i++){
      const angle = angleStep * i;
      const wobble = Math.sin(seed + angle*3.1 + cloud.age*1.7) * 0.18;
      const wobble2 = Math.cos(seed*0.8 + angle*2.4 + cloud.age*1.1) * 0.12;
      const lobeRadius = radius * (0.78 + wobble + wobble2);
      const px = Math.cos(angle) * lobeRadius;
      const py = Math.sin(angle) * lobeRadius * 0.82;
      if(i===0){
        ctx.moveTo(px, py);
      } else {
        const ctrlAngle = angle - angleStep/2;
        const ctrlRadius = radius * (0.74 + wobble*0.5);
        const cx = Math.cos(ctrlAngle) * ctrlRadius;
        const cy = Math.sin(ctrlAngle) * ctrlRadius * 0.82;
        ctx.quadraticCurveTo(cx, cy, px, py);
      }
    }
    ctx.closePath();

    const blobGrad = ctx.createRadialGradient(0,0,radius*0.15,0,0,radius*1.2);
    blobGrad.addColorStop(0, rgba(inner, 0.82));
    blobGrad.addColorStop(0.4, rgba(iridescent, 0.58));
    blobGrad.addColorStop(0.75, rgba(mid, 0.28));
    blobGrad.addColorStop(1, rgba(outer, 0.08));
    ctx.fillStyle = blobGrad;
    ctx.fill();

    ctx.globalAlpha = alpha * 0.32;
    ctx.strokeStyle = rgba(iridescent, 0.45);
    ctx.lineWidth = Math.max(1.5, radius*0.05);
    ctx.stroke();

    const veinCount = Math.max(2, Math.round(radius/32));
    ctx.globalAlpha = alpha * 0.4;
    for(let i=0;i<veinCount;i++){
      const veinAngle = nebulaAngle + (i - veinCount/2) * 0.22;
      const wave = Math.sin(seed*2.1 + i*1.7 + cloud.age*0.9) * 0.4;
      const startR = radius * (0.3 + i/veinCount*0.4);
      const endR = radius * (0.9 + wave*0.08);
      const sx = Math.cos(veinAngle) * startR;
      const sy = Math.sin(veinAngle) * startR * 0.82;
      const ex = Math.cos(veinAngle + wave*0.25) * endR;
      const ey = Math.sin(veinAngle + wave*0.25) * endR * 0.78;
      ctx.strokeStyle = rgba(faint, 0.32);
      ctx.lineWidth = Math.max(1, radius*0.02);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        (sx+ex)/2 + Math.sin(seed + i)*radius*0.08,
        (sy+ey)/2 + Math.cos(seed*0.7 + i)*radius*0.05,
        ex,
        ey
      );
      ctx.stroke();
    }

    if(cloud.swirls && cloud.swirls.length){
      ctx.globalAlpha = alpha * 0.7;
      cloud.swirls.forEach(swirl=>{
        const sx = Math.cos(swirl.angle) * swirl.radius;
        const sy = Math.sin(swirl.angle) * swirl.radius * 0.78;
        const sr = (swirl.size || radius*0.24);
        const swirlGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        swirlGrad.addColorStop(0, rgba(iridescent, 0.45));
        swirlGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = swirlGrad;
        ctx.beginPath();
        ctx.ellipse(sx, sy, sr, sr*0.85, swirl.angle*0.4, 0, Math.PI*2);
        ctx.fill();
      });
    }

    if(cloud.puffs && cloud.puffs.length){
      ctx.globalAlpha = alpha * 0.75;
      cloud.puffs.forEach(puff=>{
        const wobble = Math.sin(puff.wobblePhase || 0) * (puff.wobbleAmount || radius*0.1);
        const offset = (puff.offsetRadius || radius*0.45) + wobble;
        const px = Math.cos(puff.offsetAngle || 0) * offset;
        const py = Math.sin(puff.offsetAngle || 0) * offset * (puff.squash || 0.82);
        const pr = (puff.radius || radius*0.3) * (puff.jitter || 1);
        const puffGrad = ctx.createRadialGradient(px, py, 0, px, py, pr*1.4);
        puffGrad.addColorStop(0, rgba(iridescent, 0.85));
        puffGrad.addColorStop(0.5, rgba(mid, 0.5));
        puffGrad.addColorStop(1, rgba(outer, 0));
        ctx.fillStyle = puffGrad;
        ctx.beginPath();
        ctx.ellipse(px, py, pr, pr*(puff.squash || 0.85), 0, 0, Math.PI*2);
        ctx.fill();
      });
    }

    if(cloud.wisps && cloud.wisps.length){
      ctx.globalAlpha = alpha * 0.45;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      cloud.wisps.forEach(wisp=>{
        const dist = wisp.distance || radius*0.55;
        const baseAngle = wisp.angle || 0;
        const startX = Math.cos(baseAngle) * dist;
        const startY = Math.sin(baseAngle) * dist * 0.8;
        const dirAngle = baseAngle + (Math.sin((wisp.offset || 0) + cloud.age*0.6) * 0.35);
        const endX = startX + Math.cos(dirAngle) * (wisp.length || radius*0.3);
        const endY = startY + Math.sin(dirAngle) * (wisp.length || radius*0.3) * 0.8;
        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, rgba(accent, 0));
        grad.addColorStop(0.4, rgba(iridescent, wisp.alpha || 0.35));
        grad.addColorStop(1, rgba(inner, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = (wisp.thickness || 1.5);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(
          (startX + endX)/2 + Math.cos(dirAngle+Math.PI/2)*4,
          (startY + endY)/2 + Math.sin(dirAngle+Math.PI/2)*3,
          endX,
          endY
        );
        ctx.stroke();
      });
    }

    ctx.globalAlpha = alpha * 0.25;
    const sparkleCount = cloud.sparkles || 6;
    for(let i=0;i<sparkleCount;i++){
      const sparkleAngle = (seed * 3.1 + i*2.3 + cloud.age*0.4) % (Math.PI*2);
      const sparkleRadius = radius * (0.2 + ((i+1)/sparkleCount)*0.7);
      const sx = Math.cos(sparkleAngle) * sparkleRadius;
      const sy = Math.sin(sparkleAngle) * sparkleRadius * 0.85;
      const sr = Math.max(1, radius*0.04 * (0.7 + (i/sparkleCount)));
      const sparkGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr*2);
      sparkGrad.addColorStop(0, rgba(faint, 0.8));
      sparkGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, sr*1.8, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  });
}

function applyDamage(ship, amount){
  if(ship.hp <= 0 || amount <= 0) return;
  if(ship.invulnerable) return;
  ship.hp = Math.max(0, ship.hp - amount);
  if(ship.hp === 0 && !ship._playedDeath){
    ship._playedDeath = true;
    spawnExplosion(ship);
    playShipDeath();
    if(ship.control) triggerAvatarStatic();
  }
}

function spawnBattle(){
  ships = []; bullets = [];
  explosions = [];
  fartClouds = [];
  clearAllSectorClouds();
  currentSector = {sx:0, sy:0};
  syncSectorClouds(currentSector.sx, currentSector.sy, fartClouds);
  // generate map: stars and planets
  // parallax star layers
  starLayers = [];
  const LAYERS = 3;
  const starSpanW = canvas.width + SECTOR_PADDING*2;
  const starSpanH = canvas.height + SECTOR_PADDING*2;
  for(let L=0; L<LAYERS; L++){
    const layer = [];
    const count = 60 + L*40;
    for(let i=0;i<count;i++){
      layer.push({
        x: Math.random()*starSpanW - SECTOR_PADDING,
        y: Math.random()*starSpanH - SECTOR_PADDING,
        r: Math.random()*(1.2 - L*0.25)+0.3
      });
    }
    starLayers.push({stars:layer, depth: 0.2 + L*0.6});
  }
  planets = generatePlanets();
  // spawn a single player-controlled ship for Team A and a small enemy formation for Team B
  const enemyCount = 6;
  // player ship
  const player = new Ship(selectionA, 180, canvas.height/2, 'A');
  player.control = true; player.color = '#8ff';
  player.beginWarpFrom(-player.size*8, player.y + (Math.random()*60 - 30));
  ships.push(player);
  // single enemy ship
  const enemy = new Ship(selectionB, canvas.width-180, canvas.height/2, 'B');
  enemy.beginWarpFrom(canvas.width + enemy.size*8, enemy.y + (Math.random()*60 - 30));
  ships.push(enemy);
}

function changeSector(dx,dy,player){
  // move to new sector
  syncSectorClouds(currentSector.sx, currentSector.sy, fartClouds);
  currentSector.sx += dx; currentSector.sy += dy;
  const existingClouds = getCloudsForSector(currentSector.sx, currentSector.sy);
  if(existingClouds){
    fartClouds = existingClouds;
  } else {
    fartClouds = [];
    syncSectorClouds(currentSector.sx, currentSector.sy, fartClouds);
  }
  // regenerate map content
  starLayers = [];
  const LAYERS = 3;
  const starSpanW = canvas.width + SECTOR_PADDING*2;
  const starSpanH = canvas.height + SECTOR_PADDING*2;
  for(let L=0; L<LAYERS; L++){
    const layer = [];
    const count = 60 + L*40;
    for(let i=0;i<count;i++){
      layer.push({
        x: Math.random()*starSpanW - SECTOR_PADDING,
        y: Math.random()*starSpanH - SECTOR_PADDING,
        r: Math.random()*(1.2 - L*0.25)+0.3
      });
    }
    starLayers.push({stars:layer, depth: 0.2 + L*0.6});
  }
  planets = generatePlanets();
  // clear bullets
  bullets = [];
  explosions = [];
  // reposition player to opposite edge depending on direction
  if(dx>0) player.x = SECTOR_ENTRY_OFFSET_X;
  else if(dx<0) player.x = canvas.width - SECTOR_ENTRY_OFFSET_X;
  if(dy>0) player.y = SECTOR_ENTRY_OFFSET_Y;
  else if(dy<0) player.y = canvas.height - SECTOR_ENTRY_OFFSET_Y;
  // reposition existing non-player ships to the far side (preserve HP/state), or create one if none exist
  const others = ships.filter(s=> !s.control);
  const margin = 180;
  const baseX = (player.x < canvas.width/2) ? (canvas.width - margin) : margin;
  const baseY = (player.y < canvas.height/2) ? (canvas.height - 120) : 120;
  if(others.length === 0){
    const enemy = new Ship(selectionB, baseX, baseY, 'B');
    const startX = player.x < canvas.width/2 ? canvas.width + enemy.size*6 : -enemy.size*6;
    const startY = baseY + (Math.random()*80 - 40);
    enemy.beginWarpFrom(startX, startY);
    ships.push(enemy);
  } else {
    // spread existing enemies so they don't overlap the player
    others.forEach((s,i)=>{
      const spread = 40;
      s.x = baseX + (i - (others.length-1)/2) * spread;
      s.y = baseY + (i % 2 === 0 ? 0 : 30);
      s.vx = 0; s.vy = 0;
    });
  }
}

startBtn.addEventListener('click', ()=>{
  playUiClick();
  showShipOverlay();
});
resetBtn.addEventListener('click', ()=>{
  playUiClick();
  running=false;
  stopBattleMusic();
  resetVictoryState();
  resetAvatarFeed();
  ships=[]; bullets=[]; explosions=[]; fartClouds=[];
  clearAllSectorClouds();
  hideShipOverlay();
  initializeHudMeters();
  drawPaused();
});
if(overlayCancel){
  overlayCancel.addEventListener('click', ()=>{
    hideShipOverlay();
  });
}
if(overlayStart){
  overlayStart.addEventListener('click', ()=>{
    playUiClick();
    startBattle();
  });
}

// Main loop
let last = 0;
function loop(t){
  const dt = Math.min(0.05,(t-last)/1000); last = t;
  const animateVictory = victoryState.active;
  const waitingVictory = pendingVictory.active;
  if(!running && !animateVictory && !waitingVictory){
    drawPaused();
    return;
  }

  let player = null;
  if(running){
    ships.forEach(s=> s.hp>0 && s.update(dt));
    player = ships.find(s=> s.control);
    bullets.forEach(b=>{ b.x += b.dx*dt; b.y += b.dy*dt; b.ttl -= dt; });
    bullets = bullets.filter(b=> b.ttl>0 && b.x> -50 && b.x < canvas.width+50 && b.y > -50 && b.y < canvas.height+50);
    bullets.forEach(b=>{
      ships.forEach(s=>{
        if(s.team!==b.team && s.hp>0 && !s.isWarping()){
          const d = Math.hypot(b.x-s.x,b.y-s.y);
          if(d < s.size){
            const damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 12);
            applyDamage(s, damage);
            b.ttl = 0;
          }
        }
      });
      if(b.ttl > 0){
        planets.forEach(p=>{
          if(Math.hypot(b.x - p.x, b.y - p.y) < p.r){
            spawnPlanetImpact(p, b);
            b.ttl = 0;
          }
        });
      }
    });
    ships.forEach(s=>{
      if(s.isWarping()) return;
      planets.forEach(p=>{
        const d = Math.hypot(s.x-p.x,s.y-p.y);
        if(d < p.r + s.size*0.55){
          const overlap = p.r + s.size*0.55 - d;
          const nx = (s.x - p.x)/d || 1;
          const ny = (s.y - p.y)/d || 0;
          s.x += nx * overlap; s.y += ny * overlap;
          s.vx *= -0.4; s.vy *= -0.4;
          applyDamage(s,4);
        }
      })
    });
    updateFartClouds(dt);
    if(player){
      let dx = 0, dy = 0;
      const horizontalThreshold = canvas.width + SECTOR_EXIT_BUFFER;
      const verticalThreshold = canvas.height + SECTOR_EXIT_BUFFER;
      if(player.x < -SECTOR_EXIT_BUFFER) dx = -1;
      else if(player.x > horizontalThreshold) dx = 1;
      if(player.y < -SECTOR_EXIT_BUFFER) dy = -1;
      else if(player.y > verticalThreshold) dy = 1;
      if(dx !== 0 || dy !== 0){
        changeSector(dx,dy,player);
        player.vx *= 0.2; player.vy *= 0.2;
      }
    }
  }

  particles.forEach(p=>{
    p.x += p.vx*dt;
    p.y += p.vy*dt;
    p.life -= dt;
    p.size *= (p.sizeDecay || 0.98);
    if(p.damp){ p.vx *= p.damp; p.vy *= p.damp; }
  });
  particles = particles.filter(p=> p.life>0 && p.size>0.3 && p.x>-100 && p.x<canvas.width+100 && p.y>-100 && p.y<canvas.height+100);
  explosions.forEach(e=>{ e.age += dt; });
  explosions = explosions.filter(e=> e.age < e.duration);
  // avatar and HUD updates
  const now = performance.now();
  const playerForHud = ships.find(s=> s.control);
  const playerSpecialActive = !!(playerForHud && playerForHud.activeSpecial);
  if(avatarVictoryLock){
    avatarState = 'victory';
  } else if(avatarFeedLost){
    avatarState = 'static';
  } else if(playerSpecialActive) avatarState = 'special';
  else if(now < specialActiveUntil) avatarState = 'special';
  else if(now - lastShotTime < 300) avatarState = 'fire';
  else if(playerForHud && keys.w) avatarState = 'thrust';
  else if(playerForHud && keys.a && !keys.d) avatarState = 'left';
  else if(playerForHud && keys.d && !keys.a) avatarState = 'right';
  else avatarState = 'idle';
  updateAvatarImg();
  // update HUD values
  const playerHealthPercent = playerForHud ? (Math.max(0, playerForHud.hp) / playerForHud.type.hp) * 100 : 0;
  updateSegmentMeter(playerCrewBarEl, 'crew-seg', 'empty', playerHealthPercent, CREW_SEGMENTS);

  const playerEnergyPercent = playerForHud ? (playerForHud.energy / playerForHud.maxEnergy) * 100 : 0;
  updateSegmentMeter(playerBatteryGridEl, 'battery-seg', 'drained', playerEnergyPercent, BATTERY_SEGMENTS);
  if(playerEnergyTextEl) playerEnergyTextEl.textContent = `${Math.round(Math.max(0, Math.min(100, playerEnergyPercent)))}%`;

  const enemies = ships.filter(s=> !s.control && s.hp>0);
  if(enemies.length){
    const e = enemies[0];
    const enemyHealthPercent = (Math.max(0, e.hp) / e.type.hp) * 100;
    updateSegmentMeter(enemyCrewBarEl, 'crew-seg', 'empty', enemyHealthPercent, CREW_SEGMENTS);
    const enemyEnergyPercent = (e.energy / e.maxEnergy) * 100;
    updateSegmentMeter(enemyBatteryGridEl, 'battery-seg', 'drained', enemyEnergyPercent, BATTERY_SEGMENTS);
    if(enemyEnergyTextEl) enemyEnergyTextEl.textContent = `${Math.round(Math.max(0, Math.min(100, enemyEnergyPercent)))}%`;
    currentEnemyRace = e.type.id;
    if(enemyAvatarVictoryLock) enemyAvatarState = 'victory';
    else enemyAvatarState = deriveShipAvatarState(e, now);
    updateEnemyAvatarImg();
  } else {
    if(enemyCrewBarEl) enemyCrewBarEl.innerHTML = '';
    if(enemyBatteryGridEl) enemyBatteryGridEl.innerHTML = '';
    if(enemyEnergyTextEl) enemyEnergyTextEl.textContent = '0%';
    currentEnemyRace = null;
    enemyAvatarState = enemyAvatarVictoryLock ? 'victory' : 'idle';
    updateEnemyAvatarImg();
  }
  if(running){
    const aliveA = ships.some(s=>s.team==='A' && s.hp>0);
    const aliveB = ships.some(s=>s.team==='B' && s.hp>0);
    if((!aliveA || !aliveB) && !pendingVictory.active && !victoryState.active){
      const winner = ships.find(s=> s.hp>0);
      if(winner) scheduleVictory(winner);
    }
  }
  if(pendingVictory.active){
    if((performance.now() - pendingVictory.start) >= VICTORY_DELAY_MS){
      const winner = pendingVictory.winner;
      pendingVictory.active = false;
      triggerVictory(winner);
    }
  } else if(victoryState.active){
    if((performance.now() - victoryState.start) >= (victoryState.duration + VICTORY_AFTERGLOW)){
      victoryState.active = false;
      running = false;
    }
  }

  ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const playerForParallax = ships.find(s=>s.control) || {x: canvas.width/2, y: canvas.height/2};

  ctx.save();
  applyCameraTransform(ctx);
  const starMinX = -SECTOR_PADDING;
  const starMaxX = canvas.width + SECTOR_PADDING;
  const starMinY = -SECTOR_PADDING;
  const starMaxY = canvas.height + SECTOR_PADDING;
  for(let li=0; li<starLayers.length; li++){
    const layer = starLayers[li];
    const depth = layer.depth;
    ctx.fillStyle = li===0 ? '#445' : (li===1 ? '#88a' : '#ccf');
    layer.stars.forEach(st=>{
      const ox = (playerForParallax.x - canvas.width/2) * depth * 0.05;
      const oy = (playerForParallax.y - canvas.height/2) * depth * 0.05;
      const x = wrapToRange(st.x + ox, starMinX, starMaxX);
      const y = wrapToRange(st.y + oy, starMinY, starMaxY);
      ctx.globalAlpha = 0.4 + (0.6 * (1 - li*0.2)) * Math.random();
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.max(1, st.r), Math.max(1, st.r));
    });
  }
  ctx.globalAlpha = 1;
  planets.forEach(p=> drawPlanet(ctx, p));
  drawFartClouds(ctx);
  ships.forEach(s=> s.hp>0 && s.draw(ctx));
  ctx.globalCompositeOperation = 'lighter';
  particles.forEach(p=>{
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*3);
    const core = p.core || DEFAULT_TRAIL_COLORS.core;
    const mid = p.mid || DEFAULT_TRAIL_COLORS.mid;
    g.addColorStop(0, rgba(core, 0.9 * p.life));
    g.addColorStop(0.5, rgba(mid, 0.6 * p.life));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(1,p.size*3),0,Math.PI*2); ctx.fill();
  });
  bullets.forEach(b=>{
    const style = (b.projectile && b.projectile.style) || 'default';
    if(style === 'plasmaBolt'){
      const length = b.projectile.length || 32;
      const radius = b.projectile.radius || 4;
      const core = b.projectile.core || [220,200,255];
      const mid = b.projectile.mid || [140,80,220];
      const tail = b.projectile.tail || [60,20,120];
      const angle = Math.atan2(b.dy, b.dx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalAlpha = 0.95;
      const grad = ctx.createLinearGradient(-length/2,0,length/2,0);
      grad.addColorStop(0, rgba(tail, 0));
      grad.addColorStop(0.25, rgba(mid, 0.7));
      grad.addColorStop(0.55, rgba(core, 1));
      grad.addColorStop(1, rgba(core, 0.6));
      ctx.fillStyle = grad;
      const height = radius * 1.6;
      ctx.fillRect(-length/2, -height/2, length, height);
      ctx.globalAlpha = 1;
      const halo = ctx.createRadialGradient(0,0,0,0,0, radius*2.6);
      halo.addColorStop(0, rgba(core, 0.85));
      halo.addColorStop(0.4, rgba(mid, 0.4));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.ellipse(0,0,length*0.52,radius*1.6,0,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else if(style === 'plasmaOrb'){
      const radius = b.projectile.radius || 10;
      const tailLength = b.projectile.tailLength || 40;
      const tailWidth = b.projectile.tailWidth || radius*1.6;
      const core = b.projectile.core || [255,245,210];
      const mid = b.projectile.mid || [255,180,90];
      const rim = b.projectile.rim || [255,120,40];
      const angle = Math.atan2(b.dy, b.dx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      // trailing cone
      const gradient = ctx.createLinearGradient(-tailLength, 0, 0, 0);
      gradient.addColorStop(0, rgba(rim, 0));
      gradient.addColorStop(0.4, rgba(mid, 0.45));
      gradient.addColorStop(1, rgba(mid, 0.9));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-tailLength, -tailWidth/2);
      ctx.lineTo(0, -radius*0.6);
      ctx.lineTo(0, radius*0.6);
      ctx.lineTo(-tailLength, tailWidth/2);
      ctx.closePath();
      ctx.fill();
      // orb core
      const orb = ctx.createRadialGradient(0,0,radius*0.1,0,0,radius*1.4);
      orb.addColorStop(0, rgba(core, 1));
      orb.addColorStop(0.45, rgba(mid, 0.9));
      orb.addColorStop(1, rgba(rim, 0));
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(0,0,radius*1.35,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else {
      const bg = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,8);
      bg.addColorStop(0,'rgba(255,250,200,1)');
      bg.addColorStop(0.4,'rgba(255,160,80,0.9)');
      bg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(b.x,b.y,6,0,Math.PI*2); ctx.fill();
    }
  });
  ctx.globalCompositeOperation = 'source-over';
  explosions.forEach(e=>{
    const t = e.age / e.duration;
    const radius = e.maxRadius * easeOutCubic(t);
    const alpha = 0.5 * (1 - t);
    if(alpha <= 0) return;
    ctx.lineWidth = 2 + (1 - t)*3;
    ctx.strokeStyle = `rgba(180,220,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(e.x,e.y,radius,0,Math.PI*2);
    ctx.stroke();
  });
  ctx.restore();

  const vign = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.max(canvas.width,canvas.height)*0.2, canvas.width/2, canvas.height/2, Math.max(canvas.width,canvas.height)*0.8);
  vign.addColorStop(0, 'rgba(0,0,0,0)');
  vign.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vign; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = '#000';
  for(let y=0;y<canvas.height;y+=2){ ctx.fillRect(0,y,canvas.width,1); }
  ctx.restore();

  if(victoryState.active){
    drawVictoryOverlay();
  }

  const continueLoop = running || victoryState.active || pendingVictory.active;
  if(continueLoop) requestAnimationFrame(loop);
  else drawPaused();
}

function drawVictoryOverlay(){
  const elapsed = performance.now() - victoryState.start;
  const progress = getVictoryProgress();
  const fadeProgress = VICTORY_AFTERGLOW > 0
    ? Math.max(0, Math.min(1, (elapsed - victoryState.duration) / VICTORY_AFTERGLOW))
    : 1;
  const textAlpha = Math.max(0, 1 - fadeProgress);

  ctx.save();
  ctx.globalAlpha = Math.min(1, progress + 0.25) * textAlpha;
  ctx.fillStyle = '#bfeaff';
  ctx.font = '32px "Press Start 2P", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Victory!', canvas.width/2, canvas.height/2 - 18);
  ctx.font = '16px Arial';
  ctx.globalAlpha *= 0.8;
  ctx.fillText('Press Reset to deploy again', canvas.width/2, canvas.height/2 + 18);
  ctx.restore();

  if(fadeProgress > 0){
    ctx.save();
    ctx.globalAlpha = fadeProgress * 0.85;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
  }
}

function drawPaused(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#062'; ctx.font='20px Arial'; ctx.fillText('Press Start to choose your ship',20,60);
}

// initial
window.addEventListener('load', ()=>{
  preloadShipSprites();
  buildShipPicker();
  ensureCaptainsAssigned(true);
  loadCaptainData();
  updateSelectionUI();
  initializeHudMeters();
  showShipOverlay();
  drawPaused();
});
