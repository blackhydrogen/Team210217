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
		$(".lf-title-noedit")
			.html(response.title);
			
		$(".lf-title")
			.empty()
			.append(createTextInput(response.title));
			
		$(".lf-description")
			.empty()
			.append(`<textarea style="width: 100%; height: 200px">${response.description}</textarea>`);
			
		$(".lf-details")
			.empty()
			.append(
				$("<li>").append("Goal: ", createTextInput(response.goal)),
				$("<li>").append(`Raised: ${response.raised}`),
				$("<li>").append("Start Time: ", createTextInput(new Date(response.start).toLocaleString())),
				$("<li>").append("End Time: ", createTextInput(new Date(response.end).toLocaleString())),
				$("<li>").append("Tags: ", createTextInput(response.tags))
			);
	}
	else {
		alert(response.errorMessage);
	}
}

function createTextInput(value) {
	return $(`<input type="text">`)
		.val(value);
}

function saveDetails() {
	var title = getUrlParameters("title", "", true);
    var email = getUrlParameters("email", "", true);
	
	var requestObject = {
		identifyingTitle: title,
		email: email,
		title: $(".lf-title input").val(),
		description: $(".lf-description textarea").val(),
		goal: Number($(".lf-details input:eq(0)").val()),
		start: new Date($(".lf-details input:eq(1)").val()),
		end: new Date($(".lf-details input:eq(2)").val()),
		tags: $(".lf-details input:eq(3)").val()
	}

    $.post({
        url: "/updateProjectDetails",
        data: JSON.stringify(requestObject),
        success: function (data, response) {
            if (response == "success") {
                handleSaveDetailsResponse(data);
            } else {
                connectionError(response);
            }
        },
        contentType: "application/json"
    });
}

function handleSaveDetailsResponse(data) {
	var response = JSON.parse(data);
	
	if(response.success) {
		var params = "title="
			+ $(".lf-title input").val() 
			+ "&email=" 
			+ getUrlParameters("email", "", true);

		window.location.href = "/secure/entre-project-detail.html?" + encodeURIComponent(params);
	}
	else {
		alert(response.errorMessage);
	}
}