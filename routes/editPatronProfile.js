var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

var email;
var oldPassword;
var newPassword;
var name;

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	email = req.session.email;
	
	if(req.session.type == "patron") {
		//do nothing
	}
	else if(req.session.type == "admin") {
		email = requestObject.email;
	}
	else {
		return lfTools.sendError(res, "Invalid user.");
	}
	
	oldPassword = requestObject.oldPassword || "";
	newPassword = requestObject.newPassword || "";
	name = requestObject.name || "";
	
	var transaction = [	
		"UPDATE patron SET (name) = ($1) WHERE email=$2",
		[name, email]
	];
	
	if(newPassword != "") {
		getPasswordSaltAndHash(function(salt, hash) {
			if(req.session.type == "patron") {
				var oldPrehash = email+oldPassword+salt;
				var oldHash = lfHash.getHash(oldPrehash);
				if(oldHash != hash) {
					return lfTools.sendError(res, "Invalid old password.");
				}
			}
			
			var newPrehash = email+newPassword+salt;
			var newHash = lfHash.getHash(newPrehash);
			
			transaction.push("UPDATE account SET (hash) = ($1) WHERE email=$2");
			transaction.push([newHash, email]);
			
			makeChanges(transaction);
		});
	}
	else {
		makeChanges(transaction);
	}
}

function getPasswordSaltAndHash(callback) {	
	lfDatabase.executeSQL(
		"SELECT salt, hash FROM account WHERE email=$1",
		[email],
		function(status) {		
			if(!status.success || status.result.rows.length == 0) {
				return lfTools.sendError(res, "Invalid account.");
			}
			
			callback(
				status.result.rows[0].salt,
				status.result.rows[0].hash
			);
		}
	);
}

function makeChanges(transaction) {
	lfDatabase.executeTransaction(
		transaction,
		function(status) {
			if(!status.success) {
				return lfTools.sendError(res, "An error occured when updating the account details.");
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	)
}

module.exports = {
	getHandler: function() { return handler; }
};