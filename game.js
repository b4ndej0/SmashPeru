// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const winnerText = document.getElementById('winnerText');

// Player class
class Player {
    constructor(x, y, color, controls, name) {
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
        this.falls = 0; // Track falls for win condition
        this.maxFalls = 3; // Game ends after 3 falls
        this.controls = controls;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackDuration = 10; // Frames for attack animation
        this.name = name; // For game over screen
    }
}

// Platforms
const platforms = [
    { x: 0, y: 500, width: 300, height: 20 },
    { x: 500, y: 500, width: 300, height: 20 },
    { x: 300, y: 400, width: 200, height: 20 },
];

// Players
const player1 = new Player(100, 400, 'red', {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: ' ',
    attack: 'Enter'
}, 'Player 1');
const player2 = new Player(600, 400, 'blue', {
    left: 'a',
    right: 'd',
    jump: 'w',
    attack: 's'
}, 'Player 2');
const players = [player1, player2];

// Game constants
const gravity = 0.5;
const jumpStrength = -12;
const knockbackStrength = 8;
const attackRange = 60;
const attackDamage = 20;
const keys = {};

// Sound effects (simple sine waves via Web Audio API)
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

// Game loop
function update() {
    // Update players
    players.forEach(player => {
        player.velocityY += gravity;
        player.y += player.velocityY;
        player.x += player.velocityX;
        player.velocityX *= 0.9;

        // Movement
        if (keys[player.controls.left] && player.x > 0) player.x -= player.speed;
        if (keys[player.controls.right] && player.x < canvas.width - player.width) player.x += player.speed;

        // Jump
        if (keys[player.controls.jump] && !player.jumping) {
            player.velocityY = jumpStrength;
            player.jumping = true;
            playSound(400, 0.1); // Jump sound
        }

        // Attack
        if (keys[player.controls.attack] && player.attackCooldown <= 0) {
            player.isAttacking = true;
            player.attackCooldown = 30;
            player.attackDuration = 10;
            playSound(600, 0.1); // Attack sound
        }
        if (player.attackCooldown > 0) player.attackCooldown--;
        if (player.attackDuration > 0) player.attackDuration--;

        // Platform collision
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

        // Fall off screen
        if (player.y > canvas.height) {
            player.falls++;
            if (player.falls >= player.maxFalls) {
                endGame(player === player1 ? player2 : player1); // Other player wins
                return;
            }
            resetPlayer(player);
            playSound(200, 0.3); // Fall sound
        }
    });

    // Handle attacks and knockback
    players.forEach(attacker => {
        if (attacker.isAttacking && attacker.attackDuration > 0) {
            players.forEach(defender => {
                if (attacker !== defender) {
                    const distance = Math.abs(attacker.x - defender.x);
                    if (distance < attackRange && Math.abs(attacker.y - defender.y) < attacker.height) {
                        defender.health -= attackDamage;
                        defender.velocityX = (defender.x > attacker.x ? knockbackStrength : -knockbackStrength);
                        defender.velocityY = -5;
                        playSound(300, 0.1); // Hit sound
                    }
                }
            });
        }
    });

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = 'gray';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw players (sprites as labeled rectangles)
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(player.name, player.x + 5, player.y + 25);

        // Health bar
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y - 10, (player.health / 100) * player.width, 5);

        // Attack animation (yellow rectangle)
        if (player.attackDuration > 0) {
            ctx.fillStyle = 'yellow';
            const attackX = player.x + (player.velocityX >= 0 ? player.width : -attackRange);
            ctx.fillRect(attackX, player.y, attackRange, player.height);
        }

        // Fall counter
        ctx.fillStyle = 'black';
        ctx.fillText(`Falls: ${player.falls}/${player.maxFalls}`, player.x, player.y - 20);
    });

    requestAnimationFrame(update);
}

// Reset player
function resetPlayer(player) {
    player.x = player === player1 ? 100 : 600;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.health = 100;
}

// End game
function endGame(winner) {
    gameOverScreen.style.display = 'block';
    winnerText.textContent = `${winner.name} Wins!`;
    players.forEach(player => {
        player.x = -1000; // Move off-screen to stop updates
    });
}

// Reset game
function resetGame() {
    gameOverScreen.style.display = 'none';
    player1.x = 100; player1.y = 400; player1.falls = 0; player1.health = 100;
    player2.x = 600; player2.y = 400; player2.falls = 0; player2.health = 100;
}

// Start game
update();
