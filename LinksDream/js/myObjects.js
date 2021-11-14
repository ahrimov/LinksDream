var Entity = {
	pos_x:0, pos_y:0,
	size_x:0, size_y:0,
	extend: function(extendProto){
		var object = Object.create(this);
		for(var property in extendProto){
			if(this.hasOwnProperty(property) || typeof object[property] === 'undefined'){
				object[property] = extendProto[property];
			}
		}
		return object;
	}
};

var Player = Entity.extend({
	lifetime: 100,
	move_x:0, move_y:0,
	speed:5,
	coins:0,
	direct: "Down",
	counter: 0,
	fightOn: false,
	wasHit: false,
	draw: function(ctx){
		if(this.counter === 6)
			this.fightOn = false;
		if(this.fightOn){
			spriteManager.drawSprite(ctx, 'player', "LinkAttack" + this.direct + this.counter, this.pos_x, this.pos_y);
			this.counter++;
		}
		else if(this.move_x === 0 && this.move_y === 0)
			spriteManager.drawSprite(ctx, 'player', "Link" + this.direct, this.pos_x, this.pos_y);
		else{
			if(this.counter === 6)
				this.counter = 0;
			spriteManager.drawSprite(ctx, 'player', "LinkMove" + this.direct + this.counter, this.pos_x, this.pos_y);
			this.counter++;
		}
	},
	fight: function(){
		this.counter = 0;
		this.fightOn = true;
		if(!soundManager.mute)
			soundManager.play('./music/Sword.wav', {looping: false, volume: 0.5})
	},
	update: function(){
		let buf_direct = physicManager.update(this);
		if(buf_direct !== "stop" && buf_direct !== "break")
			this.direct = buf_direct;
		if(this.fightOn && this.counter === 3){
			let vecX = 0;
			let vecY = 0;
			if(this.direct === 'Left')
				vecX = -1;
			if(this.direct === 'Right')
				vecX = 1;
			if(this.direct === 'Up')
				vecY = -1;
			if(this.direct === 'Down')
				vecY = 1;
			var e = physicManager.entityAtXY(this, this.pos_x + vecX * (this.size_x/2 + 5), 
										  this.pos_y + vecY * (this.size_y/2 + 5));
			if(e !== null && e.name.match(/soldier/)){
				e.hit();
			}
		}
	},
	onTouchEntity: function(obj){
		if(obj.name.match(/coin[\d*]/)){
			this.coins++;
			obj.kill();
			if(!soundManager.mute)
				soundManager.play('./music/Rupee.wav', {looping: false, volume: 0.5})
		}
		if(obj.name === 'box'){
			physicManager.moveBox(this, obj);
			if(!soundManager.mute)
				soundManager.play('./music/LinkPush.wav', {looping: false, volume: 0.5})
		}

		if(obj.name === 'potion'){
			this.lifetime += 20;
			obj.kill();
			if(!soundManager.mute)
				soundManager.play('./music/Potion.wav', {looping: false, volume: 0.5})
		}

		if(obj.name === 'endPoint'){
			gameManager.loadNextLevel(this.lifetime, this.coins);
			return;
		}

		if(obj.name === 'endPoint2'){
			if(!soundManager.mute)
				soundManager.play('./music/Secret.wav', {looping: false, volume: 0.5})
			gameManager.gameOver(this);
			return;
		}

		this.updateInfo()
	},
	updateInfo: function(){
		let life = document.getElementById("life");
		life.innerHTML = 'Life: ' + this.lifetime;
		let coin = document.getElementById("coins");
		coin.innerHTML = 'Coins: ' + this.coins;
	},
	hit: function(){
		this.lifetime -= 20;
		this.updateInfo();
		this.wasHit = true;
		if(!soundManager.mute)
			soundManager.play('./music/LinkHurt.wav', {looping: false, volume: 0.5});
		if(this.lifetime === 0){
			this.kill();
		}
	},
	kill: function(){
		if(!soundManager.mute)
			soundManager.play('./music/LinkDying.wav', {looping: false, volume: 0.5})
		gameManager.gameOver(this);
	}
	});


var Soldier = Entity.extend({
	lifetime:100,
	move_x:0, move_y:0,
	speed:5,
	counter: 1,
	moveCounter: 0,
	followCounter: 0,
	fireTimeOut: 0,
	direct: "Down",
	saveDirect: "",
	sawPlayer: false,
	moveCounter: 0, 
	draw: function(ctx){
		if(this.move_x === 0 && this.move_y === 0)
			spriteManager.drawSprite(ctx, 'soldier', "soldier" + this.direct, this.pos_x, this.pos_y);
		else{
			if(this.counter === 4)
				this.counter = 1
			spriteManager.drawSprite(ctx, 'soldier', "soldierMove" + this.direct + this.counter, this.pos_x, this.pos_y);
			this.counter++
		}
	},
	update: function(){
		if(this.followCounter)
			this.followCounter--;
		else {
			this.seePlayer();
	//	if(!this.moveCounter){
	//		this.seePlayer();
	//	}
			if(!this.sawPlayer)
				physicManager.moveAroundSquare(this);
		}

		let buf_direct = physicManager.update(this);
		if(buf_direct !== "stop" && buf_direct !== "break")
			this.direct = buf_direct;
		if(this.fireTimeOut)
			this.fireTimeOut--;

	},
	kill: function(){
		gameManager.kill(this);
	},
	fire: function(){
		if(this.fireTimeOut)
			return;
		this.fireTimeOut = 5;
		var a = Object.create(Arrow);
		if(this.direct === "Left"){
			a.size_x = 16;
			a.size_y = 5;
			a.move_x = -1;
			a.pos_x = this.pos_x - a.size_x;
			a.pos_y = this.pos_y + this.size_y / 2;
			a.direct = "Left";
		}
		else if (this.direct === "Right"){
			a.size_x = 16;
			a.size_y = 5;
			a.move_x = 1;
			a.pos_x = this.pos_x + a.size_x + this.size_x / 2;
			a.pos_y = this.pos_y + this.size_y/2;
			a.direct = "Right";

		}
		else if(this.direct === "Up"){
			a.size_x = 5;
			a.size_y = 16;
			a.move_y = -1;
			a.pos_x = this.pos_x + this.size_x / 3;
			a.pos_y = this.pos_y - a.size_y;
			a.direct = "Up";
		}
		else if(this.direct === "Down"){
			a.size_x = 5;
			a.size_y = 16;
			a.move_y = 1;
			a.pos_x = this.pos_x + this.size_x / 4;
			a.pos_y = this.pos_y + this.size_y/2 +  this.size_y;
			a.direct = "Down";
		}
		a.name = "arrow";
		gameManager.entities.push(a);
		if(!soundManager.mute)
			soundManager.play('./music/ArrowShoot.wav', {looping: false, volume: 0.5})
	},

	seePlayer: function(){
		let vecX = 0;
		let vecY = 0;
		if(this.direct === "Left" )
			vecX = -1;
		if(this.direct === "Right")
			vecX = 1;
		if(this.direct === "Up")
			vecY = -1;
		if(this.direct === "Down")
			vecY = 1;
		for(let i = 0;; i += 8){
			let ts = mapManager.getTilesetIdx(this.pos_x + vecX * i, this.pos_y + vecY * i);
			if(ts === null){
				this.sawPlayer = false;
				return;
			}
			var e = physicManager.entityAtXYView(this, this.pos_x + vecX * i, this.pos_y + vecY * i)
			if(e !== null){
				if (e.name === "player"){
					this.fire();
					this.move_y = 0;
					this.move_x = 0;
					//physicManager.distanceAtObject(e, this);
					physicManager.followObject(e, this);
					this.sawPlayer = true;
					return;
				}
				if(e.name === 'wall' || e.name === 'box'){
					this.sawPlayer = false;
					return;
				}
			}
		}
	},

	hit: function(){
		this.lifetime -= 100;
		if(!soundManager.mute)
			soundManager.play('./music/EnemyHit.wav', {looping: false, volume: 0.5})
		if(this.lifetime === 0)
			this.kill();
	}
})


var Arrow = Entity.extend({
	move_x:0, move_y:0,
	speed: 10,
	direct: "",
	draw: function(ctx){
		spriteManager.drawSprite(ctx, 'arrow', "arrow" + this.direct, this.pos_x, this.pos_y);
	},
	update:function(){
		if(physicManager.update(this) === "stop")
			this.kill();
	},
	onTouchEntity: function(obj){
		if(obj.name === 'player'){
			if(obj.fightOn && obj.counter > 1 && obj.counter < 5){
				physicManager.invertDirect(this);
				return;
			}
			else{
				obj.hit();
				this.kill();
			}
		}
		if(obj.name === 'soldier'){
			obj.hit();
			this.kill();
		}

		if(obj.name === 'box' || obj.name === 'coin1'){
			this.kill();
		}
		
	},

	kill: function(){
		gameManager.kill(this);
	}
})


var Potion = Entity.extend({
	draw:function(ctx){
		spriteManager.drawSprite(ctx,'potion', "potion", this.pos_x, this.pos_y);
	},
	update:function(){},
	kill:function(){
		gameManager.kill(this);
	}
})


var Coin = Entity.extend({
	isCollected: false,
	counter: 21,
	draw:function(ctx){
		if(this.counter === 30)
			this.counter = 21
		spriteManager.drawSprite(ctx,'coin', "Gold_" + this.counter, this.pos_x, this.pos_y);
		this.counter++;
	},
	update:function(){},
	kill:function(){
		isCollected = true;
		gameManager.kill(this);
	}
})


var Box = Entity.extend({
	speed: 10,
	draw: function(ctx){
		spriteManager.drawSprite(ctx, 'box', 'box', this.pos_x, this.pos_y);
	},
	update: function(){
		physicManager.update(this);
		this.move_x = 0;
		this.move_y = 0;
	},
	kill: function(){}
})


var Wall = Entity.extend({
	draw: function(ctx){},
	update: function(){},
	kill: function(){}
})


var EndPoint = Entity.extend({
	draw: function(ctx){},
	update: function(){},
	kill: function(){}
})

var PressPanel = Entity.extend({
	isPress: false,
	draw: function(ctx){},
	update: function(){
		if(physicManager.entityAtXY(this, this.pos_x, this.pos_y))
			this.isPress = true;
		else
			this.isPress = false;
	},
	kill: function(){}
})


var SecretDoor = Entity.extend({
	isOpen: false,
	draw: function(ctx){
		if(!this.isOpen)
			spriteManager.drawSprite(ctx, 'secretDoor', 'secretDoor', this.pos_x, this.pos_y);
	},
	update: function(){
	},
	kill: function(){}
})




