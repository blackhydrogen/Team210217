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
		`(
			SELECT id, title, entrepreneurEmail AS email, time, amount, TRUE AS refundable
			FROM transaction
			WHERE patronEmail=$1
			AND id NOT IN (
				SELECT transactionId FROM refund
			)
		)
		UNION
		(
			SELECT id, title, entrepreneurEmail AS email, time, amount, FALSE AS refundable
			FROM transaction
			WHERE patronEmail=$1
			AND id IN (
				SELECT transactionId FROM refund
			)
		)
		ORDER BY time`,
		[email],
		function(status) {	
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.transactions = [];
			
			for(var i = 0; i < status.result.rows.length; i++) {
				status.result.rows[i].time = status.result.rows[i].time.getTime();
				status.result.rows[i].amount = parseFloat(status.result.rows[i].amount);
				status.result.rows[i].isRefundable = status.result.rows[i].refundable;
				status.result.rows[i].refundable = undefined;
				
				responseObject.transactions.push(status.result.rows[i]);
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};