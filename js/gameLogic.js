/**
 * Created by loganhendricks on 6/14/16.
 */

var currentState,
    states =
    {
        Hovering: 0,
        Game: 1,
        Score: 2
    },
    canvas,
    width,
    frames = 0,
    height,
    aang,
    fireballs;

function Aang() {
    this.x = 100;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.jump = function () {
        this.velocity = -this._jump;
    };


    this.update = function () {
        var n = currentState === states.Hovering ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Hovering) {
            this.updateIdleAang();
        }
        else {
            this.updatePlayingAang();
        }
    };

    this.updateIdleAang = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.updatePlayingAang = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when fish touches the ground
        if (this.y >= height - aangSprite.height - 10) {
            this.y = height - aangSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.Score;
        }

    };

    this.draw = function (renderingContext) {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        aangSprite[n].draw(renderingContext, -aangSprite[n].width / 2, -aangSprite[n].height / 2);

        renderingContext.restore();
    }

}
function FireCollection() {

    this._fireballs = [];

    this.reset = function () {
        this._fireballs = [];
    };

    this.add = function () {
        this._fireballs.push(new Fireball());
    };

    this.update = function () {
        if (frames % 100 === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }
    };
    for (var i = 0, len = this._fireballs.length; i < len; i++) { // Iterate through the array of corals and update each.
        var fireball = this._fireballs[i]; // The current coral.

        if (i === 0) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
            fireball.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
        }

        fireball.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
        if (fireball.x < -coral.width) { // If the coral has moved off screen . . .
            this._fireballs.splice(i, 1); // . . . remove it.
            i--;
            len--;
        }
    }
    
    this.draw = function () {
        for (var i = 0, len = this._fireballs.length; i < len; i++) {
            var fireball = this._fireballs[i];
            fireball.draw();
        }
    };
}



function main() {
    windowSetup();
    canvasSetup();

    currentState = states.Hovering;

    document.body.appendChild(canvas);

    aang = new Aang();
    fireballs = new FireCollection();

    loadGraphics();
}

function windowSetup() {
    //retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    //set the width and height if we are on a display with a width of > 500px or greater

    if (width >= 500) {
        width = 300;
        height = 430;
        inputEvent = "mousedown";
    }


    // create a listener on the input event
    document.addEventListener(inputEvent, onpress);
}

function onpress(evt) {
    switch (currentState) {

        case states.Hovering:
            currentState = states.Game;
            aang.jump();
            break;

        case states.Game:
            aang.jump();
            break;

        case states.Score:
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

        /*  // Check if within the okButton
         if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
         okButton.y < mouseY && mouseY < okButton.y + okButton.height
         ) {
         //console.log('click');
         corals.reset();
         currentState = states.Splash;
         score = 0;
         }
         break;
         */
    }
}

function canvasSetup() {
    canvas = document.createElement('canvas');
    canvas.style.border = "15px solid #382b1d";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext('2d');

}

function loadGraphics() {
    var img = new Image();
    img.src = '../images/aangSheet.png';
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;
        renderingContext.fillRect(0, 0, width, height);


        /*      okButton = {
         x: (width - okButtonSprite.width) /2,
         y: height - 200,
         width: okButtonSprite.width,
         height: okButtonSprite.height
         };
         */
        gameLoop();

    };
}

function Fireball() {
    this.x = 200;
    this.y = height - (fireballSprite.height + aangSprite.height + 120 + 200 * Math.random());
    this.width = fireballSprite.width;
    this.height = fireballSprite.height;

    /**
     * Determines if the fish has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(aang.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(aang.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(aang.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
        // Closest difference
        var dx = aang.x - cx;
        var dy1 = aang.y - cy1;
        var dy2 = aang.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = aang.radius * aang.radius;
        // Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        fireballSprite.draw(renderingContext, this.x, this.y);
    }
}
function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    /* if(currentState !== states.Score) {
     foregroundPosition = (foregroundPosition - 2) % 14;
     } */
    if (currentState === states.Game) {
       fireballs.update();
    }


    aang.update()
}

function render() {
    renderingContext.fillRect(0, 0, width, height);
    fireballs.draw(renderingContext);

    aang.draw(renderingContext);

}