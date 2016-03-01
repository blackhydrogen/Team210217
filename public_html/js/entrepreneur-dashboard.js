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
  if(totPage < 5) {
    for(var i = 0; i < totPage; i++) {
      var leftStr = "";
      var rightStr = "";
      
      if(currPage == 1) {
        leftStr = `<li>
                        <a href="#">&laquo;</a>
                    </li>`
      } else {
        leftStr = `<li>
                        <a href="#" onclick=getAllProjects(`+ (currPage - 1) + `)>&laquo;</a>
                    </li>`
      }
      
      if(totPage == currPage) {
        rightStr = `<li>
                        <a href="#">&raquo;</a>
                    </li>`
      } else {
        rightStr = `<li>
                        <a href="#" onclick=getAllProjects(`+ (currPage + 1) + `)>&laquo;</a>
                    </li>`
      }
      
      var centre = "";
      for(var i = 1; i <= totPage; i++) {
        if(i == currPage) {
          centre = centre + `<li class="active">
                        <a>` + i + `</a>
                    </li>`
        } else {
          centre = centre + `<li>
                          <a href="#" onclick=getAllProjects(` + i + `)>` + i + `</a>
                      </li>`
        }
      }
      
      return leftStr + centre + rightStr;
    }
  } else {
    if(currPage >= 3) {
      
    }
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