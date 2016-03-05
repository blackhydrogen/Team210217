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
    .empty()
    .append(
      createPatronRegistrationHTML()
    );
}

function createPatronRegistrationHTML() {
  var str = `<div class="input-container">
                <input type="text" id="patronEmail" required="required" />
                <label for="userEmail">Email</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="password" id="patronPassword" required="required" />
                <label for="patronPassword">Password</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="text" id="name" required="required"/>
                <label for="name">Name</label>
                <div class="bar"></div>
            </div>
            <div class="button-container">
                <button id="patron-register-go"><span>Register</span></button>
            </div>`;

  return str;
}

function createEntreRegistrationHTML() {
  var emailHTML = `<div class="input-container">
                      <input type="text" id="userEmail" required="required" />
                      <label for="userEmail">Email</label>
                      <div class="bar"></div>
                  </div>`;
  var passwordHTML = `<div class="input-container">
                        <input type="password" id="password" required="required" />
                        <label for="password">Password</label>
                        <div class="bar"></div>
                      </div>`;
  var addressHTML = `<div class="input-container">
                        <input type="text" id="address" />
                        <label for="address">Address</label>
                        <div class="bar"></div>
                    </div>`;
  var websiteHTML = `<div class="input-container">
                        <input type="text" id="website" />
                        <label for="website">Website</label>
                        <div class="bar"></div>
                    </div>`;
  var registerButton = `<div class="button-container">
                            <button id="entre-register-go"><span>Register</span></button>
                        </div>`;

  return emailHTML + passwordHTML + addressHTML + websiteHTML + registerButton;
}
