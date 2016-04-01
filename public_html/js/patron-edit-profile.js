function runOnLoad() {
  createSearchBar();
  getUserDetails();
}

function getUserDetails() {
  // var data = {
  //   success: true,
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
  $(".pf-oldpass")
  .empty()
  .append(createPasswordField("oldPassword"));

  $(".pf-newpass")
  .empty()
  .append(createPasswordField("newPassword"));

  $(".pf-cfmpass")
  .empty()
  .append(createPasswordField("cfmPassword"));

  $(".pf-patronName")
  .empty()
  .append(createTextInput(response.name, "patronName"));

}

function createPasswordField(id) {
  return `<input type="password" id="` + id + `">`;
}

function createTextInput(holder, id) {
  return $(`<input type="text" style="width: 500px" id="` + id + `" />`).val(holder);
}

function submitChanges() {
  if(hasPassword() || hasEmptyPasswords()){
    if(isNewPasswordMatch()) {
      var editData = {
        oldPassword: $("#oldPassword").val(),
        newPassword: $("#newPassword").val(),
        name: $("#patronName").val()
      };

      $.post({
        url: "/editPatronProfile",
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
  }
  else{
    alert("If you're intending to change password, please complete the password fields.");
    $('#oldPassword').val("");
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

function hasEmptyPasswords(){
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
    window.location.href = "/secure/patron-profile.html";
  } else {
    alert(response.errorMessage);
    window.location.href = "/secure/patron-edit-profile.html";
  }
}

function userDetailError(errorMessage) {
  console.log(errorMessage);
}

function connectionError(response) {
  console.log(response);
}
