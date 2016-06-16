// Sprite variables
var
  fishSprite,
  backgroundSprite,
  foregroundSprite,
  topCoralSprite,
  bottomCoralSprite,
  textSprites,
  scoreSprite,
  splashScreenSprite,
  okButtonSprite,
  smallNumberSprite,
  largeNumberSprite;

/**
 * Sprite class
 * @param {Image} img - sprite sheet image
 * @param {number} x - x-position in sprite sheet
 * @param {number} y - y-position in sprite sheet
 * @param {number} width - width of sprite
 * @param {number} height - height of sprite
 */
function Sprite(img, x, y, width, height) {
  this.img = img;
  this.x = x * 2;
  this.y = y * 2;
  this.width = width * 2;
  this.height = height * 2;
}

/**
 * Draw sprite to canvas context
 *
 * @param {CanvasRenderingContext2D} renderingContext context used for drawing
 * @param {number} x   x-position on canvas to draw from
 * @param {number} y   y-position on canvas to draw from
 */
Sprite.prototype.draw = function (renderingContext, x, y) {
  renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
    x, y, this.width, this.height);
};

/**
 * Initate all sprite
 * @param {Image} img spritesheet image
 */
function initSprites(img) {

  fishSprite = [
    new Sprite(img, 176, 115, 42, 28),
    new Sprite(img, 176, 144, 42, 28),
    new Sprite(img, 176, 172, 42, 28)
  ];

  backgroundSprite = new Sprite(img, 0, 0, 138, 114);
  backgroundSprite.color = "#8BE4FD"; // save background color
  foregroundSprite = new Sprite(img, 138, 0, 112, 56);

  topCoralSprite = new Sprite(img, 251, 0, 26, 200);
  bottomCoralSprite = new Sprite(img, 277, 0, 26, 200);

  textSprites = {
    floppyFish: new Sprite(img, 59, 114, 96, 22),
    gameOver: new Sprite(img, 59, 136, 94, 19),
    getReady: new Sprite(img, 59, 155, 87, 22)
  };
  
  topCoralSprite = new Sprite(img, 251, 0, 26, 200);
  bottomCoralSprite = new Sprite(img, 277, 0, 26, 200);


  okButtonSprite = new Sprite(img, 119, 191, 40, 14);

  scoreSprite = new Sprite(img, 138, 56, 113, 58);
  splashScreenSprite = new Sprite(img, 0, 114, 59, 49);

  }