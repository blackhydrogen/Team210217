function entreTable() {
  $('#tables')
    .empty()
    .append(
      createEntreRegistrationHTML()
    );
    console.log("Hello world");
}

function patronTable() {
  $('#tables')
    .empty()
    .append(
      createPatronRegistrationHTML()
    );
}

function createPatronRegistrationHTML() {
  var tableHTML = `
  <hr>
  <table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Name</th>
      <th>Password</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>mark@gmail.com</td>
      <td>Mark Otto</td>
      <td>mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>jacob@gmail.com</td>
      <td>Jacob Thornton</td>
      <td>fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>larry@gmail.com</td>
      <td>Larry Smith</td>
      <td>twitter</td>
    </tr>
  </tbody>
</table>`

return tableHTML;
}

function createEntreRegistrationHTML() {
  var tableHTML = `
  <hr>
  <table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Name</th>
      <th>Password</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>mark@gmail.com</td>
      <td>Mark Otto</td>
      <td>mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>jacob@gmail.com</td>
      <td>Jacob Thornton</td>
      <td>fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>larry@gmail.com</td>
      <td>Larry Smith</td>
      <td>twitter</td>
    </tr>
  </tbody>
</table>`

return tableHTML;
}


function entreRegister() {
  // calls the register api
  // needs to watch out for
}

function patronRegister() {
  // calls the register api
}
