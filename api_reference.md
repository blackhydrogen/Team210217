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
	// Note if the user entered wrong username/password, success will be false, with the reason in errorMessage
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
	tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
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
		tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
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
		tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
		email: <string: email of the entrepreneur who is the owner of the project>,
		name: <string: name of the entrepreneur who is the owner of the project>
		},
		... //and so on
	]
}
```


#### List My Projects
List the details of all projects belonging to the current entrepreneur. Available to entrepreneurs and admins.

URL:
```
/listMyProjects
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
		tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
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
		tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
		email: <string: email of the entrepreneur who is the owner of the project>,
		name: <string: name of the entrepreneur who is the owner of the project>
		},
		... //and so on
	]
}
```

#### Logout
Allows a user to log out of their account. Available to entrepreneurs and patrons

URL:
```
/logout
```

Request:
```
{
	action: <string: "logout">
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>,
	errorMessage: <string: error message if success == false>
}
```

#### Register an entrepreneur
Allow a user to sign up for an account on the website. Available to admins and entrepreneurs.

URL:
```
/registerEntrepreneur
```

Request:
```
{
	username: <string: username (email) entered by user>,
	password: <string: user password>,
	name: <string: company name for entrepreneur>,
	address: <string: company address>,
	website: <string: company website>,
	description: <string: company description>
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>
	errorMessage: <string: error message if success == false eg. "email has been taken">
}
```

#### Register a patron
Allows a user to sign up for an account on the website. Available to admins and patrons.

URL:
```
/registerPatron
```

Request:
```
{
	username: <string: username (email) entered by user>,
	password: <string: user password>,
	name: <string: company name for entrepreneur>
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>
	errorMessage: <string: error message if success == false eg. "email has been taken">
}
```

#### Create Project
Allows a user to create a project. Available to entrepreneurs and admins.

URL:
```
/createProject
```

Request:
```
{
	email: <string: email of entrepreneur //ONLY FOR ADMIN>,
	title: <string: title of the project>,
	start: <number (int): start time of the project, given by milliseconds since EPOCH>,
	end: <number (int): end time of the project, given by milliseconds since EPOCH>,
	description: <string: description of the project>,
	goal: <number (float): goal/target amount to raise>,
	raised: <number (float): amount raised thus far>,
	tags: <string: comma-delimited list of tags (e.g. "charity, medical")>,
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>
	errorMessage: <string: error message if success == false>
}
```

#### Edit Entrepreneur Profile
Allows a user to edit his/her profile. Available to entrepreneurs and admins

URL:
```
/editEntrepreneurProfile
```

Request:
```
{
	oldPassword: <string: user's old password>,
	newPassword: <string: user's new password>,
	name: <string: company name for entrepreneur>,
	address: <string: company address>,
	website: <string: company website>,
	description: <string: company description>
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>
	errorMessage: <string: error message if success == false>
}
```

#### Edit Patron Profile
Allows a user to edit his/her profile. Available to patron and admins

URL:
```
/editPatronProfile
```

Request:
```
{
	oldPassword: <string: user's old password>,
	newPassword: <string: user's new password>,
	name: <string: company name for entrepreneur>,
}
```

Response:
```
{
	success: <boolean: true if the request was completed, false otherwise>
	errorMessage: <string: error message if success == false>
}
```

#### Get user profile
Allows a user to retrieve information on a user account. Available to entrepreneurs, patrons and admins

URL:
```
/getUser
```

Request:
```
{
	email: <string: email of the user //OPTIONAL if no email is specified, returns the current session's user>
}
```

Response:
```
{
	accountType: <string: "patron" or "entrepreneur">,
	username: <string: username (email) entered by user>,
	name: <string: company name for "entrepreneur", name for "patron">,
	address: <string: company address //NULL if accountType == "patron">,
	website: <string: company website //NULL if accountType == "patron">,
	description: <string: company description //NULL if accountType == "patron">
}
```

#### Get entrepreneur accounts
Allows a user to obtain a list of entrepreneur accounts. Available to admins

URL:
```
/getEntrepreneurAccounts
```

Request:
```
{
	search: <string: search phrase for accounts //OPTIONAL. If omitted, assumed all users are to be obtained>
}
```

Response:
```
{
	users: [
		{	// first user
			email: <string: email of the user>
			name: <string: company name for "entrepreneur", name for "patron">,
			address: <string: company address //NULL if accountType == "patron">,
			website: <string: company website //NULL if accountType == "patron">,
			description: <string: company description //NULL if accountType == "patron">
		},
		{	// second user
			email: <string: email of the user>
			name: <string: company name for "entrepreneur", name for "patron">,
			address: <string: company address //NULL if accountType == "patron">,
			website: <string: company website //NULL if accountType == "patron">,
			description: <string: company description //NULL if accountType == "patron">
		},
		... // and so on
	]
}
```

#### Get patron accounts
Allows a user to obtain a list of patron accounts. Available to admins

URL:
```
/getPatronAccounts
```

Request:
```
{
	search: <string: search phrase for accounts //OPTIONAL. If omitted, assumed all users are to be obtained>
}
```

Response:
```
{
	users: [
		{	// first user
			email: <string: email of the user>
			name: <string: company name for "entrepreneur", name for "patron">,
		},
		{	// second user
			email: <string: email of the user>
			name: <string: company name for "entrepreneur", name for "patron">,
		},
		... // and so on
	]
}
```
