function runOnLoad() {
  createSearchBar();
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
    constructHTML(response);
  }
}

function constructHTML(response) {
  $(".pf-oldpass")
  .empty()
  .append("Old Password (if you want to change your password): ", createPasswordField("oldPassword"));

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
  if(hasPassword() || hasEmptyPasswords()) {
    if(isNewPasswordMatch()) {
      var editData = {
        oldPassword: $("#oldPassword").val(),
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
      $("#oldPassword").val("");
      $("#newPassword").val("");
      $("#cfmPassword").val("");
    }
  } else {
    alert("If you're intending to change your password, please complete the password fields.");
    $("#oldPassword").val("");
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
  var oldPassword = $("#oldPassword").val();
  var newPassword = $("#newPassword").val();
  var cfmPassword = $("#cfmPassword").val();

  if(oldPassword == "" && newPassword == "" && cfmPassword == "") {
    return true;
  }

  return false;
}

function hasPassword() {
  var oldPassword = $("#oldPassword").val();
  var newPassword = $("#newPassword").val();
  var cfmPassword = $("#cfmPassword").val();

  if(oldPassword != "" && newPassword != "" && cfmPassword != "") {
    return true;
  }

  return false;
}

function checkEditSuccess(data) {
  var response = JSON.parse(data);

  if(response.success) {
    window.location.href = "/secure/entrepreneur-profile.html";
  } else {
    alert(response.errorMessage);
    window.location.href = "/secure/edit-profile-entre.html";
  }
}

function userDetailError(errorMessage) {

}

function connectionError(response) {

}
