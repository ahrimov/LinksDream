var gameManager = {
	factory: {},
	entities: [],
	player: null,
	laterKill: [],
	timerId: null,
	playerData: {lifetime: 0, coins: 0},
	initPlayer: function(obj){
		this.player = obj;
		if(this.playerData.lifetime !== 0){
			this.player.lifetime = this.playerData.lifetime;
			this.player.coins = this.playerData.coins;
		}
		this.player.updateInfo();
	},
	kill: function(obj){
		this.laterKill.push(obj);
	},
	update: function(){
		if(this.player === null)
			return;
		this.player.move_x = 0;
		this.player.move_y = 0;
		if(eventsManager.action["up"]) 
			this.player.move_y = -1;
		if(eventsManager.action["down"]) 
			this.player.move_y = 1;
		if(eventsManager.action["left"]) 
			this.player.move_x = -1;
		if(eventsManager.action["right"]) 
			this.player.move_x = 1;
		if(eventsManager.action["attack"]) 
			this.player.fight();


		this.entities.forEach(function(e){
			try{
				e.update();
			} catch(ex){
				console.log(ex)
			}
		});

		// check logic for buttons
		physicManager.connectButtonToDoor1();
		physicManager.connectButtonToDoor12();

		for( var i = 0; i < this.laterKill.length; i++){
			var idx = this.entities.indexOf(this.laterKill[i]);
			if(idx > -1)
				this.entities.splice(idx, 1);
		};
		if(this.laterKill.length > 0)
			this.laterKill.length = 0;
		mapManager.draw(ctx);
		mapManager.centerAt(this.player.pos_x, this.player.pos_y);
		this.draw(ctx);
	},

	draw: function(ctx){
		for(var e = 0; e < this.entities.length; e++)
			this.entities[e].draw(ctx);
	},

	loadAll: function(){
		mapManager.loadMap("./testmap/test/firstLevel.json");
		spriteManager.loadAtlas('player', "./player/atlas.json", "./player/links.png")
		spriteManager.loadAtlas('coin', "./coin/atlas.json", "./coin/coinsprite.png")
		spriteManager.loadAtlas('soldier', "./soldier/atlas.json", "./soldier/soldier.png")
		spriteManager.loadAtlas('arrow', "./arrow/atlas.json", "./arrow/spritesheet.png")
		spriteManager.loadAtlas('box', "./box/atlas.json", "./box/box.png")
		spriteManager.loadAtlas('secretDoor', "./secretDoor/atlas.json", "./secretDoor/secretDoor.png")
		spriteManager.loadAtlas('potion', "./potion/atlas.json", "./potion/potion.png")
		gameManager.factory['player'] = Player;
		gameManager.factory['coin'] = Coin;
		gameManager.factory['soldier'] = Soldier;
		gameManager.factory['box'] = Box;
		gameManager.factory['wall'] = Wall;
		gameManager.factory['endPoint'] = EndPoint;
		gameManager.factory['secretDoor'] = SecretDoor;
		gameManager.factory['pressPanel'] = PressPanel;
		gameManager.factory['potion'] = Potion;
		mapManager.parseEntities();
		mapManager.draw(ctx);
		eventsManager.setup(canvas);

	},

	loadNextLevel: function(lifetime, coins){
		this.entities = new Array();
		this.playerData.lifetime = lifetime;
		this.playerData.coins = coins;
		clearInterval(this.timerId);
		mapManager.clearAll();
		mapManager.loadMap("./testmap/test/dungeon.json");
		mapManager.parseEntities();
		mapManager.draw(ctx);
		eventsManager.setup(canvas);
		this.play();
	},

	play: function(){
		this.timerId = setInterval(updateWorld, 70);
	},

	gameOver: function(player){
		clearInterval(this.timerId);
		let isRestart = confirm('Игра окончена!\n Желаете начать с начала?');
		if(isRestart){
			window.location.reload();
		}
		else{
			var player_name = localStorage["username"];
			if(localStorage[player_name] === undefined || localStorage[player_name] < player.coins)
				localStorage[player_name] = player.coins;
			window.location = 'scoreTable.html'

		}
	}
};


function updateWorld(){
	gameManager.update();
}
