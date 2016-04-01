//Code of the entre information
function getEntreTable(){

  $.post({
    url: "/getEntrepreneurAccounts",
    data: JSON.stringify({
    }),
    success: function (data, response) {
      if (response == "success") {
        createEntreRegistrationHTML(data);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });

  /*var data = {

    success: true,
    errorMessage: "error lor",
    users: [
    {
      email: "steve@gmail.com",
      name: "Steve Jobs"
    },
    {
      email: "matt@gmail.com",
      name: "Matt Patt",
    },
    {
      email: "TJ@gmail.com",
      name: "TJ Miller",
    }
  ]

  };

  createEntreRegistrationHTML(JSON.stringify(data));*/
}

function createEntreRegistrationHTML(data) {
  var serverResponse = JSON.parse(data);

  if (serverResponse.success == true) {
    var users = serverResponse.users;


    var htmlToBeDisplayed = extractEntreTable(users);

    document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;
    //document.getElementById("pageHTML").innerHTML = paginationHTML;

  } else {
    console.log(serverResponse.errorMessage);
  }
}

function extractEntreTable(users){
  if(users.length == 0){
    displayNoUsers();
  } else {
    var entireHTML = "";
    var entretablehead = `<hr>
    <table class="table">
    <thead>
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Name</th>
    </tr>
    </thead>
    <tbody>`;
    for (var i = 0; i < users.length; i++) {
      var html = listEntre(users[i], i+1);

      entireHTML = entireHTML + html;
    }
    entireHTML = entretablehead + entireHTML + `</tbody></table>`;
  }

  return entireHTML;
}

function listEntre(users, num){
  var tableHTML =`
    <tr>
      <th scope="row">` + num + `</th>
      <td><a href="#" onclick="goToEntreUsers('` + users.email + `')">` + users.email + `</a></td>
      <td>`+ users.name +`</td>
    </tr>`

return tableHTML;
}

function goToEntreUsers(email) {
  console.log(email);
  var params = "email=" + email;

  var html = "/secure/admin-individual-entre.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}

//Patron table code

function getPatronTable(){
 $.post({
    url: "/getPatronAccounts",
    data: JSON.stringify({
    }),
    success: function (data, response) {
      if (response == "success") {
        createPatronRegistrationHTML(data);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });

  /*var data = {

    success: true,
    errorMessage: "error lor",
    users: [
    {
      email: "steve@gmail.com",
      name: "Steve Jobs"
    },
    {
      email: "matt@gmail.com",
      name: "Matt Patt",
    },
    {
      email: "TJ@gmail.com",
      name: "TJ Miller",
    }
  ]

  };

  createPatronRegistrationHTML(JSON.stringify(data));*/
}


function displayNoUsers(){

}

function goToPatUsers(email) {
  console.log(email);
  var params = "email=" + email;

  var html = "/secure/admin-individual-patron.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}

function listPatron(users, num){
  var tableHTML =`
    <tr>
      <th scope="row">` + num + `</th>
      <td><a href="#" onclick="goToPatUsers('` + users.email + `')">` + users.email + `</a></td>
      <td>`+ users.name +`</td>
    </tr>`

return tableHTML;
}

function extractPatronTable(users){
  if(users.length == 0){
    displayNoUsers();
  } else {
    var entireHTML = "";
    var patrontablehead = `<hr>
    <table class="table">
    <thead>
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Name</th>
    </tr>
    </thead>
    <tbody>`;
    for (var i = 0; i < users.length; i++) {
      var html = listPatron(users[i], i+1);

      entireHTML = entireHTML + html;
    }
    entireHTML = patrontablehead + entireHTML + `</tbody></table>`;
  }

  return entireHTML;
}

function createPatronRegistrationHTML(data) {
  var serverResponse = JSON.parse(data);

  if (serverResponse.success == true) {
    var users = serverResponse.users;


    var htmlToBeDisplayed = extractPatronTable(users);

    document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;
    //document.getElementById("pageHTML").innerHTML = paginationHTML;

  } else {
    console.log(serverResponse.errorMessage);
  }
}

function connectionError(response) {
  console.log(response);
}

/*function createEntreRegistrationHTML() {
  var tableHTML = `
  <hr>
  <table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Name</th>
      <th>Password</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>mark@gmail.com</td>
      <td>Mark Otto</td>
      <td>mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>jacob@gmail.com</td>
      <td>Jacob Thornton</td>
      <td>fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>larry@gmail.com</td>
      <td>Larry Smith</td>
      <td>twitter</td>
    </tr>
  </tbody>
</table>`

return tableHTML;
}*/
