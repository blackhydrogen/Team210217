function loginFunction() {
    $.post({
        url: "/login",
        data: JSON.stringify({
            username: $("#username").val(),
            password: $("#password").val()
        }),
        success: function(data, response) {
            console.log(data);
            if(response == "success") {
                connectionSuccess(data);
            } else {
                loginNetworkError();
            }
        },
        contentType: "application/json"
    });
}

function connectionSuccess(data) {
    var serverResponse = JSON.parse(data);
    if(serverResponse.success == true) {
        // user has successfully logged in
        if(serverResponse.userType == "patron") {
            
        } else if(serverResponse.userType == "entrepreneur") {
            
        } else if(serverResponse.userType == "admin") {
            
        } else {
            // random error
        }
        
    } else {
        // print serverResponse.errorMessage
        userDoesNotExist();
    }
}

// function for bad network error
function loginNetworkError() {
    console.log("network error");
}

// user does not exist
function userDoesNotExist() {
    
}

document.getElementById('loginButton').onclick = function() {loginFunction(); return false;};