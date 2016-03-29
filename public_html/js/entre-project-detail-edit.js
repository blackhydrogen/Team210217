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
				$("<li>").append("Start Date: ", createDateInput(response.start, response.end, "start")),
				$("<li>").append("End Date: ", createDateInput(response.start, response.end, "end")),
				$("<li>").append("Tags: ", createTextInput(response.tags))
			);
	}
	else {
		alert(response.errorMessage);
	}
}

function createDateInput(start, end, type) {
  var startDate = new Date(start);
  var endDate = new Date(end);
  var currentDate = new Date();
  var html = "";
  var tomorrow = new Date();
  var mth = ('0' + (tomorrow.getMonth() + 1)).slice(-2);
  var date = ("0" + (tomorrow.getDate() + 1)).slice(-2);
  var tmrString = tomorrow.getFullYear() + "-" + mth + "-" + date;

  if(type == "start") {
    if(startDate < currentDate) {
      html = startDate;
    } else {
      var startMth = ('0' + (startDate.getMonth() + 1)).slice(-2);
      var startDay = ("0" + startDate.getDate()).slice(-2);
      var startString = startDate.getFullYear() + "-" + startMth + "-" + startDay;

      html = `<input type="date" id="startDate" required="required" style="width: 150px"
              min="` + tmrString + `" value="` + startString + `" onchange="setMinMaxEndDate()" onkeydown="return false;"/>`;
    }
  } else {
    var maxDate = new Date(start);
    maxDate.setMonth(maxDate.getMonth() + 6);
    var endMth = ('0' + (endDate.getMonth() + 1)).slice(-2);
    var endDay = ("0" + endDate.getDate()).slice(-2);
    var endString = endDate.getFullYear() + "-" + endMth + "-" + endDay;
    var maxMth = ('0' + (maxDate.getMonth() + 1)).slice(-2);
    var maxDay = ("0" + maxDate.getDate()).slice(-2);
    var maxString = maxDate.getFullYear() + "-" + maxMth + "-" + maxDay;

    html = `<input type="date" id="endDate" required="required" style="width: 150px"
            min="` + tmrString + `" max="` + maxString + `" value="` + endString + `" onkeydown="return false;"/>`;
  }

  return html;
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
		start: new Date($("#startDate").val()),
		end: new Date($("#endDate").val()),
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
			+ "~~~~~email="
			+ getUrlParameters("email", "", true);

		window.location.href = "/secure/entre-project-detail.html?" + encodeURIComponent(params);
	}
	else {
		alert(response.errorMessage);
	}
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
