// ============================================
// 🧠 COMPREHENSIVE BEHAVIORS LIBRARY
// ============================================

console.log('📦 Loading Behaviors Library...');

// ============================================
// 🔫 TOWER ATTACK BEHAVIORS
// ============================================

// Basic seeking and shooting (already exists, keeping for reference)
GameAPI.registerBehavior('RESOURCE_GENERATOR', function(tower) {
  if (!tower.resourceGenerator) return;
  
  tower.generateTimer = (tower.generateTimer || 0) + 1;
  
  if (tower.generateTimer >= (tower.generateInterval || 180)) {
    tower.generateTimer = 0;
    
    // Generate resources
    Object.entries(tower.resourceGenerator).forEach(([resourceId, amount]) => {
      ResourceManager.addResource(resourceId, amount);
      
      // Visual effect
      const resource = resourceRegistry[resourceId];
      if (resource) {
        for (let i = 0; i < 5; i++) {
          GameAPI.spawnParticle(
            tower.x, tower.y,
            resource.color, 4, 30,
            (Math.random()-0.5)*2,
            -Math.random()*2
          );
        }
      }
    });
  }
});
    
        GameAPI.registerBehavior('SEEK_AND_SHOOT', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest) {
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    tower.hasTarget = true;
    
    if (tower.cooldownTimer <= 0) {
      tower.cooldownTimer = tower.cooldown;
      fireProjectile(tower, nearest);
    }
  } else {
    tower.hasTarget = false;
  }
});

// AOE Attack (already exists)
GameAPI.registerBehavior('AOE_ATTACK', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  if (tower.cooldownTimer <= 0) {
    const enemies = GameAPI.getEnemiesInRange(tower.x, tower.y, tower.range);
    
    if (enemies.length > 0) {
      tower.cooldownTimer = tower.cooldown;
      
      enemies.forEach(enemy => {
        GameAPI.damageEnemy(enemy, tower.damage, tower);
        
        for (let i = 0; i < 10; i++) {
          GameAPI.spawnParticle(
            enemy.x + (Math.random()-0.5)*30,
            enemy.y + (Math.random()-0.5)*30,
            '#ff6600', 5, 25
          );
        }
      });
      
      GameAPI.spawnEffect(tower.x, tower.y, 'explosion', 30);
    }
  }
});

// Burst Fire - Shoots multiple projectiles rapidly
GameAPI.registerBehavior('BURST_FIRE', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  tower.burstCount = tower.burstCount || 0;
  tower.burstDelay = tower.burstDelay || 0;
  
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest) {
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    tower.hasTarget = true;
    
    if (tower.cooldownTimer <= 0 && tower.burstCount === 0) {
      tower.burstCount = 3; // Fire 3 shots
      tower.burstDelay = 5;
    }
    
    if (tower.burstCount > 0) {
      tower.burstDelay--;
      if (tower.burstDelay <= 0) {
        fireProjectile(tower, nearest);
        tower.burstCount--;
        tower.burstDelay = 5;
        
        if (tower.burstCount === 0) {
          tower.cooldownTimer = tower.cooldown;
        }
      }
    }
  } else {
    tower.hasTarget = false;
  }
});

// Rapid Fire - Very fast, low damage
GameAPI.registerBehavior('RAPID_FIRE', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest) {
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    tower.hasTarget = true;
    
    if (tower.cooldownTimer <= 0) {
      tower.cooldownTimer = tower.cooldown || 8; // Very fast fire rate
      fireProjectile(tower, nearest);
      
      // Muzzle flash
      GameAPI.spawnParticle(
        tower.x + Math.cos(tower.angle) * 20,
        tower.y + Math.sin(tower.angle) * 20,
        '#ffaa00', 4, 8
      );
    }
  } else {
    tower.hasTarget = false;
  }
});

// Sniper - Long range, high damage, slow fire
GameAPI.registerBehavior('SNIPER_SHOT', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  tower.charging = tower.charging || false;
  tower.chargeTime = tower.chargeTime || 0;
  
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest && !tower.charging) {
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    tower.hasTarget = true;
    
    if (tower.cooldownTimer <= 0) {
      tower.charging = true;
      tower.chargeTime = 30;
      tower.target = nearest;
    }
  }
  
  if (tower.charging) {
    tower.chargeTime--;
    
    // Charging particles
    if (tower.chargeTime % 3 === 0) {
      GameAPI.spawnParticle(
        tower.x + (Math.random()-0.5)*20,
        tower.y + (Math.random()-0.5)*20,
        '#ff0000', 3, 15
      );
    }
    
    if (tower.chargeTime <= 0 && tower.target && !tower.target.dead) {
      fireProjectile(tower, tower.target);
      tower.charging = false;
      tower.cooldownTimer = tower.cooldown;
      tower.target = null;
      
      // Sniper flash
      for (let i = 0; i < 15; i++) {
        GameAPI.spawnParticle(
          tower.x, tower.y,
          '#ffffff', 6, 20,
          Math.cos(tower.angle + (Math.random()-0.5)*0.3) * 8,
          Math.sin(tower.angle + (Math.random()-0.5)*0.3) * 8
        );
      }
    }
  }
  
  if (!nearest) {
    tower.hasTarget = false;
    tower.charging = false;
  }
});

// Chain Lightning - Jumps between enemies
GameAPI.registerBehavior('CHAIN_LIGHTNING', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  if (tower.cooldownTimer <= 0) {
    const enemies = GameAPI.getEnemiesInRange(tower.x, tower.y, tower.range);
    
    if (enemies.length > 0) {
      tower.cooldownTimer = tower.cooldown;
      
      let current = enemies[0];
      const chained = [current];
      const maxChains = Math.min(5, enemies.length);
      
      for (let i = 0; i < maxChains - 1; i++) {
        let nearest = null;
        let minDist = 100;
        
        for (let enemy of enemies) {
          if (!chained.includes(enemy)) {
            const dist = Math.hypot(enemy.x - current.x, enemy.y - current.y);
            if (dist < minDist) {
              minDist = dist;
              nearest = enemy;
            }
          }
        }
        
        if (nearest) {
          chained.push(nearest);
          current = nearest;
        }
      }
      
      // Damage and visualize chain
      chained.forEach((enemy, index) => {
        GameAPI.damageEnemy(enemy, tower.damage * Math.pow(0.8, index), tower);
        
        if (index > 0) {
          const prev = chained[index - 1];
          const steps = 8;
          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            GameAPI.spawnParticle(
              prev.x + (enemy.x - prev.x) * t,
              prev.y + (enemy.y - prev.y) * t,
              '#00ffff', 4, 15, 0, 0
            );
          }
        }
      });
    }
  }
});

// Mortar - Arcing projectile with splash
GameAPI.registerBehavior('MORTAR_STRIKE', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest && tower.cooldownTimer <= 0) {
    tower.cooldownTimer = tower.cooldown;
    
    // Create arcing projectile
    const proj = {
      id: 'mortar_' + Date.now(),
      x: tower.x,
      y: tower.y,
      targetX: nearest.x,
      targetY: nearest.y,
      progress: 0,
      speed: 0.02,
      damage: tower.damage,
      splashRange: tower.splashRange || 60,
      source: tower,
      color: ['#ff6600', '#ff9900'],
      behavior: 'MORTAR_PROJECTILE'
    };
    
    Game.projectiles.push(proj);
  }
});

// Flamethrower - Cone of fire
GameAPI.registerBehavior('FLAMETHROWER', function(tower) {
  const enemies = GameAPI.getEnemiesInRange(tower.x, tower.y, tower.range);
  
  if (enemies.length > 0) {
    tower.hasTarget = true;
    const nearest = enemies[0];
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    
    enemies.forEach(enemy => {
      const angleToEnemy = Math.atan2(enemy.y - tower.y, enemy.x - tower.x);
      const angleDiff = Math.abs(angleToEnemy - tower.angle);
      
      // 45 degree cone
      if (angleDiff < Math.PI / 4) {
        GameAPI.damageEnemy(enemy, tower.damage * 0.02, tower);
        applyCondition(enemy, 'burn', 60);
        
        // Flame particles
        if (Math.random() < 0.3) {
          GameAPI.spawnParticle(
            enemy.x + (Math.random()-0.5)*20,
            enemy.y + (Math.random()-0.5)*20,
            ['#ff3300', '#ff6600', '#ffaa00'][Math.floor(Math.random()*3)],
            5, 20
          );
        }
      }
    });
  } else {
    tower.hasTarget = false;
  }
});

// Laser Beam - Continuous damage
GameAPI.registerBehavior('LASER_BEAM', function(tower) {
  const nearest = GameAPI.getNearestEnemy(tower.x, tower.y, tower.range);
  
  if (nearest) {
    tower.angle = Math.atan2(nearest.y - tower.y, nearest.x - tower.x);
    tower.beamTarget = nearest;
    tower.hasTarget = true;
    
    GameAPI.damageEnemy(nearest, tower.damage * 0.05, tower);
    
    // Beam particles
    const steps = 15;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      GameAPI.spawnParticle(
        tower.x + (nearest.x - tower.x) * t,
        tower.y + (nearest.y - tower.y) * t,
        tower.beamColor || '#ff00ff', 3, 8, 0, 0
      );
    }
  } else {
    tower.beamTarget = null;
    tower.hasTarget = false;
  }
});

// Multi-Target - Shoots multiple enemies
GameAPI.registerBehavior('MULTI_TARGET', function(tower) {
  tower.cooldownTimer = (tower.cooldownTimer || 0) - 1;
  
  if (tower.cooldownTimer <= 0) {
    const enemies = GameAPI.getEnemiesInRange(tower.x, tower.y, tower.range);
    const maxTargets = tower.maxTargets || 3;
    
    if (enemies.length > 0) {
      tower.cooldownTimer = tower.cooldown;
      const targets = enemies.slice(0, maxTargets);
      
      targets.forEach(target => {
        fireProjectile(tower, target);
      });
    }
  }
});

// Slow Aura - Support tower
GameAPI.registerBehavior('SLOW_AURA', function(tower) {
  const enemies = GameAPI.getEnemiesInRange(tower.x, tower.y, tower.range);
  
  enemies.forEach(enemy => {
    enemy.speedMultiplier = 0.5;
    
    if (Math.random() < 0.1) {
      GameAPI.spawnParticle(
        enemy.x + (Math.random()-0.5)*20,
        enemy.y - 10,
        '#9966ff', 3, 20, 0, -0.5
      );
    }
  });
  
  // Aura visual
  if (Math.random() < 0.05) {
    const angle = Math.random() * Math.PI * 2;
    GameAPI.spawnParticle(
      tower.x + Math.cos(angle) * tower.range,
      tower.y + Math.sin(angle) * tower.range,
      '#9966ff', 4, 30, 0, 0
    );
  }
});

// Buff Tower - Increases nearby tower damage
GameAPI.registerBehavior('DAMAGE_BUFF_AURA', function(tower) {
  const buffRange = tower.buffRange || 100;
  
  Game.towers.forEach(otherTower => {
    if (otherTower !== tower) {
      const dist = Math.hypot(otherTower.x - tower.x, otherTower.y - tower.y);
      if (dist <= buffRange) {
        otherTower.damageMultiplier = (otherTower.damageMultiplier || 1) * 1.3;
      }
    }
  });
  
  // Buff particles
  if (Math.random() < 0.08) {
    GameAPI.spawnParticle(
      tower.x + (Math.random()-0.5)*60,
      tower.y + (Math.random()-0.5)*60,
      '#ffd700', 4, 25, 0, -0.8
    );
  }
});

// Income Generator
GameAPI.registerBehavior('INCOME_GENERATOR', function(tower) {
  tower.generateTimer = (tower.generateTimer || 0) + 1;
  
  if (tower.generateTimer >= (tower.generateInterval || 180)) {
    tower.generateTimer = 0;
    const goldAmount = tower.goldPerInterval || 10;
    Game.addGold(goldAmount);
    
    // Gold particles
    for (let i = 0; i < 8; i++) {
      GameAPI.spawnParticle(
        tower.x, tower.y,
        '#ffd700', 5, 40,
        (Math.random()-0.5)*3,
        -Math.random()*3
      );
    }
  }
});

// ============================================
// 👾 ENEMY MOVEMENT BEHAVIORS
// ============================================

// Standard path following (already exists)
GameAPI.registerBehavior('FOLLOW_PATH', function(enemy) {
  if (enemy.pathIndex >= Game.path.length) {
    enemy.dead = true;
    Game.removeLife();
    return;
  }
  
  const target = Game.path[enemy.pathIndex];
  const dx = target.x - enemy.x;
  const dy = target.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  
  if (dist < 5) {
    enemy.pathIndex++;
  } else {
    const speed = enemy.speed * (enemy.speedMultiplier || 1);
    enemy.x += (dx / dist) * speed;
    enemy.y += (dy / dist) * speed;
  }
  
  enemy.speedMultiplier = 1;
  
  if (enemy.conditions) {
    enemy.conditions.forEach(cond => {
      const condFn = conditionRegistry[cond.type];
      if (condFn) condFn(enemy);
      cond.duration--;
    });
    enemy.conditions = enemy.conditions.filter(c => c.duration > 0);
  }
});

// Zigzag Movement
GameAPI.registerBehavior('ZIGZAG_PATH', function(enemy) {
  if (enemy.pathIndex >= Game.path.length) {
    enemy.dead = true;
    Game.removeLife();
    return;
  }
  
  const target = Game.path[enemy.pathIndex];
  const dx = target.x - enemy.x;
  const dy = target.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  
  if (dist < 5) {
    enemy.pathIndex++;
  } else {
    const speed = enemy.speed * (enemy.speedMultiplier || 1);
    const zigzag = Math.sin(Date.now() / 200) * 15;
    
    enemy.x += (dx / dist) * speed + (-dy / dist) * zigzag * 0.1;
    enemy.y += (dy / dist) * speed + (dx / dist) * zigzag * 0.1;
  }
  
  enemy.speedMultiplier = 1;
  
  if (enemy.conditions) {
    enemy.conditions.forEach(cond => {
      const condFn = conditionRegistry[cond.type];
      if (condFn) condFn(enemy);
      cond.duration--;
    });
    enemy.conditions = enemy.conditions.filter(c => c.duration > 0);
  }
});

// Teleporting Enemy
GameAPI.registerBehavior('TELEPORT_DASH', function(enemy) {
  enemy.teleportTimer = (enemy.teleportTimer || 0) + 1;
  
  if (enemy.teleportTimer >= 120) {
    enemy.teleportTimer = 0;
    
    // Teleport forward
    if (enemy.pathIndex < Game.path.length - 1) {
      enemy.pathIndex = Math.min(enemy.pathIndex + 2, Game.path.length - 1);
      const newPos = Game.path[enemy.pathIndex];
      
      // Teleport effect
      for (let i = 0; i < 20; i++) {
        GameAPI.spawnParticle(enemy.x, enemy.y, '#9900ff', 4, 30);
        GameAPI.spawnParticle(newPos.x, newPos.y, '#9900ff', 4, 30);
      }
      
      enemy.x = newPos.x;
      enemy.y = newPos.y;
    }
  }
  
  behaviorRegistry['FOLLOW_PATH'](enemy);
});

// Flying Enemy (moves straight to goal)
GameAPI.registerBehavior('FLY_TO_GOAL', function(enemy) {
  const goal = Game.path[Game.path.length - 1];
  const dx = goal.x - enemy.x;
  const dy = goal.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  
  if (dist < 10) {
    enemy.dead = true;
    Game.removeLife();
    return;
  }
  
  const speed = enemy.speed * (enemy.speedMultiplier || 1);
  enemy.x += (dx / dist) * speed;
  enemy.y += (dy / dist) * speed;
  
  // Flying particles
  if (Math.random() < 0.2) {
    GameAPI.spawnParticle(enemy.x, enemy.y, '#cccccc', 3, 15, 0, 1);
  }
  
  enemy.speedMultiplier = 1;
  
  if (enemy.conditions) {
    enemy.conditions.forEach(cond => {
      const condFn = conditionRegistry[cond.type];
      if (condFn) condFn(enemy);
      cond.duration--;
    });
    enemy.conditions = enemy.conditions.filter(c => c.duration > 0);
  }
});

// Regenerating Enemy
GameAPI.registerBehavior('REGENERATING_WALK', function(enemy) {
  enemy.regenTimer = (enemy.regenTimer || 0) + 1;
  
  if (enemy.regenTimer >= 30 && enemy.hp < enemy.maxHp) {
    enemy.hp = Math.min(enemy.hp + enemy.maxHp * 0.01, enemy.maxHp);
    enemy.regenTimer = 0;
    
    GameAPI.spawnParticle(enemy.x, enemy.y - 15, '#00ff00', 4, 20, 0, -1);
  }
  
  behaviorRegistry['FOLLOW_PATH'](enemy);
});

// Split on Death (handled via event, but movement is normal)
GameAPI.registerBehavior('SPLITTER_WALK', function(enemy) {
  behaviorRegistry['FOLLOW_PATH'](enemy);
  
  // Visual indicator
  if (Math.random() < 0.05) {
    GameAPI.spawnParticle(
      enemy.x + (Math.random()-0.5)*20,
      enemy.y + (Math.random()-0.5)*20,
      '#ff00ff', 3, 15
    );
  }
});

// ============================================
// 💥 PROJECTILE BEHAVIORS
// ============================================

// Standard projectile (already exists)
GameAPI.registerBehavior('FIRE_PROJECTILE', function(proj) {
  proj.lifetime--;
  
  if (proj.homing && proj.target && !proj.target.dead) {
    const dx = proj.target.x - proj.x;
    const dy = proj.target.y - proj.y;
    proj.angle = Math.atan2(dy, dx);
  }
  
  proj.x += Math.cos(proj.angle) * proj.speed;
  proj.y += Math.sin(proj.angle) * proj.speed;
  
  if (proj.target && !proj.target.dead) {
    const dist = Math.hypot(proj.target.x - proj.x, proj.target.y - proj.y);
    if (dist < 10) {
      const actualDamage = proj.damage * (proj.source.damageMultiplier || 1);
      GameAPI.damageEnemy(proj.target, actualDamage, proj.source);
      
      if (proj.onHit) proj.onHit(proj.target, proj);
      
      proj.dead = true;
    }
  }
  
  if (proj.lifetime <= 0 || proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
    proj.dead = true;
  }
  
  // Reset damage multiplier
  if (proj.source) proj.source.damageMultiplier = 1;
});

// Mortar Projectile
GameAPI.registerBehavior('MORTAR_PROJECTILE', function(proj) {
  proj.progress += proj.speed;
  
  const t = proj.progress;
  const arc = Math.sin(t * Math.PI) * 100;
  
  proj.x = proj.x + (proj.targetX - proj.x) * proj.speed;
  proj.y = proj.y + (proj.targetY - proj.y) * proj.speed - arc;
  
  // Smoke trail
  if (Math.random() < 0.3) {
    GameAPI.spawnParticle(proj.x, proj.y, '#666666', 4, 20, 0, 0.5);
  }
  
  if (proj.progress >= 1) {
    // Explode
    const enemies = GameAPI.getEnemiesInRange(proj.targetX, proj.targetY, proj.splashRange);
    enemies.forEach(enemy => {
      GameAPI.damageEnemy(enemy, proj.damage, proj.source);
    });
    
    // Explosion effect
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      GameAPI.spawnParticle(
        proj.targetX, proj.targetY,
        ['#ff6600', '#ff9900', '#ffcc00'][Math.floor(Math.random()*3)],
        6, 35,
        Math.cos(angle) * 5,
        Math.sin(angle) * 5
      );
    }
    
    proj.dead = true;
  }
});

// Bouncing Projectile
GameAPI.registerBehavior('BOUNCING_SHOT', function(proj) {
  proj.lifetime--;
  proj.bounces = proj.bounces || 0;
  proj.maxBounces = proj.maxBounces || 3;
  
  proj.x += Math.cos(proj.angle) * proj.speed;
  proj.y += Math.sin(proj.angle) * proj.speed;
  
  // Check collision with current target
  if (proj.target && !proj.target.dead) {
    const dist = Math.hypot(proj.target.x - proj.x, proj.target.y - proj.y);
    if (dist < 10) {
      GameAPI.damageEnemy(proj.target, proj.damage, proj.source);
      
      proj.bounces++;
      
      if (proj.bounces < proj.maxBounces) {
        // Find new target
        const newTarget = GameAPI.getNearestEnemy(proj.x, proj.y, 150);
        if (newTarget && newTarget !== proj.target) {
          proj.target = newTarget;
          proj.angle = Math.atan2(newTarget.y - proj.y, newTarget.x - proj.x);
          
          // Bounce effect
          for (let i = 0; i < 8; i++) {
            GameAPI.spawnParticle(proj.x, proj.y, '#ffff00', 4, 15);
          }
          return;
        }
      }
      
      proj.dead = true;
    }
  }
  
  if (proj.lifetime <= 0 || proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
    proj.dead = true;
  }
});

// Piercing Shot - Goes through enemies
GameAPI.registerBehavior('PIERCING_SHOT', function(proj) {
  proj.lifetime--;
  proj.hitEnemies = proj.hitEnemies || [];
  
  proj.x += Math.cos(proj.angle) * proj.speed;
  proj.y += Math.sin(proj.angle) * proj.speed;
  
  // Check all enemies
  Game.enemies.forEach(enemy => {
    if (!proj.hitEnemies.includes(enemy.id)) {
      const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
      if (dist < 10) {
        GameAPI.damageEnemy(enemy, proj.damage, proj.source);
        proj.hitEnemies.push(enemy.id);
        
        // Pierce effect
        for (let i = 0; i < 5; i++) {
          GameAPI.spawnParticle(enemy.x, enemy.y, '#00ffff', 3, 12);
        }
      }
    }
  });
  
  if (proj.lifetime <= 0 || proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
    proj.dead = true;
  }
});

console.log('✅ Behaviors Library Loaded! ' + Object.keys(behaviorRegistry).length + ' behaviors available');