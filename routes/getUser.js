var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

var email;

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	if(!req.session.email) {
		lfTools.sendError(res, "Login required.");
			return;
	}
	
	email = requestObject.email || req.session.email;
	responseObject.username = email;
	
	lfDatabase.executeSQL(
		"SELECT type FROM account WHERE email=$1",
		[email],
		function(status) {		
			if(!status.success || status.result.rows[0].type == "admin") {
				return lfTools.sendError(res, "Invalid user.");
			}
			
			responseObject.accountType = status.result.rows[0].type;
			
			if(responseObject.accountType == "patron")
				getPatronDetails();
			else if(responseObject.accountType == "entrepreneur")
				getEntrepreneurDetails();
			else {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
		}
	);
}

function getPatronDetails() {
	lfDatabase.executeSQL(
		"SELECT name FROM patron WHERE email=$1",
		[email],
		function(status) {		
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.name = status.result.rows[0].name;
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

function getEntrepreneurDetails() {
	lfDatabase.executeSQL(
		"SELECT name, website, address, description FROM entrepreneur WHERE email=$1",
		[email],
		function(status) {		
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.name = status.result.rows[0].name;
			responseObject.website = status.result.rows[0].website;
			responseObject.address = status.result.rows[0].address;
			responseObject.description = status.result.rows[0].description;
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};