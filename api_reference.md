##Keywords Definition

Request = Client to Server

Response = Server to Client

##Template Code for Request/Response (and Example)

Template Code for request/response:

```javascript
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
```

#### Example for Request/Response

For example, a possible code for login:

```javascript
$.post({
	url: "/login",
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
```

## API

All responses will have the "success" key. If success == false, then the only other key
will be "errorMessage", containing a description of the error. Else if success == true,
"errorMessage" will be omitted and other respective keys will be included.

#### Login
URL:
```
/login
```

Request:
```
{
	username: <string: username (email) entered by user>,
	password: <string: password entered by user>
}
```

Response:
```
{
	success: <boolean: true if the request was successfully completed, false otherwise>,
	errorMessage: <string: error message if success == false>,
	userType: <string: "patron", "entrepreneur" or "admin" only>
}
```

#### Get Project Details
Get the details of a single project details. Available to all users.

URL:
```
/getProjectDetails
```

Request:
```
{
	title: <string: title of the project>,
	email: <string: email of the entrepreneur who is the owner of the project>
}
```

Response:
```
{
	success: <boolean: true if the request was successfully completed, false otherwise>,
	errorMessage: <string: error message if success == false>,
	title: <string: title of the project>,
	description: <string: description of the project>,
	goal: <number (float): goal/target amount to raise>,
	raised: <number (float): amount raised thus far>,
	start: <number (int): start time of the project, given by milliseconds since EPOCH>,
	end: <number (int): end time of the project, given by milliseconds since EPOCH>,
	tags: [<string: tag1 of project>, <string: tag2 of project>, ...],
	email: <string: email of the entrepreneur who is the owner of the project>,
	name: <string: name of the entrepreneur who is the owner of the project>	
}
```

#### Update Project Details
Update the details of a single project details. Available to entrepreneurs and admin.

URL:
```
/updateProjectDetails
```

Request:
```
{
	identifyingTitle: <string: (old) title of the project, that identifies the project via the primary key>,
	email: <string: email of the entrepreneur who is the owner of the project>
	title: <string: (new) title of the project>,
	description: <string: description of the project>,
	goal: <number (float): goal/target amount to raise>,
	start: <number (int): start time of the project, given by milliseconds since EPOCH>,
	end: <number (int): end time of the project, given by milliseconds since EPOCH>,
	tags: <string: comma-delimited list of tags (spaces around comma ignored - "charity,medical" is same as "charity, medical")>
}
```

Response:
```
{
	success: <boolean: true if the request was successfully completed, false otherwise>,
	errorMessage: <string: error message if success == false>
}
```

#### List Projects
List the details of all projects. Available to all users.

URL:
```
/listProjects
```

Request:
```
{
	page: <number (int): the page number you want. Starts from 1 (page 1).
	projectsPerPage: <number (int): OPTIONAL number of projects to send per page. If omitted, 10 is assumed.>
	filters: { // OPTIONAL. If omitted it will assume no filters are used.
		// TODO - add filter options
	}
}
```

Response:
```
{
	success: <boolean: true if the request was successfully completed, false otherwise>,
	errorMessage: <string: error message if success == false>,
	currentPage: <number (int): current page number>
	totalPage: <number (int): total number of pages>
	projectsPerPage: <number (int): number of projects sent per page>
	projects: [
		{ //first project
		title: <string: title of the project>,
		description: <string: description of the project>,
		goal: <number (float): goal/target amount to raise>,
		raised: <number (float): amount raised thus far>,
		start: <number (int): start time of the project, given by milliseconds since EPOCH>,
		end: <number (int): end time of the project, given by milliseconds since EPOCH>,
		tags: [<string: tag1 of project>, <string: tag2 of project>, ...],
		email: <string: email of the entrepreneur who is the owner of the project>,
		name: <string: name of the entrepreneur who is the owner of the project>
		},
		{ //second project
		title: <string: title of the project>,
		description: <string: description of the project>,
		goal: <number (float): goal/target amount to raise>,
		raised: <number (float): amount raised thus far>,
		start: <number (int): start time of the project, given by milliseconds since EPOCH>,
		end: <number (int): end time of the project, given by milliseconds since EPOCH>,
		tags: [<string: tag1 of project>, <string: tag2 of project>, ...],
		email: <string: email of the entrepreneur who is the owner of the project>,
		name: <string: name of the entrepreneur who is the owner of the project>
		},
		... //and so on
	]
}
```
