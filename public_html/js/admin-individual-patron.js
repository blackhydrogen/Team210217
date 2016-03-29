function runOnLoad() {
    //patronEmail();
    //patronName();
    //tables();
    getPatronDetail();
    getTransactionHistory();

    getRefundHistory();

}

function populateNameFields(email, name){
  $("#nameField")
  .empty()
  .append(name);

  $("#email")
  .empty()
  .append(email);

  $(".editName")
  .empty()
  .append("Name: ",createTextInput(name, "editName"));

  $(".editNewPassword")
  .empty()
  .append("New Password: ", createPasswordField("editNewPassword"));

  $(".confirmNewPassword")
  .empty()
  .append("Confirmed Password: ", createPasswordField("confirmNewPassword"))
}

function getPatronDetail(){
  var email = getUrlParameters("email", "", true);
  /*var data = {
    success: true,
    errorMessage: "no error",
    accountType: "patron",
    username: "user",
    name: "Steve Jobs",
    address: null,
    website: null,
    description: null
  };

  var dbResponse = JSON.parse(JSON.stringify(data));
  nameOfPatron = dbResponse.name;
  populateNameFields(email, nameOfPatron);*/


  $.post({
        url: "/getUser",
        data: JSON.stringify({
            email: email
        }),
        success: function (data, response) {
            if (response == "success") {
                var dbResponse = JSON.parse(data);
                if(dbResponse.success){
                  nameOfPatron = dbResponse.name;
                  populateNameFields(email, nameOfPatron);;
                } else {
                  //print dbResponse.error;
                }
            } else {
                connectionError(response);
            }
        },
        contentType: "application/json"
    });

}

function connectionError(response) {
  console.log(response);
}

function createTextInput(holder, id) {
 return $(`<input type="text" id="` + id + `" />`).val(holder);
}

function createPasswordField(id) {
  return `<input type="password" id="` + id + `">`;
}

function editProfile(){
  var email = getUrlParameters("email", "", true);

  if(hasPassword() || hasEmptyPassword()){
    if(isNewPasswordMatch()){
      var data = {
        email: email,
        newPassword: $("#editNewPassword").val(),
        name: $("#editName").val()
      }

      $.post({
            url: "/editPatronProfile",
            data: JSON.stringify(data),
            success: function (data, response) {
                if (response == "success") {
                  var dbResponse = JSON.parse(data);
                  if(dbResponse.success){
                    alert("Details have been changed");
                    window.location.href = "/secure/admin-individual-patron.html?" + encodeURIComponent("email=" + email);
                  } else {
                    alert("DB ERROR");
                  }
                } else {
                    connectionError(response);
                }
            },
            contentType: "application/json"
        });
    }
    else{
      alert("The new password you've entered does not match with the confirmation password.");

      $("#editNewPassword").val("");
      $("#confirmNewPassword").val("");
    }
  }
  else{
    alert("If you're intending to change password, please complete the password fields.");
    $("#editNewPassword").val("");
    $("#confirmNewPassword").val("");
  }

}

function isNewPasswordMatch() {
  if($("#editNewPassword").val() != $("#confirmNewPassword").val()) {
    return false;
  }

  return true;
}

function hasEmptyPasswords(){
  var newPassword = $("#editNewPassword").val();
  var cfmPassword = $("#confirmNewPassword").val();

  if(newPassword == "" && cfmPassword == "") {
    return true;
  }

  return false;
}

function hasPassword() {
  var newPassword = $("#editNewPassword").val();
  var cfmPassword = $("#confirmNewPassword").val();

  if(newPassword != "" && cfmPassword != "") {
    return true;
  }

  return false;
}

function getRefundHistory(){
  var email = getUrlParameters("email", "", true);

  $.post({
      url: "/getUserRefundHistory",
      data: JSON.stringify({
          email: email
      }),
      success: function (data, response) {
          if (response == "success") {
              displayRefundTable(data);
          } else {
              connectionError(response);
          }
      },
      contentType: "application/json"
  });
}

function displayRefundTable(data){
  var serverResponse = JSON.parse(data);

  if(serverResponse.success == true){
    var refunds = serverResponse.refunds;

    var htmlToBeDisplayed = makeTable(refunds);

    document.getElementById("refundBody").innerHTML = htmlToBeDisplayed;
  }
  else{
    console.log(serverResponse.errorMessage);
  }
}

function getTransactionHistory() {
    var email = getUrlParameters("email", "", true);
    /*var data = {

    success: true,
    errorMessage: "error lor",
    transactions: [
    {
      title: "Project 1",
      email: "pr1@gmail.com",
      date: 2014,
      amount: 12312,
    },
    {
      title: "Project 2",
      email: "pr2@gmail.com",
      date: 2015,
      amount: 122,
    },
    {
      title: "Project 3",
      email: "pr3@gmail.com",
      date: 2016,
      amount: 5235,
    }
  ]

  };


  displayDontatedTable(JSON.stringify(data));*/

  $.post({
      url: "/getUserTransactionHistory",
      data: JSON.stringify({
          email: email
      }),
      success: function (data, response) {
          if (response == "success") {
              displayDontatedTable(data);
          } else {
              connectionError(response);
          }
      },
      contentType: "application/json"
  });



}

function displayDontatedTable(data){
  var serverResponse = JSON.parse(data);

  if (serverResponse.success == true) {
    var transactions = serverResponse.transactions;

    var htmlToBeDisplayed = makeTable(transactions);

    document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;

  } else {
    console.log(serverResponse.errorMessage);
  }
}

function makeTable(transactions){

  if(transactions.length == 0){
    return displayNoData();
  } else {
    var entireHTML = "";
    var patrontablehead = `<hr>
    <table class="table">
    <thead>
    <tr>
      <th>ID</th>
      <th>Project Name</th>
      <th>Project Owner</th>
      <th>Date</th>
      <th>Amount</th>
      <th>Action</th>
    </tr>
    </thead>
    <tbody>`;
    for (var i = 0; i < transactions.length; i++) {
      var html = listDontatedProjects(transactions[i]);

      entireHTML = entireHTML + html;
    }
    entireHTML = patrontablehead + entireHTML + `</tbody></table>`;
  }

  return entireHTML;
}

function listDontatedProjects(transactions){

  var date = new Date(transactions.time);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var dateString = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();

  var tableHTML =`
    <tr>
      <th scope="row">` + transactions.id + `</th>
      <td><a href="#" onclick="goToProject('` + transactions.title + `', '` + transactions.email + `')">` + transactions.title + `</a></td>
      <td><a href="#" onclick="goToEntreProfile('` + transactions.email + `')">` + transactions.email + `</a></td>
      <td>` + dateString + `/` + month + `/` + year + `&nbsp;` + addZero(hour) + `:` + addZero(minute) + `</td>
      <td>` + transactions.amount + `</td>`
      if(transactions.isRefundable == true){
        tableHTML = tableHTML + `<td><button type="button" class="btn btn-info btn-sm" onclick="refund('`+ transactions.id +`')">Refund</button></td></tr>`;

      } else {

        tableHTML = tableHTML + `<td>Refunded</td></tr>`;
      }


return tableHTML;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function goToEntreProfile(email){
  console.log(email);

  var params = "email=" + email;

  var html = "/secure/admin-entre-profile.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}

function goToProject(title, email) {
  console.log(title);
  console.log(email);
  var params = "title=" + title + "~~~~~email=" + email;

  var html = "/secure/admin-project-detail.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}

//Function used to refund the user
function refund(id){

  $.post({
      url: "/refund",
      data: JSON.stringify({
          id: id
      }),
      success: function (data, response) {
          if (response == "success") {
              isRefundSuccess(data, id);
          } else {
              connectionError(response);
          }
      },
      contentType: "application/json"
  });

}

function isRefundSuccess(data, id){
  var serverResponse = JSON.parse(data);

  if(serverResponse.success == true){
    alert("You have refunded the donation with transaction id: " + id);
    var email = getUrlParameters("email", "", true);
    goBackAdminIndividualPatron(email);
  }
  else{
    alert(serverResponse.errorMessage);
    console.log(serverResponse.errorMessage);
  }
}

function goBackAdminIndividualPatron(email){
  console.log(email);
  var params = "email=" + email;

  var html = "/secure/admin-individual-patron.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}

function displayNoData(){
  var html = `<h1> No transaction to display </h1>`;

  return html;
}

var nameOfPatron = "";





//TEMPLATE FOR HOW IT SHOULD LOOK LIKE
/*
function patronEmail() {
 document.getElementById("email").innerHTML = getEmail();

 console.log("Hello world");
}

function patronName() {
  document.getElementById("nameOfPatron").innerHTML = getName();
}

function tables(){

  document.getElementById("tables").innerHTML = getTables();
}

function getEmail() {
  //this method needs api to get the email address

 var details = '{"name": "Steve Jobs", "email": "steve@gmail.com"}';
 var response = JSON.parse(details);
 var headingHTML = response.email;
  //filler
 return headingHTML;
}

function getName() {
  //this method needs api to get the email address

 var details = '{"name": "Steve Jobs", "email": "steve@gmail.com"}';
 var response = JSON.parse(details);
 var headingHTML = response.name;
  //filler
 return headingHTML;
}

function getTables(){

var tableToDisplay = `
  <br>
  <table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Projects</th>
      <th>Donated Funds</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Project 1</td>
      <td>500</td>
      <td><button type="button">Edit</button>
      <button type="button">Delete</button></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Project 2</td>
      <td>533</td>
      <td><button type="button">Edit</button>
      <button type="button">Delete</button></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Project 3</td>
      <td>413</td>
      <td><button type="button">Edit</button>
      <button type="button">Delete</button></td>
    </tr>
  </tbody>
</table>`

return tableToDisplay;
}*/
