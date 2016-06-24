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
    clouds,
    fireballs,
    playerScore = 0,
    highScore = 0,
    savedHighScore,
    selection = document.getElementById('selectDiff').value;

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
        if (this.y >= height) {

            if (currentState === states.Game) {
                currentState = states.Score;
                updateScore();
            }

        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.Score;
            updateScore()
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
    selection = document.getElementById('selectDiff').value;
    this._fireballs = [];
    this.reset = function () {
        this._fireballs = [];
    };
    this.add = function () {
        this._fireballs.push(new Fireball());
    };
    this.update = function () {
        
        switch(selection) {
            case 'grandma':
                if (frames % 200 === 0) {
                    this.add();
                }
                break;
            case 'easy':
            if (frames % 100 === 0) {
                this.add();
            }
                break;
            case 'medium':
                if (frames % 50 === 0) {
                    this.add();
                }
                break;
            case 'hard':
                if (frames % 25 === 0) {
                    this.add();
                }
                break;
            case 'insane':
                if (frames % 10 === 0) {
                    this.add();
                }
                break;
        }
        for (var i = 0, len = this._fireballs.length; i < len; i++) {
            var fireball = this._fireballs[i];
            fireball.detectCollision();
            fireball.x -= 2;
            if (fireball.x < -fireball.width) {
                this._fireballs.splice(i, 1);
                i--;
                len--;
            }
            if (fireball.x === aang.x) {
                playerScore++;
                document.getElementById('currentScore').innerHTML = playerScore;

            }
        }
                
    };
    
    this.draw = function () {
        for (var i = 0, len = this._fireballs.length; i < len; i++) {
            var fireball = this._fireballs[i];
            fireball.draw();
        }
    };
}

function Cloud() {
    this.x = width;
    this.y =  (height)  * Math.random();
    this.width = cloudSprite.width;
    this.height = cloudSprite.height;
    

    this.draw = function () {
        cloudSprite.draw(renderingContext, this.x, this.y);
    }
}


function CloudCollection() {

    this._clouds = [];
    this.reset = function () {
        this._clouds = [];
    };
    this.add = function () {
        this._clouds.push(new Cloud());
    };
    this.update = function () {
        if (frames % 100 === 0) {
            this.add();
        }
        for (var i = 0, len = this._clouds.length; i < len; i++) {
            var cloud = this._clouds[i];
            cloud.x -= 1;
            if (cloud.x < -cloud.width) {
                this._clouds.splice(i, 1);
                i--;
                len--;
            }
        }
    };
    this.draw = function () {
        for (var i = 0, len = this._clouds.length; i < len; i++) {
            var cloud = this._clouds[i];
            cloud.draw();
        }
    };
}



function main() {
    windowSetup();
    canvasSetup();
    checkScore();


    currentState = states.Hovering;

    document.getElementById('theGame').appendChild(canvas);

    aang = new Aang();
    fireballs = new FireCollection();
    clouds = new CloudCollection();

    loadGraphics();
}

function windowSetup() {
    //retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;
    console.log(width);

    //set the width and height if we are on a display with a width of > 500px or greater

    if (width >= 1000) {
        width = 800;
        height = 800;
        inputEvent = 'mousedown';
    }

    else if (width >= 700) {
        width = 650;
        height = 650;
        inputEvent = 'mousedown';
    }

    else if (width <= 500) {
        width = 430;
        height = 430;
        inputEvent = "touchstart";
    }


    // create a listener on the input event
    document.addEventListener(inputEvent, onpress);
}

function onpress(evt) {
    switch (currentState) {

        case states.Hovering:
            currentState = states.Game;
            aang.jump();
            document.getElementById('currentScore').innerHTML = playerScore;
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

        // Check if within the okButton
         if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
         okButton.y < mouseY && mouseY < okButton.y + okButton.height
         ) {
         fireballs.reset();
             clouds.reset();
         currentState = states.Hovering;
         score = 0;
         }
         break;

    }
}

function canvasSetup() {
    canvas = document.createElement('canvas');
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
        
         okButton = {
         x: (width - okButtonSprite.width)/ 2,
         y: (height - okButtonSprite.height)/2,
         width: okButtonSprite.width,
         height: okButtonSprite.height
         };

        startMenuBox = {
            x: (width - startMenuSprite.width)/ 2,
            y: (height - startMenuSprite.height)/2,
            width: startMenuSprite.width,
            height: startMenuSprite.height
        };

        startMenuBox2 = {
            x: (width - startMenuSprite2.width)/ 2,
            y: (height - startMenuSprite2.height)/2,
            width: startMenuSprite2.width,
            height: startMenuSprite2.height
        };
        gameLoop();

    };
}

function Fireball() {
    this.x = width;
    this.y =  (height)  * Math.random();
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
        // Closest difference
        var dx = aang.x - cx;
        var dy1 = aang.y - cy1;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var r = aang.radius * aang.radius;
        // Determine intersection
        if (r > d1) {
            currentState = states.Score;
           updateScore();
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

    if (currentState === states.Hovering) {
        clouds.update();
    }
    if (currentState === states.Game) {
       fireballs.update();
        clouds.update();
    }

    aang.update()
}

function render() {
    renderingContext.fillRect(0, 0, width, height);
    clouds.draw(renderingContext);
    fireballs.draw(renderingContext);
    aang.draw(renderingContext);

    if (currentState === states.Hovering) {
        console.log(width);
        if (width <= 500) {
            startMenuSprite2.draw(renderingContext, startMenuBox.x, startMenuBox.y);
        }
        else {
            startMenuSprite.draw(renderingContext, startMenuBox.x, startMenuBox.y);
        }

    }

    if (currentState === states.Score) {
            okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }



}

function checkScore() {
    savedHighScore = localStorage.getItem('highScore');
    if (highScore <= savedHighScore) {
        highScore = savedHighScore;
        document.getElementById('highScore').innerHTML = highScore;
    }
}

function updateScore() {
    if (playerScore > highScore) {
        highScore = playerScore;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerHTML = highScore;
        playerScore = 0;
    }
    else {
        playerScore = 0;
    }
}

function removeSelectMenu() {
    var selectArea = document.getElementById('selectArea');
    var selectMenu = document.getElementById('selectMenu');
    var garbage = selectArea.removeChild(selectMenu);
}