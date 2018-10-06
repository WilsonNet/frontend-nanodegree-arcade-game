
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
        this.colliderX = 100;
        this.colliderY = 69;
        
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += 10 * dt;
        if (this.x > 530) {
            this.x = 0;
        }
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.strokeRect(this.x, this.colliderPosY, this.colliderX, this.colliderY);
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(enemies) {
        this.x = 300;
        this.y = 300;
        this.sprite = 'images/char-boy.png';
        /** @type {Enemy[]} */
        this.enemies = enemies;
    }
    handleInput(key) {
        const movementX = 101,
            movementY = 86;

        switch (key) {
            case 'left':
                this.x -= movementX;
                break;
            case 'right':
                this.x += movementX;
                break;
            case 'up':
                this.y -= movementY;
                break;
            case 'down':
                this.y += movementY;
                break;
            default:

                break;
        }
        this.update();
    }
    update() {
        /*this.enemies.forEach(enemy => {
            this.checkDeath(enemy.x, enemy.y);
        });*/
    };
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    /*checkDeath(enemyX, enemyY) {
        const yCheck = this.y > enemyY - 50 && this.y < enemyY + 50;
        const xCheck = this.x > enemyX - 50 && this.x < enemyX + 50;
        if (xCheck && yCheck) {
            this.x = 300;
            this.y = 300;
        }
    }*/

}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(0), new Enemy(1), new Enemy(2)];
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
