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
		`SELECT t.id, t.title, t.entrepreneurEmail AS email, r.time, r.amount
		FROM transaction t, refund r
		WHERE t.patronEmail=$1
		AND t.id = r.transactionId`,
		[email],
		function(status) {	
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.refunds = [];
			
			for(var i = 0; i < status.result.rows.length; i++) {
				status.result.rows[i].time = status.result.rows[i].time.getTime();
				status.result.rows[i].amount = -parseFloat(status.result.rows[i].amount);
				responseObject.refunds.push(status.result.rows[i]);
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};