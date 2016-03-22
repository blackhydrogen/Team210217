var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

var search;

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	if(req.session.type != "admin")
		return lfTools.sendError(res, "Invalid user.");
	
	search = requestObject.search;
	
	if(!search) {
		lfDatabase.executeSQL(
			"SELECT email, name, address, website, description FROM entrepreneur",
			[],
			sqlHandler
		);
	}
	else {
		lfDatabase.executeSQL(
			"SELECT email, name, address, website, description FROM entrepreneur WHERE email LIKE $1",
			["%" + search + "%"],
			sqlHandler
		);
	}
}

function sqlHandler(status) {	
	if(!status.success) {
		return lfTools.sendError(res, "Unexpected error occured.");
	}
	
	responseObject.users = [];
	
	for(var i = 0; i < status.result.rows.length; i++) {
		responseObject.users.push({
			email: status.result.rows[i].email,
			name: status.result.rows[i].name,
			website: status.result.rows[i].website,
			address: status.result.rows[i].address,
			description: status.result.rows[i].description
		});
	}
	
	lfTools.sendResponse(res, responseObject);
}

module.exports = {
	getHandler: function() { return handler; }
};