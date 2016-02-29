function runOnLoad() {
    getProjectDetails();
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
        
        console.log(parArr);
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

function getProjectDetails() {
    var title = getUrlParameters("title", "", true);
    var email = getUrlParameters("email", "", true);
    console.log(title);
    console.log(email);

    $.post({
        url: "/getProjectDetails",
        data: JSON.stringify({
            title: title,
            email: email
        }),
        success: function (data, response) {
            if (response == "success") {
                displayProject(data);
            } else {
                connectionError(response);
            }
        },
        contentType: "application/json"
    });

}

function displayProject(data) {
    var response = JSON.parse(data);
}

getProjectDetails();