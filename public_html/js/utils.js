function logout() {
  window.location.href = "/index.html";
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
  parArr = decodeURIComponent(currLocation).split("?")[1].split("&"),
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
  var html = `<form class="navbar-form" role="search" onsubmit="performSearch(); return false;">
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
  console.log($("#searchInput").val());
}
