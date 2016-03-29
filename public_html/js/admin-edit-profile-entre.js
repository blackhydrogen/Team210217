function runOnLoad() {
  getUserDetails();
}

function getUserDetails() {
  // var data = {
  //   success: true,
  //   name: "Hello Company",
  //   address: "ABC Road",
  //   website: "Helloworld.com",
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  // };
  //
  // displayUserDetails(JSON.stringify(data));
  var email = getUrlParameters("email", "", true);
  $.post({
    url: "/getUser",
    data: JSON.stringify({
      email: email
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
    constructHTML(response);
  }
}

function constructHTML(response) {

  $(".pf-newpass")
  .empty()
  .append("New Password (if you want to change your password): ", createPasswordField("newPassword"));

  $(".pf-cfmpass")
  .empty()
  .append("Confirm Password (if you want to change your password): ", createPasswordField("cfmPassword"));

  $(".pf-companyName")
  .empty()
  .append("Company Name: ", createTextInput(response.name, "companyName"));

  $(".pf-address")
  .empty()
  .append("Address: ", createTextInput(response.address, "address"));

  $(".pf-website")
  .empty()
  .append("Website ", createTextInput(response.website, "website"));

  $(".pf-description")
  .empty()
  .append(`Company Description: <br><textarea id="description" style="width: 80%; height: 200px">${response.description}</textarea>`);

}

function createPasswordField(id) {
  return `<input type="password" id="` + id + `">`;
}

function createTextInput(holder, id) {
  return $(`<input type="text" style="width: 500px" id="` + id + `" />`).val(holder);
}

function submitChanges() {
  var email = getUrlParameters("email", "", true);  
  if(hasPassword() || hasEmptyPasswords()) {
    if(isNewPasswordMatch()) {
      var editData = {
        email: email,
        newPassword: $("#newPassword").val(),
        name: $("#companyName").val(),
        address: $("#address").val(),
        website: $("#website").val(),
        description: $("#description").val()
      };

      $.post({
        url: "/editEntrepreneurProfile",
        data: JSON.stringify(editData),
        success: function (data, response) {
          if(response == "success") {
            checkEditSuccess(data);
          } else {
            connectionError(response);
          }
        },
        contentType: "application/json"
      });

    } else {
      alert("The new password you've entered does not match with the confirmation password.");
      
      $("#newPassword").val("");
      $("#cfmPassword").val("");
    }
  } else {
    alert("If you're intending to change your password, please complete the password fields.");
    $("#newPassword").val("");
    $("#cfmPassword").val("");
  }
}

function isNewPasswordMatch() {
  if($("#newPassword").val() != $("#cfmPassword").val()) {
    return false;
  }

  return true;
}

function hasEmptyPasswords() {
  var newPassword = $("#newPassword").val();
  var cfmPassword = $("#cfmPassword").val();

  if(newPassword == "" && cfmPassword == "") {
    return true;
  }

  return false;
}

function hasPassword() {
  var newPassword = $("#newPassword").val();
  var cfmPassword = $("#cfmPassword").val();

  if(newPassword != "" && cfmPassword != "") {
    return true;
  }

  return false;
}

function checkEditSuccess(data) {
  var response = JSON.parse(data);
  var email = getUrlParameters("email", "", true);
  var params = "email=" + email;
  if(response.success) {
    window.location.href = "/secure/admin-individual-entre.html?" + encodeURIComponent(params);
  } else {
    alert(response.errorMessage);
    window.location.href = "/secure/admin-edit-profile-entre.html?" + encodeURIComponent(params);
  }
}

function userDetailError(errorMessage) {

}

function connectionError(response) {

}
