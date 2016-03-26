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
	
	var email = req.session.email;
	
	if(req.session.type == "entrepreneur") {
		//do nothing
	}
	else if(req.session.type == "admin") {
		email = requestObject.email;
	} 
	else {
		return lfTools.sendError(res, "Invalid account!");
	}
	
	
	var page = parseInt(requestObject.page) || 1;
	var projectsPerPage = parseInt(requestObject.projectsPerPage) || 10;
	var filters = requestObject.filters || {}; //Not used yet
	
	var projects = [];
	
	responseObject.currentPage = page;
	responseObject.projectsPerPage = projectsPerPage;

	lfDatabase.executeTransaction([
			`SELECT title, description, goal, start_time AS start, end_time AS end FROM project
			WHERE email=$1
			ORDER BY title
			OFFSET $2 LIMIT $3`,
			[email, (page - 1) * projectsPerPage, projectsPerPage],
			"SELECT COUNT(1) FROM project WHERE email=$1",
			[email]
		],
		function(status) {
			if(!status.success)
				return lfTools.sendError(res, "An unexpected error occured.");
			
			responseObject.totalPage = Math.ceil(parseInt(status.result[1].rows[0].count) / projectsPerPage);
			
			for(var i = 0; i < status.result[0].rows.length; i++) {
				var project = {};
				var sqlRow = status.result[0].rows[i];
			
				project.email = email;
				project.title = sqlRow.title;
				project.description = sqlRow.description;
				project.goal = sqlRow.goal;
				project.start = sqlRow.start.getTime();
				project.end = sqlRow.end.getTime();
				
				projects.push(project);
			}
			
			lfProjectHelper.getProjectPeripheralDetails(
				projects,
				function(newProjects) {
					if(newProjects == null)
						return lfTools.sendError(res, "An unexpected error occured.");
					
					responseObject.projects = newProjects;
					lfTools.sendResponse(res, responseObject);
				}
			);
		}
	);
}

module.exports = {
    getHandler: function() { return handler; }
};