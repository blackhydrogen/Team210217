function runOnLoad() {
    createSearchBar();
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

function fundmenow() {
	if ($("#amountDonated").val().trim() == ""){
    alert("Amount cannot be empty!");
    return;
  }
  else if (isNaN($("#amountDonated").val().trim())){
    alert("Amount has to be a number");
    return;
  }
  else if ($("#amountDonated").val().trim() <= 0){
    alert("Amount cannot be zero or negative");
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
