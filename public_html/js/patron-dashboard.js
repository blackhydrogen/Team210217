/*
 ProjectIDs for each item are defined as such:
 <title>-<email>
 */


function runOnLoad() {
  createSearchBar();
  getAllProjects(1);
}

function getAllProjects(pageNumber) {
  $.post({
    url: "/listProjects",
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
    return displayNoProjects();
  } else {
    var entireHTML = "";
    console.log(projects);
    for (var i = 0; i < projects.length; i+=2) {
      var html = createItemHtml(currPage, i, projects[i]);
      if(!((i+1) >= projects.length)){
        var html2 = createItemHtml(currPage, i, projects[i+1]);
      }
      else{
        var html2 = "";
      }

      entireHTML = entireHTML + `<div class="row">` + html + html2 + `</div><hr>`;
    }
  }

  return entireHTML;
}

function createItemHtml(page, itemNo, project) {
  var projectDesc = project.description;
  if(projectDesc.length > 50){
    projectDesc = project.description.substring(0, 49) + `...`;
  }
  var html =
            `<div class="col-md-3">
                <a href="portfolio-item.html">
                    <img class="img-responsive img-hover" src="http://placehold.it/700x300" alt="">
                </a>
            </div>
            <div class="col-md-3">
                <h4>` + project.title + `</h4>
                <h5>Goal: ` + project.raised + ` / ` + project.goal + `</h5>
                <p>` + projectDesc + `</p>
                <a class="btn btn-primary" onclick="goToProject('` + project.title + `', '` + project.email + `')">View Project</i></a>
            </div>`;

  return html;
}



function createPaginationHTML(currPage, totPage){
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
                    <a href="#" onclick=getAllProjects(`+ (currPage + 1) + `)>&raquo;</a>
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
  return `<h1>No Projects to Display</h1>`;
}

function goToProject(title, email) {
  console.log(title);
  console.log(email);
  var params = "title=" + title + "~~~~~email=" + email;

  var html = "/secure/patron-project-detail.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}
