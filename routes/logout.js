var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var requestObject;
var responseObject = {};

var req;
var res;

function handler(reql, resl) {
	req = reql;
	res = resl;
	
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
	
	if(req.session.email) {
		req.session.email = undefined;
		req.session.type = undefined;
		
		lfTools.sendResponse(res, responseObject);
	}
	else {
		lfTools.sendError(res, "You're not logged in! (And hence can't log out...)");
	}
}

module.exports = {
	getHandler: function() { return handler; }
};