$.post({
    url: "/listMyProjects",
    data: JSON.stringify({
        page: <number (int): the page number you want. Starts from 1 (page 1).
        
    }}),
    success: function(data, response) {
        if(response == "success") {
            var responseObject = JSON.parse(data);
            //Logic for response here.


        }
        else {
            //error
        }
    },
    contentType: "application/json"
});