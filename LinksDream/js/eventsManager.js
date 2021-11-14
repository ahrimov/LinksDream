var eventsManager = {
	bind: [],
	action: [],
	setup: function (canvas){
		this.bind[87] = 'up';
		this.bind[65] = 'left';
		this.bind[83] = 'down';
		this.bind[68] = 'right';
		this.bind[32] = 'attack'

		document.body.addEventListener("keydown", this.onKeyDown);
		document.body.addEventListener("keyup", this.onKeyUp);
	},
	onKeyDown: function(event){
		if(event.keyCode === 32)
			event.preventDefault();
		var action = eventsManager.bind[event.keyCode];
		if(action)
			eventsManager.action[action] = true;
	},

	onKeyUp: function(event){
		if(event.keyCode === 32)
			event.preventDefault();
		var action = eventsManager.bind[event.keyCode]
		if(action)
			eventsManager.action[action] = false;
	}
};