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

module.exports = {
	setup: setup,
	isSetup: isSetup,
	executeSQL: executeSQL,
	getDatabaseConnectionString: getDatabaseConnectionString
};