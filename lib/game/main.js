ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.levels.dorm1',
	'game.levels.dorm2',
	'impact.font',
	'impact.timer'
)
.defines(function(){

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font('media/04b03.font.png'),
	gravity: 300,
	instructText: new ig.Font('media/04b03.font.png'),
	statText: new ig.Font('media/04b03.font.png'),
	showStats: false,
	statMatte: new ig.Image('media/stat-matte.png'),
	levelTimer: new ig.Timer(),
	levelExit: null,
	stats: {time: 0, kills: 0, deaths: 0},


	init: function() {
		ig.music.add('media/sounds/theme.*');
		ig.music.volume = 0.5;
		ig.music.play();
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.X, 'jump');
		ig.input.bind(ig.KEY.C, 'shoot');
		ig.input.bind(ig.KEY.TAB, 'switch');
		ig.input.bind(ig.KEY.SPACE, 'continue');
		this.loadLevel(LevelDorm1);
	},

	loadLevel: function(data) {
		this.parent(data);
		this.levelTimer.reset();
	},

	update: function() {
		// Screen follows player
		var player = this.getEntitiesByType(EntityPlayer)[0];
		if (player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
			if (player.accel.x > 0 && this.instructText) {
				this.instructText = null;
			}
		}
		// Update all entities and backgroundMaps
		if (!this.showStats) {
			this.parent();
		} else {
			if (ig.input.state('continue')) {
				this.showStats = false;
				this.levelExit.nextLevel();
				this.parent();
			}
		}

		// Add your own, additional update code here
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		if (this.instructText) {
			var x = ig.system.width/2,
			y = ig.system.height - 10;
			this.instructText.draw('Left/Right Moves, X Jumps, C Fires & Tab Switches Weapons.',x, y, ig.Font.ALIGN.CENTER );
		}
		if (this.showStats) {
			this.statMatte.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 - 20;
			this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
			this.statText.draw('Time: '+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
			this.statText.draw('Kills: '+this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
			this.statText.draw('Deaths: '+this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
			this.statText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
		}
	},

	toggleStats: function(levelExit){
		this.showStats = true;
		this.stats.time = Math.round(this.levelTimer.delta());
		this.levelExit = levelExit;
	},
});

StartScreen = ig.Game.extend({

	instructText: new ig.Font('media/04b03.font.png'),
	background: new ig.Image('media/screen-bg.png'),
	mainCharacter: new ig.Image('media/screen-main-character.png'),
	title: new ig.Image('media/game-title.png'),

	init: function() {
		ig.input.bind( ig.KEY.SPACE, 'start');
	},

	update: function() {
		if (ig.input.pressed ('start')){
			ig.system.setGame(MyGame);
		}
		this.parent();
	},

	draw: function() {
		this.parent();
		this.background.draw(0,0);
		this.mainCharacter.draw(0,0);
		this.title.draw(ig.system.width - this.title.width, 0);
		var x = ig.system.width/2,
		y = ig.system.height - 10;
		this.instructText.draw('Press Spacebar To Start', x+40, y, ig.Font.ALIGN.CENTER);
	},
});

if (ig.ua.mobile) {
	// Disable sound for all mobile devices
	ig.Sound.enabled = false;
}

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main('#canvas', StartScreen, 60, 320, 240, 2);

});
