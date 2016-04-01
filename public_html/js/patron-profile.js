function runOnLoad() {
  createSearchBar();
  getUserDetails();
}

function getUserDetails() {
  // var data = {
  //   success: true,
  //   errorMessage: "error message",
  //   username: "abc@gmail.com",
  //   name: "Hello Company"
  // };
  //
  // displayUserDetails(JSON.stringify(data));
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

  if(response.success == true) {
    constructHTML(response);
  } else {
    userDetailError(response.errorMessage);
  }
}

function constructHTML(response) {
  $(".pf-email").html(response.username);

  $(".pf-name").html(response.name);

}

function connectionError(response) {
  console.log(response);
}
