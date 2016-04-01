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

	var sqlTransaction = [];
	if(filters.general) {
		sqlTransaction.push(
			`(
				SELECT p.title, p.email, p.description, p.goal, p.start_time AS start, p.end_time AS end
				FROM project p
				WHERE (p.title, p.email) IN (
					SELECT t.title, t.email
					FROM tag t
					WHERE LOWER(t.name) LIKE $1
				)
			)
			UNION
			(
				SELECT title, email, description, goal, start_time AS start, end_time AS end
				FROM project
				WHERE LOWER(title) LIKE $1
				OR LOWER(email) LIKE $1
				OR LOWER(description) LIKE $1
			)
			ORDER BY title`
		);
		sqlTransaction.push(["%" + filters.general.toLowerCase() + "%"]);
	}
	else {
		sqlTransaction.push(
			`SELECT title, email, description, goal, start_time AS start, end_time AS end
			FROM project
			ORDER BY title`
		);
		sqlTransaction.push([]);
	}
	
	lfDatabase.executeTransaction(
		sqlTransaction,
		function(status) {
			if(!status.success) {
				return lfTools.sendError(res, "An unexpected error occured.");
			}
			
			responseObject.totalPage = Math.ceil(status.result[0].rows.length / projectsPerPage);
			
			for(var i = 0; i < projectsPerPage; i++) {
				var rowNumber = (page - 1) * projectsPerPage + i;
				if(rowNumber >= status.result[0].rows.length)
					break;
				
				var project = {};
				var sqlRow = status.result[0].rows[rowNumber];
			
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