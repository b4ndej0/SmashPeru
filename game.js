// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player class for reusability
class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.velocityX = 0; // For knockback
        this.velocityY = 0;
        this.jumping = false;
        this.color = color;
        this.health = 100; // Health starts at 100
        this.controls = controls; // {left, right, jump, attack}
        this.attackCooldown = 0; // Cooldown for attacks
        this.isAttacking = false;
    }
}

// Platforms (x, y, width, height)
const platforms = [
    { x: 0, y: 500, width: 300, height: 20 },   // Left platform
    { x: 500, y: 500, width: 300, height: 20 }, // Right platform
    { x: 300, y: 400, width: 200, height: 20 }, // Middle floating platform
];

// Two players with different controls
const player1 = new Player(100, 400, 'red', {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: ' ',
    attack: 'Enter'
});
const player2 = new Player(600, 400, 'blue', {
    left: 'a',
    right: 'd',
    jump: 'w',
    attack: 's'
});

const players = [player1, player2];

// Game constants
const gravity = 0.5;
const jumpStrength = -12;
const knockbackStrength = 8;
const attackRange = 60; // Distance for attack to hit
const attackDamage = 20;
const keys = {};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function update() {
    // Update each player
    players.forEach(player => {
        // Apply gravity and knockback
        player.velocityY += gravity;
        player.y += player.velocityY;
        player.x += player.velocityX;
        player.velocityX *= 0.9; // Friction to slow knockback

        // Movement
        if (keys[player.controls.left] && player.x > 0) player.x -= player.speed;
        if (keys[player.controls.right] && player.x < canvas.width - player.width) player.x += player.speed;

        // Jump
        if (keys[player.controls.jump] && !player.jumping) {
            player.velocityY = jumpStrength;
            player.jumping = true;
        }

        // Attack
        if (keys[player.controls.attack] && player.attackCooldown <= 0) {
            player.isAttacking = true;
            player.attackCooldown = 30; // Cooldown in frames (~0.5s at 60fps)
        }
        if (player.attackCooldown > 0) player.attackCooldown--;

        // Collision with platforms
        platforms.forEach(platform => {
            if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height < platform.y + platform.height &&
                player.y + player.height + player.velocityY >= platform.y
            ) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.jumping = false;
            }
        });

        // Keep player above canvas bottom (fall off = lose)
        if (player.y > canvas.height) {
            resetPlayer(player);
        }
    });

    // Handle attacks and knockback
    players.forEach(attacker => {
        if (attacker.isAttacking) {
            players.forEach(defender => {
                if (attacker !== defender) {
                    const distance = Math.abs(attacker.x - defender.x);
                    if (distance < attackRange && Math.abs(attacker.y - defender.y) < attacker.height) {
                        defender.health -= attackDamage;
                        defender.velocityX = (defender.x > attacker.x ? knockbackStrength : -knockbackStrength);
                        defender.velocityY = -5; // Slight upward knockback
                    }
                }
            });
            attacker.isAttacking = false; // Attack lasts one frame
        }
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = 'gray';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw players and health
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Health bar
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y - 10, (player.health / 100) * player.width, 5);
    });

    // Request next frame
    requestAnimationFrame(update);
}

// Reset player when they fall off
function resetPlayer(player) {
    player.x = player === player1 ? 100 : 600; // Respawn at starting position
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.health = 100; // Reset health
}

// Start the game
update();
