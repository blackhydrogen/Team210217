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

// app.get("*", function(req, res, next) {
	// next();
// });

app.get("/test", function(req, res) {
	console.log(req.session);
	// executeSQL("SELECT * from test1;", [], function(status) {
		// res.send(JSON.stringify(status)).end();
	// });
	res.end("OK");
});

app.post("/login", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	if(requestObject.username == "test@gmail.com" && requestObject.password == "pwd") {
		responseObject.userType = "entrepreneur";
		sendResponse(res, responseObject);
	}
	else {
		sendError(res, "Invalid username/password.");
	}
});

app.post("/getProjectDetails", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	if(requestObject.title == "Test Project 1" && requestObject.email == "test@gmail.com") {
		responseObject.title = "Test Project 1";
		responseObject.description = "Test Project 1 description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
		responseObject.goal = 10000.0;
		responseObject.raised = 150.26;
		responseObject.start = new Date("26 Feb 2016 23:59:00 GMT+0800").getTime();
		responseObject.end = new Date("15 Mar 2016 10:00:00 GMT+0800").getTime();
		responseObject.tags = "test, project, testproject";
		responseObject.email = "test@gmail.com";
		responseObject.name = "Atul NK";
		sendResponse(res, responseObject);
	}
	else {
		sendError(res, "Invalid project.");
	}
});

app.post("/updateProjectDetails", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	if(requestObject.identifyingTitle == "Test Project 1"
		&& requestObject.email == "test@gmail.com") {
			
		if(requestObject.title
		&& requestObject.description
		&& requestObject.goal
		&& requestObject.start
		&& requestObject.end
		&& requestObject.tags) {
			sendResponse(res, responseObject);
		}
		else {
			sendError(res, "Some field missing for empty.")
		}
	}
	else {
		sendError(res, "Invalid project.");
	}
});

app.post("/listProjects", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	responseObject.currentPage = 1;
	responseObject.totalPage = 1;
	responseObject.projectsPerPage = 10;
	responseObject.projects = [
		{
			title: "Test Project 1",
			description: "Test Project 1 description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			goal: 10000.0,
			raised: 150.26,
			start: new Date("26 Feb 2016 23:59:00 GMT+0800").getTime(),
			end: new Date("15 Mar 2016 10:00:00 GMT+0800").getTime(),
			tags: "test, project, testproject",
			email: "test@gmail.com",
			name: "Atul NK"
		}, 
		{
			title: "Test Project 1 Again",
			description: "Test Project 1 Again description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			goal: 10001.0,
			raised: 151.26,
			start: new Date("27 Feb 2016 23:59:00 GMT+0800").getTime(),
			end: new Date("16 Mar 2016 10:00:00 GMT+0800").getTime(),
			tags: "test, project, testproject, again",
			email: "test2@gmail.com",
			name: "Ivan Tj"
		}
	];
	
	sendResponse(res, responseObject);
});

app.post("/listMyProjects", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	responseObject.currentPage = 1;
	responseObject.totalPage = 1;
	responseObject.projectsPerPage = 10;
	responseObject.projects = [
		{
			title: "Test Project 1",
			description: "Test Project 1 description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			goal: 10000.0,
			raised: 150.26,
			start: new Date("26 Feb 2016 23:59:00 GMT+0800").getTime(),
			end: new Date("15 Mar 2016 10:00:00 GMT+0800").getTime(),
			tags: "test, project, testproject",
			email: "test@gmail.com",
			name: "Atul NK"
		}, 
		{
			title: "Test Project 1 Again",
			description: "Test Project 1 Again description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			goal: 10001.0,
			raised: 151.26,
			start: new Date("27 Feb 2016 23:59:00 GMT+0800").getTime(),
			end: new Date("16 Mar 2016 10:00:00 GMT+0800").getTime(),
			tags: "test, project, testproject, again",
			email: "test2@gmail.com",
			name: "Ivan Tj"
		}
	];
	
	sendResponse(res, responseObject);
});

app.use(express.static(__dirname + "/public_html"));

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});

function requestObjectIsValid(res, requestObject) {
	if(!requestObject instanceof Object) {
		sendError(res, "Invalid request.");
		return false;
	}
	return true;
}

function sendResponse(res, responseObject) {
	responseObject.success = true;
	res.end(JSON.stringify(responseObject));
}

function sendError(res, errorMessage) {
	res.end(JSON.stringify({
		success: false,
		errorMessage: errorMessage
	}));
}

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