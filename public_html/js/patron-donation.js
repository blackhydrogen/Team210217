/*
 ProjectIDs for each item are defined as such:
 <title>-<email>
 */


function runOnLoad() {
  getTransactionHist();
}

function getTransactionHist() {
  $.post({
    url: "/getUserTransactionHistory",
    data: JSON.stringify({

    }),
    success: function (data, response) {
      if (response == "success") {
        displayTransactionHist(data);
      } else {
        connectionError(response);
      }
    },
    contentType: "application/json"
  });
}

function displayTransactionHist(data) {
  var serverResponse = JSON.parse(data);

  if (serverResponse.success == true) {
    var title = serverResponse.title;
    var transaction = serverResponse.transaction;

    var htmlToBeDisplayed = formatHtml(transaction);

    document.getElementById("transactionBody").innerHTML = htmlToBeDisplayed;
    document.getElementById("pageHTML").innerHTML = paginationHTML;

  } else {
    console.log(serverResponse.errorMessage);
  }
}

function connectionError(response) {
  console.log(response);
}

function formatHtml(transaction) {
  if (transaction.length == 0) {
    return displayNoTransaction();
  } else {
    var entireHTML = "";

    for (var i = 0; i < transaction.length; i++) {
      var html = createItemHtml(transaction[i]);

      entireHTML = entireHTML + html;
    }
  }

  return entireHTML;
}

function createItemHtml(transaction) {
  var title = transaction.title;
  var email = transaction.email;
  var date = transaction.date;
  var amount = transaction.amount;

  var html = `<div class="row">

            <div class="col-md-12">
                <h3>` + transaction.title + `</h3>
                <h4>Goal: ` + transaction.email `</h4>
                <p>` + transaction.date + `</p><br>
                <p>`+ transaction.amount` </p><br>
            </div>
        </div><hr>`;
  return html;
}

function displayNoTransaction() {
    var html = `<div class="col-md-12" align="center">
        YOU CURRENTLY HAVE 0 DONATIONS
    </div>`;

    return html;
}

function goToProject(title, email) {
  var params = "title=" + title + "&email=" + email;

  var html = "/secure/entre-project-detail.html?" + encodeURIComponent(params);

  window.location.href = html;
}
