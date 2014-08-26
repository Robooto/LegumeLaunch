
BasicGame.Preloader = function (game) {

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		
		// Add a loading label 
		var loadingLabel = this.add.text(this.game.world.centerX, game.world.centerY - 80, 'loading...', { font: '40px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Add a progress bar
		var progressBar = this.add.sprite(this.game.world.centerX, game.world.centerY, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		progressBar.scale.set(2);
		this.load.setPreloadSprite(progressBar);

		// Load all assets
		this.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);
		
		//	Here we load the rest of the assets our game needs.
		//	+ lots of other required assets here

		// candy spaceman
		this.game.load.spritesheet('spaceMan', 'assets/images/JellyBean_32_32_5.png', 32, 32, 5);

		// ground
		this.game.load.image('ground', 'assets/images/ground.png'); 

		// arrow
		this.game.load.image('arrow', 'assets/images/arrow.png');

		// line 
		this.game.load.image('line', 'assets/images/line.png');

		// starfield
		this.game.load.image('starfield', 'assets/images/1024x768_star_field_by_nightmaremetropolis.png');

		// earth
		this.game.load.image('earth', 'assets/images/world.png');

		// launch platform
		this.game.load.image('launchplat', 'assets/images/launchplat.png');

		// new world
		this.game.load.image('newWorld', 'assets/images/newWorld.png');

		// asteroids
		this.game.load.spritesheet('asteroid', 'assets/images/asteroids_36_36_16.png', 36, 36, 16);

		// particles
		this.game.load.image('asteroidpart', 'assets/images/asteroidparticle.png');
		this.game.load.image('spacemanpart', 'assets/images/beanParticle.png');

		//clouds
        this.game.load.image('clouds', 'assets/images/cloud_3.png');

		//sounds
		this.game.load.audio('asteroidexplode', ['assets/sounds/Explosion29.ogg', 'assets/sounds/Explosion29.mp3']);
		this.game.load.audio('spacemanexplode', ['assets/sounds/Hit_Hurt34.ogg', 'assets/sounds/Hit_Hurt34.mp3']);
		this.game.load.audio('spacemanjump', ['assets/sounds/Jump17.ogg', 'assets/sounds/Jump17.mp3']);
		this.game.load.audio('endgame', ['assets/sounds/chipquest.ogg', 'assets/sounds/chipquest.mp3']);

		this.game.load.audio('gameMusic', ['assets/sounds/Double-Jump.ogg', 'assets/sounds/Double-Jump.mp3']);



	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('gameMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
