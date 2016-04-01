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
	
	//console.log(requestObject);
	
	var email = requestObject.username;
	var password = requestObject.password;
	var name = requestObject.name || "";
	
	var salt = lfHash.generateRandomSalt(64);
	var prehash = email+password+salt;
	var hash = lfHash.getHash(prehash);
	
	lfDatabase.executeTransaction([
		"INSERT INTO account VALUES($1, $2, $3, $4)", [email, salt, hash, "patron"],
		"INSERT INTO patron VALUES($1, $2)", [email, name],
	], function(status) {		
		if(!status.success) {
			lfTools.sendError(res, "Unable to create account, please check details.");
			return;
		}
		
		req.session.email = email;
		req.session.type = "patron";
		
		lfTools.sendResponse(res, responseObject);
	});
}


module.exports = {
	getHandler: function() { return handler; }
};