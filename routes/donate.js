var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	var patronEmail = req.session.email;
	
	if(req.session.type == "patron") {
		//do nothing
	}
	else if(req.session.type == "admin") {
		patronEmail = requestObject.patronEmail;
	}
	else {
		return lfTools.sendError(res, "Invalid user.");
	}
	
	var email = requestObject.email; //proj email
	var title = requestObject.title; //proj title
	var amount = requestObject.amount;
	var time = new Date();
	
	lfDatabase.executeSQL(
		"INSERT INTO transaction VALUES(DEFAULT, $1, $2, $3, $4, $5)",
		[patronEmail, email, title, amount, time],
		function(status) {
			if(!status.success) {
				console.log(status);
				return lfTools.sendError(res, "An error occured when recording the transaction.");
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}


module.exports = {
	getHandler: function() { return handler; }
};