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
	if(!req.session.email) {
		lfTools.sendError(res, "Login required!");
		return;
	}
	
	responseObject.title = requestObject.title;
	responseObject.email = requestObject.email;
	
	responseObject.raised = 0; //TODO - temp value.
	
	var collectCount = 3;
	function collect() {
		collectCount--;
		if(collectCount == 0)
			sendResponse(res, responseObject);
	}
	
	lfDatabase.executeSQL(
		"SELECT * FROM project WHERE email=$1 AND title=$2",
		[requestObject.email, requestObject.title],
		function(status) {
			if(status.result.rowCount != 1) {
				sendError(res, "Project not found.");
				return;
			}
			
			var sqlRow = status.result.rows[0];
			
			responseObject.description = sqlRow.description;
			responseObject.goal = sqlRow.goal;
			responseObject.start = sqlRow.start_time;
			responseObject.end = sqlRow.end_time;
			
			collect();
		}
	);
	
	lfDatabase.executeSQL(
		"SELECT * FROM tag WHERE email=$1 AND title=$2",
		[requestObject.email, requestObject.title],
		function(status) {
			responseObject.tags = "";
			
			if(status.result.rows.length >= 1) {
				responseObject.tags = status.result.rows[0].name;
			}
			
			for(var i = 1; i < status.result.rows.length; i++) {	
				responseObject.tags += ", " + status.result.rows[i].name;
			}
			
			collect();
		}
	);
	
	lfDatabase.executeSQL(
		"SELECT name FROM entrepreneur WHERE email=$1",
		[requestObject.email],
		function(status) {
			responseObject.name = status.result.rows[0].name;
			collect();
		}
	);
}

module.exports = {
    getHandler: function() { return handler; }
};