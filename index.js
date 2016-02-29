// Algorithm: SHA1
// SALT = fundmenowthankyouverymuchpleasedonothackhahahahahahahaha
// Format = stringSALT
// E.g. Hashing "hello" will be hashing "hellofundmenowthankyouverymuchpleasedonothackhahahahahahahaha"

var http = require("http");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var pg = require("pg");
var sha1 = require("sha1");

var postgreSqlStore = require('connect-pg-simple')(session);

var app = express();
var server = http.Server(app);
var httpPort = 80;

// postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
var dbConnectionString = "postgres://letsfund:gofundyourself@localhost:5432/letsfund";

var sessionOptions = {
	secret: "6fc3119ef5e082356d613012d756dad102beb5e5", //"sessionSecret" + SALT
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
	
	// console.log(req.session);
	res.end("OK");
});

app.post("/register", function(req, res) {
	// var email = "test@gmail.com";
	// var password = "pwd";
	
	// var salt = generateRandomAsciiString(64);
	// var prehash = email+password+salt;
	// var hash = sha1(prehash);
	
	// executeSQL(
		// "INSERT INTO account VALUES($1, $2, $3, $4)",
		// [email, salt, hash, "entrepreneur"],
		// function(status) {
			// console.log(status);
		// }
	// );
});

app.post("/login", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	var email = requestObject.username;
	var password = requestObject.password;
	
	function checkHash(status) {
		if(status.result.rowCount != 1) {
			sendError(res, "Invalid username/password.");
			return;
		}
		
		var salt = status.result.rows[0].salt;
		var prehash = email+password+salt;
		var hash = sha1(prehash);
				
		executeSQL(
			"SELECT type FROM account WHERE email=$1 AND hash=$2",
			[email, hash],
			function(status) {
				if(status.result.rowCount != 1) {
					sendError(res, "Invalid username/password.");
					return;
				}
					
				responseObject.userType = status.result.rows[0].type;
				sendResponse(res, responseObject);
			}
		);
	}
	
	executeSQL(
		"SELECT salt FROM account WHERE email=$1",
		[email],
		checkHash
	);
});

app.post("/getProjectDetails", function(req, res) {
	var requestObject = req.body;
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	getProject(requestObject, function(responseObject) {
		sendResponse(res, responseObject);
	});
});

app.post("/updateProjectDetails", function(req, res) {
	var requestObject = req.body;
	var responseObject = {};
	
	if(!requestObjectIsValid(requestObject))
		return;
	
	if(requestObject.title
		&& requestObject.description
		&& requestObject.goal
		&& requestObject.start
		&& requestObject.end) {
		
		var collectCount = 1;
		function collect() {
			collectCount--;
			if(collectCount == 0)
				sendResponse(res, responseObject);
		}
		
		function insertTags() {
			if(requestObject.tags == "") {
				collect();
				return;
			}
			
			var tags = requestObject.tags.split(/\s*,\s*/);
			collectCount = tags.length;
			
			for(var i = 0; i < tags.length; i++) {
				executeSQL(
					"INSERT INTO tag VALUES($1, $2, $3);",
					[
						tags[i],
						requestObject.title,
						requestObject.email
					],
					collect
				);
			}
		}
		
		function updateProject() {			
			executeSQL(
				`UPDATE project SET
				 (title, email, goal, start_time, end_time, description)
				 = ($1, $2, $3, $4, $5, $6)
				 WHERE title=$7 AND email=$8;`,
				[
					requestObject.title,
					requestObject.email,
					requestObject.goal,
					new Date(requestObject.start),
					new Date(requestObject.end),
					requestObject.description,
					requestObject.identifyingTitle,
					requestObject.email
				],
				function(status) {
					//TODO check if ok
					insertTags();
				}
			);
		}
		
		executeSQL(
			"DELETE FROM tag WHERE title=$1 AND email=$2;",
			[requestObject.identifyingTitle, requestObject.email],
			updateProject
		);
	}
	else {
		sendError(res, "Some field empty!")
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
	
	var session = {
		email: "test@gmail.com" //TODO get from session
	};
	
	responseObject.currentPage = 1;
	responseObject.totalPage = 1;
	responseObject.projectsPerPage = 10;
	responseObject.projects = [];
	
	var collectCount = 0;
	function collect() {
		collectCount--;
		if(collectCount == 0) {
			sendResponse(res, responseObject);
		}
	}
	
	executeSQL(
		"SELECT title FROM project WHERE email=$1;",
		[session.email], 
		function(status) {
			collectCount = status.result.rows.length;
			
			for(var i = 0; i < status.result.rows.length; i++) {
				getProject({
					title: status.result.rows[i].title,
					email: session.email
				}, function(obj) {
					responseObject.projects.push(obj);
					collect();
				});
			}
		}
	);
});

app.use(express.static(__dirname + "/public_html"));

server.listen(httpPort, function() {
	console.log("Listening on *:" + httpPort);
});

// Generates a random string using all printable characters of
// ASCII (32_decimal " " to 126_decimal "~")
function generateRandomAsciiString(length) {
	var str = "";
	for(var i = 0; i < length; i++) {
		str += String.fromCharCode(
			Math.floor(Math.random() * 95) + 32
		);
	}
	return str;
}

function getProject(requestObject, callback) {
	var responseObject = {};
	
	responseObject.title = requestObject.title;
	responseObject.email = requestObject.email;
	
	responseObject.raised = 0; //TODO - temp value.
	
	var collectCount = 3;
	function collect() {
		collectCount--;
		if(collectCount == 0)
			callback(responseObject);
	}
	
	executeSQL(
		"SELECT * FROM project WHERE email=$1 AND title=$2",
		[requestObject.email, requestObject.title],
		function(status) {
			if(status.result.rowCount != 1) {
				sendError(res, "Project not found.");
				return;
			}
			
			var sqlRow = status.result.rows[0];
			
			responseObject.description = sqlRow.description;
			responseObject.goal = sqlRow.goal;
			responseObject.start = sqlRow.start_time;
			responseObject.end = sqlRow.end_time;
			
			collect();
		}
	);
	
	executeSQL(
		"SELECT * FROM tag WHERE email=$1 AND title=$2",
		[requestObject.email, requestObject.title],
		function(status) {
			responseObject.tags = "";
			
			if(status.result.rows.length >= 1) {
				responseObject.tags = status.result.rows[0].name;
			}
			
			for(var i = 1; i < status.result.rows.length; i++) {	
				responseObject.tags += ", " + status.result.rows[i].name;
			}
			
			collect();
		}
	);
	
	executeSQL(
		"SELECT name FROM entrepreneur WHERE email=$1",
		[requestObject.email],
		function(status) {
			responseObject.name = status.result.rows[0].name;
			collect();
		}
	);
}

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
			returnObject.errorMessage = err;
			callback(returnObject);
			return;
        }

        // SQL Query > Insert Data
        client.query(command, data, function(err, result) {
			done();
			
			if(err) {
				returnObject.errorMessage = err;
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