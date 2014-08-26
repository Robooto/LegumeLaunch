var NewWorld = function(game, x, y, key, frame) {
    key = 'newWorld';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    // Init the newworld
    this.anchor.setTo(0.5, 0.5);
    // Enable physics on the newworld
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.enableBody = true;

    this.SPEED = game.rnd.integerInRange(-300, -30);

    this.events.onRevived.add(this.onRevived, this);


};

NewWorld.prototype = Object.create(Phaser.Sprite.prototype);
NewWorld.prototype.constructor = NewWorld;

NewWorld.prototype.update = function() {

    this.body.velocity.x = this.SPEED;

    // this is a fix due to out of bounds kill not working when sprite not in camera 
    if(this.x < -100) {
        this.reset(this.game.width + 50, game.rnd.integerInRange(100, 300));
        this.revive();
    }
};

NewWorld.prototype.onRevived = function() {
    this.body.velocity.x = game.rnd.integerInRange(-300, -30);
};

