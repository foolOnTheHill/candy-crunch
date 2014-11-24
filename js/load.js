var boot = {
	preload: function() {
		this.game.stage.backgroundColor = '#eb87f2';
		this.game.load.image('loading', 'assets/loading.png');
		this.game.load.image('loading2', 'assets/loading2.png');
	},
	create: function() {
		this.game.state.start('load');
	}
}

var load = {
	preload: function() {
		preloading2 = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2+15, 'loading2');
		preloading2.x -= preloading2.width/2;
		preloading = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2+19, 'loading');
		preloading.x -= preloading.width/2;
		this.game.load.setPreloadSprite(preloading);

		this.game.load.image('blue', 'assets/blue.png');
		this.game.load.image('red', 'assets/red.png');
		this.game.load.image('green', 'assets/green.png');
		this.game.load.image('yellow', 'assets/yellow.png');

		this.game.load.audio('plin', 'assets/plin.wav');
		this.game.load.audio('plin2', 'assets/plin2.wav');
		this.game.load.audio('plin3', 'assets/plin3.wav');
		this.game.load.audio('end', 'assets/end_level.wav');
	},
	create: function() {
		this.game.state.start('menu');
	}
}
