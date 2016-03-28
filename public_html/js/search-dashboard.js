function runOnLoad() {
  createDynamicNavBar();
}

function createDynamicNavBar() {
  getCurrentUser(function(data) {
    if(typeof data == String) {
      console.log("Error");
    } else {
      if(data.accountType == "entrepreneur") {
        $("#navBar")
        .append(`<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">My Projects<b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li>
              <a href="entrepreneur-dashboard.html">Dashboard</a>
            </li>
            <li>
              <a href="entrepreneur-new-project.html">New Project</a>
            </li>
          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Profile<b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li>
              <a href="entrepreneur-profile.html">My Profile</a>
            </li>
            <li>
              <a href="edit-profile-entre.html">Edit Profile</a>
            </li>
            <li>
              <a href="#" onclick="logout()">Logout</a>
            </li>
          </ul>
        </li>`);
      } else if(data.accountType == "patron") {
        $("#navBar")
        .append(`<li>
            <a href="patron-dashboard.html" >Projects</a>
        </li>
        <li>
            <a href="patron-donation.html" >My Donations</a>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Profile<b class="caret"></b></a>
            <ul class="dropdown-menu">
                <li>
                  <a href="patron-profile.html">My Profile</a>
                </li>
                <li>
                    <a href="patron-edit-profile.html">Edit Profile</a>
                </li>
                <li>
                    <a href="#" onclick="logout()">Logout</a>
                </li>

            </ul>
        </li>`);
      } else if(data.accountType == "admin") {

      }

      createSearchBar();
      getCurrentUser(displayBasedOnUser)
    }
  });
}

function redirectToRespectiveHomepage() {
  getCurrentUser(function(data) {
    if(typeof data == String) {
      console.log("Error");
    } else {
      if(data.accountType == "entrepreneur") {
        window.location.href = "/secure/entrepreneur-dashboard.html";
      } else if(data.accountType == "patron") {
        window.location.href = "/secure/patron-dashboard.html";
      } else {
        window.location.href = "/secure/admin-dashboard.html";
      }
    }
  });
}

function displayBasedOnUser(data) {
  if(typeof data == String) {
    console.log("Error");
  } else {
    var searchTerm = getUrlParameters("search", "", true);
    searchAndDisplay(1, searchTerm, data.accountType);
  }
}

function searchAndDisplay(pageNumber, searchTerm, accountType) {
  var urlSend;
  switch (accountType) {
    case "entrepreneur":
      urlSent = "/listMyProjects"
      break;
    default:
      urlSent = "/listProjects"
      break;
  }

  $.post({
    url: urlSent,
    data: JSON.stringify({
      page: pageNumber,
      filters: {
        general: searchTerm
      }
    }),
    success: function (data, response) {
      if(response == "success") {
        displayHTML(accountType, data, searchTerm);
      } else {
        return "error";
      }
    },
    contentType: "application/json"
  });
}

function displayHTML(accountType, data, searchTerm) {
  var serverResponse = JSON.parse(data);

  if(serverResponse.success) {
    var currentPage = serverResponse.currentPage;
    var totalPage = serverResponse.totalPage;
    var projects = serverResponse.projects;

    if(projects.length != 0) {
      var htmlToBeDisplayed = formatHtml(projects, accountType);
      var paginationHTML = createPaginationHTML(currentPage, totalPage, accountType, searchTerm);
      document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;
      document.getElementById("pageHTML").innerHTML = paginationHTML;
    } else {
      displayNoProjects(searchTerm);
    }
  } else {
    alert(serverResponse.errorMessage);
  }
}

function formatHtml(projects, accountType) {
  console.log(projects);

  var entireHTML = "";

  for(var i = 0; i < projects.length; i++) {
    var html = createItemHtml(projects[i], accountType);
    entireHTML = entireHTML + html;
  }

  return entireHTML;
}

function createItemHtml(project, accountType) {
  var description = project.description;
  if(description.length > 400) {
    description = description.substring(0, 399);
    description = description + "...";
  }

  console.log(accountType);

  var html = `<div class="row">
                <div class="col-md-7">
                  <a href="portfolio-item.html">
                    <img class="img-responsive img-hover" src="http://placehold.it/700x300" alt="">
                  </a>
                </div>
                <div class="col-md-5">
                  <h3>` + project.title + `</h3>
                  <h4>Goal: ` + project.raised + ` / ` + project.goal + `</h4>
                  <p>` + description + `</p>`;

  if(accountType == "entrepreneur") {
    html = html + `<a class="btn btn-primary" onclick="entreGoToProject('` + project.title + `', '` + project.email + `')">View Project</i></a>
                    <a class="btn btn-primary" onclick="entreGoToTransaction('` + project.title + `', '` + project.email + `')">Donation History</i></a>
                    </div>
                    </div><hr>`;
  } else if(accountType == "patron") {
    html = html + `<a class="btn btn-primary" onclick="patronGoToProject('` + project.title + `', '` + project.email + `')">View Project</i></a>
                    </div>
                    </div><hr>`;
  } else {

  }

  return html;
}

function entreGoToProject(title, email) {
  var params = "title=" + title + "~~~~~email=" + email;
  window.location.href = "/secure/entre-project-detail.html?" + encodeURIComponent(params);
}

function entreGoToTransaction(title, email) {
  var params = "title=" + title + "~~~~~email=" + email;
  window.location.href = "/secure/entre-project-transaction.html?" + encodeURIComponent(params);
}

function patronGoToProject(title, email) {
  var params = "title=" + title + "~~~~~email=" + email;
  window.location.href = "/secure/patron-project-detail.html?" + encodeURIComponent(params);
}

function createPaginationHTML(currentPage, totalPage, accountType, searchTerm) {
  var leftStr = "";
  var rightStr = "";
  var centre = "";

  if(currentPage > 1) {
    leftStr = `<li>
                    <a href="#" onclick=searchAndDisplay(`+ (currentPage - 1) + `,'` + searchTerm + `','` + accountType + `')>&laquo;</a>
                </li>`;
  }

  if(currentPage < totalPage) {
    rightStr = `<li>
                    <a href="#" onclick=searchAndDisplay(`+ (currentPage + 1) + `,'` + searchTerm + `','` + accountType + `')>&laquo;</a>
                </li>`;
  }

  if(totalPage <= 5) {
    for (var i = 1; i <= totalPage; i++) {
      centre = centre + createPageNumberHTML(i, currentPage, accountType, searchTerm);
    }
  } else {
    if(currentPage <= 3) {
      for (var i = 1; i <= 5; i++) {
        centre = centre + createPageNumberHTML(i, currentPage, accountType, searchTerm);
      }
    } else if(currentPage > 3 && currentPage + 2 < totalPage) {
      for(var i = currentPage - 2; i <= currentPage + 2; i++) {
        centre = centre + createPageNumberHTML(i, currentPage, accountType, searchTerm)
      }
    } else {
      for(var i = totalPage - 4; i <= totalPage; i++) {
        centre = centre + createPageNumberHTML(i, currentPage, accountType, searchTerm);
      }
    }
  }

  return leftStr + centre + rightStr;
}

function createPageNumberHTML(iter, currentPage, accountType, searchTerm) {
  if(iter == currentPage) {
    return `<li class="active">
                <a>` + iter + `</a>
            </li>`;
  } else {
    return `<li>
                <a href="#" onclick=searchAndDisplay(` + iter + `,'` + searchTerm + `','` + accountType + `')>` + iter + `</a>
            </li>`;
  }
}

function displayNoProjects(searchTerm) {
  document.getElementById("projectBody").innerHTML = `<h3>There are no projects by the term "` + searchTerm + `".</h3>`;
}
