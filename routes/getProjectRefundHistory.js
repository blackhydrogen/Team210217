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
	
	var email = requestObject.email;
	
	if(req.session.type == "admin") {
		//ok, do nothing
	}
	else if(req.session.type == "entrepreneur") {
		if(email != req.session.email)
			return lfTools.sendError(res, "Invalid account! You're not the owner.")
	}
	else {
		return lfTools.sendError(res, "Invalid account!");
	}
	
	var title = requestObject.title;
	
	lfDatabase.executeSQL(
		`SELECT t.id, t.patronEmail AS email, r.time, r.amount
		FROM transaction t, refund r
		WHERE t.entrepreneurEmail=$1
		AND t.title=$2
		AND t.id = r.transactionId
		ORDER BY r.time`,
		[email, title],
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