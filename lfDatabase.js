var pg = require("pg");

// postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
var dbConnectionString = "";

function setup(databaseConnectionString) {
	dbConnectionString = databaseConnectionString;
}

function isSetup() {
	return dbConnectionString != "";
}

function getDatabaseConnectionString() {
	return dbConnectionString;
}

function executeSQL(command, data, callback) {
	var returnObject = {
		success: false,
		errorMessage: undefined,
		result: undefined
	};
	
	if(!isSetup()) {
		returnObject.errorMessage = "Database not setup.";
		callback(returnObject);
		return;
	}
	
	// Get a Postgres client from the connection pool
	pg.connect(dbConnectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
			returnObject.errorMessage = err;
			callback(returnObject);
			return;
        }

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
    });
}

function executeTransaction(commands, callback) {
	var returnObject = {
		success: false,
		errorMessage: [],
		result: []
	};
	
	if(!isSetup()) {
		returnObject.errorMessage = "Database not setup.";
		callback(returnObject);
		return;
	}
	
	var rollback = function(client, done) {
		client.query("ROLLBACK", function(err) {
			done(err);
			
			if(err) {	
				returnObject.errorMessage.push(err);
			}
			
			callback(returnObject);
		});
	};
	
	var commandsIndex = 0;
	
	pg.connect(dbConnectionString, function(err, client, done) {
		if(err) {
			returnObject.errorMessage = err;
			callback(returnObject);
			return;
        }
		
		var queryDoneHandler = function(err, result) {
			if(err) {
				returnObject.errorMessage.push(err);
				rollback(client, done);
				return;
			}
			
			returnObject.result.push(result);
			
			if(commandsIndex >= commands.length) {
				client.query("COMMIT", function(err, result) {
					done();
					if(err) {
						returnObject.errorMessage.push(err);
						callback(returnObject);
						return;
					}
					
					returnObject.result.shift(); // Remove the BEGIN results
					
					returnObject.success = true;
					callback(returnObject);
				});
				return;
			}
			
			process.nextTick(function() {
				client.query(commands[commandsIndex], commands[commandsIndex + 1], queryDoneHandler);
				commandsIndex += 2;
			});
		};
		
		client.query("BEGIN", queryDoneHandler);
	});
}

module.exports = {
	setup: setup,
	isSetup: isSetup,
	executeSQL: executeSQL,
	executeTransaction: executeTransaction,
	getDatabaseConnectionString: getDatabaseConnectionString
};