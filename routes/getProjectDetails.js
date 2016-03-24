var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var lfProjectHelper = require("../lfProjectHelper");

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
		return lfTools.sendError(res, "Login required!");
	}
	
	var title = requestObject.title;
	var email = requestObject.email;
	
	responseObject.title = title;
	responseObject.email = email;

	lfDatabase.executeSQL(
		"SELECT description, goal, start_time AS start, end_time AS end FROM project WHERE email=$1 AND title=$2",
		[requestObject.email, requestObject.title],
		function(status) {
			if(!status.success)
				return sendError(res, "An unexpected error occured.");
			else if(status.result.rowCount != 1)
				return sendError(res, "Project not found.");
			
			var sqlRow = status.result.rows[0];
			
			responseObject.description = sqlRow.description;
			responseObject.goal = sqlRow.goal;
			responseObject.start = sqlRow.start.getTime();
			responseObject.end = sqlRow.end.getTime();
			
			lfProjectHelper.getProjectPeripheralDetails(
				[responseObject],
				function(projects) {
					if(projects == null)
						return sendError(res, "An unexpected error occured.");
					
					responseObject = projects[0];
					lfTools.sendResponse(res, responseObject);
				}
			);
		}
	);
}

module.exports = {
    getHandler: function() { return handler; }
};