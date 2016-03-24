function runOnLoad() {
  createSearchBar();
  getProjectDetails();
}

function getProjectDetails() {
  var data =  {
    success: true,
    errorMessage: "",
    title: "Project 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goal: 100,
    raised: 50,
    start: "20 Jan 2016",
    end: "30 Jan 2016",
    tags: "Music, IT, Cars",
    email: "abc@abc.com",
    name: "ABC"
  };

  displayProject(JSON.stringify(data));

    // var title = getUrlParameters("title", "", true);
    // var email = getUrlParameters("email", "", true);
    //
    // $.post({
    //     url: "/getProjectDetails",
    //     data: JSON.stringify({
    //         title: title,
    //         email: email
    //     }),
    //     success: function (data, response) {
    //         if (response == "success") {
    //             displayProject(data);
    //         } else {
    //             connectionError(response);
    //         }
    //     },
    //     contentType: "application/json"
    // });

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
  var arrayTags = tags.trim();
  arrayTags = arrayTags.split(",");

  for (var i = 0; i < arrayTags.length; i++) {
    html = html + `<button type="button" class="btn btn-info btn-sm">`+ arrayTags[i] +`</button>`;
  }

  return html;
}

function loadTransactionHistory() {
  window.location.href = "/secure/entre-project-transaction.html" + window.location.search;
}

function loadEditPage() {
	window.location.href = "/secure/entre-project-detail-edit.html" + window.location.search;
}
