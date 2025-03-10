// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
    x: 100,         // Starting x position
    y: 400,        // Starting y position
    width: 40,
    height: 40,
    speed: 5,
    velocityY: 0,  // Vertical velocity for jumping/falling
    jumping: false,
};

// Platform array (x, y, width, height)
const platforms = [
    { x: 0, y: 500, width: 300, height: 20 },   // Base platform
    { x: 400, y: 400, width: 200, height: 20 }, // Floating platform
];

// Game constants
const gravity = 0.5;
const jumpStrength = -10;
const keys = { left: false, right: false, jump: false };

// Event listeners for controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': keys.left = true; break;
        case 'ArrowRight': keys.right = true; break;
        case ' ': keys.jump = true; break; // Spacebar to jump
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft': keys.left = false; break;
        case 'ArrowRight': keys.right = false; break;
        case ' ': keys.jump = false; break;
    }
});

// Game loop
function update() {
    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Move left/right
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;

    // Jump
    if (keys.jump && !player.jumping) {
        player.velocityY = jumpStrength;
        player.jumping = true;
    }

    // Collision detection with platforms
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

    // Keep player above ground (canvas bottom)
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = 'gray';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Request next frame
    requestAnimationFrame(update);
}

// Start the game
update();
