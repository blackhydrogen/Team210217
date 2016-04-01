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
		`(
			SELECT id, patronEmail AS email, time, amount, TRUE AS refundable
			FROM transaction
			WHERE entrepreneurEmail=$1
			AND title=$2
			AND id NOT IN (
				SELECT transactionId FROM refund
			)
		)
		UNION
		(
			SELECT id, patronEmail AS email, time, amount, FALSE AS refundable
			FROM transaction
			WHERE entrepreneurEmail=$1
			AND title=$2
			AND id IN (
				SELECT transactionId FROM refund
			)
		)
		ORDER BY time`,
		[email, title],
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