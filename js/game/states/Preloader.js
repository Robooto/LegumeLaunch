
BasicGame.Preloader = function (game) {

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		
		// Add a loading label 
		var loadingLabel = this.add.text(this.game.world.centerX, game.world.centerY - 50, 'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Add a progress bar
		var progressBar = this.add.sprite(this.game.world.centerX, game.world.centerY, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(progressBar);

		// Load all assets
		this.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);
		
		//	Here we load the rest of the assets our game needs.
		//	+ lots of other required assets here

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
		
		if (/*this.cache.isSoundDecoded('titleMusic') && */this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
