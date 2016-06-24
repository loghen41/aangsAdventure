/**
 * Created by loganhendricks on 6/14/16.
 */
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

}

    function initSprites(img) {
        aangSprite = [
            new Sprite(img, 0, 0, 70, 75),
            new Sprite(img, 75, 0, 70, 75),
            new Sprite(img, 148, 0, 70, 75),
            new Sprite(img, 220, 0, 70, 75)
        ];
        fireballSprite = new Sprite(img, 301, 0 , 107, 36 );
        backgroundSprite = new Sprite(img, 0, 0, 138, 114);
        backgroundSprite.color = "#88e4FD";
        cloudSprite = new Sprite(img, 410, 0, 100, 61 );
        okButtonSprite = new Sprite(img, 300, 80, 238, 125);
        startMenuSprite2 = new Sprite(img, 0, 300, 238, 125 );
        startMenuSprite = new Sprite(img,0, 80, 238, 125);
        
}

Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

