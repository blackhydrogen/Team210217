var session = require("express-session");
var postgreSqlStore = require('connect-pg-simple')(session);

var lfDatabase = require("./lfDatabase");
var lfHash = require("./lfHash");

var setupDone = false;

function setup(app) {
	if(!lfDatabase.isSetup()) {
		throw "Database (lfDatabas) needs to be setup before session can be setup!";
	}
	
	var sessionOptions = {
		secret: lfHash.getHashWithGlobalSalt("sessionSecret"),
		resave: false,
		saveUninitialized: false,
		store: new postgreSqlStore({ conString: lfDatabase.getDatabaseConnectionString() }),
		cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 } // 1 day
	};
	
	app.use(session(sessionOptions));
	
	setupDone = true;
}

function isSetup() {
	return setupDone;
}

module.exports = {
	setup: setup,
	isSetup: isSetup
};