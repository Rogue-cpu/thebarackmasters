(() => {
  'use strict';

  const menuStoryBtn = document.getElementById('menu-story');
  const intro = document.getElementById('story-intro');
  const introVideo = document.getElementById('story-intro-video');
  const introStatus = document.getElementById('story-intro-status');
  const introPlayBtn = document.getElementById('story-intro-play');
  const screen = document.getElementById('story-screen');
  const canvas = document.getElementById('story-canvas');
  const returnBtn = document.getElementById('story-return-menu');
  if(!menuStoryBtn || !intro || !introVideo || !screen || !canvas) return;

  const ctx = canvas.getContext('2d');
  const systemLabel = screen.querySelector('.story-system-label span');
  const systemSubLabel = screen.querySelector('.story-system-label small');
  const controlsLabel = screen.querySelector('.story-controls');
  const interaction = document.getElementById('story-interaction');
  const fuelFill = document.getElementById('story-fuel-fill');
  const fuelLabel = document.getElementById('story-fuel-label');
  const dayLabel = document.getElementById('story-day');
  const distanceTitle = document.getElementById('story-distance-label');
  const distanceLabel = document.getElementById('story-distance');
  const missionTitle = document.getElementById('story-mission-title');
  const missionText = document.getElementById('story-mission-text');
  const log = document.getElementById('story-log');
  const navButtons = Array.from(screen.querySelectorAll('[data-story-panel]'));
  const storyNavMenu = screen.querySelector('.story-nav-menu');
  const planetOpsMenu = document.getElementById('planet-ops-menu');
  const planetOpsButtons = Array.from(screen.querySelectorAll('[data-planet-action]'));
  const starbaseMenu = document.getElementById('starbase-cinematic-menu');
  const starbaseButtons = Array.from(screen.querySelectorAll('[data-starbase-action]'));
  const shipyardScreen = document.getElementById('shipyard-screen');
  const shipyardPreview = document.getElementById('shipyard-preview');
  const shipyardDockName = document.getElementById('shipyard-dock-name');
  const shipyardBays = document.getElementById('shipyard-bays');
  const shipyardPrev = document.getElementById('shipyard-prev');
  const shipyardNext = document.getElementById('shipyard-next');
  const shipyardShipName = document.getElementById('shipyard-ship-name');
  const shipyardShipClass = document.getElementById('shipyard-ship-class');
  const shipyardShipCost = document.getElementById('shipyard-ship-cost');
  const shipyardCredits = document.getElementById('shipyard-credits');
  const shipyardStatus = document.getElementById('shipyard-status');
  const shipyardBuild = document.getElementById('shipyard-build');
  const shipyardReturn = document.getElementById('shipyard-return');
  const outfitScreen = document.getElementById('outfit-screen');
  const outfitSlots = document.getElementById('outfit-slots');
  const outfitPrev = document.getElementById('outfit-prev');
  const outfitNext = document.getElementById('outfit-next');
  const outfitModuleName = document.getElementById('outfit-module-name');
  const outfitModuleDescription = document.getElementById('outfit-module-description');
  const outfitModuleCost = document.getElementById('outfit-module-cost');
  const outfitCredits = document.getElementById('outfit-credits');
  const outfitStatus = document.getElementById('outfit-status');
  const outfitInstall = document.getElementById('outfit-install');
  const outfitReturn = document.getElementById('outfit-return');
  const outfitStatSpeed = document.getElementById('outfit-stat-speed');
  const outfitStatTurn = document.getElementById('outfit-stat-turn');
  const outfitStatWeapon = document.getElementById('outfit-stat-weapon');
  const outfitStatFuel = document.getElementById('outfit-stat-fuel');

  const TWO_PI = Math.PI * 2;
  const SYSTEM_EDGE = 760;
  const SYSTEM_TILT = 0.46;
  const PLANET_EDGE = 245;
  const PLANET_TILT = 0.56;
  const EARTH_STARBASE = {x:142,y:-58,radius:18};
  const PLANET_SCAN_DURATION = 2.8;
  const PLANET_REVEAL_DURATION = 1.35;
  const HYPER_FUEL_PER_UNIT = 0.12;
  const BASE_TURN_RATE = 0.82;
  const LANDER_MAX_CREW = 12;
  const LANDER_STORAGE_CAPACITY = 50;
  const LANDER_SHOT_COOLDOWN = 0.28;
  const STARMAP_BOUNDS = {left:-2050,right:1950,top:-1500,bottom:1500};
  const SCAN_COLORS = {mineral:'#ff3624',energy:'#b84dff',biological:'#3dff62'};
  const SCAN_RGB = {mineral:'255,54,36',energy:'184,77,255',biological:'61,255,98'};
  const MAX_ESCORTS = 12;
  const MAX_MODULES = 10;
  const OUTFIT_MODULES = [
    {id:'fuelTanks',name:'FUEL TANK',short:'FUEL',cost:20,description:'Adds 25 units to maximum fuel capacity.'},
    {id:'dynamos',name:'DYNAMO UNIT',short:'DYN',cost:35,description:'Regenerates fuel and reduces drive consumption.'},
    {id:'thrusters',name:'HIGH-EFFICIENCY THRUSTER',short:'THR',cost:30,description:'Increases acceleration and maximum velocity by 10%.'},
    {id:'turningJets',name:'TURNING JETS',short:'JET',cost:25,description:'Increases the flagship turning rate by 10%.'},
    {id:'weapons',name:'ION-BOLT GUN',short:'GUN',cost:40,description:'Increases flagship weapon power by 20%.'}
  ];
  const MINERAL_CATEGORIES = [
    {name:'Common',value:1,weight:30,color:'#8fd8ff',materials:['Hydrogen','Helium','Carbon','Nitrogen','Silicon','Phosphorus','Selenium','Methane','Ammonia','Water']},
    {name:'Corrosive',value:2,weight:17,color:'#66ff6c',materials:['Oxygen','Fluorine','Sulfur','Chlorine','Bromine','Iodine']},
    {name:'Base Metal',value:3,weight:25,color:'#ff9f43',materials:['Beryllium','Sodium','Aluminum','Titanium','Chromium','Iron','Cobalt','Nickel','Copper','Zinc','Tungsten','Lead']},
    {name:'Noble Gas',value:4,weight:9,color:'#4de9ff',materials:['Neon','Argon','Krypton','Xenon','Radon']},
    {name:'Rare Earth',value:5,weight:8,color:'#65ffbd',materials:['Lanthanum','Cerium','Neodymium','Promethium','Samarium','Gadolinium','Terbium','Holmium','Ytterbium']},
    {name:'Precious',value:6,weight:6,color:'#ffe45c',materials:['Palladium','Silver','Iridium','Platinum','Gold']},
    {name:'Radioactive',value:8,weight:4,color:'#ff5bea',materials:['Technetium','Polonium','Radium','Thorium','Uranium','Neptunium','Plutonium']},
    {name:'Exotic',value:25,weight:1,color:'#ffffff',materials:['Neutronium','Magnetic Monopoles','Degenerate Matter','Antimatter','Tzo Crystals']}
  ];
  const keys = { thrust:false, left:false, right:false, reverse:false };
  const bodies = [
    {name:'MERCURY', orbit:82, radius:4, color:'#a9a19a', speed:0.34, phase:2.5, moons:[]},
    {name:'VENUS', orbit:126, radius:7, color:'#e4a84d', speed:0.24, phase:4.3, moons:[]},
    {name:'EARTH', orbit:184, radius:8, color:'#3a91ef', speed:0.19, phase:0.55, moons:[{name:'MOON',color:'#b9bec5'}]},
    {name:'MARS', orbit:247, radius:6, color:'#cf5534', speed:0.15, phase:5.4, moons:[{name:'PHOBOS',color:'#938176'},{name:'DEIMOS',color:'#afa39a'}]},
    {name:'JUPITER', orbit:360, radius:16, color:'#d99b63', speed:0.085, phase:3.1, moons:[{name:'IO',color:'#e8c85c'},{name:'EUROPA',color:'#cfc3a0'},{name:'GANYMEDE',color:'#908576'},{name:'CALLISTO',color:'#665f59'}]},
    {name:'SATURN', orbit:475, radius:14, color:'#dec77e', speed:0.061, phase:1.75, rings:true, moons:[{name:'MIMAS',color:'#bab7ae'},{name:'ENCELADUS',color:'#e5ebec'},{name:'TETHYS',color:'#c8c8c0'},{name:'DIONE',color:'#aaa79f'},{name:'RHEA',color:'#8f8d87'},{name:'TITAN',color:'#d69c42'},{name:'IAPETUS',color:'#77716b'}]},
    {name:'URANUS', orbit:575, radius:10, color:'#78d7dd', speed:0.043, phase:4.7, moons:[{name:'MIRANDA',color:'#a6a7a3'},{name:'ARIEL',color:'#c9c9c2'},{name:'UMBRIEL',color:'#6f7272'},{name:'TITANIA',color:'#9e9188'},{name:'OBERON',color:'#756c68'}]},
    {name:'NEPTUNE', orbit:670, radius:10, color:'#4d70e8', speed:0.034, phase:2.15, moons:[{name:'TRITON',color:'#d2b8a2'},{name:'NEREID',color:'#8d9295'}]}
  ];
  const planetProfiles = {
    MERCURY:{orbit:'0.39 AU',atmo:'TRACE',temp:'167° C',weather:'CLASS 0',tectonics:'CLASS 1',mass:'0.055 E.S.',radius:'0.383 E.S.',gravity:'0.38 G',day:'58.6 DAYS',tilt:'0.03°',landable:true,palette:['#402f28','#795343','#b37b55','#d6a473'],counts:{mineral:8,biological:0,energy:1}},
    VENUS:{orbit:'0.72 AU',atmo:'92.0 ATM',temp:'464° C',weather:'CLASS 8',tectonics:'CLASS 5',mass:'0.815 E.S.',radius:'0.949 E.S.',gravity:'0.90 G',day:'243 DAYS',tilt:'177°',landable:true,palette:['#6f321c','#a74e20','#d98632','#f0c267'],counts:{mineral:7,biological:0,energy:2}},
    EARTH:{orbit:'1.00 AU',atmo:'1.00 ATM',temp:'15° C',weather:'CLASS 4',tectonics:'CLASS 3',mass:'1.000 E.S.',radius:'1.000 E.S.',gravity:'1.00 G',day:'1.00 DAY',tilt:'23.4°',landable:true,palette:['#073c72','#1265a0','#218c50','#91a85b','#d5d2b1'],counts:{mineral:6,biological:8,energy:5}},
    MARS:{orbit:'1.52 AU',atmo:'0.006 ATM',temp:'-63° C',weather:'CLASS 3',tectonics:'CLASS 2',mass:'0.107 E.S.',radius:'0.532 E.S.',gravity:'0.38 G',day:'1.03 DAYS',tilt:'25.2°',landable:true,palette:['#4c241b','#783421','#a44b27','#cd7544','#e09b68'],counts:{mineral:9,biological:1,energy:3}},
    JUPITER:{orbit:'5.20 AU',atmo:'>1000 ATM',temp:'-110° C',weather:'CLASS 10',tectonics:'N/A',mass:'317.8 E.S.',radius:'11.21 E.S.',gravity:'2.53 G',day:'0.41 DAYS',tilt:'3.1°',landable:false,palette:['#6d4637','#bd7b55','#e4be84','#eee0bd'],counts:{mineral:0,biological:0,energy:2}},
    SATURN:{orbit:'9.58 AU',atmo:'>1000 ATM',temp:'-140° C',weather:'CLASS 9',tectonics:'N/A',mass:'95.2 E.S.',radius:'9.45 E.S.',gravity:'1.07 G',day:'0.45 DAYS',tilt:'26.7°',landable:false,palette:['#765c3b','#c29b61','#e4ce94','#f3e6b7'],counts:{mineral:0,biological:0,energy:1}},
    URANUS:{orbit:'19.2 AU',atmo:'>1000 ATM',temp:'-195° C',weather:'CLASS 7',tectonics:'N/A',mass:'14.5 E.S.',radius:'4.01 E.S.',gravity:'0.89 G',day:'0.72 DAYS',tilt:'97.8°',landable:false,palette:['#286f7e','#4fa9b5','#82d7dc','#c4f3ef'],counts:{mineral:0,biological:0,energy:1}},
    NEPTUNE:{orbit:'30.1 AU',atmo:'>1000 ATM',temp:'-200° C',weather:'CLASS 9',tectonics:'N/A',mass:'17.1 E.S.',radius:'3.88 E.S.',gravity:'1.14 G',day:'0.67 DAYS',tilt:'28.3°',landable:false,palette:['#162c7a','#244fb0','#3c75d8','#7ba5ef'],counts:{mineral:0,biological:0,energy:2}}
  };
  const lostShip = {x:548, y:-302, name:'PIONEER ONE'};
  const hyperspaceStars = [
    {name:'SOL', x:-1150, y:650, color:'#ffe06b', size:2.2, available:true},
    {name:'ALPHA CENTAURI', x:-1580, y:395, color:'#ffb15c', size:1.9, available:true},
    {name:'SIRIUS', x:-630, y:960, color:'#b7d8ff', size:2.1, available:true},
    {name:'EPSILON ERIDANI', x:-540, y:230, color:'#ff755e', size:1.7, available:true},
    {name:'TAU CETI', x:-1800, y:1040, color:'#fff0a1', size:1.7, available:true}
  ];
  const extraSystemBodies = {
    'ALPHA CENTAURI':[
      {name:'PROXIMA I',orbit:118,radius:6,color:'#b94c32',speed:0.27,phase:1.2,moons:[]},
      {name:'CHIRON',orbit:225,radius:9,color:'#5490bc',speed:0.15,phase:4.1,moons:[{name:'CHIRON MOON',color:'#aab2b5'}]},
      {name:'HELIOS',orbit:382,radius:13,color:'#c49757',speed:0.08,phase:2.7,rings:true,moons:[]}
    ],
    'SIRIUS':[
      {name:'SIRIUS I',orbit:102,radius:5,color:'#9d7a60',speed:0.31,phase:3.5,moons:[]},
      {name:'PELAGOS',orbit:206,radius:10,color:'#3378c8',speed:0.16,phase:0.8,moons:[{name:'NEREA',color:'#c0c6ca'}]},
      {name:'SIRIUS III',orbit:348,radius:12,color:'#755b92',speed:0.09,phase:5.2,moons:[]}
    ],
    'EPSILON ERIDANI':[
      {name:'ERIDANI I',orbit:135,radius:7,color:'#d16a3f',speed:0.24,phase:2.1,moons:[]},
      {name:'VERDANT',orbit:268,radius:9,color:'#55a36d',speed:0.13,phase:4.8,moons:[{name:'SEED',color:'#9aa59d'}]}
    ],
    'TAU CETI':[
      {name:'CETI I',orbit:92,radius:4,color:'#b0a58d',speed:0.33,phase:0.4,moons:[]},
      {name:'OCEANA',orbit:188,radius:9,color:'#287cb3',speed:0.18,phase:3.3,moons:[{name:'TIDE',color:'#d0d2cc'}]},
      {name:'CETI III',orbit:318,radius:11,color:'#b07048',speed:0.10,phase:5.7,rings:true,moons:[]}
    ]
  };
  Object.values(extraSystemBodies).flat().forEach((body,index)=>{
    if(planetProfiles[body.name]) return;
    const landable=body.radius<12;
    planetProfiles[body.name]={
      orbit:`${(body.orbit/184).toFixed(2)} AU`,atmo:landable?'0.74 ATM':'>100 ATM',temp:`${-90+(index*37)%210}° C`,weather:`CLASS ${1+index%7}`,tectonics:`CLASS ${1+index%5}`,
      mass:`${(body.radius/8).toFixed(2)} E.S.`,radius:`${(body.radius/8).toFixed(2)} E.S.`,gravity:`${Math.max(.18,body.radius/10).toFixed(2)} G`,day:`${(.7+(index%8)*.31).toFixed(2)} DAYS`,tilt:`${3+(index*11)%48}°`,landable,
      palette:[body.color,'#234b52','#729069','#c2b886','#d6d5c4'],counts:{mineral:5+index%5,biological:landable?index%6:0,energy:1+index%3}
    };
  });

  let introRunning = false;
  let introFinishing = false;
  let storyActive = false;
  let frameId = 0;
  let lastTime = 0;
  let viewWidth = 1;
  let viewHeight = 1;
  let pixelRatio = 1;
  let starfield = [];
  let hyperspaceDust = [];
  let starmapField = [];
  const terrainCache = {};
  const generatedSystemCache = {};
  const flagshipSprite = new Image();
  flagshipSprite.src = 'assets/story/vanguard-flagship.png';
  const FLAGSHIP_SPRITE_ROTATION = Math.PI/2;
  const planetLanderSprite = new Image();
  planetLanderSprite.src = 'assets/story/planet-lander.png';
  const descendingLanderSprite = new Image();
  descendingLanderSprite.src = 'assets/story/lander-descending.png';
  const shipyardTheme = new Audio('assets/music/shipyard-theme.mp3');
  shipyardTheme.loop = true;
  const starbaseTheme = new Audio('assets/music/starbase-theme.mp3');
  starbaseTheme.loop = true;
  const orbitThemes = [1,2,3,4,5].map(index=>{
    const theme=new Audio(`assets/music/orbit-${index}.mp3`);
    theme.preload='metadata';
    return theme;
  });
  let activeOrbitTheme = null;
  let activeOrbitThemeIndex = -1;
  const spaceTheme = new Audio('assets/music/space-theme.mp3');
  spaceTheme.loop = true;
  spaceTheme.preload = 'metadata';
  const landerSfx = {
    launch:'assets/sfx/lander-launch.wav',
    return:'assets/sfx/lander-return.wav',
    shot:'assets/sfx/lander-shot.wav',
    pickup:'assets/sfx/lander-pickup.wav',
    bio:'assets/sfx/lander-bio.wav',
    pain:'assets/sfx/lander-pain.wav',
    bite:'assets/sfx/lander-bite.wav',
    death:'assets/sfx/lander-death.wav'
  };

  const state = {
    mode:'system',
    currentSystem:'SOL',
    starmapReturnMode:'system',
    starmapSelection:null,
    autopilotTarget:null,
    autopilotFuelWarning:false,
    elapsed:0,
    day:1,
    fuel:100,
    maxFuel:100,
    missionStage:0,
    transitionLock:0,
    messageTimer:0,
    player:{x:215,y:112,vx:0,vy:0,angle:-0.45},
    hyper:{x:0,y:0,vx:0,vy:0,angle:0},
    planet:null,
    planetShip:{x:0,y:205,vx:0,vy:-18,angle:-Math.PI/2},
    scans:{mineral:false,biological:false,energy:false},
    planetSurveys:{},
    scanAnimation:{type:null,elapsed:0,queue:[]},
    surfaceNodes:[],
    planetRevealTimer:0,
    planetRevealReady:false,
    landingTimer:0,
    takeoffTimer:0,
    takeoffOrigin:{x:0.5,y:0.5},
    surfaceFade:0,
    lander:{x:0.5,y:0.5,angle:-Math.PI/2},
    landerCrew:LANDER_MAX_CREW,
    landerStorageUsed:0,
    landerHold:[],
    landerShots:[],
    landerShotCooldown:0,
    landerDamageFlash:0,
    landerDestroyed:false,
    landerDeathTimer:0,
    collected:{mineral:0,biological:0,energy:0},
    mineralCargo:{},
    cargoTradeValue:0,
    credits:0,
    constructedShips:[],
    shipyardIndex:0,
    shipyardBuilding:false,
    outfitIndex:0,
    installedModules:[],
    upgrades:{fuelTanks:0,dynamos:0,thrusters:0,turningJets:0,weapons:0},
    starbaseNotice:'',
    pickupNotices:[]
  };

  function seededNoise(index){
    const value = Math.sin(index * 971.17 + 17.31) * 43758.5453;
    return value - Math.floor(value);
  }

  function planetSeed(name){
    return Array.from(name||'PLANET').reduce((sum,char)=>sum+char.charCodeAt(0)*17,0);
  }

  function getPlanetProfile(){
    return state.planet ? planetProfiles[state.planet.name] : null;
  }

  function pickMineral(seed){
    const totalWeight=MINERAL_CATEGORIES.reduce((sum,category)=>sum+category.weight,0);
    let roll=seededNoise(seed+811)*totalWeight;
    let category=MINERAL_CATEGORIES[0];
    for(const candidate of MINERAL_CATEGORIES){
      roll-=candidate.weight;
      if(roll<=0){category=candidate;break;}
    }
    const materialIndex=Math.floor(seededNoise(seed+977)*category.materials.length)%category.materials.length;
    return {material:category.materials[materialIndex],category:category.name,unitValue:category.value,color:category.color};
  }

  function buildSurfaceNodes(body){
    const profile = planetProfiles[body.name];
    const nodes = [];
    let sequence = planetSeed(body.name);
    ['mineral','biological','energy'].forEach((type,typeIndex)=>{
      const count = profile.counts[type] || 0;
      for(let i=0;i<count;i++){
        sequence += 13;
        const mineral=type==='mineral'?pickMineral(sequence+typeIndex*101):null;
        nodes.push({
          type,
          x:0.08+seededNoise(sequence+typeIndex*101)*0.84,
          y:0.08+seededNoise(sequence+typeIndex*101+1)*0.84,
          collected:false,
          value:1+Math.floor(seededNoise(sequence+7)*4),
          hp:type==='biological'?2+Math.floor(seededNoise(sequence+19)*2):0,
          defeated:false,
          attackCooldown:.4+seededNoise(sequence+23),
          heading:seededNoise(sequence+29)*TWO_PI,
          ...(mineral||{})
        });
      }
    });
    return nodes;
  }

  function setPlanetOpsVisible(visible){
    screen.classList.remove('starbase-cinematic-active');
    if(storyNavMenu) storyNavMenu.classList.toggle('hidden',visible);
    if(planetOpsMenu) planetOpsMenu.classList.toggle('hidden',!visible);
    if(starbaseMenu) starbaseMenu.classList.add('hidden');
    if(shipyardScreen) shipyardScreen.classList.add('hidden');
    if(outfitScreen) outfitScreen.classList.add('hidden');
  }

  function setStarbaseMenuVisible(visible){
    screen.classList.toggle('starbase-cinematic-active',visible);
    if(storyNavMenu) storyNavMenu.classList.toggle('hidden',visible);
    if(planetOpsMenu) planetOpsMenu.classList.add('hidden');
    if(starbaseMenu) starbaseMenu.classList.toggle('hidden',!visible);
    if(shipyardScreen) shipyardScreen.classList.add('hidden');
    if(outfitScreen) outfitScreen.classList.add('hidden');
    requestAnimationFrame(()=>{if(storyActive) resize();});
  }

  function playShipyardTheme(){
    stopStarbaseTheme();
    stopSpaceTheme();
    stopOrbitTheme();
    try{
      shipyardTheme.volume = typeof getMusicVolume === 'function' ? getMusicVolume(0.68) : 0.58;
      const attempt=shipyardTheme.play();
      if(attempt&&typeof attempt.catch==='function') attempt.catch(()=>{});
    }catch(err){}
  }

  function stopShipyardTheme(){
    try{shipyardTheme.pause();shipyardTheme.currentTime=0;}catch(err){}
  }

  function playStarbaseTheme(){
    stopShipyardTheme();
    stopSpaceTheme();
    stopOrbitTheme();
    try{
      starbaseTheme.volume=typeof getMusicVolume==='function'?getMusicVolume(0.65):0.55;
      const attempt=starbaseTheme.play();
      if(attempt&&typeof attempt.catch==='function') attempt.catch(()=>{});
    }catch(err){}
  }

  function stopStarbaseTheme(){
    try{starbaseTheme.pause();starbaseTheme.currentTime=0;}catch(err){}
  }

  function isPlanetMusicMode(){
    return ['planetDetail','landing','surface','takeoff'].includes(state.mode);
  }

  function isSpaceMusicMode(){
    return ['system','planet','hyperspace','starmap'].includes(state.mode);
  }

  function playSpaceTheme(){
    if(!isSpaceMusicMode()) return;
    stopShipyardTheme();
    stopStarbaseTheme();
    stopOrbitTheme();
    stopSpaceTheme();
    try{
      spaceTheme.volume=typeof getMusicVolume==='function'?getMusicVolume(.62):.52;
      const attempt=spaceTheme.play();
      if(attempt&&typeof attempt.catch==='function') attempt.catch(()=>{});
    }catch(err){}
  }

  function stopSpaceTheme(reset=false){
    try{spaceTheme.pause();if(reset)spaceTheme.currentTime=0;}catch(err){}
  }

  function playOrbitTheme(selectNew=false){
    if(!orbitThemes.length||!isPlanetMusicMode()) return;
    stopShipyardTheme();
    stopStarbaseTheme();
    stopSpaceTheme();
    if(!selectNew&&activeOrbitTheme&&!activeOrbitTheme.paused) return;
    if(activeOrbitTheme){try{activeOrbitTheme.pause();activeOrbitTheme.currentTime=0;}catch(err){}}
    let nextIndex=Math.floor(Math.random()*orbitThemes.length);
    if(orbitThemes.length>1&&nextIndex===activeOrbitThemeIndex){
      nextIndex=(nextIndex+1+Math.floor(Math.random()*(orbitThemes.length-1)))%orbitThemes.length;
    }
    activeOrbitThemeIndex=nextIndex;
    activeOrbitTheme=orbitThemes[nextIndex];
    try{
      activeOrbitTheme.currentTime=0;
      activeOrbitTheme.volume=typeof getMusicVolume==='function'?getMusicVolume(0.62):0.52;
      const attempt=activeOrbitTheme.play();
      if(attempt&&typeof attempt.catch==='function') attempt.catch(()=>{});
    }catch(err){}
  }

  function stopOrbitTheme(){
    if(!activeOrbitTheme) return;
    try{activeOrbitTheme.pause();activeOrbitTheme.currentTime=0;}catch(err){}
    activeOrbitTheme=null;
  }

  orbitThemes.forEach(theme=>theme.addEventListener('ended',()=>{
    if(theme!==activeOrbitTheme||!storyActive||!isPlanetMusicMode()) return;
    activeOrbitTheme=null;
    playOrbitTheme(true);
  }));

  function playLanderSfx(name,volume=.78){
    const source=landerSfx[name];
    if(!source) return;
    try{
      const sound=new Audio(source);
      sound.volume=typeof getSfxVolume==='function'?getSfxVolume(volume):volume;
      const attempt=sound.play();
      if(attempt&&typeof attempt.catch==='function') attempt.catch(()=>{});
    }catch(err){}
  }

  function getShipyardCatalog(){
    if(typeof SHIP_TYPES==='undefined') return [];
    return SHIP_TYPES.filter(type=>type&&type.id!=='random'&&type.id!=='test_dummy');
  }

  function shipCost(type){
    return Math.max(20,Math.round(((type.hp||100)/16+(type.speed||100)/24)/5)*5);
  }

  function shipSprite(type){
    return type.spriteFile||type.sprite||`assets/ships/${type.id}.png`;
  }

  function fallbackShipSprite(type){
    const color=type.color||'#52e9ff';
    const label=String(type.name||'SHIP').slice(0,12).toUpperCase();
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="420" height="220" viewBox="0 0 420 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g fill="${color}" stroke="#c9fbff" stroke-width="5" filter="url(#g)"><path d="M35 110 135 45 345 72 397 110 345 148 135 175Z"/><path fill="#07151d" d="m88 110 86-39 142 39-142 39Z"/><circle cx="210" cy="110" r="31"/></g><text x="210" y="207" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#8ffcff">${label}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function setShipImage(image,type){
    if(!image||!type) return;
    image.onerror=()=>{image.onerror=null;image.src=type.factionIcon||fallbackShipSprite(type);};
    image.src=shipSprite(type);
  }

  function selectedShip(){
    const catalog=getShipyardCatalog();
    if(!catalog.length) return null;
    state.shipyardIndex=(state.shipyardIndex+catalog.length)%catalog.length;
    return catalog[state.shipyardIndex];
  }

  function renderShipyardBays(){
    if(!shipyardBays) return;
    shipyardBays.innerHTML='';
    for(let index=0;index<MAX_ESCORTS;index++){
      const bay=document.createElement('div');
      bay.className='shipyard-bay';
      bay.dataset.bay=`BAY ${String(index+1).padStart(2,'0')}`;
      const ship=state.constructedShips[index];
      const image=document.createElement('img');
      image.className='shipyard-bay-ship';
      image.alt=ship?ship.name:'Empty construction bay';
      if(ship){setShipImage(image,ship);image.style.transform=`rotate(${ship.rotation||0}deg)`;}
      const left=document.createElement('i');left.className='shipyard-bay-door left';
      const right=document.createElement('i');right.className='shipyard-bay-door right';
      bay.append(image,left,right);
      if(ship) bay.classList.add('occupied');
      else if(index===state.constructedShips.length&&!state.shipyardBuilding){
        bay.classList.add('selected-bay');
        requestAnimationFrame(()=>requestAnimationFrame(()=>bay.classList.add('ready-open')));
      }
      shipyardBays.appendChild(bay);
    }
  }

  function updateShipyard(){
    const type=selectedShip();
    if(!type) return;
    const cost=shipCost(type);
    if(shipyardPreview){
      setShipImage(shipyardPreview,type);
      shipyardPreview.style.transform=`rotate(${type.overlayRotation||0}deg)`;
    }
    if(shipyardDockName) shipyardDockName.textContent=`${type.name.toUpperCase()} // ${type.classLabel.toUpperCase()}`;
    if(shipyardShipName) shipyardShipName.textContent=type.name.toUpperCase();
    if(shipyardShipClass) shipyardShipClass.textContent=type.classLabel.toUpperCase();
    if(shipyardShipCost) shipyardShipCost.textContent=`${cost} CREDITS`;
    if(shipyardCredits) shipyardCredits.textContent=String(state.credits);
    if(shipyardBuild) shipyardBuild.disabled=state.shipyardBuilding||state.constructedShips.length>=MAX_ESCORTS||state.credits<cost;
  }

  function animateShipyardPreview(){
    if(!shipyardPreview) return;
    shipyardPreview.classList.remove('ship-change');
    void shipyardPreview.offsetWidth;
    shipyardPreview.classList.add('ship-change');
  }

  function cycleShipyard(direction){
    const catalog=getShipyardCatalog();
    if(!catalog.length||state.shipyardBuilding) return;
    state.shipyardIndex=(state.shipyardIndex+direction+catalog.length)%catalog.length;
    updateShipyard();
    animateShipyardPreview();
  }

  function openShipyard(){
    state.mode='shipyard';clearKeys();
    screen.classList.add('starbase-cinematic-active');
    if(starbaseMenu) starbaseMenu.classList.add('hidden');
    if(outfitScreen) outfitScreen.classList.add('hidden');
    if(shipyardScreen) shipyardScreen.classList.remove('hidden');
    renderShipyardBays();updateShipyard();animateShipyardPreview();playShipyardTheme();
    if(controlsLabel) controlsLabel.textContent='SELECT A HULL AND OPEN A CONSTRUCTION BAY';
  }

  function buildSelectedShip(){
    const type=selectedShip();
    if(!type||state.shipyardBuilding) return false;
    const cost=shipCost(type);
    if(state.constructedShips.length>=MAX_ESCORTS){if(shipyardStatus) shipyardStatus.textContent='ALL ESCORT BAYS ARE OCCUPIED.';return false;}
    if(state.credits<cost){if(shipyardStatus) shipyardStatus.textContent=`INSUFFICIENT CREDITS — ${cost-state.credits} REQUIRED.`;return false;}
    state.credits-=cost;state.shipyardBuilding=true;
    const bayIndex=state.constructedShips.length;
    const bay=shipyardBays&&shipyardBays.children[bayIndex];
    if(bay){
      bay.classList.remove('selected-bay');
      bay.classList.add('opening','ready-open');
      const image=bay.querySelector('img');
      setShipImage(image,type);image.alt=type.name;image.style.transform=`rotate(${type.overlayRotation||0}deg)`;
    }
    if(shipyardStatus) shipyardStatus.textContent=`CONSTRUCTING ${type.name.toUpperCase()} IN BAY ${String(bayIndex+1).padStart(2,'0')}...`;
    updateShipyard();
    setTimeout(()=>{
      state.constructedShips.push({id:type.id,name:type.name,classLabel:type.classLabel,cost,sprite:shipSprite(type),factionIcon:type.factionIcon,color:type.color,rotation:type.overlayRotation||0});
      state.shipyardBuilding=false;
      if(bay){bay.classList.remove('opening');bay.classList.add('occupied');}
      if(shipyardStatus) shipyardStatus.textContent=`${type.name.toUpperCase()} COMPLETE — ESCORT ASSIGNED.`;
      renderShipyardBays();updateShipyard();updateUi();
    },2450);
    return true;
  }

  function selectedModule(){
    state.outfitIndex=(state.outfitIndex+OUTFIT_MODULES.length)%OUTFIT_MODULES.length;
    return OUTFIT_MODULES[state.outfitIndex];
  }

  function renderOutfitSlots(){
    if(!outfitSlots) return;
    outfitSlots.innerHTML='';
    for(let index=0;index<MAX_MODULES;index++){
      const slot=document.createElement('span');
      const module=OUTFIT_MODULES.find(item=>item.id===state.installedModules[index]);
      const isTarget=!module&&index===state.installedModules.length;
      slot.className=`outfit-slot${module?' installed':''}${isTarget?' selected-target':''}`;
      slot.textContent=module?module.short:String(index+1).padStart(2,'0');
      slot.title=module?module.name:(isTarget?'Selected installation slot':'Empty module slot');
      outfitSlots.appendChild(slot);
    }
  }

  function updateOutfit(){
    const module=selectedModule();
    if(outfitModuleName) outfitModuleName.textContent=module.name;
    if(outfitModuleDescription) outfitModuleDescription.textContent=module.description;
    if(outfitModuleCost) outfitModuleCost.textContent=`${module.cost} CREDITS`;
    if(outfitCredits) outfitCredits.textContent=String(state.credits);
    if(outfitInstall) outfitInstall.disabled=state.installedModules.length>=MAX_MODULES||state.credits<module.cost;
    if(outfitStatSpeed) outfitStatSpeed.textContent=(92*(1+state.upgrades.thrusters*0.1)).toFixed(0);
    if(outfitStatTurn) outfitStatTurn.textContent=(BASE_TURN_RATE*(1+state.upgrades.turningJets*0.1)).toFixed(2);
    if(outfitStatWeapon) outfitStatWeapon.textContent=(1+state.upgrades.weapons*0.2).toFixed(2);
    if(outfitStatFuel) outfitStatFuel.textContent=String(state.maxFuel);
  }

  function cycleOutfit(direction){
    state.outfitIndex=(state.outfitIndex+direction+OUTFIT_MODULES.length)%OUTFIT_MODULES.length;
    updateOutfit();
  }

  function openOutfit(){
    state.mode='outfit';clearKeys();
    screen.classList.add('starbase-cinematic-active');
    if(starbaseMenu) starbaseMenu.classList.add('hidden');
    if(shipyardScreen) shipyardScreen.classList.add('hidden');
    if(outfitScreen) outfitScreen.classList.remove('hidden');
    renderOutfitSlots();updateOutfit();playShipyardTheme();
    if(controlsLabel) controlsLabel.textContent='SELECT AND INSTALL FLAGSHIP MODULES';
  }

  function installSelectedModule(){
    const module=selectedModule();
    if(state.installedModules.length>=MAX_MODULES){if(outfitStatus) outfitStatus.textContent='ALL MODULE SLOTS ARE OCCUPIED.';return false;}
    if(state.credits<module.cost){if(outfitStatus) outfitStatus.textContent=`INSUFFICIENT CREDITS — ${module.cost-state.credits} REQUIRED.`;return false;}
    const installedIndex=state.installedModules.length;
    state.credits-=module.cost;
    state.installedModules.push(module.id);
    state.upgrades[module.id]+=1;
    if(module.id==='fuelTanks'){state.maxFuel+=25;state.fuel=Math.min(state.maxFuel,state.fuel+25);}
    renderOutfitSlots();updateOutfit();updateUi();
    const installedSlot=outfitSlots&&outfitSlots.children[installedIndex];
    if(installedSlot){
      installedSlot.classList.add('install-flash');
      setTimeout(()=>installedSlot.classList.remove('install-flash'),850);
    }
    if(outfitStatus) outfitStatus.textContent=`${module.name} INSTALLED AND ONLINE.`;
    return true;
  }

  function returnToStarbase(){
    state.mode='starbase';setStarbaseMenuVisible(true);playStarbaseTheme();
    if(controlsLabel) controlsLabel.textContent='SELECT A STARBASE SERVICE';
    updateUi();
  }

  function refreshPlanetOps(){
    const profile = getPlanetProfile();
    const scanning = !!state.scanAnimation.type;
    planetOpsButtons.forEach(button=>{
      const action = button.dataset.planetAction;
      button.classList.toggle('active',!!state.scans[action] || state.scanAnimation.type===action);
      button.disabled = state.mode === 'landing' || state.mode === 'takeoff' || (scanning && action!=='exit');
      if(action === 'dispatch') button.disabled = scanning || !profile || !profile.landable || state.mode !== 'planetDetail';
    });
  }

  function buildBackdrop(){
    starfield = Array.from({length:260}, (_,i)=>(
      {x:seededNoise(i*3), y:seededNoise(i*3+1), size:0.4+seededNoise(i*3+2)*1.5, hue:185+seededNoise(i*7)*90}
    ));
    hyperspaceDust = Array.from({length:420}, (_,i)=>(
      {x:STARMAP_BOUNDS.left+seededNoise(i*5)*(STARMAP_BOUNDS.right-STARMAP_BOUNDS.left), y:STARMAP_BOUNDS.top+seededNoise(i*5+1)*(STARMAP_BOUNDS.bottom-STARMAP_BOUNDS.top), size:0.5+seededNoise(i*5+2)*2.2}
    ));
    const mapColors=['#ff4e45','#61d7ff','#f5df63','#58e56d','#c16cff','#ff9d48','#d7e4ef'];
    starmapField=Array.from({length:230},(_,index)=>({
      catalogIndex:index,
      name:`STAR ${String(index+1).padStart(3,'0')}`,
      x:STARMAP_BOUNDS.left+seededNoise(index*11+401)*(STARMAP_BOUNDS.right-STARMAP_BOUNDS.left),
      y:STARMAP_BOUNDS.top+seededNoise(index*11+402)*(STARMAP_BOUNDS.bottom-STARMAP_BOUNDS.top),
      size:.8+seededNoise(index*11+403)*1.15,
      color:mapColors[Math.floor(seededNoise(index*11+404)*mapColors.length)%mapColors.length],
      available:true,
      generated:true
    }));
  }

  function resize(){
    const rect = canvas.getBoundingClientRect();
    pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    viewWidth = Math.max(1, rect.width);
    viewHeight = Math.max(1, rect.height);
    canvas.width = Math.round(viewWidth * pixelRatio);
    canvas.height = Math.round(viewHeight * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function setLog(source, text, duration=7){
    if(!log) return;
    log.innerHTML = `<span>${source}</span><p>${text}</p>`;
    state.messageTimer = duration;
  }

  function resetStory(){
    state.mode = 'system';
    state.currentSystem = 'SOL';
    state.starmapReturnMode = 'system';
    state.starmapSelection = null;
    state.autopilotTarget = null;
    state.autopilotFuelWarning = false;
    state.elapsed = 0;
    state.day = 1;
    state.fuel = 100;
    state.maxFuel = 100;
    state.missionStage = 0;
    state.transitionLock = 1.5;
    state.messageTimer = 8;
    state.planet = null;
    state.scans = {mineral:false,biological:false,energy:false};
    state.planetSurveys = {};
    state.scanAnimation = {type:null,elapsed:0,queue:[]};
    state.surfaceNodes = [];
    state.planetRevealTimer = 0;
    state.planetRevealReady = false;
    state.landingTimer = 0;
    state.takeoffTimer = 0;
    state.takeoffOrigin = {x:0.5,y:0.5};
    state.surfaceFade = 0;
    state.lander = {x:0.5,y:0.5,angle:-Math.PI/2};
    state.landerCrew = LANDER_MAX_CREW;
    state.landerStorageUsed = 0;
    state.landerHold = [];
    state.landerShots = [];
    state.landerShotCooldown = 0;
    state.landerDamageFlash = 0;
    state.landerDestroyed = false;
    state.landerDeathTimer = 0;
    state.collected = {mineral:0,biological:0,energy:0};
    state.mineralCargo = {};
    state.cargoTradeValue = 0;
    state.credits = 0;
    state.constructedShips = [];
    state.shipyardIndex = 0;
    state.shipyardBuilding = false;
    state.outfitIndex = 0;
    state.installedModules = [];
    state.upgrades = {fuelTanks:0,dynamos:0,thrusters:0,turningJets:0,weapons:0};
    state.starbaseNotice = '';
    state.pickupNotices = [];
    Object.assign(state.player, {x:215,y:112,vx:0,vy:0,angle:-0.45});
    Object.assign(state.hyper, {x:0,y:0,vx:0,vy:0,angle:0});
    Object.assign(state.planetShip, {x:0,y:205,vx:0,vy:-18,angle:-Math.PI/2});
    if(missionTitle) missionTitle.textContent = 'THE SILENT PIONEER';
    if(missionText) missionText.textContent = "Travel to the unidentified signal and investigate humanity's missing first spacecraft.";
    if(systemLabel) systemLabel.textContent='SOL SYSTEM';
    if(systemSubLabel) systemSubLabel.textContent='LOCAL SPACE';
    setLog('COMMAND', 'Vanguard I, find out why our first ship never came home.', 8);
    setPlanetOpsVisible(false);
    stopShipyardTheme();
    stopStarbaseTheme();
    stopOrbitTheme();
    stopSpaceTheme(true);
    if(controlsLabel) controlsLabel.innerHTML = 'W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; E INTERACT&nbsp;&nbsp; ESC MENU';
    updateUi();
  }

  function beginStory(){
    if(typeof playUiClick === 'function') playUiClick();
    if(typeof hideMainMenu === 'function') hideMainMenu();
    if(typeof stopMainMenuMusic === 'function') stopMainMenuMusic();
    document.body.classList.add('story-active');
    introRunning = true;
    introFinishing = false;
    intro.classList.remove('hidden', 'fading', 'playing');
    intro.setAttribute('aria-hidden','false');
    if(introStatus) introStatus.textContent = 'LOADING INTRO...';
    if(introPlayBtn) introPlayBtn.classList.add('hidden');
    try{
      introVideo.currentTime = 0;
      introVideo.volume = 1;
      introVideo.muted = false;
      introVideo.playbackRate = 1;
    }catch(err){}
    attemptIntroPlayback();
    setTimeout(()=>{
      if(!introRunning||introFinishing||introVideo.currentTime>0.2) return;
      if(introVideo.paused) showPlaybackFallback();
      else{
        intro.classList.remove('playing');
        if(introStatus) introStatus.textContent='BUFFERING INTRO...';
      }
    },1800);
  }

  function attemptIntroPlayback(){
    if(!introRunning || introFinishing) return;
    if(introStatus) introStatus.textContent='STARTING INTRO...';
    let playAttempt;
    try{ playAttempt = introVideo.play(); }
    catch(err){ showPlaybackFallback(); return; }
    if(playAttempt && typeof playAttempt.catch === 'function'){
      playAttempt.catch(showPlaybackFallback);
    }
  }

  function showPlaybackFallback(){
    if(!introRunning || introFinishing) return;
    intro.classList.remove('playing');
    if(introStatus) introStatus.textContent = introVideo.error ? 'INTRO VIDEO COULD NOT LOAD' : 'INTRO READY';
    if(introPlayBtn){
      introPlayBtn.textContent = introVideo.error ? 'CONTINUE' : 'PLAY INTRO';
      introPlayBtn.classList.remove('hidden');
    }
  }

  function finishIntro(){
    if(!introRunning || introFinishing) return;
    introFinishing = true;
    intro.classList.add('fading');
    const startVolume = Number.isFinite(introVideo.volume) ? introVideo.volume : 1;
    const fadeStarted = performance.now();
    const fadeAudio = (now)=>{
      if(!introFinishing) return;
      const progress = Math.min(1, (now-fadeStarted)/820);
      try{ introVideo.volume = Math.max(0, startVolume * (1-progress)); }catch(err){}
      if(progress < 1) requestAnimationFrame(fadeAudio);
    };
    requestAnimationFrame(fadeAudio);
    setTimeout(()=>{
      try{ introVideo.pause(); }catch(err){}
      intro.classList.add('hidden');
      intro.classList.remove('fading', 'playing');
      intro.setAttribute('aria-hidden','true');
      introRunning = false;
      introFinishing = false;
      startSystemGame();
    }, 900);
  }

  function startSystemGame(){
    resetStory();
    screen.classList.remove('hidden');
    screen.setAttribute('aria-hidden','false');
    storyActive = true;
    resize();
    lastTime = performance.now();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(loop);
    playSpaceTheme();
  }

  function leaveStory(){
    if(introRunning){
      try{ introVideo.pause(); }catch(err){}
    }
    introRunning = false;
    introFinishing = false;
    storyActive = false;
    stopShipyardTheme();
    stopStarbaseTheme();
    stopOrbitTheme();
    stopSpaceTheme(true);
    cancelAnimationFrame(frameId);
    intro.classList.add('hidden');
    intro.classList.remove('fading', 'playing');
    intro.setAttribute('aria-hidden','true');
    screen.classList.add('hidden');
    screen.setAttribute('aria-hidden','true');
    document.body.classList.remove('story-active');
    clearKeys();
    if(typeof showMainMenu === 'function') showMainMenu({playSound:false});
    if(typeof playMainMenuMusic === 'function') playMainMenuMusic();
  }

  function clearKeys(){
    keys.thrust = keys.left = keys.right = keys.reverse = false;
  }

  function activeShip(){
    if(state.mode === 'hyperspace') return state.hyper;
    if(state.mode === 'starmap'&&state.starmapReturnMode==='hyperspace') return state.hyper;
    if(state.mode === 'planet') return state.planetShip;
    return state.player;
  }

  function currentStar(){
    return allHyperspaceStars().find(star=>star.name===state.currentSystem)||hyperspaceStars[0];
  }

  function currentBodies(){
    if(state.currentSystem==='SOL') return bodies;
    if(extraSystemBodies[state.currentSystem]) return extraSystemBodies[state.currentSystem];
    return generatedSystemBodies(currentStar());
  }

  function allHyperspaceStars(){
    return hyperspaceStars.concat(starmapField);
  }

  function generatedSystemBodies(star){
    if(!star||!star.generated) return [];
    if(generatedSystemCache[star.name]) return generatedSystemCache[star.name];
    const seed=star.catalogIndex+1200;
    const count=2+Math.floor(seededNoise(seed)*4);
    const generated=Array.from({length:count},(_,index)=>{
      const radius=4+Math.floor(seededNoise(seed+index*13+1)*9);
      const hue=Math.floor(seededNoise(seed+index*13+2)*360);
      const body={
        name:`${star.name} ${String.fromCharCode(73+index)}`,
        orbit:88+index*92+Math.floor(seededNoise(seed+index*13+3)*48),
        radius,
        color:`hsl(${hue} 48% 55%)`,
        speed:.31/(1+index*.68),
        phase:seededNoise(seed+index*13+4)*TWO_PI,
        rings:radius>10&&seededNoise(seed+index*13+5)>.58,
        moons:[]
      };
      const moonCount=radius>7?Math.floor(seededNoise(seed+index*13+6)*3):0;
      body.moons=Array.from({length:moonCount},(__,moonIndex)=>({name:`${body.name}-${moonIndex+1}`,color:'#aeb7b8'}));
      const landable=radius<12;
      planetProfiles[body.name]={
        orbit:`${(body.orbit/184).toFixed(2)} AU`,atmo:landable?'0.68 ATM':'>100 ATM',temp:`${-120+Math.floor(seededNoise(seed+index*13+7)*330)}Â° C`,weather:`CLASS ${1+Math.floor(seededNoise(seed+index*13+8)*8)}`,tectonics:`CLASS ${1+Math.floor(seededNoise(seed+index*13+9)*5)}`,
        mass:`${(radius/8).toFixed(2)} E.S.`,radius:`${(radius/8).toFixed(2)} E.S.`,gravity:`${Math.max(.18,radius/10).toFixed(2)} G`,day:`${(.5+seededNoise(seed+index*13+10)*4).toFixed(2)} DAYS`,tilt:`${Math.floor(seededNoise(seed+index*13+11)*48)}Â°`,landable,
        palette:[body.color,'#263e49','#6d8069','#b3a77f','#d2d0c5'],counts:{mineral:4+Math.floor(seededNoise(seed+index*13+12)*7),biological:landable?Math.floor(seededNoise(seed+index*13+13)*7):0,energy:Math.floor(seededNoise(seed+index*13+14)*4)}
      };
      return body;
    });
    generatedSystemCache[star.name]=generated;
    return generated;
  }

  function bodyPosition(body){
    const angle = body.phase + state.elapsed*body.speed*0.08;
    return {x:Math.cos(angle)*body.orbit,y:Math.sin(angle)*body.orbit,angle};
  }

  function updateShip(ship, dt, hyper=false){
    const manual = keys.thrust || keys.reverse || keys.left || keys.right;
    const turnMultiplier=1+state.upgrades.turningJets*0.1;
    const thrustMultiplier=1+state.upgrades.thrusters*0.1;
    if(keys.left) ship.angle -= BASE_TURN_RATE * turnMultiplier * dt;
    if(keys.right) ship.angle += BASE_TURN_RATE * turnMultiplier * dt;
    const drive = keys.thrust ? 1 : (keys.reverse ? -0.42 : 0);
    if(drive && state.fuel > 0){
      const acceleration = (hyper ? 76 : 64)*thrustMultiplier;
      ship.vx += Math.cos(ship.angle) * acceleration * drive * dt;
      ship.vy += Math.sin(ship.angle) * acceleration * drive * dt;
      if(!hyper){
        const efficiency=Math.max(0.55,1-state.upgrades.dynamos*0.08);
        state.fuel = Math.max(0, state.fuel - Math.abs(drive) * dt * 0.34*efficiency);
      }
    }
    const maxSpeed = (hyper ? 118 : 92)*thrustMultiplier;
    const speed = Math.hypot(ship.vx, ship.vy);
    if(speed > maxSpeed){ ship.vx *= maxSpeed/speed; ship.vy *= maxSpeed/speed; }
    const drag = Math.pow(hyper ? 0.993 : 0.988, dt*60);
    ship.vx *= drag;
    ship.vy *= drag;
    ship.x += ship.vx * dt;
    ship.y += ship.vy * dt;
    if(hyper&&speed>0.1){
      const efficiency=Math.max(0.55,1-state.upgrades.dynamos*0.08);
      state.fuel=Math.max(0,state.fuel-speed*dt*HYPER_FUEL_PER_UNIT*efficiency);
    }
    if(manual && systemSubLabel){
      systemSubLabel.textContent = hyper ? 'HYPERSPACE' : (state.mode === 'planet' ? 'PLANETARY LOCAL SPACE' : 'LOCAL SPACE');
    }
  }

  function normalizeAngle(angle){
    while(angle>Math.PI) angle-=TWO_PI;
    while(angle<-Math.PI) angle+=TWO_PI;
    return angle;
  }

  function updateHyperspaceShip(dt){
    const manual=keys.thrust||keys.reverse||keys.left||keys.right;
    if(manual&&state.autopilotTarget){
      state.autopilotTarget=null;
      setLog('AUTOPILOT','Manual controls engaged. Autopilot course cancelled.',3);
    }
    const target=state.autopilotTarget;
    if(target&&!manual){
      const dx=target.x-state.hyper.x,dy=target.y-state.hyper.y;
      const distance=Math.hypot(dx,dy);
      const desired=Math.atan2(dy,dx);
      const delta=normalizeAngle(desired-state.hyper.angle);
      state.hyper.angle+=Math.max(-2.1*dt,Math.min(2.1*dt,delta));
      if(state.fuel>0&&distance>22&&Math.abs(delta)<0.72){
        const thrust=76*(1+state.upgrades.thrusters*0.1);
        state.hyper.vx+=Math.cos(state.hyper.angle)*thrust*dt;
        state.hyper.vy+=Math.sin(state.hyper.angle)*thrust*dt;
      }else if(state.fuel<=0&&!state.autopilotFuelWarning){
        state.autopilotFuelWarning=true;
        setLog('AUTOPILOT','Fuel exhausted. Vanguard I is drifting in hyperspace.',7);
      }
    }
    updateShip(state.hyper,dt,true);
  }

  function starmapPosition(){
    if(state.starmapReturnMode==='hyperspace') return {x:state.hyper.x,y:state.hyper.y};
    const star=currentStar();return {x:star.x,y:star.y};
  }

  function fuelRange(){
    const efficiency=Math.max(0.55,1-state.upgrades.dynamos*0.08);
    return state.fuel/(HYPER_FUEL_PER_UNIT*efficiency);
  }

  function starmapTransform(){
    const width=STARMAP_BOUNDS.right-STARMAP_BOUNDS.left;
    const height=STARMAP_BOUNDS.bottom-STARMAP_BOUNDS.top;
    const scale=Math.min((viewWidth-72)/width,(viewHeight-82)/height);
    return {scale,cx:viewWidth/2-(STARMAP_BOUNDS.left+STARMAP_BOUNDS.right)*scale/2,cy:viewHeight/2-(STARMAP_BOUNDS.top+STARMAP_BOUNDS.bottom)*scale/2};
  }

  function openStarmap(){
    if(state.mode==='starmap') return;
    if(!['system','hyperspace'].includes(state.mode)){
      setLog('STARMAP','Return to stellar or hyperspace navigation before opening the starmap.',4);
      return;
    }
    state.starmapReturnMode=state.mode;
    state.mode='starmap';clearKeys();
    if(interaction) interaction.classList.add('hidden');
    if(systemLabel) systemLabel.textContent='STARMAP';
    if(systemSubLabel) systemSubLabel.textContent='HYPERSPACE NAVIGATION';
    if(controlsLabel) controlsLabel.textContent='CLICK AN IN-RANGE STAR TO PLOT COURSE    ESC CLOSE STARMAP';
  }

  function closeStarmap(){
    if(state.mode!=='starmap') return;
    state.mode=state.starmapReturnMode||'hyperspace';
    if(state.mode==='hyperspace'){
      if(systemLabel) systemLabel.textContent='HYPERSPACE';
      if(systemSubLabel) systemSubLabel.textContent='INTERSTELLAR NAVIGATION';
    }else{
      if(systemLabel) systemLabel.textContent=`${state.currentSystem} SYSTEM`;
      if(systemSubLabel) systemSubLabel.textContent='LOCAL SPACE';
    }
  }

  function plotStarmapCourse(star){
    const position=starmapPosition();
    const distance=Math.hypot(star.x-position.x,star.y-position.y);
    const cost=distance*HYPER_FUEL_PER_UNIT*Math.max(0.55,1-state.upgrades.dynamos*0.08);
    state.starmapSelection=star.name;
    if(state.starmapReturnMode!=='hyperspace'&&star.name===state.currentSystem){
      setLog('STARMAP',`${star.name} is the current system. Select a different destination.`,4);
      return false;
    }
    if(distance>fuelRange()+0.01){
      setLog('STARMAP',`${star.name} is outside safe fuel range. Required: ${Math.ceil(cost)}. Available: ${Math.floor(state.fuel)}.`,6);
      return false;
    }
    state.autopilotTarget={name:star.name,x:star.x,y:star.y};
    state.autopilotFuelWarning=false;
    setLog('AUTOPILOT',`Course plotted for ${star.name}. Range ${Math.round(distance)} HS; projected fuel ${Math.ceil(cost)}.`,7);
    closeStarmap();
    return true;
  }

  function update(dt){
    state.elapsed += dt;
    if(state.upgrades.dynamos>0&&!keys.thrust&&!keys.reverse){
      state.fuel=Math.min(state.maxFuel,state.fuel+state.upgrades.dynamos*0.055*dt);
    }
    state.day = 1 + Math.floor(state.elapsed / 90);
    state.transitionLock = Math.max(0, state.transitionLock-dt);
    state.messageTimer = Math.max(0, state.messageTimer-dt);
    if(state.mode === 'system'){
      updateShip(state.player, dt, false);
      const range = Math.hypot(state.player.x-lostShip.x, state.player.y-lostShip.y);
      if(state.currentSystem==='SOL'&&state.missionStage === 0 && interaction) interaction.classList.toggle('hidden', range > 42);
      else if(interaction) interaction.classList.add('hidden');
      if(state.transitionLock <= 0){
        const nearbyPlanet = currentBodies().find(body=>{
          const position = bodyPosition(body);
          return Math.hypot(state.player.x-position.x,state.player.y-position.y) < Math.max(15,body.radius+9);
        });
        if(nearbyPlanet) enterPlanetSystem(nearbyPlanet);
        else if(Math.hypot(state.player.x,state.player.y) > SYSTEM_EDGE) enterHyperspace();
      }
    }else if(state.mode === 'planet'){
      updateShip(state.planetShip,dt,false);
      if(interaction) interaction.classList.add('hidden');
      const localDistance = Math.hypot(state.planetShip.x,state.planetShip.y);
      const starbaseDistance=state.planet&&state.planet.name==='EARTH'
        ? Math.hypot(state.planetShip.x-EARTH_STARBASE.x,state.planetShip.y-EARTH_STARBASE.y)
        : Infinity;
      if(starbaseDistance<EARTH_STARBASE.radius&&state.transitionLock<=0) enterStarbase();
      else if(localDistance<24 && state.transitionLock<=0) enterPlanetDetail();
      else if(localDistance>PLANET_EDGE && state.transitionLock<=0) exitPlanetSystem();
    }else if(state.mode === 'planetDetail'){
      if(interaction) interaction.classList.add('hidden');
      state.planetRevealTimer=Math.min(PLANET_REVEAL_DURATION,state.planetRevealTimer+dt);
      if(!state.planetRevealReady&&state.planetRevealTimer>=.95){
        state.planetRevealReady=true;
        if(planetOpsMenu) planetOpsMenu.classList.remove('hidden');
        if(controlsLabel) controlsLabel.textContent='SELECT A SCAN OR DISPATCH THE PLANET LANDER';
        setLog('SCIENCE',`${state.planet.name} orbital survey ready. Select a scan channel.`,6);
      }
      updatePlanetScan(dt);
    }else if(state.mode === 'landing'){
      state.landingTimer += dt;
      if(state.landingTimer>=3.1) enterSurface();
    }else if(state.mode === 'surface'){
      updateLander(dt);
      state.surfaceFade = Math.max(0,state.surfaceFade-dt*0.85);
    }else if(state.mode === 'takeoff'){
      updateLanderTakeoff(dt);
    }else if(state.mode==='starmap'){
      if(interaction) interaction.classList.add('hidden');
    }else if(state.mode === 'starbase'||state.mode==='shipyard'||state.mode==='outfit'){
      if(interaction) interaction.classList.add('hidden');
    }else{
      updateHyperspaceShip(dt);
      if(interaction) interaction.classList.add('hidden');
      if(state.transitionLock <= 0){
        const nearby = allHyperspaceStars().find(star=>Math.hypot(state.hyper.x-star.x,state.hyper.y-star.y)<24);
        if(nearby){
          if(nearby.available) enterSolarSystem(nearby.name);
          else {
            state.transitionLock = 2;
            state.hyper.vx *= -0.45;
            state.hyper.vy *= -0.45;
            setLog('NAVIGATION', `${nearby.name}: no safe in-system route has been charted yet.`, 5);
          }
        }
      }
    }
    updateUi();
  }

  function enterPlanetSystem(body){
    const position = bodyPosition(body);
    const approachAngle = Math.atan2(state.player.y-position.y,state.player.x-position.x);
    state.mode = 'planet';
    state.planet = body;
    Object.assign(state.planetShip,{
      x:Math.cos(approachAngle)*210,
      y:Math.sin(approachAngle)*210,
      vx:Math.cos(approachAngle)*-22,
      vy:Math.sin(approachAngle)*-22,
      angle:approachAngle+Math.PI
    });
    state.transitionLock = 1.8;
    setPlanetOpsVisible(false);
    if(systemLabel) systemLabel.textContent = `${state.currentSystem} — ${body.name}`;
    if(systemSubLabel) systemSubLabel.textContent = 'PLANETARY LOCAL SPACE';
    if(controlsLabel) controlsLabel.innerHTML = 'W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; FLY CLOSE TO ANALYZE';
    const moonCount = body.moons.length;
    setLog('NAVIGATION', `${body.name} local space. ${moonCount ? `${moonCount} satellite${moonCount===1?'':'s'} detected.` : 'No natural satellites detected.'}`,6);
  }

  function exitPlanetSystem(){
    if(!state.planet) return;
    const body = state.planet;
    const position = bodyPosition(body);
    const exitAngle = Math.atan2(state.planetShip.y,state.planetShip.x);
    state.mode = 'system';
    stopOrbitTheme();
    Object.assign(state.player,{
      x:position.x+Math.cos(exitAngle)*Math.max(24,body.radius+15),
      y:position.y+Math.sin(exitAngle)*Math.max(24,body.radius+15),
      vx:Math.cos(exitAngle)*24,
      vy:Math.sin(exitAngle)*24,
      angle:exitAngle
    });
    state.planet = null;
    setPlanetOpsVisible(false);
    state.transitionLock = 1.8;
    if(systemLabel) systemLabel.textContent = `${state.currentSystem} SYSTEM`;
    if(systemSubLabel) systemSubLabel.textContent = 'LOCAL SPACE';
    setLog('NAVIGATION', `Leaving ${body.name} local space.`,4);
  }

  function enterStarbase(){
    if(!state.planet||state.planet.name!=='EARTH') return;
    const unloadedValue=state.cargoTradeValue;
    const unloadedUnits=Object.values(state.mineralCargo).reduce((sum,item)=>sum+item.units,0);
    if(unloadedValue>0){
      state.credits+=unloadedValue;
      state.mineralCargo={};
      state.cargoTradeValue=0;
    }
    state.mode='starbase';
    state.planetShip.vx=0;state.planetShip.vy=0;
    setStarbaseMenuVisible(true);
    playStarbaseTheme();
    if(systemLabel) systemLabel.textContent='EARTH STARBASE';
    if(systemSubLabel) systemSubLabel.textContent='DOCKING BERTH 01';
    if(controlsLabel) controlsLabel.textContent='SELECT A STARBASE SERVICE';
    const dockingMessage=unloadedValue>0
      ? `Docking complete. ${unloadedUnits} mineral units unloaded automatically. +${unloadedValue} credits.`
      : 'Docking complete. No mineral cargo to unload.';
    state.starbaseNotice=dockingMessage;
    setLog('STARBASE CONTROL',dockingMessage,7);
    updateUi();
  }

  function departStarbase(){
    state.mode='planet';
    playSpaceTheme();
    Object.assign(state.planetShip,{x:EARTH_STARBASE.x+32,y:EARTH_STARBASE.y+12,vx:25,vy:9,angle:0.34});
    state.transitionLock=1.8;
    setStarbaseMenuVisible(false);
    stopShipyardTheme();
    stopStarbaseTheme();
    if(systemLabel) systemLabel.textContent='SOL — EARTH';
    if(systemSubLabel) systemSubLabel.textContent='PLANETARY LOCAL SPACE';
    if(controlsLabel) controlsLabel.innerHTML='W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; FLY CLOSE TO ANALYZE';
    setLog('STARBASE CONTROL','Vanguard I cleared for departure.',4);
  }

  function tradeMinerals(){
    if(state.cargoTradeValue<=0){
      setLog('RESOURCE OFFICER','Your mineral holds are empty.',4);
      return;
    }
    const earned=state.cargoTradeValue;
    const units=Object.values(state.mineralCargo).reduce((sum,item)=>sum+item.units,0);
    state.credits+=earned;
    state.mineralCargo={};
    state.cargoTradeValue=0;
    setLog('RESOURCE OFFICER',`${units} mineral units transferred. +${earned} credits. Balance: ${state.credits}.`,7);
    updateUi();
  }

  function handleStarbaseAction(event){
    const action=event.currentTarget.dataset.starbaseAction;
    if(action==='commander'){
      const briefing=state.missionStage===0
        ? 'Your orders remain unchanged: locate Pioneer One and determine why it vanished.'
        : 'The Pioneer One flight recorder confirms a course toward Alpha Centauri. Prepare for hyperspace.';
      state.starbaseNotice=briefing;setLog('STARBASE COMMANDER',briefing,8);
    }else if(action==='trade') tradeMinerals();
    else if(action==='outfit') openOutfit();
    else if(action==='shipyard') openShipyard();
    else if(action==='depart') departStarbase();
  }

  function enterPlanetDetail(){
    if(!state.planet) return;
    state.mode = 'planetDetail';
    playOrbitTheme(true);
    if(!state.planetSurveys[state.planet.name]){
      state.planetSurveys[state.planet.name]={
        scans:{mineral:false,biological:false,energy:false},
        nodes:buildSurfaceNodes(state.planet)
      };
    }
    const survey=state.planetSurveys[state.planet.name];
    state.scans = survey.scans;
    state.scanAnimation = {type:null,elapsed:0,queue:[]};
    state.surfaceNodes = survey.nodes;
    state.planetRevealTimer = 0;
    state.planetRevealReady = false;
    state.lander = {x:0.5,y:0.5,angle:-Math.PI/2};
    setPlanetOpsVisible(true);
    if(planetOpsMenu) planetOpsMenu.classList.add('hidden');
    refreshPlanetOps();
    if(systemLabel) systemLabel.textContent = `${state.currentSystem} — ${state.planet.name}`;
    if(systemSubLabel) systemSubLabel.textContent = 'PLANETARY ANALYSIS';
    if(controlsLabel) controlsLabel.textContent = 'PLANETARY ACQUISITION - STAND BY';
    setLog('SCIENCE', `${state.planet.name} visual acquisition in progress.`,3);
  }

  function returnToPlanetOrbit(){
    if(!state.planet) return;
    state.mode = 'planet';
    stopOrbitTheme();
    playSpaceTheme();
    Object.assign(state.planetShip,{x:0,y:82,vx:0,vy:24,angle:Math.PI/2});
    state.transitionLock = 1.8;
    setPlanetOpsVisible(false);
    if(systemSubLabel) systemSubLabel.textContent = 'PLANETARY LOCAL SPACE';
    if(controlsLabel) controlsLabel.innerHTML = 'W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; E INTERACT&nbsp;&nbsp; ESC MENU';
    setLog('NAVIGATION',`Returning to ${state.planet.name} local space.`,4);
  }

  function dispatchLander(){
    const profile = getPlanetProfile();
    if(!profile || !profile.landable){
      setLog('LANDER CONTROL','No solid surface detected. Lander deployment denied.',5);
      return;
    }
    state.mode = 'landing';
    state.landingTimer = 0;
    state.landerCrew=LANDER_MAX_CREW;
    state.landerStorageUsed=0;
    state.landerHold=[];
    state.landerShots=[];
    state.landerShotCooldown=0;
    state.landerDamageFlash=0;
    state.landerDestroyed=false;
    state.landerDeathTimer=0;
    playLanderSfx('launch',.82);
    refreshPlanetOps();
    if(systemSubLabel) systemSubLabel.textContent = 'LANDER DESCENT';
    if(controlsLabel) controlsLabel.textContent = 'PLANET LANDER EN ROUTE';
    setLog('LANDER CONTROL',`Descent trajectory locked for ${state.planet.name}.`,5);
  }

  function enterSurface(){
    state.mode = 'surface';
    state.surfaceFade = 1;
    state.lander = {x:0.5,y:0.5,angle:-Math.PI/2};
    if(systemSubLabel) systemSubLabel.textContent = 'SURFACE EXPEDITION';
    if(controlsLabel) controlsLabel.textContent = 'W A S D MOVE   SPACE FIRE   E COLLECT   SHIFT / ESC RETURN';
    setLog('LANDER CONTROL','Touchdown confirmed. Surface team standing by.',6);
    refreshPlanetOps();
  }

  function updateLander(dt){
    state.landerShotCooldown=Math.max(0,state.landerShotCooldown-dt);
    state.landerDamageFlash=Math.max(0,state.landerDamageFlash-dt*2.6);
    if(state.landerDestroyed){
      state.landerDeathTimer+=dt;
      if(state.landerDeathTimer>=2.25) finishDestroyedLanderRecovery();
      return;
    }
    const speed = 0.13;
    let moveX=(keys.right?1:0)-(keys.left?1:0);
    let moveY=(keys.reverse?1:0)-(keys.thrust?1:0);
    if(moveX||moveY){
      const length=Math.hypot(moveX,moveY)||1;
      moveX/=length;moveY/=length;
      state.lander.x+=moveX*speed*dt;
      state.lander.y+=moveY*speed*dt;
      state.lander.angle=Math.atan2(moveY,moveX);
    }
    state.lander.x = Math.max(0.02,Math.min(0.98,state.lander.x));
    state.lander.y = Math.max(0.02,Math.min(0.98,state.lander.y));
    updateHostileLifeforms(dt);
    updateLanderShots(dt);
    state.pickupNotices.forEach(notice=>{notice.age+=dt;});
    state.pickupNotices=state.pickupNotices.filter(notice=>notice.age<notice.duration);
    if(interaction){
      const nearby=state.surfaceNodes.find(node=>!node.collected&&state.scans[node.type]&&Math.hypot(node.x-state.lander.x,node.y-state.lander.y)<=0.045);
      interaction.classList.toggle('hidden',!nearby);
      if(nearby){
        interaction.textContent=nearby.type==='biological'&&!nearby.defeated
          ?'HOSTILE LIFEFORM - PRESS SPACE TO FIRE'
          :`PRESS E TO COLLECT ${nearby.material||nearby.type.toUpperCase()}`;
      }
    }
  }

  function updateHostileLifeforms(dt){
    if(!state.scans.biological) return;
    state.surfaceNodes.forEach(node=>{
      if(node.type!=='biological'||node.collected||node.defeated) return;
      node.attackCooldown=Math.max(0,(node.attackCooldown||0)-dt);
      const dx=state.lander.x-node.x,dy=state.lander.y-node.y;
      const distance=Math.hypot(dx,dy)||.001;
      if(distance<.34){
        node.heading=Math.atan2(dy,dx);
        const pursuitSpeed=distance<.065?.012:.027;
        node.x=Math.max(.02,Math.min(.98,node.x+Math.cos(node.heading)*pursuitSpeed*dt));
        node.y=Math.max(.02,Math.min(.98,node.y+Math.sin(node.heading)*pursuitSpeed*dt));
      }else{
        node.heading=(node.heading||0)+Math.sin(state.elapsed*.7+node.x*19)*dt*.32;
        node.x=Math.max(.02,Math.min(.98,node.x+Math.cos(node.heading)*.006*dt));
        node.y=Math.max(.02,Math.min(.98,node.y+Math.sin(node.heading)*.006*dt));
      }
      if(distance<.043&&node.attackCooldown<=0){
        node.attackCooldown=1.15;
        playLanderSfx('bite',.72);
        damageLander(1);
      }
    });
  }

  function updateLanderShots(dt){
    state.landerShots.forEach(shot=>{
      shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
      if(shot.life<=0) return;
      const target=state.surfaceNodes.find(node=>node.type==='biological'&&!node.collected&&!node.defeated&&state.scans.biological&&Math.hypot(node.x-shot.x,node.y-shot.y)<.027);
      if(!target) return;
      shot.life=0;
      target.hp=Math.max(0,(target.hp||1)-1);
      if(target.hp<=0){
        target.defeated=true;
        setLog('LANDER GUNNER','Hostile lifeform neutralized. Biological data can now be recovered.',4);
      }
    });
    state.landerShots=state.landerShots.filter(shot=>shot.life>0&&shot.x>=0&&shot.x<=1&&shot.y>=0&&shot.y<=1);
  }

  function fireLanderShot(){
    if(state.mode!=='surface'||state.landerDestroyed||state.landerShotCooldown>0) return false;
    const angle=state.lander.angle;
    state.landerShots.push({
      x:state.lander.x+Math.cos(angle)*.028,
      y:state.lander.y+Math.sin(angle)*.028,
      vx:Math.cos(angle)*.48,
      vy:Math.sin(angle)*.48,
      life:.82
    });
    state.landerShotCooldown=LANDER_SHOT_COOLDOWN;
    playLanderSfx('shot',.68);
    return true;
  }

  function damageLander(amount=1){
    if(state.landerDestroyed) return;
    state.landerCrew=Math.max(0,state.landerCrew-amount);
    state.landerDamageFlash=1;
    if(state.landerCrew<=0){
      state.landerDestroyed=true;
      state.landerDeathTimer=0;
      state.landerShots=[];
      playLanderSfx('death',.9);
      if(controlsLabel) controlsLabel.textContent='LANDER DESTROYED - RECOVERY SIGNAL LOST';
      setLog('LANDER CONTROL',`Lander destroyed. ${state.landerStorageUsed} units of expedition cargo lost.`,7);
    }else{
      playLanderSfx('pain',.76);
      setLog('LANDER CREW',`Lifeform attack! Crew remaining: ${state.landerCrew}/${LANDER_MAX_CREW}.`,3);
    }
  }

  function finishDestroyedLanderRecovery(){
    state.mode='planetDetail';
    state.landerHold=[];
    state.landerStorageUsed=0;
    state.landerShots=[];
    state.landerDestroyed=false;
    state.landerDeathTimer=0;
    state.surfaceFade=0;
    state.planetRevealTimer=PLANET_REVEAL_DURATION;
    state.planetRevealReady=true;
    if(planetOpsMenu) planetOpsMenu.classList.remove('hidden');
    if(systemSubLabel) systemSubLabel.textContent='PLANETARY ANALYSIS';
    if(controlsLabel) controlsLabel.textContent='LANDER LOST - REPLACEMENT CREW AVAILABLE';
    setLog('LANDER CONTROL','Expedition lost. A replacement lander is ready for another deployment.',6);
    refreshPlanetOps();
  }

  function transferLanderCargo(){
    state.landerHold.forEach(item=>{
      if(item.type==='mineral'){
        const existing=state.mineralCargo[item.material]||{units:0,category:item.category,unitValue:item.unitValue};
        existing.units+=item.units;
        state.mineralCargo[item.material]=existing;
        state.collected.mineral+=item.units;
        state.cargoTradeValue+=item.units*item.unitValue;
      }else state.collected[item.type]+=item.units;
    });
    const transferred=state.landerStorageUsed;
    state.landerHold=[];
    state.landerStorageUsed=0;
    return transferred;
  }

  function beginLanderTakeoff(){
    if(state.mode!=='surface'||state.landerDestroyed) return;
    clearKeys();
    state.mode='takeoff';
    state.takeoffTimer=0;
    state.takeoffOrigin={x:state.lander.x,y:state.lander.y};
    state.lander.angle=-Math.PI/2;
    state.surfaceFade=0;
    playLanderSfx('return',.82);
    if(interaction) interaction.classList.add('hidden');
    if(systemSubLabel) systemSubLabel.textContent='LANDER ASCENT';
    if(controlsLabel) controlsLabel.textContent='LANDER RETURNING TO VANGUARD I';
    setLog('LANDER CONTROL','Recovery signal received. Lander lifting off for orbital rendezvous.',5);
    refreshPlanetOps();
  }

  function updateLanderTakeoff(dt){
    state.takeoffTimer+=dt;
    state.lander.angle=-Math.PI/2;
    state.surfaceFade=Math.max(0,Math.min(1,(state.takeoffTimer-1.95)/0.72));
    if(state.takeoffTimer>=2.75){
      const transferred=transferLanderCargo();
      state.mode='planetDetail';
      state.surfaceFade=0;
      state.takeoffTimer=0;
      state.lander={x:0.5,y:0.5,angle:-Math.PI/2};
      if(systemSubLabel) systemSubLabel.textContent='PLANETARY ANALYSIS';
      if(controlsLabel) controlsLabel.textContent='SELECT A SCAN OR DISPATCH THE PLANET LANDER';
      setLog('LANDER CONTROL',`Lander recovered aboard Vanguard I. ${transferred} cargo units transferred to the flagship.`,5);
      updateUi();
      refreshPlanetOps();
    }
  }

  function cancelLanderDescent(){
    if(state.mode!=='landing') return;
    clearKeys();
    state.mode='planetDetail';
    state.landingTimer=0;
    state.surfaceFade=0;
    if(systemSubLabel) systemSubLabel.textContent='PLANETARY ANALYSIS';
    if(controlsLabel) controlsLabel.textContent='SELECT A SCAN OR DISPATCH THE PLANET LANDER';
    setLog('LANDER CONTROL','Descent aborted. Lander secured aboard Vanguard I.',4);
    refreshPlanetOps();
  }

  function consumeEscape(event){
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function enterHyperspace(){
    const origin=currentStar();
    const angle=state.autopilotTarget
      ?Math.atan2(state.autopilotTarget.y-origin.y,state.autopilotTarget.x-origin.x)
      :Math.atan2(state.player.y,state.player.x);
    state.mode = 'hyperspace';
    Object.assign(state.hyper, {
      x:origin.x+Math.cos(angle)*48, y:origin.y+Math.sin(angle)*48,
      vx:Math.cos(angle)*42, vy:Math.sin(angle)*42, angle:state.player.angle
    });
    state.transitionLock = 2.2;
    setPlanetOpsVisible(false);
    if(systemLabel) systemLabel.textContent = 'HYPERSPACE';
    if(systemSubLabel) systemSubLabel.textContent = 'INTERSTELLAR NAVIGATION';
    if(controlsLabel) controlsLabel.innerHTML = 'W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; APPROACH A STAR TO ENTER';
    setLog('NAVIGATION', `Hyperspace transition complete. ${state.currentSystem} remains behind us on the starmap.`, 6);
  }

  function enterSolarSystem(name){
    const destination=allHyperspaceStars().find(star=>star.name===name);
    if(!destination||!destination.available) return;
    const angle = Math.atan2(state.hyper.y-destination.y,state.hyper.x-destination.x) + Math.PI;
    state.mode = 'system';
    state.currentSystem=name;
    state.autopilotTarget=null;
    Object.assign(state.player, {
      x:Math.cos(angle)*720, y:Math.sin(angle)*720,
      vx:Math.cos(angle)*-18, vy:Math.sin(angle)*-18, angle:angle+Math.PI
    });
    state.transitionLock = 2.2;
    setPlanetOpsVisible(false);
    if(systemLabel) systemLabel.textContent = `${name} SYSTEM`;
    if(systemSubLabel) systemSubLabel.textContent = 'LOCAL SPACE';
    if(controlsLabel) controlsLabel.innerHTML = 'W / ↑ THRUST&nbsp;&nbsp; A D / ← → TURN&nbsp;&nbsp; E INTERACT&nbsp;&nbsp; ESC MENU';
    setLog('NAVIGATION', `Now entering the ${name} system. ${currentBodies().length} planetary bodies charted.`, 5);
  }

  function investigate(){
    if(!storyActive || state.mode !== 'system' || state.currentSystem!=='SOL' || state.missionStage !== 0) return;
    const range = Math.hypot(state.player.x-lostShip.x, state.player.y-lostShip.y);
    if(range > 42) return;
    state.missionStage = 1;
    state.player.vx *= 0.2;
    state.player.vy *= 0.2;
    if(interaction) interaction.classList.add('hidden');
    if(missionTitle) missionTitle.textContent = 'THE LAST VECTOR';
    if(missionText) missionText.textContent = "Pioneer One is abandoned. Its damaged flight recorder points beyond Sol, toward Alpha Centauri.";
    setLog('FLIGHT RECORDER', 'Crew absent. No collision damage. Final heading: Alpha Centauri. Something drew them out of the system.', 12);
  }

  function updateUi(){
    const fuelPercent=Math.max(0,Math.min(100,state.fuel/state.maxFuel*100));
    if(fuelFill) fuelFill.style.width = `${fuelPercent.toFixed(1)}%`;
    if(fuelLabel) fuelLabel.textContent = `${Math.ceil(state.fuel)}/${state.maxFuel}`;
    if(dayLabel) dayLabel.textContent = String(state.day).padStart(3,'0');
    if(!distanceLabel) return;
    if(state.mode==='starmap'){
      if(distanceTitle) distanceTitle.textContent='FUEL RANGE';
      distanceLabel.textContent=`${Math.floor(fuelRange())} HS`;
      return;
    }
    if(state.mode==='starbase'||state.mode==='shipyard'||state.mode==='outfit'){
      if(distanceTitle) distanceTitle.textContent='CREDITS';
      distanceLabel.textContent=String(state.credits);
      return;
    }
    if(['planet','planetDetail','landing','surface','takeoff'].includes(state.mode)){
      if(distanceTitle) distanceTitle.textContent = 'LOCAL SPACE';
      if(state.mode === 'surface'||state.mode==='takeoff'){
        distanceLabel.textContent = `CREW ${state.landerCrew}/${LANDER_MAX_CREW}  HOLD ${state.landerStorageUsed}/${LANDER_STORAGE_CAPACITY}`;
      }else distanceLabel.textContent = state.planet ? state.planet.name : 'PLANET';
      return;
    }
    if(distanceTitle) distanceTitle.textContent = state.mode === 'hyperspace' ? 'NAV RANGE' : 'SIGNAL RANGE';
    if(state.missionStage === 0){
      distanceLabel.textContent = state.mode === 'system'
        ? (state.currentSystem==='SOL'?`${Math.round(Math.hypot(state.player.x-lostShip.x,state.player.y-lostShip.y))} AU`:state.currentSystem)
        : 'RETURN TO SOL';
    }else{
      distanceLabel.textContent = state.mode === 'hyperspace'
        ? `${Math.round(Math.hypot(state.hyper.x+430,state.hyper.y+255))} HS`
        : 'LEAVE SOL';
    }
  }

  function worldTransform(){
    const horizontalScale = (viewWidth-52)/(SYSTEM_EDGE*2.08);
    const verticalScale = (viewHeight-90)/(SYSTEM_EDGE*2.08*SYSTEM_TILT);
    const scale = Math.min(horizontalScale,verticalScale);
    return {scale, tilt:SYSTEM_TILT, cx:viewWidth/2, cy:viewHeight*0.51};
  }

  function drawBackdrop(red=false){
    const gradient = ctx.createRadialGradient(viewWidth*0.5,viewHeight*0.5,0,viewWidth*0.5,viewHeight*0.5,Math.max(viewWidth,viewHeight)*0.75);
    if(red){
      gradient.addColorStop(0,'#390000'); gradient.addColorStop(0.58,'#190002'); gradient.addColorStop(1,'#060000');
    }else{
      gradient.addColorStop(0,'#040817'); gradient.addColorStop(0.58,'#01030a'); gradient.addColorStop(1,'#000');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,viewWidth,viewHeight);
    if(!red){
      starfield.forEach(star=>{
        ctx.globalAlpha = 0.35 + star.size*0.22;
        ctx.fillStyle = `hsl(${star.hue} 90% 72%)`;
        ctx.fillRect(star.x*viewWidth,star.y*viewHeight,star.size,star.size);
      });
      ctx.globalAlpha = 1;
    }
  }

  function drawSystem(){
    drawBackdrop(false);
    const tr = worldTransform();
    const systemPlanets=currentBodies();
    const star=currentStar();
    ctx.save();
    ctx.translate(tr.cx,tr.cy);
    ctx.scale(tr.scale,tr.scale*tr.tilt);
    systemPlanets.forEach(body=>{
      ctx.strokeStyle = 'rgba(32,75,220,0.38)';
      ctx.lineWidth = 1/tr.scale;
      ctx.setLineDash([2/tr.scale,5/tr.scale]);
      ctx.beginPath(); ctx.arc(0,0,body.orbit,0,TWO_PI); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.save();
    ctx.scale(1,1/tr.tilt);
    const solarGlow = ctx.createRadialGradient(0,0,0,0,0,48);
    solarGlow.addColorStop(0,'#fff'); solarGlow.addColorStop(0.16,star.color); solarGlow.addColorStop(0.42,`${star.color}bb`); solarGlow.addColorStop(1,'rgba(255,90,0,0)');
    ctx.fillStyle = solarGlow; ctx.beginPath(); ctx.arc(0,0,48,0,TWO_PI); ctx.fill();
    ctx.fillStyle = '#fff5a0'; ctx.beginPath(); ctx.arc(0,0,10,0,TWO_PI); ctx.fill();
    ctx.restore();
    systemPlanets.forEach(body=> drawPlanet(body,tr.scale,tr.tilt));
    if(state.currentSystem==='SOL') drawLostShip(tr.scale,tr.tilt);
    drawPlayer(state.player,tr.scale,'#7ff7ff',tr.tilt);
    ctx.restore();
    drawEdgeGuide(tr);
  }

  function drawPlanet(body, scale, tilt=1){
    const position = bodyPosition(body);
    const x = position.x;
    const y = position.y;
    ctx.save(); ctx.translate(x,y); ctx.scale(1,1/tilt);
    ctx.shadowColor = body.color; ctx.shadowBlur = 10/scale;
    ctx.fillStyle = body.color; ctx.beginPath(); ctx.arc(0,0,body.radius/scale*1.15,0,TWO_PI); ctx.fill();
    if(body.rings){
      ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(236,218,160,0.8)'; ctx.lineWidth = 2/scale;
      ctx.beginPath(); ctx.ellipse(0,0,body.radius*2.1/scale,body.radius*0.7/scale,-0.25,0,TWO_PI); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlanetSystem(){
    drawBackdrop(false);
    const body = state.planet;
    if(!body) return;
    const scale = Math.min((viewWidth-90)/(PLANET_EDGE*2.1),(viewHeight-100)/(PLANET_EDGE*2.1*PLANET_TILT));
    const cx = viewWidth/2;
    const cy = viewHeight*0.51;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(scale,scale*PLANET_TILT);
    body.moons.forEach((moon,index)=>{
      const orbit = 66+index*25;
      ctx.strokeStyle = 'rgba(35,205,72,0.52)';
      ctx.lineWidth = 1/scale;
      ctx.setLineDash([2/scale,4/scale]);
      ctx.beginPath(); ctx.arc(0,0,orbit,0,TWO_PI); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.save();
    ctx.scale(1,1/PLANET_TILT);
    const planetRadius = Math.min(48,30+body.radius*0.75);
    const glow = ctx.createRadialGradient(0,0,planetRadius*0.25/scale,0,0,planetRadius*1.7/scale);
    glow.addColorStop(0,body.color);
    glow.addColorStop(0.55,body.color);
    glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0,0,planetRadius*1.7/scale,0,TWO_PI); ctx.fill();
    ctx.fillStyle = body.color; ctx.beginPath(); ctx.arc(0,0,planetRadius/scale,0,TWO_PI); ctx.fill();
    ctx.globalAlpha = 0.2; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-planetRadius*0.27/scale,-planetRadius*0.22/scale,planetRadius*0.48/scale,0,TWO_PI); ctx.fill(); ctx.globalAlpha = 1;
    if(body.rings){
      ctx.strokeStyle = 'rgba(239,218,154,0.88)'; ctx.lineWidth = 5/scale;
      ctx.beginPath(); ctx.ellipse(0,0,planetRadius*1.9/scale,planetRadius*0.52/scale,-0.18,0,TWO_PI); ctx.stroke();
    }
    ctx.restore();
    body.moons.forEach((moon,index)=>{
      const orbit = 66+index*25;
      const angle = 0.7+index*1.71+state.elapsed*(0.16/(1+index*0.32));
      const x = Math.cos(angle)*orbit;
      const y = Math.sin(angle)*orbit;
      ctx.save(); ctx.translate(x,y); ctx.scale(1,1/PLANET_TILT);
      ctx.shadowColor = moon.color; ctx.shadowBlur = 7/scale;
      ctx.fillStyle = moon.color; ctx.beginPath(); ctx.arc(0,0,(4.5+Math.min(2,index*0.25))/scale,0,TWO_PI); ctx.fill();
      ctx.restore();
    });
    if(body.name==='EARTH') drawLocalStarbase(scale,PLANET_TILT);
    drawPlayer(state.planetShip,scale,'#7ff7ff',PLANET_TILT);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = `rgba(52,225,93,${0.28+Math.sin(state.elapsed*4)*0.1})`;
    ctx.setLineDash([5,7]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx,cy,PLANET_EDGE*scale,PLANET_EDGE*scale*PLANET_TILT,0,0,TWO_PI); ctx.stroke();
    ctx.restore();
  }

  function drawLocalStarbase(scale,tilt){
    ctx.save();ctx.translate(EARTH_STARBASE.x,EARTH_STARBASE.y);ctx.scale(1,1/tilt);
    const pulse=0.65+Math.sin(state.elapsed*4)*0.3;
    ctx.strokeStyle=`rgba(61,239,255,${pulse})`;ctx.lineWidth=2/scale;
    ctx.beginPath();ctx.arc(0,0,25/scale,0,TWO_PI);ctx.stroke();
    ctx.fillStyle='#b9d4df';ctx.fillRect(-3/scale,-14/scale,6/scale,28/scale);
    ctx.strokeStyle='#5ff4ff';ctx.beginPath();ctx.ellipse(0,0,14/scale,6/scale,0,0,TWO_PI);ctx.stroke();
    ctx.fillStyle='#ff3c2b';ctx.beginPath();ctx.arc(0,-15/scale,3/scale,0,TWO_PI);ctx.fill();
    ctx.fillStyle='#8ff7ff';ctx.font=`${10/scale}px Orbitron, sans-serif`;ctx.textAlign='center';ctx.fillText('EARTH STARBASE',0,-31/scale);
    ctx.restore();
  }

  function drawStationSprite(x,y,scale=1){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    ctx.shadowColor='#61f3ff';ctx.shadowBlur=16;
    const spine=ctx.createLinearGradient(-14,0,14,0);spine.addColorStop(0,'#26333b');spine.addColorStop(0.48,'#d6e2e5');spine.addColorStop(0.62,'#607781');spine.addColorStop(1,'#141b20');
    ctx.fillStyle=spine;ctx.fillRect(-10,-154,20,308);
    ctx.fillStyle='#ce3030';ctx.fillRect(-12,-118,24,12);ctx.fillRect(-12,102,24,12);
    ctx.fillStyle='#aebbc1';ctx.beginPath();ctx.ellipse(0,-62,76,26,0,0,TWO_PI);ctx.fill();
    ctx.fillStyle='#26353d';ctx.beginPath();ctx.ellipse(0,-62,61,18,0,0,TWO_PI);ctx.fill();
    ctx.strokeStyle='#65f6ff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-62,66,21,0,0,TWO_PI);ctx.stroke();
    ctx.strokeStyle='#ff3b3b';ctx.lineWidth=2;
    for(let i=0;i<10;i++){const angle=i/10*TWO_PI;const px=Math.cos(angle)*82,py=-62+Math.sin(angle)*30;ctx.beginPath();ctx.moveTo(Math.cos(angle)*65,-62+Math.sin(angle)*22);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle=i%2?'#ff3838':'#53f6ff';ctx.beginPath();ctx.arc(px,py,3,0,TWO_PI);ctx.fill();}
    ctx.fillStyle='#c7d0d3';ctx.beginPath();ctx.ellipse(0,105,48,15,0,0,TWO_PI);ctx.fill();
    ctx.strokeStyle='#ef4545';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,105,46,13,0,0,TWO_PI);ctx.stroke();
    ctx.fillStyle='#1d2930';ctx.beginPath();ctx.moveTo(-116,-145);ctx.lineTo(102,-170);ctx.lineTo(134,-135);ctx.lineTo(14,-111);ctx.lineTo(-89,-117);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#9bb4c0';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#ff3838';[-72,-22,34,86].forEach(px=>{ctx.beginPath();ctx.arc(px,-133,3,0,TWO_PI);ctx.fill();});
    ctx.restore();
  }

  function drawStarbase(){
    drawBackdrop(false);
    const earthX=-viewHeight*0.19,earthY=viewHeight*0.54,earthRadius=viewHeight*0.67;
    const earth=ctx.createRadialGradient(earthX-earthRadius*0.3,earthY-earthRadius*0.35,earthRadius*0.08,earthX,earthY,earthRadius);
    earth.addColorStop(0,'#78dfff');earth.addColorStop(0.38,'#1767b2');earth.addColorStop(0.7,'#09366f');earth.addColorStop(1,'#020817');
    ctx.fillStyle=earth;ctx.beginPath();ctx.arc(earthX,earthY,earthRadius,0,TWO_PI);ctx.fill();
    ctx.save();ctx.globalAlpha=0.38;ctx.fillStyle='#60b95d';
    for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(earthX+Math.sin(i*2.1)*earthRadius*.45,earthY-earthRadius*.65+i*earthRadius*.16,earthRadius*.24,earthRadius*.08,i*.4,0,TWO_PI);ctx.fill();}ctx.restore();
    drawStationSprite(viewWidth*0.6,viewHeight*0.5,Math.min(1.35,viewHeight/690));
    ctx.fillStyle='#1221ba';ctx.fillRect(0,0,viewWidth,28);
    ctx.fillStyle='#ff49dc';ctx.font='13px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText('EARTH STARBASE',viewWidth/2,19);
    ctx.textAlign='left';ctx.fillStyle='#8ff5ff';ctx.font='12px Orbitron, sans-serif';ctx.fillText(`CREDITS: ${state.credits}`,28,62);
    ctx.fillText(`MINERAL CARGO VALUE: ${state.cargoTradeValue}`,28,84);
    const cargoNames=Object.entries(state.mineralCargo).map(([name,item])=>`${item.units} ${name}`).slice(0,6);
    ctx.font='11px "Courier New", monospace';ctx.fillStyle='#c7d9e2';ctx.fillText(cargoNames.length?cargoNames.join('  ·  '):'MINERAL HOLD EMPTY',28,108);
    if(state.starbaseNotice){
      const panelW=Math.min(430,viewWidth*0.36),panelX=viewWidth-panelW-34,panelY=55;
      ctx.fillStyle='rgba(3,12,20,0.78)';ctx.fillRect(panelX,panelY,panelW,82);
      ctx.strokeStyle='rgba(100,229,255,0.5)';ctx.strokeRect(panelX,panelY,panelW,82);
      ctx.fillStyle='#67efff';ctx.font='9px Orbitron, sans-serif';ctx.textAlign='left';ctx.fillText('STARBASE CONTROL',panelX+12,panelY+18);
      ctx.fillStyle='#d9e8ee';ctx.font='12px Arial, sans-serif';
      const words=state.starbaseNotice.split(/\s+/);let line='',lineY=panelY+40;
      words.forEach(word=>{const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>panelW-24&&line){ctx.fillText(line,panelX+12,lineY);line=word;lineY+=17;}else line=next;});
      if(line)ctx.fillText(line,panelX+12,lineY);
    }
  }

  function getTerrainCanvas(body){
    if(terrainCache[body.name]) return terrainCache[body.name];
    const profile = planetProfiles[body.name];
    const terrain = document.createElement('canvas');
    terrain.width = 512; terrain.height = 256;
    const terrainCtx = terrain.getContext('2d');
    const seed = planetSeed(body.name)*0.013;
    const tile = 4;
    for(let y=0;y<terrain.height;y+=tile){
      for(let x=0;x<terrain.width;x+=tile){
        const wave = Math.sin(x*0.031+seed)+Math.cos(y*0.047-seed*0.7)+Math.sin((x+y)*0.019+seed*2);
        const ridge = Math.sin(x*0.009-y*0.016+seed)*0.8;
        const normalized = Math.max(0,Math.min(0.999,(wave+ridge+3.8)/7.6));
        const index = Math.min(profile.palette.length-1,Math.floor(normalized*profile.palette.length));
        terrainCtx.fillStyle = profile.palette[index];
        terrainCtx.fillRect(x,y,tile,tile);
      }
    }
    terrainCache[body.name] = terrain;
    return terrain;
  }

  function drawScanNodes(rect,includeLander=false){
    state.surfaceNodes.forEach(node=>{
      const sweepProgress=state.scanAnimation.type===node.type
        ? Math.min(1,state.scanAnimation.elapsed/PLANET_SCAN_DURATION)
        : 0;
      if(node.collected || (!state.scans[node.type] && !(sweepProgress>0 && node.y<=sweepProgress))) return;
      const x = rect.x+node.x*rect.w;
      const y = rect.y+node.y*rect.h;
      ctx.save(); ctx.translate(x,y); ctx.lineWidth = 2;
      ctx.shadowColor=node.type==='mineral'?(node.color||'#ffbc35'):(node.type==='biological'?'#55ff4f':'#37ddff');
      ctx.shadowBlur=9;
      if(node.type === 'mineral'){
        ctx.strokeStyle = '#ff4a28'; ctx.fillStyle = node.color||'#ffbc35';
        ctx.beginPath(); ctx.arc(0,0,6,0,TWO_PI); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,-10);ctx.lineTo(0,10);ctx.stroke();
      }else if(node.type === 'biological'){
        ctx.fillStyle = node.defeated?'#8dff70':'#ff5647'; ctx.strokeStyle = node.defeated?'#eaffd2':'#ffb454';
        if(node.defeated){ctx.rotate(Math.PI/4);ctx.fillRect(-5,-5,10,10);ctx.strokeRect(-5,-5,10,10);}
        else{ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(8,7);ctx.lineTo(-8,7);ctx.closePath();ctx.fill();ctx.stroke();}
      }else{
        ctx.fillStyle = '#37ddff'; ctx.strokeStyle = '#fff';
        ctx.rotate(Math.PI/4);ctx.fillRect(-5,-5,10,10);ctx.strokeRect(-5,-5,10,10);
      }
      ctx.restore();
    });
    if(includeLander&&!state.landerDestroyed){
      drawLanderIcon(rect.x+state.lander.x*rect.w,rect.y+state.lander.y*rect.h,0.72,state.lander.angle);
    }
  }

  function drawScanSweep(rect){
    const type=state.scanAnimation.type;
    if(!type) return;
    const progress=Math.min(1,state.scanAnimation.elapsed/PLANET_SCAN_DURATION);
    const center=rect.y+rect.h*progress;
    const bandHeight=Math.max(42,rect.h*0.16);
    const rgb=SCAN_RGB[type];
    ctx.save();
    ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
    ctx.globalCompositeOperation='screen';
    ctx.fillStyle=`rgba(${rgb},0.17)`;
    ctx.fillRect(rect.x,rect.y,rect.w,Math.max(0,center-rect.y));
    const gradient=ctx.createLinearGradient(0,center-bandHeight,0,center+bandHeight);
    gradient.addColorStop(0,`rgba(${rgb},0)`);
    gradient.addColorStop(0.42,`rgba(${rgb},0.38)`);
    gradient.addColorStop(0.5,`rgba(${rgb},0.88)`);
    gradient.addColorStop(0.58,`rgba(${rgb},0.38)`);
    gradient.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=gradient;ctx.fillRect(rect.x,center-bandHeight,rect.w,bandHeight*2);
    ctx.fillStyle=`rgba(${rgb},0.95)`;ctx.fillRect(rect.x,center-2,rect.w,4);
    ctx.restore();
  }

  function drawPlanetGlobe(body,cx,cy,radius){
    const profile = planetProfiles[body.name];
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,radius,0,TWO_PI); ctx.clip();
    ctx.fillStyle = profile.palette[0]; ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);
    const spin = state.elapsed*18;
    for(let x=-radius*1.3;x<radius*1.3;x+=7){
      const band = Math.sin((x+spin)*0.055)+Math.sin((x+spin)*0.019+2.2);
      const index = Math.abs(Math.floor((band+2)*1.4))%profile.palette.length;
      ctx.fillStyle = profile.palette[index];
      ctx.globalAlpha = 0.62;
      ctx.beginPath();
      ctx.ellipse(cx+x,cy+Math.sin((x+spin)*0.045)*radius*0.22,radius*0.38,radius*0.82,0.45,0,TWO_PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const shade = ctx.createRadialGradient(cx-radius*0.35,cy-radius*0.38,radius*0.08,cx,cy,radius*1.1);
    shade.addColorStop(0,'rgba(255,255,255,0.34)'); shade.addColorStop(0.5,'rgba(255,255,255,0)'); shade.addColorStop(1,'rgba(0,0,0,0.78)');
    ctx.fillStyle = shade;ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);
    ctx.restore();
    ctx.save();ctx.strokeStyle='rgba(120,230,255,0.45)';ctx.lineWidth=2;ctx.shadowColor=body.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx,cy,radius,0,TWO_PI);ctx.stroke();ctx.restore();
    if(body.rings){ctx.save();ctx.strokeStyle='rgba(231,214,162,0.8)';ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(cx,cy,radius*1.65,radius*0.38,-0.16,0,TWO_PI);ctx.stroke();ctx.restore();}
  }

  function drawPlanetDetail(){
    drawBackdrop(false);
    const body = state.planet;
    const profile = getPlanetProfile();
    if(!body || !profile) return;
    const upperHeight = viewHeight*0.52;
    const cx = viewWidth*0.5;
    const cy = upperHeight*0.52;
    const targetRadius = Math.min(118,upperHeight*0.29,viewWidth*0.12);
    const revealTime=Math.min(PLANET_REVEAL_DURATION,state.planetRevealTimer);
    const zoomProgress=Math.min(1,revealTime/.58);
    const back=1.70158;
    const zoomEase=1+(back+1)*Math.pow(zoomProgress-1,3)+back*Math.pow(zoomProgress-1,2);
    const radius=targetRadius*(.035+.965*Math.max(0,zoomEase));
    const statsProgress=Math.max(0,Math.min(1,(revealTime-.48)/.34));
    const mapProgress=Math.max(0,Math.min(1,(revealTime-.62)/.58));
    const mapEase=1-Math.pow(1-mapProgress,3);
    ctx.fillStyle = '#2218d0';ctx.fillRect(0,0,viewWidth,24);
    ctx.fillStyle = '#ff48e1';ctx.font = '13px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText(body.name,viewWidth/2,17);
    drawPlanetGlobe(body,cx,cy,radius);
    if(zoomProgress<1){
      ctx.save();ctx.globalAlpha=(1-zoomProgress)*.7;ctx.strokeStyle=body.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,radius+18+zoomProgress*35,0,TWO_PI);ctx.stroke();ctx.restore();
    }
    ctx.save();ctx.globalAlpha=statsProgress;
    ctx.font='13px "Courier New",monospace';ctx.textAlign='left';ctx.fillStyle='#765cff';
    const left=[`Orbit: ${profile.orbit}`,`Atmo: ${profile.atmo}`,`Temp: ${profile.temp}`,`Weather: ${profile.weather}`,`Tectonics: ${profile.tectonics}`];
    const right=[`Mass: ${profile.mass}`,`Radius: ${profile.radius}`,`Gravity: ${profile.gravity}`,`Day: ${profile.day}`,`Tilt: ${profile.tilt}`];
    left.forEach((text,index)=>ctx.fillText(text,28,88+index*30));
    right.forEach((text,index)=>ctx.fillText(text,viewWidth-245,88+index*30));
    ctx.restore();
    if(mapProgress<=0) return;
    ctx.save();ctx.globalAlpha=mapProgress;ctx.translate(0,(1-mapEase)*72);
    const activeScan=state.scanAnimation.type;
    ctx.fillStyle=activeScan?SCAN_COLORS[activeScan]:'#8c93a3';
    ctx.font='18px Orbitron, sans-serif';ctx.textAlign='center';
    ctx.fillText(activeScan?`${activeScan.toUpperCase()} SCAN`:'PLANETARY SURFACE MAP',viewWidth/2,upperHeight+22);
    const mapRect={x:18,y:upperHeight+32,w:viewWidth-36,h:viewHeight-upperHeight-50};
    ctx.fillStyle='#3c4650';ctx.fillRect(mapRect.x-4,mapRect.y-4,mapRect.w+8,mapRect.h+8);
    ctx.drawImage(getTerrainCanvas(body),mapRect.x,mapRect.y,mapRect.w,mapRect.h);
    drawScanSweep(mapRect);
    drawScanNodes(mapRect,false);
    ctx.strokeStyle='#687684';ctx.lineWidth=2;ctx.strokeRect(mapRect.x,mapRect.y,mapRect.w,mapRect.h);
    ctx.restore();
  }

  function drawLanderIcon(x,y,scale=1,angle=-Math.PI/2){
    const size=62*scale;
    ctx.save();ctx.translate(x,y);ctx.rotate(angle+Math.PI/2);
    const moving=keys.thrust||keys.reverse||keys.left||keys.right||state.mode==='takeoff';
    if(moving){
      const flame=ctx.createLinearGradient(0,size*.28,0,size*.9);
      flame.addColorStop(0,'rgba(213,252,255,.94)');flame.addColorStop(.35,'rgba(34,169,255,.55)');flame.addColorStop(1,'rgba(31,139,255,0)');
      ctx.fillStyle=flame;ctx.shadowColor='#31b9ff';ctx.shadowBlur=11;
      [-.23,0,.23].forEach(engineX=>{
        const flicker=size*(.69+Math.random()*.18);
        ctx.beginPath();
        ctx.moveTo(size*(engineX-.07),size*.34);
        ctx.lineTo(size*engineX,flicker);
        ctx.lineTo(size*(engineX+.07),size*.34);
        ctx.closePath();ctx.fill();
      });
    }
    if(planetLanderSprite.complete&&planetLanderSprite.naturalWidth){
      ctx.shadowColor='#50dfff';ctx.shadowBlur=8;ctx.drawImage(planetLanderSprite,-size/2,-size/2,size,size);
    }else{
      ctx.rotate(-Math.PI/2);ctx.shadowColor='#7affff';ctx.shadowBlur=9;ctx.fillStyle='#d9ffff';ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-7,-8);ctx.lineTo(-4,-3);ctx.lineTo(-12,-3);ctx.lineTo(-12,3);ctx.lineTo(-4,3);ctx.lineTo(-7,8);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }

  function drawDescendingLander(x,y,scale=1){
    const size=170*scale;
    ctx.save();
    const trail=ctx.createLinearGradient(x+size*.58,y+size*.58,x+size*.12,y+size*.12);
    trail.addColorStop(0,'rgba(29,126,255,0)');trail.addColorStop(.65,'rgba(27,156,255,.34)');trail.addColorStop(1,'rgba(214,251,255,.9)');
    ctx.strokeStyle=trail;ctx.lineWidth=Math.max(3,size*.08);ctx.lineCap='round';ctx.shadowColor='#20aaff';ctx.shadowBlur=18;
    ctx.beginPath();ctx.moveTo(x+size*.62,y+size*.6);ctx.lineTo(x+size*.18,y+size*.18);ctx.stroke();
    if(descendingLanderSprite.complete&&descendingLanderSprite.naturalWidth){
      ctx.shadowColor='#4ad9ff';ctx.shadowBlur=14;ctx.drawImage(descendingLanderSprite,x-size/2,y-size/2,size,size);
    }else drawLanderIcon(x,y,scale,-2.35);
    ctx.restore();
  }

  function drawSurfaceContacts(rect,terrain,sx,sy,cropW,cropH){
    state.surfaceNodes.forEach(node=>{
      if(node.collected||!state.scans[node.type]) return;
      const sourceX=node.x*terrain.width;
      const sourceY=node.y*terrain.height;
      if(sourceX<sx||sourceX>sx+cropW||sourceY<sy||sourceY>sy+cropH) return;
      const x=rect.x+(sourceX-sx)/cropW*rect.w;
      const y=rect.y+(sourceY-sy)/cropH*rect.h;
      ctx.save();ctx.translate(x,y);
      if(node.type==='mineral'){
        const color=node.color||'#ffbc35';
        ctx.shadowColor=color;ctx.shadowBlur=18;ctx.fillStyle=color;ctx.strokeStyle='#fff3c4';ctx.lineWidth=1.5;
        [[-10,5,10],[1,1,13],[12,7,8]].forEach(([ox,oy,size])=>{
          ctx.beginPath();ctx.moveTo(ox-size*.55,oy+size*.45);ctx.lineTo(ox-size*.34,oy-size*.4);ctx.lineTo(ox+size*.15,oy-size*.62);ctx.lineTo(ox+size*.58,oy+size*.34);ctx.closePath();ctx.fill();ctx.stroke();
        });
        ctx.shadowBlur=6;ctx.fillStyle='#fff';ctx.font='bold 10px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText(node.material.toUpperCase(),0,-19);
        ctx.font='8px Orbitron, sans-serif';ctx.fillStyle=color;ctx.fillText(node.category.toUpperCase(),0,-8);
      }else if(node.type==='biological'){
        if(node.defeated){
          ctx.shadowColor='#55ff4f';ctx.shadowBlur=16;ctx.fillStyle='#77ff62';ctx.strokeStyle='#eaffd2';ctx.lineWidth=2;
          ctx.rotate(Math.PI/4);ctx.fillRect(-9,-9,18,18);ctx.strokeRect(-9,-9,18,18);ctx.rotate(-Math.PI/4);
          ctx.fillStyle='#eaffd2';ctx.font='9px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText('BIO DATA',0,-19);
        }else{
          ctx.rotate(node.heading||0);ctx.shadowColor='#ff3b35';ctx.shadowBlur=18;ctx.strokeStyle='#ff9b43';ctx.fillStyle='#e83d35';ctx.lineWidth=2;
          for(let leg=0;leg<6;leg++){const a=leg/6*TWO_PI+Math.sin(state.elapsed*8+leg)*.15;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*16,Math.sin(a)*16);ctx.stroke();}
          ctx.beginPath();ctx.arc(0,0,9+Math.sin(state.elapsed*7)*1.5,0,TWO_PI);ctx.fill();ctx.stroke();
          ctx.rotate(-(node.heading||0));ctx.fillStyle='#ffcf67';ctx.font='9px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText(`LIFE ${Math.max(0,node.hp||0)}`,0,-21);
        }
      }else{
        ctx.rotate(Math.PI/4);ctx.shadowColor='#37ddff';ctx.shadowBlur=18;ctx.fillStyle='#37ddff';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.fillRect(-9,-9,18,18);ctx.strokeRect(-9,-9,18,18);
      }
      ctx.restore();
    });
  }

  function drawLanderShots(rect,terrain,sx,sy,cropW,cropH){
    state.landerShots.forEach(shot=>{
      const sourceX=shot.x*terrain.width,sourceY=shot.y*terrain.height;
      if(sourceX<sx||sourceX>sx+cropW||sourceY<sy||sourceY>sy+cropH) return;
      const x=rect.x+(sourceX-sx)/cropW*rect.w,y=rect.y+(sourceY-sy)/cropH*rect.h;
      const angle=Math.atan2(shot.vy,shot.vx);
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle='#bffcff';ctx.lineWidth=4;ctx.shadowColor='#2bc7ff';ctx.shadowBlur=15;
      ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(9,0);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(9,0,3,0,TWO_PI);ctx.fill();ctx.restore();
    });
  }

  function drawLanderHud(rect){
    const x=rect.x+12,y=rect.y+12,w=238,h=72;
    ctx.save();ctx.fillStyle='rgba(1,9,15,.86)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#3cdcec';ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);
    ctx.font='bold 9px Orbitron, sans-serif';ctx.textAlign='left';ctx.fillStyle='#75f5ff';ctx.fillText('PLANET LANDER',x+9,y+15);
    ctx.fillStyle='#9fb3c0';ctx.fillText('CREW',x+9,y+32);
    for(let index=0;index<LANDER_MAX_CREW;index++){
      ctx.fillStyle=index<state.landerCrew?'#48f06e':'#351219';ctx.fillRect(x+50+index*10,y+24,7,10);
    }
    ctx.fillStyle='#9fb3c0';ctx.fillText('HOLD',x+9,y+51);
    ctx.fillStyle='#07141b';ctx.fillRect(x+50,y+43,120,10);ctx.fillStyle=state.landerStorageUsed>=LANDER_STORAGE_CAPACITY?'#ff5b3d':'#f1bd37';ctx.fillRect(x+50,y+43,120*(state.landerStorageUsed/LANDER_STORAGE_CAPACITY),10);
    ctx.fillStyle='#eef8ff';ctx.fillText(`${state.landerStorageUsed}/${LANDER_STORAGE_CAPACITY}`,x+178,y+52);
    ctx.fillStyle=state.landerShotCooldown<=0?'#65ff83':'#687681';ctx.fillText(state.landerShotCooldown<=0?'BLASTER READY':'BLASTER CHARGING',x+9,y+67);
    ctx.restore();
  }

  function drawLanding(){
    drawPlanetDetail();
    const t = state.landingTimer;
    const progress = Math.min(1,t/2.25);
    const eased = 1-Math.pow(1-progress,3);
    const startX=viewWidth*0.88,startY=viewHeight*0.82,endX=viewWidth*0.52,endY=viewHeight*0.27;
    drawDescendingLander(startX+(endX-startX)*eased,startY+(endY-startY)*eased,.82-eased*.48);
    if(t>1.72){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,(t-1.72)/.9)})`;ctx.fillRect(0,0,viewWidth,viewHeight);}
  }

  function drawSurface(){
    const body=state.planet;
    if(!body) return;
    ctx.fillStyle='#05070b';ctx.fillRect(0,0,viewWidth,viewHeight);
    ctx.fillStyle='#2218d0';ctx.fillRect(0,0,viewWidth,24);
    ctx.fillStyle='#ff48e1';ctx.font='12px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText(`${body.name} SURFACE`,viewWidth/2,17);
    const terrain=getTerrainCanvas(body);
    const topRect={x:16,y:32,w:viewWidth-32,h:viewHeight*0.56};
    const sensorRect={x:16,y:topRect.y+topRect.h+12,w:viewWidth-32,h:viewHeight-(topRect.y+topRect.h+28)};
    const cropW=terrain.width*0.42,cropH=terrain.height*0.42;
    const camera=state.mode==='takeoff'?state.takeoffOrigin:state.lander;
    const sx=Math.max(0,Math.min(terrain.width-cropW,camera.x*terrain.width-cropW/2));
    const sy=Math.max(0,Math.min(terrain.height-cropH,camera.y*terrain.height-cropH/2));
    ctx.drawImage(terrain,sx,sy,cropW,cropH,topRect.x,topRect.y,topRect.w,topRect.h);
    ctx.drawImage(terrain,sensorRect.x,sensorRect.y,sensorRect.w,sensorRect.h);
    drawSurfaceContacts(topRect,terrain,sx,sy,cropW,cropH);
    drawLanderShots(topRect,terrain,sx,sy,cropW,cropH);
    ctx.strokeStyle='#687684';ctx.lineWidth=3;ctx.strokeRect(topRect.x,topRect.y,topRect.w,topRect.h);ctx.strokeRect(sensorRect.x,sensorRect.y,sensorRect.w,sensorRect.h);
    drawScanNodes(sensorRect,true);
    if(state.mode==='takeoff'){
      const progress=Math.min(1,state.takeoffTimer/2.45);
      const rise=Math.pow(progress,1.45)*topRect.h*0.82;
      const landerX=topRect.x+topRect.w/2;
      const landerY=topRect.y+topRect.h/2-rise;
      for(let trail=5;trail>=1;trail--){
        const alpha=(1-progress)*0.035+trail*0.025;
        ctx.fillStyle=`rgba(83,238,255,${alpha})`;
        ctx.beginPath();ctx.arc(landerX,landerY+trail*13,4+trail*2.4,0,TWO_PI);ctx.fill();
      }
      drawLanderIcon(landerX,landerY,1+progress*0.42,-Math.PI/2);
      ctx.save();ctx.textAlign='center';ctx.font='bold 13px Orbitron, sans-serif';ctx.fillStyle='#8cffff';ctx.shadowColor='#23e8ff';ctx.shadowBlur=12;
      ctx.fillText('ASCENT TO VANGUARD I',topRect.x+topRect.w/2,topRect.y+topRect.h-18);ctx.restore();
    }else if(state.landerDestroyed){
      const blastProgress=Math.min(1,state.landerDeathTimer/1.2);
      const blastRadius=20+blastProgress*95;
      const blast=ctx.createRadialGradient(topRect.x+topRect.w/2,topRect.y+topRect.h/2,0,topRect.x+topRect.w/2,topRect.y+topRect.h/2,blastRadius);
      blast.addColorStop(0,'rgba(255,255,225,1)');blast.addColorStop(.18,'rgba(255,210,44,.95)');blast.addColorStop(.48,'rgba(255,61,20,.72)');blast.addColorStop(1,'rgba(70,0,0,0)');
      ctx.fillStyle=blast;ctx.beginPath();ctx.arc(topRect.x+topRect.w/2,topRect.y+topRect.h/2,blastRadius,0,TWO_PI);ctx.fill();
      ctx.fillStyle='#ff6a32';ctx.font='bold 18px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText('LANDER DESTROYED',topRect.x+topRect.w/2,topRect.y+topRect.h*.78);
    }else drawLanderIcon(topRect.x+topRect.w/2,topRect.y+topRect.h/2,1,state.lander.angle);
    drawLanderHud(topRect);
    state.pickupNotices.forEach((notice,index)=>{
      const progress=notice.age/notice.duration;
      ctx.save();ctx.globalAlpha=Math.max(0,1-progress);
      ctx.textAlign='center';ctx.shadowColor=notice.color;ctx.shadowBlur=12;
      ctx.fillStyle=notice.color;ctx.font='bold 18px Orbitron, sans-serif';
      ctx.fillText(notice.text,topRect.x+topRect.w/2,topRect.y+topRect.h/2-38-index*25-progress*32);
      ctx.font='10px Orbitron, sans-serif';ctx.fillStyle='#e8f7ff';
      ctx.fillText(notice.detail,topRect.x+topRect.w/2,topRect.y+topRect.h/2-21-index*25-progress*32);
      ctx.restore();
    });
    if(state.landerDamageFlash>0){ctx.fillStyle=`rgba(255,22,12,${state.landerDamageFlash*.28})`;ctx.fillRect(0,0,viewWidth,viewHeight);}
    if(state.surfaceFade>0){ctx.fillStyle=`rgba(0,0,0,${state.surfaceFade})`;ctx.fillRect(0,0,viewWidth,viewHeight);}
  }

  function drawLostShip(scale, tilt=1){
    const pulse = 0.55+Math.sin(state.elapsed*4)*0.35;
    ctx.save(); ctx.translate(lostShip.x,lostShip.y); ctx.scale(1,1/tilt);
    ctx.strokeStyle = state.missionStage === 0 ? `rgba(255,65,55,${pulse})` : 'rgba(80,180,210,0.45)';
    ctx.lineWidth = 2/scale;
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.arc(0,0,(16+i*12+pulse*5)/scale,0,TWO_PI); ctx.stroke();
    }
    ctx.rotate(-0.55); ctx.fillStyle = state.missionStage === 0 ? '#ff6b45' : '#668b9b';
    ctx.fillRect(-9/scale,-3/scale,18/scale,6/scale);
    ctx.restore();
  }

  function drawPlayer(ship, scale, color, tilt=1, pixelWidth=50){
    const displayAngle = ship.angle;
    const width=pixelWidth/scale;
    const height=width*(flagshipSprite.naturalHeight&&flagshipSprite.naturalWidth?flagshipSprite.naturalHeight/flagshipSprite.naturalWidth:2/3);
    ctx.save();ctx.translate(ship.x,ship.y);ctx.scale(1,1/tilt);ctx.rotate(displayAngle+FLAGSHIP_SPRITE_ROTATION);
    if(keys.thrust){
      const flame=ctx.createLinearGradient(0,height*.3,0,height*.95);
      flame.addColorStop(0,'rgba(206,250,255,.95)');flame.addColorStop(.38,'rgba(36,169,255,.68)');flame.addColorStop(1,'rgba(42,151,255,0)');
      ctx.fillStyle=flame;ctx.shadowColor='#27a9ff';ctx.shadowBlur=10/scale;
      [-.24,0,.24].forEach(engineX=>{
        const flicker=height*(.74+Math.random()*.2);
        ctx.beginPath();
        ctx.moveTo(width*(engineX-.075),height*.39);
        ctx.lineTo(width*engineX,flicker);
        ctx.lineTo(width*(engineX+.075),height*.39);
        ctx.closePath();ctx.fill();
      });
    }
    if(flagshipSprite.complete&&flagshipSprite.naturalWidth){
      ctx.shadowColor=color;ctx.shadowBlur=10/scale;
      ctx.drawImage(flagshipSprite,-width/2,-height/2,width,height);
    }else{
      ctx.rotate(-FLAGSHIP_SPRITE_ROTATION);ctx.shadowColor=color;ctx.shadowBlur=10/scale;ctx.fillStyle=color;
      ctx.beginPath();ctx.moveTo(13/scale,0);ctx.lineTo(-9/scale,-7/scale);ctx.lineTo(-5/scale,0);ctx.lineTo(-9/scale,7/scale);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }

  function drawEdgeGuide(tr){
    const ship = state.player;
    const distance = Math.hypot(ship.x,ship.y);
    if(distance < SYSTEM_EDGE*0.72) return;
    ctx.save();
    ctx.strokeStyle = `rgba(255,117,50,${0.3+0.25*Math.sin(state.elapsed*5)})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5,7]);
    ctx.beginPath(); ctx.ellipse(tr.cx,tr.cy,SYSTEM_EDGE*tr.scale,SYSTEM_EDGE*tr.scale*tr.tilt,0,0,TWO_PI); ctx.stroke();
    ctx.restore();
  }

  function drawHyperspace(){
    drawBackdrop(true);
    const ship = state.hyper;
    const scale = 0.78;
    const cx = viewWidth/2;
    const cy = viewHeight/2;
    hyperspaceDust.forEach(dust=>{
      const x = cx+(dust.x-ship.x)*scale;
      const y = cy+(dust.y-ship.y)*scale;
      if(x<0||x>viewWidth||y<0||y>viewHeight) return;
      ctx.fillStyle = `rgba(255,25,16,${0.2+dust.size*0.14})`;
      ctx.fillRect(x,y,dust.size,dust.size);
    });
    allHyperspaceStars().forEach(star=>{
      const x = cx+(star.x-ship.x)*scale;
      const y = cy+(star.y-ship.y)*scale;
      if(x<-50||x>viewWidth+50||y<-50||y>viewHeight+50) return;
      const pulse = 1+Math.sin(state.elapsed*3+star.x)*0.16;
      const markerRadius=Math.max(2.5,star.size*2.2);
      const glow = ctx.createRadialGradient(x,y,0,x,y,markerRadius*2.2*pulse);
      glow.addColorStop(0,star.color); glow.addColorStop(0.25,'rgba(255,65,35,0.9)'); glow.addColorStop(1,'rgba(255,0,0,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x,y,markerRadius*2.2*pulse,0,TWO_PI); ctx.fill();
      ctx.fillStyle = '#ffb4a0'; ctx.beginPath(); ctx.arc(x,y,Math.max(1.4,star.size),0,TWO_PI); ctx.fill();
      const closeEnough=Math.hypot(star.x-ship.x,star.y-ship.y)<95;
      if(!star.generated||closeEnough||state.autopilotTarget&&state.autopilotTarget.name===star.name){
        ctx.fillStyle = '#ff8a7a'; ctx.font = '9px Orbitron, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(star.name,x,y+markerRadius*2.2+12);
      }
    });
    if(state.autopilotTarget){
      const target=state.autopilotTarget;
      const tx=cx+(target.x-ship.x)*scale,ty=cy+(target.y-ship.y)*scale;
      ctx.save();ctx.strokeStyle='rgba(106,242,255,.72)';ctx.lineWidth=1.5;ctx.setLineDash([7,7]);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#8ff8ff';ctx.font='10px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText(`AUTOPILOT: ${target.name}`,cx,24);ctx.restore();
    }
    drawPlayer({x:cx,y:cy,angle:ship.angle},scale,'#67dfff',1,64);
  }

  function drawStarmap(){
    ctx.fillStyle='#01030a';ctx.fillRect(0,0,viewWidth,viewHeight);
    const tr=starmapTransform();
    const position=starmapPosition();
    const range=fuelRange();
    ctx.save();
    ctx.strokeStyle='rgba(25,55,155,.48)';ctx.lineWidth=1;
    for(let x=Math.ceil(STARMAP_BOUNDS.left/250)*250;x<=STARMAP_BOUNDS.right;x+=250){
      const sx=tr.cx+x*tr.scale;ctx.beginPath();ctx.moveTo(sx,32);ctx.lineTo(sx,viewHeight-30);ctx.stroke();
    }
    for(let y=Math.ceil(STARMAP_BOUNDS.top/250)*250;y<=STARMAP_BOUNDS.bottom;y+=250){
      const sy=tr.cy+y*tr.scale;ctx.beginPath();ctx.moveTo(28,sy);ctx.lineTo(viewWidth-28,sy);ctx.stroke();
    }
    ctx.strokeStyle='rgba(68,112,235,.82)';ctx.lineWidth=2;
    ctx.strokeRect(tr.cx+STARMAP_BOUNDS.left*tr.scale,tr.cy+STARMAP_BOUNDS.top*tr.scale,(STARMAP_BOUNDS.right-STARMAP_BOUNDS.left)*tr.scale,(STARMAP_BOUNDS.bottom-STARMAP_BOUNDS.top)*tr.scale);
    const px=tr.cx+position.x*tr.scale,py=tr.cy+position.y*tr.scale;
    ctx.fillStyle='rgba(72,225,255,.075)';ctx.strokeStyle='rgba(92,238,255,.58)';ctx.lineWidth=2;ctx.setLineDash([8,7]);
    ctx.beginPath();ctx.arc(px,py,range*tr.scale,0,TWO_PI);ctx.fill();ctx.stroke();ctx.setLineDash([]);
    allHyperspaceStars().forEach(star=>{
      const sx=tr.cx+star.x*tr.scale,sy=tr.cy+star.y*tr.scale;
      const distance=Math.hypot(star.x-position.x,star.y-position.y);
      const reachable=distance<=range+0.01;
      const selected=state.starmapSelection===star.name||state.autopilotTarget&&state.autopilotTarget.name===star.name;
      const known=!star.generated;
      ctx.save();ctx.globalAlpha=reachable?.95:.38;
      if(selected){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx,sy,7,0,TWO_PI);ctx.stroke();}
      ctx.shadowColor=star.color;ctx.shadowBlur=known?5:2;
      ctx.fillStyle=star.color;ctx.beginPath();ctx.arc(sx,sy,Math.max(1.15,star.size),0,TWO_PI);ctx.fill();
      ctx.shadowBlur=0;
      if(known||selected){
        ctx.font=known?'8px Orbitron, sans-serif':'7px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillStyle=reachable?'#aef7ff':'#69727c';ctx.fillText(star.name,sx,sy+13);
        if(!reachable&&selected){ctx.font='7px Orbitron, sans-serif';ctx.fillText('OUT OF RANGE',sx,sy+23);}
      }
      ctx.restore();
    });
    drawPlayer({x:px,y:py,angle:state.starmapReturnMode==='hyperspace'?state.hyper.angle:-Math.PI/2},1,'#4ff3ff',1,28);
    ctx.restore();
    ctx.fillStyle='#141ac8';ctx.fillRect(0,0,viewWidth,28);ctx.fillStyle='#ff48e1';ctx.font='bold 15px Orbitron, sans-serif';ctx.textAlign='center';ctx.fillText('HYPERSPACE STARMAP',viewWidth/2,19);
    ctx.font='10px Orbitron, sans-serif';ctx.fillStyle='#ff48e1';ctx.textAlign='right';ctx.fillText(`${Math.round(position.x)} : ${Math.round(position.y)}`,viewWidth-20,19);
    ctx.fillStyle='rgba(4,12,22,.88)';ctx.fillRect(18,viewHeight-52,viewWidth-36,34);ctx.strokeStyle='#2954cf';ctx.strokeRect(18,viewHeight-52,viewWidth-36,34);
    ctx.fillStyle='#79f5ff';ctx.font='10px Orbitron, sans-serif';ctx.textAlign='left';ctx.fillText(`FUEL RANGE ${Math.floor(range)} HS`,30,viewHeight-31);
    ctx.textAlign='right';ctx.fillText('CLICK STAR: PLOT COURSE    ESC: CLOSE',viewWidth-30,viewHeight-31);
  }

  function handleStoryCanvasClick(event){
    if(!storyActive||state.mode!=='starmap') return;
    const rect=canvas.getBoundingClientRect();
    const mx=(event.clientX-rect.left)*(viewWidth/rect.width),my=(event.clientY-rect.top)*(viewHeight/rect.height);
    const tr=starmapTransform();
    let nearest=null,best=Infinity;
    allHyperspaceStars().forEach(star=>{
      const distance=Math.hypot(mx-(tr.cx+star.x*tr.scale),my-(tr.cy+star.y*tr.scale));
      if(distance<best){best=distance;nearest=star;}
    });
    if(nearest&&best<11) plotStarmapCourse(nearest);
  }

  function draw(){
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    if(state.mode === 'hyperspace') drawHyperspace();
    else if(state.mode === 'starmap') drawStarmap();
    else if(state.mode === 'planet') drawPlanetSystem();
    else if(state.mode === 'planetDetail') drawPlanetDetail();
    else if(state.mode === 'landing') drawLanding();
    else if(state.mode === 'surface'||state.mode==='takeoff') drawSurface();
    else if(state.mode === 'starbase'||state.mode==='shipyard'||state.mode==='outfit') drawStarbase();
    else drawSystem();
    ctx.fillStyle = state.mode === 'hyperspace' ? 'rgba(255,20,10,0.035)' : 'rgba(0,40,90,0.035)';
    for(let y=0;y<viewHeight;y+=3) ctx.fillRect(0,y,viewWidth,1);
  }

  function loop(now){
    if(!storyActive) return;
    const dt = Math.min(0.05,Math.max(0,(now-lastTime)/1000));
    lastTime = now;
    update(dt);
    draw();
    frameId = requestAnimationFrame(loop);
  }

  function handleKeyDown(event){
    if(introRunning){
      event.preventDefault();
      finishIntro();
      return;
    }
    if(!storyActive) return;
    const key = event.key.toLowerCase();
    if(state.mode==='shipyard'){
      if(event.key==='ArrowLeft'||key==='a') cycleShipyard(-1);
      else if(event.key==='ArrowRight'||key==='d') cycleShipyard(1);
      else if(event.key==='Enter'||key==='e') buildSelectedShip();
      else if(key==='escape') returnToStarbase();
      event.preventDefault();return;
    }
    if(state.mode==='outfit'){
      if(event.key==='ArrowLeft'||key==='a') cycleOutfit(-1);
      else if(event.key==='ArrowRight'||key==='d') cycleOutfit(1);
      else if(event.key==='Enter'||key==='e') installSelectedModule();
      else if(key==='escape') returnToStarbase();
      event.preventDefault();return;
    }
    if(key==='escape'&&state.mode==='starmap'){
      consumeEscape(event);closeStarmap();return;
    }
    if(state.mode==='surface'&&(event.key==='Shift'||event.code==='ShiftLeft'||event.code==='ShiftRight')){
      event.preventDefault();beginLanderTakeoff();return;
    }
    if(state.mode==='surface'&&(event.code==='Space'||key===' ')){
      event.preventDefault();fireLanderShot();return;
    }
    if(key==='escape'&&state.mode==='surface'){
      consumeEscape(event);beginLanderTakeoff();return;
    }
    if(key==='escape'&&state.mode==='takeoff'){
      consumeEscape(event);return;
    }
    if(key==='escape'&&state.mode==='landing'){
      consumeEscape(event);cancelLanderDescent();return;
    }
    if(key==='escape'&&state.mode==='planetDetail'){
      consumeEscape(event);returnToPlanetOrbit();return;
    }
    if(key==='escape'&&state.mode==='planet'){
      consumeEscape(event);exitPlanetSystem();return;
    }
    if(key === 'escape') { event.preventDefault(); leaveStory(); return; }
    if(key === 'w' || event.key === 'ArrowUp') keys.thrust = true;
    if(key === 's' || event.key === 'ArrowDown') keys.reverse = true;
    if(key === 'a' || event.key === 'ArrowLeft') keys.left = true;
    if(key === 'd' || event.key === 'ArrowRight') keys.right = true;
    if(key === 'e'){
      if(state.mode === 'surface') collectSurfaceNode();
      else investigate();
    }
    if(['w','a','s','d','e','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) event.preventDefault();
  }

  function handleKeyUp(event){
    if(!storyActive) return;
    const key = event.key.toLowerCase();
    if(key === 'w' || event.key === 'ArrowUp') keys.thrust = false;
    if(key === 's' || event.key === 'ArrowDown') keys.reverse = false;
    if(key === 'a' || event.key === 'ArrowLeft') keys.left = false;
    if(key === 'd' || event.key === 'ArrowRight') keys.right = false;
  }

  function handleComputerButton(event){
    const panel = event.currentTarget.dataset.storyPanel;
    if(panel === 'starmap'){
      openStarmap();
    }
    if(panel === 'manifest') setLog('MANIFEST', `Vanguard I — Crew: 50 — Escort vessels: ${state.constructedShips.length} — Fuel: ${Math.ceil(state.fuel)}/${state.maxFuel}.`, 5);
    if(panel === 'game') setLog('GAME', 'Story progress is retained while this page remains open. Full save slots will follow.', 5);
    if(panel === 'navigate'){
      const target = state.autopilotTarget?`${state.autopilotTarget.name} via autopilot`:(state.missionStage === 0 ? 'the Pioneer One signal' : 'Alpha Centauri via hyperspace');
      setLog('NAVIGATION', `Current mission target: ${target}.`, 5);
    }
  }

  function scanPlanet(type){
    if(!state.planet || !['mineral','biological','energy'].includes(type)) return;
    if(state.scans[type]){
      setLog('SCAN CONTROL',`${type.toUpperCase()} scan data already catalogued.`,3);
      return;
    }
    state.scanAnimation.queue=[];
    beginPlanetScan(type);
  }

  function beginPlanetScan(type){
    state.scanAnimation.type=type;
    state.scanAnimation.elapsed=0;
    if(controlsLabel) controlsLabel.textContent=`${type.toUpperCase()} SCAN 0%`;
    setLog('SCAN CONTROL',`${type.toUpperCase()} sensor sweep in progress...`,PLANET_SCAN_DURATION);
    refreshPlanetOps();
  }

  function updatePlanetScan(dt){
    const animation=state.scanAnimation;
    if(!animation.type) return;
    animation.elapsed+=dt;
    const progress=Math.min(1,animation.elapsed/PLANET_SCAN_DURATION);
    if(controlsLabel) controlsLabel.textContent=`${animation.type.toUpperCase()} SCAN ${Math.round(progress*100)}%`;
    if(progress<1) return;
    const completed=animation.type;
    state.scans[completed]=true;
    animation.type=null;
    animation.elapsed=0;
    const count=state.surfaceNodes.filter(node=>node.type===completed).length;
    const labels={mineral:'resource deposits',biological:'biological lifeforms',energy:'energy signatures'};
    if(animation.queue.length){
      const next=animation.queue.shift();
      beginPlanetScan(next);
    }else{
      if(controlsLabel) controlsLabel.textContent='SELECT A SCAN OR DISPATCH THE PLANET LANDER';
      setLog('SCAN CONTROL',`${count} ${labels[completed]} detected on ${state.planet.name}.`,6);
      refreshPlanetOps();
    }
  }

  function collectSurfaceNode(){
    if(state.mode!=='surface'||state.landerDestroyed) return;
    let nearest=null,best=Infinity;
    state.surfaceNodes.forEach(node=>{
      if(node.collected || !state.scans[node.type]) return;
      const distance=Math.hypot(node.x-state.lander.x,node.y-state.lander.y);
      if(distance<best){best=distance;nearest=node;}
    });
    if(!nearest || best>0.045){setLog('LANDER TEAM','No scanned contact within collection range.',3);return;}
    if(nearest.type==='biological'&&!nearest.defeated){
      setLog('LANDER TEAM','Hostile lifeforms must be neutralized before biological data can be recovered.',4);
      return;
    }
    const units=nearest.type==='mineral'?10:nearest.value;
    if(state.landerStorageUsed+units>LANDER_STORAGE_CAPACITY){
      setLog('LANDER HOLD',`Insufficient storage. ${LANDER_STORAGE_CAPACITY-state.landerStorageUsed} units remain. Return to Vanguard I to unload.`,5);
      return;
    }
    nearest.collected=true;
    state.landerStorageUsed+=units;
    if(nearest.type==='mineral'){
      state.landerHold.push({type:'mineral',units,material:nearest.material,category:nearest.category,unitValue:nearest.unitValue});
      playLanderSfx('pickup',.75);
      state.pickupNotices.unshift({
        text:`+${units} ${nearest.material.toUpperCase()}`,
        detail:`${nearest.category.toUpperCase()} · ${nearest.unitValue} CREDIT${nearest.unitValue===1?'':'S'}/UNIT`,
        color:nearest.color||'#ffe45c',age:0,duration:2.5
      });
      state.pickupNotices=state.pickupNotices.slice(0,3);
      setLog('LANDER TEAM',`Loaded +${units} ${nearest.material}. Lander storage: ${state.landerStorageUsed}/${LANDER_STORAGE_CAPACITY}.`,5);
    }else{
      state.landerHold.push({type:nearest.type,units});
      const names={biological:'biological data',energy:'energy technology'};
      playLanderSfx(nearest.type==='biological'?'bio':'pickup',.76);
      state.pickupNotices.unshift({text:`+${units} ${nearest.type==='biological'?'BIO DATA':'ENERGY DATA'}`,detail:`HOLD ${state.landerStorageUsed}/${LANDER_STORAGE_CAPACITY}`,color:nearest.type==='biological'?'#63ff75':'#52e7ff',age:0,duration:2.5});
      state.pickupNotices=state.pickupNotices.slice(0,3);
      setLog('LANDER TEAM',`Recovered ${units} ${names[nearest.type]}. Lander storage: ${state.landerStorageUsed}/${LANDER_STORAGE_CAPACITY}.`,4);
    }
    updateUi();
  }

  function handlePlanetAction(event){
    const action=event.currentTarget.dataset.planetAction;
    if(action==='mineral'||action==='biological'||action==='energy') scanPlanet(action);
    else if(action==='autoscan'){
      const pending=['mineral','energy','biological'].filter(type=>!state.scans[type]);
      if(!pending.length){setLog('SCAN CONTROL','All scan channels already catalogued.',3);return;}
      state.scanAnimation.queue=pending.slice(1);
      beginPlanetScan(pending[0]);
    }else if(action==='dispatch') dispatchLander();
    else if(action==='exit'){
      if(state.mode==='surface'){
        beginLanderTakeoff();
        return;
      }else if(state.mode==='planetDetail') returnToPlanetOrbit();
    }
  }

  menuStoryBtn.addEventListener('click', beginStory);
  if(introPlayBtn){
    introPlayBtn.addEventListener('click',(event)=>{
      event.stopPropagation();
      if(introVideo.error) finishIntro();
      else attemptIntroPlayback();
    });
  }
  introVideo.addEventListener('playing',()=>{
    if(!introRunning) return;
    intro.classList.add('playing');
    if(introPlayBtn) introPlayBtn.classList.add('hidden');
  });
  introVideo.addEventListener('loadeddata',()=>{
    if(introRunning&&!introFinishing&&introVideo.paused) attemptIntroPlayback();
  });
  introVideo.addEventListener('canplay',()=>{
    if(introRunning&&!introFinishing&&introVideo.paused) attemptIntroPlayback();
  });
  introVideo.addEventListener('waiting',()=>{
    if(!introRunning || introFinishing) return;
    intro.classList.remove('playing');
    if(introStatus) introStatus.textContent = 'LOADING INTRO...';
  });
  introVideo.addEventListener('ended', finishIntro);
  introVideo.addEventListener('error', showPlaybackFallback);
  if(returnBtn) returnBtn.addEventListener('click', leaveStory);
  navButtons.forEach(button=>button.addEventListener('click',handleComputerButton));
  planetOpsButtons.forEach(button=>button.addEventListener('click',handlePlanetAction));
  canvas.addEventListener('click',handleStoryCanvasClick);
  starbaseButtons.forEach(button=>button.addEventListener('click',handleStarbaseAction));
  if(shipyardPrev) shipyardPrev.addEventListener('click',()=>cycleShipyard(-1));
  if(shipyardNext) shipyardNext.addEventListener('click',()=>cycleShipyard(1));
  if(shipyardBuild) shipyardBuild.addEventListener('click',buildSelectedShip);
  if(shipyardReturn) shipyardReturn.addEventListener('click',returnToStarbase);
  if(outfitPrev) outfitPrev.addEventListener('click',()=>cycleOutfit(-1));
  if(outfitNext) outfitNext.addEventListener('click',()=>cycleOutfit(1));
  if(outfitInstall) outfitInstall.addEventListener('click',installSelectedModule);
  if(outfitReturn) outfitReturn.addEventListener('click',returnToStarbase);
  window.addEventListener('keydown',handleKeyDown,true);
  window.addEventListener('keyup',handleKeyUp);
  window.addEventListener('blur',clearKeys);
  window.addEventListener('resize',()=>{ if(storyActive) resize(); });
  buildBackdrop();

  window.__storyDebug = {
    start: startSystemGame,
    finishIntro,
    leave: leaveStory,
    getState:()=>({mode:state.mode,currentSystem:state.currentSystem,planet:state.planet&&state.planet.name,missionStage:state.missionStage,fuel:state.fuel,maxFuel:state.maxFuel,fuelRange:fuelRange(),shipAngle:activeShip().angle,planetReveal:state.planetRevealTimer,planetRevealReady:state.planetRevealReady,spaceThemeActive:!spaceTheme.paused,orbitTheme:activeOrbitThemeIndex+1,orbitThemeActive:!!activeOrbitTheme&&!activeOrbitTheme.paused,autopilotTarget:state.autopilotTarget&&{...state.autopilotTarget},scans:{...state.scans},scanType:state.scanAnimation.type,mineralCargo:JSON.parse(JSON.stringify(state.mineralCargo)),cargoTradeValue:state.cargoTradeValue,credits:state.credits,constructedShips:state.constructedShips.map(ship=>({...ship})),installedModules:[...state.installedModules],upgrades:{...state.upgrades},landerAngle:state.lander.angle,landerCrew:state.landerCrew,landerStorageUsed:state.landerStorageUsed,landerHold:state.landerHold.map(item=>({...item})),landerShots:state.landerShots.length,landerDestroyed:state.landerDestroyed,remainingMinerals:state.surfaceNodes.filter(node=>node.type==='mineral'&&!node.collected).length,remainingLifeforms:state.surfaceNodes.filter(node=>node.type==='biological'&&!node.collected&&!node.defeated).length,biologicalData:state.surfaceNodes.filter(node=>node.type==='biological'&&!node.collected&&node.defeated).length,active:storyActive,intro:introRunning}),
    setPlayer:(x,y)=>{ const ship=activeShip(); ship.x=x; ship.y=y; ship.vx=0; ship.vy=0; },
    enterPlanet:(name)=>{ const body=bodies.find(item=>item.name===String(name).toUpperCase()); if(body) enterPlanetSystem(body); },
    openPlanet:(name)=>{ const body=bodies.find(item=>item.name===String(name).toUpperCase()); if(body){enterPlanetSystem(body);enterPlanetDetail();} },
    dispatchLander,
    enterSurface,
    pause:()=>{storyActive=false;cancelAnimationFrame(frameId);},
    advanceScan:updatePlanetScan,
    goToFirstMineral:()=>{const node=state.surfaceNodes.find(item=>item.type==='mineral'&&!item.collected);if(node){state.mode='surface';state.scans.mineral=true;state.lander={x:node.x,y:node.y,angle:-Math.PI/2};}return node;},
    collectFirstMineral:()=>{const node=state.surfaceNodes.find(item=>item.type==='mineral'&&!item.collected);if(node){state.mode='surface';state.scans.mineral=true;state.lander={x:node.x,y:node.y,angle:-Math.PI/2};collectSurfaceNode();}return node;},
    goToFirstLifeform:()=>{const node=state.surfaceNodes.find(item=>item.type==='biological'&&!item.collected&&!item.defeated);if(node){state.mode='surface';state.scans.biological=true;state.lander={x:Math.max(.02,node.x-.09),y:node.y,angle:0};}return node;},
    collectFirstBio:()=>{const node=state.surfaceNodes.find(item=>item.type==='biological'&&!item.collected&&item.defeated);if(node){state.mode='surface';state.scans.biological=true;state.lander={x:node.x,y:node.y,angle:0};collectSurfaceNode();}return node;},
    fireLanderShot,
    advanceLander:updateLander,
    damageLander,
    beginLanderTakeoff,
    advanceTakeoff:updateLanderTakeoff,
    dockStarbase:()=>{const earth=bodies.find(body=>body.name==='EARTH');if(earth){state.planet=earth;enterStarbase();}},
    grantCredits:(amount=500)=>{state.credits+=Math.max(0,Number(amount)||0);updateShipyard();updateOutfit();updateUi();return state.credits;},
    openShipyard,
    buildSelectedShip,
    openOutfit,
    installSelectedModule,
    cycleOutfit,
    cycleShipyard,
    returnToStarbase,
    openStarmap,
    closeStarmap,
    plotCourse:(name)=>{const star=allHyperspaceStars().find(item=>item.name===String(name).toUpperCase());return star?plotStarmapCourse(star):false;},
    enterHyperspace,
    enterSystem:enterSolarSystem,
    tradeMinerals,
    investigate
  };
})();
