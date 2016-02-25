##Keywords Definition

Request = Client to Server
Response = Server to Client

##Template Code for Request/Response (and Example)

Template Code for request/response:

$.post({
	url: "/requestUrl",
	data: JSON.stringify({json: "object for request here"}),
	success: function(data, response) {
		if(response == "success") {
			var responseObject = JSON.parse(data);
			//Logic for response here.
		}
		else {
			//error
		}
	},
	contentType: "application/json"
});

### Example for Request/Response

For example, a possible login:

$.post({
	url: "/requestUrl",
	data: JSON.stringify({
		username: $("#username").val(),
		password: $("#password").val()
	}),
	success: function(data, response) {
		if(response == "success") {
			var responseObject = JSON.parse(data);
			if(responseObject.success == true) {
				if(responseObject.userType == "patron") {
					//redirect to patron page
				}
				else if(responseObject.userType == "entrepreneur") {
					//redirect to entrepreneur page
				}
				else if(responseObject.userType == "admin") {
					//redirect to admin page
				}
				else {
					//display error, unknown user type.
				}
			}
			else {
				//display error with responseObject.errorMessage
			}
		}
		else {
			//error
		}
	},
	contentType: "application/json"
});

===============================================================================