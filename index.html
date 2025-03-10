// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const winnerText = document.getElementById('winnerText');

// Player/AI class
class Fighter {
    constructor(x, y, color, controls, name, isAI = false) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumping = false;
        this.color = color;
        this.health = 100;
        this.falls = 0;
        this.maxFalls = 3;
        this.controls = controls;
        this.name = name;
        this.isAI = isAI;
        this.punchCooldown = 0;
        this.shootCooldown = 0;
        this.punchDuration = 0;
        this.direction = 1; // 1 = right, -1 = left
    }
}

// Projectile class for shoot attack
class Projectile {
    constructor(x, y, direction, owner) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = 8 * direction;
        this.owner = owner; // Who shot it
    }
}

// Platforms
const platforms = [
    { x: 0, y: 500, width: 300, height: 20 },
    { x: 500, y: 500, width: 300, height: 20 },
    { x: 300, y: 400, width: 200, height: 20 },
];

// Fighters
const player = new Fighter(100, 400, 'red', {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: ' ',
    punch: 'p',
    shoot: 'o'
}, 'Player');
const ai = new Fighter(600, 400, 'blue', {}, 'AI', true);
const fighters = [player, ai];
const projectiles = [];

// Constants
const gravity = 0.5;
const jumpStrength = -12;
const knockbackStrength = 8;
const punchRange = 60;
const punchDamage = 20;
const shootDamage = 15;
const keys = {};

// Sound effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(frequency, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Event listeners
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// AI logic
function updateAI(ai, player) {
    const dx = player.x - ai.x;
    ai.direction = dx > 0 ? 1 : -1;

    // Move toward player if far, randomly jump
    if (Math.abs(dx) > 100) {
        ai.x += ai.direction * ai.speed;
    } else if (Math.random() < 0.01 && !ai.jumping) {
        ai.velocityY = jumpStrength;
        ai.jumping = true;
        playSound(400, 0.1);
    }

    // Randomly punch or shoot
    if (Math.abs(dx) < punchRange && Math.random() < 0.02 && ai.punchCooldown <= 0) {
        ai.punchCooldown = 20;
        ai.punchDuration = 10;
        playSound(600, 0.1);
    } else if (Math.random() < 0.01 && ai.shootCooldown <= 0) {
        ai.shootCooldown = 40;
        projectiles.push(new Projectile(ai.x + (ai.direction > 0 ? ai.width : -10), ai.y + ai.height / 2, ai.direction, ai));
        playSound(700, 0.1);
    }
}

// Game loop
function update() {
    // Update fighters
    fighters.forEach(fighter => {
        fighter.velocityY += gravity;
        fighter.y += fighter.velocityY;
        fighter.x += fighter.velocityX;
        fighter.velocityX *= 0.9;

        if (!fighter.isAI) {
            // Player controls
            if (keys[fighter.controls.left] && fighter.x > 0) {
                fighter.x -= fighter.speed;
                fighter.direction = -1;
            }
            if (keys[fighter.controls.right] && fighter.x < canvas.width - fighter.width) {
                fighter.x += fighter.speed;
                fighter.direction = 1;
            }
            if (keys[fighter.controls.jump] && !fighter.jumping) {
                fighter.velocityY = jumpStrength;
                fighter.jumping = true;
                playSound(400, 0.1);
            }
            if (keys[fighter.controls.punch] && fighter.punchCooldown <= 0) {
                fighter.punchCooldown = 20;
                fighter.punchDuration = 10;
                playSound(600, 0.1);
            }
            if (keys[fighter.controls.shoot] && fighter.shootCooldown <= 0) {
                fighter.shootCooldown = 40;
                projectiles.push(new Projectile(fighter.x + (fighter.direction > 0 ? fighter.width : -10), fighter.y + fighter.height / 2, fighter.direction, fighter));
                playSound(700, 0.1);
            }
        } else {
            updateAI(fighter, player); // AI behavior
        }

        // Cooldowns
        if (fighter.punchCooldown > 0) fighter.punchCooldown--;
        if (fighter.shootCooldown > 0) fighter.shootCooldown--;
        if (fighter.punchDuration > 0) fighter.punchDuration--;

        // Platform collision
        platforms.forEach(platform => {
            if (
                fighter.x < platform.x + platform.width &&
                fighter.x + fighter.width > platform.x &&
                fighter.y + fighter.height < platform.y + platform.height &&
                fighter.y + fighter.height + fighter.velocityY >= platform.y
            ) {
                fighter.y = platform.y - fighter.height;
                fighter.velocityY = 0;
                fighter.jumping = false;
            }
        });

        // Fall off screen
        if (fighter.y > canvas.height) {
            fighter.falls++;
            if (fighter.falls >= fighter.maxFalls) {
                endGame(fighter === player ? ai : player);
                return;
            }
            resetFighter(fighter);
            playSound(200, 0.3);
        }
    });

    // Punch attack
    fighters.forEach(attacker => {
        if (attacker.punchDuration > 0) {
            fighters.forEach(defender => {
                if (attacker !== defender) {
                    const dx = defender.x - attacker.x;
                    if (Math.abs(dx) < punchRange && Math.abs(attacker.y - defender.y) < attacker.height && Math.sign(dx) === attacker.direction) {
                        defender.health -= punchDamage;
                        defender.velocityX = attacker.direction * knockbackStrength;
                        defender.velocityY = -5;
                        playSound(300, 0.1);
                    }
                }
            });
        }
    });

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.speed;

        // Check collision with fighters
        fighters.forEach(fighter => {
            if (fighter !== p.owner && 
                p.x < fighter.x + fighter.width &&
                p.x + p.width > fighter.x &&
                p.y < fighter.y + fighter.height &&
                p.y + p.height > fighter.y) {
                fighter.health -= shootDamage;
                fighter.velocityX = Math.sign(p.speed) * knockbackStrength / 2;
                fighter.velocityY = -3;
                projectiles.splice(i, 1);
                playSound(300, 0.1);
                return;
            }
        });

        // Remove if off-screen
        if (p.x < 0 || p.x > canvas.width) projectiles.splice(i, 1);
    }

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Platforms
    ctx.fillStyle = 'gray';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Fighters
    fighters.forEach(fighter => {
        ctx.fillStyle = fighter.color;
        ctx.fillRect(fighter.x, fighter.y, fighter.width, fighter.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(fighter.name, fighter.x + 5, fighter.y + 25);

        // Health bar
        ctx.fillStyle = 'green';
        ctx.fillRect(fighter.x, fighter.y - 10, (fighter.health / 100) * fighter.width, 5);

        // Punch animation
        if (fighter.punchDuration > 0) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(fighter.x + (fighter.direction > 0 ? fighter.width : -punchRange), fighter.y, punchRange, fighter.height);
        }

        // Fall counter
        ctx.fillStyle = 'black';
        ctx.fillText(`Falls: ${fighter.falls}/${fighter.maxFalls}`, fighter.x, fighter.y - 20);
    });

    // Projectiles
    ctx.fillStyle = 'orange';
    projectiles.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    requestAnimationFrame(update);
}

// Reset fighter
function resetFighter(fighter) {
    fighter.x = fighter === player ? 100 : 600;
    fighter.y = 400;
    fighter.velocityX = 0;
    fighter.velocityY = 0;
    fighter.health = 100;
}

// End game
function endGame(winner) {
    gameOverScreen.style.display = 'block';
    winnerText.textContent = `${winner.name} Wins!`;
    fighters.forEach(fighter => {
        fighter.x = -1000;
    });
}

// Reset game
function resetGame() {
    gameOverScreen.style.display = 'none';
    resetFighter(player);
    resetFighter(ai);
    player.falls = 0;
    ai.falls = 0;
    projectiles.length = 0;
}

// Start game
update();
