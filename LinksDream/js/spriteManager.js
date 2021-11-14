var spriteManager = {
	images: new Map(),
	sprites: new Map(),
	imgLoaded: false,
	jsonLoaded: false,


	loadAtlas(spriteName, atlasJson, atlasImg){
		var request = new XMLHttpRequest();
		request.onreadystatechange = function(){
			if(request.readyState === 4 && request.status === 200){
				spriteManager.parseAtlas(spriteName, request.responseText);
			}
		};
		request.open("GET", atlasJson, true);
		request.send();
		this.loadImg(spriteName, atlasImg);
	},


	loadImg(spriteName, imgName){
		let image = new Image()
		image.onload = function(){
			spriteManager.imgLoaded = true;
			spriteManager.images.set(spriteName, image);
		}
		image.src = imgName;
	},


	parseAtlas(spriteName, atlasJSON){
		var atlas = JSON.parse(atlasJSON);
		let sprite = new Array();
		for(name in atlas.frames){
			var frame = atlas.frames[name].frame;
			sprite.push({name: name, x:frame.x, y:frame.y, w:frame.w, h:frame.h});
		}
		this.sprites.set(spriteName, sprite)
		this.jsonLoaded = true;
	},


	drawSprite(ctx, spriteName, name, x, y){
		if(!this.imgLoaded || !this.jsonLoaded){
			setTimeout(function() {spriteManager.drawSprite(ctx, name, x, y);}, 100);
		} else {
			var sprite = this.getSprite(spriteName, name);
			if(!mapManager.isVisible(x, y, sprite.w, sprite.h))
				return;
			x -= mapManager.view.x;
			y -= mapManager.view.y;
			ctx.drawImage(this.images.get(spriteName), sprite.x, sprite.y, sprite.w, sprite.h,
			 x, y, sprite.w, sprite.h)
		}
	},


	getSprite(spriteName, name){
		for(var i = 0; i < this.sprites.get(spriteName).length; i++){
			var s = this.sprites.get(spriteName)[i];
			if (s.name === name)
				return s;
		}
		return null;
	}

}


//var spriteManagerPlayer = Object.create(spriteManager);





