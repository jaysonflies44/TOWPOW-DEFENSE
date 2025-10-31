
# 🎮 Advanced Tower Defense Engine

**by jaay** • vibe-coded for fun

- A fully moddable browser-based tower defense game with visual scripting, evolution systems, and projectile interactions.

- App contains bugs that affect modding, gameplay and user experience that i couldnt fix because they were left ignored by me, i did debugged some, but as more features were added, more bugs appeared. but dw, the bugs didnt fully bugged the modding thing, but there maybe some errors in terms of UI etc. pls Go ahead and download this repository and fix the bugs or fork the repo. OR you can just use mods to fix the bugs if THAT mod isnt affected by that bug then it would be a great help to the modding community as well as our users. Thanks
---

## 🚀 Quick Start

1. Open `index.html` in a browser
2. Build towers (drag from shop)
3. Start waves
4. Survive

## 🎯 Features

### Core Systems
- **Evolution System** - Towers evolve based on conditions
- **Loot Drops** - Enemies drop resources
- **Tower Synergies** - Towers buff nearby towers
- **Status Combos** - Combine status effects for bonus damage
- **Projectile Interactions** - Projectiles collide and create combos
- **Multi-Resource Economy** - Gold, Mana, Souls, Energy, Stone, etc.
- **Tower Modes** - Switch tower behavior mid-game
- **Advanced Targeting** - Custom filters (flying only, boss only, etc.)
- **Predictive Aiming** - Towers lead moving targets
- **Save/Load System** - Persistent progress
- **State Snapshots** - Undo system

### Game Modes
- **Normal** - Standard gameplay
- **Endless** - Infinite waves
- **Time Attack** - 20 waves speed run
- **Survival** - 5 lives only

### Visual Features
- Custom tower parts system
- Damage numbers
- Particle effects
- Screen shake & flash
- Animated emitters
- Pixel art aesthetic

---

## 📦 Modding API

### Mod Template

```javascript
const MyMod = GameAPI.defineMod({
  id: 'my_mod_id',
  name: 'My Mod Name',
  author: 'Your Name',
  description: 'What it does',
  version: '1.0.0'
});
```

---

## 🗼 Tower API

### Register Tower

```javascript
GameAPI.registerTower({
  id: 'tower_id',
  name: 'Tower Name',
  icon: '🔫',
  cost: 100,
  resourceCosts: {gold: 100, mana: 50},
  range: 150,
  damage: 25,
  cooldown: 30,
  rotate: true,
  projectile: 'bullet',
  behavior: 'SEEK_AND_SHOOT',
  color: '#ff0000',
  maxLevel: 10,
  size: 15,
  parts: ['square_base', 'simple_barrel']
});
```

### Tower Evolution

```javascript
GameAPI.registerEvolution({
  id: 'evo_id',
  name: 'Evolution Name',
  fromTower: 'basic_tower',
  toTower: {/* tower definition */},
  killCount: 25,
  timeAlive: 3600,
  damageDealt: 5000,
  waveReached: 10,
  customCondition: (tower, game) => true,
  keepLevel: true,
  transformEffect: (tower, game) => {
    // Custom animation
  }
});
```

### Tower Modes

```javascript
GameAPI.registerTowerMode('tower_id', {
  id: 'sniper_mode',
  name: 'Sniper Mode',
  icon: '🎯',
  description: 'Long range, high damage',
  damageMultiplier: 2,
  rangeMultiplier: 1.5,
  cooldownMultiplier: 1.3,
  onActivate: (tower) => {},
  onDeactivate: (tower) => {}
});
```

### Tower Synergies

```javascript
GameAPI.registerTowerSynergy({
  id: 'fire_synergy',
  name: 'Inferno',
  towerType: 'fire_tower',
  nearbyType: 'fire_tower',
  range: 100,
  minCount: 1,
  damageMultiplier: 1.5,
  rangeBonus: 20,
  color: '#ff6600'
});
```

### Custom Tower Buttons

```javascript
GameAPI.addTowerButton({
  id: 'custom_btn',
  label: 'Button Label',
  icon: '⚡',
  color: '#00ff00',
  condition: (tower) => tower.level > 3,
  onClick: (tower, game) => {
    // Button action
  }
});
```

---

## 👾 Enemy API

### Register Enemy

```javascript
GameAPI.registerEnemy({
  id: 'enemy_id',
  hp: 100,
  speed: 1.5,
  reward: 10,
  color: '#ff0000',
  size: 12,
  behavior: 'FOLLOW_PATH',
  flying: false,
  shield: 50,
  splits: 2,
  lootTable: 'common_loot'
});
```

---

## 🔫 Projectile API

### Register Projectile

```javascript
GameAPI.registerProjectile({
  id: 'bullet',
  speed: 6,
  lifetime: 60,
  maxLifetime: 60,
  color: ['#ffff00', '#ffaa00'],
  size: 4,
  behavior: 'FIRE_PROJECTILE',
  homing: true,
  trail: true
});
```

### Projectile Interactions

```javascript
GameAPI.registerProjectileInteraction({
  id: 'fire_ice',
  name: 'Steam Explosion',
  projectileA: 'fire',
  projectileB: 'ice',
  range: 40,
  damage: 100,
  aoe: 80,
  particleColor: '#00ffff',
  particleCount: 50,
  destroyBoth: true,
  onInteract: (projA, projB, x, y, game) => {}
});
```

---

## 🧠 Behavior API

### Register Behavior

```javascript
GameAPI.registerBehavior('CUSTOM_BEHAVIOR', function(entity) {
  // Custom logic
  entity.x += entity.speed;
});
```

### Built-in Behaviors

**Towers:**
- `SEEK_AND_SHOOT` - Basic targeting
- `RAPID_FIRE` - Fast shooting
- `SNIPER_SHOT` - Charged shot
- `BURST_FIRE` - 3-shot burst
- `AOE_ATTACK` - Area damage
- `CHAIN_LIGHTNING` - Jumps between enemies
- `MORTAR_STRIKE` - Arcing projectile
- `FLAMETHROWER` - Cone damage
- `LASER_BEAM` - Continuous beam
- `MULTI_TARGET` - Hits multiple enemies
- `SLOW_AURA` - Support tower

**Enemies:**
- `FOLLOW_PATH` - Standard movement
- `ZIGZAG_PATH` - Weaving movement
- `TELEPORT_DASH` - Teleports forward
- `FLY_TO_GOAL` - Direct line
- `REGENERATING_WALK` - Heals over time

**Projectiles:**
- `FIRE_PROJECTILE` - Standard homing
- `BOUNCING_SHOT` - Bounces between enemies
- `PIERCING_SHOT` - Pierces through
- `MORTAR_PROJECTILE` - Arc trajectory

---

## 🎁 Loot System

### Register Loot Table

```javascript
GameAPI.registerLootTable('boss_loot', {
  guaranteed: [
    {item: 'gold', amount: 100, rarity: 'legendary'}
  ],
  items: [
    {item: 'mana', amount: 50, chance: 0.5, rarity: 'rare'},
    {item: 'gem', amount: 1, chance: 0.2, rarity: 'epic',
     onCollect: (drop, game) => {
       game.addGold(500);
     }
    }
  ],
  maxDrops: 5
});
```

---

## 💎 Resource System

### Register Resource

```javascript
GameAPI.registerResource('mana', {
  name: 'Mana',
  icon: '🔮',
  color: '#9c27b0',
  defaultValue: 100,
  max: 500,
  displayInHUD: true
});
```

### Resource Management

```javascript
GameAPI.addResource('mana', 50);
GameAPI.getResource('mana');
ResourceManager.spendResources({gold: 100, mana: 50});
ResourceManager.hasResources({gold: 100});
```

---

## 🌀 Status System

### Register Condition

```javascript
GameAPI.registerCondition('burn', (enemy) => {
  enemy.hp -= 1;
  if (Math.random() < 0.2) {
    GameAPI.spawnParticle(enemy.x, enemy.y, '#ff6600', 3, 15);
  }
});
```

### Status Combos

```javascript
GameAPI.registerStatusCombo({
  id: 'steam_explosion',
  name: 'Steam Explosion',
  requires: ['burn', 'frozen'],
  requiresAll: true,
  damage: 100,
  removeStatus: ['burn', 'frozen'],
  particleColor: '#00ffff',
  particleCount: 30,
  onTrigger: (enemy, game) => {}
});
```

---

## 🎯 Targeting System

### Register Filter

```javascript
GameAPI.registerTargetFilter('flying_only', (enemy, tower) => {
  return enemy.flying === true;
});

// Set tower filter
GameAPI.setTowerFilter(tower, 'flying_only');
```

### Built-in Filters
- `flying_only`
- `ground_only`
- `high_hp` (>50%)
- `low_hp` (<30%)
- `boss_only`
- `poisoned_only`
- `frozen_only`
- `no_shield`

---

## 🌊 Wave System

### Register Wave Generator

```javascript
GameAPI.registerWaveGenerator('boss_rush', (waveNum, game) => {
  const composition = [];
  for (let i = 0; i < waveNum; i++) {
    composition.push('boss');
  }
  return composition;
});

GameAPI.setWaveGenerator('boss_rush');
```

### Spawn Enemies

```javascript
GameAPI.spawnEnemyAt('boss', {x: 100, y: 100, pathIndex: 0}, 1000);
```

### Wave Scripts

```javascript
GameAPI.executeWaveScript([
  {time: 0, action: 'spawn', enemy: 'boss', count: 1},
  {time: 5000, action: 'modifier', id: 'rage', config: {damageMultiplier: 2}},
  {time: 10000, action: 'event', eventType: 'custom', data: {}}
]);
```

---

## 💥 Particle System

### Register Particle Type

```javascript
GameAPI.registerParticleType('explosion', {
  behavior: 'default',
  color: '#ff6600',
  size: 6,
  lifetime: 30,
  speed: 5,
  gravity: 0.1,
  fadeOut: true,
  shrink: true
});
```

### Spawn Particles

```javascript
GameAPI.spawnCustomParticle('explosion', x, y, vx, vy);
GameAPI.spawnParticle(x, y, color, size, lifetime, vx, vy);
```

### Create Emitter

```javascript
GameAPI.createEmitter({
  x: 100,
  y: 100,
  particleType: 'sparkle',
  rate: 30,
  duration: 600,
  shape: 'circle',
  radius: 50,
  attachTo: towerObject
});
```

### Screen Effects

```javascript
GameAPI.screenShake(intensity, duration);
GameAPI.screenFlash(color, duration);
```

---

## 🎨 Visual System

### Register Tower Part

```javascript
GameAPI.registerTowerPart('triangle_base', {
  type: 'base',
  layer: 0,
  render: (ctx, tower, x, y) => {
    const size = tower.size || 15;
    ctx.fillStyle = tower.color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
  }
});
```

### Apply Parts to Tower

```javascript
HookManager.on('towerPlaced', (tower) => {
  if (tower.id.includes('my_tower')) {
    tower.parts = ['triangle_base', 'dual_barrel', 'glow_core'];
  }
});
```

---

## 🎮 Ability System

### Register Ability

```javascript
GameAPI.registerAbility('meteor_strike', {
  name: 'Meteor Strike',
  description: 'Deal massive AOE damage',
  icon: '☄️',
  cooldown: 30000,
  cost: {gold: 200, mana: 100},
  hotkey: 'q',
  canExecute: (game) => game.enemies.length > 0,
  onExecute: (game, target) => {
    game.enemies.forEach(enemy => {
      GameAPI.damageEnemy(enemy, 500, null);
    });
  }
});
```

### Execute Ability

```javascript
GameAPI.executeAbility('meteor_strike', targetData);
```

---

## 🔗 Event Hooks

### Available Events

```javascript
GameAPI.on('waveStart', (waveNum) => {});
GameAPI.on('waveEnd', (waveNum, goldReward) => {});
GameAPI.on('enemyKilled', (enemy, source) => {});
GameAPI.on('enemySpawned', (enemy) => {});
GameAPI.on('enemyDamaged', (enemy, damage, source, type) => {});
GameAPI.on('towerPlaced', (tower) => {});
GameAPI.on('towerUpgraded', (tower) => {});
GameAPI.on('towerSold', (tower) => {});
GameAPI.on('towerEvolved', (tower, evolution) => {});
GameAPI.on('projectileFired', (proj, tower, target) => {});
GameAPI.on('projectileHit', (proj, enemy) => {});
GameAPI.on('projectileInteraction', (projA, projB, interaction) => {});
GameAPI.on('statusComboTriggered', (enemy, combo) => {});
GameAPI.on('abilityExecuted', (abilityId, target) => {});
GameAPI.on('resourceChanged', (resourceId, amount, oldAmount) => {});
GameAPI.on('resourceGained', (resourceId, amount) => {});
GameAPI.on('resourceSpent', (resourceId, amount) => {});
GameAPI.on('renderWorld', (ctx) => {});
GameAPI.on('renderUI', (ctx) => {});
GameAPI.on('tick', () => {});
GameAPI.on('gameOver', (finalScore) => {});
```

---

## 🎨 UI System

### Create Custom Panel

```javascript
const panel = UIManager.createPanel({
  id: 'my_panel',
  title: 'My Panel',
  x: 100,
  y: 100,
  width: 300,
  height: 200,
  draggable: true,
  closable: true,
  visible: true,
  html: '<p>Content here</p>'
});
```

### Update Panel

```javascript
UIManager.updatePanel('my_panel', '<p>New content</p>');
UIManager.showPanel('my_panel');
UIManager.hidePanel('my_panel');
UIManager.removePanel('my_panel');
```

### Add Button to Panel

```javascript
UIManager.addButton('my_panel', 'Click Me', () => {
  alert('Clicked!');
}, {background: '#00ff00'});
```

---

## 🌐 Global Modifiers

### Register Modifier

```javascript
GameAPI.registerGlobalModifier('damage_boost', {
  name: 'Damage Boost',
  description: '2x damage for 10 seconds',
  damageMultiplier: 2,
  duration: 10000,
  onApply: (game) => {
    console.log('Damage boost activated!');
  },
  onTick: (game, elapsed) => {},
  onRemove: (game) => {}
});
```

---

## 💾 State Management

### Save/Load Mod Data

```javascript
GameAPI.saveModData('my_mod', 'highScore', 10000);
const highScore = GameAPI.loadModData('my_mod', 'highScore', 0);
```

### Snapshots

```javascript
GameAPI.saveSnapshot('before_wave_10');
GameAPI.loadSnapshot(0);
GameAPI.undo();
```

---

## 🛠️ Utility Functions

### Queries

```javascript
GameAPI.getNearestEnemy(x, y, range);
GameAPI.getEnemiesInRange(x, y, range);
```

### Damage

```javascript
GameAPI.damageEnemy(enemy, damage, source);
GameAPI.damageEnemyTyped(enemy, damage, source, 'fire');
```

### Effects

```javascript
GameAPI.spawnEffect(x, y, 'explosion', duration);
```

### Game Access

```javascript
GameAPI.Game.gold
GameAPI.Game.lives
GameAPI.Game.wave
GameAPI.Game.towers
GameAPI.Game.enemies
GameAPI.Game.projectiles
```

---

## 📝 Example Mods

### Simple Tower

```javascript
GameAPI.defineMod({
  id: 'laser_tower',
  name: 'Laser Tower Mod',
  author: 'jaay',
  version: '1.0.0'
});

GameAPI.registerTower({
  id: 'laser',
  name: 'Laser Tower',
  icon: '🔴',
  cost: 300,
  range: 200,
  damage: 50,
  cooldown: 20,
  behavior: 'LASER_BEAM',
  color: '#ff0000'
});
```

### Resource Tower

```javascript
GameAPI.registerResource('mana', {
  name: 'Mana',
  icon: '🔮',
  color: '#9c27b0',
  defaultValue: 0,
  max: 1000,
  displayInHUD: true
});

GameAPI.registerTower({
  id: 'mana_generator',
  name: 'Mana Crystal',
  icon: '💠',
  cost: 150,
  behavior: 'RESOURCE_GENERATOR',
  resourceGenerator: {
    mana: 5
  },
  generateInterval: 60
});
```

### Evolution Tower

```javascript
GameAPI.registerTower({
  id: 'starter',
  name: 'Starter Tower',
  cost: 50,
  damage: 10,
  range: 100,
  cooldown: 30,
  behavior: 'SEEK_AND_SHOOT',
  projectile: 'bullet'
});

GameAPI.registerEvolution({
  id: 'starter_evo',
  fromTower: 'starter',
  toTower: {
    name: 'Advanced Tower',
    damage: 25,
    cooldown: 20
  },
  killCount: 10
});
```
