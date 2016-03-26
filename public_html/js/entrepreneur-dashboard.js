/*
 ProjectIDs for each item are defined as such:
 <title>-<email>
 */


function runOnLoad() {
  createSearchBar();
  getAllProjects(1);
}

function getAllProjects(pageNumber) {
  // var data = {
  //   success: true,
  //   errorMessage: "",
  //   currentPage: 3,
  //   totalPage: 7,
  //   projectsPerPage: 10,
  //   projects: [
  //     { //first project
  //       title: "Project 1",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //       goal: 100,
  //       raised: 50,
  //       start: "20 Jan 2016",
  //       end: "30 Jan 2016",
  //       tags: ["Music", "IT", "Cars"],
  //       email: "abc@abc.com",
  //       name: "ABC"
  //     },
  //     { //second project
  //       title: "Project 1",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //       goal: 100,
  //       raised: 50,
  //       start: "20 Jan 2016",
  //       end: "30 Jan 2016",
  //       tags: ["Music", "IT", "Cars"],
  //       email: "abc@abc.com",
  //       name: "ABC"
  //     }
  //   ]
  // }
  //
  // displayProjects(JSON.stringify(data));

  $.post({
    url: "/listMyProjects",
    data: JSON.stringify({
      page: pageNumber
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

  if (serverResponse.success == true) {
    var currentPage = serverResponse.currentPage;
    var totalPage = serverResponse.totalPage;
    var projects = serverResponse.projects;

    var htmlToBeDisplayed = formatHtml(currentPage, projects);
    var paginationHTML = createPaginationHTML(currentPage, totalPage);

    document.getElementById("projectBody").innerHTML = htmlToBeDisplayed;
    document.getElementById("pageHTML").innerHTML = paginationHTML;

  } else {
    console.log(serverResponse.errorMessage);
  }
}

function connectionError(response) {
  console.log(response);
}

function formatHtml(currPage, projects) {
  if (projects.length == 0) {
    displayNoProjects();
  } else {
    var entireHTML = "";

    for (var i = 0; i < projects.length; i++) {
      var html = createItemHtml(currPage, projects[i]);

      entireHTML = entireHTML + html;
    }
  }

  return entireHTML;
}

function createItemHtml(page, project) {
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
                    <a href="#" onclick=getAllProjects(`+ (currPage - 1) + `)>&laquo;</a>
                </li>`;
  }

  if(currPage < totPage) {
    rightStr = `<li>
                    <a href="#" onclick=getAllProjects(`+ (currPage + 1) + `)>&laquo;</a>
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
                <a href="#" onclick=getAllProjects(` + iter + `)>` + iter + `</a>
            </li>`;
  }
}

function displayNoProjects() {

}

function goToTransactionHistory(email, title) {
  var params = "title=" + title + "&email=" + email;
  window.location.href = "/secure/entre-project-transaction.html?" + encodeURIComponent(params);
}

function goToProject(title, email) {
  var params = "title=" + title + "&email=" + email;

  var html = "/secure/entre-project-detail.html?" + encodeURIComponent(params);

  window.location.href = html;
}
