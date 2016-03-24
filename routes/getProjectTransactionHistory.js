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
	
	if(!req.session.type) {
		return lfTools.sendError(res, "You need to be logged in.");
	}
	
	var email = requestObject.email;
	var title = requestObject.title;
	
	lfDatabase.executeSQL(
		"SELECT id, patronEmail AS email, time, amount FROM transaction WHERE entrepreneurEmail=$1 AND title=$2",
		[email, title],
		function(status) {	
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.transactions = status.result.rows;
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};