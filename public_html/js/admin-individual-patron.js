function runOnLoad() {
    //patronEmail();
    //patronName();
    //tables();
    getPatronDetail();
    getTransactionHistory();

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
  .append(createTextInput(name, "editName"));
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
 return $(`<input type="text" style="width: 500px" id="` + id + `" />`).val(holder);
}

function editProfile(){
  var email = getUrlParameters("email", "", true);

  $.post({
        url: "/editPatronProfile",
        data: JSON.stringify({
            email: email,
            name: $("#editName").val()

        }),
        success: function (data, response) {
            if (response == "success") {
              var dbResponse = JSON.parse(data);
              if(dbResponse.success){
                alert("Name changed");
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
    displayNoData();
  } else {
    var entireHTML = "";
    var patrontablehead = `<hr>
    <table class="table">
    <thead>
    <tr>
      <th>#</th>
      <th>Project Name</th>
      <th>Project Owner</th>
      <th>Donated Date</th>
      <th>Donated Amount</th>
      <th>Action</th>
    </tr>
    </thead>
    <tbody>`;
    for (var i = 0; i < transactions.length; i++) {
      var html = listDontatedProjects(transactions[i], i+1);

      entireHTML = entireHTML + html;
    }
    entireHTML = patrontablehead + entireHTML + `</tbody></table>`;
  }

  return entireHTML;
}

function listDontatedProjects(transactions, num){

  var tableHTML =`
    <tr>
      <th scope="row">` + num + `</th>
      <td>` + transactions.title + `</td>
      <td>`+ transactions.email +`</td>
      <td>` + transactions.date + `</td>
      <td>` + transactions.amount + `</td>`
      if(transactions.amount < 0){
        tableHTML = tableHTML + `</tr>`;
      } else {
        //NEED TO PUT TRANSACTION BETWEEN REFUND
        tableHTML = tableHTML + `<td><button type="button" onclick="refund()">Refund</button></td></tr>`;
      }


return tableHTML;
}

//Function used to refund the user
function refund(){


}

function displayNoData(){

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

