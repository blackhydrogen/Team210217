var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");

var lfDatabase = require("./lfDatabase");
var lfSession = require("./lfSession");
var lfRoutes = require("./lfRoutes");

var app = express();
var server = http.Server(app);
var httpPort = 80;

app.use(bodyParser.json()); // parse application/json

lfDatabase.setup("postgres://letsfund:gofundyourself@localhost:5432/letsfund");
lfSession.setup(app);
lfRoutes.setup(app);

app.get("/secure/*", function(req, res, next) {
	if(req.session.type)
		next();
	else {
		res.redirect("/account_page/login.html");
	}
});

// app.get("/test", function(req, res) {
	// console.log("HI1");
	// lfDatabase.executeTransaction([
		// "SELECT * FROM account WHERE email=$1", ["ian@gmail.com"],
		// "SELECT * FROM account WHERE hash=$1", ["1234567890123456789012345678901234567890"],
		// "SELECT * FROM notablehahahahahaha", []
	// ], function(cb) {
		// console.log("HI2");
		// console.log(cb);
		// console.log("HI3");
	// });
	// res.send("200 ok").end();
// });

app.use(express.static(__dirname + "/public_html"));

app.get("*", function(req, res) {
	res.status(404)
		.sendFile(__dirname + "/public_html/404.html");
});

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});