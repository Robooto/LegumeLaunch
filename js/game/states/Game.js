
BasicGame.Game = function (game) {


};

BasicGame.Game.prototype = {

	create: function () {

		// start the physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// game vars
		this.catchFlag = false;
		this.launchVelocity = 0;
		this.spaceManAttr = {
			gravityX: 10,
			gravityY: 300,
			volunteers: 1
		};

		// make the world larger
		this.game.world.setBounds(0, 0, 640, 2000);
		this.background = this.game.add.tileSprite(0, 0, 640, 2000, 'starfield');
		this.background.autoScroll(-60, -10);

		// add in earth
		this.earth = this.game.add.sprite(0, this.game.world.height - 640, 'earth');
		this.game.physics.arcade.enable(this.earth);
		this.earth.body.allowGravity = false;
		this.earth.body.immovable = true;

		// group for clouds
        this.clouds = this.game.add.group();
        this.addCloud();
		game.time.events.loop(4800, this.addCloud, this);

		// add in launch plat
		this.launchPad = this.game.add.sprite(50, this.game.world.height - 225, 'launchplat');
		this.game.physics.arcade.enable(this.launchPad);
		this.launchPad.body.allowGravity = false;
		this.launchPad.body.immovable = true;

		// add in new world 
		this.newWorld = new NewWorld(this.game, this.game.width+50, 180);
		this.newWorld.scale.set(0.7);
		this.game.add.existing(this.newWorld);

		// add ground in
		this.ground = this.game.add.sprite(0, this.game.world.height - 64, 'ground' );
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;

		// add in spaceman
		this.spaceMan = this.game.add.sprite(this.launchPad.x + 70, this.launchPad.y - 38, 'spaceMan');
		this.game.physics.arcade.enable(this.spaceMan);
		this.spaceMan.body.collideWorldBounds = false;
		this.spaceMan.checkWorldBounds = true;
    	this.spaceMan.onOutOfBoundsKill = true;
    	this.spaceMan.outOfBoundsKill = true;
		this.spaceMan.body.bounce.set(0.9);
		this.spaceMan.body.drag.set(20, 20);
		this.spaceMan.body.gravity.setTo(this.spaceManAttr.gravityX, this.spaceManAttr.gravityY);
		this.spaceMan.anchor.setTo(0.5, 0.5);
		this.spaceMan.scale.setTo(2);
		this.spaceMan.animations.add('passive');
		this.spaceMan.play('passive', 15, true);

		// enable input on spaceman
		this.spaceMan.inputEnabled = true;
		this.spaceMan.input.start(0, true);
		this.spaceMan.events.onInputDown.add(this.set, this);
		this.spaceMan.events.onInputUp.add(this.launch, this);
		this.spaceMan.events.onKilled.add(this.onkill, this);

		// Init emitter for lion deaths
        this.spaceManEmitter = game.add.emitter(0, 0, 50);
        this.spaceManEmitter.makeParticles('spacemanpart');
        this.spaceManEmitter.setYSpeed(-400, 100);
        this.spaceManEmitter.setXSpeed(-100, 250);
        this.spaceManEmitter.minParticleScale = 0.5;
        this.spaceManEmitter.maxParticleScale = 2;
        this.spaceManEmitter.gravity = 0;

		// arrow
		this.arrow = this.game.add.sprite(200, this.game.world.height - 450, 'arrow');
		this.arrow.anchor.setTo(0.1, 0.5);
		this.arrow.alpha = 0;

		// line
		this.line = this.game.add.sprite(200, this.game.world.height - 450, 'line');
		this.line.anchor.setTo(0.5, 0);
		this.line.alpha = 0;
		this.line.width = 8;

		this.game.camera.follow(this.spaceMan, Phaser.Camera.FOLLOW_TOPDOWN);

		// labels
		this.volLabel = game.add.text(20, 20, 'Willing Volunteers: ' + this.spaceManAttr.volunteers, {
            font: '20px Arial',
            fill: '#ffffff'
        });
        this.volLabel.fixedToCamera = true;

        this.velocLabel = game.add.text(320, 20, 'Travel Power: ' + parseInt(this.launchVelocity), {
            font: '20px Arial',
            fill: '#ffffff'
        });
        this.velocLabel.fixedToCamera = true;

        // Add a mute button
        this.muteButton = game.add.button(600, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }
        this.muteButton.fixedToCamera = true;


        // how to play
        this.game.add.text(120, this.game.world.height - 455, 'Drag and release the volunteer to explore space.', {
        	font: '20px Arial',
        	fill: '#ffffff'
        });

        // group for asteroids
        this.asteroids = this.game.add.group();
        // Add an asteroid every 2.0 seconds
        game.time.events.loop(1000, this.addAsteroid, this);

        // add sounds
        this.asteroidExplode = this.game.add.audio('asteroidexplode');
        this.spaceManExplode = this.game.add.audio('spacemanexplode');
        this.spaceManJump = this.game.add.audio('spacemanjump');
        this.endGameSound = this.game.add.audio('endgame');


	},

	update: function () {
		// collisions
		this.game.physics.arcade.collide(this.spaceMan, this.ground);

        this.game.physics.arcade.collide(this.spaceMan, this.launchPad);

        this.game.physics.arcade.overlap(this.spaceMan, this.newWorld, this.hitNewWorld, null, this);

        this.game.physics.arcade.overlap(this.newWorld, this.asteroids, this.hitNewWorldast, null, this);

        this.game.physics.arcade.overlap(this.earth, this.asteroids, this.hitAsteroidsEarth, null, this);

        this.game.physics.arcade.overlap(this.spaceMan, this.asteroids, this.hitAsteroidsMan, null, this);

        //arrow rotation
		this.arrow.rotation = this.game.physics.arcade.angleToXY(this.arrow,  this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);

		// if we have the spaceman selected
		if(this.catchFlag) {

			this.arrow.alpha = 1;
			this.line.alpha = 0.5;

			this.line.rotation = this.arrow.rotation - 3.14 / 2;
			this.line.height = this.game.physics.arcade.distanceToXY(this.arrow, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
			this.launchVelocity = this.line.height;
			this.velocLabel.text = 'Travel Power: ' + parseInt(this.launchVelocity);

		}
		
		  this.spaceMan.scale.setTo((this.spaceMan.y / this.game.height) + 1);

		this.endGravity(this.spaceMan);

	},

	hitNewWorldast: function(newWorld, asteroids) {
    	asteroids.kill();
    	asteroids.death();
    	this.asteroidExplode.play();
    },

    hitAsteroidsEarth: function(earth, asteroids) {
    	asteroids.kill();
    	asteroids.death();
    	this.asteroidExplode.play();
    },

    hitAsteroidsMan: function(spaceman, asteroids) {
    		spaceman.kill();
    		this.spaceManExplode.play();
    },

	// display arrow and line
	set: function(spaceman, pointer) {

		this.catchFlag = true;

		spaceman.body.moves = false;
		spaceman.body.velocity.setTo(0, 0);
		this.arrow.reset(spaceman.x, spaceman.y + 10);
		this.line.reset(spaceman.x, spaceman.y + 10);
		this.game.camera.follow(null);
	},

	// launch our spaceman into space!
	launch: function(spaceman, pointer) {

		this.catchFlag = false;

		spaceman.body.moves = true;

		this.arrow.alpha = 0;
		this.line.alpha = 0;

		var Xvector = (this.arrow.x - pointer.worldX) * 5;
		var Yvector = (this.arrow.y - pointer.worldY) * 5;

		spaceman.body.velocity.setTo(Xvector, Yvector);

		this.game.camera.follow(this.spaceMan, Phaser.Camera.FOLLOW_TOPDOWN);

		this.spaceManJump.play();

	},

	onkill: function(spaceman) {
		// Emitt particles
        this.spaceManEmitter.x = spaceman.x;
        this.spaceManEmitter.y = spaceman.y;
        this.spaceManEmitter.start(true, 800, null, 50);

        // update the volunteer number and reset the text
		this.spaceManAttr.volunteers++;
		this.volLabel.text = 'Willing Volunteers: ' + this.spaceManAttr.volunteers;
		this.velocLabel.text = 'Travel Power: 0';

		// add a little delay before restarting
		game.time.events.add(Phaser.Timer.SECOND * 1, function() {spaceman.reset(this.launchPad.x + 70, this.launchPad.y - 38)}, this);
		game.time.events.add(Phaser.Timer.SECOND * 1, function() {spaceman.revive()}, this);

	},

	    addCloud: function() {

        // Get a cloud from the group
        var cloud = this.clouds.getFirstExists(false);

        if (!cloud) {
            cloud = new Clouds(this.game, 0, 0);
            this.clouds.add(cloud);
        }

        cloud.reset(game.world.width, this.game.rnd.integerInRange(1599, 1747));
        cloud.revive();


    },
    	// give the space man gravity while inside earth
	endGravity: function(spaceman) {
		if(spaceman.world.y < 1400) {
			spaceman.body.gravity.setTo(0, 0);
		} else {
			spaceman.body.gravity.setTo(this.spaceManAttr.gravityX, this.spaceManAttr.gravityY);
		}
	},

	hitNewWorld: function(spaceman, newworld) {
		// clean up my assets and show the scoreboard
		spaceman.destroy();

		this.asteroids.destroy();
		this.clouds.destroy();
		this.endGameSound.play();

		var scoreboard = new Scoreboard(this.game);
		scoreboard.show(this.spaceManAttr.volunteers);

		this.game.camera.follow(null);	

	},

	addAsteroid: function() {
        // creating our fists
        var x = game.rnd.pick([0, game.world.width]); // puts the fist on the right side
        var y = this.game.rnd.integerInRange(300, 1300); // between top and above ground

        // grab first dead fist and if no fist is dead create one calling our prefab
        var asteroid = this.asteroids.getFirstExists(false);
        if (!asteroid) {
            asteroid = new Asteroid(this.game, 0, 0); // will set x and y later
            this.asteroids.add(asteroid); // add fist to the fists group
        }

        asteroid.reset(x, y); // playce the fist on the screen
        asteroid.revive(); // revive the fist which calls our on revive method

    },

    toggleSound: function() {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },

	render:  function() {
		/*this.game.debug.spriteCoords(this.newWorld, 32, 120);
		this.game.debug.spriteInfo(this.newWorld, 32, 302);
		this.game.debug.cameraInfo(game.camera, 32, 32);
		this.game.debug.text("Velocity: " , 450, 32, 'rgb(0,255,0)');
		 this.game.debug.inputInfo(16, 200);*/
	}

};
