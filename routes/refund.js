var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

var transactionId;
var time;
var amount;
var entrepreneurEmail;

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	if(req.session.type != "entrepreneur" && req.session.type != "admin") {
		return lfTools.sendError(res, "Invalid user.");
	}
	
	transactionId = requestObject.id;
	time = new Date();
	
	lfDatabase.executeSQL(
		"SELECT entrepreneurEmail, amount FROM transaction WHERE id=$1",
		[transactionId],
		handleGetTransactionDetails
	);
}

function handleGetTransactionDetails(status) {
	if(!status.success)
		return lfTools.sendError(res, "An error occured when recording the refund.");
	else if(status.result.rows.length != 1)
		return lfTools.sendError(res, "Unable to find corresponding transaction! (Invalid transaction ID.)");
	else if(req.session.type == "entrepreneur" && req.session.email != status.result.rows[0].entrepreneurEmail)
		return lfTools.sendError(res, "An entrepreneur can't refund for project he doesn't own!");
	
	amount = -status.result.rows[0].amount;
	
	lfDatabase.executeSQL(
		"INSERT INTO refund VALUES($1, $2, $3)",
		[amount, time, transactionId],
		function(status) {
			if(!status.success)
				return lfTools.sendError(res, "An error occured when recording the refund; it is likely the transaction has been refund at an earlier time (but it did not just occur).");
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};