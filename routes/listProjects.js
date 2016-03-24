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
	
	if(!req.session.type) {
		return lfTools.sendError(res, "Login required!");
	}
	
	var page = parseInt(requestObject.page) || 1;
	var projectsPerPage = parseInt(requestObject.projectsPerPage) || 10;
	var filters = requestObject.filters || {}; //Not used yet
	
	var projects = [];
	
	responseObject.currentPage = page;
	responseObject.projectsPerPage = projectsPerPage;

	lfDatabase.executeSQL(
		`SELECT title, email, description, goal, start_time AS start, end_time AS end FROM project
		ORDER BY title
		OFFSET $1 LIMIT $2`,
		[(page - 1) * projectsPerPage, projectsPerPage],
		function(status) {
			if(!status.success)
				return sendError(res, "An unexpected error occured.");
			
			for(var i = 0; i < status.result.rows.length; i++) {
				var project = {};
				var sqlRow = status.result.rows[i];
			
				project.email = sqlRow.email;
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
						return sendError(res, "An unexpected error occured.");
					
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