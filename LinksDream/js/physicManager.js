var physicManager = {
	update: function(obj){
		if(obj.move_x === 0 && obj.move_y === 0)
			return "stop";
		var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
		var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

		var ts = mapManager.getTilesetIdx(newX + obj.size_x/2, newY + obj.size_y / 2);
		if(ts === null)
		 return "stop";
		var e = this.entityAtXY(obj, newX, newY);
		if(e !== null && e.name === "wall") return "stop";
		if(e !== null && obj.onTouchEntity)
			obj.onTouchEntity(e);
		if(obj.onTouchMap)
			obj.onTouchMap(ts)

		if( e === null || e.name.match(/pressPanel[\d*]/)
			|| (e.name.match(/secretDoor[\d*]/) && e.isOpen)){
			obj.pos_x = newX;
			obj.pos_y = newY;
		} else
			return "break";

		let direct = this.calculateDirection(obj.move_x, obj.move_y);
		return direct; 
	},

	entityAtXY: function(obj, x, y){
		for(var i = 0; i < gameManager.entities.length; i++){
			var e = gameManager.entities[i];
			if(e.name !== obj.name){
				if(x + obj.size_x < e.pos_x ||
					y + obj.size_y < e.pos_y ||
					x > e.pos_x + e.size_x ||
					y > e.pos_y + e.size_y)
					continue;
				return e;
			}
		}
		return null;
	},

	entityAtXYView: function(obj, x, y){
		for(var i = 0; i < gameManager.entities.length; i++){
			var e = gameManager.entities[i];
			if(e.name !== obj.name){
				if(x + obj.size_x < e.pos_x ||
					y + obj.size_y < e.pos_y ||
					x > e.pos_x + e.size_x ||
					y > e.pos_y + e.size_y)
					continue;
				return e;
			}
		}
		return null;
	},

	calculateDirection: function(x, y){
		if(x === 1)
			return "Right";
		if(x === -1)
			return "Left";
		if(y === 1)
			return "Down";
		if(y === -1)
			return "Up";
	},


	moveAroundSquare: function(obj, size = 7){
		if(obj.moveCounter == size*4) obj.moveCounter = 0;
		if(obj.moveCounter >= size*3){
			obj.move_y = 0;
			obj.move_x = 1;
		}
		else if(obj.moveCounter >= size*2){
			obj.move_y = 1;
			obj.move_x = 0;
		}
		else if(obj.moveCounter >= size*1){
			obj.move_y = 0;
			obj.move_x = -1;
		}
		else if(obj.moveCounter >= 0){
			obj.move_y = -1;
			obj.move_x = 0;
		}
		obj.moveCounter++;
	},


	followObject: function(obj1, obj2, dist = 10){
		if(obj1.move_x){
			obj2.move_x = obj1.move_x;
			obj2.followCounter = 5;
			obj2.saveDirect = obj1.direct;
		}
		else if(obj1.move_y){
			obj2.move_y = obj1.move_y;
			obj2.followCounter = 5;
			obj2.saveDirect = obj1.direct;
		}

	},


	distanceAtObject: function(obj1, obj2, dist = 70){
		if(Math.abs(obj1.pos_x - obj2.pos_x) < dist && Math.abs(obj1.pos_y - obj2.pos_y) < dist){
			if(obj1.pos_x > obj2.pos_x)
				obj2.move_x = -1;
			else
				obj2.move_x = 1;
			if(obj1.pos_y > obj2.pos_y)
				obj2.move_y = -1;
			else
				obj2.move_y = 1;
			obj2.moveCounter = 5;
		}
	},


	invertDirect: function(obj){
		switch(obj.direct){
			case 'Left':
				obj.move_x = 1;
				obj.direct = 'Right';
				break;
			case 'Right':
				obj.move_x = -1;
				obj.direct = 'Left';
				break;
			case 'Up':
				obj.move_y = 1;
				obj.direct = 'Down';
				break;
			case 'Down':
				obj.move_y = -1;
				obj.direct = "Up";
				break;
		}
	},

	moveBox(obj, box){
		if(!obj.move_x && !obj.move_y) return;
		switch(obj.direct){
			case 'Left':
				box.move_x = -1;
				break;
			case 'Right':
				box.move_x = 1;
				break;
			case 'Up':
				box.move_y = -1;
				break;
			case 'Down':
				box.move_y = 1;
				break;
			}

	},

	connectButtonToDoor1(){
		let button;
		let door;
		for(let i = 0; i < gameManager.entities.length; i++){
			if(gameManager.entities[i].name === 'pressPanel1')
				button = gameManager.entities[i];
			if(gameManager.entities[i].name === 'secretDoor1')
				door = gameManager.entities[i]; 
		}
		if(!button) return;
		if(button.isPress){
			if(!door.isOpen && !soundManager.mute)
				soundManager.play('./music/Open.wav', {looping: false, volume: 0.5})
			door.isOpen = true;
		}
		else{
			if(door.isOpen && !soundManager.mute)
				soundManager.play('./music/Close.wav', {looping: false, volume: 0.5})
			door.isOpen = false;
		}
	},

	connectButtonToDoor12(){
		let button1;
		let button2;
		let door;
		for(let i = 0; i < gameManager.entities.length; i++){
			if(gameManager.entities[i].name === 'pressPanel1')
				button1 = gameManager.entities[i];
			if(gameManager.entities[i].name === 'pressPanel2')
				button2 = gameManager.entities[i];
			if(gameManager.entities[i].name === 'secretDoor12')
				door = gameManager.entities[i]; 
		}
		if(!button1) return;
		if(button1.isPress && button2.isPress){
			if(!door.isOpen && !soundManager.mute)
				soundManager.play('./music/Open.wav', {looping: false, volume: 0.5})
			door.isOpen = true;
		}
		else{
			if(door.isOpen && !soundManager.mute)
				soundManager.play('./music/Close.wav', {looping: false, volume: 0.5})
			door.isOpen = false;
		}
	}


};