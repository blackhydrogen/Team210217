var lfDatabase = require("./lfDatabase");

function getProjectPeripheralDetails(projects, callback) {
	if(projects.length == 0)
		return callback(projects);
	
	var sqlTransactions = [];
	for(var i = 0; i < projects.length; i++) {
		var email = projects[i].email;
		var title = projects[i].title;
		
		sqlTransactions.push("SELECT STRING_AGG(name, ',') AS tags FROM tag WHERE email=$1 AND title=$2");
		sqlTransactions.push([email, title]);
		
		sqlTransactions.push("SELECT name FROM entrepreneur WHERE email=$1");
		sqlTransactions.push([email]);
		
		sqlTransactions.push(
			`SELECT SUM(amount) FROM transaction
			WHERE entrepreneurEmail=$1
			AND title=$2
			AND id NOT IN (
				SELECT transactionId FROM refund
			)`);
		sqlTransactions.push([email, title]);
	}
	
	lfDatabase.executeTransaction(
		sqlTransactions,
		function(status) {
			if(!status.success)
				return callback(null);
			
			for(var i = 0; i < projects.length; i++) {
				projects[i].tags = status.result[i*3].rows[0].tags || "";
				projects[i].name = status.result[i*3+1].rows[0].name || "";
				projects[i].raised = status.result[i*3+2].rows[0].sum || 0;
			}
			
			callback(projects);
		}
	);
}

module.exports = {
	getProjectPeripheralDetails: getProjectPeripheralDetails
};