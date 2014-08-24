
BasicGame.Game = function (game) {


};

BasicGame.Game.prototype = {

	create: function () {

		// start the physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// make the world larger
		this.game.world.setBounds(0, 0, 640, 2000);
		this.game.add.tileSprite(0, 0, 640, 2000, 'starfield');

		// add ground in
		this.ground = this.game.add.sprite(0, this.game.world.height - 64, 'ground' );
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;

		// add in spaceman
		this.spaceMan = this.game.add.sprite(100, this.game.world.height - 250, 'spaceMan');
		this.game.physics.arcade.enable(this.spaceMan);
		this.spaceMan.body.collideWorldBounds = true;
		this.spaceMan.body.bounce.set(0.9);
		this.spaceMan.body.drag.set(20, 20);
		this.spaceMan.anchor.setTo(0.5, 0.5);
		this.spaceMan.scale.setTo(2, 2);
		this.spaceMan.animations.add('passive');
		this.spaceMan.play('passive', 15, true);

		// enable input on spaceman
		this.spaceMan.inputEnabled = true;
		this.spaceMan.input.start(0, true);
		this.spaceMan.events.onInputDown.add(this.set, this);
		this.spaceMan.events.onInputUp.add(this.launch, this);

		// game vars
		this.catchFlag = false;
		this.launchVelocity = 0;

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


	},

	update: function () {
		this.arrow.rotation = this.game.physics.arcade.angleToXY(this.arrow,  this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);

		// if we have the spaceman selected
		if(this.catchFlag) {

			/*this.spaceMan.x = this.game.input.activePointer.worldX;
			this.spaceMan.y = this.game.input.activePointer.worldY;*/

			this.arrow.alpha = 1;
			this.line.alpha = 0.5;

			this.line.rotation = this.arrow.rotation - 3.14 / 2;
			this.line.height = this.game.physics.arcade.distanceToXY(this.arrow, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
			this.launchVelocity = this.line.height;

		}
		

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

		var Xvector = (this.arrow.x - pointer.worldX) * 3;
		var Yvector = (this.arrow.y - pointer.worldY) * 3;

		spaceman.body.velocity.setTo(Xvector, Yvector);

		this.game.camera.follow(this.spaceMan, Phaser.Camera.FOLLOW_TOPDOWN);

	},





	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	},

	render:  function() {
		this.game.debug.spriteCoords(this.ground, 32, 150);
		this.game.debug.cameraInfo(game.camera, 32, 32);
		this.game.debug.text("Velocity: " , 450, 32, 'rgb(0,255,0)');
		this.game.debug.inputInfo(16, 200);
	}

};
