/*
 ProjectIDs for each item are defined as such:
 <title>-<email>
 */
function runOnLoad() {
  createSearchBar();
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
    var transaction = serverResponse.transactions;
    var htmlToBeDisplayed = formatHtml(transaction);

    document.getElementById("transactionBody").innerHTML = htmlToBeDisplayed;
    //document.getElementById("pageHTML").innerHTML = paginationHTML;

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
  var date = new Date(transaction.time);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var date2 = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();

  var html2 = `
    <tr>
      <td>`+ transaction.id + `</td>
      <td>` + transaction.title + `</td>
      <td>` + transaction.email + `</td>
      <td>` + date2 + `/` + month + `/` + year + `&nbsp;` + addZero(hour) + `:` + addZero(minute) + `</td>
      <td>` + transaction.amount + `</td>
    </tr>
  `;
  return html2;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function displayNoTransaction() {
    var html = `
    <tr>
        YOU CURRENTLY HAVE 0 DONATIONS
    </tr>
    `;


    return html;
}
