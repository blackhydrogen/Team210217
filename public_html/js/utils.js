function logout() {
  $.post({
    url: "/registerEntrepreneur",
    data: JSON.stringify({
      action: "logout"
    }),
    success: function (data, response) {
      if(response == "success") {
        window.location.href = "/index.html"
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });
}

function getUrlParameters(parameter, staticURL, decode) {
  /*
  Function: getUrlParameters
  Description: Get the value of URL parameters either from
  current URL or static URL
  Author: Tirumal
  URL: www.code-tricks.com
  */
  var currLocation = (staticURL.length) ? staticURL : window.location.search,
  parArr = decodeURIComponent(currLocation).split("?")[1].split("~~~~~"),
  returnBool = true;

  for (var i = 0; i < parArr.length; i++) {

    var parr = parArr[i].split("=");
    if (parr[0] == parameter) {
      return (decode) ? decodeURIComponent(parr[1]) : parr[1];
      returnBool = true;
    } else {
      returnBool = false;
    }
  }

  if (!returnBool) return false;
}

function createSearchBar() {
  var html = `<form class="navbar-form" onsubmit="performSearch(); return false;">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Search" name="srch-term" id="searchInput">
                  <div class="input-group-btn">
                    <button class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
                  </div>
                </div>
              </form>`;
  $(".search-bar")
  .empty()
  .append(html);
}

function performSearch() {
  var searchInput = $("#searchInput").val();
  window.location.href = "/secure/search-dashboard.html?" + encodeURIComponent("search=" + searchInput);
}

function getCurrentUser(callback) {
  $.post({
    url: "/getUser",
    data: JSON.stringify({
    }),
    success: function (data, response) {
      if(response == "success") {
        var serverResponse = JSON.parse(data);
        callback(serverResponse);
      } else {
        return "error";
      }
    },
    contentType: "application/json"
  });
}
