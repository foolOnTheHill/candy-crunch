var menu = {
	create: function() {
		
		this.red = this.game.add.sprite(150, 450, 'red');
		this.blue = this.game.add.sprite(250, 100, 'blue');
		this.green = this.game.add.sprite(10, 160, 'green');
		this.yellow = this.game.add.sprite(300, 381, 'yellow');

		this.game.add.tween(this.red).to({x:Math.random()*400, y:Math.random()*400}, Math.random()*2000 + 100, Phaser.Easing.Cubic.Out, true, 0, 1000, true).loop();
		this.game.add.tween(this.blue).to({x:Math.random()*400, y:Math.random()*400}, Math.random()*2000 + 100, Phaser.Easing.Cubic.Out, true, 0, 1000, true).loop();
		this.game.add.tween(this.green).to({x:Math.random()*400, y:Math.random()*400}, Math.random()*2000 + 100, Phaser.Easing.Cubic.Out, true, 0, 1000, true).loop();
		this.game.add.tween(this.yellow).to({x:Math.random()*400, y:Math.random()*400}, Math.random()*2000 + 100, Phaser.Easing.Cubic.Out, true, 0, 1000, true).loop();

		this.game_name = this.game.add.text(275, 250, 'CandyCrunch', {font: "65px 'Crafty Girls'", fill: '#FFFFFF', align:'center'});
		this.game_name.anchor.setTo(0.5, 0.5)
		
		this.start_text = this.game.add.text(275, 320, 'Tap to start', {font: "22px 'Crafty Girls'", fill: '#FFFFFF', align:'center'});
		this.start_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.game_name).to({ angle:1 }, 200).to({ angle:-1 }, 150).loop().start();
		this.game.add.tween(this.start_text.scale).to({x:1.12, y:1.12}, 500).to({x:1, y:1}, 200).loop().start();
	},
	update: function() {
		if (this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown){ 
			this.game.state.start('main');
		} 
	}
}
