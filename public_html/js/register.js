function entreRegistration() {
  $('#registrationForm')
    .empty()
    .append(
      createEntreRegistrationHTML()
    );
    console.log("Hello world");
}

function patronRegistration() {
  $('#registrationForm')
    .empty();
}

function createEntreRegistrationHTML() {
  var str = `<div class="input-container">
                <input type="text" id="userEmail" required="required" />
                <label for="userEmail">Email</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="password" id="password" required="required" />
                <label for="password">Password</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="text" id="address" />
                <label for="address">Address</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="text" id="website" />
                <label for="website">Website</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="text" id="description" />
                <label for="description">Description of your organisation/company</label>
                <div class="bar"></div>
            </div>
            <div class="button-container">
                <button id="loginButton"><span>Register</span></button>
            </div>`;

  return str;
}
