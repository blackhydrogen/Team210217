var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var server = http.Server(app);
var httpPort = 80;

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public_html"));

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});
