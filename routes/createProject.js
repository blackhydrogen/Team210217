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
	
	if(req.session.type == "entrepreneur") {
		email = req.session.email;
	}
	else if(req.session.type == "admin") {
		//ok, do nothing
	}
	else {
		return lfTools.sendError(res, "Invalid user.");
	}
	
	var title = requestObject.title;
	var start = new Date(requestObject.start);
	var end = new Date(requestObject.end);
	var description = requestObject.description || "";
	var goal = requestObject.goal;
	var tags = requestObject.tags || "";
	tags = tags.split(/\s*,\s*/);
	
	//Build transaction
	var transaction = [
		"INSERT INTO project VALUES($1, $2, $3, $4, $5, $6)",
		[title, email, goal, start, end, description]
	];
	
	for(var i = 0; i < tags.length; i++) {
		transaction.push("INSERT INTO tag VALUES($1, $2, $3)");
		transaction.push([
			tags[i],
			title,
			email
		]);
	}
	
	lfDatabase.executeTransaction(
		transaction,
		function(status) {
			if(!status.success) {
				console.log(status);
				return lfTools.sendError(res, "An error occured when creating the project. Please check the project details, and remember your project titles must be unique.");
			}
			
			responseObject.title = title;
			responseObject.email = email;
			lfTools.sendResponse(res, responseObject);
		}
	);
}


module.exports = {
	getHandler: function() { return handler; }
};