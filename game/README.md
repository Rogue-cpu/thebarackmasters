# Ur-Quan Super Melee — Demo

This is a minimal HTML5 Canvas demo showing a Super Melee-style top-down space battle with a simple ship selection menu.

How to run
- Open `C:/Users/Connor/Downloads/The Barack Masters/game/index.html` in a browser.

Controls & usage
- Click a ship thumbnail to set Team A's ship. Right-click (or context-click) to set Team B's ship.
- Click `Start Battle` to spawn fleets and run the demo.
- `Reset` stops the battle.

Next steps you might want:
- Replace simple drawn ships with 16/32-bit pixel art sprites.
- Add keyboard control for a player ship (WASD + mouse aim).
- Improve AI (patterned movement, special weapons, formations).
- Add music, sounds, and additional UI (crew, battery bars, victory screens).

Avatar HUD images
- Place race-specific avatar PNGs under `game/assets/avatars/<race>/` using these filenames:
	- `idle.png` — pilot at rest (required; also used as fallback)
	- `thrust.png` — when thrusting forward
	- `left.png` / `right.png` — optional facing images while holding A/D
	- `fire.png` — when firing
	- `special.png` — when activating a special ability
- Example: Servos avatars live in `game/assets/avatars/servos/idle.png`, `.../thrust.png`, etc.
- If a race folder is missing a specific pose the code falls back to a shared `game/assets/avatars/<pose>.png`, then to `game/assets/avatars/idle.png`.

Sound effects scaffold
- Drop audio files (OGG/MP3/WAV) into `game/assets/sfx/<race>/` using cue names `thrust`, `fire`, `hit`, and `special` (e.g., `game/assets/sfx/servos/fire.mp3`).
- The loader automatically probes those files (falling back through multiple extensions and optionally shared `game/assets/sfx/<cue>.*` variants) when you change the player race. Present cues are cached and can be triggered from gameplay hooks (currently the player `fire` cue runs when shooting if the file exists).
- A universal ship-destruction cue can live at `game/assets/sfx/death.mp3`; it plays whenever any ship's HP hits zero.
- A post-battle victory sting can be supplied as `game/assets/sfx/victory.mp3`. When one team survives, the camera zooms toward the winning ship and this clip plays.

Battle music
- Place your looping battle track at `game/assets/music/battle.mp3`. The Start Battle button initializes and plays it, and Reset stops it. (You can swap the file or update `BGM.src` in `main.js` to point at additional tracks.)

Ship sprites
- Optional race-specific ship art can be placed at `game/assets/ships/<race>.png`.
- Sprites are auto-scaled to the ship's configured size and used both in-game (instead of the vector placeholder) and for HUD portraits.
- If a sprite is missing the code falls back to the procedural vector ship.
- Ship configs can optionally define `spriteScale`, `spriteAngleOffset`, and `trailColors` (RGB arrays for core/mid) to fine-tune how the sprite renders and what color ion trail/engine flare it emits.
