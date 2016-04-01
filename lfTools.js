function requestObjectIsValid(res, requestObject) {
	if(!requestObject instanceof Object) {
		sendError(res, "Invalid request.");
		return false;
	}
	return true;
}

function sendResponse(res, responseObject) {
	responseObject.success = true;
	res.end(JSON.stringify(responseObject));
}

function sendError(res, errorMessage) {
	res.end(JSON.stringify({
		success: false,
		errorMessage: errorMessage
	}));
}

module.exports = {
	requestObjectIsValid: requestObjectIsValid,
	sendResponse: sendResponse,
	sendError: sendError
};