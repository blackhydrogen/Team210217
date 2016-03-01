function runOnLoad() {
    getProjectDetails();
}

function getUrlParameters(parameter, staticURL, decode) {
    /*
     Function: getUrlParameters
     Description: Get the value of URL parameters either from 
                  current URL or static URL
     Author: Tirumal
     URL: www.code-tricks.com
    */
    var currLocation = (staticURL.length) ? staticURL : window.location.search,
        parArr = decodeURIComponent(currLocation).split("?")[1].split("&"),
        returnBool = true;
        
    for (var i = 0; i < parArr.length; i++) {

        var parr = parArr[i].split("=");
        if (parr[0] == parameter) {
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        } else {
            returnBool = false;
        }
    }

    if (!returnBool) return false;
}

function getProjectDetails() {
    var title = getUrlParameters("title", "", true);
    var email = getUrlParameters("email", "", true);

    $.post({
        url: "/getProjectDetails",
        data: JSON.stringify({
            title: title,
            email: email
        }),
        success: function (data, response) {
            if (response == "success") {
                displayProject(data);
            } else {
                connectionError(response);
            }
        },
        contentType: "application/json"
    });

}

function displayProject(data) {
    var response = JSON.parse(data);
	
	if(response.success) {
		$(".lf-title").html(response.title);
		$(".lf-description").html(response.description);
		$(".lf-details").html(`
			<li>Goal: ${response.goal}</li>
			<li>Raised: ${response.raised}</li>
			<li>Start Time: ${new Date(response.start).toLocaleString()}</li>
			<li>End Time: ${new Date(response.end).toLocaleString()}</li>
			<li>Tags: ${response.tags}</li>
		`)
	}
	else {
		alert(response.errorMessage);
	}
}

function loadEditPage() {
	window.location.href = "/secure/entre-project-detail-edit.html" + window.location.search;
}