function runOnLoad() {
  getUserDetails();
}

function getUserDetails() {
  $.post({
    url: "/getUser",
    data: JSON.stringify({

    }),
    success: function (data, response) {
      if(response == "success") {
        displayUserDetails(data);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });
}

function displayUserDetails(data) {
  var response = JSON.parse(data);

  if(response.success == false) {
    userDetailError(response.errorMessage);
  } else {
    
  }
}

function userDetailError(errorMessage) {

}

function connectionError(response) {

}
