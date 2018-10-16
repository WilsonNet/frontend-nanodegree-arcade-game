// Enemies our player must avoid
class Enemy {
    /**
     * Create an enemy.
     * @param {number} height - The lane that an enemy will appear (0 - Top, 1 - Mid, 2 - Bottom)
     */
    constructor(height) {
        this.tileY = 83; //For the tile system.
        this.x = 0;
        this.y = height * this.tileY + 58;
        this.sprite = 'images/enemy-bug.png';
        //Enemy collider
        this.colliderPosY = this.y + 76; //Compensating for transparent pixels
        this.colliderPosX = this.x;
        this.colliderX = 100; 
        this.colliderY = 69;
        this.movementX = this.getSpeed();
    }
    getSpeed() {
        return (Math.random() * 300 + 50); //Defines maximum and minimum speed.
    }
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiplying by dt for a smoother result.
        this.x += this.movementX * dt;;
        if (this.x > canvas.width) {
            this.x = 0;
            this.movementX = this.getSpeed();
            this.y = Math.floor((Math.random() * 3)) * this.tileY + 58;
            this.colliderPosY = this.y + 76; //Compensating for transparent pixels
        }
        this.colliderPosX = this.x;
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //Hitbox visualization
        //ctx.strokeRect(this.colliderPosX, this.colliderPosY, this.colliderX, this.colliderY);
    }
};
//Player class
class Player {
    /**
     * 
     * @param {Enemy[]} enemies - An array with the enemies that Player needs to avoid.
     */
    constructor(enemies) {
        this.dead = false;
        this.x = 200;
        this.y = 383;
        this.sprite = 'images/char-boy.png';
        //Player collider
        this.colliderPosY = this.y + 120; //Compensating for transparent pixels
        this.colliderPosX = this.x + 25; //Compensating for transparent pixels
        this.colliderX = 55;
        this.colliderY = 30;
        /** @type {Enemy[]} */
        this.enemies = enemies;
    }
    handleInput(key) {
        const movementX = 101, //Tile width
            movementY = 83; // Tile height
        let destination; //Variable to check if player destination is out of screen.
        switch (key) {
            case 'left':
                destination = this.colliderPosX - movementX;
                if (destination > 0) {
                    this.x -= movementX;
                    this.colliderPosX -= movementX;
                }
                break;
            case 'right':
                destination = this.colliderPosX + movementX;
                if (destination < canvas.width) {
                    this.x += movementX;
                    this.colliderPosX += movementX;
                }
                break;
            case 'up':
                destination = this.colliderPosY - movementY - 50;
                if (destination > 0) {
                    this.y -= movementY;
                    this.colliderPosY -= movementY;
                }
                break;
            case 'down':
                destination = this.colliderPosY + movementY + 50;
                if (destination < canvas.height) {
                    this.y += movementY;
                    this.colliderPosY += movementY;
                }
                break;
        }
        this.update();
    }
    update() {
        this.enemies.forEach(enemy => {
            this.checkDeath(enemy);
        });
        //If player died, reset game.
        if (this.dead) {
            this.x = 200;
            this.y = 383;
            this.colliderPosY = this.y + 120; //Compensating for transparent pixels
            this.colliderPosX = this.x + 25; //Compensating for transparent pixels
            this.dead = false;
            score = 0;
        }
        //Check if player won.
        if (this.y < 50) {
            this.x = 200;
            this.y = 383;
            this.colliderPosY = this.y + 120; //Compensating for transparent pixels
            this.colliderPosX = this.x + 25; //Compensating for transparent pixels
            score += 1;
        }
    };
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //Hitbox visualization
        // ctx.strokeRect(this.colliderPosX, this.colliderPosY, this.colliderX, this.colliderY);

        //Scoreboard
        ctx.fillText(`Score = ${score}`, 10, 40);
    }
    //Check if Player is dead (touched an enemy).
    checkDeath(enemy) {
        const yBottomCheck = this.colliderPosY + this.colliderY > enemy.colliderPosY && this.colliderPosY + this.colliderY < enemy.colliderPosY + enemy.colliderY;
        const yTopCheck = this.colliderPosY > enemy.colliderPosY && this.colliderPosY < enemy.colliderPosY + enemy.colliderY;
        const xRightCheck = this.colliderPosX + this.colliderX > enemy.colliderPosX && this.colliderPosX + this.colliderX < enemy.colliderPosX + enemy.colliderX;
        const xLeftCheck = this.colliderPosX > enemy.colliderPosX && this.colliderPosX < enemy.colliderPosX + enemy.colliderX;
        if ((yBottomCheck || yTopCheck) && (xRightCheck || xLeftCheck)) {
            this.dead = true;
        }
    }

}

// Enemy objects inside allEnemies will be instanced.
let allEnemies = [new Enemy(0), new Enemy(1), new Enemy(2), new Enemy(0), new Enemy(1)];
// Place the player object in a variable called player
let player = new Player(allEnemies);
//Score
let score = 0;

//Prevent arrow scrolling
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});