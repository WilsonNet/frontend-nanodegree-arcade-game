// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor(height) {
        this.tileY = 83; //For the tile system.
        this.x = 0;
        this.y = height * this.tileY + 58;
        this.sprite = 'images/enemy-bug.png';
        this.colliderPosY = this.y + 76; //Compensating for the transparent pixels
        this.colliderPosX = this.x;
        this.colliderX = 100;
        this.colliderY = 69;
        this.movementX = this.getSpeed();
    }
    getSpeed() {
        return (Math.random() * 150 + 120);
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.movementX * dt;;
        if (this.x > canvas.width) {
            this.x = 0;
            this.movementX = this.getSpeed();
            this.y = Math.floor((Math.random() * 3)) * this.tileY + 58;
            this.colliderPosY = this.y + 76; //Compensating for the transparent pixels 
        }
        this.colliderPosX = this.x;


    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //Hitbox visualization
        ctx.strokeRect(this.colliderPosX, this.colliderPosY, this.colliderX, this.colliderY);
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(enemies) {
        this.dead = false;
        this.x = 200;
        this.y = 383;
        this.sprite = 'images/char-boy.png';
        this.colliderPosY = this.y + 120; //Compensating for the transparent pixels
        this.colliderPosX = this.x + 25; //Compensating for the transparent pixels
        this.colliderX = 55;
        this.colliderY = 30;
        /** @type {Enemy[]} */
        this.enemies = enemies;
    }
    handleInput(key) {
        const movementX = 101, //Tile width
            movementY = 83; // Tile height
        let destination;
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
            default:

                break;
        }
        this.update();
    }
    update() {
        this.enemies.forEach(enemy => {
            this.checkDeath(enemy);
        });
        if (this.dead) {
            this.x = 200;
            this.y = 383;
            this.colliderPosY = this.y + 120; //Compensating for the transparent pixels
            this.colliderPosX = this.x + 25; //Compensating for the transparent pixels
            this.dead = false;
        }
    };
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.strokeRect(this.colliderPosX, this.colliderPosY, this.colliderX, this.colliderY);
    }
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


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(0), new Enemy(1), new Enemy(2), new Enemy(0), new Enemy(1), new Enemy(2)];
// Place the player object in a variable called player
let player = new Player(allEnemies);


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