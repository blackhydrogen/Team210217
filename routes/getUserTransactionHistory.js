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
	
	var email = req.session.email;
	
	if(req.session.type == "admin") {
		email = requestObject.email;
	}
	else if(req.session.type == "patron") {
		//do nothing
	}
	else {
		return lfTools.sendError(res, "Invalid user.");
	}
	
	lfDatabase.executeSQL(
		"SELECT id, title, entrepreneurEmail AS email, time, amount FROM transaction WHERE patronEmail=$1",
		[email],
		function(status) {	
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.transactions = status.result.rows;
			
			for(var i = 0; i < responseObject.transactions.length; i++) {
				responseObject.transactions[i].time = responseObject.transactions[i].time.getTime();
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};