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
	
	lfDatabase.executeTransaction([
			`SELECT id, patronEmail AS email, time, amount
			FROM transaction
			WHERE entrepreneurEmail=$1
			AND title=$2
			AND id NOT IN (
				SELECT transactionId FROM refund
			)`,
			[email, title],
			`SELECT id, patronEmail AS email, time, amount
			FROM transaction
			WHERE entrepreneurEmail=$1
			AND title=$2
			AND id IN (
				SELECT transactionId FROM refund
			)`,
			[email, title]
		],
		function(status) {	
			if(!status.success) {
				return lfTools.sendError(res, "Unexpected error occured.");
			}
			
			responseObject.transactions = [];
			
			for(var i = 0; i < status.result[0].rows.length; i++) {
				status.result[0].rows[i].time = status.result[0].rows[i].time.getTime();
				status.result[0].rows[i].amount = parseFloat(status.result[0].rows[i].amount);
				status.result[0].rows[i].isRefundable = true;
				responseObject.transactions.push(status.result[0].rows[i]);
			}
			
			for(var i = 0; i < status.result[1].rows.length; i++) {
				status.result[1].rows[i].time = status.result[1].rows[i].time.getTime();
				status.result[1].rows[i].amount = parseFloat(status.result[1].rows[i].amount);
				status.result[1].rows[i].isRefundable = false;
				responseObject.transactions.push(status.result[1].rows[i]);
			}
			
			lfTools.sendResponse(res, responseObject);
		}
	);
}

module.exports = {
	getHandler: function() { return handler; }
};