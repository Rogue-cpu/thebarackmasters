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
const enemyBoarderIndicator = document.getElementById('enemy-boarder-indicator');
const enemyBoarderMeter = document.getElementById('enemy-boarder-meter');
const enemyBoarderCount = document.getElementById('enemy-boarder-count');

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

function createPlaceholderShip(options){
  const cfg = options || {};
  const id = cfg.id || `prototype_${Date.now()}`;
  const name = cfg.name || 'Prototype Hull';
  return {
    id,
    name,
    classLabel: cfg.classLabel || 'Prototype Hull',
    placeholder: true,
    notes: cfg.notes || 'Awaiting full spec',
    size: cfg.size || 20,
    speed: cfg.speed || 150,
    hp: cfg.hp || 150,
    fireRate: cfg.fireRate || 520,
    color: cfg.color || '#888',
    spriteAngleOffset: cfg.spriteAngleOffset ?? -Math.PI/2,
    spriteScale: cfg.spriteScale || 0.08,
    trailColors: cfg.trailColors || DEFAULT_TRAIL_COLORS,
    special: cfg.special || null,
    projectile: cfg.projectile || {
      style:'default',
      damage:12,
      speed:420,
      ttl:1.8,
      muzzleOffset:16
    }
  };
}

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
  {id:'obama',name:'Obama',classLabel:'Humper Cruiser',size:24,speed:155,hp:150,fireRate:420,color:'#f8b2ff',spriteAngleOffset:Math.PI,spriteScale:0.12,overlayRotation:90,trailColors:{core:[255,220,150],mid:[255,150,90]},
    special:{
      type:'humperDash',
      cost:26,
      duration:3.6,
      cooldown:6.5,
      boostSpeed:980,
      speedMultiplier:2,
      boostAccel:1800,
      impactDamage:70,
      fighterDamage:32,
      knockback:340,
      steerAssist:0.22,
      damageReduction:0.85,
      invulnerableDuringDash:true
    },
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
  {id:'pickle',name:'Pickle',classLabel:'Brine Hive',size:24,speed:130,hp:230,fireRate:520,color:'#8cd96e',spriteAngleOffset:-Math.PI/2,spriteScale:0.105,trailColors:{core:[220,255,190],mid:[110,210,110]},
    special:{
      type:'pickleHive',
      cost:18,
      cooldown:13,
      hpSacrifice:2,
      fighter:{
        count:2,
        hp:16,
        speed:240,
        accel:520,
        fireInterval:0.45,
        projectileDamage:4,
        projectileSpeed:420,
        projectileTtl:1.6,
        returnTime:15,
        size:9
      }
    },
    projectile:{
      style:'plasmaOrb',
      radius:14,
      tailLength:54,
      tailWidth:26,
      core:[230,255,210],
      mid:[150,245,150],
      rim:[70,160,80],
      speed:360,
      ttl:2.4,
      muzzleOffset:28,
      damage:6,
      acid:{
        damagePerSecond:12,
        duration:5
      }
    }
  },
  {id:'fattian',name:'Fattian',classLabel:'Furnace Siege Platform',size:30,speed:92,hp:260,fireRate:1650,color:'#d86b42',spriteAngleOffset:-Math.PI/2,spriteScale:0.17,trailColors:{core:[255,180,120],mid:[180,70,40]},energyCapacity:160,energyRegen:7,energyCost:34,
    special:{
      type:'furnaceFuel',
      cost:0,
      cooldown:7,
      crewCost:1
    },
    projectile:{
      style:'plasmaBolt',
      length:52,
      radius:6,
      core:[255,230,200],
      mid:[255,150,80],
      tail:[240,80,40],
      speed:900,
      ttl:3.9,
      muzzleOffset:34,
      damage:60,
      recoil:320
    }
  },
  {id:'lunarian',name:'Lunarian',classLabel:'Moon Lance',size:16,speed:165,hp:130,fireRate:90,color:'#dde6ff',spriteAngleOffset:-Math.PI/2,spriteScale:0.08,trailColors:{core:[200,140,255],mid:[130,70,210]},
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
      style:'violetFlame',
      length:46,
      width:30,
      core:[255,238,255],
      mid:[220,170,255],
      outer:[130,70,210],
      flareRadius:28,
      speed:300,
      ttl:0.32,
      muzzleOffset:16,
      damage:11
    }
  },
  createPlaceholderShip({id:'criminal', name:'Criminal', classLabel:'Syndicate Prototype', color:'#b36b5c'}),
  {id:'yuptauri',name:'Yuptauri',classLabel:'Frontier Boarding Skiff',size:18,speed:175,hp:150,fireRate:360,color:'#77c5ff',spriteAngleOffset:Math.PI/2,spriteScale:0.1,trailColors:{core:[120,255,190],mid:[70,180,220]},energyCapacity:110,energyRegen:18,
    special:{
      type:'boardingPods',
      cost:20,
      cooldown:11.5,
      podCount:2,
      podSpeed:330,
      podAccel:640,
      podSpread:0.18,
      latchRadius:18,
      boardDuration:7.5,
      damagePerSecond:16,
      podGlow:[140,255,190],
      podShell:[30,120,110]
    },
    projectile:{
      style:'plasmaOrb',
      radius:10,
      tailLength:40,
      tailWidth:18,
      core:[180,240,255],
      mid:[120,200,255],
      rim:[60,130,210],
      speed:420,
      ttl:2.1,
      muzzleOffset:20,
      damage:14
    }
  },
  createPlaceholderShip({id:'deathousemen', name:'Deathousemen', classLabel:'Night Siege Frame', color:'#4c3a52', spriteAngleOffset:Math.PI/2}),
  createPlaceholderShip({id:'shamen', name:'Shamen', classLabel:'Mystic Skiff', color:'#5a9c68'}),
  createPlaceholderShip({id:'barack', name:'Barack', classLabel:'Dynasty Carrier', color:'#f4c2ff'}),
  {id:'obisdian_circuit',name:'Obsidian Circuit',classLabel:'Graviton Warhost',size:32,speed:110,hp:260,fireRate:220,color:'#4d566c',spriteAngleOffset:Math.PI/2,spriteScale:0.15,overlayRotation:180,requireTriggerReset:true,trailColors:{core:[255,80,80],mid:[140,30,30]},
    special:{
      type:'scarletPulse',
      cost:32,
      cooldown:8.5,
      radius:220,
      duration:1.6,
      expandTime:0.45,
      damagePerSecond:140
    },
    projectile:{
      style:'voidOrb',
      radius:18,
      aura:[255,60,60],
      shell:[70,0,0],
      core:[255,140,120],
      embers:[255,200,200],
      channelHold:true,
      channelSpeed:260,
      channelAccel:860,
      releaseDamp:0.35,
      driftDrag:0.97,
      gravityRadius:190,
      pullStrength:240,
      impactRadius:30,
      speed:240,
      ttl:9,
      muzzleOffset:26,
      damage:34
    }
  },
  createPlaceholderShip({id:'obamination', name:'Obamination', classLabel:'Absolution Hull', color:'#ff8c7a'}),
  createPlaceholderShip({id:'phantom', name:'Phantom', classLabel:'Veiled Corvette', color:'#9ad5d8'}),
  createPlaceholderShip({id:'taftian', name:'Taftian', classLabel:'Tribunal Cruiser', color:'#d3ab80'}),
  createPlaceholderShip({id:'khanite', name:'Khanite', classLabel:'Heir Apparent', color:'#c47b3f'}),
  createPlaceholderShip({id:'cabal', name:'Cabal', classLabel:'Cabal Doctrine', color:'#6e5a94'}),
  createPlaceholderShip({id:'boring_man', name:'Boring Man', classLabel:'Doldrum Frigate', color:'#8f8f8f'}),
  createPlaceholderShip({id:'sons_of_source', name:'Sons of Source', classLabel:'Source Choir', color:'#ffe8a6'})
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
let fighters = [];
let fighterIdCounter = 1;
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
const FURNACE_SOUND = '../steve.wav';
let furnaceAudioTemplate = null;
let furnaceAudioTried = false;
const DEFAULT_VICTORY_THEME = 'assets/sfx/victory.mp3';
const VICTORY_THEME_MAP = {
  default: DEFAULT_VICTORY_THEME,
  bad_ghost: 'assets/music/victory/bad_ghost.mp3',
  fattian: '../obituary.mp3'
};
const victoryAudioCache = {};
let activeVictoryClip = null;
let activeVictoryRace = null;
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

function ensureFurnaceAudio(){
  if(furnaceAudioTemplate || furnaceAudioTried) return furnaceAudioTemplate;
  furnaceAudioTried = true;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = FURNACE_SOUND;
  furnaceAudioTemplate = audio;
  return furnaceAudioTemplate;
}

function playFurnaceSound(){
  const template = ensureFurnaceAudio();
  if(!template) return;
  try{
    const clip = template.cloneNode(true);
    clip.volume = 0.95;
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

function stopActiveVictorySound(filterRaceId){
  if(!activeVictoryClip) return;
  if(filterRaceId && activeVictoryRace !== filterRaceId) return;
  try{
    activeVictoryClip.pause();
    activeVictoryClip.currentTime = 0;
  }catch(err){}
  activeVictoryClip = null;
  activeVictoryRace = null;
}

function playVictorySound(raceId){
  stopActiveVictorySound();
  const template = ensureVictoryAudio(raceId);
  if(!template) return;
  try{
    const clip = template.cloneNode(true);
    clip.volume = 0.9;
    clip.play();
    activeVictoryClip = clip;
    activeVictoryRace = raceId || 'default';
    clip.addEventListener('ended', ()=>{
      if(activeVictoryClip === clip){
        activeVictoryClip = null;
        activeVictoryRace = null;
      }
    });
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

function updateEnemyBoarderHud(ship){
  if(!enemyBoarderIndicator || !enemyBoarderMeter) return;
  const entries = ship && Array.isArray(ship.boardingIntruders)
    ? ship.boardingIntruders.filter(entry=> entry && entry.remaining > 0)
    : [];
  if(!entries.length){
    enemyBoarderIndicator.classList.remove('active');
    enemyBoarderMeter.style.width = '0%';
    if(enemyBoarderCount) enemyBoarderCount.textContent = '';
    return;
  }
  const total = entries.reduce((sum,entry)=> sum + Math.max(0, entry.total || 0), 0);
  const remaining = entries.reduce((sum,entry)=> sum + Math.max(0, entry.remaining || 0), 0);
  const percent = total > 0 ? Math.max(0, Math.min(1, 1 - (remaining / total))) : 1;
  enemyBoarderMeter.style.width = `${(percent * 100).toFixed(1)}%`;
  if(enemyBoarderCount) enemyBoarderCount.textContent = `x${entries.length}`;
  enemyBoarderIndicator.classList.add('active');
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

function freezeChannelBulletsFor(ship){
  if(!ship) return;
  bullets.forEach(b=>{
    if(!b || b.channelShip !== ship) return;
    if(!b.projectile || !b.projectile.channelHold) return;
    b.channelFrozen = true;
  });
}

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
  if(e.code==='Space'){
    keys.space=false;
    const playerShip = ships ? ships.find(s=> s && s.control) : null;
    freezeChannelBulletsFor(playerShip);
  }
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
    this.requireTriggerReset = !!type.requireTriggerReset;
    this.fireLatch = false;
    this.ai = this.control ? null : {
      mode: 'approach',
      timer: 0,
      strafeDir: Math.random()<0.5 ? 1 : -1,
      dodgeCooldown: 0,
      dodgeAngle: 0
    };
    this.damageOverTime = [];
    this.crewLossIndicator = null;
    this.boardingIntruders = [];
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
      const wantsFire = keys.space;
      const shotReady = this.cool <= 0;
      if(this.requireTriggerReset){
        if(wantsFire && !this.fireLatch && shotReady){
          if(this.shoot(this.angle)) this.cool = this.getFireCooldown();
          this.fireLatch = true;
        }
        if(!wantsFire) this.fireLatch = false;
      } else if(wantsFire && shotReady){
        if(this.shoot(this.angle)) this.cool = this.getFireCooldown();
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
    if(this.crewLossIndicator){
      this.crewLossIndicator.timer -= dt;
      if(this.crewLossIndicator.timer <= 0) this.crewLossIndicator = null;
    }
    this.updateSpecial(dt);
    this.updateDamageOverTime(dt);
    this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen * dt);
  }
  canUseSpecial(){
    if(!this.specialConfig) return false;
    if(this.activeSpecial){
      if(this.activeSpecial.type === 'lunarCloak') return true;
      if(this.activeSpecial.type === 'pickleHive'){
        const cost = this.specialConfig.cost || 0;
        return this.energy >= cost && this.hasPickleSpawnCapacity(this.activeSpecial);
      }
      return false;
    }
    if(this.specialCooldown > 0) return false;
    if(this.specialConfig.type === 'furnaceFuel'){
      const crewCost = Math.max(0, this.specialConfig.crewCost || 1);
      if(this.hp - crewCost < 1) return false;
    }
    const cost = this.specialConfig.cost || 0;
    return this.energy >= cost;
  }
  attemptSpecial(){
    if(!this.canUseSpecial()) return false;
    const conf = this.specialConfig || {};
    if(this.activeSpecial && this.activeSpecial.type === 'pickleHive'){
      const success = this.extendPickleHive(this.activeSpecial);
      if(success){
        const cost = conf.cost || 0;
        if(cost > 0){
          this.energy = Math.max(0, this.energy - cost);
        }
        if(this.control){
          if(conf.type !== 'fartCloud'){
            playSfx('special', this.type.id);
          }
          const now = performance.now ? performance.now() : Date.now();
          const durMs = Number.isFinite(this.activeSpecial.duration) ? (this.activeSpecial.duration * 1000) : 1400;
          specialActiveUntil = now + durMs;
        }
      }
      return success;
    }
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
    if(spec.type === 'pickleHive'){
      const spawned = this.startPickleHive(spec);
      if(spawned <= 0) return false;
    }
    if(spec.type === 'furnaceFuel'){
      const accepted = this.executeFurnaceFuel(spec);
      if(!accepted) return false;
    }
    if(spec.type === 'humperDash'){
      const primed = this.startHumperDash(spec);
      if(!primed) return false;
    }
    if(spec.type === 'boardingPods'){
      const launched = this.startBoardingPods(spec);
      if(!launched) return false;
    }
    const cost = conf.cost || 0;
    if(cost > 0){
      this.energy = Math.max(0, this.energy - cost);
    }
    this.activeSpecial = spec;
    this.specialCooldown = conf.cooldown || 0;
    if(spec.type === 'lunarCloak'){
      this.cloakActive = true;
      this.cloakOpacity = 1;
      if(!this.control) this.trail = [];
    }
    if(this.control){
      if(spec.type !== 'fartCloud' && spec.type !== 'furnaceFuel'){
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
      case 'pickleHive':
        this.updatePickleHive(spec, dt);
        break;
      case 'humperDash':
        this.updateHumperDash(spec, dt);
        break;
      case 'boardingPods':
        this.updateBoardingPods(spec, dt);
        break;
      case 'furnaceFuel':
        // instant effect handled on activation
        break;
      default:
        break;
    }
    const finiteDuration = Number.isFinite(spec.duration) ? spec.duration : null;
    const expired = finiteDuration != null ? spec.age >= finiteDuration : false;
    if(expired || spec.forceEnd || this.hp <= 0){
      if(spec.type === 'lunarCloak') this.endCloak();
      if(spec.type === 'humperDash'){
        this.vx *= 0.6;
        this.vy *= 0.6;
      }
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
  startBoardingPods(spec){
    const conf = spec.config || this.specialConfig || {};
    const podCount = Math.max(1, Math.round(conf.podCount || 2));
    const enemies = ships.filter(s=> s && s.team !== this.team && s.hp>0 && !s.isWarping());
    if(!enemies.length){
      spec.forceEnd = true;
      return false;
    }
    spec.pods = [];
    for(let i=0;i<podCount;i++){
      const target = enemies[i % enemies.length];
      if(!target) continue;
      const spread = (i - (podCount-1)/2) * (conf.podSpread || 0.15);
      const heading = this.angle + spread;
      const spawnRadius = this.size * 0.85;
      spec.pods.push({
        state:'launch',
        x: this.x + Math.cos(heading) * spawnRadius,
        y: this.y + Math.sin(heading) * spawnRadius,
        vx: this.vx,
        vy: this.vy,
        target,
        colorSeed: Math.random()*Math.PI*2,
        attachOffsetX: 0,
        attachOffsetY: 0,
        indicator: null
      });
    }
    spec.forceEnd = false;
    spec.duration = Infinity;
    return spec.pods.length > 0;
  }
  updateBoardingPods(spec, dt){
    const conf = spec.config || this.specialConfig || {};
    const podAccel = conf.podAccel || 600;
    const podSpeed = conf.podSpeed || 320;
    const latchRadius = conf.latchRadius || 18;
    const dps = conf.damagePerSecond || 14;
    const pods = spec.pods || [];
    if(!pods.length){
      spec.forceEnd = true;
      return;
    }
    pods.forEach(pod=>{
      if(pod.finished) return;
      const target = pod.target;
      if(!target || target.hp <= 0 || (target.isWarping && target.isWarping())){
        this.releaseBoardingPod(pod);
        return;
      }
      if(pod.state === 'launch'){
        const dx = target.x - pod.x;
        const dy = target.y - pod.y;
        const dist = Math.hypot(dx, dy) || 1;
        pod.vx += (dx / dist) * podAccel * dt;
        pod.vy += (dy / dist) * podAccel * dt;
        const speed = Math.hypot(pod.vx, pod.vy);
        if(speed > podSpeed){
          const scale = podSpeed / speed;
          pod.vx *= scale;
          pod.vy *= scale;
        }
        pod.x += pod.vx * dt;
        pod.y += pod.vy * dt;
        const approach = Math.hypot(target.x - pod.x, target.y - pod.y);
        if(approach <= (target.size || 16) + latchRadius){
          this.latchBoardingPod(pod, conf);
        }
      } else if(pod.state === 'boarding'){
        pod.x = target.x + pod.attachOffsetX;
        pod.y = target.y + pod.attachOffsetY;
        pod.boardTimer -= dt;
        if(target.hp > 0) applyDamage(target, dps * dt);
        if(pod.indicator){
          pod.indicator.remaining = Math.max(0, pod.indicator.remaining - dt);
        }
        if(pod.boardTimer <= 0){
          this.releaseBoardingPod(pod);
        }
      }
    });
    spec.pods = pods.filter(pod=> !pod.finished);
    if(!spec.pods.length){
      spec.forceEnd = true;
    }
  }
  latchBoardingPod(pod, conf){
    if(!pod || !pod.target) return;
    pod.state = 'boarding';
    const duration = Math.max(1, conf.boardDuration || 6);
    pod.boardTimer = duration;
    const attachRadius = (pod.target.size || 18) + 4;
    const angle = Math.atan2(pod.target.y - pod.y, pod.target.x - pod.x);
    pod.attachOffsetX = Math.cos(angle) * attachRadius;
    pod.attachOffsetY = Math.sin(angle) * attachRadius;
    pod.x = pod.target.x + pod.attachOffsetX;
    pod.y = pod.target.y + pod.attachOffsetY;
    pod.indicator = createBoardingIndicator(duration);
    if(pod.target.boardingIntruders){
      pod.target.boardingIntruders.push(pod.indicator);
    }
  }
  releaseBoardingPod(pod){
    if(!pod) return;
    if(pod.indicator && pod.target){
      removeBoardingIndicator(pod.target, pod.indicator);
    }
    pod.finished = true;
  }
  drawBoardingPods(ctx, spec){
    if(!spec.pods || !spec.pods.length) return;
    const conf = spec.config || this.specialConfig || {};
    const shell = conf.podShell || [40,160,130];
    const glow = conf.podGlow || [140,255,190];
    spec.pods.forEach(pod=>{
      ctx.save();
      ctx.translate(pod.x, pod.y);
      const angle = pod.state === 'boarding'
        ? Math.atan2(pod.attachOffsetY, pod.attachOffsetX)
        : Math.atan2(pod.vy || 0.001, pod.vx || 0.001);
      ctx.rotate(angle);
      const length = pod.state === 'boarding' ? 10 : 16;
      const radius = 4.5;
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = rgba(shell, 0.9);
      ctx.beginPath();
      ctx.ellipse(0,0,length,radius,0,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
      const grad = ctx.createRadialGradient(0,0,0,0,0,length*1.3);
      grad.addColorStop(0, rgba(glow, 0.85));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0,0,length,0,Math.PI*2);
      ctx.fill();
      if(pod.state === 'boarding' && pod.target){
        ctx.strokeStyle = rgba(glow, 0.4);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(-pod.attachOffsetX, -pod.attachOffsetY);
        ctx.stroke();
      }
      ctx.restore();
    });
  }
  startHumperDash(spec){
    const conf = spec.config || this.specialConfig || {};
    spec.duration = conf.duration || spec.duration || 1.35;
    spec.hitShips = new Set();
    spec.hitFighters = new Set();
    spec.boostDir = {
      x: Math.cos(this.angle),
      y: Math.sin(this.angle)
    };
    const targetMultiplier = Math.max(2, conf.speedMultiplier || 2);
    const doubledCap = (this.maxSpeed || this.speed || 0) * targetMultiplier;
    spec.speedCap = Math.max(conf.boostSpeed || doubledCap, doubledCap);
    spec.boostAccel = conf.boostAccel || 1700;
    spec.knockback = conf.knockback || 320;
    spec.impactDamage = conf.impactDamage || 65;
    spec.fighterDamage = conf.fighterDamage || 28;
    spec.steerAssist = (typeof conf.steerAssist === 'number') ? conf.steerAssist : 0.18;
    const mitigation = typeof conf.damageReduction === 'number' ? conf.damageReduction : 0;
    spec.damageReduction = Math.max(0, Math.min(0.99, mitigation));
    spec.invulnerableDuringDash = !!conf.invulnerableDuringDash;
    spec.trailTimer = 0;
    spec.glowPulse = 0;
    return true;
  }
  updateHumperDash(spec, dt){
    if(!spec.hitShips) spec.hitShips = new Set();
    if(!spec.hitFighters) spec.hitFighters = new Set();
    spec.glowPulse += dt * 8;
    const steer = Math.max(0, Math.min(1, spec.steerAssist * dt * 6));
    const targetX = Math.cos(this.angle);
    const targetY = Math.sin(this.angle);
    spec.boostDir.x = lerp(spec.boostDir.x, targetX, steer);
    spec.boostDir.y = lerp(spec.boostDir.y, targetY, steer);
    const len = Math.hypot(spec.boostDir.x, spec.boostDir.y) || 1;
    spec.boostDir.x /= len;
    spec.boostDir.y /= len;

    this.vx += spec.boostDir.x * spec.boostAccel * dt;
    this.vy += spec.boostDir.y * spec.boostAccel * dt;
    const cap = spec.speedCap || 980;
    const speed = Math.hypot(this.vx, this.vy);
    if(speed > cap){
      const scale = cap / speed;
      this.vx *= scale;
      this.vy *= scale;
    }

    spec.trailTimer -= dt;
    if(spec.trailTimer <= 0){
      spec.trailTimer = 0.04;
      particles.push({
        x: this.x + (Math.random()-0.5)*6,
        y: this.y + (Math.random()-0.5)*6,
        vx: -spec.boostDir.x * 180 + (Math.random()-0.5)*60,
        vy: -spec.boostDir.y * 180 + (Math.random()-0.5)*60,
        life: 0.18 + Math.random()*0.18,
        size: 1 + Math.random()*0.6,
        core: [255,255,255],
        mid: [255,210,160]
      });
    }

    const hitRadius = this.size * 0.9;
    ships.forEach(other=>{
      if(!other || other === this || other.team === this.team) return;
      if(other.hp <= 0 || other.isWarping()) return;
      if(spec.hitShips.has(other)) return;
      const dist = Math.hypot(other.x - this.x, other.y - this.y);
      if(dist <= hitRadius + other.size*0.55){
        applyDamage(other, spec.impactDamage);
        other.vx += spec.boostDir.x * spec.knockback;
        other.vy += spec.boostDir.y * spec.knockback;
        this.vx *= 0.88;
        this.vy *= 0.88;
        spec.hitShips.add(other);
        this.spawnHumperImpact(other);
      }
    });

    if(fighters && fighters.length){
      fighters.forEach(f=>{
        if(!f || !f.alive || f.team === this.team) return;
        if(spec.hitFighters.has(f)) return;
        const radius = (f.size || 8) + hitRadius * 0.2;
        if(Math.hypot(f.x - this.x, f.y - this.y) <= hitRadius + radius){
          damageFighter(f, spec.fighterDamage);
          f.vx += spec.boostDir.x * (spec.knockback * 0.35);
          f.vy += spec.boostDir.y * (spec.knockback * 0.35);
          spec.hitFighters.add(f);
        }
      });
    }
  }
  spawnHumperImpact(target){
    const cx = target ? (this.x + target.x) / 2 : this.x;
    const cy = target ? (this.y + target.y) / 2 : this.y;
    for(let i=0;i<10;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 160 + Math.random()*180;
      particles.push({
        x: cx + Math.cos(angle)*3,
        y: cy + Math.sin(angle)*3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.22 + Math.random()*0.25,
        size: 1.3 + Math.random()*1.1,
        core: [255,255,255],
        mid: [255,200,150]
      });
    }
  }
  hasPickleSpawnCapacity(spec){
    if(!spec) return false;
    spec.fighters = (spec.fighters || []).filter(f=> f && f.alive);
    const plan = this.computePickleSpawnPlan(spec);
    return plan.count > 0;
  }
  startPickleHive(spec){
    spec.duration = Infinity;
    spec.elapsedFlight = 0;
    spec.hpDebtOutstanding = 0;
    spec.fighters = [];
    spec.forceEnd = false;
    return this.spawnPickleFighters(spec);
  }
  extendPickleHive(spec){
    if(!spec) return false;
    spec.fighters = (spec.fighters || []).filter(f=> f && f.alive);
    return this.spawnPickleFighters(spec) > 0;
  }
  executeFurnaceFuel(spec){
    const conf = spec.config || this.specialConfig || {};
    const crewCost = Math.max(0, conf.crewCost || 1);
    if(this.hp - crewCost < 1){
      spec.forceEnd = true;
      return false;
    }
    this.hp = Math.max(1, this.hp - crewCost);
    this.energy = this.maxEnergy;
    const flashDuration = conf.flashDuration || 0.45;
    spec.duration = flashDuration;
    spec.forceEnd = true;
    playFurnaceSound();
    const flameCount = 18;
    for(let i=0;i<flameCount;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 40 + Math.random()*90;
      particles.push({
        x: this.x + Math.cos(angle)*6,
        y: this.y + Math.sin(angle)*6,
        vx: Math.cos(angle) * speed * 0.35,
        vy: Math.sin(angle) * speed * 0.35,
        life: 0.4 + Math.random()*0.3,
        size: 1 + Math.random()*1.3,
        core: [255,200,140],
        mid: [255,120,60]
      });
    }
    return true;
  }
  consumeCrew(amount){
    const loss = Math.max(0, amount || 0);
    if(loss <= 0) return;
    this.hp = Math.max(0, this.hp - loss);
    const baseDuration = 0.7;
    if(!this.crewLossIndicator){
      this.crewLossIndicator = {amount: loss, timer: baseDuration, baseDuration};
    } else {
      this.crewLossIndicator.amount += loss;
      this.crewLossIndicator.timer = baseDuration;
      this.crewLossIndicator.baseDuration = baseDuration;
    }
  }
  computePickleSpawnPlan(spec, requestedCount){
    const conf = spec.config || this.specialConfig || {};
    const fighterConf = conf.fighter || {};
    const baseBatch = Math.max(1, requestedCount || fighterConf.count || 1);
    const hpSacrifice = Math.max(0, conf.hpSacrifice || 0);
    const minHpReserve = Math.max(1, conf.minHpReserve || 1);
    const availableHp = this.hp - minHpReserve;
    if(hpSacrifice > 0 && availableHp < hpSacrifice){
      return {count: 0, hpCost: 0, restorePerFighter: 0, minHpReserve, fighterConf};
    }
    const activeCount = (spec.fighters || []).length;
    const configuredMax = fighterConf.maxActive;
    const slotBudget = (typeof configuredMax === 'number' && isFinite(configuredMax))
      ? Math.max(0, configuredMax - activeCount)
      : Infinity;
    const spawnCount = Math.max(0, Math.min(baseBatch, slotBudget));
    if(spawnCount <= 0){
      return {count: 0, hpCost: 0, restorePerFighter: 0, minHpReserve, fighterConf};
    }
    const hpCost = hpSacrifice;
    const restorePerFighter = spawnCount > 0 ? hpCost / spawnCount : 0;
    return {
      count: spawnCount,
      hpCost,
      restorePerFighter,
      minHpReserve,
      fighterConf
    };
  }
  spawnPickleFighters(spec, requestedCount){
    if(!spec) return 0;
    spec.fighters = (spec.fighters || []).filter(f=> f && f.alive);
    const plan = this.computePickleSpawnPlan(spec, requestedCount);
    if(plan.count <= 0) return 0;
    if(plan.count > 0 && plan.hpCost > 0){
      this.hp = Math.max(plan.minHpReserve, this.hp - plan.hpCost);
      spec.hpDebtOutstanding = (spec.hpDebtOutstanding || 0) + plan.hpCost;
    }
    spec.elapsedFlight = 0;
    spec.forceEnd = false;
    const total = plan.count;
    let spawned = 0;
    for(let i=0;i<total;i++){
      const fighter = createPickleFighter(this, spec, plan.fighterConf, i, total, plan.restorePerFighter);
      if(fighter){
        spec.fighters.push(fighter);
        spawned++;
      }
    }
    return spawned;
  }
  updatePickleHive(spec, dt){
    spec.elapsedFlight = (spec.elapsedFlight || 0) + dt;
    const fighterConf = spec.config ? spec.config.fighter || {} : {};
    const returnTime = fighterConf.returnTime || 15;
    const activeFighters = (spec.fighters || []).filter(f=> f && f.alive);
    spec.fighters = activeFighters;
    if(spec.elapsedFlight >= returnTime){
      activeFighters.forEach(f=>{
        if(f && f.alive) f.state = 'returning';
      });
    }
    if(!activeFighters.length){
      spec.forceEnd = true;
    }
  }
  updateAI(dt){
    const ai = this.ai || (this.ai = {mode:'approach',timer:0,strafeDir:1,dodgeCooldown:0,dodgeAngle:0});
    const preferRange = this.size*6 + 80;
    const enemies = ships.filter(s=>s.team!==this.team && s.hp>0 && !s.isWarping());
    const hostileFighterCount = countEnemyFighters(this.team);
    if(!enemies.length && hostileFighterCount === 0) return;
    const shipTarget = enemies.length ? enemies.reduce((a,b)=> distance(this,b) < distance(this,a) ? b : a, enemies[0]) : null;
    const fighterTarget = hostileFighterCount ? getNearestEnemyFighter(this.team, this) : null;
    let target = shipTarget;
    if(fighterTarget){
      const fighterDist = Math.hypot(fighterTarget.x - this.x, fighterTarget.y - this.y);
      const shipDist = target ? Math.hypot(target.x - this.x, target.y - this.y) : Infinity;
      const fighterBias = hostileFighterCount >= 3 ? 0.8 : 0.6;
      if(!target || fighterDist < shipDist * fighterBias || fighterDist < preferRange * 0.85){
        target = fighterTarget;
      }
    }
    if(!target) return;
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
      } else if(this.specialConfig.type === 'pickleHive'){
        shouldUse = dist <= preferRange * 1.3 || Math.random() < 0.08;
      } else if(this.specialConfig.type === 'furnaceFuel'){
        const crewCost = Math.max(0, this.specialConfig.crewCost || 1);
        shouldUse = (this.energy < this.maxEnergy * 0.45) && (this.hp - crewCost >= 1.5);
      } else if(this.specialConfig.type === 'humperDash'){
        const lowHealth = this.hp < this.type.hp * 0.45;
        shouldUse = dist <= preferRange * 0.9 || lowHealth;
      }
      if(shouldUse){
        this.attemptSpecial();
      }
    }
    this.cool -= dt*1000;
    if(canSeeTarget && dist < shotRange && this.cool <= 0){
      if(this.shoot(aimAngle)){
        this.cool = this.getFireCooldown(0.7 + Math.random()*0.6);
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
    const bullet = {
      x: originX,
      y: originY,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      team: this.team,
      ttl,
      damage,
      raceId: this.type.id,
      projectile,
      seed: Math.random()*Math.PI*2
    };
    if(projectile && projectile.channelHold){
      bullet.channelShip = this;
      bullet.released = !this.control;
      bullet.channelFrozen = false;
    }
    bullets.push(bullet);
    if(this.type && this.type.projectile && this.type.projectile.recoil){
      const recoil = this.type.projectile.recoil;
      this.vx -= Math.cos(angle) * recoil;
      this.vy -= Math.sin(angle) * recoil;
    }
    this.lastShotAt = performance.now ? performance.now() : Date.now();
    if(this.control){
      lastShotTime = performance.now();
    }
    playSfx('fire', this.type.id);
    return true;
  }
  getFireCooldown(multiplier=1){
    const baseRate = this.fireRate || 500;
    let rate = baseRate * multiplier;
    if(this.type && this.type.id === 'fattian'){
      const ratio = this.maxEnergy > 0 ? Math.max(0, Math.min(1, this.energy / this.maxEnergy)) : 0;
      const fastFactor = 0.28; // near full battery, faster cadence
      const slowFactor = 1.35; // drained battery, sluggish reload
      const scale = lerp(fastFactor, slowFactor, 1 - ratio);
      rate *= scale;
    }
    return rate;
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
    this.drawCrewLossIndicator(ctx);
    this.drawSpecial(ctx);
  }
  drawCrewLossIndicator(ctx){
    if(!this.crewLossIndicator) return;
    const info = this.crewLossIndicator;
    const base = info.baseDuration || 0.7;
    const progress = Math.max(0, Math.min(1, info.timer / base));
    const offset = (1 - progress) * 24;
    const shownLoss = Math.max(1, Math.round(info.amount));
    ctx.save();
    ctx.font = '700 13px "Press Start 2P", monospace';
    ctx.fillStyle = `rgba(255,90,90,${progress})`;
    ctx.textAlign = 'center';
    ctx.fillText(`-${shownLoss}`, this.x, this.y - this.size - 8 - offset);
    ctx.restore();
  }
  drawHumperDash(ctx, spec){
    const pulse = 0.65 + Math.sin((spec.glowPulse || spec.age*10)) * 0.25;
    const outerRadius = this.size * (0.95 + pulse*0.2) + 6;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = Math.max(3, this.size * 0.28);
    ctx.strokeStyle = `rgba(255,255,255,${0.55 + pulse*0.3})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, outerRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.lineWidth *= 0.55;
    ctx.strokeStyle = `rgba(255,235,200,${0.35 + pulse*0.25})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, outerRadius * 0.8, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
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
      case 'pickleHive':
        // Fighters draw separately during the global render.
        break;
      case 'humperDash':
        this.drawHumperDash(ctx, spec);
        break;
      case 'boardingPods':
        this.drawBoardingPods(ctx, spec);
        break;
      default:
        break;
    }
  }
  // Tick down any lingering acid burns or similar DoT effects.
  updateDamageOverTime(dt){
    if(!this.damageOverTime.length || this.hp <= 0) return;
    this.damageOverTime.forEach(effect=>{
      effect.elapsed = (effect.elapsed || 0) + dt;
      const dps = effect.damagePerSecond || 0;
      if(dps > 0) applyDamage(this, dps * dt);
    });
    this.damageOverTime = this.damageOverTime.filter(effect=>{
      if(this.hp <= 0) return false;
      const duration = effect.duration ?? 0;
      return effect.elapsed < duration;
    });
  }
  applyAcidEffect(config){
    const acid = config || {};
    this.damageOverTime.push({
      type: 'acid',
      duration: Math.max(0.1, acid.duration || 5),
      damagePerSecond: Math.max(0, acid.damagePerSecond || acid.damage || 8),
      elapsed: 0
    });
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

// --- Pickle fighter helpers ---
function createPickleFighter(parent, spec, conf, index, total, hpRestore){
  if(!parent) return null;
  const offset = (index - (total-1)/2) * 0.35;
  const launchAngle = parent.angle + Math.PI + offset;
  const launchDist = parent.size * 0.9;
  const fighter = {
    id: fighterIdCounter++,
    kind: 'pickleHive',
    spec,
    parent,
    team: parent.team,
    x: parent.x + Math.cos(launchAngle) * launchDist,
    y: parent.y + Math.sin(launchAngle) * launchDist,
    vx: parent.vx * 0.4,
    vy: parent.vy * 0.4,
    speed: conf.speed || 240,
    accel: conf.accel || 520,
    size: conf.size || 9,
    hp: conf.hp || 14,
    maxHp: conf.hp || 14,
    fireInterval: conf.fireInterval || 0.45,
    fireCooldown: (index % 2) * 0.18,
    projectileDamage: conf.projectileDamage || 4,
    projectileSpeed: conf.projectileSpeed || 420,
    projectileTtl: conf.projectileTtl || 1.4,
    state: 'attack',
    age: 0,
    maxFlightTime: conf.returnTime || 15,
    orbitPhase: index * Math.PI * 0.8,
    restoreAmount: hpRestore != null ? hpRestore : 0,
    alive: true,
    colorCore: conf.core || [235,255,210],
    colorMid: conf.mid || [150,235,170]
  };
  fighters.push(fighter);
  return fighter;
}

function updateFighters(dt){
  if(!fighters.length) return;
  fighters.forEach(f=>{
    if(!f || !f.alive) return;
    switch(f.kind){
      case 'pickleHive':
      default:
        updatePickleFighter(f, dt);
        break;
    }
  });
  fighters = fighters.filter(f=> f && f.alive);
}

function updatePickleFighter(f, dt){
  f.age += dt;
  if(!f.parent || f.parent.hp <= 0) f.state = 'returning';
  if(f.state === 'attack' && f.age >= f.maxFlightTime) f.state = 'returning';
  if(f.state === 'attack'){
    const target = getNearestEnemyShip(f.team, f);
    if(target){
      f.target = target;
      const angle = Math.atan2(target.y - f.y, target.x - f.x);
      const wobble = Math.sin(f.age*4 + f.orbitPhase) * 0.25;
      const accel = f.accel || 520;
      f.vx += Math.cos(angle + wobble*0.35) * accel * dt;
      f.vy += Math.sin(angle + wobble*0.35) * accel * dt;
      const vel = Math.hypot(f.vx, f.vy);
      const maxSpeed = f.speed;
      if(vel > maxSpeed){
        f.vx = (f.vx/vel) * maxSpeed;
        f.vy = (f.vy/vel) * maxSpeed;
      }
      f.fireCooldown -= dt;
      if(f.fireCooldown <= 0){
        firePickleFighterShot(f, angle);
        f.fireCooldown = f.fireInterval;
      }
    } else {
      f.vx *= 0.98;
      f.vy *= 0.98;
    }
  } else if(f.state === 'returning'){
    if(!f.parent){
      retireFighter(f);
      return;
    }
    const angle = Math.atan2(f.parent.y - f.y, f.parent.x - f.x);
    const accel = (f.accel || 420) * 0.9;
    f.vx += Math.cos(angle) * accel * dt;
    f.vy += Math.sin(angle) * accel * dt;
    const vel = Math.hypot(f.vx, f.vy);
    const maxSpeed = f.speed * 1.1;
    if(vel > maxSpeed){
      f.vx = (f.vx/vel) * maxSpeed;
      f.vy = (f.vy/vel) * maxSpeed;
    }
    const dist = Math.hypot(f.parent.x - f.x, f.parent.y - f.y);
    if(dist < Math.max(18, f.parent.size*0.65)){
      dockFighter(f);
      return;
    }
  }
  const drag = 0.992;
  f.vx *= drag;
  f.vy *= drag;
  f.x += f.vx * dt;
  f.y += f.vy * dt;
}

function firePickleFighterShot(fighter, angle){
  const speed = fighter.projectileSpeed || 420;
  bullets.push({
    x: fighter.x,
    y: fighter.y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    team: fighter.team,
    ttl: fighter.projectileTtl || 1.4,
    damage: fighter.projectileDamage || 4,
    raceId: fighter.parent ? fighter.parent.type.id : 'pickle',
    projectile:{
      style:'plasmaBolt',
      length:22,
      radius:3,
      core:[235,255,220],
      mid:[150,235,170],
      tail:[70,160,100]
    },
    seed: Math.random()*Math.PI*2
  });
  particles.push({
    x: fighter.x,
    y: fighter.y,
    vx: Math.cos(angle + Math.PI) * 40 + (Math.random()-0.5)*25,
    vy: Math.sin(angle + Math.PI) * 40 + (Math.random()-0.5)*25,
    life: 0.2,
    size: 0.8,
    core: fighter.colorCore,
    mid: fighter.colorMid
  });
}

function getNearestEnemyShip(team, origin){
  let nearest = null;
  let bestDist = Infinity;
  ships.forEach(ship=>{
    if(!ship || ship.team === team || ship.hp <= 0 || ship.isWarping()) return;
    const dist = Math.hypot(ship.x - origin.x, ship.y - origin.y);
    if(dist < bestDist){
      bestDist = dist;
      nearest = ship;
    }
  });
  return nearest;
}

function getNearestEnemyFighter(team, origin){
  let nearest = null;
  let bestDist = Infinity;
  fighters.forEach(fighter=>{
    if(!fighter || !fighter.alive || fighter.team === team) return;
    const dist = Math.hypot(fighter.x - origin.x, fighter.y - origin.y);
    if(dist < bestDist){
      bestDist = dist;
      nearest = fighter;
    }
  });
  return nearest;
}

function countEnemyFighters(team){
  let total = 0;
  fighters.forEach(fighter=>{
    if(!fighter || !fighter.alive || fighter.team === team) return;
    total++;
  });
  return total;
}

function damageFighter(fighter, amount){
  if(!fighter || !fighter.alive || amount <= 0) return;
  fighter.hp -= amount;
  if(fighter.hp <= 0){
    spawnFighterPop(fighter);
    retireFighter(fighter);
  }
}

function dockFighter(fighter){
  if(fighter.restoreAmount && fighter.parent && fighter.parent.hp > 0){
    fighter.parent.hp = Math.min(fighter.parent.type.hp, fighter.parent.hp + fighter.restoreAmount);
    if(fighter.spec){
      fighter.spec.hpDebtOutstanding = Math.max(0, (fighter.spec.hpDebtOutstanding || 0) - fighter.restoreAmount);
    }
  }
  retireFighter(fighter);
}

function retireFighter(fighter){
  fighter.alive = false;
  if(fighter.spec && fighter.spec.fighters){
    fighter.spec.fighters = fighter.spec.fighters.filter(entry=> entry !== fighter);
  }
}

function spawnFighterPop(fighter){
  for(let i=0;i<6;i++){
    particles.push({
      x: fighter.x,
      y: fighter.y,
      vx: (Math.random()-0.5)*150,
      vy: (Math.random()-0.5)*150,
      life: 0.25 + Math.random()*0.2,
      size: 0.6 + Math.random()*0.4,
      core: fighter.colorCore,
      mid: fighter.colorMid
    });
  }
}

function drawFighters(ctx){
  if(!fighters.length) return;
  ctx.save();
  fighters.forEach(f=>{
    if(!f || !f.alive) return;
    ctx.save();
    ctx.translate(f.x, f.y);
    const angle = Math.atan2(f.vy, f.vx) || 0;
    ctx.rotate(angle);
    const bodyLen = Math.max(14, f.size*2.1);
    const bodyWidth = Math.max(6, f.size*0.8);
    const grad = ctx.createLinearGradient(-bodyLen/2, 0, bodyLen/2, 0);
    grad.addColorStop(0, rgba(f.colorMid, 0.15));
    grad.addColorStop(0.4, rgba(f.colorMid, 0.65));
    grad.addColorStop(1, rgba(f.colorCore, 0.95));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(bodyLen/2, 0);
    ctx.lineTo(-bodyLen/2, bodyWidth/2);
    ctx.lineTo(-bodyLen/2, -bodyWidth/2);
    ctx.closePath();
    ctx.fill();
    const glow = ctx.createRadialGradient(0,0,0,0,0,bodyWidth*1.6);
    glow.addColorStop(0, rgba(f.colorCore, 0.9));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.arc(0,0,bodyWidth,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

function applyDamage(ship, amount){
  if(ship.hp <= 0 || amount <= 0) return;
  if(ship.invulnerable) return;
  let finalAmount = amount;
  const spec = ship.activeSpecial;
  if(spec && spec.type === 'humperDash'){
    if(spec.invulnerableDuringDash) return;
    if(spec.damageReduction){
      const clamp = Math.max(0, Math.min(0.99, spec.damageReduction));
      finalAmount *= (1 - clamp);
    }
  }
  if(finalAmount <= 0) return;
  ship.hp = Math.max(0, ship.hp - finalAmount);
  if(ship.hp === 0 && !ship._playedDeath){
    ship._playedDeath = true;
    spawnExplosion(ship);
    playShipDeath();
    if(ship.control) triggerAvatarStatic();
  }
}

function createBoardingIndicator(total){
  return {
    total: Math.max(0.1, total || 1),
    remaining: Math.max(0.1, total || 1)
  };
}

function removeBoardingIndicator(ship, indicator){
  if(!ship || !ship.boardingIntruders || !indicator) return;
  ship.boardingIntruders = ship.boardingIntruders.filter(entry=> entry !== indicator);
}

function spawnBattle(){
  ships = []; bullets = [];
  fighters = [];
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
  if(fighters.length){
    const formations = new Map();
    fighters.forEach(f=>{
      if(!f || !f.alive || !f.parent || f.parent.hp <= 0) return;
      if(!formations.has(f.parent)) formations.set(f.parent, []);
      formations.get(f.parent).push(f);
    });
    formations.forEach((group, parent)=>{
      group.forEach((fighter, idx)=>{
        const spread = (idx - (group.length-1)/2) * 0.3;
        const angle = parent.angle + Math.PI + spread;
        const dist = parent.size + 12 + (idx % 2) * 2;
        fighter.x = parent.x + Math.cos(angle) * dist;
        fighter.y = parent.y + Math.sin(angle) * dist;
        fighter.vx = parent.vx * 0.4;
        fighter.vy = parent.vy * 0.4;
      });
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
  ships=[]; bullets=[]; fighters=[]; explosions=[]; fartClouds=[];
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
    updateFighters(dt);
    player = ships.find(s=> s.control);
    bullets.forEach(b=>{
      if(b.projectile && b.projectile.style === 'violetFlame'){
        const drag = b.projectile.damping || 0.78;
        b.dx *= drag;
        b.dy *= drag;
      }
      if(b.projectile && b.projectile.channelHold){
        const holding = b.channelShip && b.channelShip.hp>0 && b.channelShip.control && keys.space && !b.channelFrozen;
        if(holding){
          const targetSpeed = b.projectile.channelSpeed || b.projectile.speed || Math.hypot(b.dx,b.dy) || 180;
          const current = Math.max(10, Math.hypot(b.dx,b.dy));
          if(current < targetSpeed){
            const heading = Math.atan2(b.dy, b.dx) || 0;
            const accel = b.projectile.channelAccel || 800;
            b.dx += Math.cos(heading) * accel * dt;
            b.dy += Math.sin(heading) * accel * dt;
          }
          b.released = false;
        } else if(!b.released){
          b.released = true;
          const damp = b.projectile.releaseDamp || 0.4;
          b.dx *= damp;
          b.dy *= damp;
        } else {
          if(b.channelFrozen){
            const drift = b.projectile.freezeDrift || 0.92;
            const bias = b.projectile.freezeBias || 0.08;
            const heading = Math.atan2(b.dy, b.dx) || 0;
            const speed = Math.hypot(b.dx, b.dy) || (b.projectile.speed || 200);
            const target = speed * bias;
            const vx = Math.cos(heading) * target;
            const vy = Math.sin(heading) * target;
            b.dx = lerp(b.dx, vx, 0.08);
            b.dy = lerp(b.dy, vy, 0.08);
            b.dx *= drift;
            b.dy *= drift;
          } else {
            const drift = b.projectile.driftDrag || 0.97;
            b.dx *= drift;
            b.dy *= drift;
          }
        }
      }
      b.x += b.dx*dt;
      b.y += b.dy*dt;
      b.ttl -= dt;
    });
    bullets = bullets.filter(b=> b.ttl>0 && b.x> -50 && b.x < canvas.width+50 && b.y > -50 && b.y < canvas.height+50);
    bullets.forEach(b=>{
      ships.forEach(s=>{
        if(s.team!==b.team && s.hp>0 && !s.isWarping()){
          const d = Math.hypot(b.x-s.x,b.y-s.y);
          if(b.projectile && b.projectile.style === 'voidOrb'){
            const gravityRadius = b.projectile.gravityRadius || 190;
            const pullStrength = b.projectile.pullStrength || 200;
            const impactRadius = b.projectile.impactRadius || Math.max(24, s.size*0.55);
            const orbActive = !b.projectile.channelHold || b.released || !b.channelShip || !b.channelShip.control;
            if(orbActive && d < gravityRadius){
              const intensity = 1 - Math.min(1, d / gravityRadius);
              const norm = d || 1;
              const pull = pullStrength * intensity * dt;
              s.vx += (b.x - s.x)/norm * pull;
              s.vy += (b.y - s.y)/norm * pull;
              if(d <= impactRadius){
                const impactDamage = b.projectile.damage || b.damage || 18;
                applyDamage(s, impactDamage);
                b.ttl = 0;
                return;
              }
            }
          }
          if(d < s.size){
            const damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 12);
            applyDamage(s, damage);
            if(b.projectile && b.projectile.acid && s.applyAcidEffect){
              s.applyAcidEffect(b.projectile.acid);
            }
            b.ttl = 0;
          }
        }
      });
      if(b.ttl > 0 && fighters.length){
        for(let i=0;i<fighters.length && b.ttl>0;i++){
          const f = fighters[i];
          if(!f || !f.alive || f.team === b.team) continue;
          const radius = f.size || 10;
          if(Math.hypot(b.x - f.x, b.y - f.y) < radius){
            const damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 8);
            damageFighter(f, damage);
            b.ttl = 0;
          }
        }
      }
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
    updateEnemyBoarderHud(e);
  } else {
    if(enemyCrewBarEl) enemyCrewBarEl.innerHTML = '';
    if(enemyBatteryGridEl) enemyBatteryGridEl.innerHTML = '';
    if(enemyEnergyTextEl) enemyEnergyTextEl.textContent = '0%';
    currentEnemyRace = null;
    enemyAvatarState = enemyAvatarVictoryLock ? 'victory' : 'idle';
    updateEnemyAvatarImg();
    updateEnemyBoarderHud(null);
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
      const finishingShip = victoryState.ship;
      if(finishingShip && finishingShip.type && finishingShip.type.id === 'fattian'){
        stopActiveVictorySound('fattian');
      }
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
  drawFighters(ctx);
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
    } else if(style === 'violetFlame'){
      const length = b.projectile.length || 48;
      const width = b.projectile.width || 18;
      const core = b.projectile.core || [255,230,255];
      const mid = b.projectile.mid || [210,150,255];
      const outer = b.projectile.outer || [120,60,200];
      const flareRadius = b.projectile.flareRadius || 18;
      const angle = Math.atan2(b.dy, b.dx);
      const timeNow = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const phase = b.seed || 0;
      const pulse = 0.85 + 0.2 * Math.sin(timeNow * 0.02 + phase);
      const flameWidth = width * pulse;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      const sheath = ctx.createLinearGradient(-length, 0, 0, 0);
      sheath.addColorStop(0, rgba(outer, 0));
      sheath.addColorStop(0.2, rgba(outer, 0.35));
      sheath.addColorStop(0.5, rgba(mid, 0.65));
      sheath.addColorStop(1, rgba(core, 0.95));
      ctx.fillStyle = sheath;
      ctx.beginPath();
      ctx.moveTo(-length, -flameWidth * 0.65);
      ctx.quadraticCurveTo(-length * 0.25, -flameWidth * 1.05, -length * 0.08, -flameWidth * 0.65);
      ctx.lineTo(0, -flameWidth * 0.18);
      ctx.lineTo(0, flameWidth * 0.18);
      ctx.quadraticCurveTo(-length * 0.08, flameWidth * 0.65, -length, flameWidth * 0.65);
      ctx.closePath();
      ctx.fill();
      const innerWidth = flameWidth * 0.5;
      const coreGrad = ctx.createLinearGradient(-length * 0.55, 0, 0, 0);
      coreGrad.addColorStop(0, rgba(mid, 0));
      coreGrad.addColorStop(0.55, rgba(mid, 0.55));
      coreGrad.addColorStop(1, rgba(core, 0.95));
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.moveTo(-length * 0.55, -innerWidth * 0.95);
      ctx.quadraticCurveTo(-length * 0.18, -innerWidth * 1.25, 0, -innerWidth * 0.2);
      ctx.lineTo(0, innerWidth * 0.2);
      ctx.quadraticCurveTo(-length * 0.18, innerWidth * 1.25, -length * 0.55, innerWidth * 0.95);
      ctx.closePath();
      ctx.fill();
      const flare = ctx.createRadialGradient(0, 0, 0, 0, 0, flareRadius * (0.9 + pulse * 0.25));
      flare.addColorStop(0, rgba(core, 0.95));
      flare.addColorStop(0.45, rgba(mid, 0.45));
      flare.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(0, 0, flareRadius * (0.9 + pulse * 0.25), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else if(style === 'voidOrb'){
      const radius = b.projectile.radius || 18;
      const shell = b.projectile.shell || [60,0,0];
      const core = b.projectile.core || [255,80,80];
      const aura = b.projectile.aura || [255,40,40];
      const embers = b.projectile.embers || [255,180,180];
      const pulse = 0.6 + 0.35 * Math.sin((performance.now ? performance.now() : Date.now()) * 0.01 + (b.seed || 0));
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(0,0,radius*0.4,0,0,radius*2.2);
      glow.addColorStop(0, rgba(core, 0.95));
      glow.addColorStop(0.4, rgba(aura, 0.45));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0,0,radius*2,0,Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      const body = ctx.createRadialGradient(0,0,radius*0.1,0,0,radius*1.1);
      body.addColorStop(0, rgba(core, 1));
      body.addColorStop(0.6, rgba(shell, 0.8));
      body.addColorStop(1, rgba(shell, 0.05));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0,0,radius*(0.95 + pulse*0.1),0,Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = `rgba(20,0,0,${0.7 + pulse*0.2})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0,0,radius*(0.9 + pulse*0.05),0,Math.PI*2);
      ctx.stroke();
      for(let i=0;i<3;i++){
        const theta = (b.seed || 0) + i*2.1 + pulse*0.5;
        const emberX = Math.cos(theta) * radius * 1.2;
        const emberY = Math.sin(theta) * radius * 1.2;
        const ember = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, radius*0.6);
        ember.addColorStop(0, rgba(embers, 0.9));
        ember.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ember;
        ctx.beginPath();
        ctx.arc(emberX, emberY, radius*0.5, 0, Math.PI*2);
        ctx.fill();
      }
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
