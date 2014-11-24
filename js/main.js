var main_state = {
	create: function() {
		this.moves_text = this.game.add.text(275, 575, '20 moves left', {font: "30px 'Crafty Girls'", fill: '#FFFFFF', align:'center'});
		this.moves_text.fontWeight = 'bold';
		this.moves_text.anchor.setTo(0.5, 0.5);

		this.score = 0;
		this.score_text = this.game.add.text(275, 31, '0', {font: "40px 'Crafty Girls'", fill: '#FFFFFF', align:'center'});
		this.score_text.fontWeight = 'bold';
		this.score_text.anchor.setTo(0.5, 0.5);

		this.click_se = this.game.add.sound('plin');
		this.click_se.volume = 2;

		this.crunch_se = this.game.add.sound('plin2');
		this.crunch_se.volume = 20;

		this.big_crunch_se = this.game.add.sound('plin3');
		this.big_crunch_se.volume = 20;

		this.end_se = this.game.add.sound('end');
		this.end_se.volume = 30;

		this.selected1 = null;
		this.selected2 = null;

		this.grid = new Array();
		this.colors = new Array()
		for (var i = 0; i < 8; i++) {
			this.grid[i] = new Array();
			this.colors[i] = new Array();
		}
		this.setLevel();

		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		this.check_end();

		if (this.moves == -1 && this.space.isDown) {
			this.setLevel();
		}
	},

	selectPiece: function(p) {
		if (this.moves == 0) return;
		
		if (this.selected1 == null) {
			this.click_se.play();
			this.selected1 = {posX:p.posX, posY:p.posY};
		} else if (this.selected2 == null) {
			this.click_se.play();
			this.selected2 = {posX:p.posX, posY:p.posY};
			this.switchPieces();
		}
	},

	switchPieces: function() {
		var x1 = this.selected1.posY;
		var y1 = this.selected1.posX;
		var x2 = this.selected2.posY;
		var y2 = this.selected2.posX;

		var lines = (y1 == y2) && (Math.abs(x1-x2) == 1);
		var col = (x1 == x2) && (Math.abs(y1-y2) == 1);

		if (lines || col) {
			var temp = this.colors[this.selected1.posY][this.selected1.posX];
			this.colors[this.selected1.posY][this.selected1.posX] = this.colors[this.selected2.posY][this.selected2.posX];
			this.colors[this.selected2.posY][this.selected2.posX] = temp;
			this.paintCircle(this.selected1.posY, this.selected1.posX);
			this.paintCircle(this.selected2.posY, this.selected2.posX);

			this.update_moves();

			while (this.updateGrid() > 0){};
		}

		this.selected1 = null;
		this.selected2 = null;
	},

	update_moves: function() {
		this.moves -= 1;
		this.moves_text.content = this.moves+' moves left';
		this.moves_text.anchor.setTo(0.5, 0.5);
	},

	getRandomColor: function() {
		var p = Math.random();
		if (p < 0.25) {
			return 'red';
		} else if (p >= 0.25 && p < 0.5) {
			return 'blue';
		} else if (p >= 0.5 && p < 0.75) {
			return 'green';
		} else {
			return 'yellow';
		}
	},

	setLevel: function() {
		this.moves = 20;

		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 9; j++) {
				this.colors[i][j] = this.getRandomColor();
			}
		}
		this.renderGrid();

		this.setAnimationsOff = true;
		while (this.updateGrid() > 0) {}
		this.setAnimationsOff = false;
	},

	renderGrid: function() {
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 9; j++) {
				this.paintCircle(i, j);
			}
		}	
	},

	paintCircle: function(i, j) {
		var x = 80 + i*55;
		var y = 80 + j*55;

		if (this.grid[i][j] !== undefined) {
			this.grid[i][j].kill();
		}

		if (this.colors[i][j] == 'red') {
			this.grid[i][j] = this.game.add.sprite(x, y, 'red');
		} else if (this.colors[i][j] == 'blue') {
			this.grid[i][j] = this.game.add.sprite(x, y, 'blue');
		} else if (this.colors[i][j] == 'green') {
			this.grid[i][j] = this.game.add.sprite(x, y, 'green');
		} else {
			this.grid[i][j] = this.game.add.sprite(x, y, 'yellow');
		}

		this.grid[i][j].anchor.setTo(0.5, 0.5);
		this.grid[i][j].posX = j;
		this.grid[i][j].posY = i;
		this.grid[i][j].inputEnabled = true;
		this.grid[i][j].events.onInputDown.add(this.selectPiece, this);
	},

	updateGrid: function() {
		var c = 0;
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 9; j++) {

				if (i+1 <= 7 && i+2 <= 7 && i+3 <= 7 && this.colors[i][j] == this.colors[i+1][j] && this.colors[i+1][j] == this.colors[i+2][j] && this.colors[i+2][j] == this.colors[i+3][j]) {
					for (var a = i; a < 8; a++) {
						if (a + 4 < 8) { 
							this.colors[a][j] = this.colors[a+4][j];
						}
					}			
					this.colors[7][j] = this.getRandomColor();
					this.colors[6][j] = this.getRandomColor();
					this.colors[5][j] = this.getRandomColor();
					this.colors[4][j] = this.getRandomColor();

					for (var line = i; line < 8; line++) {
						this.paintCircle(line, j);
					}
					c++;

					if (!this.setAnimationsOff) {
						this.big_crunch_se.play();

						this.game.add.tween(this.grid[7][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[6][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[5][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[4][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						
						this.update_score(100);
					}
				} 
			}
		}

		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 9; j++) {

				if (i+1 <= 7 && i+2 <= 7 && this.colors[i][j] == this.colors[i+1][j] && this.colors[i+1][j] == this.colors[i+2][j]) {
					for (var a = i; a < 8; a++) {
						if (a + 3 < 8) { 
							this.colors[a][j] = this.colors[a+3][j];
						}
					}			
					this.colors[7][j] = this.getRandomColor();
					this.colors[6][j] = this.getRandomColor();
					this.colors[5][j] = this.getRandomColor();
					
					for (var line = i; line < 8; line++) {
						this.paintCircle(line, j);
					}
					c++;

					if (!this.setAnimationsOff) {
						this.crunch_se.play();

						this.game.add.tween(this.grid[7][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[6][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[5][j].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						
						this.update_score(50);
					}
				} 
			}
		}

		for(var i = 0; i < 8; i++){
			for (var j = 0; j < 9; j++){
				if (j+1 <= 8 && j+2 <= 8 && j+3 <= 8 && this.colors[i][j] == this.colors[i][j+1] && this.colors[i][j+1] == this.colors[i][j+2] && this.colors[i][j+2] == this.colors[i][j+3]) {
					for (var a = j; a < 9; a++) {
						if (a + 4 < 9) { 
							this.colors[i][a] = this.colors[i][a+4];
						}
					}
					this.colors[i][5] = this.getRandomColor();
					this.colors[i][6] = this.getRandomColor();
					this.colors[i][7] = this.getRandomColor();
					this.colors[i][8] = this.getRandomColor();
					
					for (var col = j; col < 9; col++) {
						this.paintCircle(i, col);
					}
					c++;
					
					if (!this.setAnimationsOff) {
						this.big_crunch_se.play();
						
						this.game.add.tween(this.grid[i][5].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[i][6].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[i][7].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[i][8].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						
						this.update_score(100);
					}
				}
			}
		}

		for(var i = 0; i < 8; i++){
			for (var j = 0; j < 9; j++){
				if (j+1 <= 8 && j+2 <= 8 && this.colors[i][j] == this.colors[i][j+1] && this.colors[i][j+1] == this.colors[i][j+2]) {
					for (var a = j; a < 9; a++) {
						if (a + 3 < 9) { 
							this.colors[i][a] = this.colors[i][a+3];
						}
					}
					this.colors[i][6] = this.getRandomColor();
					this.colors[i][7] = this.getRandomColor();
					this.colors[i][8] = this.getRandomColor();
					
					for (var col = j; col < 9; col++) {
						this.paintCircle(i, col);
					}
					c++;
					
					if (!this.setAnimationsOff) {
						this.crunch_se.play();
					
						this.game.add.tween(this.grid[i][6].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[i][7].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						this.game.add.tween(this.grid[i][8].scale).to({x:1.32, y:1.32}, 300, null, false, 0, 0, true).to({x:1, y:1}, 300, null, false, 0, 0, true).start();
						
						this.update_score(50);
					}
				}
			}
		}

		return c;
	},

	update_score: function(v) {
		this.score+=v;
		this.score_text.content = this.score;
		this.score_text.anchor.setTo(0.5, 0.5);
	},

	check_end: function() {
		if (this.moves == 0) {
			this.moves -= 1;
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 9; j++) {
					this.grid[i][j].kill();
				}
			}
			this.end_se.play();
		}
	}

};
