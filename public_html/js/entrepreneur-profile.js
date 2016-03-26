function runOnLoad() {
  createSearchBar();
  getUserDetailsAndDisplay();
}

function getUserDetailsAndDisplay() {
  console.log("i'm getting my details");
  var data = {
    success: true,
    name: "Hello Company",
    address: "ABC Road",
    website: "Helloworld.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  };

  displayUserDetails(JSON.stringify(data));
  // $.post({
  //   url: "/getUser",
  //   data: JSON.stringify({
  //
  //   }),
  //   success: function (data, response) {
  //     if(response == "success") {
  //       displayUserDetails(data);
  //     } else {
  //       connectionError(response);
  //     }
  //   },
  //   contentType: "application/json"
  // });
}

function displayUserDetails(data) {
  var response = JSON.parse(data);
  console.log("user details");
  if(!response.success) {
    userDetailError();
  } else {
    constructHTML(response);
  }
}

function constructHTML(response) {
  console.log("I came here");


  $(".pf-companyName")
  .empty()
  .append("<b>Company Name: </b>" + response.name);

  $(".pf-address")
  .empty()
  .append("<b>Address: </b>" + response.address);

  $(".pf-website")
  .empty()
  .append("<b>Website: </b>" + response.website);

  $(".pf-description")
  .empty()
  .append("<b>Company Description:</b> <br>" + response.description);
}
