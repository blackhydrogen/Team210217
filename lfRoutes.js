var fs = require("fs");

var setupDone = false;

function setup(app) {
	var routes = fs.readdirSync(__dirname + "/routes");
	for(var i = 0; i < routes.length; i++) {
		var currentRoute = require("./routes/" + routes[i]);
		var currentRouteName = routes[i].substring(0, routes[i].indexOf(".js"));
		
		app.post("/" + currentRouteName, currentRoute.getHandler());
	}
	
	setupDone = true;
}

function isSetup() {
	return setupDone;
}

module.exports = {
	setup: setup,
	isSetup: isSetup
};