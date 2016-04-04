function runOnLoad() {
  createSearchBar();
  displayTransactionDetails();
}

function displayTransactionDetails() {
  var title = getUrlParameters("title", "", true);
  var email = getUrlParameters("email", "", true);

  $.post({
    url: "/getProjectTransactionHistory",
    data: JSON.stringify({
      email: email,
      title: title
    }),
    success: function(data, response) {
      if(response == "success") {
        displayTransactionHistory(data, title, email);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });

  // var email = "leon@abc.com";
  // var title = "First Project";
  // var data = {
  //   transactions: [
  //     {
  //       email: "abc@123.com",
  //       amount: 50,
  //       date: "23 Jan 2016"
  //     },
  //     {
  //       email: "leon@123.com",
  //       amount: 100,
  //       date: "28 Jan 2016"
  //     }
  //   ]
  // };
  //
  // displayTransactionHistory(JSON.stringify(data), title, email);

}

function displayTransactionHistory(data, title, email) {
  var response = JSON.parse(data);

  $(".lf-title")
  .empty()
  .append(title)

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
    html = html + `<td>` + transactions[i].id + `</td>`;
    html = html + `<td>` + transactions[i].email + `</td>`;
    html = html + `<td>` + transactions[i].amount + `</td>`;


    var date = new Date(transactions[i].time);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dateString = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    html = html + `<td>` + dateString + `/` + month + `/` + year + `&nbsp;` + addZero(hour) + `:` + addZero(minute) + `</td>`;

    if(transactions[i].isRefundable) {
      html = html + `<td><button class="btn btn-info btn-sm" onclick="refund('`+ transactions[i].id + `')">Refund</button></td>` ;
    } else {
      html = html + `<td>Refunded</td>`
    }
    html = html + "</tr>";
  }

  return html;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function goToUser(email) {
  alert(email);
  return false;
}

function connectionError(errorMessage) {
  console.log(errorMessage);
}

function refund(id) {
  $.post({
    url: "/refund",
    data: JSON.stringify({
      id: id
    }),
    success: function (data, response) {
      if (response == "success") {
        isRefundSuccess(data, id);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });
}

function isRefundSuccess(data, id) {
  var serverResponse = JSON.parse(data);

  if(serverResponse.success){
    alert("You have refunded the donation with transaction ID: " + id);
    window.location.href = "/secure/admin-entre-project-transaction.html" + window.location.search;
  }
  else{
    alert(serverResponse.errorMessage);
    console.log(serverResponse.errorMessage);
  }
}
