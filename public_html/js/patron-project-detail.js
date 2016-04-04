function runOnLoad() {
    createSearchBar();
    getProjectDetails();
}

function getProjectDetails() {
    var title = getUrlParameters("title", "", true);
    var email = getUrlParameters("email", "", true);
    console.log(title);

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

    // var data ={
    //   success: true,
    //   errorMessage: "error message",
    //   title: "Test Project 1",
		// 	description: "Test Project 1 description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 	goal: 10000.0,
		// 	raised: 150.26,
		// 	start: new Date("26 Feb 2016 23:59:00 GMT+0800").getTime(),
		// 	end: new Date("15 Mar 2016 10:00:00 GMT+0800").getTime(),
		// 	tags: "test, project, testproject",
		// 	email: "test@gmail.com",
		// 	name: "Atul NK"
    // };
    //
    // displayProject(JSON.stringify(data));

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
			<li>Tags: ` + response.tags + `</li>
      <li>Owner: ` + response.name + `</li>
		`)
	}
	else {
		alert(response.errorMessage);
	}
}

// function createTags(tags){
//   var arrayTags = tags.trim("").split(",");
//   var html="";
//
//   for(var i=0;i<arrayTags.length;i++){
//     html = html+`<button type="button" class="btn btn-info btn-sm">`+ arrayTags[i] +`</button>`;
//   }
//
//   return html;
// }

function fundmenow() {
	if ($("#amountDonated").val().trim() == ""){
    alert("Amount cannot be empty!");
    $("#amountDonated").val("");
    return;
  }
  else if (isNaN($("#amountDonated").val().trim())){
    alert("Amount has to be a number");
    $("#amountDonated").val("");
    return;
  }
  else if ($("#amountDonated").val().trim() <= 0){
    alert("Amount cannot be zero or negative");
    $("#amountDonated").val("");
    return;
  }
  else{
    var projectTitle = getUrlParameters("title", "", true);
    var projectEmail = getUrlParameters("email", "", true);
    var amountDonated = $("#amountDonated").val().trim();

    var requestObject = {
      title: projectTitle,
      email: projectEmail,
      amount: amountDonated
    }

    $.post({
        url: "/donate",
        data: JSON.stringify(requestObject),
        success: function (data, response) {
            if (response == "success") {
                alert("Thank you for donating to this project");
                $("#amountDonated").val("");
                runOnLoad();
            } else {
                connectionError(response);
            }
        },
        contentType: "application/json"
    });
  }

}

function connectionError(response){
  console.log(response);
}
