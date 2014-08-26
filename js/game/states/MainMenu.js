BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

    create: function() {

        this.background = this.game.add.tileSprite(0, 0, 640, 2000, 'starfield');
        this.background.autoScroll(-60, -10);

        // add in new world 
		this.newWorld = new NewWorld(this.game, this.game.width+150, 250);
		this.newWorld.scale.set(2);
		this.game.add.existing(this.newWorld);

        // Name of the game
        var nameLabel = game.add.text(game.world.centerX, 500, 'Legume Launch', {
            font: '60px Arial',
            fill: '#ffffff'
        });
        nameLabel.anchor.setTo(0.5, 0.5);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, 700, 'Tap the screen to Start', {
            font: '26px Arial',
            fill: '#ffffff'
        });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({
            angle: -2
        }, 500).to({
            angle: 2
        }, 500).loop().start();

        // start the game on tap
        this.game.input.onDown.addOnce(this.start, this);

        // group for asteroids
        this.asteroids = this.game.add.group();
        // Add an asteroid every 2.0 seconds
        game.time.events.loop(2000, this.addAsteroid, this);

        this.asteroidExplode = this.game.add.audio('asteroidexplode');

        // add in music
        BasicGame.music = this.add.audio('gameMusic');
        BasicGame.music.play('', 0, 0.3, true);
    },

    update: function() {
    	this.game.physics.arcade.overlap(this.newWorld, this.asteroids, this.hitNewWorld, null, this);
    },

    hitNewWorld: function(newWorld, asteroids) {
    	asteroids.kill();
    	asteroids.death();
        this.asteroidExplode.play();
    },

    addAsteroid: function() {
        // creating our fists
        var x = game.rnd.pick([0, game.world.width]); // puts the fist on the right side
        var y = this.game.rnd.integerInRange(300, 1800); // between top and above ground

        // grab first dead fist and if no fist is dead create one calling our prefab
        var asteroid = this.asteroids.getFirstExists(false);
        if (!asteroid) {
            asteroid = new Asteroid(this.game, 0, 0); // will set x and y later
            this.asteroids.add(asteroid); // add fist to the fists group
        }

        asteroid.reset(x, y); // playce the fist on the screen
        asteroid.revive(); // revive the fist which calls our on revive method

    },

    start: function() {
    	this.asteroids.destroy();
    	
        game.state.start('Game');
    }

};
