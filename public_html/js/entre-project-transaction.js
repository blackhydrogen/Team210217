function runOnLoad() {
  displayTransactionDetails();
}

function displayTransactionDetails() {
  // var title = getUrlParameters("title", "", true);
  // var email = getUrlParameters("email", "", true);
  //
  // $.post({
  //   url: "/getProjectTransactionHistory",
  //   data: JSON.stringify({
  //     email: email,
  //     title: title
  //   }),
  //   success: function(data, response) {
  //     if(response == "success") {
  //       displayTransactionHistory(data, title, email);
  //     } else {
  //       connectionError(response);
  //     }
  //   },
  //   contentType: "application/json"
  // });

  var email = "leon@abc.com";
  var title = "First Project";
  var data = {
    transactions: [
      {
        email: "abc@123.com",
        amount: 50,
        date: "23 Jan 2016"
      },
      {
        email: "leon@123.com",
        amount: 100,
        date: "28 Jan 2016"
      }
    ]
  };

  displayTransactionHistory(JSON.stringify(data), title, email);

}

function displayTransactionHistory(data, title, email) {
  var response = JSON.parse(data);

  $(".page-header")
  .empty()
  .append(title);

  $(".table-body")
  .empty()
  .append(createRowsHTML(response.transactions));
}

function createRowsHTML(transactions) {
  var html = "";

  for(var i = 0; i < transactions.length; i++) {
    html = html + `<tr>`;
    html = html + `<td>` + (i + 1) + `</td>`;
    html = html + `<td><a href="#" onclick="goToUser('` + transactions[i].email + `')">` + transactions[i].email + `</a></td>`;
    html = html + `<td>` + transactions[i].amount + `</td>`;
    html = html + `<td>` + transactions[i].date + `</td>`;
    html = html + "</tr>";
  }

  return html;
}

function goToUser(email) {
  alert(email);
  return false;
}

function backToProject() {
  window.location.href = "/secure/entre-project-detail.html?" + window.location.search;
}

function connectionError(errorMessage) {

}
