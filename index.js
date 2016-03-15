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

// app.get("*", function(req, res, next) {
	// next();
// });

// app.get("/test", function(req, res) {
	// console.log(req.session);
	// res.end("OK");
// });

app.use(express.static(__dirname + "/public_html"));

app.get("*", function(req, res) {
	res.status(404)
		.sendFile(__dirname + "/public_html/404.html");
});

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});