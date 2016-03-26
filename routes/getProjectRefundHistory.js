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