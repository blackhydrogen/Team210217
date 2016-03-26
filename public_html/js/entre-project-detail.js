function runOnLoad() {
    getProjectDetails();
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
  console.log(response);

	if(response.success) {
    $(".page-header").html(response.title);
		$(".lf-title").html(response.title);
		$(".lf-description").html(response.description);
		$(".lf-details").html(`
			<li>Goal: ${response.goal}</li>
			<li>Raised: ${response.raised}</li>
			<li>Start Time: ${new Date(response.start).toLocaleString()}</li>
			<li>End Time: ${new Date(response.end).toLocaleString()}</li>
			<li>Tags: `+ createTags(response.tags) + `</li>
		`)
	}
	else {
		alert(response.errorMessage);
	}
}

function createTags(tags) {
  var html = "";

  for (var i = 0; i < tags.length; i++) {
    html = html + `<button type="button" class="btn btn-info btn-sm">`+ tags[i] +`</button>`;
  }

  return html;
}

function loadEditPage() {
	window.location.href = "/secure/entre-project-detail-edit.html" + window.location.search;
}
