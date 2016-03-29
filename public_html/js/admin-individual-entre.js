function runOnLoad() {
    //patronEmail();
    //patronName();
    //tables();
    getEntreDetail();
    getEntreProjects(1);

}


function displayUserDetails(response, email){

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

  $("#email")
  .empty()
  .append(email);

  $("#nameField")
  .empty()
  .append(response.name);
}

function getEntreDetail(){
  var email = getUrlParameters("email", "", true);
  /*var data = {
    success: true,
    errorMessage: "no error",
    accountType: "entrepreneur",
    username: "user",
    name: "Steve Jobs",
    address: null,
    website: null,
    description: null
  };

  var dbResponse = JSON.parse(JSON.stringify(data));
  nameOfEntre = dbResponse.name;
  populateNameFields(email, nameOfEntre);*/
  
  $.post({
        url: "/getUser",
        data: JSON.stringify({
            email: email
        }),
        success: function (data, response) {
            if (response == "success") {
                var dbResponse = JSON.parse(data);
                if(dbResponse.success){
                  nameOfEntre = dbResponse.name;
                  displayUserDetails(dbResponse, email);
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


//Function Leads to new page that will look like edit-profile-entre.js
function getEntreProjects(pageNumber) {
  var email = getUrlParameters("email", "", true);
  /*var data = {
     success: true,
     errorMessage: "",
     currentPage: 3,
     totalPage: 7,
     projectsPerPage: 10,
     projects: [
       { //first project
         title: "Project 1",
         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
         goal: 100,
         raised: 50,
         start: "20 Jan 2016",
         end: "30 Jan 2016",
         tags: ["Music", "IT", "Cars"],
         email: "abc@abc.com",
         name: "ABC"
       },
       { //second project
         title: "Project 1",
         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
         goal: 100,
         raised: 50,
         start: "20 Jan 2016",
         end: "30 Jan 2016",
         tags: ["Music", "IT", "Cars"],
         email: "abc@abc.com",
         name: "ABC"
       }
     ]
   }
  
  displayProjects(JSON.stringify(data));*/

  $.post({
    url: "/listMyProjects",
    data: JSON.stringify({
      page: pageNumber,
      projectsPerPage: 10000,
      email: email
    }),
    success: function (data, response) {
      if (response == "success") {
        displayProjects(data);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });
}

function displayProjects(data) {
  var serverResponse = JSON.parse(data);
  //var emailAddr = serverResponse.email;

  //alert(serverResponse.success);

  if (serverResponse.success == true) {
    var currentPage = serverResponse.currentPage;
    var totalPage = serverResponse.totalPage;
    var projects = serverResponse.projects;
    

    if(projects.length != 0) {
      var htmlToBeDisplayed = formatHtml(projects);
      //var paginationHTML = createPaginationHTML(currentPage, totalPage);
      document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;
      document.getElementById("pageHTML").innerHTML = paginationHTML;
    } else {
      displayNoProjects();
    }
  } else {
    console.log(serverResponse.errorMessage);
  }
}

function formatHtml(projects) {
  if (projects.length == 0) {
    displayNoProjects();
  } else {
    var entireHTML = "";

    for (var i = 0; i < projects.length; i++) {
      var html = createItemHtml(projects[i]);

      entireHTML = entireHTML + html;
    }
  }

  return entireHTML;
}

function createItemHtml(project) {
  var description = project.description;
  if(description.length > 400) {
    description = description.substring(0, 399);
    description = description + "...";
  }

  var html = `<div class="row">
            <div class="col-md-7">
                <a href="portfolio-item.html">
                    <img class="img-responsive img-hover" src="http://placehold.it/700x300" alt="">
                </a>
            </div>
            <div class="col-md-5">
                <h3>` + project.title + `</h3>
                <h4>Goal: ` + project.raised + ` / ` + project.goal + `</h4>
                <p>` + description + `</p>
                <a class="btn btn-primary" onclick="goToProject('` + project.title + `', '` + project.email + `')">View Project</i></a>
                <a class="btn btn-primary" onclick="goToTransactionHistory('` + project.title + `', '` + project.email + `')">Donation History</i></a>
            </div>
        </div><hr>`;
  return html;
}

function createPaginationHTML(currPage, totPage) {
  var leftStr = "";
  var rightStr = "";
  var centre = "";

  if(currPage > 1) {
    leftStr = `<li>
                    <a href="#" onclick=getEntreProjects(`+ (currPage - 1) + `)>&laquo;</a>
                </li>`;
  }

  if(currPage < totPage) {
    rightStr = `<li>
                    <a href="#" onclick=getEntreProjects(`+ (currPage + 1) + `)>&raquo;</a>
                </li>`;
  }

  if(totPage <= 5) {
    for (var i = 1; i <= totPage; i++) {
      centre = centre + createPageNumberHTML(i, currPage);
    }
  } else {
    if(currPage <= 3) {
      for (var i = 1; i <= 5; i++) {
        centre = centre + createPageNumberHTML(i, currPage);
      }
    } else if(currPage > 3 && currPage + 2 < totPage) {
      for(var i = currPage - 2; i <= currPage + 2; i++) {
        centre = centre + createPageNumberHTML(i, currPage)
      }
    } else {
      for(var i = totPage - 4; i <= totPage; i++) {
        centre = centre + createPageNumberHTML(i, currPage);
      }
    }
  }

  return leftStr + centre + rightStr;
}

function createPageNumberHTML(iter, currPage) {
  if(iter == currPage) {
    return `<li class="active">
                <a>` + iter + `</a>
            </li>`;
  } else {
    return `<li>
                <a href="#" onclick=getEntreProjects(` + iter + `)>` + iter + `</a>
            </li>`;
  }
}

function displayNoProjects() {
  document.getElementById("projectBody").innerHTML = "<h3>You do not have any projects!</h3>";
}

function goToEditProfile(){
  var email = getUrlParameters("email", "", true);
  var params = "email=" + email;
  window.location.href = "/secure/admin-edit-profile-entre.html?" + encodeURIComponent(params);

}

function goToTransactionHistory(email, title) {
  var params = "title=" + title + "~~~~~email=" + email;
  //need to implement this page for the admin to entre
  //window.location.href = "/secure/entre-project-transaction.html?" + encodeURIComponent(params);
}

function goToProject(title, email) {
  var params = "title=" + title + "~~~~~email=" + email;
  //need to implement this page for the admin to entre
  //var html = "/secure/entre-project-detail.html?" + encodeURIComponent(params);

  window.location.href = html;
}

var nameOfEntre = "";

/*function makeTable(transactions){
  
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

*/





//TEMPLATE FOR HOW IT SHOULD LOOK LIKE 
/*
function patronEmail() {
 document.getElementById("email").innerHTML = getEmail();
 
 console.log("Hello world");
}

function patronName() {
  document.getElementById("nameOfEntre").innerHTML = getName();
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

