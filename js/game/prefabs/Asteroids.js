var Asteroid = function(game, x, y, key, frame) {
    key = 'asteroid';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    // Init the asteroid
    this.anchor.setTo(0.5, 0.5);
    // Enable physics on the asteroid

    this.animations.add('spin');

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.enableBody = true;

    this.SPEED = game.rnd.integerInRange(500, 700);

    this.events.onRevived.add(this.onRevived, this);

    //emitter for asteroid
    this.asteroidEmitter = game.add.emitter(0, 0, 60);
    this.asteroidEmitter.makeParticles('asteroidpart');
    this.asteroidEmitter.setYSpeed(-400, 100);
    this.asteroidEmitter.setXSpeed(-100, 250);
    this.asteroidEmitter.minParticleScale = 0.5;
    this.asteroidEmitter.maxParticleScale = 2;
    this.asteroidEmitter.gravity = 0;

};

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function() {

    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

    // this is a fix due to out of bounds kill not working when sprite not in camera 
    if(this.x < -100 || this.x > game.world.width + 40) {
        this.kill();
        // this.reset(game.rnd.pick([0, game.world.width]), game.rnd.integerInRange(300, 1800));
        // this.revive();
    }
};

Asteroid.prototype.onRevived = function() {
    // target the lion when spawned
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.game.world.randomX, game.rnd.integerInRange(300, 1300)
    );
    this.rotation = targetAngle;

    this.animations.play('spin', 15, true);
};

Asteroid.prototype.death = function() {
    // emitt particles
    this.asteroidEmitter.x = this.x;
    this.asteroidEmitter.y = this.y;
    this.asteroidEmitter.start(true, 800, null, 30);
};

