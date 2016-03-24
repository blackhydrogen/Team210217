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
	
	responseObject.session = req.session;
	responseObject.note = "WARNING: Debug API - Remove for production!";
	
	lfTools.sendResponse(res, responseObject);
}


module.exports = {
	getHandler: function() { return handler; }
};