// Algorithm: SHA1
// SALT = fundmenowthankyouverymuchpleasedonothackhahahahahahahaha
// Format = stringSALT
// E.g. Hashing "hello" will be hashing "hellofundmenowthankyouverymuchpleasedonothackhahahahahahahaha"

var http = require("http");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var pg = require("pg");

var postgreSqlStore = require('connect-pg-simple')(session);

var app = express();
var server = http.Server(app);
var httpPort = 80;

// postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
var dbConnectionString = "postgres://letsfund:gofundyourself@localhost:5432/letsfund";

var sessionOptions = {
	secret: "6fc3119ef5e082356d613012d756dad102beb5e5", //sessionSecret+SALT
	resave: true,
	saveUninitialized: false,
	store: new postgreSqlStore({ conString: "postgres://letsfund:gofundyourself@localhost:5432/letsfund" })
};
app.use(session(sessionOptions));

// parse application/json
app.use(bodyParser.json());

app.get("/test", function(req, res) {
	console.log(req.session);
	// executeSQL("SELECT * from test1;", [], function(status) {
		// res.send(JSON.stringify(status)).end();
	// });
	res.end("OK");
});

app.use(express.static(__dirname + "/public_html"));

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});
   
function executeSQL(command, data, callback) {
	var returnObject = {
		success: false,
		errorMessage: undefined,
		result: undefined
	};
	
	// Get a Postgres client from the connection pool
	pg.connect(dbConnectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
			done();
			returnObject.errorMessage = JSON.stringify(err);
			callback(returnObject);
			return;
        }

        // SQL Query > Insert Data
        client.query(command, data, function(err, result) {
			done();
			
			if(err) {
				returnObject.errorMessage = JSON.stringify(err);
				callback(returnObject);
				return;
			}
			
			returnObject.result = result;
			returnObject.success = true;
			
			callback(returnObject);
		});

        // SQL Query > Select Data
        //var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        // query.on('row', function(row) {
            // results.push(row);
        // });

        // After all data is returned, close connection and return results
        // query.on('end', function() {
            // done();
            // return res.json(results);
        // });
    });
}