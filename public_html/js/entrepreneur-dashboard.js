/*
 ProjectIDs for each item are defined as such:
 <title>-<email>
 */


function runOnLoad() {
  getAllProjects(1);
}

function getAllProjects(pageNumber) {
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
      var html = createItemHtml(currPage, i, projects[i]);

      entireHTML = entireHTML + html;
    }
  }

  return entireHTML;
}

function createItemHtml(page, itemNo, project) {
  var html = `<div class="row">
            <div class="col-md-7">
                <a href="portfolio-item.html">
                    <img class="img-responsive img-hover" src="http://placehold.it/700x300" alt="">
                </a>
            </div>
            <div class="col-md-5">
                <h3>` + project.title + `</h3>
                <h4>Goal: ` + project.raised + ` / ` + project.goal + `</h4>
                <p>` + project.description + `</p>
                <a class="btn btn-primary" onclick="goToProject('` + project.title + `', '` + project.email + `')">View Project</i></a>
            </div>
        </div><hr>`;
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

function goToProject(title, email) {
  console.log(title);
  console.log(email);
  var params = "title=" + title + "&email=" + email;

  var html = "/secure/entre-project-detail.html?" + encodeURIComponent(params);
  console.log(html);
  console.log(decodeURIComponent(html));

  window.location.href = html;
}
