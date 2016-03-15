var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var requestObject;
var responseObject = {};

var email;
var password;

function handler(req, res) {
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	email = requestObject.username;
	password = requestObject.password;
	
	lfDatabase.executeSQL(
		"SELECT salt FROM account WHERE email=$1",
		[email],
		checkHash
	);
}

function checkHash(status) {
	if(status.result.rowCount != 1) {
		lfTools.sendError(res, "Invalid username/password.");
		return;
	}
	
	var salt = status.result.rows[0].salt;
	var prehash = email+password+salt;
	var hash = lfHash.getHashWithoutSalt(prehash);
			
	executeSQL(
		"SELECT type FROM account WHERE email=$1 AND hash=$2",
		[email, hash],
		function(status) {
			if(status.result.rowCount != 1) {
				lfTools.sendError(res, "Invalid username/password.");
				return;
			}
				
			responseObject.userType = status.result.rows[0].type;
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};