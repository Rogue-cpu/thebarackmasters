
function handleStartClick(){
  playUiClick();
  hideMainMenu();
  showShipOverlay();
}
  // --- Team Control Mode Cycler Logic ---
  const CONTROL_MODES = [
    {
      key: 'human',
      img: '../ChatGPT Image Jan 8, 2026, 06_47_54 AM.png',
      alt: 'Human Control',
    },
    {
      key: 'easy',
      img: '../ChatGPT Image Jan 8, 2026, 06_46_32 AM.png',
      alt: 'Easy Cyborg',
    },
    {
      key: 'normal',
      img: '../ChatGPT Image Jan 8, 2026, 06_46_35 AM.png',
      alt: 'Normal Cyborg',
    },
    {
      key: 'hard',
      img: '../ChatGPT Image Jan 8, 2026, 06_46_43 AM.png',
      alt: 'Hard Cyborg',
    },
    {
      key: 'nightmare',
      img: '../ChatGPT Image Jan 8, 2026, 06_46_46 AM.png',
      alt: 'Nightmare Cyborg',
    },
  ];

  let teamModes = {
    team1: 0, // index in CONTROL_MODES
    team2: 0
  };

  function updateModeCycler(team) {
    const idx = teamModes[team];
    const mode = CONTROL_MODES[idx];
    const imgEl = document.getElementById(team === 'team1' ? 'team1-mode-img' : 'team2-mode-img');
    if (imgEl) {
      imgEl.src = mode.img;
      imgEl.alt = mode.alt;
    }
  }

  function cycleMode(team) {
    teamModes[team] = (teamModes[team] + 1) % CONTROL_MODES.length;
    updateModeCycler(team);
  }

  function handleModeCyclerKey(e, team) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycleMode(team);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Set initial images
    updateModeCycler('team1');
    updateModeCycler('team2');
    // Add event listeners
    const team1Btn = document.getElementById('team1-mode-cycler');
    const team2Btn = document.getElementById('team2-mode-cycler');
    if (team1Btn) {
      team1Btn.addEventListener('click', () => cycleMode('team1'));
      team1Btn.addEventListener('keydown', (e) => handleModeCyclerKey(e, 'team1'));
    }
    if (team2Btn) {
      team2Btn.addEventListener('click', () => cycleMode('team2'));
      team2Btn.addEventListener('keydown', (e) => handleModeCyclerKey(e, 'team2'));
    }
  });
  // --- End Team Control Mode Cycler Logic ---

function handleResetClick(){
  playUiClick();
  hideMainMenu();
  running=false;
  stopBattleMusic();
  endActiveSecretEvent({silent:true});
  clearTeamBattleProgress();
  fleetRosters.A = [];
  fleetRosters.B = [];
  updateFleetBuilderUI('Fleets cleared.');
  resetVictoryState();
  resetAvatarFeed();
  ships=[]; bullets=[]; fighters=[]; explosions=[]; fartClouds=[]; plasmaClouds=[]; outposts=[];
  clearAllSectorClouds();
  hideShipOverlay();
  initializeHudMeters();
  drawPaused();
}
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const shipOverlay = document.getElementById('ship-overlay');
const shipGrid = document.getElementById('ship-grid');
const overlayCancel = document.getElementById('overlay-cancel');
const overlayStart = document.getElementById('overlay-start');
const overlayRandom = document.getElementById('overlay-random');
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
const enemyParasiteIndicator = document.getElementById('enemy-parasite-indicator');
const enemyParasiteMeter = document.getElementById('enemy-parasite-meter');
const enemyParasiteCount = document.getElementById('enemy-parasite-count');
const lorePopover = document.getElementById('lore-popover');
const loreTitleEl = document.getElementById('lore-title');
const loreTextEl = document.getElementById('lore-text');
const loreCloseBtn = document.getElementById('lore-close');
const fleetTipEl = document.querySelector('.fleet-tip');
const teamStatusEl = document.getElementById('team-status');
const teamRosterEls = {
  A: document.getElementById('team-roster-a'),
  B: document.getElementById('team-roster-b')
};
const teamCountEls = {
  A: document.getElementById('team-count-a'),
  B: document.getElementById('team-count-b')
};
const teamAddButtons = {
  A: document.getElementById('team-add-a'),
  B: document.getElementById('team-add-b')
};
const teamClearButtons = {
  A: document.getElementById('team-clear-a'),
  B: document.getElementById('team-clear-b')
};
const teamActionRows = {
  A: teamAddButtons.A ? teamAddButtons.A.parentElement : null,
  B: teamAddButtons.B ? teamAddButtons.B.parentElement : null
};

const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const menuStartBtn = document.getElementById('menu-start');
const menuResetBtn = document.getElementById('menu-reset');
const menuMultiplayerBtn = document.getElementById('menu-multiplayer');
const mainMenu = document.getElementById('main-menu');
const profileOverlay = document.getElementById('profile-overlay');
const profileCloseBtn = document.getElementById('profile-close');
const profileUsernameInput = document.getElementById('profile-username');
const profilePasswordInput = document.getElementById('profile-password');
const profileStatusBanner = document.getElementById('profile-status-banner');
const profileErrorEl = document.getElementById('profile-error');
const profileSignupBtn = document.getElementById('profile-signup');
const profileLoginBtn = document.getElementById('profile-login');
const profileLogoutBtn = document.getElementById('profile-logout');
const lobbyOverlay = document.getElementById('multiplayer-overlay');
const lobbyCloseBtn = document.getElementById('lobby-close');
const lobbyOpenProfileBtn = document.getElementById('lobby-open-profile');
const lobbyNameInput = document.getElementById('lobby-name-input');
const lobbyUserLabel = document.getElementById('lobby-user-label');
const lobbyCreateBtn = document.getElementById('lobby-create');
const lobbyRefreshBtn = document.getElementById('lobby-refresh');
const lobbyListEl = document.getElementById('lobby-list');
const lobbyCountEl = document.getElementById('lobby-count');
const lobbyEmptyEl = document.getElementById('lobby-empty');
const lobbyListSection = document.getElementById('lobby-list-view');
const lobbyRoomSection = document.getElementById('lobby-room-view');
const roomNameEl = document.getElementById('room-name');
const roomStatusEl = document.getElementById('room-status');
const lobbyLeaveBtn = document.getElementById('lobby-leave');
const lobbyReadyBtn = document.getElementById('lobby-ready');
const hostNameEl = document.getElementById('host-name');
const guestNameEl = document.getElementById('guest-name');
const hostReadyEl = document.getElementById('host-ready');
const guestReadyEl = document.getElementById('guest-ready');
const hostFleetEl = document.getElementById('host-fleet');
const guestFleetEl = document.getElementById('guest-fleet');
const fleetFormEl = document.getElementById('fleet-form');
const randomFleetBtn = document.getElementById('random-fleet');
const syncFleetBtn = document.getElementById('sync-fleet');
const chatLogEl = document.getElementById('chat-log');
const chatFormEl = document.getElementById('chat-form');
const chatInputEl = document.getElementById('chat-input');
const keys = {w:false,a:false,s:false,d:false,space:false,shift:false};
let pendingSpecialPresses = 0;
let pendingFirePresses = 0;

const eventTestPanel = document.getElementById('event-test-panel');
const eventTestToggleBtn = document.getElementById('event-test-toggle');
const secretRollValueEl = document.getElementById('secret-roll-value');
const triggerHorrorEventBtn = document.getElementById('trigger-horror-event');
const endHorrorEventBtn = document.getElementById('end-horror-event');

const gridSecretTriggerEl = document.getElementById('grid-secret-trigger');
const easterEggOverlay = document.getElementById('easter-egg-overlay');
const easterEggCloseBtn = document.getElementById('easter-egg-close');
const easterEggCancelBtn = document.getElementById('easter-egg-cancel');
const easterEggUnlockBtn = document.getElementById('easter-egg-unlock');
const easterEggFormEl = document.getElementById('easter-egg-form');
const easterEggPasswordInput = document.getElementById('easter-egg-password');
const easterEggErrorEl = document.getElementById('easter-egg-error');

const EASTER_EGG_UNLOCK_KEY_LEGACY = 'bm_easter_egg_unlocked';
const EASTER_EGG_PREFIX = 'bm_egg_';

// Code words -> which easter-egg flag they enable.
// Add more codes here to unlock additional features.
const EASTER_EGG_CODES = {
  SUPERNOVA: 'events',
  DUMMY: 'dummy'
};

function getEasterEggKey(flag){
  return `${EASTER_EGG_PREFIX}${flag}`;
}

function isEasterEggEnabled(flag){
  try{ return localStorage.getItem(getEasterEggKey(flag)) === '1'; }catch(err){ return false; }
}

function enableEasterEgg(flag){
  try{ localStorage.setItem(getEasterEggKey(flag), '1'); }catch(err){}
}

function migrateLegacyEasterEggUnlock(){
  try{
    if(localStorage.getItem(EASTER_EGG_UNLOCK_KEY_LEGACY) === '1'){
      enableEasterEgg('events');
      localStorage.removeItem(EASTER_EGG_UNLOCK_KEY_LEGACY);
    }
  }catch(err){}
}

function updateEasterEggUi(){
  if(eventTestPanel){
    eventTestPanel.classList.toggle('hidden', !isEasterEggEnabled('events'));
  }
}

function openEasterEggOverlay(){
  if(!easterEggOverlay) return;
  if(easterEggErrorEl) easterEggErrorEl.textContent = '';
  if(easterEggPasswordInput) easterEggPasswordInput.value = '';
  easterEggOverlay.classList.remove('hidden');
  easterEggOverlay.setAttribute('aria-hidden', 'false');
  if(easterEggPasswordInput){
    try{ easterEggPasswordInput.focus(); }catch(err){}
  }
}

function closeEasterEggOverlay(){
  if(!easterEggOverlay) return;
  easterEggOverlay.classList.add('hidden');
  easterEggOverlay.setAttribute('aria-hidden', 'true');
}

function attemptEasterEggUnlock(){
  const raw = easterEggPasswordInput ? String(easterEggPasswordInput.value || '') : '';
  const guess = raw.trim().toUpperCase();
  const flag = EASTER_EGG_CODES[guess];
  if(flag){
    enableEasterEgg(flag);
    // If unlocking the debug dummy ship, add it to the ship types immediately.
    try{
      if(flag === 'dummy'){
        if(!SHIP_TYPES.find(t=> t.id === 'test_dummy')){
          SHIP_TYPES.push(createPlaceholderShip({
            id: 'test_dummy',
            name: 'Test Dummy',
            classLabel: 'Test Dummy',
            color: '#cfcfcf',
            size: 28,
            speed: 0,
            hp: 9999,
            fireRate: 0,
            spriteScale: 0.12,
            notes: 'Easter egg test dummy — passive target for abilities.'
          }));
        }
      }
    }catch(e){}
    updateEasterEggUi();
      try{ buildShipPicker(); }catch(e){}
    closeEasterEggOverlay();
    return true;
  }
  if(easterEggErrorEl) easterEggErrorEl.textContent = 'Incorrect code.';
  if(easterEggPasswordInput){
    try{ easterEggPasswordInput.focus(); }catch(err){}
    try{ easterEggPasswordInput.select(); }catch(err){}
  }
  return false;
}

migrateLegacyEasterEggUnlock();
updateEasterEggUi();

if(gridSecretTriggerEl){
  gridSecretTriggerEl.addEventListener('click', ()=>{
    openEasterEggOverlay();
  });

  
  gridSecretTriggerEl.addEventListener('keydown', (e)=>{
    if(e && (e.key === 'Enter' || e.key === ' ')){
      e.preventDefault();
      openEasterEggOverlay();
    }
  });
}
if(easterEggCloseBtn){
  easterEggCloseBtn.addEventListener('click', ()=> closeEasterEggOverlay());
}
if(easterEggCancelBtn){
  easterEggCancelBtn.addEventListener('click', ()=> closeEasterEggOverlay());
}
if(easterEggUnlockBtn){
  easterEggUnlockBtn.addEventListener('click', ()=> attemptEasterEggUnlock());
}
if(easterEggFormEl){
  easterEggFormEl.addEventListener('submit', (e)=>{
    e.preventDefault();
    attemptEasterEggUnlock();
  });
}

// Charge attack configuration for "boring men" energy ball
const CHARGE_LEVELS = [
  // "A few seconds per color" feel: ~2s per tier.
  // Each tier is both more damaging AND faster.
  {name: 'green',  time: 0.0, color: [120,255,120], damage: 8,  speed: 520},
  {name: 'blue',   time: 2.0, color: [120,180,255], damage: 16, speed: 700},
  {name: 'purple', time: 4.0, color: [200,120,255], damage: 32, speed: 920},
  {name: 'red',    time: 6.0, color: [255,80,80],   damage: 64, speed: 1200}
];

function computeChargeLevel(seconds){
  let level = CHARGE_LEVELS[0];
  for(let i=0;i<CHARGE_LEVELS.length;i++){
    if(seconds >= CHARGE_LEVELS[i].time) level = CHARGE_LEVELS[i];
  }
  return level;
}

function getMaxChargeSeconds(){
  return CHARGE_LEVELS[CHARGE_LEVELS.length - 1].time || 1;
}

function spawnBoringBall(ship, level){
  if(!ship) return;
  const projectile = {
    style: 'boringBall',
    color: level.color,
    radius: 10 + (level.damage/6),
  };
  const speed = level.speed || (520 + (level.damage * 40));
  const angle = ship.angle || 0;
  const originX = ship.x + Math.cos(angle) * (ship.size + (projectile.radius+4));
  const originY = ship.y + Math.sin(angle) * (ship.size + (projectile.radius+4));
  const bullet = {
    x: originX,
    y: originY,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    team: ship.team,
    ttl: 2.2,
    damage: level.damage,
    ownerShip: ship,
    raceId: ship.type && ship.type.id,
    projectile,
    seed: Math.random()*Math.PI*2
  };
  bullets.push(bullet);
  playSfx('fire', ship.type && ship.type.id);
}

const CRIMINAL_AMBUSHER_TYPE = {
  id: 'criminal_ambusher',
  name: 'Ambusher',
  classLabel: 'Ambush Skiff',
  size: 8,
  speed: 185,
  hp: 34,
  fireRate: 520,
  color: '#b36b5c',
  spriteFile: '../image - 2026-01-05T170251.938.png',
  spriteFileFire: '../image - 2026-01-05T170229.784.png',
  fireSpriteId: 'criminal_ambusher__fire',
  spriteAngleOffset: -Math.PI/2,
  spriteScale: 0.075,
  trailColors: {core:[255,242,190], mid:[255,200,90]},
  energyCapacity: 60,
  energyCost: 0,
  energyRegen: 40,
  projectile: {
    style:'default',
    damage: 2,
    speed: 500,
    ttl: 1.55,
    muzzleOffset: 12,
    drainEnergy: 7
  }
};

const HORROR_BOSS_TYPE = {
  id: 'horror_boss',
  name: '???',
  classLabel: 'Uncatalogued Entity',
  size: 92,
  speed: 58,
  hp: 1450,
  fireRate: 240,
  color: '#3a0a0a',
  spriteFile: '../ChatGPT Image Jan 5, 2026, 08_21_31 PM.png',
  lockSpriteRotation: true,
  spriteAngleOffset: 0,
  spriteScale: 0.34,
  trailColors: {core:[255,70,70], mid:[90,10,10]},
  energyCapacity: 260,
  energyCost: 0,
  energyRegen: 90,
  projectile: {
    style: 'plasmaBolt',
    length: 52,
    radius: 8,
    core: [255, 210, 210],
    mid: [255, 60, 60],
    tail: [60, 0, 0],
    speed: 420,
    ttl: 2.1,
    muzzleOffset: 92,
    damage: 28
  }
};

function ensureTypeSpritesLoaded(type){
  if(!type || !type.id) return;
  if(type.spriteFile && !SHIP_SPRITES[type.id]){
    const img = new Image();
    img.onload = ()=>{ SHIP_SPRITES[type.id] = img; };
    img.onerror = ()=>{};
    img.src = type.spriteFile;
  }
  if(type.spriteFileFire && type.fireSpriteId && !SHIP_SPRITES[type.fireSpriteId]){
    const img = new Image();
    img.onload = ()=>{ SHIP_SPRITES[type.fireSpriteId] = img; };
    img.onerror = ()=>{};
    img.src = type.spriteFileFire;
  }

  if(type.id === 'cabal' && !SHIP_SPRITES[CABAL_DEPLOYED_SPRITE_KEY]){
    const img = new Image();
    img.onload = ()=>{ SHIP_SPRITES[CABAL_DEPLOYED_SPRITE_KEY] = img; };
    img.onerror = ()=>{};
    img.src = CABAL_DEPLOYED_SPRITE_SRC;
  }
}

function startCriminalAmbush(caster, conf){
  if(!caster) return 0;
  ensureTypeSpritesLoaded(CRIMINAL_AMBUSHER_TYPE);
  const count = Math.max(1, Math.min(12, (conf && conf.count) || 4));
  const radius = Math.max(40, (conf && conf.spawnRadius) || 110);
  const warpDuration = Math.max(0.2, (conf && conf.warpDuration) || 0.65);
  let spawned = 0;
  for(let i=0;i<count;i++){
    const a = Math.random() * Math.PI * 2;
    const jitter = 20 + Math.random()*28;
    const toX = caster.x + Math.cos(a) * radius + (Math.random()-0.5) * jitter;
    const toY = caster.y + Math.sin(a) * radius + (Math.random()-0.5) * jitter;
    const drone = new Ship(CRIMINAL_AMBUSHER_TYPE, toX, toY, caster.team);
    const warpDist = 520 + Math.random() * 320;
    const fromA = a + Math.PI + (Math.random()-0.5) * 0.9;
    const fromX = toX + Math.cos(fromA) * warpDist;
    const fromY = toY + Math.sin(fromA) * warpDist;
    drone.beginWarpFrom(fromX, fromY, warpDuration);
    ships.push(drone);
    spawned++;
  }
  return spawned;
}

function findConfusionRayTarget(caster, range, coneRadians){
  if(!caster) return null;
  const maxRange = Math.max(60, range || 520);
  const cone = Math.max(0.05, coneRadians || 0.45);
  const dirX = Math.cos(caster.angle || 0);
  const dirY = Math.sin(caster.angle || 0);
  let best = null;
  let bestDist = Infinity;
  ships.forEach(s=>{
    if(!s || s.team === caster.team || s.hp <= 0 || s.isWarping()) return;
    const dx = s.x - caster.x;
    const dy = s.y - caster.y;
    const dist = Math.hypot(dx, dy);
    if(dist > maxRange) return;
    const nx = dx / (dist || 1);
    const ny = dy / (dist || 1);
    const dot = nx * dirX + ny * dirY;
    // dot = cos(theta). Require within cone.
    const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
    if(theta > cone) return;
    if(dist < bestDist){
      bestDist = dist;
      best = s;
    }
  });
  return best;
}

function applyConfusionToShip(target, conf, source){
  if(!target || target.hp <= 0 || target.isWarping()) return false;
  const duration = Math.max(0.6, (conf && conf.confuseDuration) || 3.6);
  const driftSpeed = Math.max(80, (conf && conf.driftSpeed) || (200 + Math.random()*140));
  const spinRate = Math.max(2.5, (conf && conf.spinRate) || (7 + Math.random()*6));
  target.confused = {
    age: 0,
    duration,
    driftAngle: Math.random() * Math.PI * 2,
    driftSpeed,
    spinRate,
    seed: Math.random() * Math.PI * 2,
    fxTimer: 0,
    sourceTeam: source ? source.team : null
  };
  // Drop any existing charge state.
  delete target.chargeStart;
  delete target.chargeTierName;
  delete target.aiChargeStart;
  delete target.aiChargeTierName;
  return true;
}
const SESSION_TOKEN_KEY = 'tbm.sessionToken';
const DEFAULT_API_BASE = 'http://localhost:4000';
const detectedOrigin = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http'))
  ? window.location.origin
  : null;
const rawApiBase = (typeof window !== 'undefined' && window.MULTIPLAYER_API_BASE) || detectedOrigin || DEFAULT_API_BASE;
const API_BASE = String(rawApiBase || DEFAULT_API_BASE).replace(/\/$/, '');
const API_ROOT = `${API_BASE}/api`;
const rawWsBase = (typeof window !== 'undefined' && window.MULTIPLAYER_WS_BASE)
  || (API_BASE.startsWith('https') ? API_BASE.replace(/^https/, 'wss') : API_BASE.replace(/^http/, 'ws'));
const WS_ENDPOINT = `${String(rawWsBase || API_BASE).replace(/\/$/, '')}/ws`;
const multiplayerState = {
  user: null,
  token: (typeof localStorage !== 'undefined' && localStorage.getItem(SESSION_TOKEN_KEY)) || null,
  lobbies: [],
  activeLobby: null,
  lobbyState: null,
  socket: null,
  socketTimer: null,
  lobbyLoading: false,
  chatLog: [],
  pendingFleet: [],
  bootstrapStarted: false,
  lastLobbyFetch: 0
};
const INPUT_KEYS = ['w','a','s','d','space','shift'];
const EMPTY_INPUT_STATE = Object.freeze({w:false,a:false,s:false,d:false,space:false,shift:false});
function createInputState(source){
  const state = {};
  INPUT_KEYS.forEach(key=>{ state[key] = !!(source && source[key]); });
  return state;
}
const multiplayerMatch = {
  active: false,
  lobbyId: null,
  role: null,
  seed: null,
  remoteInputs: createInputState(),
  remoteUserId: null,
  lastSentState: null,
  commandSeq: 0,
  commandFrame: null
};
const scheduleFrame = typeof window !== 'undefined' && window.requestAnimationFrame
  ? (cb)=> window.requestAnimationFrame(cb)
  : (cb)=> setTimeout(()=> cb(Date.now()), 16);
const cancelFrame = typeof window !== 'undefined' && window.cancelAnimationFrame
  ? (id)=> window.cancelAnimationFrame(id)
  : (id)=> clearTimeout(id);

const PANEL_WIDTH = 320; // width reserved for HUD + margin
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
    spriteFile: cfg.spriteFile || null,
    spriteAngleOffset: cfg.spriteAngleOffset ?? -Math.PI/2,
    spriteScale: cfg.spriteScale || 0.08,
    trailColors: cfg.trailColors || DEFAULT_TRAIL_COLORS,
    energyCapacity: cfg.energyCapacity,
    energyCost: cfg.energyCost,
    energyRegen: cfg.energyRegen,
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

const RANDOM_SHIP_TYPE = {
  id: 'random',
  name: 'Random',
  classLabel: '???',
  size: 22,
  speed: 0,
  hp: 0,
  fireRate: 0,
  color: '#aaa',
  spriteAngleOffset: 0,
  spriteScale: 0.12,
  trailColors: { core: [200,200,200], mid: [120,120,120] },
  notes: 'Randomly selects a ship for you when battle starts.'
};

const SHIP_TYPES = [
  RANDOM_SHIP_TYPE,
  {id:'servos',name:'Servos',classLabel:'Commander Frigate',size:14,speed:140,hp:60,fireRate:300,color:'#4ef',spriteAngleOffset:-Math.PI/2,spriteScale:0.058,trailColors:{core:[120,210,255],mid:[40,140,255]},
    faction:'Servos',
    factionIcon:'assets/ships/servos/Servos_Flag.webp',
    subfactions:[
      {name:'Prime Era', sprite:'assets/ships/servos/Servos_Flag.webp', color:'#4ef', hp:60, speed:140},
      {name:'Resistance Era', sprite:'assets/ships/servos/Servos_Flag2.png', color:'#2ef', hp:70, speed:150}
    ],
    skins:[
      {name:'Classic', sprite:'assets/ships/servos/Servos_Flag.webp'},
      {name:'Stealth', sprite:'assets/ships/servos/Servos_Flag2.png'}
    ],
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
    {id:'pestilence',name:'Pestilence',classLabel:'Plague Frigate',size:20,speed:150,hp:110,fireRate:180,color:'#7fdc3a',spriteAngleOffset:-Math.PI/2,spriteScale:0.29,trailColors:{core:[120,220,80],mid:[60,140,40]},
      special:{
        type:'regenBiomass',
        cost:22,
        cooldown:9,
        duration:2.8,
        drainPerSecond:26,
        healPerSecond:24,
        stallWindowMs:650,
        stallHealMult:0,
        stallThrustMult:0.55
      },
      projectile:{
        // Slow homing plague-orb that trails and dissolves over time.
        style:'acidOrb',
        radius:14,
        damage:12,
        speed:240,
        ttl:6.5,
        muzzleOffset:20,
        turnRate:3.1,
        turnAssist:0.78,
        leadTime:0.22,
        // Dissolve mechanics: only dissolve when kept at range (dodged).
        dissolveDistance:240,
        dissolveSeconds:2.4,
        restoreSeconds:1.8,
        // Even when partially dissolved, a hit still deals some damage.
        minDamageMult:0.35,
        dot: {
          damagePerSecond: 5,
          duration: 2.8 // seconds
        },
        color: [180, 255, 120],
        trail: [120, 220, 80]
      }
    },
  {id:'lulian',name:'Lulian',classLabel:'Titan Battleship',size:28,speed:120,hp:240,fireRate:650,color:'#f6a94f',spriteAngleOffset:Math.PI/2,spriteScale:0.11,trailColors:{core:[255,255,255],mid:[220,220,220]},
    faction:'Lulian',
    factionIcon:'assets/ships/lulian/Lulian_Aeternum.webp',
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
  {id:'obama',name:'Obama',classLabel:'Humper Cruiser',size:24,speed:155,hp:150,fireRate:420,color:'#f8b2ff',spriteAngleOffset:Math.PI,spriteScale:0.12,overlayRotation:90,trailColors:{core:[255,255,255],mid:[210,230,255]},
    subfactions: [
      { name: 'Obama Nazi Party', sprite: 'assets/ships/obama/obama_nazi_party.png' },
      { name: 'The Other Obamas (TOO)', sprite: 'assets/ships/obama/the_other_obamas.png' },
      { name: 'Obama Labs', sprite: 'assets/ships/obama/obama_labs.png' },
      { name: 'Barack Industries', sprite: 'assets/ships/obama/barack_industries.png' },
      { name: 'Obama Consensus', sprite: 'assets/ships/obama/obama_consensus.png' }
    ],
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
      // Spathi Eluder-esque main torpedo: short-lived homing shot.
      style:'miniTorpedo',
      damage:12,
      speed:560,
      accel:1050,
      ttl:1.65,
      muzzleOffset:14,
      turnRate:7.6,
      turnAssist:0.98,
      leadTime:0.12,
      wobble:0.035,
      length:14,
      width:5,
      colors:{
        body:[235,210,190],
        stripe:[160,130,105],
        glow:[255,170,110]
      }
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
      // Range is primarily speed * ttl; keep damping high so it doesn't stall instantly.
      speed:420,
      ttl:0.65,
      damping:0.99,
      muzzleOffset:16,
      damage:11
    }
  },
  createPlaceholderShip({id:'criminal', name:'Criminal', classLabel:'Syndicate Prototype', color:'#b36b5c', trailColors:{core:[255,242,190],mid:[255,200,90]}, spriteFile:'assets/ships/criminals.png',
    size:28,
    spriteScale:0.11,
    fireRate:80,
    energyCost:3,
    special:{
      type:'ambush',
      cost:22,
      cooldown:9,
      duration:0.6,
      count:4
    },
    projectile:{
      style:'bullet',
      length:18,
      width:2,
      core:[255,245,220],
      mid:[255,200,90],
      speed:860,
      ttl:0.9,
      muzzleOffset:22,
      hitRadius:1.7,
      dualShot:true,
      dualSeparation:7,
      damage:2
    }
  }),
  {id:'yuptauri',name:'Yuptauri',classLabel:'Frontier Boarding Skiff',size:18,speed:175,hp:150,fireRate:360,color:'#77c5ff',spriteAngleOffset:Math.PI/2,spriteScale:0.1,trailColors:{core:[120,255,190],mid:[70,180,220]},energyCapacity:110,energyRegen:18,
    faction:'Yuptauri',
    factionIcon:'assets/ships/yuptauri/Yuptauri Flag.webp',
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
      marineCount:4,
      defenderKillPerSecond:0.26,
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
  createPlaceholderShip({id:'deathousemen', name:'Deathousemen', classLabel:'Night Siege Frame', color:'#4c3a52', spriteAngleOffset:Math.PI/2,
    size:24,
    speed:150,
    hp:150,
    fireRate:1600,
    energyCapacity:120,
    energyCost:10,
    energyRegen:18,
    trailColors:{core:[255,160,140],mid:[180,70,60]},
    spriteFile:'assets/ships/deathhouseman.png',
    special:{
      type:'possession',
      cost:26,
      cooldown:9.5,
      duration:0.35,
      range:540,
      cone:0.55,
      drainFraction:0.35,
      minDrain:22,
      maxDrain:78,
      minRemainingHp:1,
      maxHpMultiplier:2.6
    }
    ,
    projectile: {
      style: 'sniperBolt',
      core: [120,255,120],
      mid: [60,200,90],
      tail: [20,60,20],
      width: 3,
      radius: 2,
      // high travel speed and longer ttl so bolts reach far
      speed: 2200,
      muzzleOffset: 28,
      ttl: 3.5,
      // visual streak length (independent of travel distance)
      drawLength: 48,
      damage: 42
    }
  }),
  createPlaceholderShip({id:'shamen', name:'Shamen', classLabel:'Mystic Skiff', color:'#5a9c68', spriteFile:'assets/ships/Shamen.png', spriteScale:0.14,
    trailColors:{core:[140,235,255],mid:[50,140,255]},
    special:{
      type:'mapTeleport',
      cost:18,
      cooldown:8,
      duration:0.55,
      warpDuration:0.55,
      minDistance: 0.55
    },
    // Main weapon: extremely close-range laser with a high chance to connect.
    projectile:{
      style:'shamenLaser',
      length:190,
      width:2,
      ttl:0.075,
      muzzleOffset:20,
      damage:18,
      hitChance:0.9,
      core:[200,255,200],
      mid:[90,220,120]
    }
  }),
  createPlaceholderShip({id:'anti_shamen', name:'Anti Shamen', classLabel:'Nullifier Frigate', color:'#e74c3c', size:20, speed:160, hp:120, spriteScale:0.14, trailColors:{core:[255,200,120],mid:[255,120,40]}, notes:'Counter to Shamen, disrupts mystic abilities.', spriteFile:'assets/ships/antishamen.png',
    requireTriggerReset:true,
    energyCapacity:120,
    energyCost:10,
    energyRegen:20,
    fireRate:520,
    special:{
      type:'summonDaemon',
      cost:18,
      cooldown:6,
      maxOrbs:3,
      orbTtl:Infinity,
      orbSpeed:170,
      orbTurnRate:6.6,
      orbDamage:0,
      orbDrainEnergy:18,
      orbHitCooldownMs:280,
      orbBounceSpeed:280,
      orbRadius:11,
      orbHitRadius:14,
      orbCore:[255, 200, 120],
      orbMid:[255, 140, 60],
      orbRim:[150, 70, 20]
    },
    projectile:{
      style:'crystalShard',
      radius:7,
      hitRadius:12,
      core:[220,250,255],
      mid:[120,210,255],
      tail:[70,140,220],
      channelHold:true,
      channelSpeed:540,
      channelAccel:1250,
      releaseDamp:0.25,
      driftDrag:0.985,
      speed:220,
      ttl:4.2,
      muzzleOffset:20,
      damage:10,
      shrapnelCount:24,
      shrapnelSpeed:720,
      shrapnelTtl:0.85,
      shrapnelDamage:6,
      shrapnelRadius:2.5,
      shrapnelHitRadius:12,
      shrapnelCore:[245,255,255],
      shrapnelMid:[160,235,255]
    }
  }),
  createPlaceholderShip({id:'breachborn', name:'Breachborn', classLabel:'Abyssal Raider', color:'#3ce7e7', size:22, speed:205, hp:105, spriteScale:0.16, trailColors:{core:[255,180,60],mid:[255,120,20]}, notes:'Born from the breach, excels at hit-and-run tactics.', spriteFile:'assets/ships/breachborn.png',
    special:{
      type:'flameTrail',
      cost:20,
      cooldown:9,
      // Channeled burn: runs while Shift is held, limited by battery.
      duration: Infinity,
      drainPerSecond:34,
      boostMult:2.0,
      spawnInterval:0.07,
      cloudDuration:1.15,
      cloudBaseRadius:22,
      cloudMaxRadius:70,
      cloudExpandTime:0.22,
      cloudDamagePerSecond:46
    },
    projectile:{
      // Main attack: fireball projectile.
      style:'fireball',
      radius:10,
      tailLength:58,
      tailWidth:22,
      core:[255,230,170],
      mid:[255,150,70],
      rim:[190,70,20],
      speed:520,
      ttl:2.1,
      muzzleOffset:18,
      damage:14,
      dot:{
        damagePerSecond:6,
        duration:2.4
      }
    }
  }),
  createPlaceholderShip({id:'lifehousemen', name:'Lifehousemen', classLabel:'Vitalist Cruiser', color:'#6bffb2', size:24, speed:150, hp:140, spriteScale:0.11, trailColors:{core:[110,255,180],mid:[60,210,120]}, notes:'Lifehousemen restore and protect, opposite of Deathousemen.', spriteFile:'assets/ships/lifehousemen.png',
    special:{
      type:'regenPulse',
      cost:20,
      cooldown:8,
      duration:3.25,
      drainPerSecond:22,
      healPerSecond:30,
      breakOnDamage:12
    }
    ,
    projectile: {
      style: 'lifePellet',
      core: [255,240,140],
      mid: [255,210,90],
      tail: [200,160,60],
      width: 2,
      radius: 1.6,
      // reduced speed/ttl to shorten travel range
      speed: 900,
      muzzleOffset: 20,
      ttl: 1.0,
      damage: 8,
      // scatter behavior (number of pellets and total cone in radians)
      scatterCount: 6,
      scatterSpread: 0.6,
      // drawn streak length for visual bullets
      drawLength: 18
    }
  }),
  createPlaceholderShip({id:'barack', name:'Barack', classLabel:'Dynasty Carrier', color:'#f4c2ff', spriteScale:0.22,
    special:{
      // San Devistan-style global slow + RGB cinematic field.
      type:'devistanField',
      cost:28,
      cooldown:18,
      duration:5.0,
      // how slow the world becomes (0.0..1.0)
      slowTimeScale: 0.06,
      // player's relative speed multiplier while active
      playerSpeedMult: 1.35,
      // intensity of RGB overlay (0..1)
      rgbIntensity: 0.85
    },
    // Main weapon: fallen-empire lightning bolt (hitscan zap).
    projectile:{
      style:'lightningBolt',
      length:720,
      width:7,
      ttl:0.075,
      muzzleOffset:22,
      damage:18,
      core:[255,110,110],
      mid:[235,35,35],
      accent:[255,185,185]
    }
  }),
  {id:'obsidian_circuit',name:'Obsidian Circuit',classLabel:'Graviton Warhost',size:32,speed:110,hp:260,fireRate:220,color:'#4d566c',spriteAngleOffset:Math.PI/2,spriteScale:0.15,overlayRotation:180,requireTriggerReset:true,trailColors:{core:[255,80,80],mid:[140,30,30]},
    faction:'Obsidian Circuit',
    factionIcon:'assets/ships/obsidian_circuit/Obsidiancircuit.png',
    spriteFile:'assets/ships/obisdian_circuit.png',
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
  createPlaceholderShip({id:'obamination', name:'Obamination', classLabel:'Absolution Hull', color:'#ff8c7a', trailColors:{core:[190,255,160],mid:[90,210,70]},
    special:{
      type:'parasitePods',
      cost:18,
      cooldown:9,
      podCount:3,
      podSpeed:520,
      podTtl:1.85,
      onHitDamage:6,
      slowPer:0.085,
      turnSlowPer:0.085,
      parasiteHp:12,
      parasiteDuration:9.5
    },
    // Close-range tentacle/tendril lash. Parasites slow targets so Obamination can get in.
    fireRate: 420,
    projectile:{
      style:'tendrilLash',
      range:175,
      width:5,
      cone: Math.PI * 0.9,
      ttl:0.14,
      muzzleOffset:18,
      damage:16,
      core:[255,170,90],
      mid:[170,105,55],
      segs:10,
      amp:14
    }
  }),
  createPlaceholderShip({id:'phantom', name:'Phantom', classLabel:'Veiled Corvette', color:'#9ad5d8', size:26, spriteScale:0.12,
    trailColors:{core:[220,180,255],mid:[130,70,210]},
    special:{
      type:'randomMorph',
      cost:18,
      cooldown:9,
      duration:7.5
    },
    projectile:{
      style:'plasmaOrb',
      radius:8,
      tailLength:48,
      tailWidth:18,
      core:[255,240,255],
      mid:[200,140,255],
      rim:[120,40,200],
      speed:520,
      ttl:2.5,
      muzzleOffset:18,
      damage:15
    }}),
  createPlaceholderShip({id:'taftian', name:'Taftian', classLabel:'Tribunal Cruiser', color:'#d3ab80', spriteFile:'assets/ships/Taftian.png',
    // Missile battery: two shots back-to-back, then recharge.
    energyCapacity: 100,
    energyCost: 50,
    energyRegen: 22,
    fireRate: 240,
    special:{
      type:'layMine',
      cost:18,
      cooldown:0,
      mineTtl:22,
      mineRadius:11,
      mineDamage:18,
      mineAoERadius:78,
      mineAoEDamage:10
    },
    projectile:{
      style:'missile',
      speed:420,
      accel:820,
      ttl:4.2,
      muzzleOffset:26,
      radius:7,
      hitRadius:10,
      damage:16,
      // Fire-and-forget: lock once at launch, then pursue via course correction.
      fireAndForget:true,
      guidance:'velocityTurn',
      // Mild lead so it follows enemy movement without being a guaranteed hit.
      leadTime:0.32,
      // If the target is behind the cruiser, give the missile a short window of extra turning
      // so it curves around and tries to hit instead of sailing off.
      behindTurnBoost:1.45,
      behindTurnWindow:0.85,
      turnRate:4.4,
      turnAssist:1,
      // Keep tracking for the full life (fire-and-forget guidance), but still evadable.
      lockDistance:0,
      maxTrackTime:Infinity,
      // Rare mishap: if a missile loses its lock and has been flying a while, it can hit its launcher.
      friendlyFireAfter:2.35,
      friendlyFireMinTravel:210,
      // Terminal phase: make missiles dodgeable so they aren't guaranteed hits.
      // - Reduce turning when close so sharp jukes can work.
      // - Small chance to lose lock when close to the target.
      terminalTurnDamp:0.62,
      terminalDodgeDistance:140,
      terminalLoseLockChancePerSecond:0.28,
      wobble:0.18,
      colors:{ body:[240,220,190], stripe:[140,120,95], glow:[255,190,120] }
    }
  }),
  createPlaceholderShip({id:'khanite', name:'Khanite', classLabel:'Heir Apparent', color:'#c47b3f', spriteFile:'assets/ships/Khanite.png', spriteAngleOffset:Math.PI/2, spriteScale:0.14,
    special:{
      type:'combatOutpost',
      cost:26,
      cooldown:14,
      hp:80,
      range:820,
      fireInterval:0.32,
      bulletSpeed:520,
      bulletDamage:7
    },
    projectile:{
      // Manifold Missile: a main missile that splits into 5 forward mini-missiles,
      // then each of those splits into 10 forward fragments.
      style:'manifoldMissile',
      speed:420,
      accel:900,
      ttl:1.15,
      muzzleOffset:24,
      radius:7,
      hitRadius:11,
      damage:10,
      stage1Fuse:0.62,
      stage1Count:5,
      stage1Spread:0.42,
      stage1ChildSpeed:360,
      stage1ChildAccel:760,
      stage1ChildTtl:1.05,
      stage1ChildDamage:6,
      stage1ChildRadius:6,
      stage1ChildHitRadius:10,
      stage2Fuse:0.55,
      stage2Count:10,
      stage2Spread:0.78,
      stage2ChildSpeed:320,
      stage2ChildAccel:680,
      stage2ChildTtl:0.95,
      stage2ChildDamage:3,
      stage2ChildRadius:5,
      stage2ChildHitRadius:9,
      colors:{ body:[240,235,225], stripe:[185,125,70], glow:[255,200,120] }
    }
  }),
  createPlaceholderShip({id:'cabal', name:'Cabal', classLabel:'Cabal Doctrine', color:'#6e5a94', spriteAngleOffset:Math.PI/2,
    fireRate:1000,
    trailColors:{core:[255,120,120],mid:[200,40,40]},
    special:{
      // Replaced dualDoctrine with Blackgrid Hack: quickhack-style damage over time and visuals.
      type:'blackgridHack',
      cost:20,
      cooldown:6,
      range:480,
      cone:0.65,
      duration:3.0,
      damagePerSecond: 48,
      tickInterval: 0.25,
      shakeIntensity: 8
    },
    projectile:{
      // Default form: long-range lock-on missiles.
      style:'missile',
      dualShot:true,
      dualSeparation:14,
      speed:480,
      accel:860,
      ttl:5.8,
      muzzleOffset:22,
      radius:7,
      hitRadius:11,
      damage:12,
      turnRate:3.4,
      turnAssist:0.9,
      lockDistance:28,
      maxTrackTime:Infinity,
      wobble:0.15,
      colors:{ body:[235,220,255], stripe:[110,70,170], glow:[255,120,200] }
    },
    // Deployed form: close-range laser.
    deployedProjectile:{
      style:'laserBeam',
      ttl:0.08,
      muzzleOffset:22,
      length:520,
      width:8,
      dualBeam:true,
      beamSeparation:18,
      damagePerSecond: 170,
      drainPerSecond: 38,
      core:[255,200,255],
      mid:[190,60,255]
    }
  }),
  createPlaceholderShip({
    id:'boring_man',
    name:'Boring Man',
    classLabel:'Doldrum Frigate',
    color:'#8f8f8f',
    trailColors:{core:[230,230,240], mid:[140,140,160]},
    spriteFile:'assets/ships/boringman.png',
    spriteScale:0.22,
    special:{
      type:'confusionRay',
      cost:18,
      cooldown:7,
      duration:0.28,
      range:520,
      cone:0.5,
      confuseDuration:3.6,
      driftSpeed:260,
      spinRate:9.5
    }
  }),
  createPlaceholderShip({id:'sons_of_source', name:'Sons of Source', classLabel:'Source Choir', color:'#ffe8a6', spriteFile:'assets/ships/sonsofsource.png',
    size:30,
    spriteScale:0.14,
    projectile:{
      style:'laserBeam',
      ttl:0.08,
      muzzleOffset:22,
      length:360,
      width:9,
      // Channel weapon: damage/drain are applied per-second while holding Space.
      damagePerSecond: 135,
      drainPerSecond: 42,
      core:[170, 255, 170],
      mid:[80, 210, 110]
    },
    special:{
      type:'tractionBeam',
      cost:22,
      cooldown:10,
      duration:1.35,
      drainPerSecond:32,
      range:0,
      cone:0.5,
      pullStrength:420,
      targetDrainPerSecond:26
    }
  })
];

// If the DUMMY easter-egg was previously unlocked, register the Test Dummy ship type now.
try{
  if(typeof isEasterEggEnabled === 'function' && isEasterEggEnabled('dummy')){
    if(!SHIP_TYPES.find(t=> t.id === 'test_dummy')){
      SHIP_TYPES.push(createPlaceholderShip({
        id: 'test_dummy',
        name: 'Test Dummy',
        classLabel: 'Test Dummy',
        color: '#cfcfcf',
        size: 28,
        speed: 0,
        hp: 9999,
        fireRate: 0,
        spriteScale: 0.12,
        notes: 'Easter egg test dummy — passive target for abilities.'
      }));
    }
  }
}catch(e){}

const SHIP_LORE = {
  servos:'Servos are Lulian-built machines that defected from the genocidal Obsidian Circuit, raised the Servos Prime ringworld, and now roam the sectors seeding new biospheres in defiance of their creators’ perfection cult.',
  lulian:'The Lulians trace their rule to Taft’s post-First Genesis empire, when they seized Source after crushing the Fattians; even the short surviving chronicle centers their founding myth and absolute dominance.',
  obama:'The Obamas are clone legions spawned by Obama Prime inside a stolen Pickle birthing plant, infamous for their perverse polity, constant flight from Lulian extinction writs, and vendettas with both Fattians and Deathousemen.',
  bad_ghost:'Bad Ghosts are biomechanical clone zealots who venerate grotesque “poop” sigils; the faction schismed when pragmatists became The Criminals, only to reunite under Mossah during the tangled lead-up to the Second Poop War.',
  pickle:'The Pickle dossier is still fragmentary—“The pickles are a …” is all the archive holds—so fresh intel or another source is required before we lock their lore.',
  fattian:'Fattians began as tortured Lulian offshoots manufactured by The Factory; Mossah de Fathead industrialized their decadence, weaponized it against the Lulians, and ultimately drove their exile into space.',
  lunarian:'Lunarians were sculpted from Genesis magic by Alkibas, freed by Queen Lysandra, and founded Lunaria on Nightshade Island; they still bankroll Resistance cells with moon-tech relics.',
  criminal:'The Criminals splintered from the Bad Ghost regime, rebuilt as a syndicate under Mossah, and turned every contract during the Second Poop War into leverage against their parent cult.',
  yuptauri:'The Yuptauri were an extinct precursor civilization that rode escalating hypertech until it consumed them, leaving only their boarding doctrines and ruin-fields behind.',
  obsidian_circuit:'The Obsidian Circuit is an ascended machine intelligence derived from Obamination stock, ruled by Abyssion and the Dark Trinity out of the Black Grid.',
  phantom:'Phantoms are Obamination-Pickle hybrid shapeshifters who ingest leadership castes, hijack entire societies, and wage a hidden war against Paladin defectors and the Slayer hunter-kill teams.',
  taftian:'Taftians descend from Lulian seed-lines planted during the Second Genesis; their Tribunal Cruisers still chant Phoenix Alliance liturgies while carrying Spear-of-Hope telemetry and AFS treaty seals into every fight.',
  khanite:'Khanites are Factory-corrupted heirs of the Fattian bloodline—Alkibas branded their Heir Apparent hulls with relic plating from the Silent Shadow and drenched them in Damocles fallout to remind the galaxy who burned Source first.',
  cabal:'Cabal Doctrine vessels operate as doctrinal servers. Every volley they fire rewrites local law, making resistance technically illegal in the system for the next ten minutes.',
  sons_of_source:'The Sons of Source grew from the Lulian-aligned DYN-SEC PMC, seized Source during the Obsidian Circuit War, and built an anti-AI fascist state infamous for the Million Machine March massacre and the KALIBRA purges.',
  deathousemen:'Deathousemen are paranormal financiers existing between life and oblivion, captaining fleets like the Krypt-class battle cruiser and Revenant frigates to ensure every contract collects, even from the dead.'
};

function getShipLoreText(typeOrId){
  if(!typeOrId) return 'Lore file missing from databanks. Someone forgot to uplink the story module.';
  const type = typeof typeOrId === 'string' ? SHIP_TYPES.find(t=> t.id === typeOrId) : typeOrId;
  if(!type) return 'Lore file missing from databanks. Someone forgot to uplink the story module.';
  return SHIP_LORE[type.id] || `${type.name} have filed a blackout on their historical record. Intelligence only knows that their ${type.classLabel || 'flagship'} answers to no external authority.`;
}

function getShipTypeById(id){
  if(!id) return null;
  return SHIP_TYPES.find(type=> type.id === id) || null;
}

function getShipSpriteSrc(id){
  if(!id) return '';
  // Special case for Taftian: try both 'Taftian.png' and 'taftian.png'
  if(id === 'taftian') {
    if (window && window.fetch) {
      try {
        const req = new XMLHttpRequest();
        req.open('HEAD', 'assets/ships/Taftian.png', false);
        req.send();
        if (req.status >= 200 && req.status < 300) {
          return 'assets/ships/Taftian.png';
        }
      } catch (e) {}
    }
    return 'assets/ships/taftian.png';
  }
  const shipType = getShipTypeById(id);
  if(shipType && shipType.spriteFile) return shipType.spriteFile;
  if(id === 'obsidian_circuit') {
    return 'assets/ships/obsidian_circuit/Obsidiancircuit.png';
  }
  if(id === 'deathousemen') {
    return 'assets/ships/deathhouseman.png';
  }
  return `assets/ships/${id}.png`;
}

function appendRosterChipBody(chip, shipId, labelText){
  const body = document.createElement('div');
  body.className = 'roster-chip-body';
  if(shipId){
    const sprite = document.createElement('img');
    sprite.className = 'roster-chip-sprite';
    sprite.src = getShipSpriteSrc(shipId);
    sprite.alt = `${labelText} sprite`;
    body.appendChild(sprite);
  }
  const label = document.createElement('span');
  label.className = 'roster-chip-label';
  label.textContent = labelText;
  body.appendChild(label);
  chip.appendChild(body);
  return body;
}

const SHIP_SPRITES = {};
const CABAL_DEPLOYED_SPRITE_KEY = 'cabal_deployed';
const CABAL_DEPLOYED_SPRITE_SRC = '../cabaldeployedform.png';
function preloadShipSprites(){
  SHIP_TYPES.forEach(type=>{
    const img = new Image();
    img.onload = ()=>{ SHIP_SPRITES[type.id] = img; };
    img.onerror = ()=>{};
    img.src = type.spriteFile || `assets/ships/${type.id}.png`;

    if(type.id === 'cabal'){
      const deployedImg = new Image();
      deployedImg.onload = ()=>{ SHIP_SPRITES[CABAL_DEPLOYED_SPRITE_KEY] = deployedImg; };
      deployedImg.onerror = ()=>{};
      deployedImg.src = CABAL_DEPLOYED_SPRITE_SRC;
    }

    if(type.spriteFileFire && type.fireSpriteId){
      const fireImg = new Image();
      fireImg.onload = ()=>{ SHIP_SPRITES[type.fireSpriteId] = fireImg; };
      fireImg.onerror = ()=>{};
      fireImg.src = type.spriteFileFire;
    }
  });
}

const CAPTAIN_DIR = 'data/captains';
const DEFAULT_CAPTAIN_NAMES = ['Captain Nova','Commander Alys','Captain Thorn','Legate Myr'];
let captainData = { default: [...DEFAULT_CAPTAIN_NAMES] };
const captainAssignments = {A:'',B:''};

let selectionA = SHIP_TYPES[0], selectionB = SHIP_TYPES[1];
const TEAM_IDS = ['A','B'];
const TEAM_LABELS = {A:'Player Fleet', B:'Enemy Fleet'};
const MAX_TEAM_SIZE = 12;
const fleetRosters = {A: [], B: []};
let teamBattleState = null;
let teamDraftOpen = false;
let overlayMode = 'draft';

function buildShipPicker(){
  if(!shipGrid) return;
  shipGrid.innerHTML = '';
  SHIP_TYPES.forEach(type=>{
    const factionLabel = type.faction || 'Unknown faction';
    const factionMark = (type.factionCode || factionLabel.slice(0,2)).toUpperCase();
    const card = document.createElement('div');
    card.className = 'ship-card';
    card.dataset.shipId = type.id;
    card.tabIndex = 0;
    let spriteHtml = '';
    if(type.id === 'random') {
      spriteHtml = `<div class="ship-card-img ship-card-img-random"><span class="random-qmark">?</span></div>`;
    } else {
      let spriteSrc = type.spriteFile || `assets/ships/${type.id}.png`;
      if(type.id === 'deathousemen') spriteSrc = 'assets/ships/deathhouseman.png';
      spriteHtml = `<div class="ship-card-img">
        <img src="${spriteSrc}" alt="${type.name} sprite" class="ship-card-img-sprite" tabindex="0" role="button" aria-label="Customize ${type.name}">
      </div>`;
    }
    card.innerHTML = `
      <div class="ship-card-logo" title="${factionLabel}" aria-hidden="true">
        <span>${factionMark}</span>
      </div>
      <button class="ship-card-info" type="button" aria-label="Read ${type.name} lore">?</button>
      ${spriteHtml}
      <div class="ship-card-name">${type.name}</div>
      ${type.classLabel ? `<div class="ship-card-role">${type.classLabel}</div>` : ''}
      <div style="font-size:12px;color:#89a">${type.id === 'random' ? 'Random ship each battle' : `Crew ${type.hp} · Speed ${type.speed}`}</div>
    `;
    // Only rotate the ship sprite image, not the faction icon
    if(type.id !== 'random') {
      const shipImg = card.querySelector('.ship-card-img img');
      if(shipImg){
        if(typeof type.overlayRotation === 'number') shipImg.style.transform = `rotate(${type.overlayRotation}deg)`;
        else shipImg.style.transform = '';
        // Add event to open subfaction/skin modal
        shipImg.addEventListener('click', (evt)=>{
          evt.preventDefault();
          evt.stopPropagation();
          openSubfactionModal(type);
        });
        shipImg.addEventListener('keydown', (evt)=>{
          if(evt.key === 'Enter' || evt.key === ' '){
            evt.preventDefault();
            evt.stopPropagation();
            openSubfactionModal(type);
          }
        });
      }
    }
    const selectShip = (evt) => {
      // If the click originated from the sprite image, do not select the ship
      if(evt && evt.target && evt.target.classList && evt.target.classList.contains('ship-card-img-sprite')) return;
      handleShipChoice(type);
    };
    card.addEventListener('click', selectShip);
    card.addEventListener('keydown', (evt)=>{
      if(evt.key === 'Enter' || evt.key === ' '){ evt.preventDefault(); selectShip(evt); }
    });
    const loreBtn = card.querySelector('.ship-card-info');
    if(loreBtn){
      const stop = (evt)=>{ evt.stopPropagation(); };
      loreBtn.addEventListener('click',(evt)=>{
        evt.preventDefault();
        evt.stopPropagation();
        showLoreForShip(type);
      });
      loreBtn.addEventListener('keydown', stop);
      loreBtn.addEventListener('keyup', stop);
    }
    shipGrid.appendChild(card);
  });
  updateOverlaySelection();
}
// Subfaction/Skin Modal Logic
const subfactionModal = document.getElementById('subfaction-modal');
const subfactionModalCard = document.getElementById('subfaction-modal-card');
const subfactionModalTitle = document.getElementById('subfaction-modal-title');
const subfactionModalOptions = document.getElementById('subfaction-modal-options');
const subfactionModalClose = document.getElementById('subfaction-modal-close');
let subfactionModalShipType = null;

function openSubfactionModal(shipType) {
  if (!subfactionModal || !subfactionModalOptions) return;
  subfactionModalShipType = shipType;
  subfactionModal.classList.remove('hidden');
  subfactionModal.setAttribute('aria-hidden', 'false');
  subfactionModalTitle.textContent = `Select Subfaction / Skin for ${shipType.name}`;
  subfactionModalOptions.innerHTML = '';
  // Show subfactions if present, else skins, else fallback
  let options = [];
  if (Array.isArray(shipType.subfactions) && shipType.subfactions.length) {
    options = shipType.subfactions;
  } else if (Array.isArray(shipType.skins) && shipType.skins.length) {
    options = shipType.skins;
  }
  if (!options.length) {
    const msg = document.createElement('div');
    msg.textContent = 'No subfactions or skins available for this ship.';
    subfactionModalOptions.appendChild(msg);
  } else {
    // Gallery style: flex row, image + name
    subfactionModalOptions.style.display = 'flex';
    subfactionModalOptions.style.flexDirection = 'row';
    subfactionModalOptions.style.flexWrap = 'wrap';
    subfactionModalOptions.style.justifyContent = 'center';
    subfactionModalOptions.style.gap = '18px';
    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'subfaction-gallery-item';
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.minWidth = '110px';
      item.style.maxWidth = '140px';
      item.style.padding = '8px 4px';
      item.style.borderRadius = '10px';
      item.style.background = 'rgba(20,30,50,0.18)';
      item.style.boxShadow = '0 2px 10px rgba(0,0,0,0.12)';
      // Ship image
      const img = document.createElement('img');
      img.src = opt.sprite || shipType.spriteFile || `assets/ships/${shipType.id}.png`;
      img.alt = opt.name || shipType.name;
      img.style.width = '110px';
      img.style.height = '110px';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '8px';
      img.style.background = '#111a';
      // Select button
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt.name || 'Unnamed';
      btn.style.marginTop = '8px';
      btn.style.fontSize = '1.1em';
      btn.style.padding = '12px 0';
      btn.style.width = '100%';
      btn.style.maxWidth = '140px';
      btn.addEventListener('click', () => {
        // TODO: Apply subfaction/skin selection to the shipType or selectionA
        closeSubfactionModal();
      });
      item.appendChild(img);
      item.appendChild(btn);
      subfactionModalOptions.appendChild(item);
    });
  }
  // Focus first button or close button
  setTimeout(() => {
    const firstBtn = subfactionModalOptions.querySelector('button');
    if (firstBtn) firstBtn.focus();
    else if (subfactionModalClose) subfactionModalClose.focus();
  }, 0);
}

function closeSubfactionModal() {
  if (!subfactionModal) return;
  subfactionModal.classList.add('hidden');
  subfactionModal.setAttribute('aria-hidden', 'true');
  subfactionModalShipType = null;
}

if (subfactionModalClose) {
  subfactionModalClose.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeSubfactionModal();
  });
}



function updateFleetBuilderUI(statusMessage){
  const inDraft = overlayMode === 'draft';
  const activeBattleView = !inDraft && teamBattleState && teamBattleState.active;
  const pendingTeam = activeBattleView ? teamBattleState.pendingTeam : null;
  const pendingSelection = activeBattleView ? teamBattleState.pendingSelection : null;

  TEAM_IDS.forEach(team=>{
    const container = teamRosterEls[team];
    const addBtn = teamAddButtons[team];
    const clearBtn = teamClearButtons[team];
    const actionRow = teamActionRows[team];
    const roster = activeBattleView ? (teamBattleState.rosters[team] || []) : fleetRosters[team];
    const activeShipId = activeBattleView ? teamBattleState.current[team] : null;

    if(container){
      container.innerHTML = '';
      if(activeBattleView){
        if(activeShipId){
          const activeChip = document.createElement('div');
          activeChip.className = 'roster-chip active';
          const ship = getShipTypeById(activeShipId);
          appendRosterChipBody(activeChip, activeShipId, `Active • ${ship ? ship.name : activeShipId}`);
          container.appendChild(activeChip);
        }
        if(!roster.length){
          const empty = document.createElement('div');
          empty.className = 'roster-chip empty';
          const span = document.createElement('span');
          span.textContent = 'No reserves remaining';
          empty.appendChild(span);
          container.appendChild(empty);
        } else {
          roster.forEach((shipId,index)=>{
            const chip = document.createElement('div');
            chip.className = 'roster-chip';
            const ship = getShipTypeById(shipId);
            appendRosterChipBody(chip, shipId, ship ? ship.name : shipId);
            if(pendingTeam === team){
              chip.classList.add('selectable');
              chip.dataset.action = 'select';
              chip.dataset.team = team;
              chip.dataset.index = String(index);
                chip.tabIndex = 0;
                if(pendingSelection && pendingSelection.team === team && pendingSelection.index === index){
                  chip.classList.add('selected');
                }
                const commitSelection = ()=> handleReserveSelection(team, index);
                chip.addEventListener('click', (evt)=>{
                  evt.preventDefault();
                  commitSelection();
                });
                chip.addEventListener('keydown', (evt)=>{
                  if(evt.key === 'Enter' || evt.key === ' '){
                    evt.preventDefault();
                    commitSelection();
                  }
                });
            }
            container.appendChild(chip);
          });
        }
      } else {
        if(!roster.length){
          const empty = document.createElement('div');
          empty.className = 'roster-chip empty';
          const span = document.createElement('span');
          span.textContent = 'No ships assigned';
          empty.appendChild(span);
          container.appendChild(empty);
        } else {
          roster.forEach((shipId,index)=>{
            const chip = document.createElement('div');
            chip.className = 'roster-chip';
            const ship = getShipTypeById(shipId);
            appendRosterChipBody(chip, shipId, `${index+1}. ${ship ? ship.name : shipId}`);
            const controls = document.createElement('div');
            controls.className = 'roster-chip-controls';
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.dataset.action = 'remove';
            removeBtn.dataset.index = String(index);
            removeBtn.dataset.team = team;
            removeBtn.textContent = 'Remove';
            controls.appendChild(removeBtn);
            chip.appendChild(controls);
            container.appendChild(chip);
          });
        }
      }
    }

    const countEl = teamCountEls[team];
    if(countEl){
      if(inDraft) countEl.textContent = `${roster.length} / ${MAX_TEAM_SIZE} hulls`;
      else countEl.textContent = `${roster.length} ships remaining`;
    }

    const addDisabled = !inDraft || !selectionA || roster.length >= MAX_TEAM_SIZE;
    if(addBtn){
      addBtn.disabled = addDisabled;
      addBtn.style.display = inDraft ? '' : 'none';
    }
    const clearDisabled = !inDraft || roster.length === 0;
    if(clearBtn){
      clearBtn.disabled = clearDisabled;
      clearBtn.style.display = inDraft ? '' : 'none';
    }
    if(actionRow){
      actionRow.style.display = inDraft ? 'flex' : 'none';
    }
  });

  if(teamStatusEl){
    if(statusMessage) teamStatusEl.textContent = statusMessage;
    else if(inDraft){
      teamStatusEl.textContent = (!fleetRosters.A.length || !fleetRosters.B.length)
        ? 'Assign at least one hull to each fleet.'
        : 'Fleets ready. Launch when you are.';
    } else if(activeBattleView){
      if(pendingTeam) teamStatusEl.textContent = `${TEAM_LABELS[pendingTeam]}: choose the next combatant.`;
      else teamStatusEl.textContent = 'Team battle in progress.';
    } else {
      teamStatusEl.textContent = '';
    }
  }

  if(overlayStart){
    if(inDraft){
      overlayStart.textContent = 'Launch Fleet Battle';
      overlayStart.disabled = !(fleetRosters.A.length && fleetRosters.B.length);
    } else {
      overlayStart.textContent = 'Deploy Next Battle';
      const ready = !!(teamBattleState && teamBattleState.pendingTeam && pendingSelection);
      overlayStart.disabled = !ready;
    }
  }

  if(overlayCancel){
    const canCancel = inDraft;
    overlayCancel.disabled = !canCancel;
    overlayCancel.style.visibility = canCancel ? 'visible' : 'hidden';
  }

  if(overlayRandom){
    const showRandom = !inDraft && !!(teamBattleState && teamBattleState.pendingTeam);
    overlayRandom.style.display = showRandom ? 'inline-flex' : 'none';
    overlayRandom.disabled = !showRandom;
  }

  if(fleetTipEl){
    fleetTipEl.style.display = inDraft ? 'block' : 'none';
  }
  if(shipGrid){
    shipGrid.style.display = inDraft ? 'grid' : 'none';
  }
}

function addShipToRoster(team){
  if(!teamDraftOpen) return;
  if(!selectionA){
    updateFleetBuilderUI('Select a hull to add.');
    return;
  }
  const roster = fleetRosters[team];
  if(roster.length >= MAX_TEAM_SIZE){
    updateFleetBuilderUI(`${TEAM_LABELS[team]} is full.`);
    return;
  }
  roster.push(selectionA.id);
  updateFleetBuilderUI(`${selectionA.name} assigned to ${TEAM_LABELS[team]}.`);
}

function removeShipFromRoster(team, index){
  const roster = fleetRosters[team];
  if(!Array.isArray(roster) || index<0 || index>=roster.length) return;
  const [removed] = roster.splice(index,1);
  const ship = getShipTypeById(removed);
  updateFleetBuilderUI(`${ship ? ship.name : 'Ship'} removed from ${TEAM_LABELS[team]}.`);
}

function clearTeamRoster(team){
  if(!teamDraftOpen) return;
  if(!fleetRosters[team].length) return;
  fleetRosters[team] = [];
  updateFleetBuilderUI(`${TEAM_LABELS[team]} cleared.`);
}

function resetFleetRosters(){
  TEAM_IDS.forEach(team=>{
    fleetRosters[team] = [];
  });
}

function showTeamVictoryDraft(winningTeam){
  const label = TEAM_LABELS[winningTeam] || 'Fleet';
  resetFleetRosters();
  showShipOverlay({
    mode: 'draft',
    statusMessage: `${label} prevails! Build or load a fresh strike group.`
  });
}

function handleReserveSelection(team, index){
  if(!teamBattleState || !teamBattleState.active) return;
  if(teamBattleState.pendingTeam !== team) return;
  const roster = teamBattleState.rosters[team];
  if(!Array.isArray(roster) || !roster.length) return;
  if(index < 0 || index >= roster.length) return;
  teamBattleState.pendingSelection = {team, index};
  playUiClick();
  updateFleetBuilderUI();
}

function beginFleetBattle(){
  if(!(fleetRosters.A.length && fleetRosters.B.length)){
    updateFleetBuilderUI('Need at least one ship per fleet.');
    return;
  }
  clearTeamBattleProgress();
  teamBattleState = {
    active: true,
    network: false,
    rosters: {
      A: fleetRosters.A.slice(),
      B: fleetRosters.B.slice()
    },
    current: {A: null, B: null},
    pendingTeam: null,
    pendingSelection: null
  };
  teamBattleState.current.A = teamBattleState.rosters.A.shift();
  teamBattleState.current.B = teamBattleState.rosters.B.shift();
  applyTeamBattleSelections();
  hideShipOverlay();
  hideMainMenu();
  playUiClick();
  startBattle();
}

function commitPendingBattleSelection(){
  if(!teamBattleState || !teamBattleState.active) return;
  const pendingTeam = teamBattleState.pendingTeam;
  const pending = teamBattleState.pendingSelection;
  if(!pendingTeam || !pending || pending.team !== pendingTeam) return;
  const roster = teamBattleState.rosters[pendingTeam];
  if(!Array.isArray(roster) || !roster.length) return;
  const idx = pending.index;
  if(idx < 0 || idx >= roster.length) return;
  const [shipId] = roster.splice(idx, 1);
  teamBattleState.current[pendingTeam] = shipId;
  teamBattleState.pendingTeam = null;
  teamBattleState.pendingSelection = null;
  hideShipOverlay();
  playUiClick();
  applyTeamBattleSelections();
  startBattle();
}

function randomizePendingSelection(){
  if(!teamBattleState || !teamBattleState.active) return;
  const pendingTeam = teamBattleState.pendingTeam;
  if(!pendingTeam) return;
  const roster = teamBattleState.rosters[pendingTeam];
  if(!Array.isArray(roster) || !roster.length) return;
  const index = Math.floor(Math.random() * roster.length);
  handleReserveSelection(pendingTeam, index);
  commitPendingBattleSelection();
}

function applyTeamBattleSelections(){
  if(!teamBattleState) return;
  const nextA = getShipTypeById(teamBattleState.current.A) || selectionA || SHIP_TYPES[0];
  const nextB = getShipTypeById(teamBattleState.current.B) || selectionB || SHIP_TYPES[1] || SHIP_TYPES[0];
  if(nextA) selectionA = nextA;
  if(nextB) selectionB = nextB;
  ensureCaptainsAssigned(true);
  updateSelectionUI();
}

function processTeamBattleOutcome(winnerShip){
  if(!winnerShip || !teamBattleState || !teamBattleState.active) return;
  const winningTeam = winnerShip.team;
  const losingTeam = winningTeam === 'A' ? 'B' : 'A';
  const reserves = teamBattleState.rosters[losingTeam];
  if(teamBattleState.network){
    if(!reserves || !reserves.length){
      concludeTeamBattle(winningTeam);
      return;
    }
    teamBattleState.current[losingTeam] = reserves.shift() || null;
    teamBattleState.pendingTeam = null;
    teamBattleState.pendingSelection = null;
    applyTeamBattleSelections();
    startBattle();
    return;
  }
  if(!reserves || !reserves.length){
    concludeTeamBattle(winningTeam);
    return;
  }
  teamBattleState.current[losingTeam] = null;
  teamBattleState.pendingTeam = losingTeam;
  teamBattleState.pendingSelection = {team: losingTeam, index: 0};
  showShipOverlay({
    mode: 'select',
    statusMessage: `${TEAM_LABELS[losingTeam]} lost the duel. Choose the next combatant.`
  });
}

function handlePostVictory(finishingShip){
  if(teamBattleState && teamBattleState.active){
    processTeamBattleOutcome(finishingShip);
  }
}

function concludeTeamBattle(winningTeam){
  const label = TEAM_LABELS[winningTeam] || 'Fleet';
  const wasNetwork = teamBattleState && teamBattleState.network;
  clearTeamBattleProgress();
  if(wasNetwork){
    finishNetworkMatch(winningTeam);
  } else {
    showTeamVictoryDraft(winningTeam);
  }
}

function clearTeamBattleProgress(){
  if(teamBattleState) teamBattleState.active = false;
  teamBattleState = null;
}

function handleShipChoice(type){
  if(!type) return;
  const changed = !selectionA || selectionA.id !== type.id;
  if(changed && isShipOverlayVisible()) playUiNav();
  selectionA = type;
  if(!teamDraftOpen && !(teamBattleState && teamBattleState.active)){
    selectionB = pickRandomEnemy();
  }
  ensureCaptainsAssigned(true);
  updateSelectionUI();
  if(teamDraftOpen) updateFleetBuilderUI();
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
    let spriteSrc = shipType.spriteFile || `assets/ships/${shipType.id}.png`;
    if(shipType.id === 'deathousemen') spriteSrc = 'assets/ships/deathhouseman.png';
    const sprite = SHIP_SPRITES[shipType.id];
    shipImgEl.src = sprite ? sprite.src : spriteSrc;
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
  if(isLoreOpen()) return false;
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
  if(isLoreOpen()){
    if(e.key === 'Escape'){ hideLorePopover(); }
    e.preventDefault();
    return true;
  }
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
  // Removed Escape key logic
  return false;
}

function handleOverlayKeyup(e){
  if(!isShipOverlayVisible()) return false;
  if(isLoreOpen()){
    e.preventDefault();
    return true;
  }
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

function isModalUiVisible(){
  return isProfileOverlayVisible() || isMultiplayerOverlayVisible();
}

function handleModalKeydown(e){
  if(handleOverlayKeydown(e)) return true;
  if(isModalUiVisible()){
    if(e.key === 'Escape'){
      if(isProfileOverlayVisible()) hideProfileOverlay();
      else if(isMultiplayerOverlayVisible()) hideMultiplayerOverlay();
      e.preventDefault();
    }
    return true;
  }
  return false;
}

function handleModalKeyup(e){
  if(handleOverlayKeyup(e)) return true;
  if(isModalUiVisible()){
    if(e.key === 'Escape') e.preventDefault();
    return true;
  }
  return false;
}

function handleLocalInputChanged(){
  if(multiplayerMatch.active) queueCommandBroadcast();
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

function showLoreForShip(shipType){
  if(!lorePopover) return;
  const title = shipType ? `${shipType.name}${shipType.classLabel ? ' — ' + shipType.classLabel : ''}` : 'Race Lore';
  const lore = getShipLoreText(shipType);
  if(loreTitleEl) loreTitleEl.textContent = title;
  if(loreTextEl) loreTextEl.textContent = lore;
  lorePopover.classList.remove('hidden');
  lastLoreFocus = document.activeElement;
  if(loreCloseBtn) loreCloseBtn.focus();
}

function hideLorePopover(){
  if(!lorePopover || lorePopover.classList.contains('hidden')) return;
  lorePopover.classList.add('hidden');
  const target = lastLoreFocus;
  lastLoreFocus = null;
  if(target && typeof target.focus === 'function') target.focus();
  else if(isShipOverlayVisible()) focusSelectedShipCard();
}

function isLoreOpen(){
  return lorePopover && !lorePopover.classList.contains('hidden');
}

function showShipOverlay(options={}){
  running = false;
  stopBattleMusic();
  resetVictoryState();
  hideLorePopover();
  const nextMode = options.mode || 'draft';
  overlayMode = nextMode;
  teamDraftOpen = nextMode === 'draft';
  if(shipOverlay){
    shipOverlay.classList.remove('hidden');
    updateOverlaySelection();
    updateFleetBuilderUI(options.statusMessage);
  }
  drawPaused();
}

function hideShipOverlay(){
  hideLorePopover();
  if(shipOverlay) shipOverlay.classList.add('hidden');
  teamDraftOpen = false;
  overlayMode = 'draft';
}

let profileOverlayResume = null;
let multiplayerOverlayResume = null;

function focusElementLater(el){
  if(!el) return;
  requestAnimationFrame(()=>{
    try{
      el.focus();
    }catch(err){}
  });
}

function isProfileOverlayVisible(){
  return profileOverlay && !profileOverlay.classList.contains('hidden');
}

function showProfileOverlay(options={}){
  if(!profileOverlay) return;
  const {fromMenu=false, resume=null, focusField=true} = options;
  if(fromMenu) hideMainMenu({preserveDocked:true});
  profileOverlayResume = typeof resume === 'function'
    ? resume
    : (fromMenu ? ()=> showMainMenu({playSound:false}) : null);
  profileOverlay.classList.remove('hidden');
  profileOverlay.setAttribute('aria-hidden','false');
  if(focusField && profileUsernameInput){
    focusElementLater(profileUsernameInput);
  }
}

function hideProfileOverlay(options={}){
  if(!profileOverlay || profileOverlay.classList.contains('hidden')) return;
  profileOverlay.classList.add('hidden');
  profileOverlay.setAttribute('aria-hidden','true');
  const resume = profileOverlayResume;
  profileOverlayResume = null;
  if(options.resume !== false && typeof resume === 'function'){
    resume();
  }
}

function isMultiplayerOverlayVisible(){
  return lobbyOverlay && !lobbyOverlay.classList.contains('hidden');
}

function showMultiplayerOverlay(options={}){
  if(!lobbyOverlay) return;
  const {fromMenu=false, resume=null, playSound=false, focusField=true} = options;
  if(playSound) playUiClick();
  if(fromMenu) hideMainMenu({preserveDocked:true});
  multiplayerOverlayResume = typeof resume === 'function'
    ? resume
    : (fromMenu ? ()=> showMainMenu({playSound:false}) : null);
  lobbyOverlay.classList.remove('hidden');
  lobbyOverlay.setAttribute('aria-hidden','false');
  if(focusField && lobbyNameInput){
    focusElementLater(lobbyNameInput);
  }
  bootstrapMultiplayer();
  loadLobbyList();
}

function hideMultiplayerOverlay(options={}){
  if(!lobbyOverlay || lobbyOverlay.classList.contains('hidden')) return;
  lobbyOverlay.classList.add('hidden');
  lobbyOverlay.setAttribute('aria-hidden','true');
  const resume = multiplayerOverlayResume;
  multiplayerOverlayResume = null;
  if(options.resume !== false && typeof resume === 'function'){
    resume();
  }
}

function setStoredSessionToken(token){
  multiplayerState.token = token || null;
  if(typeof localStorage !== 'undefined'){
    if(token) localStorage.setItem(SESSION_TOKEN_KEY, token);
    else localStorage.removeItem(SESSION_TOKEN_KEY);
  }
  ensureLobbySocket();
}

function setMultiplayerUser(user, token){
  multiplayerState.user = user || null;
  if(token) setStoredSessionToken(token);
  if(!user && token == null) setStoredSessionToken(null);
  if(!user){
    multiplayerState.activeLobby = null;
    multiplayerState.lobbyState = null;
    resetMultiplayerMatch();
  }
  updateProfileUi();
  updateLobbyHeader();
}

function resetMultiplayerMatch(statusMessage){
  if(multiplayerMatch.commandFrame != null){
    cancelFrame(multiplayerMatch.commandFrame);
    multiplayerMatch.commandFrame = null;
  }
  multiplayerMatch.active = false;
  multiplayerMatch.lobbyId = null;
  multiplayerMatch.role = null;
  multiplayerMatch.seed = null;
  multiplayerMatch.remoteUserId = null;
  multiplayerMatch.lastSentState = null;
  multiplayerMatch.commandSeq = 0;
  applyRemoteInputState(EMPTY_INPUT_STATE);
  if(teamBattleState && teamBattleState.network){
    clearTeamBattleProgress();
    running = false;
    drawPaused();
  }
  if(statusMessage && roomStatusEl){
    roomStatusEl.textContent = statusMessage;
  }
  updateReadyButton();
  updateLobbyHeader();
}

function applyRemoteInputState(state){
  const target = multiplayerMatch.remoteInputs;
  INPUT_KEYS.forEach(key=>{
    target[key] = !!(state && state[key]);
  });
}

function snapshotInputState(source){
  return createInputState(source || EMPTY_INPUT_STATE);
}

function inputsEqual(a, b){
  if(a === b) return true;
  if(!a || !b) return false;
  return INPUT_KEYS.every(key=> !!a[key] === !!b[key]);
}

function queueCommandBroadcast(){
  if(!multiplayerMatch.active || !multiplayerMatch.lobbyId) return;
  if(multiplayerMatch.commandFrame != null) return;
  multiplayerMatch.commandFrame = scheduleFrame(()=>{
    multiplayerMatch.commandFrame = null;
    flushCommandState();
  });
}

function flushCommandState(force=false){
  if(!multiplayerMatch.active || !multiplayerMatch.lobbyId) return;
  const snapshot = snapshotInputState(keys);
  if(!force && inputsEqual(snapshot, multiplayerMatch.lastSentState)) return;
  multiplayerMatch.lastSentState = snapshot;
  sendSocketMessage('match:command', {
    lobbyId: multiplayerMatch.lobbyId,
    state: snapshot,
    seq: ++multiplayerMatch.commandSeq
  });
}

function handleRemoteCommand(payload){
  if(!multiplayerMatch.active) return;
  if(payload && payload.userId && multiplayerState.user && payload.userId === multiplayerState.user.id) return;
  if(multiplayerMatch.remoteUserId && payload && payload.userId && payload.userId !== multiplayerMatch.remoteUserId) return;
  applyRemoteInputState((payload && payload.state) || EMPTY_INPUT_STATE);
}

function handleMatchStart(payload){
  if(!multiplayerState.activeLobby) return;
  if(payload && payload.lobbyId && multiplayerState.activeLobby.id !== payload.lobbyId) return;
  const role = getUserLobbyRole();
  if(!role) return;
  const fleets = payload && payload.fleets ? payload.fleets : {};
  const myFleet = Array.isArray(fleets[role]) ? fleets[role].filter(Boolean).slice(0, MAX_TEAM_SIZE) : [];
  const opponentRole = role === 'host' ? 'guest' : 'host';
  const enemyFleet = Array.isArray(fleets[opponentRole]) ? fleets[opponentRole].filter(Boolean).slice(0, MAX_TEAM_SIZE) : [];
  if(!myFleet.length || !enemyFleet.length){
    if(roomStatusEl) roomStatusEl.textContent = 'Status: Match aborted (missing fleets)';
    return;
  }
  const opponentRecord = multiplayerState.activeLobby
    ? (opponentRole === 'host' ? multiplayerState.activeLobby.host : multiplayerState.activeLobby.guest)
    : null;
  multiplayerMatch.active = true;
  multiplayerMatch.lobbyId = payload.lobbyId;
  multiplayerMatch.role = role;
  multiplayerMatch.seed = payload.seed || Date.now();
  multiplayerMatch.remoteUserId = (payload && payload.opponentId) || (opponentRecord ? opponentRecord.id : null);
  multiplayerMatch.lastSentState = null;
  multiplayerMatch.commandSeq = 0;
  applyRemoteInputState(EMPTY_INPUT_STATE);
  if(roomStatusEl) roomStatusEl.textContent = 'Status: Match in progress';
  startNetworkFleetBattle(myFleet, enemyFleet);
  flushCommandState(true);
  updateReadyButton();
  updateLobbyHeader();
  showLobbyRoomView();
  updateRoomUi();
}

function startNetworkFleetBattle(myFleet, enemyFleet){
  if(!myFleet.length || !enemyFleet.length) return;
  clearTeamBattleProgress();
  const nextA = myFleet[0];
  const nextB = enemyFleet[0];
  teamBattleState = {
    active: true,
    network: true,
    rosters: {
      A: myFleet.slice(1),
      B: enemyFleet.slice(1)
    },
    current: { A: nextA || null, B: nextB || null },
    pendingTeam: null,
    pendingSelection: null
  };
  teamDraftOpen = false;
  applyTeamBattleSelections();
  hideShipOverlay();
  hideMainMenu();
  startBattle();
}

function finishNetworkMatch(winningTeam){
  const youWon = winningTeam === 'A';
  if(roomStatusEl){
    roomStatusEl.textContent = youWon ? 'Status: Victory achieved' : 'Status: Defeat – recenter fleet';
  }
  resetMultiplayerMatch();
  loadLobbyList();
}

function setProfileError(message){
  if(profileErrorEl) profileErrorEl.textContent = message || '';
}

function updateProfileUi(statusOverride){
  if(!profileStatusBanner) return;
  if(statusOverride){
    profileStatusBanner.textContent = statusOverride;
    return;
  }
  if(multiplayerState.user){
    profileStatusBanner.textContent = `Signed in as ${multiplayerState.user.username}`;
  } else {
    profileStatusBanner.textContent = 'Not signed in';
  }
  if(profileLogoutBtn) profileLogoutBtn.disabled = !multiplayerState.user;
}

function updateLobbyHeader(){
  if(lobbyUserLabel){
    lobbyUserLabel.textContent = multiplayerState.user
      ? `Signed in as ${multiplayerState.user.username}`
      : 'Not signed in';
  }
  const needsAuth = !multiplayerState.user;
  const role = getUserLobbyRole();
  const inLobby = !!multiplayerState.activeLobby;
  const matchActive = multiplayerMatch.active;
  if(lobbyCreateBtn) lobbyCreateBtn.disabled = needsAuth || matchActive;
  if(lobbyRefreshBtn) lobbyRefreshBtn.disabled = false;
  if(lobbyReadyBtn) lobbyReadyBtn.disabled = needsAuth || !role || matchActive;
  if(lobbyLeaveBtn) lobbyLeaveBtn.disabled = !inLobby;
  if(syncFleetBtn) syncFleetBtn.disabled = needsAuth || !inLobby || matchActive;
  if(chatInputEl) chatInputEl.disabled = needsAuth || !inLobby;
}

function requireAuthPrompt(){
  if(multiplayerState.user) return true;
  showProfileOverlay({ focusField: true });
  setProfileError('Sign in to access multiplayer');
  return false;
}

function apiHeaders(hasBody){
  const headers = {};
  if(hasBody) headers['Content-Type'] = 'application/json';
  return headers;
}

async function apiFetch(path, options={}){
  const url = `${API_ROOT}${path}`;
  const hasBody = options.body && typeof options.body !== 'string';
  const config = Object.assign({
    method: 'GET',
    credentials: 'include',
    headers: apiHeaders(hasBody)
  }, options || {});
  if(hasBody) config.body = JSON.stringify(options.body);
  const response = await fetch(url, config);
  let data = null;
  try{
    data = await response.json();
  }catch(err){
    data = null;
  }
  if(!response.ok){
    const error = new Error(data && data.error ? data.error : 'API_ERROR');
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

function mapAuthError(error){
  if(!error) return 'Unable to authenticate';
  if(error.payload && error.payload.error === 'USERNAME_TAKEN') return 'Callsign already claimed';
  if(error.payload && error.payload.error === 'INVALID_CREDENTIALS') return 'Invalid credentials';
  if(error.payload && error.payload.error === 'USERNAME_LENGTH') return 'Username must be 3-24 chars';
  if(error.payload && error.payload.error === 'USERNAME_AND_PASSWORD_REQUIRED') return 'Enter username and password';
  return 'Authentication failed';
}

async function handleProfileAuth(action){
  if(!profileUsernameInput || !profilePasswordInput) return;
  const username = profileUsernameInput.value.trim();
  const password = profilePasswordInput.value;
  if(!username || !password){
    setProfileError('Enter username and password');
    return;
  }
  try{
    setProfileError('');
    updateProfileUi(`${action === 'signup' ? 'Creating' : 'Authorizing'} commander...`);
    const result = await apiFetch(`/${action}`, { method: 'POST', body: { username, password } });
    setMultiplayerUser(result.user, result.token);
    updateProfileUi();
    setProfileError('');
    if(isProfileOverlayVisible()) hideProfileOverlay();
    ensureLobbySocket();
    loadLobbyList();
  }catch(err){
    updateProfileUi();
    setProfileError(mapAuthError(err));
  }
}

async function handleProfileLogout(){
  if(!multiplayerState.user) return;
  try{
    await apiFetch('/logout', { method: 'POST' });
  }catch(err){}
  setMultiplayerUser(null, null);
  setProfileError('');
  updateProfileUi('Signed out');
  setTimeout(()=> updateProfileUi(), 1200);
}

async function fetchCurrentProfile(){
  try{
    const data = await apiFetch('/me');
    if(data && data.user) setMultiplayerUser(data.user);
  }catch(err){
    setMultiplayerUser(null, null);
  }
}

function bootstrapMultiplayer(){
  if(multiplayerState.bootstrapStarted) return;
  multiplayerState.bootstrapStarted = true;
  updateProfileUi();
  updateLobbyHeader();
  buildFleetForm();
  fetchCurrentProfile().finally(()=>{
    ensureLobbySocket();
    loadLobbyList();
  });
}

function getPreferredFleetRoster(){
  if(fleetRosters && Array.isArray(fleetRosters.A) && fleetRosters.A.length) return fleetRosters.A.slice(0, MAX_TEAM_SIZE);
  if(fleetRosters && Array.isArray(fleetRosters.B) && fleetRosters.B.length) return fleetRosters.B.slice(0, MAX_TEAM_SIZE);
  return [];
}

function buildFleetForm(){
  if(!fleetFormEl) return;
  if(!multiplayerState.pendingFleet.length){
    multiplayerState.pendingFleet = getPreferredFleetRoster();
  }
  fleetFormEl.innerHTML = '';
  for(let i=0;i<MAX_TEAM_SIZE;i++){
    const slot = document.createElement('label');
    slot.className = 'fleet-slot';
    const span = document.createElement('span');
    span.textContent = `Slot ${i+1}`;
    const select = document.createElement('select');
    select.dataset.index = String(i);
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Empty';
    select.appendChild(blank);
    SHIP_TYPES.forEach(type=>{
      const opt = document.createElement('option');
      opt.value = type.id;
      opt.textContent = type.name;
      select.appendChild(opt);
    });
    select.value = multiplayerState.pendingFleet[i] || '';
    select.addEventListener('change', handleFleetFormChange);
    slot.appendChild(span);
    slot.appendChild(select);
    fleetFormEl.appendChild(slot);
  }
}

function handleFleetFormChange(evt){
  const target = evt.target;
  if(!target || !target.dataset) return;
  const idx = parseInt(target.dataset.index, 10);
  if(Number.isNaN(idx)) return;
  multiplayerState.pendingFleet[idx] = target.value || '';
}

function randomizePendingFleet(){
  const selections = [];
  const pool = [...SHIP_TYPES];
  while(pool.length && selections.length < MAX_TEAM_SIZE){
    const picked = pool.splice(Math.floor(Math.random()*pool.length), 1)[0];
    selections.push(picked.id);
  }
  multiplayerState.pendingFleet = selections;
  buildFleetForm();
}

function applyFleetToServer(){
  if(!multiplayerState.activeLobby || !multiplayerState.user) return;
  const ws = multiplayerState.socket;
  if(!ws || ws.readyState !== WebSocket.OPEN) return;
  const ships = multiplayerState.pendingFleet.filter(Boolean);
  ws.send(JSON.stringify({
    type: 'lobby:setFleet',
    payload: { lobbyId: multiplayerState.activeLobby.id, ships }
  }));
}

function loadLobbyList(){
  if(multiplayerState.lobbyLoading) return;
  multiplayerState.lobbyLoading = true;
  apiFetch('/lobbies')
    .then(data=>{
      multiplayerState.lobbies = Array.isArray(data.lobbies) ? data.lobbies : [];
      updateLobbyListUi();
    })
    .catch(()=>{
      if(lobbyEmptyEl) lobbyEmptyEl.textContent = 'Unable to load lobbies';
    })
    .finally(()=>{
      multiplayerState.lobbyLoading = false;
    });
}

function updateLobbyListUi(){
  if(lobbyCountEl) lobbyCountEl.textContent = String(multiplayerState.lobbies.length);
  if(!lobbyListEl) return;
  lobbyListEl.innerHTML = '';
  if(!multiplayerState.lobbies.length){
    if(lobbyEmptyEl) lobbyEmptyEl.classList.remove('hidden');
    return;
  }
  if(lobbyEmptyEl) lobbyEmptyEl.classList.add('hidden');
  multiplayerState.lobbies.forEach(lobby=>{
    const row = document.createElement('div');
    row.className = 'lobby-card-row';
    const info = document.createElement('div');
    const hostName = lobby.host ? lobby.host.username : '—';
    const guestName = lobby.guest ? lobby.guest.username : 'Open';
    info.innerHTML = `<strong>${lobby.name || 'Lobby'}</strong><div class="meta">Host: ${hostName} · Guest: ${guestName}</div>`;
    const actionWrap = document.createElement('div');
    const joinBtn = document.createElement('button');
    const alreadyIn = multiplayerState.user && ((lobby.host && lobby.host.id === multiplayerState.user.id) || (lobby.guest && lobby.guest.id === multiplayerState.user.id));
    joinBtn.textContent = alreadyIn ? 'Rejoin' : (lobby.guest ? 'Full' : 'Join');
    joinBtn.disabled = !!lobby.guest && !alreadyIn;
    joinBtn.addEventListener('click', ()=> handleLobbyJoin(lobby.id));
    actionWrap.appendChild(joinBtn);
    row.appendChild(info);
    row.appendChild(actionWrap);
    lobbyListEl.appendChild(row);
  });
}

function handleLobbyJoin(lobbyId){
  if(!requireAuthPrompt()) return;
  apiFetch(`/lobbies/${lobbyId}/join`, { method: 'POST' })
    .then(res=>{
      if(res && res.lobby){
        enterLobby(res.lobby);
        subscribeToLobby(res.lobby.id);
        ensureLobbySocket();
        loadLobbyList();
      }
    })
    .catch(()=>{});
}

function handleLobbyCreate(){
  if(!requireAuthPrompt()) return;
  const name = lobbyNameInput ? lobbyNameInput.value.trim() : '';
  apiFetch('/lobbies', { method: 'POST', body: { name } })
    .then(res=>{
      if(res && res.lobby){
        enterLobby(res.lobby);
        subscribeToLobby(res.lobby.id);
        if(lobbyNameInput) lobbyNameInput.value = '';
        loadLobbyList();
      }
    })
    .catch(()=>{});
}

function handleLobbyLeave(){
  if(!multiplayerState.activeLobby) return;
  apiFetch(`/lobbies/${multiplayerState.activeLobby.id}/leave`, { method: 'POST' })
    .finally(()=>{
      resetMultiplayerMatch('Status: Idle');
      multiplayerState.activeLobby = null;
      multiplayerState.lobbyState = null;
      showLobbyListView();
      loadLobbyList();
    });
}

function enterLobby(lobby){
  multiplayerState.activeLobby = lobby;
  showLobbyRoomView();
  updateLobbyHeader();
  updateRoomUi();
}

function showLobbyListView(){
  if(lobbyListSection) lobbyListSection.classList.remove('hidden');
  if(lobbyRoomSection) lobbyRoomSection.classList.add('hidden');
}

function showLobbyRoomView(){
  if(lobbyListSection) lobbyListSection.classList.add('hidden');
  if(lobbyRoomSection) lobbyRoomSection.classList.remove('hidden');
}

function getUserLobbyRole(){
  if(!multiplayerState.user || !multiplayerState.activeLobby) return null;
  if(multiplayerState.activeLobby.host && multiplayerState.activeLobby.host.id === multiplayerState.user.id) return 'host';
  if(multiplayerState.activeLobby.guest && multiplayerState.activeLobby.guest.id === multiplayerState.user.id) return 'guest';
  return null;
}

function updateRoomUi(){
  const lobby = multiplayerState.activeLobby;
  if(!lobby){
    showLobbyListView();
    return;
  }
  if(roomNameEl) roomNameEl.textContent = lobby.name || 'Lobby';
  if(hostNameEl) hostNameEl.textContent = lobby.host ? lobby.host.username : 'Waiting';
  if(guestNameEl) guestNameEl.textContent = lobby.guest ? lobby.guest.username : 'Waiting';
  const state = multiplayerState.lobbyState || { ready: { host:false, guest:false }, fleets:{host:[],guest:[]}, chat:[] };
  if(hostReadyEl) hostReadyEl.textContent = state.ready.host ? 'Ready' : 'Not ready';
  if(guestReadyEl) guestReadyEl.textContent = lobby.guest ? (state.ready.guest ? 'Ready' : 'Not ready') : 'Waiting for pilot';
  renderFleetSlots(hostFleetEl, state.fleets.host || []);
  renderFleetSlots(guestFleetEl, state.fleets.guest || []);
  if(roomStatusEl){
    if(multiplayerMatch.active) roomStatusEl.textContent = 'Status: Match in progress';
    else roomStatusEl.textContent = `Status: ${lobby.status || 'waiting'}`;
  }
  if(chatLogEl) renderChatLog(state.chat || []);
  updateReadyButton();
}

function renderFleetSlots(container, ships){
  if(!container) return;
  container.innerHTML = '';
  if(!ships || !ships.length){
    const empty = document.createElement('span');
    empty.textContent = 'No fleet uploaded';
    container.appendChild(empty);
    return;
  }
  ships.forEach(id=>{
    const span = document.createElement('span');
    const ship = getShipTypeById(id);
    span.textContent = ship ? ship.name : id;
    container.appendChild(span);
  });
}

function updateReadyButton(){
  if(!lobbyReadyBtn) return;
  if(multiplayerMatch.active){
    lobbyReadyBtn.textContent = 'Match In Progress';
    lobbyReadyBtn.disabled = true;
    return;
  }
  const role = getUserLobbyRole();
  const state = multiplayerState.lobbyState || { ready: { host:false, guest:false } };
  const ready = role ? state.ready[role] : false;
  lobbyReadyBtn.textContent = ready ? 'Cancel Ready' : 'Ready Up';
  lobbyReadyBtn.disabled = !role;
}

function handleReadyToggle(){
  if(multiplayerMatch.active) return;
  if(!multiplayerState.activeLobby || !multiplayerState.socket) return;
  const role = getUserLobbyRole();
  if(!role) return;
  const state = multiplayerState.lobbyState || { ready: { host:false, guest:false } };
  const next = !state.ready[role];
  sendSocketMessage('lobby:setReady', { lobbyId: multiplayerState.activeLobby.id, ready: next });
}

function handleChatSubmit(evt){
  evt.preventDefault();
  const message = chatInputEl ? chatInputEl.value.trim() : '';
  if(!message) return;
  sendSocketMessage('chat:message', { lobbyId: multiplayerState.activeLobby && multiplayerState.activeLobby.id, message });
  if(chatInputEl) chatInputEl.value = '';
}

function renderChatLog(entries){
  if(!chatLogEl) return;
  chatLogEl.innerHTML = '';
  entries.forEach(entry=> appendChatEntry(entry));
}

function appendChatEntry(entry){
  if(!chatLogEl || !entry) return;
  const line = document.createElement('div');
  line.className = 'chat-entry';
  const user = document.createElement('strong');
  user.textContent = entry.user || 'Pilot';
  const text = document.createElement('span');
  text.textContent = entry.message;
  line.appendChild(user);
  line.appendChild(text);
  chatLogEl.appendChild(line);
  chatLogEl.scrollTop = chatLogEl.scrollHeight;
  if(multiplayerState.lobbyState){
    const chat = multiplayerState.lobbyState.chat || [];
    chat.push(entry);
    multiplayerState.lobbyState.chat = chat.slice(-50);
  }
}

function sendSocketMessage(type, payload){
  const ws = multiplayerState.socket;
  if(!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type, payload }));
}

function subscribeToLobby(lobbyId){
  sendSocketMessage('lobby:subscribe', { lobbyId });
}

function teardownLobbySocket(){
  if(multiplayerState.socket){
    try{ multiplayerState.socket.close(); }catch(err){}
    multiplayerState.socket = null;
  }
}

function scheduleSocketReconnect(){
  if(multiplayerState.socketTimer) return;
  multiplayerState.socketTimer = setTimeout(()=>{
    multiplayerState.socketTimer = null;
    ensureLobbySocket();
  }, 2000);
}

function ensureLobbySocket(){
  if(!multiplayerState.token || !multiplayerState.user){
    teardownLobbySocket();
    return;
  }
  if(multiplayerState.socket && (multiplayerState.socket.readyState === WebSocket.OPEN || multiplayerState.socket.readyState === WebSocket.CONNECTING)){
    return;
  }
  teardownLobbySocket();
  try{
    const ws = new WebSocket(`${WS_ENDPOINT}?token=${encodeURIComponent(multiplayerState.token)}`);
    multiplayerState.socket = ws;
    ws.addEventListener('open', ()=>{
      if(multiplayerState.activeLobby){
        subscribeToLobby(multiplayerState.activeLobby.id);
      }
    });
    ws.addEventListener('message', handleLobbySocketMessage);
    ws.addEventListener('close', scheduleSocketReconnect);
    ws.addEventListener('error', ()=> ws.close());
  }catch(err){
    scheduleSocketReconnect();
  }
}

function handleLobbySocketMessage(evt){
  let data;
  try{
    data = JSON.parse(evt.data);
  }catch(err){
    return;
  }
  const { type, payload } = data || {};
  switch(type){
    case 'hello':
      return;
    case 'lobby:update':
      if(payload && payload.lobby){
        if(multiplayerState.activeLobby && payload.lobby.id === multiplayerState.activeLobby.id){
          multiplayerState.activeLobby = payload.lobby;
          multiplayerState.lobbyState = payload.state || multiplayerState.lobbyState;
          updateRoomUi();
        }
        multiplayerState.lobbies = multiplayerState.lobbies.map(l=> l.id === payload.lobby.id ? payload.lobby : l);
        updateLobbyListUi();
      }
      return;
    case 'chat:message':
      appendChatEntry(payload);
      return;
    case 'lobby:closed':
      if(multiplayerState.activeLobby && payload && payload.lobbyId === multiplayerState.activeLobby.id){
        multiplayerState.activeLobby = null;
        multiplayerState.lobbyState = null;
        resetMultiplayerMatch('Status: Lobby closed');
        showLobbyListView();
        loadLobbyList();
      }
      return;
    case 'match:start':
      handleMatchStart(payload || {});
      return;
    case 'match:command':
      handleRemoteCommand(payload || {});
      return;
    default:
      return;
  }
}

function ensureUiClickSound(){
  if(uiClickAudio) return uiClickAudio;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = UI_CLICK_SOUND;
  uiClickAudio = audio;
  return audio;
}

const BORING_CHARGE_SOUND = '../mixkit-sci-fi-warp-slide-3113.wav';
let boringChargeAudio = null;
function ensureBoringChargeSound(){
  if(boringChargeAudio) return boringChargeAudio;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = BORING_CHARGE_SOUND;
  boringChargeAudio = audio;
  return audio;
}

function playBoringChargeSound(){
  const audio = ensureBoringChargeSound();
  if(!audio) return;
  safePlayAudio(audio, 'boring_charge');
}

function safePlayAudio(template, label){
  if(!template) return;
  try{
    const src = template.currentSrc || template.src;
    if(!src) return;
    const clip = new Audio(src);
    clip.preload = 'auto';
    if(Number.isFinite(template.volume)) clip.volume = template.volume;
    if(activeSecretEvent && activeSecretEvent.type === 'horror'){
      const wobble = 0.72 + Math.random() * 0.42;
      try{ clip.playbackRate = wobble; }catch(err){}
      try{ clip.volume = Math.max(0, Math.min(1, clip.volume * 0.85)); }catch(err){}
      // Best-effort: allow pitch to shift with playbackRate.
      try{ clip.preservesPitch = false; }catch(err){}
      try{ clip.mozPreservesPitch = false; }catch(err){}
      try{ clip.webkitPreservesPitch = false; }catch(err){}
    }
    clip.currentTime = 0;
    const playPromise = clip.play();
    if(playPromise && playPromise.catch){
      playPromise.catch(err=>{
        if(!safePlayAudio._warned){
          safePlayAudio._warned = true;
          console.warn('[AUDIO] Playback blocked/failed', label || '', err);
          console.warn('[AUDIO] If you are using the VS Code Simple Browser, audio may be disabled. Try opening the game URL in an external browser (Edge/Chrome).');
        }
      });
    }
    return clip;
  }catch(err){
    if(!safePlayAudio._warned){
      safePlayAudio._warned = true;
      console.warn('[AUDIO] Playback error', label || '', err);
    }
  }
  return null;
}

const TAFTIAN_MINE_SFX_FIRST = '../deploy-canono-dnd.mp3';
const TAFTIAN_MINE_SFX_SECOND = '../deploy-canon-2-dnd.mp3';
function playTaftianMineDeploySequence(onFirstEnded){
  try{
    const gain = 2.6;
    playLoudAudioSrc(TAFTIAN_MINE_SFX_FIRST, 'taftian_mine_1', gain);

    // Sprite should swap 1s after the first sound starts playing.
    setTimeout(()=>{
      try{ if(typeof onFirstEnded === 'function') onFirstEnded(); }catch(err){}
      // Play the second sound at the exact moment the deployed sprite appears.
      try{ playLoudAudioSrc(TAFTIAN_MINE_SFX_SECOND, 'taftian_mine_2', gain); }catch(err){}
    }, 1000);
  }catch(err){}
}

// Best-effort audio unlock for autoplay-restricted environments.
let audioUnlocked = false;
function unlockAudioOnce(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  safePlayAudio(ensureUiClickSound(), 'unlock');
  // Preload/decode gapless loop assets early to avoid first-use delay.
  try{ primeChmmrLoopAudio(); }catch(err){}
  try{ const a = ensureBlackgridTargetingAmbience(); if(a && a.load) a.load(); }catch(err){}
}
document.addEventListener('pointerdown', unlockAudioOnce, {once:true});
document.addEventListener('keydown', unlockAudioOnce, {once:true});

function playUiClick(){
  const audio = ensureUiClickSound();
  if(!audio) return;
  safePlayAudio(audio, 'ui_click');
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
  safePlayAudio(audio, 'ui_nav');
}

function setMainMenuBodyState(active){
  const body = document.body;
  if(!body) return;
  const isActive = !!active;
  body.classList.toggle('menu-active', isActive);
  body.classList.toggle('menu-docked', isActive && menuDocked);
}

function isMainMenuVisible(){
  return mainMenu && !mainMenu.classList.contains('hidden');
}

function resetInputState(){
  if(!keys) return;
  Object.keys(keys).forEach(code=> keys[code]=false);
}

function showMainMenu(options={}){
  if(typeof options.docked === 'boolean'){
    menuDocked = options.docked;
  }
  setMainMenuBodyState(true);
  if(!mainMenu) return;
  const wasHidden = mainMenu.classList.contains('hidden');
  if(wasHidden && options.playSound) playUiClick();
  mainMenu.classList.remove('hidden');
  resetInputState();
  running = false;
  stopBattleMusic();
  hideLorePopover();
  hideShipOverlay();
  drawPaused();
}

function hideMainMenu(options={}){
  if(!options.preserveDocked) menuDocked = false;
  setMainMenuBodyState(false);
  if(!mainMenu) return;
  if(!mainMenu.classList.contains('hidden')){
    if(options.playSound) playUiClick();
    mainMenu.classList.add('hidden');
  }
}

function toggleMainMenu(){
  if(isMainMenuVisible()) hideMainMenu({playSound:true});
  else showMainMenu({playSound:true});
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
let plasmaClouds = [];
let outposts = [];
const sectorFartClouds = Object.create(null);

// Practice mode: when fighting the Test Dummy, skip victory and respawn ships.
let practiceDummyBattleActive = false;
const PRACTICE_RESPAWN_SECONDS = 1.0;

function isDummyPracticeBattle(){
  return !!practiceDummyBattleActive;
}

function schedulePracticeRespawn(ship){
  if(!ship || ship.hp > 0) return;
  if(ship._practiceRespawn) return;

  const spawnX = (ship.team === 'A') ? 180 : (canvas.width - 180);
  const spawnY = canvas.height/2;
  const fromX = (ship.team === 'A') ? (-ship.size*10) : (canvas.width + ship.size*10);
  const fromY = spawnY + (Math.random()*60 - 30);

  ship._practiceRespawn = {
    timer: PRACTICE_RESPAWN_SECONDS,
    toX: spawnX,
    toY: spawnY
  };

  // Keep the match "alive" (prevents victory checks) while the ship blinks out.
  ship.hp = 1;
  ship.energy = ship.maxEnergy;
  ship.vx = 0;
  ship.vy = 0;
  ship.cool = 0;
  ship.lastShotAt = 0;

  // Clear volatile combat state.
  ship.damageOverTime = [];
  ship.boardingIntruders = [];
  ship.parasites = [];
  ship.ultimatum = null;
  ship.confused = null;
  ship.crewLossIndicator = null;
  ship.lastDamagedBy = null;
  ship.lastDamagedAt = 0;

  // Cancel specials/locks.
  if(ship.activeSpecial && ship.activeSpecial.type === 'lunarCloak'){
    try{ ship.endCloak(); }catch(e){}
  }
  ship.activeSpecial = null;
  ship.specialLatch = false;
  ship.fireLatch = false;

  // Blink warp: fully invisible during respawn.
  ship.invulnerable = true;
  ship.warp = {
    from:{x:fromX,y:fromY},
    to:{x:spawnX,y:spawnY},
    age:0,
    duration: PRACTICE_RESPAWN_SECONDS,
    angle: 0,
    mode: 'blink',
    switchAt: null,
    arrivalSpawned: false
  };
}

function updatePracticeRespawns(dt){
  if(!isDummyPracticeBattle()) return;
  if(!Array.isArray(ships) || !ships.length) return;
  ships.forEach(s=>{
    if(!s || !s._practiceRespawn) return;
    s._practiceRespawn.timer -= dt;
    if(s._practiceRespawn.timer > 0) return;
    // Once the blink warp is done, restore full hull and re-arm.
    if(s.isWarping && s.isWarping()) return;
    s.hp = (s.type && typeof s.type.hp === 'number') ? s.type.hp : Math.max(1, s.hp || 1);
    s.energy = s.maxEnergy;
    s._playedDeath = false;
    s.invulnerable = false;
    s._practiceRespawn = null;
  });
}

// Outpost sprites
const OUTPOST_SPRITES = {};
const KHANITE_OUTPOST_SPRITE_SRC = '../image - 2026-01-06T022504.361.png';
function ensureOutpostSpriteLoaded(key, src){
  if(!key || !src) return null;
  const existing = OUTPOST_SPRITES[key];
  if(existing) return existing;
  const img = new Image();
  img.onload = ()=>{ OUTPOST_SPRITES[key] = img; };
  img.onerror = ()=>{ OUTPOST_SPRITES[key] = null; };
  img.src = src;
  // Store immediately to avoid recreating every frame; will be replaced by onload.
  OUTPOST_SPRITES[key] = img;
  return img;
}

// Mine sprites
const MINE_SPRITES = {};
const TAFTIAN_MINE_ARMING_SPRITE_KEY = 'taftian_mine_arming';
const TAFTIAN_MINE_DEPLOYED_SPRITE_KEY = 'taftian_mine_deployed';
const TAFTIAN_MINE_ARMING_SPRITE_SRC = '../taftian%20mine.png';
const TAFTIAN_MINE_DEPLOYED_SPRITE_SRC = '../taftian%20mine%20deployed.png';
function ensureMineSpriteLoaded(key, src){
  if(!key || !src) return null;
  const existing = MINE_SPRITES[key];
  if(existing) return existing;
  const img = new Image();
  img.onload = ()=>{ MINE_SPRITES[key] = img; };
  img.onerror = ()=>{ MINE_SPRITES[key] = null; };
  img.src = src;
  MINE_SPRITES[key] = img;
  return img;
}

// Daemon orb sprite
const DAEMON_SPRITES = {};
const DAEMON_ORB_SPRITE_KEY = 'daemon_orb';
const DAEMON_ORB_SPRITE_SRC = '../Daemon.png';
function ensureDaemonSpriteLoaded(key, src){
  if(!key || !src) return null;
  const existing = DAEMON_SPRITES[key];
  if(existing) return existing;
  const img = new Image();
  img.onload = ()=>{ DAEMON_SPRITES[key] = img; };
  img.onerror = ()=>{ DAEMON_SPRITES[key] = null; };
  img.src = src;
  DAEMON_SPRITES[key] = img;
  return img;
}

// Secret event system (1-100 roll per battle)
let secretEventRoll = null;
let activeSecretEvent = null;
const HORROR_EVENT_ROLL_TARGET = 1; // 1% chance
const HORROR_TEAM_ALLY = 'A';
const HORROR_TEAM_BOSS = 'Z';
const HORROR_LOOP_SRC = '../mixkit-terror-transition-2484.wav';
const horrorFx = {
  noiseCanvas: null,
  noiseCtx: null,
  noiseSize: 160,
  noiseTimer: 0,
  loopClip: null,
  prevBgmVolume: null,
  bgmWobble: 0,
  stutterTimer: 0,
  holdCanvas: null,
  holdCtx: null,
  holdUntil: 0,
  frameCanvas: null,
  frameCtx: null,
  overlayToggle: false
};

function updateSecretEventPanel(){
  if(secretRollValueEl){
    secretRollValueEl.textContent = secretEventRoll ? String(secretEventRoll) : '—';
  }
}

function rollSecretEvent(){
  secretEventRoll = 1 + Math.floor(Math.random() * 100);
  updateSecretEventPanel();
  return secretEventRoll;
}

function initializeSecretEventsForBattle(){
  endActiveSecretEvent({silent:true});
  if(!isEasterEggEnabled('events')){
    secretEventRoll = null;
    updateSecretEventPanel();
    return;
  }
  rollSecretEvent();
  // Auto-trigger rare events based on the hidden roll.
  if(secretEventRoll === HORROR_EVENT_ROLL_TARGET){
    setTimeout(()=>{
      if(!running) return;
      if(activeSecretEvent) return;
      if(victoryState.active || pendingVictory.active) return;
      startHorrorEvent({auto:true});
    }, 1200);
  }
}

function ensureHorrorNoise(){
  if(horrorFx.noiseCanvas && horrorFx.noiseCtx) return;
  const c = document.createElement('canvas');
  c.width = horrorFx.noiseSize;
  c.height = horrorFx.noiseSize;
  const nctx = c.getContext('2d');
  horrorFx.noiseCanvas = c;
  horrorFx.noiseCtx = nctx;
}

function ensureHorrorLoopTemplate(){
  if(horrorFx._loopTemplate) return horrorFx._loopTemplate;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = HORROR_LOOP_SRC;
  horrorFx._loopTemplate = audio;
  return audio;
}

function startHorrorAudio(){
  const bgm = ensureBattleMusic();
  if(bgm && horrorFx.prevBgmVolume == null){
    horrorFx.prevBgmVolume = bgm.volume;
  }
  if(bgm){
    try{
      // No extra loop layer — just make the soundtrack feel alien.
      bgm.volume = 0.28;
      bgm.playbackRate = 0.125;
      if(typeof bgm.preservesPitch !== 'undefined') bgm.preservesPitch = false;
      if(typeof bgm.mozPreservesPitch !== 'undefined') bgm.mozPreservesPitch = false;
      if(typeof bgm.webkitPreservesPitch !== 'undefined') bgm.webkitPreservesPitch = false;
    }catch(err){}
  }
  // (Intentionally no looping horror bed; it was too distracting.)
}

function stopHorrorAudio(){
  if(horrorFx.loopClip){
    try{ horrorFx.loopClip.pause(); }catch(err){}
    try{ horrorFx.loopClip.currentTime = 0; }catch(err){}
    horrorFx.loopClip = null;
  }
  const bgm = BGM && BGM.track;
  if(bgm){
    try{
      if(horrorFx.prevBgmVolume != null) bgm.volume = horrorFx.prevBgmVolume;
      bgm.playbackRate = 1;
    }catch(err){}
  }
  horrorFx.prevBgmVolume = null;
  horrorFx.bgmWobble = 0;
  horrorFx.stutterTimer = 0;
}

function endActiveSecretEvent(options={}){
  if(!activeSecretEvent) return;
  const ev = activeSecretEvent;
  // Restore team alignment.
  if(ev && ev.originalEnemyShip){
    try{ ev.originalEnemyShip.team = ev.originalEnemyTeam || 'B'; }catch(err){}
  }
  // Remove boss if present.
  ships = ships.filter(s=> !(s && s.type && s.type.id === 'horror_boss'));
  stopHorrorAudio();
  activeSecretEvent = null;
  if(!options.silent){
    updateSecretEventPanel();
  }
}

function startHorrorEvent(options={}){
  if(!isEasterEggEnabled('events')) return false;
  if(activeSecretEvent) return false;
  if(!ships || ships.length < 2) return false;
  const player = ships.find(s=> s && s.control);
  const enemy = ships.find(s=> s && !s.control);
  if(!player || !enemy) return false;

  ensureHorrorNoise();
  ensureTypeSpritesLoaded(HORROR_BOSS_TYPE);
  startHorrorAudio();

  // Turn the duel into co-op vs boss.
  const originalEnemyTeam = enemy.team;
  enemy.team = HORROR_TEAM_ALLY;
  player.team = HORROR_TEAM_ALLY;

  // Warp the boss in from a random, far-off direction so you don't know where it comes from.
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  const entryAngle = Math.random() * Math.PI*2;
  const farDist = Math.max(canvas.width, canvas.height) * 1.35 + SECTOR_PADDING * 1.2;
  const bossX = centerX + Math.cos(entryAngle) * farDist;
  const bossY = centerY + Math.sin(entryAngle) * farDist;
  const boss = new Ship(HORROR_BOSS_TYPE, bossX, bossY, HORROR_TEAM_BOSS);
  boss.angle = 0;
  const warpFromX = centerX + Math.cos(entryAngle) * (farDist + boss.size*10);
  const warpFromY = centerY + Math.sin(entryAngle) * (farDist + boss.size*10);
  boss.beginWarpFrom(warpFromX, warpFromY, 1.35);
  ships.push(boss);

  // Scatter unsettling "faces" around the sector.
  const faceCount = 12;
  const faces = [];
  for(let i=0;i<faceCount;i++){
    faces.push({
      x: (Math.random() * (canvas.width + SECTOR_PADDING*1.6)) - SECTOR_PADDING*0.8,
      y: (Math.random() * (canvas.height + SECTOR_PADDING*1.6)) - SECTOR_PADDING*0.8,
      r: 28 + Math.random()*46,
      seed: Math.random()*Math.PI*2
    });
  }

  activeSecretEvent = {
    type: 'horror',
    startedAt: performance.now ? performance.now() : Date.now(),
    faces,
    boss,
    originalEnemyShip: enemy,
    originalEnemyTeam,
    staticBurstUntil: (performance.now ? performance.now() : Date.now()) + 900,
    bossRevealed: false,
    proximity: null,
    intensity: 0,
    visitedSectors: new Set([`${currentSector && currentSector.sx || 0},${currentSector && currentSector.sy || 0}`]),
    bossSectorKey: `${currentSector && currentSector.sx || 0},${currentSector && currentSector.sy || 0}`,
    stashedBoss: null,
    bossCatchUpAt: 0,
    lastSectorChangeAt: 0
  };
  return true;
}

function updateActiveSecretEvent(dt){
  if(!activeSecretEvent) return;
  if(activeSecretEvent.type === 'horror'){
    updateHorrorEvent(dt);
  }
}

function updateHorrorNoise(){
  ensureHorrorNoise();
  const nctx = horrorFx.noiseCtx;
  if(!nctx) return;
  const w = horrorFx.noiseCanvas.width;
  const h = horrorFx.noiseCanvas.height;
  const img = nctx.getImageData(0, 0, w, h);
  const data = img.data;
  for(let i=0;i<data.length;i+=4){
    const v = (Math.random() * 255) | 0;
    data[i] = v;
    data[i+1] = v;
    data[i+2] = v;
    data[i+3] = 255;
  }
  nctx.putImageData(img, 0, 0);
}

function updateHorrorEvent(dt){
  const nowMs = (performance.now ? performance.now() : Date.now());
  const bgm = BGM && BGM.track;
  if(bgm){
    horrorFx.bgmWobble += dt;
    const base = 0.125;
    const wob = Math.sin(horrorFx.bgmWobble * 1.2) * 0.006 + (Math.random()-0.5) * 0.002;
    try{ bgm.playbackRate = base + wob; }catch(err){}
  }

  // Keep stutter minimal; the "alien slow" vibe reads better.
  horrorFx.stutterTimer -= dt;
  if(horrorFx.stutterTimer <= 0){
    horrorFx.stutterTimer = 1.3 + Math.random() * 1.4;
    if(bgm && Math.random() < 0.05){
      try{
        bgm.currentTime = Math.max(0, bgm.currentTime - (0.04 + Math.random()*0.06));
      }catch(err){}
    }
  }

  horrorFx.noiseTimer -= dt;
  if(horrorFx.noiseTimer <= 0){
    // Updating noise too frequently can cause jank on some machines.
    horrorFx.noiseTimer = 0.11;
    updateHorrorNoise();
  }

  // Sector chase: if you fled, the boss catches up later.
  if(activeSecretEvent && activeSecretEvent.type === 'horror'){
    const bossPresent = ships.some(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
    const playerSectorKey = `${currentSector && currentSector.sx || 0},${currentSector && currentSector.sy || 0}`;
    const bossSectorKey = activeSecretEvent.bossSectorKey || playerSectorKey;
    const needsCatchUp = bossSectorKey !== playerSectorKey;
    if(needsCatchUp && !bossPresent && activeSecretEvent.stashedBoss && nowMs >= (activeSecretEvent.bossCatchUpAt || 0)){
      const boss = activeSecretEvent.stashedBoss;
      activeSecretEvent.stashedBoss = null;

      // Warp in from a random far-off direction (unknown approach).
      const centerX = canvas.width/2;
      const centerY = canvas.height/2;
      const entryAngle = Math.random() * Math.PI*2;
      // Catch-up should feel immediate: spawn closer than the initial event entry.
      const farDist = Math.max(canvas.width, canvas.height) * 0.95 + SECTOR_PADDING * 0.45;
      const bossX = centerX + Math.cos(entryAngle) * farDist;
      const bossY = centerY + Math.sin(entryAngle) * farDist;
      boss.x = bossX;
      boss.y = bossY;
      boss.vx = 0;
      boss.vy = 0;
      boss.angle = 0;
      boss.team = HORROR_TEAM_BOSS;
      boss.cool = 0;
      boss.energy = boss.maxEnergy;
      const warpFromX = centerX + Math.cos(entryAngle) * (farDist + boss.size*10);
      const warpFromY = centerY + Math.sin(entryAngle) * (farDist + boss.size*10);
      try{ boss.beginWarpFrom(warpFromX, warpFromY, 0.95); }catch(err){}
      ships.push(boss);

      // Boss has arrived in the player's current sector.
      activeSecretEvent.bossSectorKey = playerSectorKey;

      activeSecretEvent.bossRevealed = false;
      activeSecretEvent.proximity = null;
      activeSecretEvent.intensity = 0;
      activeSecretEvent.staticBurstUntil = nowMs + 900;
      activeSecretEvent.bossCatchUpAt = 0;
    }
  }

  // Proximity-based intensity: the closer the boss gets, the worse the map looks.
  if(activeSecretEvent && activeSecretEvent.type === 'horror'){
    const bossRef = ships.find(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
    if(bossRef){
      const allies = ships.filter(s=> s && s.hp>0 && s.team === HORROR_TEAM_ALLY);
      let minDist = Infinity;
      allies.forEach(a=>{
        const d = Math.hypot((a.x - bossRef.x), (a.y - bossRef.y));
        if(d < minDist) minDist = d;
      });
      if(!Number.isFinite(minDist)) minDist = Math.hypot((canvas.width/2 - bossRef.x), (canvas.height/2 - bossRef.y));
      activeSecretEvent.proximity = minDist;
      const far = Math.max(canvas.width, canvas.height) * 1.35;
      const near = 240;
      const t = 1 - ((minDist - near) / Math.max(1, (far - near)));
      activeSecretEvent.intensity = Math.max(0, Math.min(1, t));

      const revealDist = 760;
      if(!activeSecretEvent.bossRevealed && minDist <= revealDist){
        activeSecretEvent.bossRevealed = true;
        activeSecretEvent.staticBurstUntil = nowMs + 1100;
      }
    } else {
      activeSecretEvent.proximity = null;
      activeSecretEvent.intensity = 0;
    }
  }

  // Boss deletes planets it moves through.
  const boss = ships.find(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
  if(boss && planets && planets.length){
    for(let i=planets.length-1; i>=0; i--){
      const p = planets[i];
      if(!p) continue;
      const dx = p.x - boss.x;
      const dy = p.y - boss.y;
      const rr = (p.r || 0) + boss.size * 0.85;
      if((dx*dx + dy*dy) <= (rr*rr)){
        // Remove the planet.
        planets.splice(i, 1);
        // Quick red flash puff.
        for(let k=0;k<16;k++){
          const a = Math.random()*Math.PI*2;
          const r = (p.r || 24) * (0.2 + Math.random()*0.95);
          particles.push({
            x: p.x + Math.cos(a)*r,
            y: p.y + Math.sin(a)*r,
            vx: (Math.random()-0.5)*120,
            vy: (Math.random()-0.5)*120,
            life: 0.22 + Math.random()*0.22,
            size: 1.4 + Math.random()*2.2,
            core: [255, 90, 90],
            mid: [90, 10, 10]
          });
        }
      }
    }
  }

  // If the boss is gone (killed via debug), end event effects.
  // Note: during sector travel the boss may be stashed temporarily; don't treat that as death.
  const bossAlive = ships.some(s=> s && s.type && s.type.id === 'horror_boss' && s.hp > 0)
    || !!(activeSecretEvent && activeSecretEvent.type === 'horror' && activeSecretEvent.stashedBoss && activeSecretEvent.stashedBoss.hp > 0);
  if(!bossAlive && nowMs > activeSecretEvent.startedAt + 400){
    stopHorrorAudio();
  }
}

function drawHorrorFaces(ctx){
  if(!activeSecretEvent || activeSecretEvent.type !== 'horror') return;
  const faces = activeSecretEvent.faces || [];
  if(!faces.length) return;
  const t = (performance.now ? performance.now() : Date.now()) * 0.001;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  faces.forEach(face=>{
    const jitterX = Math.sin(t * 1.8 + face.seed) * 1.6;
    const jitterY = Math.cos(t * 1.6 + face.seed * 1.4) * 1.6;
    const x = face.x + jitterX;
    const y = face.y + jitterY;
    const r = face.r;
    const base = 0.1 + 0.08 * (0.5 + 0.5 * Math.sin(t * 2.4 + face.seed));
    const blink = (Math.sin(t * 7.5 + face.seed * 1.7) > 0.94) ? 0.22 : 0;
    const alpha = Math.min(0.32, base + blink);

    // Head glow.
    const head = ctx.createRadialGradient(x, y, r*0.15, x, y, r*1.4);
    head.addColorStop(0, `rgba(255,80,80,${alpha})`);
    head.addColorStop(0.45, `rgba(120,10,10,${alpha*0.85})`);
    head.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.arc(x, y, r*1.2, 0, Math.PI*2);
    ctx.fill();

    // Eyes.
    ctx.fillStyle = `rgba(255,245,245,${Math.min(1, alpha*2.8)})`;
    ctx.beginPath();
    ctx.ellipse(x - r*0.28, y - r*0.12, r*0.12, r*0.18, 0, 0, Math.PI*2);
    ctx.ellipse(x + r*0.28, y - r*0.12, r*0.12, r*0.18, 0, 0, Math.PI*2);
    ctx.fill();

    // Mouth slash.
    ctx.strokeStyle = `rgba(255,50,50,${Math.min(1, alpha*2.2)})`;
    ctx.lineWidth = Math.max(1, r*0.06);
    ctx.beginPath();
    ctx.arc(x, y + r*0.22, r*0.32, 0.08*Math.PI, 0.92*Math.PI);
    ctx.stroke();

    // Subtle "teeth" ticks.
    if(alpha > 0.18){
      ctx.strokeStyle = `rgba(255,220,220,${Math.min(0.9, alpha*1.4)})`;
      ctx.lineWidth = Math.max(1, r*0.03);
      for(let i=0;i<4;i++){
        const tx = x - r*0.18 + i*(r*0.12);
        const ty = y + r*0.26;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty + r*0.09);
        ctx.stroke();
      }
    }
  });
  ctx.restore();
}

function drawDevistanRgbOverlay(ctx){
  try{
    if(!ctx || !canvas || !ships) return;
    // Check for any active devistanField special and capture a representative config.
    let active = false; let sampleConf = null;
    for(let i=0;i<ships.length;i++){
      const s = ships[i];
      if(!s || !s.activeSpecial) continue;
      if(s.activeSpecial.type === 'devistanField') { active = true; sampleConf = s.activeSpecial.config || {}; break; }
    }
    if(!active) return;

    const w = canvas.width, h = canvas.height;
    // Prepare persistent offscreen canvases for channel tinting.
    if(!window.devistanFx) window.devistanFx = {};
    const fx = window.devistanFx;
    if(!fx.off) fx.off = document.createElement('canvas');
    if(!fx.r) fx.r = document.createElement('canvas');
    if(!fx.g) fx.g = document.createElement('canvas');
    if(!fx.b) fx.b = document.createElement('canvas');
    [fx.off, fx.r, fx.g, fx.b].forEach(c=>{
      if(c.width !== w || c.height !== h){ c.width = w; c.height = h; }
    });
    const offCtx = fx.off.getContext('2d');
    const rCtx = fx.r.getContext('2d');
    const gCtx = fx.g.getContext('2d');
    const bCtx = fx.b.getContext('2d');

    // Copy current canvas into offscreen.
    try{ offCtx.clearRect(0,0,w,h); offCtx.drawImage(canvas, 0, 0); }catch(e){/*drawImage may fail if canvas is cross-origin*/}

    // Determine intensity from config and current timescale.
    const rgbIntensity = Math.max(0, Math.min(1, (typeof sampleConf.rgbIntensity === 'number' ? sampleConf.rgbIntensity : 0.85)));
    const slowFactor = Math.max(0.01, 1 - (typeof targetTimeScale === 'number' ? (1 - targetTimeScale) : 0));
    const baseAlpha = Math.max(0.02, Math.min(0.9, 0.06 + (1 - targetTimeScale) * 0.6));

    // Helper: tint an offscreen with a color using source-in
    const tint = (srcCtx, dstCtx, color)=>{
      dstCtx.clearRect(0,0,w,h);
      dstCtx.drawImage(srcCtx.canvas, 0, 0);
      dstCtx.globalCompositeOperation = 'source-in';
      dstCtx.fillStyle = color;
      dstCtx.fillRect(0,0,w,h);
      dstCtx.globalCompositeOperation = 'source-over';
    };

    tint(offCtx, rCtx, 'rgba(255,40,60,1)');
    tint(offCtx, gCtx, 'rgba(40,255,140,1)');
    tint(offCtx, bCtx, 'rgba(60,100,255,1)');

    // Draw tinted channels with small offsets to create chromatic separation.
    ctx.save();
    // Use a subtler composite and lower alpha to match the "channels" look
    ctx.globalCompositeOperation = 'screen';
    // offset magnitude scales with intensity and slowFactor
    const t = (performance.now ? performance.now() : Date.now()) * 0.001;
    const jitter = Math.sin(t * 6.0) * 0.5 + Math.sin(t * 11.0) * 0.35;
    // smaller offsets produce the RGB ghosting without blowing out brightness
    const maxOffset = Math.max(1, 4 * rgbIntensity * (1 - targetTimeScale) * slowFactor);
    const ro = ((-1.3 + jitter*0.45) * maxOffset) | 0;
    const go = ((0.8 + Math.cos(t*5.3)*0.32) * maxOffset) | 0;
    const bo = ((1.0 + Math.sin(t*4.1)*0.4) * maxOffset) | 0;

    // Subtle per-channel alpha — keep overall effect dimmer like the attachment.
    ctx.globalAlpha = Math.min(0.35, baseAlpha * 0.32 * rgbIntensity);
    ctx.drawImage(fx.r, -ro, 0);
    ctx.globalAlpha = Math.min(0.35, baseAlpha * 0.28 * rgbIntensity);
    ctx.drawImage(fx.g, go, 0);
    ctx.globalAlpha = Math.min(0.35, baseAlpha * 0.30 * rgbIntensity);
    ctx.drawImage(fx.b, bo, 0);

    // Add subtle scanlines / chroma noise
    // low-contrast scanlines for texture
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = Math.min(0.18, (1 - targetTimeScale) * 0.22 * rgbIntensity);
    for(let i=0;i<6;i++){
      const y = Math.floor((Math.random() * h));
      ctx.fillStyle = (i % 2 === 0) ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
      ctx.fillRect(0, y, w, 1 + Math.floor(Math.random()*2));
    }

    ctx.restore();
  }catch(e){}
}

function drawHorrorStaticOverlay(ctx){
  if(!activeSecretEvent || activeSecretEvent.type !== 'horror') return;
  // Static should only be present when the boss is actually in this sector.
  // (When you flee sectors, the boss is stashed and should not keep corrupting the screen.)
  const bossPresent = ships && ships.some(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
  if(!bossPresent) return;
  ensureHorrorNoise();
  if(!horrorFx.noiseCanvas) return;
  const nowMs = (performance.now ? performance.now() : Date.now());
  const burst = nowMs < (activeSecretEvent.staticBurstUntil || 0);
  const intensity = Math.max(0, Math.min(1, activeSecretEvent.intensity || 0));
  const baseAlpha = (burst ? 0.40 : 0.12) + intensity * 0.16;

  // Expensive glitch passes run less frequently to reduce jank.
  horrorFx.overlayFrame = (horrorFx.overlayFrame || 0) + 1;
  const doHeavyGlitch = burst || (intensity > 0.18 && (horrorFx.overlayFrame % 3 === 0));

  // Copy the already-rendered frame into an offscreen buffer once.
  // This avoids expensive "canvas drawing itself" readbacks.
  if(!horrorFx.frameCanvas){
    horrorFx.frameCanvas = document.createElement('canvas');
    horrorFx.frameCanvas.width = canvas.width;
    horrorFx.frameCanvas.height = canvas.height;
    horrorFx.frameCtx = horrorFx.frameCanvas.getContext('2d');
  }
  if(horrorFx.frameCanvas && (horrorFx.frameCanvas.width !== canvas.width || horrorFx.frameCanvas.height !== canvas.height)){
    horrorFx.frameCanvas.width = canvas.width;
    horrorFx.frameCanvas.height = canvas.height;
  }
  if(horrorFx.frameCtx){
    try{ horrorFx.frameCtx.drawImage(canvas, 0, 0); }catch(err){}
  }

  // Occasionally hold/freeze a frame for a choppy "buffer glitch" look.
  if(!horrorFx.holdCanvas){
    horrorFx.holdCanvas = document.createElement('canvas');
    horrorFx.holdCanvas.width = canvas.width;
    horrorFx.holdCanvas.height = canvas.height;
    horrorFx.holdCtx = horrorFx.holdCanvas.getContext('2d');
  }
  if(horrorFx.holdCanvas && (horrorFx.holdCanvas.width !== canvas.width || horrorFx.holdCanvas.height !== canvas.height)){
    horrorFx.holdCanvas.width = canvas.width;
    horrorFx.holdCanvas.height = canvas.height;
  }
  const holdChance = (burst ? 0.05 : 0.012) + intensity * 0.030;
  if(nowMs > horrorFx.holdUntil && Math.random() < holdChance && horrorFx.holdCtx && horrorFx.frameCanvas){
    try{ horrorFx.holdCtx.drawImage(horrorFx.frameCanvas, 0, 0); }catch(err){}
    horrorFx.holdUntil = nowMs + (burst ? (90 + Math.random()*110) : (60 + Math.random()*90));
  }
  const srcFrame = (nowMs < horrorFx.holdUntil && horrorFx.holdCanvas) ? horrorFx.holdCanvas : (horrorFx.frameCanvas || canvas);

  if(doHeavyGlitch){
    // Tile-chop displacement (the "screen chopped into chunks" look).
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = (burst ? 0.26 : 0.12) + intensity * 0.16;
    const tileSize = burst ? 76 : 110;
    const maxShift = burst ? 18 : 12;
    for(let ty=0; ty<canvas.height; ty+=tileSize){
      for(let tx=0; tx<canvas.width; tx+=tileSize){
        if(Math.random() > (burst ? 0.14 : 0.06)) continue;
        const w = Math.min(tileSize, canvas.width - tx);
        const h = Math.min(tileSize, canvas.height - ty);
        const dx = tx + (Math.random()-0.5) * maxShift;
        const dy = ty + (Math.random()-0.5) * (maxShift * 0.55);
        ctx.drawImage(srcFrame, tx, ty, w, h, dx, dy, w, h);
      }
    }
    ctx.restore();
  }

  if(doHeavyGlitch){
    // Glitch-tear the existing frame with horizontal slices.
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = (burst ? 0.30 : 0.14) + intensity * 0.14;
    const bandCount = burst ? 4 : (intensity > 0.45 ? 2 : 1);
    for(let i=0;i<bandCount;i++){
      const bandH = 8 + Math.random()*44;
      const y = Math.random() * (canvas.height - bandH);
      const shift = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random()*46);
      ctx.drawImage(srcFrame, 0, y, canvas.width, bandH, shift, y + (Math.random()-0.5)*6, canvas.width, bandH);
    }
    // Occasional "white-out" difference flash.
    if(Math.random() < (burst ? 0.10 : 0.03)){
      ctx.globalCompositeOperation = 'difference';
      ctx.globalAlpha = burst ? 0.14 : 0.08;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = baseAlpha;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(horrorFx.noiseCanvas, 0, 0, canvas.width, canvas.height);
  // A second noise layer at a different scale for heavier grain.
  ctx.globalAlpha = baseAlpha * 0.55;
  ctx.drawImage(horrorFx.noiseCanvas, -30, 12, canvas.width + 60, canvas.height + 24);
  ctx.imageSmoothingEnabled = true;

  // Red tint layer (subtle, but constant).
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = (burst ? 0.12 : 0.06) + intensity * 0.12;
  ctx.fillStyle = 'rgba(190,0,0,1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  // Occasional tearing bands.
  if(Math.random() < (burst ? 0.70 : 0.18)){
    ctx.globalAlpha = baseAlpha * 0.8;
    ctx.fillStyle = (Math.random() < 0.35) ? 'rgba(255,40,40,0.14)' : 'rgba(255,255,255,0.10)';
    const bandH = 8 + Math.random()*34;
    const y = Math.random() * (canvas.height - bandH);
    ctx.fillRect(0, y, canvas.width, bandH);
  }
  ctx.restore();
}

function drawBlackgridMatrixEdgeOverlay(ctx){
  try{
    if(!ctx || !canvas || !ships || !ships.length) return;
    let intensity = 0;
    let bestSpec = null;
    let bestConf = null;
    let bestPriority = -1;
    let bestA = 0;
    for(let i=0;i<ships.length;i++){
      const s = ships[i];
      if(!s || !s.activeSpecial) continue;
      const spec = s.activeSpecial;
      if(!spec || spec.type !== 'blackgridHack') continue;
      const conf = spec.config || {};
      let a = 0.35;
      if(!spec.fired) a = 0.95;
      else if(spec.fireFlashRemaining && spec.fireFlashRemaining > 0) a = 1.0;
      else if(spec.postFireSlowRemaining && spec.postFireSlowRemaining > 0) a = 0.85;
      else a = 0.55;
      if(spec.fired && Number.isFinite(spec.duration) && Number.isFinite(spec.age)){
        const t = Math.max(0, Math.min(1, spec.age / Math.max(0.001, spec.duration)));
        a *= (1 - 0.35 * t);
      }
      // allow per-ship tuning if ever desired
      if(conf.matrixEdgeAlpha != null) a *= Math.max(0, Math.min(1, conf.matrixEdgeAlpha));
      intensity = Math.max(intensity, a);

       const priority = (s && s.control) ? 2 : 1;
       if(priority > bestPriority || (priority === bestPriority && a > bestA)){
         bestPriority = priority;
         bestA = a;
         bestSpec = spec;
         bestConf = conf;
       }
    }
    if(intensity <= 0.01) return;

    const w = canvas.width;
    const h = canvas.height;
    const border = Math.max(28, Math.min(76, Math.floor(Math.min(w, h) * 0.085)));
    const now = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) * 0.001;
    const scroll = (now * 44) % 14;

    const hash01 = (x, y, t)=>{
      const n = (x * 127.1 + y * 311.7 + t * 17.13);
      const s = Math.sin(n) * 43758.5453123;
      return s - Math.floor(s);
    };

    ctx.save();
    // subtle cyan tint over the whole screen (Blackwall vibe)
    ctx.globalCompositeOperation = 'source-over';
    const cyanPulse = 0.65 + 0.35 * Math.sin(now * 2.2 + 1.1);
    ctx.globalAlpha = (0.03 + 0.03 * cyanPulse) * intensity;
    ctx.fillStyle = 'rgba(40,220,255,1)';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 1;
    // Draw the matrix overlay in normal blending so it stays red,
    // even though the underlying scene is cyan-tinted.
    ctx.globalCompositeOperation = 'source-over';

    // soft red-black gradients on edges
    let g = ctx.createLinearGradient(0, 0, 0, border);
    g.addColorStop(0, `rgba(120,0,0,${0.55*intensity})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, border);

    g = ctx.createLinearGradient(0, h, 0, h - border);
    g.addColorStop(0, `rgba(120,0,0,${0.55*intensity})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, h - border, w, border);

    g = ctx.createLinearGradient(0, 0, border, 0);
    g.addColorStop(0, `rgba(120,0,0,${0.55*intensity})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, border, h);

    g = ctx.createLinearGradient(w, 0, w - border, 0);
    g.addColorStop(0, `rgba(120,0,0,${0.55*intensity})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(w - border, 0, border, h);

    // matrix "glyph" cells
    const step = 14;
    const drawGlyph = (x, y, seed)=>{
      const r0 = hash01(x, y, seed);
      if(r0 > (0.18 * intensity + 0.02)) return;
      const r1 = hash01(x + 11, y - 7, seed);
      const r2 = hash01(x - 3, y + 19, seed);
      const alpha = (0.18 + 0.72 * r1) * intensity;
      const hgt = 5 + Math.floor(r2 * 11);
      const wdt = 1 + Math.floor(hash01(x + 5, y + 5, seed) * 2);
      ctx.fillStyle = `rgba(255,${40 + Math.floor(40*r1)},${40 + Math.floor(40*r1)},${alpha})`;
      ctx.fillRect(x + (r2 * 4), y + (r1 * 3), wdt, hgt);
      if(r1 < 0.25){
        ctx.fillStyle = `rgba(255,220,200,${alpha*0.65})`;
        ctx.fillRect(x + 6, y + 2, 1, 1);
      }
    };

    // top & bottom bands
    for(let y=0; y<border; y+=step){
      const yy = y + (scroll % step);
      for(let x=0; x<w; x+=step){
        drawGlyph(x + 2, yy + 2, now);
        drawGlyph(x + 2, (h - border) + y + 2, now + 3.1);
      }
    }
    // left & right bands
    for(let x=0; x<border; x+=step){
      const xx = x + (scroll % step);
      for(let y=0; y<h; y+=step){
        drawGlyph(xx + 2, y + 2, now + 1.7);
        drawGlyph((w - border) + x + 2, y + 2, now + 4.9);
      }
    }

    // subtle scanline shimmer on edges
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.08 * intensity;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    for(let y=0; y<h; y+=3){
      ctx.fillRect(0, y, border, 1);
      ctx.fillRect(w - border, y, border, 1);
    }
    for(let x=0; x<w; x+=3){
      ctx.fillRect(x, 0, 1, border);
      ctx.fillRect(x, h - border, 1, border);
    }

    // "TARGET LOCKED." message
    try{
      if(bestSpec){
        const conf = bestConf || {};
        const text = 'TARGET LOCKED.';
        const lockDenom = Math.max(0.001, (conf.lockOnSeconds != null) ? conf.lockOnSeconds : 1.0);
        let msg = '';
        let msgAlpha = 0;

        if(!bestSpec.fired){
          const remain = Math.max(0, bestSpec.lockRemaining || 0);
          const p = Math.max(0, Math.min(1, 1 - (remain / lockDenom)));
          const count = Math.max(0, Math.min(text.length, Math.floor(p * (text.length + 1))));
          msg = text.slice(0, count);
          msgAlpha = (0.25 + 0.75 * p) * intensity;
        } else if(bestSpec.lockMessageHoldRemaining && bestSpec.lockMessageHoldRemaining > 0){
          const holdDur = Math.max(0.05, conf.lockMessageHoldSeconds || 0.65);
          const fade = Math.max(0, Math.min(1, bestSpec.lockMessageHoldRemaining / holdDur));
          msg = text;
          msgAlpha = 0.9 * fade * intensity;
        }

        if(msg && msgAlpha > 0.01){
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = Math.max(0, Math.min(1, msgAlpha));
          ctx.font = '900 18px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          const jx = (Math.random()-0.5) * (2.0 * intensity);
          const jy = (Math.random()-0.5) * (1.2 * intensity);
          const y = Math.max(18, Math.floor(border * 0.35));
          ctx.lineWidth = 6;
          ctx.strokeStyle = `rgba(0,0,0,0.7)`;
          ctx.fillStyle = `rgba(255,60,60,0.95)`;
          ctx.strokeText(msg, w/2 + jx, y + jy);
          ctx.fillText(msg, w/2 + jx, y + jy);
          ctx.restore();
        }
      }
    }catch(e){}

    ctx.restore();
  }catch(e){}
}

function drawHorrorRunText(ctx){
  if(!activeSecretEvent || activeSecretEvent.type !== 'horror') return;
  const bossPresent = ships && ships.some(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
  if(!bossPresent) return;
  const intensity = Math.max(0, Math.min(1, activeSecretEvent.intensity || 0));
  const alpha = 0.35 + intensity * 0.55;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = alpha;
  ctx.font = '900 34px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const jx = (Math.random()-0.5) * (2 + intensity * 6);
  const jy = (Math.random()-0.5) * (1 + intensity * 4);
  ctx.strokeStyle = `rgba(0,0,0,${0.75*alpha})`;
  ctx.lineWidth = 6;
  ctx.strokeText('RUN', canvas.width/2 + jx, 14 + jy);
  ctx.fillStyle = `rgba(255,40,40,${alpha})`;
  ctx.fillText('RUN', canvas.width/2 + jx, 14 + jy);
  ctx.restore();
}

function drawHorrorShipHighlights(ctx){
  if(!activeSecretEvent || activeSecretEvent.type !== 'horror') return;
  if(!ships || !ships.length) return;
  const t = (performance.now ? performance.now() : Date.now()) * 0.001;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ships.forEach(s=>{
    if(!s || s.hp <= 0 || (s.isWarping && s.isWarping())) return;
    const isBoss = s.type && s.type.id === 'horror_boss';
    if(isBoss && activeSecretEvent && !activeSecretEvent.bossRevealed) return;
    const ring = (s.size || 20) * (isBoss ? 1.25 : 0.95);
    const pulse = 0.9 + 0.18 * Math.sin(t * (isBoss ? 3.2 : 6.2) + (s.team==='A' ? 0.6 : 1.4));
    const alpha = isBoss ? 0.42 : 0.55;
    const col = isBoss ? [255, 90, 90] : (s.team === HORROR_TEAM_ALLY ? [140, 240, 255] : [255, 210, 170]);

    const g = ctx.createRadialGradient(s.x, s.y, ring*0.2, s.x, s.y, ring*2.0);
    g.addColorStop(0, rgba([255,255,255], alpha * 0.35));
    g.addColorStop(0.25, rgba(col, alpha * 0.55));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, ring * 1.9 * pulse, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = rgba(col, alpha * 0.75);
    ctx.lineWidth = Math.max(2, ring * 0.12);
    ctx.beginPath();
    ctx.arc(s.x, s.y, ring * 0.95 * pulse, 0, Math.PI*2);
    ctx.stroke();
  });
  ctx.restore();
}

if(triggerHorrorEventBtn){
  triggerHorrorEventBtn.addEventListener('click', ()=>{
    playUiClick();
    startHorrorEvent({manual:true});
  });
}
if(endHorrorEventBtn){
  endHorrorEventBtn.addEventListener('click', ()=>{
    playUiClick();
    endActiveSecretEvent({manual:true});
  });
}

function setEventTestPanelCollapsed(collapsed){
  if(!eventTestPanel) return;
  eventTestPanel.classList.toggle('is-collapsed', !!collapsed);
  if(eventTestToggleBtn){
    eventTestToggleBtn.textContent = collapsed ? 'Show' : 'Hide';
    eventTestToggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
}

if(eventTestToggleBtn && eventTestPanel){
  eventTestToggleBtn.addEventListener('click', ()=>{
    playUiClick();
    const collapsed = eventTestPanel.classList.contains('is-collapsed');
    setEventTestPanelCollapsed(!collapsed);
  });
}
// avatar assets and audio cues
const AVATAR_STATES = ['idle','thrust','left','right','fire','special','victory'];
const AVATAR_IMAGE_EXTENSIONS = ['png','webp','jpg','jpeg','gif'];
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
// Enemy avatar override for Cabal Blackgrid (src path + expiry timestamp)
let enemyAvatarOverrideSrc = null;
let enemyAvatarOverrideUntil = 0;
// Player avatar override (src path + expiry timestamp)
let playerAvatarOverrideSrc = null;
let playerAvatarOverrideUntil = 0;
const SFX_CUES = ['thrust','fire','hit','special','fly','board','board_in','board_zap','board_die','split5','split10'];
const SFX_EXCLUSIVE = {
  // No exclusives for 'fire' so Obsidian Circuit can use its own sfx
};
const UI_CLICK_SOUND = 'assets/sfx/ui_select.wav';
const UI_NAV_SOUND = 'assets/sfx/ui_nav.mp3';
let uiClickAudio = null;
let uiNavAudio = null;
let menuDocked = false;
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
  boring_man: 'assets/music/victory/boring_man.mp3',
  bad_ghost: 'assets/music/victory/bad_ghost.mp3',
  breachborn: '../event_screams-sfx_archeology_event_screams_02.wav',
  criminal: '../sound-effect-gta-5-mission-complete.mp3',
  deathousemen: '../psychofinal.mp3',
  fattian: '../obituary.mp3',
  obsidian_circuit: '../mixkit-terror-transition-2484.wav',
  phantom: '../victory-impostor.mp3',
  barack: 'assets/sfx/barack/victory.wav',
  obama: '../hub-intro-sound.mp3',
  pestilence: '../event_screams-sfx_archeology_event_screams_02.wav',
  victory_crew: '../victory-crew.mp3',
  obamination: 'C:/Users/Connor/Downloads/The Barack Masters/prowler-sound-effect_6bXErot.mp3',
  pickle: '../creepy-weird-pad-246597.mp3',
  taftian: 'assets/music/victory/taftian.mp3'
};
const victoryAudioCache = {};
let activeVictoryClip = null;
let activeVictoryRace = null;
const victoryState = {active:false, ship:null, start:0, duration:2800};
const VICTORY_AFTERGLOW = 2400; // extra hold so the scene can fade out
const pendingVictory = {active:false, winner:null, start:0};
const VICTORY_DELAY_MS = 2200;
const BGM = { src: 'assets/music/battle.mp3', track: null };

// Cabal Blackgrid cinematic audio layer.
// - Starts immediately when Shift activates the special.
// - Loops during slow-motion (including the ease-back to full speed).
// - Mutes battle music during the slow-motion window.
const BLACKGRID_TARGETING_AMBIENCE_SRC = '../targeting%20ambience.mp3';
const blackgridCinematicAudio = {
  template: null,
  loopClip: null,
  prevBgmVolume: null,
  active: false,
  volume: 0.95
};

function ensureBlackgridTargetingAmbience(){
  if(blackgridCinematicAudio.template) return blackgridCinematicAudio.template;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = BLACKGRID_TARGETING_AMBIENCE_SRC;
  blackgridCinematicAudio.template = audio;
  return audio;
}

function startBlackgridCinematicAudio(){
  blackgridCinematicAudio.active = true;

  // Start/maintain the looping ambience.
  if(!blackgridCinematicAudio.loopClip){
    try{
      const template = ensureBlackgridTargetingAmbience();
      const src = template && (template.currentSrc || template.src);
      if(src){
        const clip = new Audio(src);
        clip.preload = 'auto';
        clip.loop = true;
        clip.volume = Math.max(0, Math.min(1, blackgridCinematicAudio.volume || 0.95));
        clip._stopped = false;
        blackgridCinematicAudio.loopClip = clip;
        const p = clip.play();
        if(p && p.catch) p.catch(()=>{});
      }
    }catch(err){}
  }

  // Mute battle music while slow-motion is active.
  const bgm = ensureBattleMusic();
  if(bgm){
    try{
      if(blackgridCinematicAudio.prevBgmVolume == null) blackgridCinematicAudio.prevBgmVolume = bgm.volume;
      bgm.volume = 0;
    }catch(err){}
  }
}

function stopBlackgridCinematicAudio(){
  // Stop ambience loop.
  if(blackgridCinematicAudio.loopClip){
    try{ blackgridCinematicAudio.loopClip._stopped = true; }catch(err){}
    try{ blackgridCinematicAudio.loopClip.pause(); }catch(err){}
    try{ blackgridCinematicAudio.loopClip.currentTime = 0; }catch(err){}
  }
  blackgridCinematicAudio.loopClip = null;

  // Restore battle music volume.
  const bgm = BGM && BGM.track;
  if(bgm){
    try{
      if(blackgridCinematicAudio.prevBgmVolume != null) bgm.volume = blackgridCinematicAudio.prevBgmVolume;
    }catch(err){}
  }
  blackgridCinematicAudio.prevBgmVolume = null;
  blackgridCinematicAudio.active = false;
}

function updateBlackgridCinematicAudio(){
  if(!blackgridCinematicAudio.active) return;
  const targetSlow = (typeof targetTimeScale === 'number' && targetTimeScale < 0.999);
  const actualSlow = (typeof timeScale === 'number' && timeScale < 0.995);
  if(targetSlow || actualSlow){
    startBlackgridCinematicAudio();
  } else {
    stopBlackgridCinematicAudio();
  }
}
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
let lastLoreFocus = null;

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

function triggerEnemyAvatarStatic(src, seconds){
  try{
    enemyAvatarOverrideSrc = src || null;
    const now = (performance && performance.now) ? performance.now() : Date.now();
    enemyAvatarOverrideUntil = (seconds && seconds > 0) ? (now + seconds * 1000) : 0;
    const wrap = document.getElementById('enemy-avatar-wrap');
    if(wrap){ wrap.classList.remove('signal-lost'); wrap.classList.add('hacked'); }
  }catch(e){}
}

function resetEnemyAvatarFeed(){
  try{
    enemyAvatarOverrideSrc = null;
    enemyAvatarOverrideUntil = 0;
    const wrap = document.getElementById('enemy-avatar-wrap');
    if(wrap){ wrap.classList.remove('signal-lost'); wrap.classList.remove('hacked'); }
    updateEnemyAvatarImg();
  }catch(e){}
}

function triggerPlayerAvatarStatic(src, seconds){
  try{
    playerAvatarOverrideSrc = src || null;
    const now = (performance && performance.now) ? performance.now() : Date.now();
    playerAvatarOverrideUntil = (seconds && seconds > 0) ? (now + seconds * 1000) : 0;
    const wrap = document.getElementById('avatar-wrap');
    if(wrap){ wrap.classList.remove('signal-lost'); wrap.classList.add('hacked'); }
  }catch(e){}
}

function resetPlayerAvatarFeed(){
  try{
    playerAvatarOverrideSrc = null;
    playerAvatarOverrideUntil = 0;
    const wrap = document.getElementById('avatar-wrap');
    if(wrap){ wrap.classList.remove('signal-lost'); wrap.classList.remove('hacked'); }
    updateAvatarImg();
  }catch(e){}
}
function ensureSfxForRace(raceId){
  if(!raceId) return null;
  const store = SFX_CACHE[raceId] || (SFX_CACHE[raceId] = {});
  SFX_CUES.forEach(cue=>{
    // If a prior load attempt exhausted all sources, allow retry.
    const existing = store[cue];
    if(existing && !existing._sfxExhausted) return;

    // Khanite Manifold Missile: random-per-play variants.
    // Store arrays of Audio templates and let playSfx pick one each time.
    if(raceId === 'khanite' && cue === 'fire'){
      const variants = [
        'assets/sfx/khanite/Weap_fire_gmissile_02.ogg',
        'assets/sfx/khanite/Weap_fire_gmissile_03.ogg'
      ].map(src=>{
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        try{ a.load(); }catch(err){}
        return a;
      });
      store[cue] = variants;
      return;
    }

    // Deathousemen: random-per-shot firing variants.
    if(raceId === 'deathousemen' && cue === 'fire'){
      const variants = [
        '../Weap_fire_vsec_projectile_l1_01.ogg',
        '../Weap_fire_vsec_projectile_l1_02.ogg',
        '../Weap_fire_vsec_projectile_l1_03.ogg'
      ].map(src=>{
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        try{ a.load(); }catch(err){}
        return a;
      });
      store[cue] = variants;
      return;
    }

    // Lifehousemen: custom firing sound from workspace root.
    if(raceId === 'lifehousemen' && cue === 'fire'){
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = '../Weap_fire_vsec_energy_l1_03.ogg';
      try{ audio.load(); }catch(err){}
      store[cue] = audio;
      return;
    }

    // Breachborn: random-per-shot plasma charger variants.
    if(raceId === 'breachborn' && cue === 'fire'){
      const variants = [
        '../Weap_fire_plasma_charger_l1_02.ogg',
        '../Weap_fire_plasma_charger_l1_03.ogg'
      ].map(src=>{
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        try{ a.load(); }catch(err){}
        return a;
      });
      store[cue] = variants;
      return;
    }
    // Taftian: use provided big-spaceship missile sample for firing.
    if(raceId === 'taftian' && cue === 'fire'){
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = 'assets/sfx/taftian/fire.mp3';
      try{ audio.load(); }catch(err){}
      store[cue] = audio;
      return;
    }
    if(raceId === 'khanite' && (cue === 'split5' || cue === 'split10')){
      const variants = [
        'assets/sfx/khanite/Weap_fire_hydra_l1_01.ogg',
        'assets/sfx/khanite/Weap_fire_hydra_l1_02.ogg',
        'assets/sfx/khanite/Weap_fire_hydra_l1_03.ogg'
      ].map(src=>{
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        try{ a.load(); }catch(err){}
        return a;
      });
      store[cue] = variants;
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    // Register immediately so playSfx can use it on first attempt.
    // The src will be resolved by the tryNext() loop below.
    store[cue] = audio;
    let sources = [
      `assets/sfx/${raceId}/${cue}.ogg`,
      `assets/sfx/${raceId}/${cue}.mp3`,
      `assets/sfx/${raceId}/${cue}.wav`,
      `assets/sfx/${cue}.ogg`,
      `assets/sfx/${cue}.mp3`,
      `assets/sfx/${cue}.wav`
    ];
    // Special case: obsidian_circuit SFX files primarily exist as ogg,
    // but keep mp3/wav fallbacks in case the server setup blocks .ogg
    if(raceId === 'obsidian_circuit') {
      if (cue === 'fire' || cue === 'fly') {
        sources = [
          `assets/sfx/obsidian_circuit/${cue}.ogg`,
          `assets/sfx/obsidian_circuit/${cue}.mp3`,
          `assets/sfx/obsidian_circuit/${cue}.wav`,
          `assets/sfx/${cue}.ogg`,
          `assets/sfx/${cue}.mp3`,
          `assets/sfx/${cue}.wav`
        ];
      }
    }

    // Special case: Obsidian Circuit scarlet pulse sound from workspace root.
    if(raceId === 'obsidian_circuit' && cue === 'special'){
      sources.unshift('../kohr-ah-fried.wav');
    }

    // Special case: Breachborn burner sound from workspace root.
    if(raceId === 'breachborn' && cue === 'special'){
      sources.unshift('../thraddash-burner.wav');
    }

    // Special case: Khanite combat outpost deploy sound (maps to the 'special' cue).
    // File lives at the workspace root, so reference it relative to game/.
    if(raceId === 'khanite' && cue === 'special'){
      sources.unshift('../event_think_tank_build_complete-event_think_tank_build_complete_01%20%281%29.wav');
    }

    // Special case: Sons of Source custom SFX from workspace root.
    if(raceId === 'sons_of_source' && cue === 'fire'){
      sources.unshift('../chmmr-laser.wav');
    }
    if(raceId === 'sons_of_source' && cue === 'special'){
      sources.unshift('../chmmr-tractor.wav');
    }

    // Special case: Criminal machinegun fire from workspace root.
    if(raceId === 'criminal' && cue === 'fire'){
      sources.unshift('../104826-9MM_Thompson_submachine_gun_short_burst_distant_perspective_01-SFXBible-ss06863.mp3');
    }

    // Special case: Phantom random morph sound from workspace root.
    if(raceId === 'phantom' && cue === 'special'){
      sources.unshift('../phantom_morph.mp3');
    }

    // Special case: Cabal blackgrid special SFX variants (workspace root files)
    if(raceId === 'cabal' && cue === 'special'){
      const variants = [
        '../cabal special 1.mp3',
        '../cabal special 2.mp3',
        '../cabal special 3.mp3',
        '../cabal special 4.mp3',
        '../cabal special 5.mp3'
      ].map(src=>{
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        try{ a.load(); }catch(err){}
        return a;
      });
      store[cue] = variants;
      return;
    }

    // Special case: Yuptauri boarding audio from workspace root.
    // - special: boarding party launched
    // - board_in: boarding party on enemy ship
    // - board_zap: boarding damage ticks
    // - board_die: boarding party member dies / stack lost
    if(raceId === 'yuptauri' && cue === 'special'){
      sources.unshift('../orz-go.wav');
    }
    if(raceId === 'yuptauri' && cue === 'board_in'){
      sources.unshift('../orz-intruder.wav');
    }
    if(raceId === 'yuptauri' && cue === 'board_zap'){
      sources.unshift('../orz-marinezap.wav');
    }
    if(raceId === 'yuptauri' && cue === 'board_die'){
      sources.unshift('../orz-marinedie.wav');
    }

    // Special case: Pestilence acidic firing sound from workspace root.
    if(raceId === 'pestilence' && cue === 'fire'){
      sources.unshift('../mycon-plasmoid.wav');
    }

    // Special case: Cabal transform + per-form fire sounds from workspace root.
    if((raceId === 'cabal' || raceId === 'cabal_deployed') && cue === 'special'){
      sources.unshift('../mmrnmhrm-transform.wav');
    }
    if(raceId === 'cabal' && cue === 'fire'){
      sources.unshift('../mmrnmhrm-missile.wav');
    }
    if(raceId === 'cabal_deployed' && cue === 'fire'){
      sources.unshift('../mmrnmhrm-laser.wav');
    }

    // Legacy Yuptauri boarding cue: keep mapped to the "on board" sound.
    if(raceId === 'yuptauri' && cue === 'board'){
      sources.unshift('../orz-intruder.wav');
    }
    const tryNext = ()=>{
      if(!sources.length){
        audio._sfxExhausted = true;
        // Clear so callers can fall back to other races/cues.
        if(store[cue] === audio) store[cue] = null;
        return;
      }
      audio.src = sources.shift();
      try{ audio.load(); }catch(err){}
    };
    audio.oncanplaythrough = ()=>{
      try{ console.info('[SFX] loaded', raceId, cue, audio.src); }catch(e){}
      store[cue] = audio;
    };
    audio.onerror = (ev)=>{
      try{ console.warn('[SFX] failed load', raceId, cue, audio.src, ev); }catch(e){}
      if(sources.length) tryNext();
      else {
        audio._sfxExhausted = true;
        if(store[cue] === audio) store[cue] = null;
      }
    };
    tryNext();
  });
  return store;
}

function loadSfxFor(raceId){
  if(!raceId) return;
  currentSfxRace = raceId;
  ensureSfxForRace(raceId);
  if(raceId === 'sons_of_source'){
    try{ primeChmmrLoopAudio(); }catch(err){}
  }
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
  // Safety: never leave cinematic ambience running when battle music is stopped.
  stopBlackgridCinematicAudio();
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
  try{ audio.load(); }catch(err){}
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
    clip.preload = 'auto';
    const src = template.currentSrc || template.src;
    if(src) clip.src = src;
    const startPlayback = ()=>{
      clip.currentTime = 0;
      const playPromise = clip.play();
      if(playPromise && playPromise.catch){
        playPromise.catch(()=>{});
      }
    };
    if(clip.readyState >= (HTMLMediaElement && HTMLMediaElement.HAVE_ENOUGH_DATA || 3)){
      startPlayback();
    } else {
      clip.addEventListener('canplaythrough', startPlayback, {once:true});
      try{ clip.load(); }catch(err){}
    }
    clip.volume = 0.9;
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
  // Among Us reference: if Phantom is the ship that died to end the match,
  // play the crew victory theme instead of the winner's usual theme.
  let overrideRace = null;
  try{
    const phantomShip = (typeof ships !== 'undefined' && ships && ships.length)
      ? ships.find(s=> s && s.type && s.type.id === 'phantom')
      : null;
    if(phantomShip && phantomShip.hp <= 0 && winner && winner.hp > 0 && winner.team && phantomShip.team && winner.team !== phantomShip.team){
      overrideRace = 'victory_crew';
    }
  }catch(err){}
  playVictorySound(overrideRace || winnerRace);
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
  let clip = null;
  if(raceId){
    clip = getSfxClip(cue, raceId);
  } else if(currentSfxRace){
    clip = getSfxClip(cue, currentSfxRace);
  }
  if(!clip && !raceId){
    const fallbackRace = Object.keys(SFX_CACHE).find(id=> SFX_CACHE[id] && SFX_CACHE[id][cue]);
    if(fallbackRace) clip = SFX_CACHE[fallbackRace][cue];
  } else if(!clip && raceId){
    const exclusive = SFX_EXCLUSIVE[cue];
    const fallbackRace = Object.keys(SFX_CACHE).find(id=>{
      if(!SFX_CACHE[id] || !SFX_CACHE[id][cue]) return false;
      if(exclusive && exclusive.has(id) && id !== raceId) return false;
      return id !== raceId;
    });
    if(fallbackRace) clip = SFX_CACHE[fallbackRace][cue];
  }
  if(!clip){
    try{ console.warn('[SFX] no clip for', cue, raceId); }catch(e){}
    try{ if(playGenericSfx && typeof playGenericSfx === 'function'){ if(playGenericSfx(cue)) return; } }catch(e){}
    return;
  }

  // Variant support: store[cue] may be an array of Audio templates.
  if(Array.isArray(clip)){
    const options = clip.filter(Boolean);
    if(!options.length) return;
    clip = options[Math.floor(Math.random() * options.length)];
  }
  // Debug log for Obsidian Circuit fire SFX
  if (cue === 'fire' && raceId === 'obsidian_circuit') {
    console.log('[SFX DEBUG] Playing Obsidian Circuit fire SFX:', clip.src, clip);
  }
  safePlayAudio(clip, `sfx:${cue}:${raceId || currentSfxRace || 'default'}`);
}

// Play an arbitrary audio `src` louder via WebAudio gain.
// Falls back to `safePlayAudio` if WebAudio/buffer loading fails.
function playLoudAudioSrc(src, label, gainMult=1.8, onEnded){
  try{
    if(!src){
      try{ if(typeof onEnded === 'function') onEnded(); }catch(e){}
      return;
    }
    const ctx = ensureSfxAudioContext();
    if(!ctx){
      const a = new Audio();
      a.preload = 'auto';
      a.src = src;
      const clip = safePlayAudio(a, label);
      if(clip && clip.addEventListener && typeof onEnded === 'function'){
        clip.addEventListener('ended', ()=>{ try{ onEnded(); }catch(e){} }, { once:true });
      } else if(typeof onEnded === 'function'){
        setTimeout(()=>{ try{ onEnded(); }catch(e){} }, 140);
      }
      return;
    }
    if(ctx.state === 'suspended') try{ ctx.resume(); }catch(e){}

    loadSfxAudioBuffer(src).then(buffer=>{
      if(!buffer){
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        const clip = safePlayAudio(a, label);
        if(clip && clip.addEventListener && typeof onEnded === 'function'){
          clip.addEventListener('ended', ()=>{ try{ onEnded(); }catch(e){} }, { once:true });
        } else if(typeof onEnded === 'function'){
          setTimeout(()=>{ try{ onEnded(); }catch(e){} }, 140);
        }
        return;
      }
      try{
        const srcNode = ctx.createBufferSource();
        srcNode.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = Math.max(0, gainMult);

        // Match the "horror" wobble behavior used by safePlayAudio.
        if(activeSecretEvent && activeSecretEvent.type === 'horror'){
          const wobble = 0.72 + Math.random() * 0.42;
          try{ srcNode.playbackRate.value = wobble; }catch(err){}
          try{ gain.gain.value = Math.max(0, gain.gain.value * 0.85); }catch(err){}
        }

        let ended = false;
        const finish = ()=>{
          if(ended) return;
          ended = true;
          try{ srcNode.disconnect(); }catch(err){}
          try{ gain.disconnect(); }catch(err){}
          try{ if(typeof onEnded === 'function') onEnded(); }catch(err){}
        };
        srcNode.onended = finish;
        srcNode.connect(gain);
        gain.connect(ctx.destination);
        srcNode.start(0);
        // Safety cleanup in case onended doesn't fire.
        setTimeout(finish, (buffer.duration || 1) * 1000 + 300);
      }catch(err){
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        const clip = safePlayAudio(a, label);
        if(clip && clip.addEventListener && typeof onEnded === 'function'){
          clip.addEventListener('ended', ()=>{ try{ onEnded(); }catch(e){} }, { once:true });
        } else if(typeof onEnded === 'function'){
          setTimeout(()=>{ try{ onEnded(); }catch(e){} }, 140);
        }
      }
    }).catch(()=>{
      const a = new Audio();
      a.preload = 'auto';
      a.src = src;
      const clip = safePlayAudio(a, label);
      if(clip && clip.addEventListener && typeof onEnded === 'function'){
        clip.addEventListener('ended', ()=>{ try{ onEnded(); }catch(e){} }, { once:true });
      } else if(typeof onEnded === 'function'){
        setTimeout(()=>{ try{ onEnded(); }catch(e){} }, 140);
      }
    });
  }catch(err){
    try{
      const a = new Audio();
      a.preload = 'auto';
      a.src = src;
      const clip = safePlayAudio(a, label);
      if(clip && clip.addEventListener && typeof onEnded === 'function'){
        clip.addEventListener('ended', ()=>{ try{ onEnded(); }catch(e){} }, { once:true });
      } else if(typeof onEnded === 'function'){
        setTimeout(()=>{ try{ onEnded(); }catch(e){} }, 140);
      }
    }catch(e){
      try{ if(typeof onEnded === 'function') onEnded(); }catch(ee){}
    }
  }
}

// Try to play a generic cue file when no race-specific SFX is available.
function playGenericSfx(cue){
  if(!cue) return false;
  const candidates = [
    `assets/sfx/${cue}.ogg`,
    `assets/sfx/${cue}.mp3`,
    `assets/sfx/${cue}.wav`,
    `assets/sfx/fire.ogg`,
    `assets/sfx/fire.mp3`,
    `assets/sfx/fire.wav`,
    `assets/sfx/${cue}`
  ];
  for(const c of candidates){
    try{
      const a = new Audio(); a.preload = 'auto'; a.src = c;
      try{ a.load(); }catch(e){}
      try{ a.play().catch(()=>{}); }catch(e){}
      try{ console.info('[SFX] played generic', c); }catch(e){}
      return true;
    }catch(e){}
  }
  return false;
}

// Play a louder SFX by routing through WebAudio with an amplified gain node.
// Falls back to `playSfx` if WebAudio or buffer load fails.
function playLoudSfx(cue, raceId, gainMult=1.8){
  try{
    const template = (raceId ? getSfxClip(cue, raceId) : null) || (currentSfxRace ? getSfxClip(cue, currentSfxRace) : null);
    let src = null;
    if(template){
      if(Array.isArray(template)){
        const options = template.filter(Boolean);
        if(!options.length) return playSfx(cue, raceId);
        src = options[Math.floor(Math.random() * options.length)].src || options[Math.floor(Math.random() * options.length)].currentSrc;
      } else {
        src = template.currentSrc || template.src || null;
      }
    }
    // If no source found, fallback to normal playback
    if(!src) return playSfx(cue, raceId);

    const ctx = ensureSfxAudioContext();
    if(!ctx) return playSfx(cue, raceId);
    // Ensure context resumed for autoplay-restricted environments
    if(ctx.state === 'suspended') try{ ctx.resume(); }catch(e){}

    loadSfxAudioBuffer(src).then(buffer=>{
      if(!buffer) return playSfx(cue, raceId);
      try{
        const srcNode = ctx.createBufferSource();
        srcNode.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = Math.max(0, gainMult);
        srcNode.connect(gain);
        gain.connect(ctx.destination);
        srcNode.start(0);
        // Stop and disconnect after playback
        setTimeout(()=>{
          try{ srcNode.stop(0); }catch(err){}
          try{ srcNode.disconnect(); }catch(err){}
          try{ gain.disconnect(); }catch(err){}
        }, (buffer.duration || 1) * 1000 + 200);
      }catch(err){
        playSfx(cue, raceId);
      }
    }).catch(()=> playSfx(cue, raceId));
  }catch(err){
    try{ playSfx(cue, raceId); }catch(e){}
  }
}

let _sfxAudioCtx = null;
const _sfxAudioBuffers = {};
function ensureSfxAudioContext(){
  if(_sfxAudioCtx) return _sfxAudioCtx;
  try{
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    _sfxAudioCtx = new Ctx();
    return _sfxAudioCtx;
  }catch(err){
    return null;
  }
}

function loadSfxAudioBuffer(src){
  if(!src) return Promise.resolve(null);
  if(_sfxAudioBuffers[src]) return _sfxAudioBuffers[src];
  const ctx = ensureSfxAudioContext();
  if(!ctx) return Promise.resolve(null);
  const promise = fetch(src)
    .then(r=> r.ok ? r.arrayBuffer() : null)
    .then(buf=>{
      if(!buf) return null;
      return new Promise(resolve=>{
        try{
          ctx.decodeAudioData(buf, decoded=> resolve(decoded), ()=> resolve(null));
        }catch(err){
          resolve(null);
        }
      });
    })
    .catch(()=> null);
  _sfxAudioBuffers[src] = promise;
  return promise;
}

const CHMMR_LOOP_TUNING = {
  // We trim a tiny snippet from the decoded buffer and loop it.
  // This avoids any built-in silence/tail in the WAV and eliminates full-file loop waits.
  // Additionally apply playbackRate to make the repeat feel rapid.
  tractor: { snippetSeconds: 0.05, volume: 0.9, playbackRate: 1.8 },
  laser: { snippetSeconds: 0.03, volume: 0.9, playbackRate: 2.6 }
};

const _chmmrTrimmedBufferCache = {};
function getChmmrTrimmedLoopBuffer(src, key){
  if(!src || !key) return Promise.resolve(null);
  const tuning = CHMMR_LOOP_TUNING[key];
  if(!tuning) return loadSfxAudioBuffer(src);
  const cacheKey = `${key}::${src}`;
  if(_chmmrTrimmedBufferCache[cacheKey]) return _chmmrTrimmedBufferCache[cacheKey];
  const promise = loadSfxAudioBuffer(src).then(buffer=>{
    if(!buffer) return null;
    const sampleRate = buffer.sampleRate || 44100;
    const channels = Math.max(1, buffer.numberOfChannels || 1);
    const snippetSeconds = Math.max(0.03, tuning.snippetSeconds || 0.06);
    const snippetFrames = Math.max(256, Math.floor(snippetSeconds * sampleRate));

    // Find a non-silent start so the loop doesn't "pause" on leading silence.
    const windowFrames = Math.max(64, Math.floor(sampleRate * 0.004)); // ~4ms
    const stride = windowFrames;
    const maxScanFrames = Math.min(buffer.length, Math.floor(sampleRate * 1.2));
    let startFrame = 0;
    let bestScore = 0;
    for(let i=0; i + windowFrames < maxScanFrames; i += stride){
      let sum = 0;
      for(let ch=0; ch<channels; ch++){
        const data = buffer.getChannelData(ch);
        for(let j=0; j<windowFrames; j++){
          const v = data[i+j];
          sum += v*v;
        }
      }
      const rms = Math.sqrt(sum / (windowFrames * channels));
      if(rms > bestScore){
        bestScore = rms;
        startFrame = i;
      }
      if(bestScore >= 0.08) break; // strong enough
    }

    // Auto-trim end so we don't include trailing silence between repeats.
    // Look for the last sample above a small threshold within a bounded region.
    const absThresh = 0.012;
    const maxEnd = Math.min(buffer.length, startFrame + Math.max(snippetFrames, Math.floor(sampleRate * 0.25)));
    let lastHot = startFrame;
    for(let i=startFrame; i<maxEnd; i++){
      let hot = false;
      for(let ch=0; ch<channels; ch++){
        const v = buffer.getChannelData(ch)[i];
        if(v > absThresh || v < -absThresh){
          hot = true;
          break;
        }
      }
      if(hot) lastHot = i;
    }
    // Add a tiny tail so the loop doesn't click.
    const tailPad = Math.floor(sampleRate * 0.004);
    const endFrame = Math.min(maxEnd, lastHot + tailPad);

    // Build a new tiny buffer to loop.
    const ctx = ensureSfxAudioContext();
    if(!ctx) return buffer;
    const outLen = Math.max(256, Math.min(endFrame - startFrame, Math.floor(sampleRate * 0.35)));
    const out = ctx.createBuffer(channels, outLen, sampleRate);
    for(let ch=0; ch<channels; ch++){
      const srcData = buffer.getChannelData(ch);
      const dst = out.getChannelData(ch);
      for(let i=0; i<outLen; i++){
        dst[i] = srcData[startFrame + i] || 0;
      }
    }
    return out;
  }).catch(()=> null);
  _chmmrTrimmedBufferCache[cacheKey] = promise;
  return promise;
}

function primeChmmrLoopAudio(){
  // Best-effort: load buffers early so starting a loop has no initial delay.
  ensureSfxAudioContext();
  getChmmrTrimmedLoopBuffer('../chmmr-laser.wav', 'laser');
  getChmmrTrimmedLoopBuffer('../chmmr-tractor.wav', 'tractor');
}

function startLoopingSfx(loopState, key, cue, raceId, volume=0.85){
  if(!loopState) return;
  if(loopState[key] && !loopState[key]._stopped) return;
  const template = getSfxClip(cue, raceId);
  if(!template) return;
  const src = template.currentSrc || template.src;
  if(!src) return;

  // Prefer WebAudio for gapless loops (HTMLAudio loop can have a small pause).
  const ctx = ensureSfxAudioContext();
  const tuning = CHMMR_LOOP_TUNING[key] || null;
  const desiredVolume = Math.max(0, Math.min(1, (tuning && typeof tuning.volume === 'number') ? tuning.volume : volume));
  const desiredRate = (tuning && typeof tuning.playbackRate === 'number') ? Math.max(0.25, Math.min(8, tuning.playbackRate)) : 1;
  if(ctx){
    if(ctx.state === 'suspended'){
      try{ ctx.resume(); }catch(err){}
    }
    const pending = { _stopped: false, _kind: 'pending', _cancel: false, _src: src };
    loopState[key] = pending;
    getChmmrTrimmedLoopBuffer(src, key).then(buffer=>{
      if(!buffer) throw new Error('no buffer');
      if(loopState[key] !== pending || pending._cancel) return;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      try{ source.playbackRate.value = desiredRate; }catch(err){}
      // Loop the entire trimmed buffer for the tightest repeat.
      source.loopStart = 0;
      source.loopEnd = Math.max(0.02, buffer.duration);
      gain.gain.value = desiredVolume;
      source.connect(gain);
      gain.connect(ctx.destination);
      try{ source.start(0); }catch(err){}
      loopState[key] = { _stopped: false, _kind: 'webaudio', source, gain, _src: src };
    }).catch(()=>{
      // Fallback to HTMLAudio if WebAudio buffer load fails.
      if(loopState[key] !== pending || pending._cancel) return;
      try{
        const clip = new Audio(src);
        clip.preload = 'auto';
        clip.loop = true;
        clip.volume = desiredVolume;
        clip._stopped = false;
        loopState[key] = clip;
        const p = clip.play();
        if(p && p.catch) p.catch(()=>{});
      }catch(err){}
    });
    return;
  }

  // Basic fallback.
  try{
    const clip = new Audio(src);
    clip.preload = 'auto';
    try{ clip.playbackRate = desiredRate; }catch(err){}
    // If we're looping a short segment (chmmr), do a time-wrapped loop to avoid
    // HTMLAudio's full-file loop (which can include silence / long tails).
    const seg = CHMMR_LOOP_TUNING[key];
    if(seg){
      clip.loop = false;
      clip._loopStart = Math.max(0, seg.loopStart || 0);
      clip._loopEnd = Math.max(clip._loopStart + 0.02, seg.loopEnd || (clip._loopStart + 0.12));
      const wrap = ()=>{
        try{
          if(clip._stopped) return;
          if(clip.currentTime >= clip._loopEnd){
            // Wrap immediately; keep playing.
            clip.currentTime = clip._loopStart;
          }
        }catch(err){}
      };
      clip._loopWrap = wrap;
      // Use a tight timer; `timeupdate` can be too infrequent and cause audible gaps.
      clip._loopTimer = setInterval(wrap, 16);
      clip.addEventListener('ended', ()=>{
        try{
          if(clip._stopped) return;
          clip.currentTime = clip._loopStart;
          const p = clip.play();
          if(p && p.catch) p.catch(()=>{});
        }catch(err){}
      });
    } else {
      clip.loop = true;
    }
    clip.volume = desiredVolume;
    clip._stopped = false;
    loopState[key] = clip;
    if(clip._loopStart != null){
      try{ clip.currentTime = clip._loopStart; }catch(err){}
    }
    const p = clip.play();
    if(p && p.catch) p.catch(()=>{});
  }catch(err){}
}

function stopLoopingSfx(loopState, key){
  if(!loopState || !loopState[key]) return;
  const clip = loopState[key];
  loopState[key] = null;
  try{
    clip._stopped = true;
    if(clip._kind === 'pending'){
      clip._cancel = true;
      return;
    }
    if(clip._kind === 'webaudio'){
      try{ clip.source.stop(0); }catch(err){}
      try{ clip.source.disconnect(); }catch(err){}
      try{ clip.gain.disconnect(); }catch(err){}
      return;
    }
    if(clip._loopWrap){
      clip._loopWrap = null;
    }
    if(clip._loopTimer){
      try{ clearInterval(clip._loopTimer); }catch(err){}
      clip._loopTimer = null;
    }
    clip.pause();
    clip.currentTime = 0;
  }catch(err){}
}

function getAvatarFrame(raceId, state){
  if(!raceId) return null;
  const set = AVATARS[raceId];
  if(set){
    return set[state] || set.idle || null;
  }
  // Fallback: try to use the ship sprite as a portrait when avatar frames are missing.
  try{
    const spriteImg = SHIP_SPRITES && SHIP_SPRITES[raceId];
    if(spriteImg && spriteImg.src) return spriteImg;
    const type = typeof getShipTypeById === 'function' ? getShipTypeById(raceId) : null;
    if(type && type.spriteFile){ const img = new Image(); img.src = type.spriteFile; return img; }
  }catch(e){}
  return null;
}

function updateAvatarImg(){
  const el = document.getElementById('avatar-img');
  if(!el) return;
  try{
    const now = (performance && performance.now) ? performance.now() : Date.now();
    if(playerAvatarOverrideSrc && playerAvatarOverrideUntil && now < playerAvatarOverrideUntil){
      const currentAttr = el.getAttribute('src') || '';
      if(currentAttr !== playerAvatarOverrideSrc){
        el.setAttribute('src', playerAvatarOverrideSrc);
      }
      return;
    }
    if(playerAvatarOverrideUntil && now >= playerAvatarOverrideUntil){
      // clear override when expired
      playerAvatarOverrideSrc = null; playerAvatarOverrideUntil = 0;
      if(avatarWrap) avatarWrap.classList.remove('signal-lost');
    }
  }catch(e){}
  let img = getAvatarFrame(currentAvatarRace, avatarState);
  if(!img){
    try{
      const type = (typeof getShipTypeById === 'function') ? getShipTypeById(currentAvatarRace) : null;
      if(type){
        if(type.factionIcon) { img = new Image(); img.src = type.factionIcon; }
        else if(type.spriteFile) { img = new Image(); img.src = type.spriteFile; }
      }
    }catch(e){}
  }
  el.src = (img && img.src) ? img.src : '';
}

function updateEnemyAvatarImg(){
  const el = document.getElementById('enemy-avatar-img');
  if(!el) return;
  try{
    const now = (performance && performance.now) ? performance.now() : Date.now();
    if(enemyAvatarOverrideSrc && enemyAvatarOverrideUntil && now < enemyAvatarOverrideUntil){
      const currentAttr = el.getAttribute('src') || '';
      if(currentAttr !== enemyAvatarOverrideSrc){
        el.setAttribute('src', enemyAvatarOverrideSrc);
      }
      return;
    }
    if(enemyAvatarOverrideUntil && now >= enemyAvatarOverrideUntil){
      resetEnemyAvatarFeed();
    }
  }catch(e){}
  let img = getAvatarFrame(currentEnemyRace, enemyAvatarState);
  if(!img){
    try{
      const type = (typeof getShipTypeById === 'function') ? getShipTypeById(currentEnemyRace) : null;
      if(type){
        if(type.factionIcon) { img = new Image(); img.src = type.factionIcon; }
        else if(type.spriteFile) { img = new Image(); img.src = type.spriteFile; }
      }
    }catch(e){}
  }
  const desired = img && img.src ? img.src : '';
  const currentAttr = el.getAttribute('src') || '';
  if(currentAttr !== desired){
    el.setAttribute('src', desired);
  }
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

function updateEnemyParasiteHud(ship){
  if(!enemyParasiteIndicator || !enemyParasiteMeter) return;
  const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  const entries = ship && Array.isArray(ship.parasites)
    ? ship.parasites.filter(p=> p && (p.untilMs == null || nowMs < p.untilMs) && (p.hp == null || p.hp > 0))
    : [];
  if(!entries.length){
    enemyParasiteIndicator.classList.remove('active');
    enemyParasiteMeter.style.width = '0%';
    if(enemyParasiteCount) enemyParasiteCount.textContent = '';
    return;
  }
  // Keep the meter simple: if we don't have timing metadata, show a full bar.
  let percent = 1;
  const timed = entries.filter(p=> typeof p.untilMs === 'number' && (typeof p.appliedAtMs === 'number' || typeof p.durMs === 'number'));
  if(timed.length){
    const progress = timed.map(p=>{
      const totalMs = typeof p.durMs === 'number'
        ? Math.max(1, p.durMs)
        : Math.max(1, p.untilMs - p.appliedAtMs);
      const remainingMs = Math.max(0, p.untilMs - nowMs);
      const elapsedMs = Math.max(0, totalMs - remainingMs);
      return Math.max(0, Math.min(1, elapsedMs / totalMs));
    });
    percent = Math.max(...progress);
  }
  enemyParasiteMeter.style.width = `${(percent * 100).toFixed(1)}%`;
  if(enemyParasiteCount) enemyParasiteCount.textContent = `x${entries.length}`;
  enemyParasiteIndicator.classList.add('active');
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
  if(handleModalKeydown(e)) return;
  if(isMainMenuVisible()){
    e.preventDefault();
    return;
  }
  if(e.key==='w') keys.w=true;
  if(e.key==='ArrowUp'){ keys.w=true; e.preventDefault(); }
  if(e.key==='a') keys.a=true;
  if(e.key==='ArrowLeft'){ keys.a=true; e.preventDefault(); }
  if(e.key==='s') keys.s=true;
  if(e.key==='ArrowDown'){ keys.s=true; e.preventDefault(); }
  if(e.key==='d') keys.d=true;
  if(e.key==='ArrowRight'){ keys.d=true; e.preventDefault(); }
  if(e.code==='Space') {
    // Avoid key-repeat toggling.
    if(keys.space) { e.preventDefault(); return; }
    keys.space=true;
    // Queue a fire press on keydown so quick taps can't be missed.
    pendingFirePresses++;
    e.preventDefault();
  }
  if(e.key==='Shift' || e.code==='ShiftLeft' || e.code==='ShiftRight'){
    // Queue a special press on keydown so quick taps can't be missed.
    if(keys.shift) { e.preventDefault(); return; }
    keys.shift = true;
    pendingSpecialPresses++;
    e.preventDefault();
  }
  handleLocalInputChanged();
});
window.addEventListener('keyup',(e)=>{
  if(handleModalKeyup(e)) return;
  // Always clear key state on keyup, even if the main menu is open.
  // Otherwise keys can get "stuck" when the menu captures focus.
  if(isMainMenuVisible()){
    if(e.key==='Escape') e.preventDefault();
  }
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
  if(e.key==='Shift' || e.code==='ShiftLeft' || e.code==='ShiftRight'){
    keys.shift=false;
    const playerShip = ships ? ships.find(s=> s && s.control) : null;
    if(playerShip) playerShip.specialLatch = false;
    e.preventDefault();
  }
  handleLocalInputChanged();
});

function resetKeyState(){
  keys.w=false; keys.a=false; keys.s=false; keys.d=false;
  keys.space=false; keys.shift=false;
  const playerShip = ships ? ships.find(s=> s && s.control) : null;
  if(playerShip){
    playerShip.fireLatch = false;
    playerShip.specialLatch = false;
  }
  handleLocalInputChanged();
}

window.addEventListener('blur', resetKeyState);
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) resetKeyState();
});

class Ship{
  constructor(type,x,y,team){
    this.type=type; this.x=x; this.y=y; this.team=team; this.hp=type.hp;
    // Remember what this ship originally spawned as (important for Phantom morph victory music).
    this.spawnTypeId = (type && type.id) ? type.id : null;
    this.size = type.size; this.color=type.color; this.cool=0; this.angle=0;
    this.baseSpeed = type.speed;
    this.speed = type.speed;
    this.fireRate = type.fireRate;
    this.vx = 0; this.vy = 0; this.control = false; this.maxSpeed = type.speed*1.2;
    this.baseMaxSpeed = this.maxSpeed;
    this.spriteAngleOffset = type.spriteAngleOffset || 0;
    this.spriteScale = type.spriteScale || null;
    this.trailColors = type.trailColors || DEFAULT_TRAIL_COLORS;
    this.trail = [];
    this.maxEnergy = type.energyCapacity || 100;
    this.energy = this.maxEnergy;
    this.energyCost = type.energyCost || 8;
    this.energyRegen = type.energyRegen || 20;
    this.baseEnergyRegen = this.energyRegen;
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
    this.remoteControl = null;
    this.confused = null;

    // Status/modifier system (stacked each frame).
    this.mod = {
      turnRateMult: 1,
      thrustMult: 1,
      damageMult: 1,
      fireCooldownMult: 1,
      energyRegenMult: 1,
      damageTakenMult: 1
    };
    this.doctrine = null; // e.g. Cabal dual doctrine
    this.parasites = [];
    this.ultimatum = null;
    this.lastDamagedAt = 0;

    // Local-only looping SFX (e.g. Sons of Source chmmr laser/tractor loops).
    this.loopingSfx = {};
    // Visual handle for channel beams.
    this.channelBeamBullet = null;
    this.channelBeamBullets = null;

    // Phantom: temporary random morph state.
    this.morphState = null;

    // Cabal: start in default (mobile) form.
    if(this.type && this.type.id === 'cabal'){
      this.doctrine = this.doctrine || 'default';
    }
  }

  captureMorphSnapshot(){
    const type = this.type || null;
    const maxHp = (type && typeof type.hp === 'number') ? type.hp : (this.hp || 1);
    const hpRatio = maxHp > 0 ? Math.max(0.05, Math.min(1, (this.hp || 1) / maxHp)) : 1;
    const energyRatio = this.maxEnergy > 0 ? Math.max(0, Math.min(1, (this.energy || 0) / this.maxEnergy)) : 1;
    return {
      type,
      size: this.size,
      color: this.color,
      baseSpeed: this.baseSpeed,
      speed: this.speed,
      fireRate: this.fireRate,
      maxSpeed: this.maxSpeed,
      baseMaxSpeed: this.baseMaxSpeed,
      spriteAngleOffset: this.spriteAngleOffset,
      spriteScale: this.spriteScale,
      trailColors: this.trailColors,
      maxEnergy: this.maxEnergy,
      energyCost: this.energyCost,
      energyRegen: this.energyRegen,
      baseEnergyRegen: this.baseEnergyRegen,
      specialConfig: this.specialConfig,
      projectileConfig: this.projectileConfig,
      requireTriggerReset: this.requireTriggerReset,
      doctrine: this.doctrine,
      hpRatio,
      energyRatio
    };
  }

  applyMorphType(newType, snapshot){
    const type = newType || null;
    if(!type) return;

    if(typeof ensureTypeSpritesLoaded === 'function'){
      ensureTypeSpritesLoaded(type);
    }

    const hpRatio = snapshot && typeof snapshot.hpRatio === 'number' ? snapshot.hpRatio : 1;
    const energyRatio = snapshot && typeof snapshot.energyRatio === 'number' ? snapshot.energyRatio : 1;
    const newMaxHp = (type && typeof type.hp === 'number') ? type.hp : (this.hp || 1);
    const newMaxEnergy = (type && typeof type.energyCapacity === 'number') ? type.energyCapacity : 100;

    this.type = type;
    this.size = type.size;
    this.color = type.color;
    this.baseSpeed = type.speed;
    this.speed = type.speed;
    this.fireRate = type.fireRate;
    this.maxSpeed = type.speed * 1.2;
    this.baseMaxSpeed = this.maxSpeed;
    this.spriteAngleOffset = type.spriteAngleOffset || 0;
    this.spriteScale = type.spriteScale || null;
    this.trailColors = type.trailColors || DEFAULT_TRAIL_COLORS;

    this.maxEnergy = newMaxEnergy;
    this.energy = Math.max(0, Math.min(this.maxEnergy, energyRatio * this.maxEnergy));
    this.energyCost = type.energyCost || 8;
    this.energyRegen = type.energyRegen || 20;
    this.baseEnergyRegen = this.energyRegen;

    // Swap abilities/weapons to the new form.
    this.specialConfig = type.special || null;
    this.projectileConfig = type.projectile || null;
    this.requireTriggerReset = !!type.requireTriggerReset;

    // Reset any in-progress special; morph should be a clean swap.
    if(this.activeSpecial && this.activeSpecial.type === 'lunarCloak') this.endCloak();
    this.activeSpecial = null;

    // Cabal-specific init.
    this.doctrine = null;
    if(this.type && this.type.id === 'cabal'){
      this.doctrine = 'default';
      this.projectileConfig = this.type.projectile || this.projectileConfig;
    }

    // Preserve current HP ratio relative to the new hull.
    this.hp = Math.max(1, Math.min(newMaxHp, hpRatio * newMaxHp));
  }

  updateMorphState(){
    const state = this.morphState;
    if(!state) return;
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const expired = (state.untilMs != null && nowMs >= state.untilMs) || this.hp <= 0;
    if(!expired) return;
    const original = state.original;
    this.morphState = null;
    if(original && original.type){
      this.applyMorphType(original.type, original);
      // Restore configs that might not match type defaults (e.g. Cabal deployed form).
      this.specialConfig = original.specialConfig || (original.type && original.type.special) || null;
      this.projectileConfig = original.projectileConfig || (original.type && original.type.projectile) || null;
      this.requireTriggerReset = !!original.requireTriggerReset;
      this.doctrine = original.doctrine || null;
      if(this.type && this.type.id === 'cabal' && !this.doctrine){
        this.doctrine = 'default';
      }
    }
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
    this.updateMorphState();
    if(this.processWarp(dt)){
      const regen = (this.energyRegen || 0) * (this.mod ? (this.mod.energyRegenMult || 1) : 1);
      this.energy = Math.min(this.maxEnergy, this.energy + regen * dt);
      return;
    }
    this.recomputeModifiers(dt);

    // Robust local special input: consume queued Shift presses here.
    if(this.control && pendingSpecialPresses > 0){
      pendingSpecialPresses = Math.max(0, pendingSpecialPresses - 1);
      this.attemptSpecial();
    }

    // Robust local fire input for channel laser: consume queued Space taps here.
    if(this.control && pendingFirePresses > 0 && this.projectileConfig && this.projectileConfig.style === 'laserBeam'){
      pendingFirePresses = Math.max(0, pendingFirePresses - 1);
      this._queuedLaserFireTap = true;
    }

    // Hold-to-acquire for channeled traction beam: keep trying while Shift is held.
    if(this.control && keys.shift && this.specialConfig && this.specialConfig.type === 'tractionBeam' && !this.activeSpecial){
      this._holdSpecialRetry = (this._holdSpecialRetry || 0) - dt;
      if(this._holdSpecialRetry <= 0){
        const ok = this.attemptSpecial();
        this._holdSpecialRetry = ok ? 0.18 : 0.12;
      }
    } else {
      this._holdSpecialRetry = 0;
    }

    this.thrusting = false;
    if(this.confused && this.hp > 0){
      this.updateConfusion(dt);
    } else {
      if(this.control){
        this.pilotWithInput(keys, dt);
      } else if(this.remoteControl){
        const wantsFire = this.pilotWithInput(this.remoteControl.state, dt);
        if(this.remoteControl.prevSpace && !wantsFire){
          freezeChannelBulletsFor(this);
        }
        this.remoteControl.prevSpace = wantsFire;
      } else {
        this.updateAI(dt);
      }
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
    // Decay any blackgrid shake applied to this ship — but respect a residual timer for dramatic shaking
    if(this._blackgridResidualTimer && this._blackgridResidualTimer > 0){
      this._blackgridResidualTimer = Math.max(0, this._blackgridResidualTimer - dt);
      // keep a violent shake while residual is active
      this._blackgridShake = Math.max(this._blackgridShake || 0, 28);
    } else {
      if(this._blackgridShake && this._blackgridShake > 0){
        this._blackgridShake = Math.max(0, this._blackgridShake - (dt * 40));
      }
    }
    this.updateDamageOverTime(dt);
    const regen = (this.energyRegen || 0) * (this.mod ? (this.mod.energyRegenMult || 1) : 1);
    this.energy = Math.min(this.maxEnergy, this.energy + regen * dt);
  }

  recomputeModifiers(dt){
    // Expire parasites.
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if(this.parasites && this.parasites.length){
      this.parasites = this.parasites.filter(p=> p && (p.untilMs == null || nowMs < p.untilMs) && (p.hp == null || p.hp > 0));
    }
    // Expire ultimatum.
    if(this.ultimatum && this.ultimatum.untilMs && nowMs >= this.ultimatum.untilMs){
      this.ultimatum = null;
    }

    // Base multipliers.
    const mod = this.mod || (this.mod = {});
    mod.turnRateMult = 1;
    mod.thrustMult = 1;
    mod.damageMult = 1;
    mod.fireCooldownMult = 1;
    mod.energyRegenMult = 1;
    mod.damageTakenMult = 1;

    // Cabal transform.
    if(this.type && this.type.id === 'cabal'){
      const form = this.doctrine || 'default';
      if(form === 'deployed'){
        // Deployed: slow but fast turning.
        mod.thrustMult *= 0.7;
        mod.turnRateMult *= 1.6;
      } else {
        // Default: fast but slow turning.
        mod.thrustMult *= 1.25;
        mod.turnRateMult *= 0.75;
      }
    }

    // Parasite debuffs (Obamination).
    if(this.parasites && this.parasites.length){
      const stacks = this.parasites.length;
      const slowPer = this.parasites[0] && typeof this.parasites[0].slowPer === 'number' ? this.parasites[0].slowPer : 0.08;
      const turnSlowPer = this.parasites[0] && typeof this.parasites[0].turnSlowPer === 'number' ? this.parasites[0].turnSlowPer : 0.08;
      const slow = Math.min(0.65, stacks * slowPer);
      const turnSlow = Math.min(0.65, stacks * turnSlowPer);
      mod.thrustMult *= (1 - slow);
      mod.turnRateMult *= (1 - turnSlow);
    }

    // Barack ultimatum penalties.
    if(this.ultimatum && this.ultimatum.mode){

          // Breachborn flame trail boost.
          if(this.activeSpecial && this.activeSpecial.type === 'flameTrail'){
            const boost = (this.activeSpecial.config && Number.isFinite(this.activeSpecial.config.boostMult))
              ? this.activeSpecial.config.boostMult
              : 1.5;
            mod.thrustMult *= Math.max(1, boost);
          }
      if(this.ultimatum.mode === 'engage'){
        mod.turnRateMult *= (this.ultimatum.turnPenaltyMult ?? 0.65);
      } else if(this.ultimatum.mode === 'disengage'){
        mod.damageMult *= (this.ultimatum.weaponPenaltyMult ?? 0.65);
      } else if(this.ultimatum.mode === 'both'){
        mod.turnRateMult *= (this.ultimatum.turnPenaltyMult ?? 0.65);
        mod.damageMult *= (this.ultimatum.weaponPenaltyMult ?? 0.65);
      }
    }

    // Apply derived speed values.
    this.speed = (this.baseSpeed || this.speed || 0) * (mod.thrustMult || 1);
    this.maxSpeed = (this.baseMaxSpeed || this.maxSpeed || 0) * (mod.thrustMult || 1);
    this.energyRegen = (this.baseEnergyRegen || this.energyRegen || 0);
  }

  updateConfusion(dt){
    const state = this.confused;
    if(!state) return;
    state.age += dt;
    if(state.age >= state.duration){
      this.confused = null;
      return;
    }
    // Spin out and drift.
    const spinRate = state.spinRate || 8;
    this.angle += spinRate * dt;

    const baseAngle = state.driftAngle || 0;
    const wobble = Math.sin((state.seed || 0) + state.age * 6.5) * 0.35;
    const driftAngle = baseAngle + wobble;
    const speed = state.driftSpeed || 220;
    const targetVx = Math.cos(driftAngle) * speed;
    const targetVy = Math.sin(driftAngle) * speed;
    this.vx = lerp(this.vx, targetVx, 0.14);
    this.vy = lerp(this.vy, targetVy, 0.14);
    this.vx *= 0.992;
    this.vy *= 0.992;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Confusion shimmer particles.
    state.fxTimer = (state.fxTimer || 0) - dt;
    if(state.fxTimer <= 0){
      state.fxTimer = 0.06 + Math.random()*0.06;
      const r = this.size * (0.6 + Math.random()*0.65);
      const a = (state.seed || 0) + state.age * 5 + Math.random()*1.2;
      particles.push({
        x: this.x + Math.cos(a) * r,
        y: this.y + Math.sin(a) * r,
        vx: (Math.random()-0.5)*40,
        vy: (Math.random()-0.5)*40,
        life: 0.18 + Math.random()*0.18,
        size: 1.1 + Math.random()*1.4,
        core: [200, 120, 255],
        mid: [120, 180, 255]
      });
    }
  }
  pilotWithInput(inputState, dt){
    const input = inputState || EMPTY_INPUT_STATE;
    const isLocalInput = this.control && inputState === keys;
    const autoBeam = !!(this._autoBeamActive && this.projectileConfig && this.projectileConfig.style === 'laserBeam');
    const rotSpeed = 3.5 * (this.mod ? (this.mod.turnRateMult || 1) : 1);
    if(input.a) this.angle -= rotSpeed*dt;
    if(input.d) this.angle += rotSpeed*dt;
    const thrust = 300 * (this.mod ? (this.mod.thrustMult || 1) : 1);
    if(input.w){
      this.vx += Math.cos(this.angle)*thrust*dt;
      this.vy += Math.sin(this.angle)*thrust*dt;
      this.markThrust();
    }
    if(input.s){
      this.vx *= 0.96;
      this.vy *= 0.96;
    }
    const sp = Math.hypot(this.vx,this.vy);
    if(sp > this.maxSpeed){
      this.vx = this.vx/sp * this.maxSpeed;
      this.vy = this.vy/sp * this.maxSpeed;
    }
    this.x += this.vx*dt;
    this.y += this.vy*dt;
    this.cool -= dt*1000;
    const wantsFire = !!input.space || (this._queuedLaserFireTap && this.projectileConfig && this.projectileConfig.style === 'laserBeam') || autoBeam;

    // Criminal: loop machinegun sound while Space is held (local player only).
    if(isLocalInput && this.type && this.type.id === 'criminal'){
      if(wantsFire){
        this._criminalFireLoop = true;
        startLoopingSfx(this.loopingSfx, 'criminal_fire', 'fire', 'criminal', 0.9);
      } else {
        this._criminalFireLoop = false;
        stopLoopingSfx(this.loopingSfx, 'criminal_fire');
      }
    }

    // Channel laser (Sons of Source): hold Space to keep beam active; battery-limited.
    if(this.projectileConfig && this.projectileConfig.style === 'laserBeam'){
      this._queuedLaserFireTap = false;
      if(wantsFire){
        this.updateLaserBeamChannel(dt);
      } else {
        this.stopLaserBeamChannel();
      }
      if(!isLocalInput){
        if(input.shift){
          if(!this.specialLatch){
            const ok = this.attemptSpecial();
            if(ok) this.specialLatch = true;
          }
        } else {
          this.specialLatch = false;
        }
      }
      return wantsFire;
    }



    // Boring Man: hold-to-charge a single projectile, release to fire once.
    if(this.type && this.type.id === 'boring_man'){
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if(wantsFire){
        if(!this.chargeStart){
          this.chargeStart = now;
          this.chargeTierName = computeChargeLevel(0).name;
          playBoringChargeSound();
        } else {
          const elapsed = Math.max(0, (now - this.chargeStart) / 1000);
          const tier = computeChargeLevel(elapsed);
          if(tier && tier.name && tier.name !== this.chargeTierName){
            this.chargeTierName = tier.name;
            playBoringChargeSound();
          }
        }
      } else if(this.chargeStart){
        const elapsed = Math.max(0, (now - this.chargeStart) / 1000);
        const level = computeChargeLevel(elapsed);
        spawnBoringBall(this, level);
        delete this.chargeStart;
        delete this.chargeTierName;
      }
      if(!isLocalInput){
        if(input.shift){
          if(!this.specialLatch){
            const ok = this.attemptSpecial();
            if(ok) this.specialLatch = true;
          }
        } else {
          this.specialLatch = false;
        }
      }
      // Do not auto-fire the normal weapon while charging/holding space.
      return wantsFire;
    }

    const shotReady = this.cool <= 0;
    if(this.requireTriggerReset){
      if(wantsFire && !this.fireLatch && shotReady){
        if(this.shoot(this.angle)) {
          const skipCooldown = !!(this.projectileConfig && this.projectileConfig.style === 'laserBeam' && this.type && this.type.id === 'cabal' && this.doctrine === 'deployed');
          if(!skipCooldown) this.cool = this.getFireCooldown();
          const fireRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed')
            ? 'cabal_deployed'
            : (this.type && this.type.id === 'obsidian_circuit' ? 'obsidian_circuit' : this.type.id);
          playSfx('fire', fireRaceId);
        }
        this.fireLatch = true;
      }
      if(!wantsFire) this.fireLatch = false;
    } else if(wantsFire && shotReady){
      if(this.shoot(this.angle)) {
        const skipCooldown = !!(this.projectileConfig && this.projectileConfig.style === 'laserBeam' && this.type && this.type.id === 'cabal' && this.doctrine === 'deployed');
        if(!skipCooldown) this.cool = this.getFireCooldown();
        const fireRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed')
          ? 'cabal_deployed'
          : (this.type && this.type.id === 'obsidian_circuit' ? 'obsidian_circuit' : this.type.id);
        playSfx('fire', fireRaceId);
      }
    }
    if(!isLocalInput){
      if(input.shift){
        if(!this.specialLatch){
          const ok = this.attemptSpecial();
          if(ok) this.specialLatch = true;
        }
      } else {
        this.specialLatch = false;
      }
    }
    return wantsFire;
  }

  updateLaserBeamChannel(dt){
    const proj = this.projectileConfig || {};
    const drain = Math.max(0, proj.drainPerSecond || 0);
    if(drain > 0){
      this.energy = Math.max(0, this.energy - drain * dt);
      if(this.energy <= 0.5){
        this.stopLaserBeamChannel();
        return;
      }
    }

    if(this.control && this.type && this.type.id === 'sons_of_source'){
      startLoopingSfx(this.loopingSfx, 'laser', 'fire', this.type.id, 0.9);
    }

    const muzzleOffset = proj.muzzleOffset || this.size;
    const length = Math.max(120, proj.length || 820);
    const dirX = Math.cos(this.angle);
    const dirY = Math.sin(this.angle);
    const width = Math.max(2, proj.width || 8);

    const dual = !!proj.dualBeam;
    const origins = [];
    if(dual){
      const sep = Math.max(6, proj.beamSeparation || (this.size || 20) * 0.55);
      const px = -Math.sin(this.angle);
      const py = Math.cos(this.angle);
      const forwardX = this.x + dirX * muzzleOffset;
      const forwardY = this.y + dirY * muzzleOffset;
      origins.push({ x: forwardX + px * (sep * 0.5), y: forwardY + py * (sep * 0.5) });
      origins.push({ x: forwardX - px * (sep * 0.5), y: forwardY - py * (sep * 0.5) });
    } else {
      origins.push({ x: this.x + dirX * muzzleOffset, y: this.y + dirY * muzzleOffset });
    }

    const dps = Math.max(0, proj.damagePerSecond || 0);
    const damageMult = this.mod ? (this.mod.damageMult || 1) : 1;
    const dmgTotal = Math.max(0, dps * damageMult * dt);
    const dmgEach = dual ? (dmgTotal * 0.5) : dmgTotal;

    const beamSegments = origins.map(origin=>{
      let endX = origin.x + dirX * length;
      let endY = origin.y + dirY * length;
      let hitShip = null;
      let bestT = Infinity;
      ships.forEach(s=>{
        if(!s || s.team === this.team || s.hp <= 0 || s.isWarping()) return;
        const vx = s.x - origin.x;
        const vy = s.y - origin.y;
        const t = (vx * dirX + vy * dirY);
        if(t < 0 || t > length) return;
        const cx = origin.x + dirX * t;
        const cy = origin.y + dirY * t;
        const dist = Math.hypot(s.x - cx, s.y - cy);
        const r = Math.max(width * 0.75, (s.size || 18) * 0.85);
        if(dist <= r && t < bestT){
          bestT = t;
          hitShip = s;
        }
      });

      if(hitShip){
        endX = origin.x + dirX * bestT;
        endY = origin.y + dirY * bestT;
        if(dmgEach > 0) applyDamage(hitShip, dmgEach, this);
      }
      return { originX: origin.x, originY: origin.y, endX, endY };
    });

    // Keep short-lived beam bullets alive for drawing.
    if(dual){
      if(!this.channelBeamBullets || !Array.isArray(this.channelBeamBullets) || this.channelBeamBullets.length !== 2){
        this.channelBeamBullets = [null, null];
      }
      for(let i=0;i<2;i++){
        const seg = beamSegments[i];
        const existing = this.channelBeamBullets[i];
        if(!existing || existing.ttl <= 0){
          const b = {
            x: seg.originX,
            y: seg.originY,
            dx: 0,
            dy: 0,
            team: this.team,
            ttl: proj.ttl || 0.08,
            damage: 0,
            ownerShip: this,
            raceId: this.type.id,
            projectile: proj,
            endX: seg.endX,
            endY: seg.endY,
            seed: Math.random()*Math.PI*2
          };
          bullets.push(b);
          this.channelBeamBullets[i] = b;
        } else {
          existing.x = seg.originX;
          existing.y = seg.originY;
          existing.endX = seg.endX;
          existing.endY = seg.endY;
          existing.ttl = proj.ttl || 0.08;
        }
      }
      this.channelBeamBullet = this.channelBeamBullets[0];
    } else {
      this.channelBeamBullets = null;
      const seg = beamSegments[0];
      if(!this.channelBeamBullet || this.channelBeamBullet.ttl <= 0){
        const b = {
          x: seg.originX,
          y: seg.originY,
          dx: 0,
          dy: 0,
          team: this.team,
          ttl: proj.ttl || 0.08,
          damage: 0,
          ownerShip: this,
          raceId: this.type.id,
          projectile: proj,
          endX: seg.endX,
          endY: seg.endY,
          seed: Math.random()*Math.PI*2
        };
        bullets.push(b);
        this.channelBeamBullet = b;
      } else {
        this.channelBeamBullet.x = seg.originX;
        this.channelBeamBullet.y = seg.originY;
        this.channelBeamBullet.endX = seg.endX;
        this.channelBeamBullet.endY = seg.endY;
        this.channelBeamBullet.ttl = proj.ttl || 0.08;
      }
    }
  }

  stopLaserBeamChannel(){
    if(this.control && this.type && this.type.id === 'sons_of_source'){
      stopLoopingSfx(this.loopingSfx, 'laser');
    }
    if(this.channelBeamBullets && Array.isArray(this.channelBeamBullets)){
      this.channelBeamBullets.forEach(b=>{ if(b) b.ttl = 0; });
      this.channelBeamBullets = null;
    }
    if(this.channelBeamBullet){
      this.channelBeamBullet.ttl = 0;
      this.channelBeamBullet = null;
    }
  }
    // ...existing code...
    // Play lingering "fly" sound for Obsidian Circuit projectile
    // This should be triggered when the projectile is created and stopped when it dissipates.
    // For now, add a hook in the projectile logic (not shown here) to call:
    //   playSfx('fly', 'obsidian_circuit');
    // when the projectile is spawned, and stop it when the projectile is removed.
  canUseSpecial(){
    if(!this.specialConfig) return false;
    if(this.activeSpecial){
      if(this.activeSpecial.type === 'lunarCloak') return true;
      if(this.activeSpecial.type === 'pickleHive'){
        const cost = this.specialConfig.cost || 0;
        return this.energy >= cost && this.hasPickleSpawnCapacity(this.activeSpecial);
      }
      // Boarding pods can be re-cast to launch additional parties while prior pods are active.
      if(this.activeSpecial.type === 'boardingPods' && this.specialConfig.type === 'boardingPods'){
        const cost = this.specialConfig.cost || 0;
        return this.energy >= cost;
      }
      return false;
    }
    // Specials are battery-gated (energy) only; no cooldown gating.
    if(this.specialConfig.type === 'furnaceFuel'){
      const crewCost = Math.max(0, this.specialConfig.crewCost || 1);
      if(this.hp - crewCost < 1) return false;
    }
    const cost = this.specialConfig.cost || 0;
    return this.energy >= cost;
  }
  attemptSpecial(){
    // Allow toggling some active channelled specials off even when battery is empty.
    if(this.activeSpecial && (this.activeSpecial.type === 'lunarCloak' || this.activeSpecial.type === 'devistanField')){
      if(this.activeSpecial.type === 'lunarCloak'){
        this.activeSpecial.forceEnd = true;
        this.endCloak();
        this.activeSpecial = null;
        return true;
      }
      if(this.activeSpecial.type === 'devistanField'){
        this.activeSpecial.forceEnd = true;
        if(this.control){
          playSfx('special', this.type.id);
          const now = performance.now ? performance.now() : Date.now();
          specialActiveUntil = now + 450;
        }
        return true;
      }
    }
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

    // Boarding pods: allow stacking more pods onto an existing boarding run.
    if(this.activeSpecial && this.activeSpecial.type === 'boardingPods' && conf.type === 'boardingPods'){
      const launched = this.startBoardingPods(this.activeSpecial, {append:true});
      if(!launched) return false;
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        specialActiveUntil = now + 450;
      }
      return true;
    }

    if(conf.type === 'confusionRay'){
      const target = findConfusionRayTarget(this, conf.range, conf.cone);
      if(!target) return false;
      const applied = applyConfusionToShip(target, conf, this);
      if(!applied) return false;
      const dirX = Math.cos(this.angle);
      const dirY = Math.sin(this.angle);
      const startX = this.x + dirX * this.size*0.82;
      const startY = this.y + dirY * this.size*0.82;
      const spec = {
        type: 'confusionRay',
        age: 0,
        duration: conf.duration || 0.28,
        config: conf,
        startX,
        startY,
        endX: target.x,
        endY: target.y,
        target
      };
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 280;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'ambush'){
      const spawned = startCriminalAmbush(this, conf);
      if(spawned <= 0) return false;
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(conf.duration) ? (conf.duration * 1000) : 600;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'mapTeleport'){
      const fromX = this.x;
      const fromY = this.y;
      const margin = Math.max(40, (this.size || 20) * 1.6);
      const minX = margin;
      const maxX = canvas.width - margin;
      const minY = margin;
      const maxY = canvas.height - margin;
      const minDist = Math.max(canvas.width, canvas.height) * (conf.minDistance || 0.55);

      let toX = null;
      let toY = null;
      for(let tries=0; tries<28; tries++){
        const x = minX + Math.random() * Math.max(1, (maxX - minX));
        const y = minY + Math.random() * Math.max(1, (maxY - minY));
        const d = Math.hypot(x - fromX, y - fromY);
        if(d < minDist) continue;
        let blocked = false;
        if(planets && planets.length){
          for(let i=0;i<planets.length;i++){
            const p = planets[i];
            if(!p) continue;
            const rr = (p.r || 0) + (this.size || 20) * 1.25;
            if(Math.hypot(x - p.x, y - p.y) < rr){
              blocked = true;
              break;
            }
          }
        }
        if(blocked) continue;
        toX = x;
        toY = y;
        break;
      }
      if(toX == null || toY == null) return false;

      // True teleport: disappear, then reappear (no dash across the map).
      const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : [255,255,255];
      const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [160,200,255];
      for(let i=0;i<18;i++){
        const a = Math.random() * Math.PI*2;
        const sp = 80 + Math.random()*220;
        particles.push({
          x: fromX + Math.cos(a) * (this.size*0.25),
          y: fromY + Math.sin(a) * (this.size*0.25),
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.14 + Math.random()*0.18,
          size: 1.2 + Math.random()*2.2,
          core,
          mid
        });
      }

      this.warp = {
        from: {x: fromX, y: fromY},
        to: {x: toX, y: toY},
        age: 0,
        duration: Math.max(0.18, conf.warpDuration || 0.28),
        angle: 0,
        mode: 'blink',
        switchAt: null,
        arrivalSpawned: false
      };
      this.invulnerable = true;
      this.x = fromX;
      this.y = fromY;
      this.vx = 0;
      this.vy = 0;

      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      // Instant special: allow re-use as soon as battery permits.
      // (Warp animation already prevents immediate re-activation because input isn't processed during warp.)
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(conf.duration) ? (conf.duration * 1000) : 550;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'possession'){
      const target = findConfusionRayTarget(this, conf.range, conf.cone);
      if(!target || target.hp <= 0 || (target.isWarping && target.isWarping())) return false;
      const minRemain = Math.max(0, conf.minRemainingHp ?? 1);
      const maxDrain = Math.max(1, conf.maxDrain ?? 78);
      const minDrain = Math.max(1, conf.minDrain ?? 18);
      const frac = Math.max(0.05, Math.min(0.95, conf.drainFraction ?? 0.35));
      const base = (target.type && target.type.hp) ? target.type.hp : target.hp;
      let drain = base * frac;
      drain = Math.max(minDrain, Math.min(maxDrain, drain));
      drain = Math.min(drain, Math.max(0, target.hp - minRemain));
      if(drain <= 0) return false;

      applyDamage(target, drain, this);
      const maxHpMult = Math.max(1, conf.maxHpMultiplier ?? 2.6);
      const maxHp = (this.type && this.type.hp) ? (this.type.hp * maxHpMult) : (this.hp + drain);
      this.hp = Math.min(maxHp, this.hp + drain);

      const dirX = Math.cos(this.angle);
      const dirY = Math.sin(this.angle);
      const startX = this.x + dirX * this.size*0.82;
      const startY = this.y + dirY * this.size*0.82;
      const spec = {
        type: 'possession',
        age: 0,
        duration: conf.duration || 0.35,
        config: conf,
        startX,
        startY,
        endX: target.x,
        endY: target.y,
        target,
        drained: drain,
        fxTimer: 0,
        seed: Math.random()*Math.PI*2
      };

      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 350;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'blackgridHack'){
      // Allow firing regardless of facing: pick nearest valid ship (ignore cone)
      const target = findTractionBeamTarget(this, conf.range || 480, conf.cone || 0.65, true, true);
      if(!target || target.hp <= 0 || (target.isWarping && target.isWarping())) return false;
      // Force a fixed 3s duration for the hack — user requested exact 3s.
      const spec = {
        type: 'blackgridHack',
        age: 0,
        // damage window (after lock-on)
        duration: 3.0,
        config: conf,
        target,
        source: this,
        tickTimer: 0,
        seed: Math.random()*Math.PI*2,
        // Cinematic phases (real-time):
        // - lock marker for 1.0s (slowmo)
        // - fire, then keep slowmo 0.2s more
        lockRemaining: (conf.lockOnSeconds != null) ? conf.lockOnSeconds : 1.0,
        postFireSlowRemaining: (conf.postFireSlowSeconds != null) ? conf.postFireSlowSeconds : 0.2,
        damageStarted: false,
        fired: false,
        fireFlashRemaining: 0,
        lockMessageHoldRemaining: 0
      };
      // Fully drain caster's battery on activation (instant full drain)
      this.energy = 0;
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      // enter slow-motion for cinematic lock
      targetTimeScale = Math.max(0.06, Math.min(0.45, conf.slowTimeScale || 0.18));
      if(this.control){
        startBlackgridCinematicAudio();
        const now = performance.now ? performance.now() : Date.now();
        const lockS = (spec.lockRemaining || 0);
        const postS = (spec.postFireSlowRemaining || 0);
        const totalS = lockS + (spec.duration || 3.0) + postS;
        specialActiveUntil = now + (totalS * 1000);
      }
      return true;
    }

    if(conf.type === 'devistanField'){
      // Channelled global slow-motion RGB field. Lasts until battery depletes
      // or the player presses Shift again to toggle it off.
      const intendedDuration = Math.max(0.1, conf.duration || 5.0);
      const spec = {
        type: 'devistanField',
        age: 0,
        // Give a long max duration so generic expiry won't prematurely stop it;
        // actual ending is governed by `drainPerSecond` or manual toggle.
        duration: Math.max(1.0, conf.maxDuration || 9999),
        config: conf,
        seed: Math.random()*Math.PI*2,
        // Drain energy over time so the field ends when battery runs out.
        drainPerSecond: (typeof conf.drainPerSecond === 'number')
          ? Math.max(0, conf.drainPerSecond)
          : (this.maxEnergy > 0 ? (this.maxEnergy / Math.max(0.5, intendedDuration)) : 20)
      };
      const cost = conf.cost || 0;
      if(cost > 0){ this.energy = Math.max(0, this.energy - cost); }
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      // Enter dramatic slow-motion for cinematic effect.
      targetTimeScale = Math.max(0.02, Math.min(0.45, conf.slowTimeScale || 0.06));
      if(this.control){
        const now = performance.now ? performance.now() : Date.now();
        // short HUD flash while active; the special itself is channelled.
        specialActiveUntil = now + 600;
        try{ playLoudSfx('special', this.type.id, 2.0); }catch(e){}
      }
      return true;
    }

    if(conf.type === 'tractionBeam'){
      // Tractor beam should not require aiming/facing; pick a valid target regardless of view direction.
      const target = findTractionBeamTarget(this, conf.range, conf.cone, true, true);
      if(!target || target.hp <= 0 || target.isWarping()) return false;
      const startX = this.x;
      const startY = this.y;
      const spec = {
        type: 'tractionBeam',
        age: 0,
        // Channeled: lasts while Shift is held and energy remains.
        // Use a long finite duration so the generic expiry logic still works.
        duration: Math.max(1.0, conf.maxDuration || 9999),
        drainPerSecond: Math.max(0, conf.drainPerSecond || 0),
        config: conf,
        startX,
        startY,
        endX: target.x,
        endY: target.y,
        target,
        seed: Math.random()*Math.PI*2,
        fxTimer: 0
      };
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.activeSpecial = spec;
      // Channeled ability is battery-gated; allow immediate re-use after release.
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 1200;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'regenBiomass' || conf.type === 'regenPulse'){
      const spec = {
        type: conf.type,
        age: 0,
        duration: conf.duration || 2.8,
        config: conf,
        seed: Math.random()*Math.PI*2,
        fxTimer: 0
      };
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 1200;
        specialActiveUntil = now + durMs;
      }
      return true;
    }

    if(conf.type === 'parasitePods'){
      const launched = this.launchParasitePods(conf);
      if(launched <= 0) return false;
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      // Battery-gated: allow repeated casts as long as energy permits.
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        specialActiveUntil = now + 450;
      }
      return true;
    }

    if(conf.type === 'combatOutpost'){
      const deployed = deployCombatOutpost(this, conf);
      if(!deployed) return false;
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        specialActiveUntil = now + 650;
      }
      return true;
    }

    if(conf.type === 'summonDaemon'){
      const maxOrbs = Math.max(1, Math.min(6, conf.maxOrbs || 3));
      const activeOrbs = bullets.filter(b=> b && b.ttl > 0 && b.ownerShip === this && b.projectile && b.projectile.style === 'daemonOrb').length;
      if(activeOrbs >= maxOrbs) return false;

      const speed = Math.max(80, conf.orbSpeed || 170);
      const ttl = Math.max(1.2, conf.orbTtl || 11);
      const maxHp = Math.max(1, (typeof conf.orbHp === 'number') ? conf.orbHp : ((typeof conf.orbMaxHp === 'number') ? conf.orbMaxHp : 30));
      const damage = 0;
      const drainEnergy = Math.max(0, conf.orbDrainEnergy ?? 18);
      const muzzle = (this.size || 20) * 0.9 + 16;
      const a = this.angle + (Math.random() - 0.5) * 0.55;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const originX = this.x + dx * muzzle;
      const originY = this.y + dy * muzzle;
      bullets.push({
        x: originX,
        y: originY,
        dx: dx * speed,
        dy: dy * speed,
        ttl,
        initialTtl: ttl,
        team: this.team,
        damage,
        drainEnergy,
        hp: maxHp,
        maxHp,
        ownerShip: this,
        raceId: this.type.id,
        projectile: {
          style: 'daemonOrb',
          radius: Math.max(6, conf.orbRadius || 11),
          hitRadius: Math.max(8, conf.orbHitRadius || 14),
          core: conf.orbCore || [235,210,255],
          mid: conf.orbMid || [170,90,255],
          rim: conf.orbRim || [80,30,160],
          speed,
          turnRate: Math.max(0.5, conf.orbTurnRate || 6.6),
          bounceSpeed: Math.max(80, conf.orbBounceSpeed || 280),
          hitCooldownMs: Math.max(40, conf.orbHitCooldownMs || 280)
        },
        tracking: true,
        daemonAge: 0,
        target: getNearestEnemyShip(this.team, {x: originX, y: originY}),
        seed: Math.random()*Math.PI*2
      });

      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        const now = performance.now ? performance.now() : Date.now();
        specialActiveUntil = now + 450;
      }
      return true;
    }

    if(conf.type === 'dualDoctrine'){
      // Cabal transform: toggle deployed/default.
      const prev = this.doctrine || 'default';
      const next = prev === 'deployed' ? 'default' : 'deployed';
      this.doctrine = next;

      // Swap weapon per form.
      if(this.type && this.type.id === 'cabal'){
        if(next === 'deployed' && this.type.deployedProjectile){
          this.projectileConfig = this.type.deployedProjectile;
        } else {
          this.projectileConfig = this.type.projectile || this.projectileConfig;
        }
      }
      // Ensure cooldown/trigger state does not block immediate beam firing when deployed.
      this.cool = 0;
      this.fireLatch = false;
      // Enable auto-beam while deployed for player-controlled Cabal.
      this._autoBeamActive = (next === 'deployed');
      if(this.control){
        // Start beam immediately for player when toggling to deployed.
        try{ this.updateLaserBeamChannel(0.016); }catch(e){}
        // Also queue a tap for compatibility with input handling.
        this._queuedLaserFireTap = true;
      }
      // Instrumentation: log doctrine toggle for debugging Cabal firing behavior.
      try{
        console.log('[Cabal] doctrine toggle', {id: this.spawnTypeId || (this.type && this.type.id), doctrine: this.doctrine, projStyle: (this.projectileConfig && this.projectileConfig.style)});
      }catch(e){}
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.specialCooldown = 0;
      const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : [255,180,160];
      const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [255,80,80];
      for(let i=0;i<14;i++){
        const a = Math.random()*Math.PI*2;
        const sp = 80 + Math.random()*180;
        particles.push({
          x: this.x + Math.cos(a)*(this.size*0.2),
          y: this.y + Math.sin(a)*(this.size*0.2),
          vx: Math.cos(a)*sp,
          vy: Math.sin(a)*sp,
          life: 0.16 + Math.random()*0.18,
          size: 1.1 + Math.random()*1.8,
          core,
          mid
        });
      }
      if(this.control){
        const sfxRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed') ? 'cabal_deployed' : this.type.id;
        playSfx('special', sfxRaceId);
        const now = performance.now ? performance.now() : Date.now();
        specialActiveUntil = now + 300;
      }
      return true;
    }

    if(conf.type === 'randomMorph'){
      // Phantom: temporarily morph into a random ship type (excluding the horror boss).
      if(this.morphState) return false;

      const candidates = (Array.isArray(SHIP_TYPES) ? SHIP_TYPES : [])
        .filter(t=> t && t.id && t.id !== 'random' && t.id !== 'horror_boss' && t.id !== (this.type && this.type.id));
      if(!candidates.length) return false;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if(!pick) return false;

      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }

      const dur = Math.max(0.75, conf.duration || 7.5);
      const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const snapshot = this.captureMorphSnapshot();

      // Simple transform burst.
      const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : [220, 180, 255];
      const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [130, 70, 210];
      for(let i=0;i<14;i++){
        const a = Math.random()*Math.PI*2;
        const sp = 80 + Math.random()*180;
        particles.push({
          x: this.x + Math.cos(a)*(this.size*0.25),
          y: this.y + Math.sin(a)*(this.size*0.25),
          vx: Math.cos(a)*sp,
          vy: Math.sin(a)*sp,
          life: 0.16 + Math.random()*0.18,
          size: 1.1 + Math.random()*1.8,
          core,
          mid
        });
      }

      // Apply morph and schedule revert.
      this.applyMorphType(pick, snapshot);
      this.morphState = {
        untilMs: nowMs + dur*1000,
        original: snapshot,
        targetId: pick.id
      };

      // Battery-gated only.
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', 'phantom');
        specialActiveUntil = nowMs + 450;
      }
      return true;
    }

    if(conf.type === 'submissionUltimatum'){
      const target = findTractionBeamTarget(this, conf.range, conf.cone, false);
      if(!target || target.hp <= 0 || target.isWarping()) return false;
      const nowMs = (performance.now ? performance.now() : Date.now());
      const dist0 = Math.hypot(target.x - this.x, target.y - this.y);
      const spec = {
        type: 'submissionUltimatum',
        age: 0,
        duration: conf.duration || 6,
        config: conf,
        target,
        dist0,
        mode: 'none',
        modeSinceMs: nowMs,
        seed: Math.random()*Math.PI*2
      };
      target.ultimatum = {
        mode: 'both',
        sourceRef: this,
        untilMs: nowMs + (spec.duration*1000),
        turnPenaltyMult: conf.turnPenaltyMult ?? 0.65,
        weaponPenaltyMult: conf.weaponPenaltyMult ?? 0.65
      };
      const cost = conf.cost || 0;
      if(cost > 0){
        this.energy = Math.max(0, this.energy - cost);
      }
      this.activeSpecial = spec;
      this.specialCooldown = 0;
      if(this.control){
        playSfx('special', this.type.id);
        specialActiveUntil = nowMs + 900;
      }
      return true;
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
    if(spec.type === 'scarletPulse'){
      const expandTime = Math.max(0.12, conf.expandTime || 0.45);
      // Expand quickly to a wide radius, then fade out shortly after.
      spec.expandTime = expandTime;
      spec.maxRadius = Math.max(40, conf.radius || 220);
      spec.ringWidth = Math.max(10, conf.ringWidth || 26);
      spec.duration = Math.max(spec.duration || 0, expandTime + 0.18);
    }
    if(spec.type === 'pickleHive'){
      const spawned = this.startPickleHive(spec);
      if(spawned <= 0) return false;
    }
    if(spec.type === 'furnaceFuel'){
      const accepted = this.executeFurnaceFuel(spec);
      if(!accepted) return false;
    }
    if(spec.type === 'layMine'){
      const placed = this.executeLayMine(spec);
      if(!placed) return false;
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
    this.specialCooldown = 0;
    if(spec.type === 'lunarCloak'){
      this.cloakActive = true;
      this.cloakOpacity = 1;
      if(!this.control) this.trail = [];
    }
    if(this.control){
      if(spec.type !== 'fartCloud' && spec.type !== 'furnaceFuel' && spec.type !== 'layMine' && !(spec.type === 'flameTrail' && this.type && this.type.id === 'breachborn')){
        playSfx('special', this.type.id);
      }
      const now = performance.now ? performance.now() : Date.now();
      const durMs = Number.isFinite(spec.duration) ? (spec.duration * 1000) : 1400;
      specialActiveUntil = now + durMs;
    }
    return true;
  }
  updateSpecial(dt){
    // Specials are battery-gated only; cooldown is disabled.
    this.specialCooldown = 0;
    const spec = this.activeSpecial;
    if(!spec) return;
    spec.age += dt;
    if(spec.drainPerSecond){
      this.energy = Math.max(0, this.energy - spec.drainPerSecond * dt);
      // If we run out of energy, force-end the special (handles Infinity duration correctly).
      if(this.energy <= 0.5) spec.forceEnd = true;
    }

    // Breachborn burner is channeled: releasing Shift ends it.
    if(spec.type === 'flameTrail' && this.type && this.type.id === 'breachborn'){
      const holdingShift = this.control
        ? !!keys.shift
        : !!(this.remoteControl && this.remoteControl.state && this.remoteControl.state.shift);
      if((this.control || this.remoteControl) && !holdingShift){
        spec.forceEnd = true;
      }
    }
    switch(spec.type){
      case 'waveMotionGun':
        this.updateWaveMotionGun(spec, dt);
        break;
      case 'flameTrail':
        this.updateFlameTrail(spec, dt);
        break;
      case 'tractionBeam':
        this.updateTractionBeam(spec, dt);
        break;
      case 'regenBiomass':
        this.updateRegen(spec, dt);
        break;
      case 'regenPulse':
        this.updateRegen(spec, dt);
        break;
      case 'submissionUltimatum':
        this.updateSubmissionUltimatum(spec, dt);
        break;
      case 'possession':
        this.updatePossession(spec, dt);
        break;
      case 'blackgridHack':
        this.updateBlackgridHack(spec, dt);
        break;
        case 'devistanField':
          this.updateDevistanField(spec, dt);
          break;
      case 'scarletPulse':
        this.updateScarletPulse(spec, dt);
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
      case 'layMine':
        // instant effect handled on activation
        break;
      default:
        break;
    }
    const finiteDuration = Number.isFinite(spec.duration) ? spec.duration : null;
    const expired = finiteDuration != null ? spec.age >= finiteDuration : false;
    if(expired || spec.forceEnd || this.hp <= 0){
      // If Devistan ended, make sure global time is restored and caster mods revert.
      try{
        if(spec.type === 'devistanField'){
          targetTimeScale = 1.0;
          if(spec._origMod){
            this.mod = this.mod || {};
            this.mod.thrustMult = spec._origMod.thrustMult ?? 1;
            this.mod.turnRateMult = spec._origMod.turnRateMult ?? 1;
          } else if(this.mod){
            this.mod.thrustMult = 1;
            this.mod.turnRateMult = 1;
          }
        }
      }catch(e){}
      if(spec.type === 'tractionBeam' && this.control && this.type && this.type.id === 'sons_of_source'){
        stopLoopingSfx(this.loopingSfx, 'tractor');
      }
      if(spec.type === 'flameTrail' && this.control && this.type && this.type.id === 'breachborn'){
        stopLoopingSfx(this.loopingSfx, 'burner');
      }
      if(spec.type === 'lunarCloak') this.endCloak();
      if(spec.type === 'humperDash'){
        this.vx *= 0.6;
        this.vy *= 0.6;
      }
      if(spec.type === 'submissionUltimatum'){
        // Status ends with the special.
        this.ultimatum = null;
      }
      this.activeSpecial = null;
    }
  }

  launchParasitePods(conf){
    const count = Math.max(1, Math.min(10, conf.podCount || 1));
    const speed = Math.max(220, conf.podSpeed || 520);
    const ttl = Math.max(0.5, conf.podTtl || 1.8);
    const spread = Math.max(0, conf.spread || 0.08);
    const muzzle = (conf.muzzleOffset || (this.size * 0.9)) + 6;
    const dmg = Math.max(0, conf.onHitDamage ?? 6);
    const turnRate = Math.max(0.5, conf.turnRate || 4.6);
    const wobble = Math.max(0, conf.wobble || 0.22);
    for(let i=0;i<count;i++){
      const a = this.angle + (Math.random()-0.5) * spread;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const origin = { x: this.x + dx * muzzle, y: this.y + dy * muzzle };
      bullets.push({
        x: origin.x,
        y: origin.y,
        dx: dx * speed,
        dy: dy * speed,
        ttl,
        team: this.team,
        damage: dmg,
        ownerShip: this,
        projectile: {
          style: 'parasitePod',
          radius: 8,
          hitRadius: 11,
          core: [170, 255, 150],
          mid: [80, 210, 80],
          tail: [30, 120, 45],
          speed,
          turnRate,
          wobble
        },
        tracking: true,
        podAge: 0,
        target: getNearestEnemyShip(this.team, origin),
        seed: Math.random()*Math.PI*2,
        parasiteSpec: {
          slowPer: conf.slowPer ?? 0.085,
          turnSlowPer: conf.turnSlowPer ?? 0.085,
          hp: conf.parasiteHp ?? 12,
          duration: conf.parasiteDuration ?? 9.5
        }
      });
    }
    return count;
  }

  updateTractionBeam(spec, dt){
    const target = spec.target;
    const conf = spec.config || {};
    spec.startX = this.x;
    spec.startY = this.y;
    // End channel when the player lets go.
    if(this.control){
      if(this.type && this.type.id === 'sons_of_source'){
        startLoopingSfx(this.loopingSfx, 'tractor', 'special', this.type.id, 0.9);
      }
      if(!keys.shift){
        if(this.type && this.type.id === 'sons_of_source'){
          stopLoopingSfx(this.loopingSfx, 'tractor');
        }
        spec.forceEnd = true;
        return;
      }
    } else if(this.remoteControl && this.remoteControl.state){
      if(!this.remoteControl.state.shift){
        spec.forceEnd = true;
        return;
      }
    }
    if(!target || target.hp <= 0 || target.isWarping()){
      if(this.control && this.type && this.type.id === 'sons_of_source'){
        stopLoopingSfx(this.loopingSfx, 'tractor');
      }
      spec.forceEnd = true;
      return;
    }
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const maxRange = (conf.range == null || conf.range <= 0) ? Infinity : Math.max(80, conf.range || 560);
    if(dist > maxRange){
      if(this.control && this.type && this.type.id === 'sons_of_source'){
        stopLoopingSfx(this.loopingSfx, 'tractor');
      }
      spec.forceEnd = true;
      return;
    }
    const nx = dx / dist;
    const ny = dy / dist;
    // LOS check.
    const pad = (this.size || 20) * 0.25;
    if(!hasClearLineOfSight(this.x, this.y, target.x, target.y, pad)){
      if(this.control && this.type && this.type.id === 'sons_of_source'){
        stopLoopingSfx(this.loopingSfx, 'tractor');
      }
      spec.forceEnd = true;
      return;
    }

    spec.endX = target.x;
    spec.endY = target.y;

    // Pull target toward caster.
    const pull = Math.max(0, conf.pullStrength || 420);
    const accel = (pull / dist) * dt;
    target.vx += -nx * pull * dt;
    target.vy += -ny * pull * dt;
    // Mild stabilization so it feels like a beam.
    target.vx *= 0.997;
    target.vy *= 0.997;

    // Drain target energy.
    const drainT = Math.max(0, conf.targetDrainPerSecond || 0);
    if(drainT > 0 && target.energy != null){
      target.energy = Math.max(0, target.energy - drainT * dt);
    }

    // Beam motes.
    spec.fxTimer = (spec.fxTimer || 0) - dt;
    if(spec.fxTimer <= 0){
      spec.fxTimer = 0.03;
      const t = 0.15 + Math.random()*0.75;
      const px = this.x + dx * t;
      const py = this.y + dy * t;
      particles.push({
        x: px,
        y: py,
        vx: (Math.random()-0.5)*60,
        vy: (Math.random()-0.5)*60,
        life: 0.12 + Math.random()*0.14,
        size: 0.9 + Math.random()*1.4,
        core: [170, 255, 170],
        mid: [80, 210, 110]
      });
    }
  }
  updateBlackgridHack(spec, dt){
    const conf = spec.config || {};
    // Use unscaled real-time dt for cinematic timers and the 3s duration.
    const rdt = (typeof realDt === 'number' && realDt > 0) ? realDt : dt;

    // Phase 1: lock-on marker (slowmo) for 0.5s
    if(spec.lockRemaining && spec.lockRemaining > 0){
      targetTimeScale = Math.max(0.06, Math.min(0.45, conf.slowTimeScale || 0.18));
      spec.lockRemaining = Math.max(0, spec.lockRemaining - rdt);
      try{ if(spec.target) spec.target._blackgridLockTimer = spec.lockRemaining; }catch(e){}
      return;
    }

    // Phase 2: fire moment (bolt + SFX) and begin damage window — happens once after lock.
    if(!spec.fired){
      spec.fired = true;
      spec.damageStarted = true;
      spec.age = 0;
      spec.tickTimer = 0;
      // keep slowmo briefly after firing
      spec.postFireSlowRemaining = (spec.postFireSlowRemaining != null) ? spec.postFireSlowRemaining : ((conf.postFireSlowSeconds != null) ? conf.postFireSlowSeconds : 0.2);
      // short-lived flash used by renderer to make the initial bolt feel like a "shot"
      spec.fireFlashRemaining = Math.max(0, conf.fireFlashSeconds || 0.18);
      // keep the "TARGET LOCKED." UI message visible briefly after the shot
      spec.lockMessageHoldRemaining = Math.max(0, conf.lockMessageHoldSeconds || 0.65);

      // On-fire: start the dramatic residual/shake + a particle burst (this is the "deploy" moment).
      try{
        if(spec.target){
          const residual = Math.max(0, conf.residualDuration || 5.0);
          spec.target._blackgridResidualTimer = Math.max(spec.target._blackgridResidualTimer || 0, residual);
          spec.target._blackgridResidualSeed = spec.seed;
          spec.target._blackgridShake = Math.max(spec.target._blackgridShake || 0, (conf.shakeIntensity || 18) * 1.35);
          for(let i=0;i<22;i++){
            const a = Math.random() * Math.PI * 2;
            const r = (spec.target.size || 18) * (0.25 + Math.random()*1.25);
            particles.push({
              x: spec.target.x + Math.cos(a) * r,
              y: spec.target.y + Math.sin(a) * r,
              vx: (Math.random()-0.5) * 260,
              vy: (Math.random()-0.5) * 260,
              life: 0.22 + Math.random()*0.55,
              size: 0.9 + Math.random()*2.2,
              core: [255,60,60],
              mid: [40,8,8]
            });
          }
        }
      }catch(e){}

      // Play the special SFX on firing (after the 0.5s lock), not at activation.
      if(this.control){
        try{ playSfx('special', this.type.id); }catch(e){}
      }
      // Trigger avatar override/static for the residual period (user-provided image)
      try{
        const imgPath = 'assets/avatars/cabal/MOSHED-2026-1-8-3-10-16.gif';
        const dur = Math.max(0, (conf.residualDuration != null) ? conf.residualDuration : 5.0);
        // If the hacked target is on team 'A' use the player avatar, otherwise use the enemy avatar.
        try{
          if(spec.target && spec.target.team === 'A'){
            triggerPlayerAvatarStatic(imgPath, dur);
          } else {
            triggerEnemyAvatarStatic(imgPath, dur);
          }
        }catch(e){}
      }catch(e){}
    }

    // Phase 3: after firing, keep slowmo for a short beat, then restore normal.
    if(spec.postFireSlowRemaining && spec.postFireSlowRemaining > 0){
      targetTimeScale = Math.max(0.06, Math.min(0.45, conf.slowTimeScale || 0.18));
      spec.postFireSlowRemaining = Math.max(0, spec.postFireSlowRemaining - rdt);
      if(spec.postFireSlowRemaining <= 0){
        targetTimeScale = 1.0;
      }
    } else {
      targetTimeScale = 1.0;
    }

    if(spec.fireFlashRemaining && spec.fireFlashRemaining > 0){
      spec.fireFlashRemaining = Math.max(0, spec.fireFlashRemaining - rdt);
    }

    if(spec.lockMessageHoldRemaining && spec.lockMessageHoldRemaining > 0){
      spec.lockMessageHoldRemaining = Math.max(0, spec.lockMessageHoldRemaining - rdt);
    }

    spec.age += rdt;
    if(!spec.target || spec.target.hp <= 0 || (spec.target.isWarping && spec.target.isWarping())){
      // restore time scale if we abort early
      targetTimeScale = 1.0;
      spec.forceEnd = true;
      return;
    }
    // Stronger visual shake on target to emphasize effect
    spec.target._blackgridShake = Math.max(spec.target._blackgridShake || 0, conf.shakeIntensity || 18);

    // Tick damage (progressively increasing over the spec.duration)
    spec.tickTimer = (spec.tickTimer || 0) + rdt;
    const tick = Math.max(0.05, conf.tickInterval || 0.25);
    const duration = Math.max(0.0001, Number.isFinite(spec.duration) ? spec.duration : (conf.duration || 3.0));
    while(spec.tickTimer >= tick){
      spec.tickTimer -= tick;
      // Progress 0..1 across the duration
      const progress = Math.max(0, Math.min(1, spec.age / duration));
      // Ramp damage: start light, grow to 1.4x by the end
      const baseDps = Math.max(0, conf.damagePerSecond || 36);
      const rampMult = lerp(0.25, 1.4, progress);
      const damage = baseDps * rampMult * tick;
      applyDamage(spec.target, damage, spec.source || null);
      // intensified particles/electric sparks
      const sparks = 14;
      for(let i=0;i<sparks;i++){
        const a = Math.random() * Math.PI * 2;
        const r = (spec.target.size || 18) * (0.45 + Math.random()*1.2);
        particles.push({
          x: spec.target.x + Math.cos(a) * r,
          y: spec.target.y + Math.sin(a) * r,
          vx: (Math.random()-0.5)*180,
          vy: (Math.random()-0.5)*180,
          life: 0.14 + Math.random()*0.3,
          size: 0.9 + Math.random()*2.0,
          core: [255,40,40],
          mid: [20,6,6]
        });
      }
      // occasional darker smoke-ish ember
      if(Math.random() < 0.45){
        particles.push({
          x: spec.target.x + (Math.random()-0.5) * (spec.target.size || 18),
          y: spec.target.y + (Math.random()-0.5) * (spec.target.size || 18),
          vx: (Math.random()-0.5)*40,
          vy: (Math.random()-0.5)*40,
          life: 0.45 + Math.random()*0.55,
          size: 1.2 + Math.random()*2.8,
          core: [40,10,10],
          mid: [10,5,5]
        });
      }
    }
    // End when duration reached
    if(Number.isFinite(spec.duration) && spec.age >= spec.duration){
      // schedule a residual visual/shake effect on the target lasting longer than the damage window
      try{
        const residual = Math.max(0, conf.residualDuration || 5.0);
        spec.target._blackgridResidualTimer = Math.max(spec.target._blackgridResidualTimer || 0, residual);
        spec.target._blackgridResidualSeed = spec.seed || (Math.random()*Math.PI*2);
        // boost shake for the residual phase
        spec.target._blackgridShake = Math.max(spec.target._blackgridShake || 0, (conf.shakeIntensity || 18) * 1.4);
      }catch(e){}
      // restore normal time
      targetTimeScale = 1.0;
      spec.forceEnd = true;
    }
  }

  updateDevistanField(spec, dt){
    const conf = spec.config || {};
    // Use unscaled real-time for cinematic timing
    const rdt = (typeof realDt === 'number' && realDt > 0) ? realDt : dt;
    // Keep global slow motion while active
    targetTimeScale = Math.max(0.02, Math.min(0.45, conf.slowTimeScale || 0.06));

    // If this ship is the caster, give them a slight speed advantage
    try{
      this.mod = this.mod || {};
      this.mod.thrustMult = Math.max(1, (conf.playerSpeedMult || 1.25));
      this.mod.turnRateMult = Math.max(0.9, (conf.playerTurnMult || 1.05));
    }catch(e){}

    // Age and expire normally (expiry handled by generic special expiry below)
    spec.age += rdt;
    // While active, emit a few RGB motes for flair
    spec.fxTimer = (spec.fxTimer || 0) - rdt;
    if(spec.fxTimer <= 0){
      spec.fxTimer = 0.06;
      const intensity = Math.max(0, conf.rgbIntensity || 0.8);
      for(let i=0;i<6;i++){
        const a = Math.random() * Math.PI*2;
        const r = Math.max(12, (this.size || 20) * (0.35 + Math.random()*1.6));
        particles.push({
          x: this.x + Math.cos(a) * r,
          y: this.y + Math.sin(a) * r,
          vx: (Math.random()-0.5) * 120 * intensity,
          vy: (Math.random()-0.5) * 120 * intensity,
          life: 0.12 + Math.random()*0.5,
          size: 0.9 + Math.random()*2.6,
          core: [255, Math.floor(120 + 120*Math.random()), Math.floor(120 + 120*Math.random())],
          mid: [Math.floor(120 + 120*Math.random()), 255, Math.floor(120 + 120*Math.random())]
        });
      }
    }
  }

  updateRegen(spec, dt){
    const conf = spec.config || {};
    const maxHp = (this.type && this.type.hp) ? this.type.hp : this.hp;
    if(this.hp <= 0 || this.hp >= maxHp) return;
    const heal = Math.max(0, conf.healPerSecond || 0);
    if(heal <= 0) return;

    let mult = 1;
    if(spec.type === 'regenBiomass'){
      const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const windowMs = Math.max(150, conf.stallWindowMs || 650);
      if(this.lastDamagedAt && (nowMs - this.lastDamagedAt) < windowMs){
        mult = (conf.stallHealMult == null ? 0 : conf.stallHealMult);
      }
    }

    const applied = heal * mult * dt;
    if(applied > 0){
      this.hp = Math.min(maxHp, this.hp + applied);
    }

    // Aura motes.
    spec.fxTimer = (spec.fxTimer || 0) - dt;
    if(spec.fxTimer <= 0){
      spec.fxTimer = 0.06;
      const a = Math.random()*Math.PI*2;
      const r = (this.size || 20) * (0.55 + Math.random()*0.65);
      particles.push({
        x: this.x + Math.cos(a)*r,
        y: this.y + Math.sin(a)*r,
        vx: (Math.random()-0.5)*30,
        vy: (Math.random()-0.5)*30,
        life: 0.18 + Math.random()*0.2,
        size: 1.0 + Math.random()*1.6,
        core: [180,255,200],
        mid: [90,210,140]
      });
    }
  }

  updateSubmissionUltimatum(spec, dt){
    const conf = spec.config || {};
    const target = spec.target;
    const nowMs = (performance.now ? performance.now() : Date.now());
    if(!target || target.hp <= 0 || target.isWarping()){
      spec.forceEnd = true;
      return;
    }
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    const engageThresh = Math.max(140, spec.dist0 * 0.78);
    const disengageThresh = Math.max(260, spec.dist0 * 1.22);
    let nextMode = 'both';
    if(dist <= engageThresh) nextMode = 'engage';
    else if(dist >= disengageThresh) nextMode = 'disengage';

    if(nextMode !== spec.mode){
      spec.mode = nextMode;
      spec.modeSinceMs = nowMs;
    }

    // Apply penalties based on the currently judged behavior.
    if(target.ultimatum){
      target.ultimatum.mode = nextMode;
      target.ultimatum.sourceRef = this;
    }

    // Lightning shock damage while the tether is active.
    const shockDps = Math.max(0, conf.shockDamagePerSecond || 0);
    if(shockDps > 0){
      target.hp = Math.max(0, target.hp - shockDps * dt);
      spec.zapFxTimer = (spec.zapFxTimer || 0) - dt;
      if(spec.zapFxTimer <= 0){
        spec.zapFxTimer = 0.04 + Math.random()*0.05;
        const a = Math.random() * Math.PI * 2;
        const r = (target.size || 20) * (0.6 + Math.random()*0.55);
        particles.push({
          x: target.x + Math.cos(a)*r,
          y: target.y + Math.sin(a)*r,
          vx: (Math.random()-0.5) * 80,
          vy: (Math.random()-0.5) * 80,
          life: 0.14 + Math.random()*0.18,
          size: 1.0 + Math.random()*1.8,
          core: [220, 250, 255],
          mid: [120, 200, 255]
        });
      }
    }

    const holdMs = Math.max(350, conf.commitHoldMs || 1100);
    if(nextMode !== 'both' && (nowMs - (spec.modeSinceMs || nowMs)) >= holdMs){
      // Decisive commit.
      spec.forceEnd = true;
    }
  }

  updateFlameTrail(spec, dt){
    const conf = spec.config || {};

    // Loop the burner sound while the special is active (local player only).
    if(this.control && this.type && this.type.id === 'breachborn'){
      startLoopingSfx(this.loopingSfx, 'burner', 'special', this.type.id, 0.9);
    }

    spec.spawnTimer = (spec.spawnTimer || 0) - dt;
    if(spec.spawnTimer > 0) return;
    spec.spawnTimer = Math.max(0.02, conf.spawnInterval || 0.07);

    const backAngle = this.angle + Math.PI;
    const baseR = Math.max(10, conf.cloudBaseRadius || (this.size * 0.9));
    const maxR = Math.max(baseR + 6, conf.cloudMaxRadius || (baseR * 3.0));
    const dur = Math.max(0.25, conf.cloudDuration || 1.1);
    const expandTime = Math.max(0.05, conf.cloudExpandTime || 0.22);
    const dps = Math.max(1, conf.cloudDamagePerSecond || 40);
    const jitter = (this.size || 20) * 0.25;
    const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : DEFAULT_TRAIL_COLORS.core;
    const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : DEFAULT_TRAIL_COLORS.mid;
    const outer = [
      Math.max(0, mid[0] - 130),
      Math.max(0, mid[1] - 110),
      Math.max(0, mid[2] - 80)
    ];

    const spawnX = this.x + Math.cos(backAngle) * (this.size * 0.95) + (Math.random()-0.5) * jitter;
    const spawnY = this.y + Math.sin(backAngle) * (this.size * 0.95) + (Math.random()-0.5) * jitter;

    plasmaClouds.push({
      x: spawnX,
      y: spawnY,
      vx: (this.vx || 0) * 0.2 + Math.cos(backAngle) * (40 + Math.random()*65),
      vy: (this.vy || 0) * 0.2 + Math.sin(backAngle) * (40 + Math.random()*65),
      driftDecay: 0.985,
      age: 0,
      duration: dur,
      expandTime,
      baseRadius: baseR,
      maxRadius: maxR,
      currentRadius: baseR,
      displayRadius: baseR,
      damagePerSecond: dps,
      opacity: 0.75,
      team: this.team,
      ownerShip: this,
      colors: { core, mid, outer },
      noiseSeed: Math.random()*10
    });
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
        applyDamage(target, spec.damagePerSecond * dt, this);
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

  updateScarletPulse(spec, dt){
    const conf = spec.config || this.specialConfig || {};
    const expandTime = Math.max(0.12, spec.expandTime || conf.expandTime || 0.45);
    const maxRadius = Math.max(40, spec.maxRadius || conf.radius || 220);
    const ringWidth = Math.max(10, spec.ringWidth || conf.ringWidth || 26);
    const dps = Math.max(0, conf.damagePerSecond || spec.damagePerSecond || 140);

    const t = Math.min(1, Math.max(0, spec.age / expandTime));
    const radius = maxRadius * t;

    // Damage while the pulse is expanding.
    // Using a filled expanding radius (instead of only a thin band) makes the effect reliable.
    if(spec.age <= expandTime + dt){
      ships.forEach(target=>{
        if(target === this || target.team === this.team || target.hp <= 0) return;
        const dist = Math.hypot(target.x - this.x, target.y - this.y);
        const band = (ringWidth * 0.5) + target.size * 0.35;
        if(dist <= radius + band){
          applyDamage(target, dps * dt, this);
        }
      });
    }

    // Ember particles along the ring edge.
    spec.pulseFxTimer = (spec.pulseFxTimer || 0) - dt;
    if(spec.pulseFxTimer <= 0){
      spec.pulseFxTimer = 0.025;
      const a = Math.random() * Math.PI * 2;
      const px = this.x + Math.cos(a) * radius;
      const py = this.y + Math.sin(a) * radius;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(a) * (40 + Math.random()*90) + (Math.random()-0.5)*25,
        vy: Math.sin(a) * (40 + Math.random()*90) + (Math.random()-0.5)*25,
        life: 0.14 + Math.random()*0.14,
        size: 1.2 + Math.random()*2.0,
        core: [255, 200, 190],
        mid: [255, 70, 60]
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
    const drift = fart.drift || 30;
    const heading = this.angle;
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
      ownerShip: this,
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
      applyDamage(target, beamDps * dt, this);
      turret.beamPulse = Math.min(1, (turret.beamPulse || 0) + dt*2.4);
      turret.targetPos = {x: target.x, y: target.y};
    } else {
      turret.targetPos = null;
    }
  }
  startBoardingPods(spec, opts){
    const options = opts || {};
    const conf = spec.config || this.specialConfig || {};
    const podCount = Math.max(1, Math.round(conf.podCount || 2));
    const enemies = ships.filter(s=> s && s.team !== this.team && s.hp>0 && !s.isWarping());
    if(!enemies.length){
      spec.forceEnd = true;
      return false;
    }
    if(!options.append || !Array.isArray(spec.pods)) spec.pods = [];
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
        indicator: null,
        marines: 0,
        baseMarines: 0,
        killProgress: 0
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
    const marineCount = Math.max(1, Math.round(conf.marineCount || 4));
    const baseKillRate = Math.max(0, conf.defenderKillPerSecond || 0);
    const pods = spec.pods || [];
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const isYuptauri = !!(this.type && this.type.id === 'yuptauri');
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

        // Enemy crew can kill intruders over time. Each pod carries a small marine stack;
        // as marines die, the boarding DPS drops until the party is eliminated.
        if(pod.baseMarines <= 0){
          pod.baseMarines = marineCount;
          pod.marines = marineCount;
          pod.killProgress = 0;
        }
        const sizeFactor = 0.85 + Math.min(1.25, (target.size || 18) / 40);
        const killRate = baseKillRate * sizeFactor;
        if(killRate > 0 && pod.marines > 0){
          pod.killProgress = (pod.killProgress || 0) + killRate * dt;
          while(pod.killProgress >= 1 && pod.marines > 0){
            pod.killProgress -= 1;
            pod.marines -= 1;
            if(isYuptauri){
              playSfx('board_die', 'yuptauri');
            }
          }
          if(pod.marines <= 0){
            this.releaseBoardingPod(pod);
            return;
          }
        }

        const marineMult = (pod.baseMarines > 0) ? (pod.marines / pod.baseMarines) : 1;
        if(target.hp > 0) applyDamage(target, (dps * marineMult) * dt, this);
        if(isYuptauri && dps > 0){
          const intervalMs = 550;
          if(!this._lastBoardingSfxMs || (nowMs - this._lastBoardingSfxMs) >= intervalMs){
            playSfx('board_zap', 'yuptauri');
            this._lastBoardingSfxMs = nowMs;
          }
        }
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

    // Yuptauri boarding: play a sound when the pod latches.
    if(this.type && this.type.id === 'yuptauri'){
      playSfx('board_in', 'yuptauri');
      this._lastBoardingSfxMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    }

    // Initialize marine stacks for killable intruders.
    const marineCount = Math.max(1, Math.round((conf && conf.marineCount) || 4));
    pod.baseMarines = marineCount;
    pod.marines = marineCount;
    pod.killProgress = 0;
  }
  releaseBoardingPod(pod){
    if(!pod) return;
    // Yuptauri boarding: if a pod is lost early while boarding, play a "marine down" cue.
    if(this.type && this.type.id === 'yuptauri'){
      const wasBoarding = (pod.state === 'boarding');
      const endedEarly = (typeof pod.boardTimer === 'number') ? (pod.boardTimer > 0.25) : false;
      if(wasBoarding && endedEarly){
        playSfx('board_die', 'yuptauri');
      }
    }
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
        applyDamage(other, spec.impactDamage, this);
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
  executeMinefield(spec){
    const conf = spec.config || this.specialConfig || {};
    const count = Math.max(1, Math.floor(conf.mineCount || 18));
    const ttl = Math.max(4, conf.mineTtl || 22);
    const radius = Math.max(6, conf.mineRadius || 10);
    const dmg = Math.max(0, conf.mineDamage ?? 16);
    const aoeR = Math.max(radius + 10, conf.mineAoERadius || 70);
    const aoeDmg = Math.max(0, conf.mineAoEDamage ?? 8);

    // Place mines across the full arena.
    const pad = Math.max(18, radius + 6);
    const minX = pad;
    const maxX = (canvas && canvas.width) ? (canvas.width - pad) : (pad + 600);
    const minY = pad;
    const maxY = (canvas && canvas.height) ? (canvas.height - pad) : (pad + 420);
    if(maxX <= minX || maxY <= minY){
      spec.forceEnd = true;
      return false;
    }

    for(let i=0;i<count;i++){
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      bullets.push({
        x,
        y,
        dx: 0,
        dy: 0,
        team: this.team,
        ttl,
        damage: dmg,
        ownerShip: this,
        raceId: this.type.id,
        projectile:{
          style:'mine',
          radius,
          hitRadius: radius,
          mineAoERadius: aoeR,
          mineAoEDamage: aoeDmg,
          core: [255, 235, 190],
          shell: [120, 80, 45]
        },
        seed: Math.random()*Math.PI*2
      });
    }

    spec.duration = 0.12;
    spec.forceEnd = true;
    return true;
  }

  executeLayMine(spec){
    const conf = spec.config || this.specialConfig || {};
    const ttl = Math.max(4, conf.mineTtl || 18);
    const radius = Math.max(6, conf.mineRadius || 10);
    const dmg = Math.max(0, conf.mineDamage ?? 16);
    const aoeR = Math.max(radius + 10, conf.mineAoERadius || 70);
    const aoeDmg = Math.max(0, conf.mineAoEDamage ?? 8);

    const angle = this.angle || 0;
    const dropDist = (this.size || 24) + radius + 8;
    let x = this.x - Math.cos(angle) * dropDist;
    let y = this.y - Math.sin(angle) * dropDist;

    const pad = Math.max(18, radius + 6);
    const maxX = (canvas && canvas.width) ? (canvas.width - pad) : null;
    const maxY = (canvas && canvas.height) ? (canvas.height - pad) : null;
    if(maxX != null){
      x = Math.max(pad, Math.min(maxX, x));
    }
    if(maxY != null){
      y = Math.max(pad, Math.min(maxY, y));
    }

    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const mineBullet = {
      x,
      y,
      dx: 0,
      dy: 0,
      team: this.team,
      ttl,
      damage: dmg,
      ownerShip: this,
      raceId: this.type.id,
      // While the first deploy sound plays, show the arming sprite; then switch to deployed.
      mineArmingUntilMs: nowMs + 1000,
      projectile:{
        style:'mine',
        radius,
        hitRadius: radius,
        mineAoERadius: aoeR,
        mineAoEDamage: aoeDmg,
        core: [255, 235, 190],
        shell: [120, 80, 45]
      },
      seed: Math.random()*Math.PI*2
    };
    bullets.push(mineBullet);

    if(this.type && this.type.id === 'taftian'){
      if(this.control){
        playTaftianMineDeploySequence(()=>{
          const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
          mineBullet.mineArmingUntilMs = t;
        });
      }
    }

    spec.duration = 0.01;
    spec.forceEnd = true;
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
    // Test Dummy: no AI behavior at all (no turning, no thrust, no firing).
    // Also hard-zero velocity so it stays perfectly still.
    if(this.type && this.type.id === 'test_dummy'){
      this.vx = 0;
      this.vy = 0;
      this.thrusting = false;
      return;
    }
    if(this.type && this.type.id === 'horror_boss'){
      this.updateHorrorBossAI(dt);
      return;
    }
    const ai = this.ai || (this.ai = {mode:'approach',timer:0,strafeDir:1,dodgeCooldown:0,dodgeAngle:0});
    let preferRange = this.size*6 + 80;
    const proj = this.projectileConfig || {};
    const leadSpeed = proj.speed || 420;
    const enemies = ships.filter(s=>s.team!==this.team && s.hp>0 && !s.isWarping());
    const hostileFighterCount = countEnemyFighters(this.team);
    if(!enemies.length && hostileFighterCount === 0) return;
    const nowMs = performance.now ? performance.now() : Date.now();
    const forced = (this.forcedTargetRef && this.forcedTargetUntil && nowMs < this.forcedTargetUntil)
      ? this.forcedTargetRef
      : null;
    const forcedValid = !!(forced && forced.hp > 0 && forced.team !== this.team && !forced.isWarping());
    const shipTarget = forcedValid
      ? forced
      : (enemies.length ? enemies.reduce((a,b)=> distance(this,b) < distance(this,a) ? b : a, enemies[0]) : null);
    const fighterTarget = hostileFighterCount ? getNearestEnemyFighter(this.team, this) : null;
    let target = shipTarget;
    if(fighterTarget){
      const fighterDist = Math.hypot(fighterTarget.x - this.x, fighterTarget.y - this.y);
      const shipDist = target ? Math.hypot(target.x - this.x, target.y - this.y) : Infinity;
      const fighterBias = hostileFighterCount >= 3 ? 0.8 : 0.6;
      if(!forcedValid && (!target || fighterDist < shipDist * fighterBias || fighterDist < preferRange * 0.85)){
        target = fighterTarget;
      }
    }
    if(!target) return;
    ai.target = target;
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

    // Obamination: prefer very close range for its lash.
    if(this.type && this.type.id === 'obamination'){
      const lashRange = (proj && proj.style === 'tendrilLash') ? (proj.range || 170) : 170;
      preferRange = Math.max(110, lashRange * 0.78);
    }
    const virtualTarget = targetInvisible ? Object.assign({}, target, {x: anchor.x, y: anchor.y, vx: 0, vy: 0}) : target;
    let aimAngle = computeLeadAngle(this, virtualTarget, leadSpeed) ?? Math.atan2(dy,dx);
    if(targetInvisible) aimAngle += (Math.random()-0.5)*0.35;

    // turn toward aim smoothly (respect turn-rate modifiers like parasites)
    const turnRate = 2.8 * (this.mod ? (this.mod.turnRateMult || 1) : 1); // radians/sec
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
    // Clamp to maxSpeed so movement slows apply consistently for AI too.
    const sp = Math.hypot(this.vx, this.vy);
    if(sp > this.maxSpeed){
      this.vx = (this.vx / sp) * this.maxSpeed;
      this.vy = (this.vy / sp) * this.maxSpeed;
    }
    this.x += this.vx*dt;
    this.y += this.vy*dt;

    // firing logic
    let shotRange = preferRange * 1.4;
    if(proj.style === 'missile'){
      // Missiles are meant to be used at longer standoff ranges.
      const ttl = proj.ttl || 2;
      shotRange = Math.max(shotRange, Math.min(900, ttl * leadSpeed * 0.7));
    } else if(proj.style === 'miniTorpedo'){
      const ttl = proj.ttl || 1.6;
      shotRange = Math.max(shotRange, Math.min(780, ttl * (proj.speed || leadSpeed) * 0.7));
    }
    if(proj.style === 'tendrilLash'){
      shotRange = Math.max(70, (proj.range || preferRange) * 1.05);
    }
    const canSeeTarget = !targetInvisible;
    if(this.specialConfig && !this.activeSpecial && this.canUseSpecial()){
      let shouldUse = false;
      if(this.specialConfig.type === 'waveMotionGun'){
        const specRange = (this.specialConfig.length || 600) * 0.85;
        shouldUse = dist <= specRange;
      } else if(this.specialConfig.type === 'scarletPulse'){
        const specRange = (this.specialConfig.radius || preferRange) * 0.92;
        shouldUse = canSeeTarget && dist <= specRange;
        if(shouldUse && Math.random() < 0.78) shouldUse = false;
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
      } else if(this.specialConfig.type === 'confusionRay'){
        const specRange = (this.specialConfig.range || preferRange) * 0.95;
        shouldUse = canSeeTarget && dist <= specRange;
        if(shouldUse && target && target.confused) shouldUse = false;
        if(shouldUse && Math.random() < 0.88) shouldUse = false;
      } else if(this.specialConfig.type === 'possession'){
        const specRange = (this.specialConfig.range || preferRange) * 0.95;
        const wantHeal = this.hp < this.type.hp * 0.85;
        shouldUse = canSeeTarget && dist <= specRange && (wantHeal || Math.random() < 0.08);
        if(shouldUse && Math.random() < 0.65) shouldUse = false;
      } else if(this.specialConfig.type === 'ambush'){
        const specRange = (this.specialConfig.range || preferRange) * 1.15;
        shouldUse = canSeeTarget && dist <= specRange;
        if(shouldUse && Math.random() < 0.9) shouldUse = false;
      } else if(this.specialConfig.type === 'mapTeleport'){
        const lowHealth = this.hp < this.type.hp * 0.55;
        shouldUse = lowHealth || (dist < preferRange * 0.85 && Math.random() < 0.08);
      } else if(this.specialConfig.type === 'flameTrail'){
        const inClose = dist <= preferRange * 0.9;
        const lowHealth = this.hp < this.type.hp * 0.6;
        shouldUse = inClose || (lowHealth && Math.random() < 0.25);
        if(shouldUse && Math.random() < 0.7) shouldUse = false;
      } else if(this.specialConfig.type === 'parasitePods'){
        // Obamination: try to tag enemy ships with parasites, then rush in to lash.
        const ship = shipTarget;
        const shipOk = !!(ship && ship.hp > 0 && ship.team !== this.team && !(ship.isWarping && ship.isWarping()) && !(ship.isCloaked && ship.isCloaked()));
        const shipDist = shipOk ? Math.hypot(ship.x - this.x, ship.y - this.y) : Infinity;
        const stacks = shipOk && ship.parasites ? ship.parasites.length : 0;
        const desiredStacks = this.specialConfig.aiDesiredStacks ?? 2;
        const specRange = this.specialConfig.aiRange ?? 650;
        shouldUse = canSeeTarget && shipOk && shipDist <= specRange && stacks < desiredStacks;
        if(shouldUse && Math.random() < 0.65) shouldUse = false;
      }
      if(shouldUse){
        this.attemptSpecial();
      }
    }
    this.cool -= dt*1000;

    // Boring Man AI: charge up, then fire one `boringBall` and reset.
    if(this.type && this.type.id === 'boring_man'){
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

      // Cancel charge if we can't engage.
      if(!canSeeTarget || dist > shotRange * 1.15){
        delete this.aiChargeStart;
        delete this.aiChargeTierName;
        return;
      }

      // Start charging when off cooldown and in range.
      if(dist < shotRange && this.cool <= 0){
        if(!this.aiChargeStart){
          this.aiChargeStart = now;
          this.aiChargeTierName = computeChargeLevel(0).name;
          playBoringChargeSound();
        }

        const elapsed = Math.max(0, (now - this.aiChargeStart) / 1000);
        const tier = computeChargeLevel(elapsed);
        if(tier && tier.name && tier.name !== this.aiChargeTierName){
          this.aiChargeTierName = tier.name;
          playBoringChargeSound();
        }

        // Fire when fully charged (red).
        if(elapsed >= getMaxChargeSeconds()){
          spawnBoringBall(this, tier);
          this.cool = this.getFireCooldown(0.9 + Math.random()*0.4);
          delete this.aiChargeStart;
          delete this.aiChargeTierName;
        }
      }
      return;
    }

    if(canSeeTarget && dist < shotRange){
      const proj = this.projectileConfig || {};
      // If this AI has a channeled beam weapon, hold the channel while in range.
      if(proj.style === 'laserBeam'){
        if(!this._aiChanneling){
          this._aiChanneling = true;
          try{ console.log('[AI] start channel', {id: this.spawnTypeId || (this.type && this.type.id), x: this.x, y: this.y}); }catch(e){}
        }
        this.updateLaserBeamChannel(dt);
      } else {
        if(this.cool <= 0 && this.shoot(aimAngle)){
          this.cool = this.getFireCooldown(0.7 + Math.random()*0.6);
        }
      }
    } else {
      // If we were channeling but the target is gone or out of range, stop (no cooldown for channeled beams).
      if(this._aiChanneling){
        this._aiChanneling = false;
        try{ console.log('[AI] stop channel', {id: this.spawnTypeId || (this.type && this.type.id)}); }catch(e){}
        this.stopLaserBeamChannel();
      }
    }
  }

  updateHorrorBossAI(dt){
    const enemies = ships.filter(s=> s.team!==this.team && s.hp>0 && !s.isWarping());
    if(!enemies.length) return;
    const nowMs = (performance.now ? performance.now() : Date.now());

    // Pick a target for a short window so it doesn't jitter,
    // but don't hard-lock to the player: it should menace the whole sector.
    const current = this.horrorTargetRef;
    const currentValid = !!(current && current.hp > 0 && current.team !== this.team && !(current.isWarping && current.isWarping()));
    if(!currentValid || !this.horrorTargetExpire || nowMs >= this.horrorTargetExpire){
      const player = ships.find(s=> s && s.control && s.hp>0 && !s.isWarping());
      let nextTarget = null;
      if(player && enemies.length > 1){
        // Prefer the player, but occasionally switch to the other ally.
        const preferPlayer = Math.random() < 0.65;
        if(preferPlayer){
          nextTarget = player;
        } else {
          const nonPlayer = enemies.filter(s=> s !== player);
          nextTarget = nonPlayer.reduce((a,b)=> distance(this,b) < distance(this,a) ? b : a, nonPlayer[0]);
        }
      } else {
        nextTarget = enemies.reduce((a,b)=> distance(this,b) < distance(this,a) ? b : a, enemies[0]);
      }
      this.horrorTargetRef = nextTarget;
      this.horrorTargetExpire = nowMs + (900 + Math.random()*1100);
    }
    const target = this.horrorTargetRef || enemies[0];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx,dy) || 0.0001;

    // No turning: keep angle fixed, just drift.
    const nx = dx / dist;
    const ny = dy / dist;
    const accel = this.speed * 0.55;
    this.vx += nx * accel * dt;
    this.vy += ny * accel * dt;
    this.markThrust();

    // Clamp speed to keep it ominously slow.
    const maxV = this.maxSpeed * 0.85;
    const sp = Math.hypot(this.vx, this.vy);
    if(sp > maxV){
      this.vx = (this.vx / sp) * maxV;
      this.vy = (this.vy / sp) * maxV;
    }

    // Heavy drift damping.
    this.vx *= 0.988;
    this.vy *= 0.988;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Fire without turning (aim angle only affects projectiles).
    const proj = this.projectileConfig || {};
    const leadSpeed = proj.speed || 420;
    const aimAngle = computeLeadAngle(this, target, leadSpeed) ?? Math.atan2(dy,dx);
    const shotRange = (this.size * 8) + 260;
    this.cool -= dt*1000;
    if(dist < shotRange && this.cool <= 0){
      if(this.shoot(aimAngle)){
        this.cool = this.getFireCooldown(0.9 + Math.random()*0.5);
      }
    }
  }
  processWarp(dt){
    if(!this.warp) return false;
    const warp = this.warp;
    warp.age += dt;
    const progress = Math.min(1, warp.age / warp.duration);

    if(warp.mode === 'blink'){
      // True teleport: invisible during warp, instant relocation midpoint.
      const switchAt = warp.switchAt ?? (warp.duration * 0.5);
      const atTo = warp.age >= switchAt;
      this.x = atTo ? warp.to.x : warp.from.x;
      this.y = atTo ? warp.to.y : warp.from.y;

      if(atTo && !warp.arrivalSpawned){
        warp.arrivalSpawned = true;
        const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : [255,255,255];
        const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [160,200,255];
        for(let i=0;i<18;i++){
          const a = Math.random() * Math.PI*2;
          const sp = 80 + Math.random()*220;
          particles.push({
            x: warp.to.x + Math.cos(a) * (this.size*0.25),
            y: warp.to.y + Math.sin(a) * (this.size*0.25),
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: 0.14 + Math.random()*0.18,
            size: 1.2 + Math.random()*2.2,
            core,
            mid
          });
        }
      }

      if(progress >= 1){
        this.warp = null;
        this.invulnerable = false;
        this.x = warp.to.x;
        this.y = warp.to.y;
        return false;
      }
      return true;
    }

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
    const projectile = this.projectileConfig || {};

    // Anti Shamen crystal shard: only one active channel per ship at a time.
    if(projectile && projectile.channelHold && projectile.style === 'crystalShard'){
      const existing = bullets.find(b=> b && b.ttl > 0 && b.ownerShip === this && b.projectile && b.projectile.style === 'crystalShard' && !b.released);
      if(existing) return false;
    }

    const energyCost = this.energyCost || 8;

    // Obamination tendril lash: short-range hitscan that latches onto the nearest valid enemy ship.
    // Damage is applied on creation; the bullet is only for visuals.
    if(projectile && projectile.style === 'tendrilLash'){
      if(this.energy < energyCost) return false;
      const muzzleOffset = projectile.muzzleOffset || this.size;
      const originX = this.x + Math.cos(angle) * muzzleOffset;
      const originY = this.y + Math.sin(angle) * muzzleOffset;
      const range = Math.max(60, projectile.range || 170);
      const cone = Math.max(0.15, projectile.cone || (Math.PI * 0.9));

      let target = null;
      let bestDist = Infinity;
      if(Array.isArray(ships)){
        ships.forEach(s=>{
          if(!s || s.team === this.team || s.hp <= 0 || (s.isWarping && s.isWarping())) return;
          if(s.isCloaked && s.isCloaked()) return;
          const d = Math.hypot(s.x - originX, s.y - originY);
          if(d > range) return;
          const desired = Math.atan2(s.y - originY, s.x - originX);
          const delta = Math.abs(normalizeAngle(desired - angle));
          if(delta > cone * 0.5) return;
          if(d < bestDist){ bestDist = d; target = s; }
        });
      }
      if(!target) return false;

      this.energy = Math.max(0, this.energy - energyCost);

      const baseDamage = projectile.damage != null ? projectile.damage : 14;
      const damageMult = this.mod ? (this.mod.damageMult || 1) : 1;
      const damage = Math.max(0, baseDamage * damageMult);
      applyDamage(target, damage, this);

      bullets.push({
        x: originX,
        y: originY,
        dx: 0,
        dy: 0,
        team: this.team,
        ttl: projectile.ttl || 0.12,
        damage,
        ownerShip: this,
        raceId: this.type.id,
        projectile,
        endX: target.x,
        endY: target.y,
        targetRef: target,
        seed: Math.random()*Math.PI*2
      });

      this.lastShotAt = performance.now ? performance.now() : Date.now();

      // Firing breaks cloak.
      if(this.activeSpecial && this.activeSpecial.type === 'lunarCloak'){
        this.activeSpecial.forceEnd = true;
        this.endCloak();
        this.activeSpecial = null;
      }

      if(this.control){
        lastShotTime = performance.now();
      }
      const fireRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed') ? 'cabal_deployed' : this.type.id;
      playSfx('fire', fireRaceId);
      return true;
    }

    if(this.energy < energyCost) return false;
    this.energy = Math.max(0, this.energy - energyCost);

    // Hitscan beam weapons.
    if(projectile && (projectile.style === 'laserBeam' || projectile.style === 'laserShot' || projectile.style === 'lightningBolt' || projectile.style === 'shamenLaser')){
      try{ console.log('[shoot] hitscan', {owner: this.spawnTypeId || (this.type && this.type.id), style: projectile.style}); }catch(e){}
      const muzzleOffset = projectile.muzzleOffset || this.size;
      const originX = this.x + Math.cos(angle) * muzzleOffset;
      const originY = this.y + Math.sin(angle) * muzzleOffset;
      const length = Math.max(120, projectile.length || 820);
      let endX = originX + Math.cos(angle) * length;
      let endY = originY + Math.sin(angle) * length;

      let hitShip = null;
      let bestT = Infinity;

      if(projectile.style === 'shamenLaser'){
        // Close-range "Arilou-like" zap: acquire nearest enemy in range,
        // then apply a high hit chance (not guaranteed).
        let nearest = null;
        let nearestDist = length;
        ships.forEach(s=>{
          if(!s || s.team === this.team || s.hp <= 0 || s.isWarping()) return;
          const d = Math.hypot(s.x - originX, s.y - originY);
          if(d < nearestDist){
            nearestDist = d;
            nearest = s;
          }
        });
        if(nearest){
          const desiredAngle = Math.atan2(nearest.y - originY, nearest.x - originX);
          // Draw toward the target (or near it on miss) regardless of ship facing.
          const hitChance = Math.max(0, Math.min(1, projectile.hitChance ?? 0.9));
          const hit = Math.random() < hitChance;
          if(hit){
            hitShip = nearest;
            endX = nearest.x;
            endY = nearest.y;
          } else {
            // Miss: still fire toward the target, but offset so it whiffs.
            const missR = 26 + Math.random()*22;
            const missA = Math.random() * Math.PI * 2;
            endX = nearest.x + Math.cos(missA) * missR;
            endY = nearest.y + Math.sin(missA) * missR;
          }
          // Shorten/extend beam to match range.
          const dd = Math.hypot(endX - originX, endY - originY) || 1;
          const cap = Math.min(length, dd);
          endX = originX + Math.cos(desiredAngle) * cap;
          endY = originY + Math.sin(desiredAngle) * cap;
        }
      } else {
        // Find nearest enemy intersecting the beam segment.
        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);
        ships.forEach(s=>{
          if(!s || s.team === this.team || s.hp <= 0 || s.isWarping()) return;
          const vx = s.x - originX;
          const vy = s.y - originY;
          const t = (vx * dirX + vy * dirY);
          if(t < 0 || t > length) return;
          const cx = originX + dirX * t;
          const cy = originY + dirY * t;
          const dist = Math.hypot(s.x - cx, s.y - cy);
          const r = Math.max(10, (s.size || 18) * 0.85);
          if(dist <= r && t < bestT){
            bestT = t;
            hitShip = s;
          }
        });

        if(hitShip){
          endX = originX + dirX * bestT;
          endY = originY + dirY * bestT;
        }
      }

      const baseDamage = projectile.damage != null ? projectile.damage : 12;
      const damageMult = this.mod ? (this.mod.damageMult || 1) : 1;
      const damage = Math.max(0, baseDamage * damageMult);
      if(hitShip){
        applyDamage(hitShip, damage, this);
      }

      bullets.push({
        x: originX,
        y: originY,
        dx: 0,
        dy: 0,
        team: this.team,
        ttl: projectile.ttl || 0.08,
        damage,
        ownerShip: this,
        raceId: this.type.id,
        projectile,
        endX,
        endY,
        seed: Math.random()*Math.PI*2
      });

      this.lastShotAt = performance.now ? performance.now() : Date.now();

      // Firing breaks cloak.
      if(this.activeSpecial && this.activeSpecial.type === 'lunarCloak'){
        this.activeSpecial.forceEnd = true;
        this.endCloak();
        this.activeSpecial = null;
      }

      if(this.control){
        lastShotTime = performance.now();
        if(this.type && this.type.id === 'obsidian_circuit') {
          playSfx('fire', 'obsidian_circuit');
          return true;
        }
      }
      const fireRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed') ? 'cabal_deployed' : this.type.id;
      playSfx('fire', fireRaceId);
      return true;
    }

    const speed = projectile.speed || 420;

    // Barack: close-range aim assist for the main gun.
    // Improves hit likelihood only when the enemy is close and roughly in front.
    if(this.type && this.type.id === 'barack'){
      try{
        const assistRange = Math.max(80, projectile.closeAimAssistRange || 260);
        const assistCone = Math.max(0.05, projectile.closeAimAssistCone || (Math.PI / 5.5)); // ~33deg
        const maxStrength = Math.max(0, Math.min(1, projectile.closeAimAssistStrength ?? 0.7));

        let target = null;
        let bestDist = Infinity;
        if(Array.isArray(ships)){
          ships.forEach(s=>{
            if(!s || s === this || s.team === this.team || s.hp <= 0 || (s.isWarping && s.isWarping())) return;
            const d = Math.hypot(s.x - this.x, s.y - this.y);
            if(d < bestDist){ bestDist = d; target = s; }
          });
        }

        if(target && bestDist <= assistRange){
          const desired = computeLeadAngle(this, target, speed) ?? Math.atan2(target.y - this.y, target.x - this.x);
          const delta = normalizeAngle(desired - angle);
          if(Math.abs(delta) <= assistCone){
            const t = Math.max(0, Math.min(1, 1 - (bestDist / assistRange)));
            // Scale assist up as distance shrinks.
            angle = angle + delta * (maxStrength * t);
          }
        }
      }catch(e){}
    }

    const ttl = projectile.ttl || 2;
    const muzzleOffset = projectile.muzzleOffset || this.size;
    const baseDamage = projectile.damage != null ? projectile.damage : 12;
    const damageMult = this.mod ? (this.mod.damageMult || 1) : 1;
    const damage = Math.max(0, baseDamage * damageMult);
    const originX = this.x + Math.cos(angle) * muzzleOffset;
    const originY = this.y + Math.sin(angle) * muzzleOffset;
    const baseDx = Math.cos(angle) * speed;
    const baseDy = Math.sin(angle) * speed;

    const spawnBulletAt = (x, y, ang)=>{
      try{ console.log('[spawnBulletAt] owner', this.spawnTypeId || (this.type && this.type.id), 'projStyle', (projectile && projectile.style)); }catch(e){}
      const angUsed = (typeof ang === 'number') ? ang : angle;
      const dx = Math.cos(angUsed) * speed;
      const dy = Math.sin(angUsed) * speed;
      const bullet = {
        x,
        y,
        dx,
        dy,
        team: this.team,
        ttl,
        initialTtl: ttl,
        damage,
        ownerShip: this,
        raceId: this.type.id,
        projectile,
        seed: Math.random()*Math.PI*2
      };
      if(projectile && projectile.style === 'missile'){
        bullet.target = getNearestEnemyShip(this.team, this);
        if(projectile.fireAndForget){
          bullet.lockedTarget = bullet.target || null;
          bullet.lockedTargetSet = true;
        }
        bullet.missileAge = 0;
        bullet.tracking = true; // Start tracking
        bullet.launchX = x;
        bullet.launchY = y;
      }
      if(projectile && projectile.style === 'miniTorpedo'){
        bullet.target = getNearestEnemyShip(this.team, this);
        bullet.tracking = true;
        bullet.torpAge = 0;
      }
      if(projectile && projectile.style === 'acidOrb'){
        bullet.tracking = true;
        bullet.orbAge = 0;
        bullet.target = getNearestEnemyShip(this.team, bullet);
      }
      if(projectile && projectile.style === 'manifoldMissile'){
        bullet.manifoldAge = 0;
        bullet.manifoldStage = 0;
        // Keep the original forward direction stable across sub-missile splits.
        bullet.forwardAngle = angle;
      }
      if(projectile && projectile.channelHold){
        bullet.channelShip = this;
        bullet.released = !this.control;
        bullet.channelFrozen = false;
      }
      bullets.push(bullet);
    };

    if(projectile && projectile.dualShot){
      const sep = Math.max(0, projectile.dualSeparation || 6);
      const px = -Math.sin(angle);
      const py = Math.cos(angle);
      const half = sep * 0.5;
      try{ console.log('[dualShot] owner', this.spawnTypeId || (this.type && this.type.id), 'projStyle', (projectile && projectile.style)); }catch(e){}
      spawnBulletAt(originX + px * half, originY + py * half);
      spawnBulletAt(originX - px * half, originY - py * half);
    } else if(projectile && projectile.scatterCount && projectile.scatterCount > 1){
      const cnt = projectile.scatterCount || 6;
      const spread = projectile.scatterSpread || 0.6;
      for(let i=0;i<cnt;i++){
        const t = cnt === 1 ? 0.5 : (i / (cnt - 1));
        const offset = (t - 0.5) * spread; // -spread/2 .. +spread/2
        // add small random jitter so pellets aren't perfectly even
        const jitter = (Math.random() - 0.5) * Math.min(0.06, spread*0.08);
        const a = angle + offset + jitter;
        spawnBulletAt(originX, originY, a);
      }
    } else {
      spawnBulletAt(originX, originY);
    }
    if(this.type && this.type.projectile && this.type.projectile.recoil){
      const recoil = this.type.projectile.recoil;
      this.vx -= Math.cos(angle) * recoil;
      this.vy -= Math.sin(angle) * recoil;
    }
    this.lastShotAt = performance.now ? performance.now() : Date.now();

    // Firing breaks cloak.
    if(this.activeSpecial && this.activeSpecial.type === 'lunarCloak'){
      this.activeSpecial.forceEnd = true;
      this.endCloak();
      this.activeSpecial = null;
    }

    if(this.control){
      lastShotTime = performance.now();
      // Force Obsidian Circuit to play only its custom fire sound
      if(this.type && this.type.id === 'obsidian_circuit') {
        playSfx('fire', 'obsidian_circuit');
        return true;
      }
    }
    // Criminal uses a looping machinegun clip while Space is held; avoid stacking one-shots.
    if(this.type && this.type.id === 'criminal' && this._criminalFireLoop) return true;
    const fireRaceId = (this.type && this.type.id === 'cabal' && this.doctrine === 'deployed') ? 'cabal_deployed' : this.type.id;
    playSfx('fire', fireRaceId);
    return true;
  }
  getFireCooldown(multiplier=1){
    const baseRate = this.fireRate || 500;
    let rate = baseRate * multiplier;
    const fireMult = this.mod ? (this.mod.fireCooldownMult || 1) : 1;
    rate *= fireMult;
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
      // Blink teleports should fully disappear (no streak traversal).
      if(this.warp && this.warp.mode === 'blink') return;
      this.drawWarpStreak(ctx);
      return;
    }
    if(this.type && this.type.id === 'horror_boss' && activeSecretEvent && activeSecretEvent.type === 'horror' && !activeSecretEvent.bossRevealed){
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

    // Apply jitter when blackgrid hack is active on this ship.
    const shakeX = (this._blackgridShake && this._blackgridShake > 0) ? ((Math.random()-0.5) * this._blackgridShake) : 0;
    const shakeY = (this._blackgridShake && this._blackgridShake > 0) ? ((Math.random()-0.5) * this._blackgridShake) : 0;
    ctx.save();
    ctx.translate(this.x + shakeX, this.y + shakeY);
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const fireWindowMs = 140;
    const wantsFireSprite = !!(this.type && this.type.fireSpriteId && this.lastShotAt && (now - this.lastShotAt) <= fireWindowMs);
    const isCabalDeployed = !!(this.type && this.type.id === 'cabal' && this.doctrine === 'deployed');
    const spriteKey = wantsFireSprite ? this.type.fireSpriteId : (isCabalDeployed ? CABAL_DEPLOYED_SPRITE_KEY : this.type.id);
    const sprite = SHIP_SPRITES[spriteKey];
    if(sprite){
      const lockRot = !!(this.type && this.type.lockSpriteRotation);
      ctx.rotate((lockRot ? 0 : this.angle) + this.spriteAngleOffset);
      const scale = this.spriteScale || (this.size*2 / sprite.height);
      const w = sprite.width * scale;
      const h = sprite.height * scale;
      // If this ship is under ultimatum, outline the whole sprite with a red glow.
      if(this.ultimatum && this.ultimatum.untilMs && now < this.ultimatum.untilMs){
        const mode = this.ultimatum.mode || 'both';
        const intensity = (mode && mode !== 'both') ? 1 : 0.65;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = `rgba(255,40,40,${0.95 * intensity})`;
        ctx.shadowBlur = 18 + (this.size || 20) * 0.55;
        ctx.drawImage(sprite,-w/2,-h/2,w,h);
        ctx.restore();
      }
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
    if(this.type.id === 'cabal'){
      this.drawCabalIonTrails(ctx);
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

    // Draw charging orb when player is holding space (boring men attack)
    if(this.control && this.chargeStart){
      const now = (performance.now && performance.now()) || Date.now();
      const elapsed = Math.max(0, (now - this.chargeStart) / 1000);
      const lvl = computeChargeLevel(elapsed);
      const col = lvl.color || [200,200,200];
      const maxCharge = getMaxChargeSeconds();
      const growthT = Math.max(0, Math.min(1, elapsed / Math.max(0.01, maxCharge)));
      const radius = 10 + (growthT * 28) + (lvl.damage/6);
      const muzzleX = this.x + Math.cos(this.angle) * (this.size + radius + 2);
      const muzzleY = this.y + Math.sin(this.angle) * (this.size + radius + 2);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const grad = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, radius*1.8);
      grad.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.95)`);
      grad.addColorStop(0.45, `rgba(${col[0]},${col[1]},${col[2]},0.45)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(muzzleX, muzzleY, radius, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

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
  // Render compact twin ion streaks for Cabal to emphasize its fighter profile.
  drawCabalIonTrails(ctx){
    if(this.type.id !== 'cabal') return;
    if(this.isCloaked() && !this.control) return;
    const ports = this.getCabalIonPorts();
    if(!ports.length) return;
    const thrustFactor = this.thrusting ? 1 : 0.35;
    const backDirX = -Math.cos(this.angle);
    const backDirY = -Math.sin(this.angle);
    const length = this.size * (0.55 + thrustFactor*0.35);
    const width = Math.max(0.6, this.size * 0.08);
    const time = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ports.forEach((port, idx)=>{
      const pulse = 0.75 + Math.sin(time*0.009 + idx) * 0.2;
      const tipX = port.x + backDirX * length;
      const tipY = port.y + backDirY * length;
      const grad = ctx.createLinearGradient(port.x, port.y, tipX, tipY);
      grad.addColorStop(0, rgba([255,140,140], 0.85 * pulse));
      grad.addColorStop(0.4, rgba([255,60,60], 0.5 * pulse));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = width * (1 - idx*0.1);
      ctx.beginPath();
      ctx.moveTo(port.x, port.y);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      const glow = ctx.createRadialGradient(port.x, port.y, 0, port.x, port.y, width*1.6);
      glow.addColorStop(0, rgba([255,180,160], 0.8 * pulse));
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
  getCabalIonPorts(){
    if(this.type.id !== 'cabal') return [];
    const offsets = [-0.35, 0.35];
    const lateralSpan = this.size * 0.24;
    const rearOffset = this.size * 0.48;
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
      case 'tractionBeam':
        this.drawTractionBeam(ctx, spec);
        break;
      case 'regenBiomass':
      case 'regenPulse':
        this.drawRegenAura(ctx, spec);
        break;
      case 'submissionUltimatum':
        this.drawSubmissionUltimatum(ctx, spec);
        break;
      case 'scarletPulse':
        this.drawScarletPulse(ctx, spec);
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
      case 'confusionRay':
        this.drawConfusionRay(ctx, spec);
        break;
      case 'possession':
        this.drawPossessionRay(ctx, spec);
        break;
      default:
        break;
    }
  }

  drawTractionBeam(ctx, spec){
    const sx = this.x;
    const sy = this.y;
    const ex = spec.endX ?? (spec.target ? spec.target.x : this.x);
    const ey = spec.endY ?? (spec.target ? spec.target.y : this.y);
    const t = Math.min(1, Math.max(0, (spec.age / (spec.duration || 1.2))));
    const fade = 1 - t;
    const pulse = 0.85 + Math.sin((spec.seed || 0) + spec.age * 38) * 0.2;
    const width = 7.5 * pulse;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85 * fade;

    ctx.strokeStyle = 'rgba(80,255,140,0.35)';
    ctx.lineWidth = width * 3.1;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(170,255,190,0.75)';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.restore();
  }

  drawRegenAura(ctx, spec){
    const t = Math.min(1, Math.max(0, (spec.age / (spec.duration || 2.8))));
    const fade = 1 - t;
    const pulse = 0.8 + Math.sin((spec.seed || 0) + spec.age*9) * 0.2;
    const r = (this.size || 20) * (1.05 + pulse*0.25);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55 * fade;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r*1.4);
    g.addColorStop(0, 'rgba(180,255,210,0.65)');
    g.addColorStop(0.55, 'rgba(90,220,150,0.25)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r*1.2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  drawSubmissionUltimatum(ctx, spec){
    const target = spec.target;
    if(!target) return;
    const pulse = 0.85 + Math.sin((spec.seed || 0) + spec.age*6.5) * 0.15;
    const ult = target.ultimatum;
    const intensity = (ult && ult.mode && ult.mode !== 'both') ? 1 : 0.7;
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const t = nowMs * 0.001;
    const sx = this.x;
    const sy = this.y;
    const ex = target.x;
    const ey = target.y;
    const dx = ex - sx;
    const dy = ey - sy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    // Build a jagged lightning polyline.
    const segs = Math.max(7, Math.min(16, Math.floor(len / 55)));
    const amp = (6 + intensity * 10) * (0.9 + 0.2 * Math.sin(t * 4 + (spec.seed || 0)));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const drawBolt = (strokeStyle, lineWidth, alpha)=>{
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      for(let i=1;i<segs;i++){
        const p = i / segs;
        const wob = Math.sin((spec.seed || 0) + t * (10.5 + intensity*4) + i * 2.3) * amp;
        const bx = sx + dx * p + px * wob;
        const by = sy + dy * p + py * wob;
        ctx.lineTo(bx, by);
      }
      ctx.lineTo(ex, ey);
      ctx.stroke();
    };

    const baseW = Math.max(2.2, this.size*0.12);
    drawBolt('rgba(120,220,255,0.35)', baseW * 3.1, 0.55 * intensity);
    drawBolt('rgba(235,250,255,0.9)', baseW * 1.15, 0.85 * intensity);
    drawBolt('rgba(255,210,240,0.55)', baseW * 0.75, 0.65 * intensity);

    // Target ring hint.
    ctx.globalAlpha = 0.75 * intensity;
    ctx.strokeStyle = 'rgba(255,80,80,0.65)';
    ctx.lineWidth = Math.max(2, target.size*0.12);
    ctx.beginPath();
    ctx.arc(target.x, target.y, (target.size || 20) * (1.22 + pulse*0.25), 0, Math.PI*2);
    ctx.stroke();

    ctx.restore();
  }

  updatePossession(spec, dt){
    const target = spec.target;
    if(target && target.hp > 0 && !(target.isWarping && target.isWarping())){
      spec.endX = target.x;
      spec.endY = target.y;
    }
    spec.fxTimer = (spec.fxTimer || 0) - dt;
    if(spec.fxTimer <= 0){
      spec.fxTimer = 0.025;
      const sx = spec.startX ?? this.x;
      const sy = spec.startY ?? this.y;
      const ex = spec.endX ?? this.x;
      const ey = spec.endY ?? this.y;
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      // "Ejected crew" motes flying back into the Deathousemen.
      const t = 0.2 + Math.random()*0.75;
      const px = sx + dx * t;
      const py = sy + dy * t;
      particles.push({
        x: px,
        y: py,
        vx: -ux * (160 + Math.random()*220) + (Math.random()-0.5)*30,
        vy: -uy * (160 + Math.random()*220) + (Math.random()-0.5)*30,
        life: 0.12 + Math.random()*0.14,
        size: 0.9 + Math.random()*1.6,
        core: (this.trailColors && this.trailColors.core) ? this.trailColors.core : [200,255,220],
        mid: (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [120,210,160]
      });
    }
  }

  drawPossessionRay(ctx, spec){
    const sx = spec.startX ?? this.x;
    const sy = spec.startY ?? this.y;
    const ex = spec.endX ?? this.x;
    const ey = spec.endY ?? this.y;
    const dx = ex - sx;
    const dy = ey - sy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    const t = Math.min(1, Math.max(0, (spec.age / (spec.duration || 0.35))));
    const fade = 1 - t;
    const pulse = 0.85 + Math.sin((spec.seed || 0) + spec.age * 36) * 0.2;
    const width = 10 * pulse;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85 * fade;

    const core = (this.trailColors && this.trailColors.core) ? this.trailColors.core : [200,255,220];
    const mid = (this.trailColors && this.trailColors.mid) ? this.trailColors.mid : [120,210,160];

    // Outer haze.
    ctx.strokeStyle = rgba(mid, 0.35);
    ctx.lineWidth = width * 3.4;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Inner siphon spine with jitter.
    const j = 3.2 * pulse;
    const jx = px * (Math.sin(spec.age * 52 + 0.7) * j);
    const jy = py * (Math.cos(spec.age * 57 + 1.1) * j);
    ctx.strokeStyle = rgba(core, 0.9);
    ctx.lineWidth = width * 1.25;
    ctx.beginPath();
    ctx.moveTo(sx + jx, sy + jy);
    ctx.lineTo(ex - jx, ey - jy);
    ctx.stroke();

    // Impact flare.
    ctx.fillStyle = rgba(core, 0.9);
    ctx.beginPath();
    ctx.arc(ex, ey, width * 0.9, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  drawConfusionRay(ctx, spec){
    const sx = spec.startX ?? this.x;
    const sy = spec.startY ?? this.y;
    const ex = spec.endX ?? (this.x + Math.cos(this.angle) * 520);
    const ey = spec.endY ?? (this.y + Math.sin(this.angle) * 520);
    const dx = ex - sx;
    const dy = ey - sy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    const t = Math.min(1, Math.max(0, (spec.age / (spec.duration || 0.28))));
    const fade = 1 - t;
    const pulse = 0.85 + Math.sin(spec.age * 32) * 0.18;
    const w = (spec.config && spec.config.width) || 10;
    const width = w * pulse;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85 * fade;

    // Outer haze ribbon.
    ctx.strokeStyle = 'rgba(120,180,255,0.35)';
    ctx.lineWidth = width * 3.2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Core beam with subtle jitter.
    const j = 3.5 * pulse;
    const jx = px * (Math.sin(spec.age * 48 + 0.7) * j);
    const jy = py * (Math.cos(spec.age * 52 + 1.1) * j);
    ctx.strokeStyle = 'rgba(220,140,255,0.85)';
    ctx.lineWidth = width * 1.25;
    ctx.beginPath();
    ctx.moveTo(sx + jx, sy + jy);
    ctx.lineTo(ex - jx, ey - jy);
    ctx.stroke();

    // Impact sparkle.
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(ex, ey, width * 0.9, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    // A couple of quick spiral particles near impact.
    if(Math.random() < 0.35){
      const r = 10 + Math.random()*18;
      const a = (spec.age * 10) + Math.random()*Math.PI*2;
      particles.push({
        x: ex + Math.cos(a) * r,
        y: ey + Math.sin(a) * r,
        vx: px * (Math.random()-0.5)*80 + ux*10,
        vy: py * (Math.random()-0.5)*80 + uy*10,
        life: 0.18 + Math.random()*0.18,
        size: 1.1 + Math.random()*1.6,
        core: [240, 160, 255],
        mid: [140, 200, 255]
      });
    }
  }

  drawScarletPulse(ctx, spec){
    const conf = spec.config || this.specialConfig || {};
    const expandTime = Math.max(0.12, spec.expandTime || conf.expandTime || 0.45);
    const maxRadius = Math.max(40, spec.maxRadius || conf.radius || 220);
    const ringWidth = Math.max(10, spec.ringWidth || conf.ringWidth || 26);

    const t = Math.min(1, Math.max(0, spec.age / expandTime));
    const radius = maxRadius * t;
    const remaining = Math.max(0, (spec.duration || (expandTime + 0.18)) - spec.age);
    const fade = remaining <= 0.18 ? (remaining / 0.18) : 1;
    const pulse = 0.92 + Math.sin(spec.age * 18) * 0.12;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha *= 0.9 * fade;

    // Outer glow.
    ctx.strokeStyle = 'rgba(255,60,60,0.22)';
    ctx.lineWidth = ringWidth * 2.6 * pulse;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
    ctx.stroke();

    // Core ring.
    ctx.strokeStyle = 'rgba(255,120,110,0.75)';
    ctx.lineWidth = ringWidth * 1.05 * pulse;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
    ctx.stroke();

    // Hot inner edge.
    ctx.strokeStyle = 'rgba(255,220,210,0.85)';
    ctx.lineWidth = Math.max(2, ringWidth * 0.22);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
    ctx.stroke();

    ctx.restore();
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
    if(this.type.id === 'criminal'){
      this.emitCriminalBling();
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
  // Emit dollar-sign "bling" particles unique to the Criminal prototype.
  emitCriminalBling(){
    if(this.type.id !== 'criminal') return;
    const backDirX = -Math.cos(this.angle);
    const backDirY = -Math.sin(this.angle);
    const sideDirX = Math.cos(this.angle + Math.PI/2);
    const sideDirY = Math.sin(this.angle + Math.PI/2);
    const rearOffset = this.size * 0.65;
    const lateralSpan = this.size * 0.35;
    const jets = [-0.7, -0.25, 0.25, 0.7];
    jets.forEach(mult=>{
      const px = this.x + backDirX * rearOffset + sideDirX * lateralSpan * mult;
      const py = this.y + backDirY * rearOffset + sideDirY * lateralSpan * mult;
      particles.push({
        x: px + (Math.random()-0.5)*2,
        y: py + (Math.random()-0.5)*2,
        vx: backDirX*(120+Math.random()*70) + (Math.random()-0.5)*24,
        vy: backDirY*(120+Math.random()*70) + (Math.random()-0.5)*24,
        life: 0.5 + Math.random()*0.4,
        size: 1.2 + Math.random()*0.6,
        sizeDecay: 0.94,
        core: [255,245,200],
        mid: [255,210,90],
        bling: true,
        spin: Math.random()*Math.PI*2,
        spinRate: (Math.random()-0.5)*2.6,
        blingScale: 11 + Math.random()*4
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

function distPointToSegment(px, py, ax, ay, bx, by){
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx*abx + aby*aby;
  if(abLenSq <= 1e-6) return Math.hypot(px - ax, py - ay);
  let t = (apx*abx + apy*aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return Math.hypot(px - cx, py - cy);
}

function hasClearLineOfSight(ax, ay, bx, by, extraRadius=0){
  if(!planets || !planets.length) return true;
  const pad = Math.max(0, extraRadius || 0);
  for(let i=0;i<planets.length;i++){
    const p = planets[i];
    if(!p) continue;
    const r = (p.r || 0) + pad;
    if(r <= 0) continue;
    const d = distPointToSegment(p.x, p.y, ax, ay, bx, by);
    if(d < r) return false;
  }
  return true;
}

function findTractionBeamTarget(caster, range, coneRadians, requireLos=true, ignoreCone=false){
  // Treat range <= 0 as "no range" (unlimited) for traction beam.
  const effectiveRange = (range == null || range <= 0) ? 1e9 : range;
  const cone = Math.max(0.05, coneRadians || 0.45);
  const dirX = Math.cos(caster.angle || 0);
  const dirY = Math.sin(caster.angle || 0);
  const pad = (caster && caster.size ? caster.size*0.25 : 8);
  let best = null;
  let bestDist = Infinity;
  ships.forEach(s=>{
    if(!s || s.team === caster.team || s.hp <= 0 || s.isWarping()) return;
    const dx = s.x - caster.x;
    const dy = s.y - caster.y;
    const dist = Math.hypot(dx, dy);
    if(dist > effectiveRange) return;
    if(!ignoreCone){
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      const dot = nx * dirX + ny * dirY;
      const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
      if(theta > cone) return;
    }
    if(requireLos && !hasClearLineOfSight(caster.x, caster.y, s.x, s.y, pad)) return;
    if(dist < bestDist){
      bestDist = dist;
      best = s;
    }
  });
  return best;
}

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

  // Horror mode: always focus only on the player ship (ignore enemy/boss).
  if(activeSecretEvent && activeSecretEvent.type === 'horror'){
    const player = ships.find(s=> s && s.control && s.hp > 0);
    if(player){
      cameraState.x = lerp(cameraState.x, player.x, CAMERA_CONFIG.lerp);
      cameraState.y = lerp(cameraState.y, player.y, CAMERA_CONFIG.lerp);
      cameraState.scale = lerp(cameraState.scale, 1, CAMERA_CONFIG.lerp);
      return {...cameraState};
    }
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
        applyDamage(ship, dps * dt, cloud.ownerShip || null);
      }
    });
  });
  fartClouds = fartClouds.filter(cloud=> !cloud.dead);
}

function updatePlasmaClouds(dt){
  if(!plasmaClouds.length) return;
  plasmaClouds.forEach(cloud=>{
    if(cloud.dead) return;
    cloud.age += dt;
    if(cloud.age >= (cloud.duration || 1)){
      cloud.dead = true;
      return;
    }
    cloud.x += (cloud.vx || 0) * dt;
    cloud.y += (cloud.vy || 0) * dt;
    cloud.vx *= cloud.driftDecay || 0.99;
    cloud.vy *= cloud.driftDecay || 0.99;

    const expandTime = Math.max(0.01, cloud.expandTime || 0.2);
    const t = Math.min(1, cloud.age / expandTime);
    const targetRadius = lerp(cloud.baseRadius || cloud.radius || 24, cloud.maxRadius || 70, t);
    const pulse = 1 + Math.sin((cloud.age + (cloud.noiseSeed || 0))*4.2) * 0.1;
    cloud.currentRadius = targetRadius;
    cloud.displayRadius = targetRadius * pulse;

    const dps = cloud.damagePerSecond || 40;
    ships.forEach(ship=>{
      if(ship.team === cloud.team || ship.hp <= 0 || ship.isWarping()) return;
      const dist = Math.hypot(ship.x - cloud.x, ship.y - cloud.y);
      if(dist <= targetRadius){
        applyDamage(ship, dps * dt, cloud.ownerShip || null);
      }
    });
  });
  plasmaClouds = plasmaClouds.filter(cloud=> !cloud.dead);
}

function deployCombatOutpost(owner, conf){
  if(!owner) return false;
  // Up to N active outposts per owner.
  const maxPerOwner = Math.max(1, conf.maxOutposts || 3);
  const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  if(outposts && outposts.length){
    const owned = outposts.filter(o=> o && o.ownerShip === owner && !o.dead);
    if(owned.length >= maxPerOwner){
      // Remove the oldest one to make room.
      owned.sort((a,b)=> (a.createdAtMs || 0) - (b.createdAtMs || 0));
      const oldest = owned[0];
      outposts = outposts.filter(o=> o !== oldest);
    }
  }
  const hp = Math.max(10, conf.hp || 80);
  const orbit = Math.max(0, conf.spawnOffset || (owner.size * 1.4));
  const angle = owner.angle + (Math.random()-0.5) * 0.5;
  const x = owner.x + Math.cos(angle) * orbit;
  const y = owner.y + Math.sin(angle) * orbit;
  const spriteKey = (owner.type && owner.type.id === 'khanite') ? 'khanite_outpost' : null;
  if(spriteKey){
    ensureOutpostSpriteLoaded(spriteKey, KHANITE_OUTPOST_SPRITE_SRC);
  }
  outposts.push({
    x,
    y,
    team: owner.team,
    ownerShip: owner,
    hp,
    maxHp: hp,
    // Permanent until destroyed.
    range: Math.max(260, conf.range || 820),
    fireInterval: Math.max(0.18, conf.fireInterval || 0.32),
    bulletSpeed: Math.max(200, conf.bulletSpeed || 520),
    bulletDamage: Math.max(1, conf.bulletDamage || 7),
    cool: 0,
    seed: Math.random()*Math.PI*2,
    angle: owner.angle || 0,
    spriteKey,
    spriteAngleOffset: conf.spriteAngleOffset ?? -Math.PI/2,
    spriteScale: conf.spriteScale || 0,
    createdAtMs: nowMs
  });
  return true;
}

function updateOutposts(dt){
  if(!outposts.length) return;
  outposts.forEach(o=>{
    if(!o || o.dead) return;
    if(o.hp <= 0){
      o.dead = true;
      return;
    }
    o.cool -= dt;
    if(o.cool > 0) return;

    const enemies = ships.filter(s=> s && s.hp > 0 && s.team !== o.team && !s.isWarping());
    if(!enemies.length) return;
    const target = enemies.reduce((best, candidate)=>{
      if(!best) return candidate;
      const db = Math.hypot((best.x - o.x), (best.y - o.y));
      const dc = Math.hypot((candidate.x - o.x), (candidate.y - o.y));
      return dc < db ? candidate : best;
    }, null);
    if(!target) return;
    const vx = target.x - o.x;
    const vy = target.y - o.y;
    const dist = Math.hypot(vx, vy) || 1;
    if(o.range && dist > o.range) return;
    const dx = vx / dist;
    const dy = vy / dist;
    o.angle = Math.atan2(dy, dx);
    bullets.push({
      x: o.x + dx * 12,
      y: o.y + dy * 12,
      dx: dx * o.bulletSpeed,
      dy: dy * o.bulletSpeed,
      ttl: 1.7,
      team: o.team,
      damage: o.bulletDamage,
      ownerShip: o.ownerShip || null,
      projectile: { style:'plasmaBolt', radius:3, hitRadius:6, core:[255,120,120], mid:[200,40,40], tail:[80,0,0] }
    });
    o.cool = o.fireInterval;
  });
  outposts = outposts.filter(o=> o && !o.dead);
}

function drawOutposts(ctx){
  if(!outposts.length) return;
  outposts.forEach(o=>{
    const r = 14;
    const pulse = 0.85 + Math.sin((o.seed || 0) + (performance.now ? performance.now()*0.006 : Date.now()*0.006)) * 0.15;

    // If we have a sprite for this outpost, draw it rotated to face its current angle.
    const sprite = o.spriteKey ? OUTPOST_SPRITES[o.spriteKey] : null;
    if(sprite && sprite.width && sprite.height){
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate((o.angle || 0) + (o.spriteAngleOffset || 0));
      // Scale: allow explicit override; otherwise fit sprite to roughly r*2.4.
      let scale = o.spriteScale;
      if(!scale){
        // Make the outpost sprite substantially larger for readability.
        const targetH = r * 5.0;
        scale = targetH / Math.max(1, sprite.height);
      }
      const w = sprite.width * scale;
      const h = sprite.height * scale;
      ctx.globalAlpha = 0.95;
      ctx.drawImage(sprite, -w/2, -h/2, w, h);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgba(255,120,120,0.18)';
    ctx.beginPath();
    ctx.arc(o.x, o.y, r*2.1*pulse, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.beginPath();
    ctx.arc(o.x, o.y, r*0.9, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,60,60,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(o.x, o.y, r, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawPlasmaClouds(ctx){
  if(!plasmaClouds.length) return;
  plasmaClouds.forEach(cloud=>{
    if(!cloud || cloud.dead) return;
    const radius = Math.max(6, cloud.displayRadius || cloud.currentRadius || cloud.baseRadius || 0);
    if(radius <= 0) return;
    const lifetime = Math.max(0.0001, cloud.duration || 1);
    const remaining = Math.max(0, 1 - cloud.age / lifetime);
    const alpha = (cloud.opacity || 0.65) * remaining;
    if(alpha <= 0.02) return;

    const colors = cloud.colors || {};
    const core = colors.core || [255, 180, 60];
    const mid = colors.mid || [255, 120, 20];
    const outer = colors.outer || [120, 60, 10];
    const seed = cloud.noiseSeed ?? cloud.textureSeed ?? 0;
    const tilt = 0.85 + Math.sin(seed + cloud.age * 3.25) * 0.12;
    const swirl = (seed * 0.37 + cloud.age * 0.18) % (Math.PI * 2);

    ctx.save();
    ctx.translate(cloud.x, cloud.y);
    ctx.rotate(swirl);
    ctx.globalCompositeOperation = 'lighter';

    // Soft outer haze.
    ctx.globalAlpha = alpha * 0.75;
    const haze = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius * 1.6);
    haze.addColorStop(0, rgba(core, 0.35));
    haze.addColorStop(0.55, rgba(mid, 0.12));
    haze.addColorStop(1, rgba(outer, 0));
    ctx.fillStyle = haze;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.35, radius * tilt * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hot core.
    ctx.globalAlpha = alpha * 0.95;
    const hot = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.65);
    hot.addColorStop(0, rgba(core, 0.55));
    hot.addColorStop(0.55, rgba(mid, 0.22));
    hot.addColorStop(1, rgba(outer, 0));
    ctx.fillStyle = hot;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
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
    ownerShip: fighter.parent || null,
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

function applyDamage(ship, amount, attacker){
  if(ship.hp <= 0 || amount <= 0) return;
  if(ship.invulnerable) return;
  let finalAmount = amount;
  if(ship.mod && typeof ship.mod.damageTakenMult === 'number'){
    finalAmount *= ship.mod.damageTakenMult;
  }
  const spec = ship.activeSpecial;
  if(spec && spec.type === 'humperDash'){
    if(spec.invulnerableDuringDash) return;
    if(spec.damageReduction){
      const clamp = Math.max(0, Math.min(0.99, spec.damageReduction));
      finalAmount *= (1 - clamp);
    }
  }
  if(finalAmount <= 0) return;
  if(attacker) ship.lastDamagedBy = attacker;
  ship.lastDamagedAt = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

  // If this ship has attached parasites, incoming hits can destroy them.
  if(ship.parasites && ship.parasites.length){
    const dmg = Math.max(0, finalAmount);
    let remaining = dmg * 0.6;
    for(let i=0;i<ship.parasites.length && remaining>0;i++){
      const p = ship.parasites[i];
      if(!p || p.hp == null) continue;
      const take = Math.min(p.hp, remaining);
      p.hp -= take;
      remaining -= take;
    }
    ship.parasites = ship.parasites.filter(p=> p && (p.hp == null || p.hp > 0));
  }

  // Lifehousemen pulse shuts off on significant hits.
  if(ship.activeSpecial && ship.activeSpecial.type === 'regenPulse'){
    const conf = ship.activeSpecial.config || ship.specialConfig || {};
    const thresh = Math.max(1, conf.breakOnDamage || (ship.type && ship.type.hp ? ship.type.hp * 0.06 : 10));
    if(finalAmount >= thresh){
      ship.activeSpecial.forceEnd = true;
    }
  }
  ship.hp = Math.max(0, ship.hp - finalAmount);
  if(ship.hp === 0 && !ship._playedDeath){
    ship._playedDeath = true;
    if(ship.loopingSfx){
      stopLoopingSfx(ship.loopingSfx, 'laser');
      stopLoopingSfx(ship.loopingSfx, 'tractor');
      stopLoopingSfx(ship.loopingSfx, 'burner');
      stopLoopingSfx(ship.loopingSfx, 'criminal_fire');
    }
    spawnExplosion(ship);
    playShipDeath();
    if(ship.control) triggerAvatarStatic();

    // Practice dummy battles: respawn instead of ending the match.
    // We schedule a blink-respawn immediately so the victory logic never triggers.
    if(isDummyPracticeBattle()){
      try{
        schedulePracticeRespawn(ship);
      }catch(e){}
    }

    // Deathousemen: 50/50 reincarnation. If it triggers, the ship disappears
    // briefly and then re-forms, focusing the ship that killed it.
    if(ship.type && ship.type.id === 'deathousemen' && !ship.deathousemenReincarnationRolled){
      ship.deathousemenReincarnationRolled = true;
      const killer = (attacker && attacker.hp > 0 && attacker.team !== ship.team) ? attacker : null;
      const success = Math.random() < 0.5;
      if(success){
        const duration = 1.05;
        ship._reincarnating = {
          timer: duration,
          reviveHp: ship.type.hp,
          killerRef: killer
        };
        ship.hp = 1;
        ship.energy = ship.maxEnergy;
        ship.vx = 0;
        ship.vy = 0;
        ship.warp = {
          from:{x: ship.x, y: ship.y},
          to:{x: ship.x, y: ship.y},
          age:0,
          duration,
          angle: 0,
          mode: 'blink',
          switchAt: null,
          arrivalSpawned: false
        };
        ship.invulnerable = true;
      }
    }
  }
}

function updateDeathousemenReincarnation(dt){
  if(!ships || !ships.length) return;
  const nowMs = (performance.now ? performance.now() : Date.now());
  ships.forEach(s=>{
    if(!s || !s._reincarnating) return;
    s._reincarnating.timer -= dt;
    if(s._reincarnating.timer > 0) return;

    const killer = s._reincarnating.killerRef;
    s.hp = Math.max(1, s._reincarnating.reviveHp || (s.type ? s.type.hp : 1));
    s.energy = s.maxEnergy;
    s._playedDeath = false;
    s._reincarnating = null;
    if(s.ai){
      s.forcedTargetRef = killer;
      s.forcedTargetUntil = nowMs + 9000;
      s.ai.mode = 'approach';
      s.ai.timer = 0;
    }
  });
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
  plasmaClouds = [];
  outposts = [];
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
  if(multiplayerMatch.active){
    enemy.ai = null;
    enemy.remoteControl = enemy.remoteControl || { state: multiplayerMatch.remoteInputs, prevSpace: false };
    enemy.remoteControl.state = multiplayerMatch.remoteInputs;
  } else {
    enemy.remoteControl = null;
  }
  ships.push(enemy);

  // Practice: when the selected enemy is the test dummy (local-only), disable victory and respawn.
  practiceDummyBattleActive = !!(!multiplayerMatch.active && selectionB && selectionB.id === 'test_dummy' && selectionA && selectionA.id !== 'test_dummy');

  initializeSecretEventsForBattle();
}

function changeSector(dx,dy,player){
  const nowMs = (performance.now ? performance.now() : Date.now());
  const horrorActive = !!(activeSecretEvent && activeSecretEvent.type === 'horror');

  // Carry daemon orbs across sectors (otherwise they get wiped with bullets).
  const carriedDaemonOrbs = (Array.isArray(bullets) ? bullets : [])
    .filter(b=> b && b.ttl > 0 && b.projectile && b.projectile.style === 'daemonOrb' && b.ownerShip && b.ownerShip.hp > 0)
    .map(b=>{
      const remainingCooldownMs = (typeof b.daemonNextHitMs === 'number') ? Math.max(0, b.daemonNextHitMs - nowMs) : 0;
      return {
        ownerShip: b.ownerShip,
        team: b.team,
        damage: b.damage,
        drainEnergy: b.drainEnergy,
        hp: (typeof b.hp === 'number') ? b.hp : undefined,
        maxHp: (typeof b.maxHp === 'number') ? b.maxHp : undefined,
        ttl: b.ttl,
        projectile: b.projectile,
        seed: b.seed,
        remainingCooldownMs
      };
    });

  const fromSectorKey = `${currentSector.sx},${currentSector.sy}`;

  // Horror mode: prevent rapid chain-sectoring if you are moving fast.
  if(horrorActive){
    const minGapMs = 900;
    const last = activeSecretEvent.lastSectorChangeAt || 0;
    if(last && (nowMs - last) < minGapMs){
      // Nudge the player back inside so we don't immediately re-trigger.
      if(player){
        if(dx > 0) player.x = canvas.width - SECTOR_ENTRY_OFFSET_X;
        else if(dx < 0) player.x = SECTOR_ENTRY_OFFSET_X;
        if(dy > 0) player.y = canvas.height - SECTOR_ENTRY_OFFSET_Y;
        else if(dy < 0) player.y = SECTOR_ENTRY_OFFSET_Y;
        player.vx *= 0.15;
        player.vy *= 0.15;
      }
      return;
    }
    activeSecretEvent.lastSectorChangeAt = nowMs;
  }

  // In horror mode, the boss stays behind in the old sector and follows later.
  if(horrorActive){
    const boss = ships.find(s=> s && s.type && s.type.id === 'horror_boss');
    if(boss){
      ships = ships.filter(s=> s !== boss);
      activeSecretEvent.stashedBoss = boss;
      activeSecretEvent.bossSectorKey = fromSectorKey;
      activeSecretEvent.bossRevealed = false;
      activeSecretEvent.proximity = null;
      activeSecretEvent.intensity = 0;
      activeSecretEvent.staticBurstUntil = nowMs + 700;
      // Catch up after a short delay (feels like it's travelling sectors).
      activeSecretEvent.bossCatchUpAt = nowMs + (1800 + Math.random()*2600);
    }
  }

  // move to new sector
  syncSectorClouds(currentSector.sx, currentSector.sy, fartClouds);

  // Horror mode: you don't go back. If a sector was visited, skip ahead to a fresh one.
  let nextSx = currentSector.sx + dx;
  let nextSy = currentSector.sy + dy;
  if(horrorActive){
    const visited = activeSecretEvent.visitedSectors || (activeSecretEvent.visitedSectors = new Set());
    visited.add(`${currentSector.sx},${currentSector.sy}`);
    let guard = 0;
    while(visited.has(`${nextSx},${nextSy}`) && guard < 10){
      nextSx += dx;
      nextSy += dy;
      guard++;
    }
    // If direction is weird (dx/dy both 0), still force a new sector.
    if(dx === 0 && dy === 0){
      nextSx = currentSector.sx + (Math.random()<0.5 ? -1 : 1);
      nextSy = currentSector.sy + (Math.random()<0.5 ? -1 : 1);
    }
    visited.add(`${nextSx},${nextSy}`);
  }

  currentSector.sx = nextSx;
  currentSector.sy = nextSy;
  const existingClouds = getCloudsForSector(currentSector.sx, currentSector.sy);
  if(existingClouds){
    fartClouds = existingClouds;
  } else {
    fartClouds = [];
    syncSectorClouds(currentSector.sx, currentSector.sy, fartClouds);
  }
  plasmaClouds = [];
  // Outposts persist across sectors.
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

  // Respawn carried daemon orbs near their owners.
  if(carriedDaemonOrbs && carriedDaemonOrbs.length){
    carriedDaemonOrbs.forEach(o=>{
      const owner = o.ownerShip;
      if(!owner || owner.hp <= 0) return;
      // Owner might have been removed; only restore if still present.
      if(!ships.includes(owner)) return;

      const proj = o.projectile || {};
      const speed = Math.max(60, proj.speed || 170);
      const ttl = Math.max(0.1, o.ttl || 0.1);
      const a = (owner.angle || 0) + (Math.random() - 0.5) * 1.2;
      const spawnDist = (owner.size || 20) * 0.9 + 20;
      const x = owner.x + Math.cos(a) * spawnDist;
      const y = owner.y + Math.sin(a) * spawnDist;
      const bullet = {
        x,
        y,
        dx: Math.cos(a) * speed,
        dy: Math.sin(a) * speed,
        ttl,
        initialTtl: ttl,
        team: o.team,
        damage: o.damage,
        drainEnergy: o.drainEnergy,
        hp: (typeof o.hp === 'number') ? o.hp : undefined,
        maxHp: (typeof o.maxHp === 'number') ? o.maxHp : undefined,
        ownerShip: owner,
        raceId: (owner.type && owner.type.id) ? owner.type.id : null,
        projectile: proj,
        tracking: true,
        daemonAge: 0,
        target: getNearestEnemyShip(o.team, {x, y}),
        seed: (typeof o.seed === 'number') ? o.seed : (Math.random()*Math.PI*2)
      };
      if(o.remainingCooldownMs > 0){
        bullet.daemonNextHitMs = nowMs + o.remainingCooldownMs;
      }
      bullets.push(bullet);
    });
  }
}

const wiredButtons = [startBtn, menuStartBtn].filter(Boolean);
wiredButtons.forEach(btn=>{
  btn.addEventListener('click', handleStartClick);
});
const wiredResetButtons = [resetBtn, menuResetBtn].filter(Boolean);
wiredResetButtons.forEach(btn=>{
  btn.addEventListener('click', handleResetClick);
});
if(menuMultiplayerBtn){
  menuMultiplayerBtn.addEventListener('click', ()=>{
    playUiClick();
    showMultiplayerOverlay({fromMenu:true});
  });
}
if(profileCloseBtn){
  profileCloseBtn.addEventListener('click', ()=>{
    playUiClick();
    hideProfileOverlay();
  });
}
if(profileOverlay){
  profileOverlay.addEventListener('click', (evt)=>{
    if(evt.target === profileOverlay) hideProfileOverlay();
  });
}
if(lobbyCloseBtn){
  lobbyCloseBtn.addEventListener('click', ()=>{
    playUiClick();
    hideMultiplayerOverlay();
  });
}
if(lobbyOverlay){
  lobbyOverlay.addEventListener('click', (evt)=>{
    if(evt.target === lobbyOverlay) hideMultiplayerOverlay();
  });
}
if(lobbyOpenProfileBtn){
  lobbyOpenProfileBtn.addEventListener('click', ()=>{
    playUiClick();
    const shouldRestoreLobby = isMultiplayerOverlayVisible();
    const previousResume = shouldRestoreLobby ? multiplayerOverlayResume : null;
    if(shouldRestoreLobby){
      hideMultiplayerOverlay({resume:false});
    }
    showProfileOverlay({
      resume: shouldRestoreLobby
        ? ()=> showMultiplayerOverlay({playSound:false, resume: previousResume})
        : null
    });
  });
}
if(profileSignupBtn){
  profileSignupBtn.addEventListener('click', ()=> handleProfileAuth('signup'));
}
if(profileLoginBtn){
  profileLoginBtn.addEventListener('click', ()=> handleProfileAuth('login'));
}
if(profileLogoutBtn){
  profileLogoutBtn.addEventListener('click', handleProfileLogout);
}
if(lobbyCreateBtn){
  lobbyCreateBtn.addEventListener('click', handleLobbyCreate);
}
if(lobbyRefreshBtn){
  lobbyRefreshBtn.addEventListener('click', loadLobbyList);
}
if(lobbyLeaveBtn){
  lobbyLeaveBtn.addEventListener('click', handleLobbyLeave);
}
if(lobbyReadyBtn){
  lobbyReadyBtn.addEventListener('click', handleReadyToggle);
}
if(syncFleetBtn){
  syncFleetBtn.addEventListener('click', ()=>{
    applyFleetToServer();
  });
}
if(randomFleetBtn){
  randomFleetBtn.addEventListener('click', ()=>{
    randomizePendingFleet();
  });
}
if(chatFormEl){
  chatFormEl.addEventListener('submit', handleChatSubmit);
}
TEAM_IDS.forEach(team=>{
  const addBtn = teamAddButtons[team];
  if(addBtn){
    addBtn.addEventListener('click', ()=> addShipToRoster(team));
  }
  const clearBtn = teamClearButtons[team];
  if(clearBtn){
    clearBtn.addEventListener('click', ()=> clearTeamRoster(team));
  }
  const rosterEl = teamRosterEls[team];
  if(rosterEl){
    rosterEl.addEventListener('click', (evt)=>{
      const target = evt.target;
      if(!target || target.dataset.action !== 'remove') return;
      const idx = parseInt(target.dataset.index, 10);
      if(Number.isNaN(idx)) return;
      evt.preventDefault();
      removeShipFromRoster(team, idx);
    });
  }
});
if(overlayCancel){
  overlayCancel.addEventListener('click', ()=>{
    hideShipOverlay();
  });
}
if(overlayStart){
  overlayStart.addEventListener('click', ()=>{
    if(overlayMode === 'draft') beginFleetBattle();
    else commitPendingBattleSelection();
  });
}
if(overlayRandom){
  overlayRandom.addEventListener('click', ()=>{
    if(overlayMode !== 'draft') randomizePendingSelection();
  });
}
if(loreCloseBtn){
  loreCloseBtn.addEventListener('click', ()=>{
    playUiClick();
    hideLorePopover();
  });
}
if(lorePopover){
  lorePopover.addEventListener('click', (evt)=>{
    if(evt.target === lorePopover) hideLorePopover();
  });
}

// Main loop
let last = 0;
// global time-scaling for cinematic effects (1 = normal)
let timeScale = 1.0;
let targetTimeScale = 1.0;
const timeScaleLerpSpeed = 8.0; // how quickly timescale eases to target
// Unscaled dt from requestAnimationFrame, for real-time cinematic timers.
let realDt = 0;
function loop(t){
  const dt = Math.min(0.05,(t-last)/1000); last = t;
  realDt = dt;
  // smooth timeScale towards target then derive gameDt used for physics/updates
  timeScale += (targetTimeScale - timeScale) * Math.min(1, timeScaleLerpSpeed * dt);
  updateBlackgridCinematicAudio();
  const gameDt = dt * timeScale;
  const animateVictory = victoryState.active;
  const waitingVictory = pendingVictory.active;
  if(!running && !animateVictory && !waitingVictory){
    drawPaused();
    return;
  }

  let player = null;
    if(running){
    updateActiveSecretEvent(gameDt);
    // During global slow effects (Devistan), keep `barack` ships running at real time
    // so they are not slowed down. Other ships receive the scaled `gameDt`.
    ships.forEach(s=>{
      if(!s || s.hp <= 0) return;
      const isDevistanSlow = (typeof targetTimeScale === 'number' && targetTimeScale < 0.999);
      const skipSlowForBarack = isDevistanSlow && s.type && s.type.id === 'barack';
      const shipDt = skipSlowForBarack ? dt : gameDt;
      s.update(shipDt);
    });
    updateDeathousemenReincarnation(gameDt);
    updatePracticeRespawns(gameDt);
    updateFighters(gameDt);
    updateOutposts(gameDt);
    player = ships.find(s=> s.control);
    bullets.forEach(b=>{
      if(b.projectile && b.projectile.style === 'missile'){
        b.missileAge = (b.missileAge || 0) + dt;
        const proj = b.projectile || {};
        const targetSpeed = proj.speed || Math.hypot(b.dx, b.dy) || 260;
        const accel = proj.accel || 700;
        const turnRate = proj.turnRate || 2.2;
        const assist = proj.turnAssist ?? 0.85;
        const wobble = proj.wobble || 0;
        const lockDistance = proj.lockDistance ?? 60;
        const maxTrackTime = proj.maxTrackTime ?? Infinity;
        const fireAndForget = !!proj.fireAndForget;
        const leadTime = Math.max(0, proj.leadTime || 0);
        const behindTurnBoost = Math.max(1, proj.behindTurnBoost || 1);
        const behindTurnWindow = Math.max(0, proj.behindTurnWindow || 0);
        const guidance = proj.guidance || 'accel';
        const terminalTurnDamp = Math.max(0.1, Math.min(1, proj.terminalTurnDamp ?? 1));
        const terminalDodgeDistance = Math.max(0, proj.terminalDodgeDistance || 0);
        const terminalLoseLockChancePerSecond = Math.max(0, proj.terminalLoseLockChancePerSecond || 0);

        // Default to tracking unless explicitly turned off.
        if(b.tracking == null) b.tracking = true;

        // Only track if tracking is true
        if(b.tracking){
          // Acquire or validate target
          if(fireAndForget){
            if(!b.lockedTargetSet){
              b.lockedTarget = b.target || getNearestEnemyShip(b.team, (b.ownerShip || b));
              b.lockedTargetSet = true;
            }
            b.target = b.lockedTarget || null;
            if(b.target && (b.target.hp <= 0 || b.target.isWarping())){
              // Fire-and-forget should still always pursue an enemy: if the locked target is gone,
              // reacquire the nearest enemy ship once.
              const next = getNearestEnemyShip(b.team, (b.ownerShip || b));
              if(next){
                b.lockedTarget = next;
                b.target = next;
              } else {
                b.missileLostLock = true;
                b.tracking = false;
                b.target = null;
              }
            }
          } else {
            if(!b.target || b.target.hp <= 0 || b.target.isWarping()){
              b.target = getNearestEnemyShip(b.team, b);
            }
          }
          if(b.target){
            const tx = b.target.x + ((b.target.vx || 0) * leadTime);
            const ty = b.target.y + ((b.target.vy || 0) * leadTime);
            const dist = Math.hypot(tx - b.x, ty - b.y);

            // Terminal dodge window: near the target, guidance gets less perfect.
            if(terminalDodgeDistance > 0 && dist <= terminalDodgeDistance){
              if((b.missileAge || 0) > 0.35 && terminalLoseLockChancePerSecond > 0){
                if(Math.random() < terminalLoseLockChancePerSecond * dt){
                  b.missileMissed = true;
                  b.missileLostLock = true;
                  b.tracking = false;
                }
              }
            }

            // If close enough, stop tracking
            if(dist < lockDistance || b.missileAge > maxTrackTime){
              if(b.missileAge > maxTrackTime) b.missileMissed = true;
              b.tracking = false;
            } else {
              const desired = Math.atan2(ty - b.y, tx - b.x);
              const current = Math.atan2(b.dy, b.dx);
              const wob = wobble ? (Math.sin((b.seed || 0) + b.missileAge * 5.5) * wobble) : 0;
              const delta = normalizeAngle((desired + wob) - current);
              // If the target is behind early in flight, allow a bit more turning so it curves back.
              const behindBoostActive = behindTurnWindow > 0 && b.missileAge <= behindTurnWindow && Math.abs(delta) > (Math.PI * 0.65);
              const terminalDampActive = terminalDodgeDistance > 0 && dist <= terminalDodgeDistance;
              const turnMult = (behindBoostActive ? behindTurnBoost : 1) * (terminalDampActive ? terminalTurnDamp : 1);
              const maxTurn = turnRate * turnMult * dt;
              const turn = Math.max(-maxTurn, Math.min(maxTurn, delta)) * assist;
              const newAngle = current + turn;

              if(guidance === 'velocityTurn'){
                // Rotate velocity toward the target direction (still capped by maxTurn).
                const sped = Math.hypot(b.dx, b.dy) || targetSpeed;
                b.dx = Math.cos(newAngle) * sped;
                b.dy = Math.sin(newAngle) * sped;
                // Maintain cruise speed.
                const sped2 = Math.hypot(b.dx, b.dy) || 1;
                if(sped2 !== targetSpeed){
                  const scale = targetSpeed / sped2;
                  b.dx *= scale;
                  b.dy *= scale;
                }
              } else {
                // Accelerate along the new heading and cap to targetSpeed
                b.dx += Math.cos(newAngle) * accel * dt;
                b.dy += Math.sin(newAngle) * accel * dt;
                const sped = Math.hypot(b.dx, b.dy) || 1;
                if(sped > targetSpeed){
                  const scale = targetSpeed / sped;
                  b.dx *= scale;
                  b.dy *= scale;
                }
              }
            }
          } else {
            // No target: keep moving forward with mild acceleration toward cruise speed.
            const heading = Math.atan2(b.dy, b.dx) || 0;
            const sped = Math.hypot(b.dx, b.dy);
            if(sped < targetSpeed){
              b.dx += Math.cos(heading) * accel * 0.35 * dt;
              b.dy += Math.sin(heading) * accel * 0.35 * dt;
            }
          }
        } else {
          // Not tracking: go straight, no homing, just drift
          b.dx *= 0.999;
          b.dy *= 0.999;
        }
        // Visual exhaust
        if(Math.random() < 0.55){
          const ang = Math.atan2(b.dy, b.dx);
          particles.push({
            x: b.x - Math.cos(ang) * 10,
            y: b.y - Math.sin(ang) * 10,
            vx: -Math.cos(ang) * (40 + Math.random()*60) + (Math.random()-0.5)*25,
            vy: -Math.sin(ang) * (40 + Math.random()*60) + (Math.random()-0.5)*25,
            life: 0.12 + Math.random()*0.1,
            size: 0.7 + Math.random()*0.5,
            core: (proj.colors && proj.colors.glow) ? proj.colors.glow : [255,200,120],
            mid: [255,120,60]
          });
        }
      }
      if(b.projectile && b.projectile.style === 'fireball'){
        const proj = b.projectile || {};
        const drag = Math.max(0.92, Math.min(1, proj.driftDrag || 0.985));
        b.dx *= drag;
        b.dy *= drag;

        // Ember trail.
        if(Math.random() < 0.7){
          const ang = Math.atan2(b.dy, b.dx);
          const core = proj.core || [255,230,170];
          const mid = proj.mid || [255,150,70];
          const rim = proj.rim || [190,70,20];
          const tail = Math.max(14, proj.tailLength || 54);
          const off = 6 + Math.random()*10;
          particles.push({
            x: b.x - Math.cos(ang) * off,
            y: b.y - Math.sin(ang) * off,
            vx: -Math.cos(ang) * (55 + Math.random()*85) + (Math.random()-0.5)*30,
            vy: -Math.sin(ang) * (55 + Math.random()*85) + (Math.random()-0.5)*30,
            life: 0.14 + Math.random()*0.14,
            size: 1.0 + Math.random()*1.6,
            core: (Math.random() < 0.35) ? core : mid,
            mid: rim
          });
          if(Math.random() < 0.22){
            particles.push({
              x: b.x - Math.cos(ang) * (off + 4),
              y: b.y - Math.sin(ang) * (off + 4),
              vx: -Math.cos(ang) * (35 + Math.random()*65) + (Math.random()-0.5)*25,
              vy: -Math.sin(ang) * (35 + Math.random()*65) + (Math.random()-0.5)*25,
              life: 0.1 + Math.random()*0.12,
              size: 0.8 + Math.random()*1.2,
              core: mid,
              mid: rim
            });
          }
        }
      }
      if(b.projectile && b.projectile.style === 'miniTorpedo'){
        b.torpAge = (b.torpAge || 0) + dt;
        const proj = b.projectile || {};
        const targetSpeed = Math.max(120, proj.speed || Math.hypot(b.dx, b.dy) || 520);
        const accel = Math.max(0, proj.accel || 900);
        const turnRate = Math.max(0.5, proj.turnRate || 6.0);
        const assist = Math.max(0.05, Math.min(1, proj.turnAssist ?? 0.95));
        const wobble = proj.wobble || 0;
        const leadTime = Math.max(0, proj.leadTime || 0);

        // Spathi-style: keep homing for the whole lifetime.
        if(!b.target || b.target.hp <= 0 || (b.target.isWarping && b.target.isWarping()) || (b.target.isCloaked && b.target.isCloaked())){
          b.target = getNearestEnemyShip(b.team, (b.ownerShip || b));
        }

        if(b.target){
          const tx = b.target.x + ((b.target.vx || 0) * leadTime);
          const ty = b.target.y + ((b.target.vy || 0) * leadTime);
          const desired = Math.atan2(ty - b.y, tx - b.x);
          const current = Math.atan2(b.dy, b.dx);
          const wob = wobble ? (Math.sin((b.seed || 0) + (b.torpAge || 0) * 7.5) * wobble) : 0;
          const delta = normalizeAngle((desired + wob) - current);
          const maxTurn = turnRate * dt;
          const turn = Math.max(-maxTurn, Math.min(maxTurn, delta)) * assist;
          const newAngle = current + turn;

          // Accelerate forward, but always maintain a stable cruise speed.
          b.dx += Math.cos(newAngle) * accel * dt;
          b.dy += Math.sin(newAngle) * accel * dt;
          const sp = Math.hypot(b.dx, b.dy) || 1;
          const target = Math.max(120, targetSpeed);
          if(sp > target){
            const scale = target / sp;
            b.dx *= scale;
            b.dy *= scale;
          } else {
            // Nudge up toward cruise speed if still slow.
            const bump = Math.min(1, (accel * dt) / Math.max(1, target));
            b.dx = lerp(b.dx, Math.cos(newAngle) * target, bump * 0.35);
            b.dy = lerp(b.dy, Math.sin(newAngle) * target, bump * 0.35);
          }
        } else {
          // No target: drift.
          b.dx *= 0.99;
          b.dy *= 0.99;
        }

        // Small exhaust flicker.
        if(Math.random() < 0.5){
          const ang = Math.atan2(b.dy, b.dx);
          const glow = (proj.colors && proj.colors.glow) ? proj.colors.glow : [255,180,120];
          particles.push({
            x: b.x - Math.cos(ang) * 8,
            y: b.y - Math.sin(ang) * 8,
            vx: -Math.cos(ang) * (30 + Math.random()*55) + (Math.random()-0.5)*20,
            vy: -Math.sin(ang) * (30 + Math.random()*55) + (Math.random()-0.5)*20,
            life: 0.1 + Math.random()*0.1,
            size: 0.6 + Math.random()*0.6,
            core: glow,
            mid: [255,120,60]
          });
        }
      }
      if(b.projectile && b.projectile.style === 'acidOrb'){
        b.orbAge = (b.orbAge || 0) + dt;
        const proj = b.projectile || {};
        const targetSpeed = Math.max(80, proj.speed || Math.hypot(b.dx, b.dy) || 220);
        const turnRate = Math.max(0.4, proj.turnRate || 3.0);
        const assist = Math.max(0.05, Math.min(1, proj.turnAssist ?? 0.8));
        const leadTime = Math.max(0, proj.leadTime || 0);
        const dissolveDistance = Math.max(0, proj.dissolveDistance || 0);
        const dissolveSeconds = Math.max(0.25, proj.dissolveSeconds || 2.4);
        const restoreSeconds = Math.max(0.25, proj.restoreSeconds || 1.8);
        const minDamageMult = Math.max(0, Math.min(1, proj.minDamageMult ?? 0.35));

        if(b.tracking == null) b.tracking = true;
        if(typeof b.orbDissolve !== 'number') b.orbDissolve = 0;
        if(typeof b.damageMult !== 'number') b.damageMult = 1;

        if(b.tracking){
          if(!b.target || b.target.hp <= 0 || b.target.isWarping()){
            b.target = getNearestEnemyShip(b.team, b);
          }
          if(b.target){
            const tx = b.target.x + ((b.target.vx || 0) * leadTime);
            const ty = b.target.y + ((b.target.vy || 0) * leadTime);
            const dist = Math.hypot(tx - b.x, ty - b.y);

            // Dissolve only when kept at range (dodged). If it closes the gap again,
            // it can "re-cohere" instead of fully fading out.
            if(dissolveDistance > 0 && dist > dissolveDistance){
              b.orbDissolve = Math.min(1.25, b.orbDissolve + (dt / dissolveSeconds));
            } else {
              b.orbDissolve = Math.max(0, b.orbDissolve - (dt / restoreSeconds));
              // While close, slow TTL decay so it doesn't disappear just for existing.
              b.ttl += dt * 0.75;
            }

            // If fully dissolved (only possible when kept at distance long enough), remove it.
            if(b.orbDissolve >= 1){
              b.ttl = 0;
            }

            // Damage scales down with dissolve, but never to zero while it still exists.
            const dissolveClamped = Math.max(0, Math.min(1, b.orbDissolve));
            b.damageMult = Math.max(minDamageMult, 1 - dissolveClamped);

            const desired = Math.atan2(ty - b.y, tx - b.x);
            const current = Math.atan2(b.dy, b.dx);
            const delta = normalizeAngle(desired - current);
            const maxTurn = turnRate * dt;
            const turn = Math.max(-maxTurn, Math.min(maxTurn, delta)) * assist;
            const newAngle = current + turn;
            b.dx = Math.cos(newAngle) * targetSpeed;
            b.dy = Math.sin(newAngle) * targetSpeed;
          } else {
            // No target: keep drifting forward and slowly lose speed.
            b.dx *= 0.992;
            b.dy *= 0.992;
            b.orbDissolve = Math.min(1.25, b.orbDissolve + (dt / dissolveSeconds));
            if(b.orbDissolve >= 1) b.ttl = 0;
            const dissolveClamped = Math.max(0, Math.min(1, b.orbDissolve));
            b.damageMult = Math.max(minDamageMult, 1 - dissolveClamped);
          }
        }
      }
      if(b.projectile && (b.projectile.style === 'manifoldMissile' || b.projectile.style === 'manifoldShard')){
        const proj = b.projectile || {};
        b.manifoldAge = (b.manifoldAge || 0) + dt;
        if(typeof b.forwardAngle !== 'number') b.forwardAngle = Math.atan2(b.dy, b.dx);
        if(typeof b.manifoldStage !== 'number') b.manifoldStage = (proj.style === 'manifoldShard') ? 2 : 0;

        // Straight-line missile flight with optional acceleration.
        const accel = Math.max(0, proj.accel || 0);
        const maxSpeed = Math.max(40, proj.speed || Math.hypot(b.dx, b.dy) || 420);
        if(accel > 0){
          const heading = b.forwardAngle;
          b.dx += Math.cos(heading) * accel * dt;
          b.dy += Math.sin(heading) * accel * dt;
          const sp = Math.hypot(b.dx, b.dy) || 1;
          if(sp > maxSpeed){
            const scale = maxSpeed / sp;
            b.dx *= scale;
            b.dy *= scale;
          }
        }

        const spawnChild = (angle, speed, ttl, damage, radius, hitRadius, style, stage)=>{
          const childProj = {
            ...proj,
            style,
            speed,
            ttl,
            damage,
            radius,
            hitRadius,
            // Children should not inherit parent fuse timings unless they are stage-1.
            accel: (style === 'manifoldShard') ? (proj.stage2ChildAccel || proj.accel || 0) : (proj.stage1ChildAccel || proj.accel || 0)
          };
          bullets.push({
            x: b.x,
            y: b.y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            team: b.team,
            ttl,
            initialTtl: ttl,
            damage,
            ownerShip: b.ownerShip || null,
            raceId: b.raceId,
            projectile: childProj,
            seed: Math.random()*Math.PI*2,
            manifoldAge: 0,
            manifoldStage: stage,
            forwardAngle: b.forwardAngle
          });
        };

        // Two-stage split:
        // stage 0 -> 5 forward mini-missiles
        // stage 1 -> 10 forward fragments
        if(proj.style === 'manifoldMissile' && !b._manifoldSplitDone){
          if(b.manifoldStage === 0){
            const fuse = Math.max(0.1, proj.stage1Fuse || 0.62);
            if(b.manifoldAge >= fuse){
              b._manifoldSplitDone = true;
                playSfx('split5', 'khanite');
              const count = Math.max(1, Math.round(proj.stage1Count || 5));
              const spread = Math.max(0, proj.stage1Spread || 0.42);
              const childSpeed = Math.max(40, proj.stage1ChildSpeed || 360);
              const childTtl = Math.max(0.2, proj.stage1ChildTtl || 1.05);
              const childDamage = Math.max(0, proj.stage1ChildDamage ?? Math.max(1, (proj.damage || 10) * 0.6));
              const radius = Math.max(2, proj.stage1ChildRadius || 6);
              const hitRadius = Math.max(2, proj.stage1ChildHitRadius || 10);

              for(let i=0;i<count;i++){
                const t = (count === 1) ? 0 : ((i / (count - 1)) * 2 - 1);
                const a = b.forwardAngle + (t * spread);
                spawnChild(a, childSpeed, childTtl, childDamage, radius, hitRadius, 'manifoldMissile', 1);
              }
              b.ttl = 0;
            }
          } else if(b.manifoldStage === 1){
            const fuse = Math.max(0.1, proj.stage2Fuse || 0.55);
            if(b.manifoldAge >= fuse){
              b._manifoldSplitDone = true;
              playSfx('split10', 'khanite');
              const count = Math.max(1, Math.round(proj.stage2Count || 10));
              const spread = Math.max(0, proj.stage2Spread || 0.78);
              const childSpeed = Math.max(40, proj.stage2ChildSpeed || 320);
              const childTtl = Math.max(0.2, proj.stage2ChildTtl || 0.95);
              const childDamage = Math.max(0, proj.stage2ChildDamage ?? Math.max(1, (proj.damage || 6) * 0.5));
              const radius = Math.max(2, proj.stage2ChildRadius || 5);
              const hitRadius = Math.max(2, proj.stage2ChildHitRadius || 9);

              for(let i=0;i<count;i++){
                const t = (count === 1) ? 0 : ((i / (count - 1)) * 2 - 1);
                const a = b.forwardAngle + (t * spread);
                spawnChild(a, childSpeed, childTtl, childDamage, radius, hitRadius, 'manifoldShard', 2);
              }
              b.ttl = 0;
            }
          }
        }
      }
      if(b.projectile && b.projectile.style === 'parasitePod'){
        b.podAge = (b.podAge || 0) + dt;
        const proj = b.projectile || {};
        const targetSpeed = proj.speed || Math.hypot(b.dx, b.dy) || 360;
        const turnRate = proj.turnRate || 4.2;
        const wobble = proj.wobble || 0;

        if(b.tracking == null) b.tracking = true;
        if(b.tracking){
          if(!b.target || b.target.hp <= 0 || b.target.isWarping()){
            b.target = getNearestEnemyShip(b.team, b);
          }
          if(b.target){
            const tx = b.target.x;
            const ty = b.target.y;
            const desired = Math.atan2(ty - b.y, tx - b.x);
            const current = Math.atan2(b.dy, b.dx);
            const wob = wobble ? (Math.sin((b.seed || 0) + b.podAge * 6.5) * wobble) : 0;
            const delta = normalizeAngle((desired + wob) - current);
            const maxTurn = turnRate * dt;
            const turn = Math.max(-maxTurn, Math.min(maxTurn, delta));
            const newAngle = current + turn;
            b.dx = Math.cos(newAngle) * targetSpeed;
            b.dy = Math.sin(newAngle) * targetSpeed;
          }
        }
        if(Math.random() < 0.45){
          const ang = Math.atan2(b.dy, b.dx);
          particles.push({
            x: b.x - Math.cos(ang) * 10,
            y: b.y - Math.sin(ang) * 10,
            vx: -Math.cos(ang) * (35 + Math.random()*55) + (Math.random()-0.5)*25,
            vy: -Math.sin(ang) * (35 + Math.random()*55) + (Math.random()-0.5)*25,
            life: 0.12 + Math.random()*0.1,
            size: 0.65 + Math.random()*0.6,
            core: proj.core || [170,255,150],
            mid: proj.mid || [80,210,80]
          });
        }
      }
      if(b.projectile && b.projectile.style === 'violetFlame'){
        const drag = b.projectile.damping || 0.78;
        b.dx *= drag;
        b.dy *= drag;
      }
      if(b.projectile && b.projectile.style === 'daemonOrb'){
        // Persist for the whole run, but don't keep orphan orbs after their owner dies.
        if(b.ownerShip && b.ownerShip.hp <= 0){
          if(!b._daemonDeathSfxPlayed){
            b._daemonDeathSfxPlayed = true;
            try{ playSfx('board_die', b.raceId || 'anti_shamen'); }catch(err){}
          }
          b.ttl = 0;
        }

        // Ensure daemon orbs always have HP (backward-compatible with existing saves/spawns).
        if(typeof b.maxHp !== 'number'){
          const proj = b.projectile || {};
          b.maxHp = Math.max(1, (typeof proj.maxHp === 'number') ? proj.maxHp : 30);
        }
        if(typeof b.hp !== 'number'){
          b.hp = b.maxHp;
        }

        b.daemonAge = (b.daemonAge || 0) + dt;
        const proj = b.projectile || {};
        const targetSpeed = Math.max(60, proj.speed || Math.hypot(b.dx, b.dy) || 170);
        const turnRate = Math.max(0.5, proj.turnRate || 6.6);

        if(b.tracking == null) b.tracking = true;
        if(b.tracking){
          if(!b.target || b.target.hp <= 0 || b.target.isWarping()){
            b.target = getNearestEnemyShip(b.team, b);
          }
          if(b.target){
            const desired = Math.atan2(b.target.y - b.y, b.target.x - b.x);
            const current = Math.atan2(b.dy, b.dx);
            const delta = normalizeAngle(desired - current);
            const maxTurn = turnRate * dt;
            const turn = Math.max(-maxTurn, Math.min(maxTurn, delta));
            const newAngle = current + turn;
            b.dx = Math.cos(newAngle) * targetSpeed;
            b.dy = Math.sin(newAngle) * targetSpeed;
          }
        }
        if(Math.random() < 0.35){
          const ang = Math.atan2(b.dy, b.dx);
          particles.push({
            x: b.x - Math.cos(ang) * 8,
            y: b.y - Math.sin(ang) * 8,
            vx: -Math.cos(ang) * (25 + Math.random()*45) + (Math.random()-0.5)*25,
            vy: -Math.sin(ang) * (25 + Math.random()*45) + (Math.random()-0.5)*25,
            life: 0.10 + Math.random()*0.10,
            size: 0.8 + Math.random()*1.2,
            core: proj.core || [235,210,255],
            mid: proj.mid || [170,90,255]
          });
        }
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

          // Crystal shard: release immediately shatters into shrapnel.
          if(b.projectile && b.projectile.style === 'crystalShard' && !b._crystalShattered){
            b._crystalShattered = true;
            try{ playSfx('split5', b.raceId || 'anti_shamen'); }catch(err){}
            const proj = b.projectile || {};
            const count = Math.max(6, Math.min(24, Math.round(proj.shrapnelCount || 14)));
            const speed = Math.max(120, proj.shrapnelSpeed || 720);
            const ttl = Math.max(0.2, proj.shrapnelTtl || 0.65);
            const dmg = Math.max(0, proj.shrapnelDamage ?? Math.max(1, (proj.damage || 10) * 0.6));
            const radius = Math.max(1.2, proj.shrapnelRadius || 2.5);
            const hitRadius = Math.max(radius, proj.shrapnelHitRadius || 9);
            const core = proj.shrapnelCore || proj.core || [245,255,255];
            const mid = proj.shrapnelMid || proj.mid || [160,235,255];
            const baseAngle = (b.seed || 0) + Math.random()*Math.PI*2;

            for(let i=0;i<count;i++){
              const a = baseAngle + (i / count) * Math.PI*2;
              bullets.push({
                x: b.x,
                y: b.y,
                dx: Math.cos(a) * speed,
                dy: Math.sin(a) * speed,
                ttl,
                initialTtl: ttl,
                team: b.team,
                damage: dmg,
                ownerShip: b.ownerShip || null,
                raceId: b.raceId,
                projectile: {
                  style: 'crystalShrapnel',
                  radius,
                  hitRadius,
                  core,
                  mid
                },
                seed: Math.random()*Math.PI*2
              });
            }
            for(let k=0;k<12;k++){
              const aa = Math.random()*Math.PI*2;
              const sp = 80 + Math.random()*260;
              particles.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(aa) * sp,
                vy: Math.sin(aa) * sp,
                life: 0.12 + Math.random()*0.14,
                size: 1.0 + Math.random()*1.8,
                core,
                mid
              });
            }
            b.ttl = 0;
          }
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
      b.x += b.dx*gameDt;
      b.y += b.dy*gameDt;
      b.ttl -= gameDt;
    });
    bullets = bullets.filter(b=>{
      if(!b || !(b.ttl > 0)) return false;
      const style = (b.projectile && b.projectile.style) || 'default';
      // Daemon orbs persist for the whole run; do not bounds-cull them.
      if(style === 'daemonOrb') return true;
      return (b.x > -50 && b.x < canvas.width+50 && b.y > -50 && b.y < canvas.height+50);
    });

    // Enemy fire can destroy daemon orbs.
    // Do this before bullet-vs-ship collisions so projectiles get consumed cleanly.
    {
      const daemonOrbs = bullets.filter(o=> o && o.ttl > 0 && o.projectile && o.projectile.style === 'daemonOrb');
      if(daemonOrbs.length){
        const killDaemonOrb = (orb)=>{
          if(!orb || !(orb.ttl > 0)) return;
          orb.ttl = 0;
          if(!orb._daemonDeathSfxPlayed){
            orb._daemonDeathSfxPlayed = true;
            try{ playSfx('board_die', orb.raceId || 'anti_shamen'); }catch(err){}
          }
          const proj = orb.projectile || {};
          const core = proj.core || [235,210,255];
          const mid = proj.mid || [170,90,255];
          for(let k=0;k<10;k++){
            const aa = Math.random()*Math.PI*2;
            const sp = 70 + Math.random()*190;
            particles.push({
              x: orb.x,
              y: orb.y,
              vx: Math.cos(aa) * sp,
              vy: Math.sin(aa) * sp,
              life: 0.10 + Math.random()*0.14,
              size: 0.9 + Math.random()*1.8,
              core,
              mid
            });
          }
        };

        bullets.forEach(att=>{
          if(!att || !(att.ttl > 0) || !att.projectile) return;
          const aStyle = att.projectile.style;
          // Hitscan beams already apply their damage at creation time.
          if(aStyle === 'laserBeam' || aStyle === 'laserShot' || aStyle === 'lightningBolt' || aStyle === 'shamenLaser' || aStyle === 'tendrilLash') return;
          // Daemon orbs themselves don't shoot each other.
          if(aStyle === 'daemonOrb') return;

          for(let i=0;i<daemonOrbs.length && att.ttl > 0;i++){
            const orb = daemonOrbs[i];
            if(!orb || !(orb.ttl > 0)) continue;
            if(orb.team === att.team) continue;

            const oProj = orb.projectile || {};
            const oR = Math.max(6, (oProj.hitRadius ?? oProj.radius) || 14);
            const aR = Math.max(1, ((att.projectile && (att.projectile.hitRadius ?? att.projectile.radius)) || 2));
            if(Math.hypot(att.x - orb.x, att.y - orb.y) <= (oR + aR)){
              const damage = (typeof att.damage === 'number')
                ? att.damage
                : ((att.projectile && typeof att.projectile.damage === 'number') ? att.projectile.damage : 12);
              if(typeof orb.maxHp !== 'number') orb.maxHp = Math.max(1, 30);
              if(typeof orb.hp !== 'number') orb.hp = orb.maxHp;
              orb.hp = Math.max(0, orb.hp - Math.max(0, damage));
              att.ttl = 0;

              const core = oProj.core || [235,210,255];
              const mid = oProj.mid || [170,90,255];
              for(let k=0;k<4;k++){
                const aa = Math.random()*Math.PI*2;
                const sp = 40 + Math.random()*120;
                particles.push({
                  x: orb.x,
                  y: orb.y,
                  vx: Math.cos(aa) * sp,
                  vy: Math.sin(aa) * sp,
                  life: 0.06 + Math.random()*0.10,
                  size: 0.7 + Math.random()*1.3,
                  core,
                  mid
                });
              }

              if(orb.hp <= 0){
                killDaemonOrb(orb);
              }
              break;
            }
          }
        });
      }
    }

    bullets.forEach(b=>{
      const style = (b.projectile && b.projectile.style) || 'default';
      // Hitscan beams already applied their damage on creation; they should not collide.
      if(style === 'laserBeam' || style === 'laserShot' || style === 'lightningBolt' || style === 'shamenLaser' || style === 'tendrilLash') return;
      ships.forEach(s=>{
        if(!s || s.hp<=0 || s.isWarping()) return;
        const isEnemy = (s.team !== b.team);
        let canHit = isEnemy;

        // Taftian missiles can very rarely loop back and hit their own launcher.
        if(!canHit && style === 'missile' && b.ownerShip && s === b.ownerShip){
          const proj = b.projectile || {};
          const armedAfter = Math.max(0.25, proj.friendlyFireAfter || 2.35);
          const minTravel = Math.max(0, proj.friendlyFireMinTravel || 0);
          const traveled = (typeof b.launchX === 'number' && typeof b.launchY === 'number')
            ? Math.hypot(b.x - b.launchX, b.y - b.launchY)
            : Infinity;
          const lockWasLost = !!b.missileLostLock || !!b.missileMissed || (b.tracking === false);
          if((b.missileAge || 0) >= armedAfter && traveled >= minTravel && lockWasLost){
            canHit = true;
          }
        }

        if(canHit){
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
                applyDamage(s, impactDamage, b.ownerShip || null);
                b.ttl = 0;
                return;
              }
            }
          }
          const projRadius = (b.projectile && (b.projectile.hitRadius ?? b.projectile.radius)) || 0;
          const hitExtra = projRadius ? Math.max(0, projRadius * 0.35) : 0;
          if(d < s.size + hitExtra){
            if(style === 'daemonOrb'){
              const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
              const proj = b.projectile || {};
              const nextOk = (typeof b.daemonNextHitMs === 'number') ? b.daemonNextHitMs : 0;
              if(nowMs < nextOk) return;

              // Daemon bump SFX.
              try{ playSfx('hit', b.raceId || 'anti_shamen'); }catch(err){}

              // Daemon orbs drain battery only (no HP damage).
              const drain = (b.drainEnergy != null ? b.drainEnergy : proj.drainEnergy) || 0;
              if(drain > 0 && s.energy != null){
                s.energy = Math.max(0, s.energy - drain);
              }

              const norm = d || 1;
              const nx = (b.x - s.x) / norm;
              const ny = (b.y - s.y) / norm;
              const bounceSpeed = Math.max(80, proj.bounceSpeed || Math.hypot(b.dx, b.dy) || 220);
              b.dx = nx * bounceSpeed;
              b.dy = ny * bounceSpeed;
              b.daemonNextHitMs = nowMs + Math.max(40, proj.hitCooldownMs || 280);

              for(let k=0;k<6;k++){
                const aa = Math.random()*Math.PI*2;
                const sp = 60 + Math.random()*140;
                particles.push({
                  x: b.x,
                  y: b.y,
                  vx: Math.cos(aa) * sp,
                  vy: Math.sin(aa) * sp,
                  life: 0.08 + Math.random()*0.10,
                  size: 0.8 + Math.random()*1.4,
                  core: proj.core || [235,210,255],
                  mid: proj.mid || [170,90,255]
                });
              }
              return;
            }
            if(style === 'mine'){
              const proj = b.projectile || {};
              const mineDamage = b.damage != null ? b.damage : (proj.damage || 12);
              const mineAoERadius = Math.max(10, proj.mineAoERadius || 70);
              const mineAoEDamage = Math.max(0, proj.mineAoEDamage || 8);
              // Direct hit damage.
              applyDamage(s, mineDamage, b.ownerShip || null);
              // AoE splash.
              ships.forEach(other=>{
                if(!other || other.team === b.team || other.hp <= 0 || other.isWarping()) return;
                const dist = Math.hypot(other.x - b.x, other.y - b.y);
                if(dist <= mineAoERadius){
                  const t = mineAoERadius > 0 ? Math.max(0, Math.min(1, 1 - (dist / mineAoERadius))) : 0;
                  const splash = mineAoEDamage * (0.35 + 0.65 * t);
                  if(splash > 0.25) applyDamage(other, splash, b.ownerShip || null);
                }
              });
              explosions.push({
                x: b.x,
                y: b.y,
                age: 0,
                duration: 0.55,
                maxRadius: mineAoERadius
              });
            } else {
              let damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 12);
              if(style === 'acidOrb'){
                const mult = (typeof b.damageMult === 'number') ? b.damageMult : 1;
                damage *= Math.max(0, mult);
              }
              applyDamage(s, damage, b.ownerShip || null);
            }
            if(b.projectile && b.projectile.style === 'parasitePod'){
              const spec = b.parasiteSpec || {};
              const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
              const dur = Math.max(0.5, spec.duration || 9.5);
              const slowPer = spec.slowPer ?? 0.085;
              const turnSlowPer = spec.turnSlowPer ?? 0.085;
              const hp = spec.hp ?? 12;
              s.parasites = s.parasites || [];
              s.parasites.push({
                untilMs: nowMs + dur*1000,
                slowPer,
                turnSlowPer,
                hp
              });
            }
            const drain = (b.drainEnergy != null ? b.drainEnergy : (b.projectile && b.projectile.drainEnergy)) || 0;
            if(drain > 0 && s.energy != null){
              s.energy = Math.max(0, s.energy - drain);
            }
            if(b.projectile && s.applyAcidEffect){
              if(b.projectile.acid) s.applyAcidEffect(b.projectile.acid);
              else if(b.projectile.dot){
                if(style === 'acidOrb'){
                  const mult = (typeof b.damageMult === 'number') ? b.damageMult : 1;
                  const dot = b.projectile.dot;
                  s.applyAcidEffect({
                    damagePerSecond: (dot.damagePerSecond || 0) * Math.max(0, mult),
                    duration: dot.duration
                  });
                } else {
                  s.applyAcidEffect(b.projectile.dot);
                }
              }
            }
            b.ttl = 0;
          }
        }
      });
      if(b.ttl > 0 && outposts.length){
        for(let i=0;i<outposts.length && b.ttl>0;i++){
          const o = outposts[i];
          if(!o || o.dead || o.team === b.team) continue;
          const dist = Math.hypot(b.x - o.x, b.y - o.y);
          if(dist < 14){
            const style = (b.projectile && b.projectile.style) || 'default';
            if(style === 'daemonOrb'){
              // Daemon orbs persist: bounce off structures.
              const proj = b.projectile || {};
              const norm = dist || 1;
              const nx = (b.x - o.x) / norm;
              const ny = (b.y - o.y) / norm;
              const bounceSpeed = Math.max(80, proj.bounceSpeed || Math.hypot(b.dx, b.dy) || 220);
              b.dx = nx * bounceSpeed;
              b.dy = ny * bounceSpeed;
              b.x = o.x + nx * 16;
              b.y = o.y + ny * 16;
            } else {
              const damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 8);
              o.hp = Math.max(0, o.hp - damage);
              b.ttl = 0;
            }
          }
        }
      }
      if(b.ttl > 0 && fighters.length){
        for(let i=0;i<fighters.length && b.ttl>0;i++){
          const f = fighters[i];
          if(!f || !f.alive || f.team === b.team) continue;
          const radius = f.size || 10;
          if(Math.hypot(b.x - f.x, b.y - f.y) < radius){
            const style = (b.projectile && b.projectile.style) || 'default';
            if(style === 'daemonOrb'){
              const proj = b.projectile || {};
              // Daemon orbs do not damage HP; just bounce off fighters.
              const dist = Math.hypot(b.x - f.x, b.y - f.y);
              const norm = dist || 1;
              const nx = (b.x - f.x) / norm;
              const ny = (b.y - f.y) / norm;
              const bounceSpeed = Math.max(80, proj.bounceSpeed || Math.hypot(b.dx, b.dy) || 220);
              b.dx = nx * bounceSpeed;
              b.dy = ny * bounceSpeed;
              b.x = f.x + nx * (radius + 6);
              b.y = f.y + ny * (radius + 6);
            } else {
              const damage = b.damage != null ? b.damage : ((b.projectile && b.projectile.damage) || 8);
              damageFighter(f, damage);
              b.ttl = 0;
            }
          }
        }
      }
      if(b.ttl > 0){
        for(let i=planets.length-1; i>=0 && b.ttl>0; i--){
          const p = planets[i];
          if(!p) continue;
          if(Math.hypot(b.x - p.x, b.y - p.y) < p.r){
            const style = (b.projectile && b.projectile.style) || 'default';
            if(style === 'daemonOrb'){
              // Daemon orbs persist: bounce off planets.
              const proj = b.projectile || {};
              const dx = b.x - p.x;
              const dy = b.y - p.y;
              const dist = Math.hypot(dx, dy) || 1;
              const nx = dx / dist;
              const ny = dy / dist;
              const bounceSpeed = Math.max(90, proj.bounceSpeed || Math.hypot(b.dx, b.dy) || 240);
              b.dx = nx * bounceSpeed;
              b.dy = ny * bounceSpeed;
              b.x = p.x + nx * (p.r + 18);
              b.y = p.y + ny * (p.r + 18);
              continue;
            }
            // Horror boss demonstrates power: one shot deletes a planet.
            if(b.raceId === 'horror_boss'){
              planets.splice(i, 1);
              spawnPlanetImpact(p, b);
              for(let k=0;k<22;k++){
                const a = Math.random()*Math.PI*2;
                const r = (p.r || 30) * (0.15 + Math.random()*1.15);
                particles.push({
                  x: p.x + Math.cos(a)*r,
                  y: p.y + Math.sin(a)*r,
                  vx: (Math.random()-0.5)*220,
                  vy: (Math.random()-0.5)*220,
                  life: 0.22 + Math.random()*0.28,
                  size: 1.6 + Math.random()*2.8,
                  core: [255, 90, 90],
                  mid: [70, 0, 0]
                });
              }
            } else {
              spawnPlanetImpact(p, b);
            }
            b.ttl = 0;
          }
        }
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
    updatePlasmaClouds(dt);
    if(player){
      let dx = 0, dy = 0;
      const horizontalThreshold = canvas.width + SECTOR_EXIT_BUFFER;
      const verticalThreshold = canvas.height + SECTOR_EXIT_BUFFER;
      if(player.x < -SECTOR_EXIT_BUFFER) dx = -1;
      else if(player.x > horizontalThreshold) dx = 1;
      if(player.y < -SECTOR_EXIT_BUFFER) dy = -1;
      else if(player.y > verticalThreshold) dy = 1;
      if(dx !== 0 || dy !== 0){
        // Horror mode: don't allow accidental sector changes while you're close to the boss.
        // (Otherwise overlap/drift can push you out-of-bounds and the boss gets stashed, looking like it vanished.)
        if(activeSecretEvent && activeSecretEvent.type === 'horror'){
          const boss = ships.find(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
          if(boss){
            const d = Math.hypot(player.x - boss.x, player.y - boss.y);
            if(d < 520){
              // Clamp back into bounds and damp momentum.
              player.x = Math.max(16, Math.min(canvas.width - 16, player.x));
              player.y = Math.max(16, Math.min(canvas.height - 16, player.y));
              player.vx *= 0.15;
              player.vy *= 0.15;
              dx = 0;
              dy = 0;
            }
          }
        }
        if(dx === 0 && dy === 0){}
        else {
        changeSector(dx,dy,player);
        player.vx *= 0.2; player.vy *= 0.2;
        }
      }
    }
  }

  particles.forEach(p=>{
    p.x += p.vx*gameDt;
    p.y += p.vy*gameDt;
    p.life -= gameDt;
    p.size *= (p.sizeDecay || 0.98);
    if(p.spinRate){
      p.spin = (p.spin || 0) + p.spinRate * gameDt;
    }
    if(p.damp){ p.vx *= p.damp; p.vy *= p.damp; }
  });
  particles = particles.filter(p=> p.life>0 && p.size>0.3 && p.x>-100 && p.x<canvas.width+100 && p.y>-100 && p.y<canvas.height+100);
  explosions.forEach(e=>{ e.age += gameDt; });
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

  let enemies = ships.filter(s=> !s.control && s.hp>0);
  if(activeSecretEvent && activeSecretEvent.type === 'horror'){
    const boss = ships.find(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
    if(boss && activeSecretEvent.bossRevealed){
      enemies = [boss].concat(enemies.filter(s=> s !== boss));
    }
  }
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
    updateEnemyParasiteHud(e);
  } else {
    if(enemyCrewBarEl) enemyCrewBarEl.innerHTML = '';
    if(enemyBatteryGridEl) enemyBatteryGridEl.innerHTML = '';
    if(enemyEnergyTextEl) enemyEnergyTextEl.textContent = '0%';
    currentEnemyRace = null;
    enemyAvatarState = enemyAvatarVictoryLock ? 'victory' : 'idle';
    updateEnemyAvatarImg();
    updateEnemyBoarderHud(null);
    updateEnemyParasiteHud(null);
  }
  if(running){
    if(activeSecretEvent && activeSecretEvent.type === 'horror'){
      const bossOnField = ships.find(s=> s && s.hp>0 && s.type && s.type.id === 'horror_boss');
      const bossShip = bossOnField || (activeSecretEvent.stashedBoss && activeSecretEvent.stashedBoss.hp > 0 ? activeSecretEvent.stashedBoss : null);
      const bossAlive = !!bossShip;
      const alliesAlive = ships.some(s=> s && s.hp>0 && s.team === HORROR_TEAM_ALLY);
      if((!bossAlive || !alliesAlive) && !pendingVictory.active && !victoryState.active){
        const winner = !bossAlive
          ? (ships.find(s=> s && s.control && s.hp>0) || ships.find(s=> s && s.team === HORROR_TEAM_ALLY && s.hp>0))
          : (bossShip || ships.find(s=> s && s.hp>0));
        endActiveSecretEvent({silent:true});
        if(winner) scheduleVictory(winner);
      }
    } else {
      const aliveA = ships.some(s=>s.team==='A' && s.hp>0);
      const aliveB = ships.some(s=>s.team==='B' && s.hp>0);
      if((!aliveA || !aliveB) && !pendingVictory.active && !victoryState.active){
        const winner = ships.find(s=> s.hp>0);
        if(winner) scheduleVictory(winner);
      }
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
      // Ensure any victory track doesn't keep playing after the sequence.
      stopActiveVictorySound();
      victoryState.active = false;
      running = false;
      handlePostVictory(finishingShip);
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
  drawHorrorFaces(ctx);
  drawFartClouds(ctx);
  drawPlasmaClouds(ctx);
  drawOutposts(ctx);
  ships.forEach(s=> s.hp>0 && s.draw(ctx));
  drawFighters(ctx);

  // Keep ships readable through the horror glitch.
  drawHorrorShipHighlights(ctx);

  // Blackgrid Hack visuals: draw electric arcs between caster and target and a pulsing overlay on the target.
  (ships || []).forEach(specOwner => {
    const spec = specOwner.activeSpecial;
    if(!spec || spec.type !== 'blackgridHack') return;
    const src = spec.source || specOwner;
    const tgt = spec.target;
    if(!src || !tgt || tgt.hp <= 0) return;
    try{
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const seed = spec.seed || 0;
      const conf = spec.config || {};
      // Pre-fire phase: show the red lock marker only (no bolt/arcs/SFX yet).
      if(!spec.fired){
        if(spec.lockRemaining && spec.lockRemaining > 0){
          const denom = (conf.lockOnSeconds || 1.0);
          const remaining = spec.lockRemaining;
          const lockProgress = 1 - (remaining / Math.max(0.001, denom));
          const ringR = Math.max(24, (tgt.size || 18) * (0.9 + lockProgress * 0.8));
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          // pulsing outer ring
          ctx.strokeStyle = rgba([255,24,24], 0.95 * (0.5 + lockProgress*0.5));
          ctx.lineWidth = 3 + Math.floor(2 * lockProgress);
          ctx.beginPath(); ctx.arc(tgt.x, tgt.y, ringR, 0, Math.PI*2); ctx.stroke();
          // crosshair
          ctx.lineWidth = 2;
          ctx.strokeStyle = rgba([255,140,140], 0.98);
          ctx.beginPath(); ctx.moveTo(tgt.x - ringR*0.6, tgt.y); ctx.lineTo(tgt.x + ringR*0.6, tgt.y); ctx.moveTo(tgt.x, tgt.y - ringR*0.6); ctx.lineTo(tgt.x, tgt.y + ringR*0.6); ctx.stroke();
          // small center lock dot
          ctx.fillStyle = `rgba(255,60,60,${0.95})`;
          ctx.beginPath(); ctx.arc(tgt.x, tgt.y, Math.max(3, 3 + lockProgress*2), 0, Math.PI*2); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
        return;
      }

      // Draw a prominent red lock marker during the lock phase (before firing)
      if(spec.lockRemaining && spec.lockRemaining > 0){
        const denom = (conf.lockOnSeconds || 1.0);
        const remaining = spec.lockRemaining;
        const lockProgress = 1 - (remaining / Math.max(0.001, denom));
        const ringR = Math.max(24, (tgt.size || 18) * (0.9 + lockProgress * 0.8));
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        // pulsing outer ring
        ctx.strokeStyle = rgba([255,24,24], 0.95 * (0.5 + lockProgress*0.5));
        ctx.lineWidth = 3 + Math.floor(2 * lockProgress);
        ctx.beginPath(); ctx.arc(tgt.x, tgt.y, ringR, 0, Math.PI*2); ctx.stroke();
        // crosshair
        ctx.lineWidth = 2;
        ctx.strokeStyle = rgba([255,140,140], 0.98);
        ctx.beginPath(); ctx.moveTo(tgt.x - ringR*0.6, tgt.y); ctx.lineTo(tgt.x + ringR*0.6, tgt.y); ctx.moveTo(tgt.x, tgt.y - ringR*0.6); ctx.lineTo(tgt.x, tgt.y + ringR*0.6); ctx.stroke();
        // small center lock dot
        ctx.fillStyle = `rgba(255,60,60,${0.95})`;
        ctx.beginPath(); ctx.arc(tgt.x, tgt.y, Math.max(3, 3 + lockProgress*2), 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // "Bolt" flash right as it fires.
      if(spec.fireFlashRemaining && spec.fireFlashRemaining > 0){
        const p = Math.max(0, Math.min(1, spec.fireFlashRemaining / Math.max(0.001, (conf.fireFlashSeconds || 0.18))));
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba([255,60,60], 0.95 * p);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
        ctx.strokeStyle = rgba([255,220,200], 0.85 * p);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw multiple jagged arcs (more intense)
      for(let a=0;a<6;a++){
        const alpha = 0.28 + 0.32 * Math.random();
        const width = 1.2 + Math.random() * 3.2;
        // outer blood-red glow
        ctx.strokeStyle = rgba([190,28,28], Math.min(0.95, alpha * 1.0));
        ctx.lineWidth = width * 3.2;
        ctx.beginPath();
        const segs = 12;
        for(let i=0;i<=segs;i++){
          const t = i / segs;
          const x = lerp(src.x, tgt.x, t) + (Math.sin(now*0.006 + seed + i*1.3 + a) * 12) + (Math.random()-0.5) * 20;
          const y = lerp(src.y, tgt.y, t) + (Math.cos(now*0.005 + seed + i*1.7 + a) * 12) + (Math.random()-0.5) * 20;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();

        // inner core (bright crimson)
        ctx.strokeStyle = rgba([255,120,90], Math.min(1, alpha*1.45));
        ctx.lineWidth = Math.max(0.8, width * 1.1);
        ctx.beginPath();
        for(let i=0;i<=segs;i++){
          const t = i / segs;
          const x = lerp(src.x, tgt.x, t) + (Math.sin(now*0.008 + seed + i*1.5 + a*1.5) * 6) + (Math.random()-0.5) * 8;
          const y = lerp(src.y, tgt.y, t) + (Math.cos(now*0.007 + seed + i*1.9 + a*1.5) * 6) + (Math.random()-0.5) * 8;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }

      // pulsing red/black glow on the target
      const pulse = 0.65 + 0.35 * Math.sin((now * 0.012) + (spec.seed || 0));
      const glowR = Math.max(28, (tgt.size || 18) * (1.2 + pulse));
      const g = ctx.createRadialGradient(tgt.x, tgt.y, 0, tgt.x, tgt.y, glowR);
      g.addColorStop(0, rgba([255,60,60], 0.95 * pulse));
      g.addColorStop(0.35, rgba([140,20,20], 0.55 * pulse));
      g.addColorStop(0.65, rgba([40,10,10], 0.28 * pulse));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tgt.x, tgt.y, glowR, 0, Math.PI*2); ctx.fill();

      // quick crackle sparks near target
      for(let s=0;s<3;s++){
        const a = Math.random() * Math.PI * 2;
        const r = (tgt.size || 18) * (0.6 + Math.random()*0.9);
        ctx.fillStyle = rgba([255,200,120], 0.9);
        ctx.beginPath(); ctx.arc(tgt.x + Math.cos(a)*r, tgt.y + Math.sin(a)*r, 1.2 + Math.random()*1.8, 0, Math.PI*2); ctx.fill();
      }
      // extra Blackwall-like vein flashes and dark overlay to dramatize the hack
      try{
        // bright vein flashes
        for(let v=0; v<2 + Math.floor(Math.random()*3); v++){
          const ang0 = Math.random() * Math.PI*2;
          const ang1 = ang0 + (0.6 + Math.random()*1.8) * (Math.random() > 0.5 ? 1 : -1);
          const r0 = (tgt.size || 18) * (0.45 + Math.random()*0.55);
          const r1 = (tgt.size || 18) * (0.45 + Math.random()*0.9);
          const x0 = tgt.x + Math.cos(ang0) * r0;
          const y0 = tgt.y + Math.sin(ang0) * r0;
          const x1 = tgt.x + Math.cos(ang1) * r1 + (Math.random()-0.5)*8;
          const y1 = tgt.y + Math.sin(ang1) * r1 + (Math.random()-0.5)*8;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = rgba([255,120,100], 0.6 + Math.random()*0.35);
          ctx.lineWidth = 1 + Math.random()*3;
          ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo((x0+x1)/2 + (Math.random()-0.5)*12, (y0+y1)/2 + (Math.random()-0.5)*12); ctx.lineTo(x1,y1); ctx.stroke();
          ctx.restore();
        }

        // subtle dark web overlay with thin veins
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(8,6,6,${0.06 + Math.random()*0.08})`;
        ctx.beginPath(); ctx.arc(tgt.x, tgt.y, (tgt.size || 18) * 1.08, 0, Math.PI*2); ctx.fill();
        for(let w=0; w<3; w++){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(28,8,8,${0.05 + Math.random()*0.06})`;
          ctx.lineWidth = 0.6 + Math.random()*1.6;
          const a0 = Math.random()*Math.PI*2;
          const a1 = a0 + (0.9 + Math.random()*1.6)*(Math.random()>0.5?1:-1);
          ctx.moveTo(tgt.x + Math.cos(a0)*(tgt.size||18)*0.2, tgt.y + Math.sin(a0)*(tgt.size||18)*0.2);
          ctx.lineTo(tgt.x + Math.cos(a1)*(tgt.size||18)*1.05, tgt.y + Math.sin(a1)*(tgt.size||18)*1.05);
          ctx.stroke();
        }
        ctx.restore();
      }catch(e){}
      ctx.restore();
    }catch(e){ /* swallow visual errors */ }
  });

  ctx.globalCompositeOperation = 'lighter';
  particles.forEach(p=>{
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*3);
    const core = p.core || DEFAULT_TRAIL_COLORS.core;
    const mid = p.mid || DEFAULT_TRAIL_COLORS.mid;
    g.addColorStop(0, rgba(core, 0.9 * p.life));
    g.addColorStop(0.5, rgba(mid, 0.6 * p.life));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(1,p.size*3),0,Math.PI*2); ctx.fill();
    if(p.bling){
      const glyphAlpha = Math.max(0, Math.min(1, p.life));
      const glyphSize = Math.max(11, (p.blingScale || (p.size*6)));
      ctx.save();
      ctx.translate(p.x, p.y);
      if(p.spin) ctx.rotate(p.spin);
      ctx.font = `700 ${glyphSize}px "Press Start 2P", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(255,235,150,${glyphAlpha})`;
      ctx.strokeStyle = `rgba(255,255,255,${glyphAlpha*0.85})`;
      ctx.lineWidth = Math.max(0.8, glyphSize*0.08);
      ctx.strokeText('$',0,0);
      ctx.fillText('$',0,0);
      ctx.restore();
    }
  });
  bullets.forEach(b=>{
    const style = (b.projectile && b.projectile.style) || 'default';
    if(style === 'tendrilLash'){
      const proj = b.projectile || {};
      const core = proj.core || [190,255,160];
      const mid = proj.mid || [90,210,70];
      const width = Math.max(2, proj.width || 5);

      const tgt = (b.targetRef && b.targetRef.hp > 0 && !(b.targetRef.isWarping && b.targetRef.isWarping())) ? b.targetRef : null;
      const ex = tgt ? tgt.x : ((b.endX != null) ? b.endX : (b.x + 140));
      const ey = tgt ? tgt.y : ((b.endY != null) ? b.endY : b.y);

      const dx = ex - b.x;
      const dy = ey - b.y;
      const len = Math.hypot(dx, dy) || 1;
      const px = -(dy / len);
      const py = (dx / len);
      const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const t = nowMs * 0.001;
      const segs = Math.max(6, Math.min(14, proj.segs || 10));
      const amp = Math.max(4, proj.amp || 14);

      // Make it feel like a muscular tendril (low-frequency curl, tapered thickness),
      // not electricity (high-frequency jitter + glow).
      const wobAmp = amp * (0.75 + 0.25 * Math.sin(t * 2.2 + (b.seed || 0)));
      const strands = Math.max(1, Math.min(4, proj.strands || 3));

      const pointAt = (p, phase, ampScale)=>{
        const baseX = b.x + dx * p;
        const baseY = b.y + dy * p;
        // Two slow curls mixed together; more motion toward the tip.
        const curlA = Math.sin((b.seed || 0) * 1.7 + t * 2.0 + p * 3.1 + phase);
        const curlB = Math.sin((b.seed || 0) * 0.9 + t * 1.35 + p * 1.9 - phase * 0.6);
        const curl = (curlA * 0.75 + curlB * 0.55);
        const falloff = (0.2 + 0.8 * p); // tip whips more
        const wob = curl * wobAmp * ampScale * falloff;
        return {x: baseX + px * wob, y: baseY + py * wob};
      };

      const drawStrand = (phase, ampScale, widthScale)=>{
        // Build points.
        const pts = [];
        for(let i=0;i<=segs;i++){
          const p = i / segs;
          pts.push(pointAt(p, phase, ampScale));
        }

        // Base sheath (matte-ish).
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        for(let i=0;i<segs;i++){
          const p = i / segs;
          const taper = (1 - p * 0.78);
          ctx.globalAlpha = 0.42;
          ctx.strokeStyle = rgba(mid, 0.55);
          ctx.lineWidth = Math.max(1.2, width * (2.0 * widthScale) * taper);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[i+1].x, pts[i+1].y);
          ctx.stroke();
        }

        // Inner core.
        for(let i=0;i<segs;i++){
          const p = i / segs;
          const taper = (1 - p * 0.82);
          ctx.globalAlpha = 0.75;
          ctx.strokeStyle = rgba(core, 0.7);
          ctx.lineWidth = Math.max(1, width * (1.05 * widthScale) * taper);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[i+1].x, pts[i+1].y);
          ctx.stroke();
        }

        // Subtle wet sheen (very light glow).
        ctx.globalCompositeOperation = 'lighter';
        for(let i=0;i<segs;i++){
          const p = i / segs;
          if(p < 0.15) continue;
          const taper = (1 - p * 0.85);
          ctx.globalAlpha = 0.18;
          ctx.strokeStyle = rgba(core, 0.35);
          ctx.lineWidth = Math.max(1, width * (1.6 * widthScale) * taper);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[i+1].x, pts[i+1].y);
          ctx.stroke();
        }

        ctx.restore();
        return pts;
      };

      const mainPts = drawStrand(0, 1.0, 1.0);
      if(strands >= 2) drawStrand(1.35, 0.72, 0.85);
      if(strands >= 3) drawStrand(-1.15, 0.66, 0.8);
      if(strands >= 4) drawStrand(2.2, 0.52, 0.72);

      // Suckers along the main strand.
      try{
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = rgba(core, 0.35);
        for(let i=2;i<segs-1;i++){
          if(i % 2 !== 0) continue;
          const p = i / segs;
          const s = 1 - p;
          const r = Math.max(1.0, (width * 0.38) * (0.65 + s * 0.75));
          const side = (i % 4 === 0) ? 1 : -1;
          const bx = mainPts[i].x + px * side * (r * 0.9);
          const by = mainPts[i].y + py * side * (r * 0.9);
          ctx.globalAlpha = 0.22 + 0.18 * s;
          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }catch(e){}

      // Small bio impact splash (not a big glowing zap).
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      const impact = ctx.createRadialGradient(ex, ey, 0, ex, ey, 16);
      impact.addColorStop(0, rgba(core, 0.28));
      impact.addColorStop(0.55, rgba(mid, 0.12));
      impact.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = impact;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.arc(ex, ey, 14, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else if(style === 'laserBeam' || style === 'laserShot' || style === 'shamenLaser'){
      const proj = b.projectile || {};
      const core = proj.core || [170,255,170];
      const mid = proj.mid || [80,210,110];
      const width = (style === 'shamenLaser')
        ? Math.max(1, proj.width || 2)
        : Math.max(2, proj.width || 8);
      const ex = (b.endX != null) ? b.endX : (b.x + 800);
      const ey = (b.endY != null) ? b.endY : b.y;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      // Outer glow
      ctx.strokeStyle = rgba(mid, 0.25);
      ctx.lineWidth = width * 2.4;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // Core beam
      ctx.strokeStyle = rgba(core, 0.85);
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    } else if(style === 'lightningBolt'){
      const proj = b.projectile || {};
      const core = proj.core || [235,250,255];
      const mid = proj.mid || [120,200,255];
      const accent = proj.accent || [255,210,240];
      const width = Math.max(2, proj.width || 7);
      const ex = (b.endX != null) ? b.endX : (b.x + 720);
      const ey = (b.endY != null) ? b.endY : b.y;
      const dx = ex - b.x;
      const dy = ey - b.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;
      const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const t = nowMs * 0.001;
      const segs = Math.max(7, Math.min(16, Math.floor(len / 55)));
      const amp = (6 + (width * 1.6)) * (0.85 + 0.25 * Math.sin(t * 5.0 + (b.seed || 0)));

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      const drawBolt = (strokeStyle, lineWidth, alpha)=>{
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        for(let i=1;i<segs;i++){
          const p = i / segs;
          const wob = Math.sin((b.seed || 0) + t * 11.5 + i * 2.35) * amp;
          const bx = b.x + dx * p + px * wob;
          const by = b.y + dy * p + py * wob;
          ctx.lineTo(bx, by);
        }
        ctx.lineTo(ex, ey);
        ctx.stroke();
      };

      drawBolt(rgba(mid, 0.35), width * 2.8, 0.55);
      drawBolt(rgba(core, 0.95), width * 1.15, 0.9);
      drawBolt(rgba(accent, 0.65), width * 0.75, 0.75);

      ctx.restore();
    } else if(style === 'missile' || style === 'miniTorpedo' || style === 'manifoldMissile' || style === 'manifoldShard'){
      const proj = b.projectile || {};
      const colors = proj.colors || {};
      const body = colors.body || [240,220,190];
      const stripe = colors.stripe || [140,120,95];
      const glow = colors.glow || [255,190,120];
      const angle = Math.atan2(b.dy, b.dx);
      const length = (style === 'miniTorpedo') ? (proj.length || 14) : 18;
      const width = (style === 'miniTorpedo') ? (proj.width || 5) : 6;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalAlpha = 0.95;
      // glow
      const halo = ctx.createRadialGradient(0,0,0,0,0,16);
      halo.addColorStop(0, rgba(glow, 0.55));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0,0,14,0,Math.PI*2);
      ctx.fill();
      // body
      ctx.fillStyle = rgba(body, 0.95);
      ctx.beginPath();
      ctx.moveTo(length/2, 0);
      ctx.lineTo(-length/2, width/2);
      ctx.lineTo(-length/2, -width/2);
      ctx.closePath();
      ctx.fill();
      // stripe
      ctx.strokeStyle = rgba(stripe, 0.85);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-2, -width/2 + 1);
      ctx.lineTo(-2, width/2 - 1);
      ctx.stroke();
      // exhaust cone
      const flame = ctx.createLinearGradient(-length/2-10, 0, -length/2+2, 0);
      flame.addColorStop(0, 'rgba(255,80,20,0)');
      flame.addColorStop(0.4, 'rgba(255,140,60,0.5)');
      flame.addColorStop(1, 'rgba(255,220,160,0.8)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-length/2-10, 0);
      ctx.lineTo(-length/2+2, -3);
      ctx.lineTo(-length/2+2, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if(style === 'acidGlob'){
      const radius = (b.projectile && b.projectile.radius) || 18;
      const core = (b.projectile && b.projectile.color) || [180,255,120];
      const mid = (b.projectile && b.projectile.trail) || [120,220,80];
      const pulse = 0.75 + 0.25 * Math.sin((performance.now ? performance.now() : Date.now()) * 0.01 + (b.seed || 0));
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(0,0,radius*0.2,0,0,radius*2.1);
      glow.addColorStop(0, rgba(core, 0.75));
      glow.addColorStop(0.5, rgba(mid, 0.35));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0,0,radius*2,0,Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      const body = ctx.createRadialGradient(-radius*0.25, -radius*0.25, 0, 0, 0, radius*1.2);
      body.addColorStop(0, rgba(core, 0.95));
      body.addColorStop(0.6, rgba(mid, 0.7));
      body.addColorStop(1, rgba(mid, 0.15));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0,0,radius*(0.95 + pulse*0.1),0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else if(style === 'acidOrb'){
      const radius = (b.projectile && b.projectile.radius) || 12;
      const tailLength = Math.max(24, (b.projectile && b.projectile.tailLength) || 44);
      const tailWidth = Math.max(8, (b.projectile && b.projectile.tailWidth) || (radius*1.8));
      const core = (b.projectile && b.projectile.color) || [180,255,120];
      const mid = (b.projectile && b.projectile.trail) || [120,220,80];
      const rim = (b.projectile && b.projectile.rim) || [60,160,40];
      const angle = Math.atan2(b.dy, b.dx);
      const dissolve = Math.max(0, Math.min(1, (typeof b.orbDissolve === 'number') ? b.orbDissolve : 0));
      const alpha = 0.18 + 0.82 * (1 - dissolve);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = 'lighter';

      // trailing cone
      const gradient = ctx.createLinearGradient(-tailLength, 0, 0, 0);
      gradient.addColorStop(0, rgba(rim, 0));
      gradient.addColorStop(0.45, rgba(mid, 0.35));
      gradient.addColorStop(1, rgba(mid, 0.75));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-tailLength, -tailWidth/2);
      ctx.lineTo(0, -radius*0.7);
      ctx.lineTo(0, radius*0.7);
      ctx.lineTo(-tailLength, tailWidth/2);
      ctx.closePath();
      ctx.fill();

      // orb core
      const orb = ctx.createRadialGradient(0,0,radius*0.1,0,0,radius*1.6);
      orb.addColorStop(0, rgba([255,255,255], 0.85));
      orb.addColorStop(0.25, rgba(core, 0.95));
      orb.addColorStop(0.6, rgba(mid, 0.75));
      orb.addColorStop(1, rgba(rim, 0));
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(0,0,radius*1.4,0,Math.PI*2);
      ctx.fill();

      ctx.restore();
    } else if(style === 'daemonOrb'){
      const proj = b.projectile || {};
      const radius = Math.max(6, proj.radius || 11);
      const core = proj.core || [235,210,255];
      const mid = proj.mid || [170,90,255];
      const rim = proj.rim || [80,30,160];
      const tNow = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const pulse = 0.75 + 0.25 * Math.sin(tNow * 0.010 + (b.seed || 0));
      const daemonSprite = ensureDaemonSpriteLoaded(DAEMON_ORB_SPRITE_KEY, DAEMON_ORB_SPRITE_SRC);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalCompositeOperation = 'lighter';
      const halo = ctx.createRadialGradient(0,0,0,0,0, radius*3.2);
      halo.addColorStop(0, rgba(core, 0.55 * pulse));
      halo.addColorStop(0.5, rgba(mid, 0.25 * pulse));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0,0,radius*2.8,0,Math.PI*2);
      ctx.fill();

      if(daemonSprite && daemonSprite.width && daemonSprite.height){
        ctx.globalCompositeOperation = 'source-over';
        const targetSize = radius * 2.6;
        const scale = targetSize / Math.max(1, Math.max(daemonSprite.width, daemonSprite.height));
        const w = daemonSprite.width * scale;
        const h = daemonSprite.height * scale;
        const ang = Math.atan2(b.dy, b.dx) || 0;
        ctx.rotate(ang + Math.PI/2);
        ctx.globalAlpha = 0.95;
        ctx.drawImage(daemonSprite, -w/2, -h/2, w, h);
      } else {
        const body = ctx.createRadialGradient(-radius*0.2, -radius*0.2, 0, 0, 0, radius*1.35);
        body.addColorStop(0, rgba([255,255,255], 0.7));
        body.addColorStop(0.25, rgba(core, 0.95));
        body.addColorStop(0.6, rgba(mid, 0.75));
        body.addColorStop(1, rgba(rim, 0.15));
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(0,0,radius*(0.95 + pulse*0.08),0,Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    } else if(style === 'crystalShard'){
      const proj = b.projectile || {};
      const angle = Math.atan2(b.dy, b.dx);
      const length = Math.max(18, proj.length || 26);
      const width = Math.max(3, proj.width || 7);
      const core = proj.core || [220,250,255];
      const mid = proj.mid || [120,210,255];
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';
      const grad = ctx.createLinearGradient(-length/2,0,length/2,0);
      grad.addColorStop(0, rgba(mid, 0));
      grad.addColorStop(0.35, rgba(mid, 0.55));
      grad.addColorStop(0.7, rgba(core, 0.95));
      grad.addColorStop(1, rgba(core, 0.2));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(length/2, 0);
      ctx.lineTo(0, -width/2);
      ctx.lineTo(-length/2, 0);
      ctx.lineTo(0, width/2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if(style === 'crystalShrapnel'){
      const proj = b.projectile || {};
      const angle = Math.atan2(b.dy, b.dx);
      const length = Math.max(8, proj.length || 12);
      const width = Math.max(1.2, proj.width || 2.2);
      const core = proj.core || [245,255,255];
      const mid = proj.mid || [160,235,255];
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';
      const grad = ctx.createLinearGradient(-length/2,0,length/2,0);
      grad.addColorStop(0, rgba(mid, 0));
      grad.addColorStop(0.35, rgba(mid, 0.55));
      grad.addColorStop(1, rgba(core, 0.9));
      ctx.fillStyle = grad;
      ctx.fillRect(-length/2, -width/2, length, width);
      ctx.restore();
    } else if(style === 'plasmaBolt'){
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
    } else if(style === 'bullet'){
      const proj = b.projectile || {};
      const length = Math.max(10, proj.length || 22);
      const width = Math.max(1.5, proj.width || 3);
      const core = proj.core || [255,245,220];
      const mid = proj.mid || [255,200,90];
      const angle = Math.atan2(b.dy, b.dx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';

      // streak
      const streak = ctx.createLinearGradient(-length, 0, 0, 0);
      streak.addColorStop(0, rgba(mid, 0));
      streak.addColorStop(0.4, rgba(mid, 0.35));
      streak.addColorStop(1, rgba(core, 0.9));
      ctx.fillStyle = streak;
      ctx.fillRect(-length, -width/2, length, width);

      // tip glow
      const halo = ctx.createRadialGradient(0,0,0,0,0, 10);
      halo.addColorStop(0, rgba(core, 0.8));
      halo.addColorStop(0.5, rgba(mid, 0.25));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0,0,9,0,Math.PI*2);
      ctx.fill();

      ctx.restore();
    } else if(style === 'mine'){
      const proj = b.projectile || {};
      const radius = Math.max(6, proj.radius || 10);
      const shell = proj.shell || [110, 75, 45];
      const core = proj.core || [255, 235, 190];
      const tNow = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const pulse = 0.75 + 0.25 * Math.sin(tNow * 0.012 + (b.seed || 0));

      const isTaftianMine = (b.raceId === 'taftian');
      const isArming = isTaftianMine && (typeof b.mineArmingUntilMs === 'number') && tNow < b.mineArmingUntilMs;
      const mineSprite = isTaftianMine
        ? ensureMineSpriteLoaded(
            isArming ? TAFTIAN_MINE_ARMING_SPRITE_KEY : TAFTIAN_MINE_DEPLOYED_SPRITE_KEY,
            isArming ? TAFTIAN_MINE_ARMING_SPRITE_SRC : TAFTIAN_MINE_DEPLOYED_SPRITE_SRC
          )
        : null;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalCompositeOperation = 'lighter';
      const halo = ctx.createRadialGradient(0,0,0,0,0, radius*3.2);
      halo.addColorStop(0, rgba(core, 0.55 * pulse));
      halo.addColorStop(0.6, rgba(core, 0.18 * pulse));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0,0,radius*2.8,0,Math.PI*2);
      ctx.fill();

      if(mineSprite && mineSprite.width && mineSprite.height){
        ctx.globalCompositeOperation = 'source-over';
        const targetH = radius * 2.4;
        const scale = targetH / Math.max(1, mineSprite.height);
        const w = mineSprite.width * scale;
        const h = mineSprite.height * scale;
        ctx.globalAlpha = 0.98;
        ctx.drawImage(mineSprite, -w/2, -h/2, w, h);
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = rgba(shell, 0.92);
        ctx.beginPath();
        ctx.arc(0,0,radius,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle = rgba(core, 0.85);
        ctx.beginPath();
        ctx.arc(radius*0.25, -radius*0.2, Math.max(2, radius*0.28), 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    } else if(style === 'parasitePod'){
      const radius = (b.projectile && b.projectile.radius) || 8;
      const core = (b.projectile && b.projectile.core) || [170,255,150];
      const mid = (b.projectile && b.projectile.mid) || [80,210,80];
      const tail = (b.projectile && b.projectile.tail) || [30,120,45];
      const angle = Math.atan2(b.dy, b.dx);
      const pulse = 0.82 + 0.18 * Math.sin(((performance.now ? performance.now() : Date.now()) * 0.012) + (b.seed || 0));
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';
      // glow
      const halo = ctx.createRadialGradient(0,0,0,0,0, radius*3.1);
      halo.addColorStop(0, rgba(core, 0.55));
      halo.addColorStop(0.55, rgba(mid, 0.22));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0,0,radius*2.6,0,Math.PI*2);
      ctx.fill();
      // body
      ctx.globalCompositeOperation = 'source-over';
      const body = ctx.createLinearGradient(-radius*1.2,0,radius*1.2,0);
      body.addColorStop(0, rgba(tail, 0.25));
      body.addColorStop(0.45, rgba(mid, 0.75));
      body.addColorStop(1, rgba(core, 0.95));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0,0,radius*(1.35 + pulse*0.1),radius*(0.95 + pulse*0.08),0,0,Math.PI*2);
      ctx.fill();
      // small "seed" dot
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba(core, 0.9);
      ctx.beginPath();
      ctx.arc(radius*0.35, 0, Math.max(1.2, radius*0.22), 0, Math.PI*2);
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
    } else if(style === 'boringBall'){
      const baseRadius = (b.projectile && b.projectile.radius) || 14;
      const col = (b.projectile && b.projectile.color) || [120,255,120];
      const tNow = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const pulse = 0.85 + 0.2 * Math.sin(tNow * 0.02 + (b.seed || 0));
      const radius = baseRadius * pulse;
      const angle = Math.atan2(b.dy, b.dx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';

      // trailing haze
      const tailLen = 34 + baseRadius * 1.2;
      const tailW = 18 + baseRadius * 0.6;
      const tail = ctx.createLinearGradient(-tailLen, 0, 0, 0);
      tail.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      tail.addColorStop(0.35, `rgba(${col[0]},${col[1]},${col[2]},0.25)`);
      tail.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0.65)`);
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.moveTo(-tailLen, -tailW/2);
      ctx.lineTo(0, -radius*0.6);
      ctx.lineTo(0, radius*0.6);
      ctx.lineTo(-tailLen, tailW/2);
      ctx.closePath();
      ctx.fill();

      // core orb
      const glow = ctx.createRadialGradient(0,0,0,0,0,radius*2.2);
      glow.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.95)`);
      glow.addColorStop(0.45, `rgba(${col[0]},${col[1]},${col[2]},0.45)`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0,0,radius*1.8,0,Math.PI*2);
      ctx.fill();
      const body = ctx.createRadialGradient(-radius*0.25,-radius*0.25,0,0,0,radius*1.15);
      body.addColorStop(0, `rgba(255,255,255,0.95)`);
      body.addColorStop(0.25, `rgba(${col[0]},${col[1]},${col[2]},0.85)`);
      body.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0.15)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0,0,radius,0,Math.PI*2);
      ctx.fill();

      ctx.restore();
    } else if(style === 'lifePellet'){
      const proj = b.projectile || {};
      const core = proj.core || [255,240,140];
      const mid = proj.mid || [255,210,90];
      const tail = proj.tail || [200,160,60];
      const width = Math.max(1, proj.width || 2);
      const angle = Math.atan2(b.dy, b.dx);
      const flightLen = Math.max(12, ((proj.speed || 600) * Math.max(0.08, (b.ttl || 0.4))) );
      const drawLen = Math.min(proj.drawLength || 18, flightLen);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';
      // soft outer glow
      ctx.strokeStyle = rgba(mid, 0.18);
      ctx.lineWidth = width * 3.2;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(drawLen,0); ctx.stroke();
      // core thin bright line
      ctx.strokeStyle = rgba(core, 0.98);
      ctx.lineWidth = Math.max(1, width * 0.9);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(drawLen,0); ctx.stroke();
      // small tail accent
      ctx.strokeStyle = rgba(tail, 0.45);
      ctx.lineWidth = Math.max(0.5, width * 0.5);
      ctx.beginPath(); ctx.moveTo(drawLen*0.5,0); ctx.lineTo(drawLen,0); ctx.stroke();
      ctx.restore();
    } else if(style === 'sniperBolt'){
      const proj = b.projectile || {};
      const core = proj.core || [120,255,120];
      const mid = proj.mid || [60,200,90];
      const tail = proj.tail || [20,60,20];
      const width = Math.max(1, proj.width || 3);
      const angle = Math.atan2(b.dy, b.dx);
      // derive flight length from speed/ttl, but cap the drawn streak
      const flightLen = Math.max(24, ((proj.speed || 600) * Math.max(0.2, (b.ttl || 0.8))) );
      const drawLen = Math.min(proj.drawLength || 48, flightLen);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';
      // Outer soft glow
      ctx.strokeStyle = rgba(mid, 0.18);
      ctx.lineWidth = width * 4.2;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(drawLen,0); ctx.stroke();
      // core line
      ctx.strokeStyle = rgba(core, 0.95);
      ctx.lineWidth = Math.max(1, width);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(drawLen,0); ctx.stroke();
      // faint tail shimmer
      ctx.strokeStyle = rgba(tail, 0.45);
      ctx.lineWidth = Math.max(0.6, width * 0.6);
      ctx.beginPath(); ctx.moveTo(drawLen*0.4,0); ctx.lineTo(drawLen,0); ctx.stroke();
      ctx.restore();
    } else if(style === 'fireball'){
      const radius = (b.projectile && b.projectile.radius) || 10;
      const tailLength = Math.max(26, (b.projectile && b.projectile.tailLength) || 58);
      const tailWidth = Math.max(10, (b.projectile && b.projectile.tailWidth) || 22);
      const core = (b.projectile && b.projectile.core) || [255,230,170];
      const mid = (b.projectile && b.projectile.mid) || [255,150,70];
      const rim = (b.projectile && b.projectile.rim) || [190,70,20];
      const angle = Math.atan2(b.dy, b.dx);
      const pulse = 0.82 + 0.22 * Math.sin((performance.now ? performance.now() : Date.now()) * 0.016 + (b.seed || 0));
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'lighter';

      // Flame tail.
      const tail = ctx.createLinearGradient(-tailLength, 0, 0, 0);
      tail.addColorStop(0, rgba(rim, 0));
      tail.addColorStop(0.25, rgba(rim, 0.22));
      tail.addColorStop(0.6, rgba(mid, 0.55));
      tail.addColorStop(1, rgba(mid, 0.85));
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.moveTo(-tailLength, -tailWidth/2);
      ctx.lineTo(0, -radius*0.75);
      ctx.lineTo(0, radius*0.75);
      ctx.lineTo(-tailLength, tailWidth/2);
      ctx.closePath();
      ctx.fill();

      // Outer glow.
      const glow = ctx.createRadialGradient(0,0,0,0,0,radius*2.35);
      glow.addColorStop(0, rgba(mid, 0.75));
      glow.addColorStop(0.45, rgba(rim, 0.25));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0,0,radius*2.1,0,Math.PI*2);
      ctx.fill();

      // Core orb.
      const orb = ctx.createRadialGradient(-radius*0.18, -radius*0.18, 0, 0, 0, radius*1.25);
      orb.addColorStop(0, rgba(core, 0.98));
      orb.addColorStop(0.45, rgba(mid, 0.9));
      orb.addColorStop(1, rgba(rim, 0.35));
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(0,0,radius*(0.95 + pulse*0.1),0,Math.PI*2);
      ctx.fill();

      // Hot rim stroke.
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = rgba(rim, 0.65);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0,0,radius*(0.9 + pulse*0.06),0,Math.PI*2);
      ctx.stroke();

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

  drawHorrorStaticOverlay(ctx);
  drawHorrorRunText(ctx);

  // Devistan RGB overlay (global cinematic RGB tint)
  try{ drawDevistanRgbOverlay(ctx); }catch(e){}

  drawBlackgridMatrixEdgeOverlay(ctx);

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

  // Deathousemen victory track: fade out with the screen, then cut hard.
  if(activeVictoryClip && activeVictoryRace === 'deathousemen'){
    const baseVol = 0.9;
    const vol = baseVol * Math.max(0, Math.min(1, 1 - fadeProgress));
    try{ activeVictoryClip.volume = vol; }catch(err){}
    if(fadeProgress >= 0.999){
      stopActiveVictorySound('deathousemen');
    }
  }

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
  drawPaused();
});
