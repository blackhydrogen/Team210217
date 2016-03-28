function runOnLoad() {
  createSearchBar();
  setStartDateLimit()
}

function setStartDateLimit() {
  var tomorrow = new Date();
  var mth = ('0' + (tomorrow.getMonth() + 1)).slice(-2);
  var date = ("0" + tomorrow.getDate()).slice(-2);
  var tmrString = tomorrow.getFullYear() + "-" + mth + "-" + date;
  $("#startDate").attr("min", tmrString);
  $("#endDate").attr("min", tmrString);
}

function submitProjectDetails() {
  if(validateProjectDetails()) {
    var details = getProjectDetails();

    $.post({
      url: "/createProject",
      data: JSON.stringify(details),
      success: function (data, response) {
        if (response == "success") {
          goToProject(data)
        } else {
          connectionError(response);
        }
      },
      contentType: "application/json"
    });

  } else {
    return false;
  }
}

function goToProject(data) {
  var response = JSON.parse(data);
  var params = "title=" + response.title + "~~~~~email=" + response.email;
  window.location.href = "entre-project-detail.html?" + encodeURIComponent(params);
}

function getProjectDetails() {
  var data = {
    title: $("#title").val(),
    start: new Date($("#startDate").val()),
    end: new Date($("#endDate").val()),
    description: $("#description").val(),
    goal: parseInt($("#goal").val()),
    tags: $("#tags").val()
  }

  return data;
}

function validateProjectDetails() {
  if(validateGoal()) {
    return true;
  }

  return false;
}

function validateGoal() {
  var goal = parseInt($("#goal").val());

  if(goal <= 0) {
    alert("Please enter a positive number for your goal.")
    $("#goal").val("");
    return false;
  }

  return true;
}

function clearForm() {
  $("#title").val("");
  $("#goal").val("");
  $("#startDate").val("");
  $("#endDate").val("");
  $("#description").val("");
  $("#tags").val("");
}

function setMinMaxEndDate() {
  var startDate = new Date($("#startDate").val());
  var minDate = new Date(startDate);
  var maxDate = new Date(startDate);
  minDate.setDate(minDate.getDate() + 1);
  maxDate.setMonth(maxDate.getMonth() + 6);

  var minString = minDate.getFullYear() + "-" + (('0' + (minDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + minDate.getDate()).slice(-2));
  var maxString = maxDate.getFullYear() + "-" + (('0' + (maxDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + maxDate.getDate()).slice(-2));
  $("#endDate").attr("min", minString);
  $("#endDate").attr("max", maxString);
}

function connection() {

}
