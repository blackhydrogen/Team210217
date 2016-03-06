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
  var emailHTML = `<div class="input-container">
                      <input type="text" id="patronEmail" required="required" />
                      <label for="userEmail">Email</label>
                      <div class="bar"></div>
                  </div>`;
  var passwordHTML = `<div class="input-container">
                          <input type="password" id="patronPassword" required="required" />
                          <label for="patronPassword">Password</label>
                          <div class="bar"></div>
                      </div>`;
  var nameHTML = `<div class="input-container">
                      <input type="text" id="name" required="required"/>
                      <label for="name">Name</label>
                      <div class="bar"></div>
                  </div>`;
  var registerButton = `<div class="button-container">
                            <button onclick="patronRegister()"><span>Register</span></button>
                        </div>`;

  return emailHTML + passwordHTML + nameHTML + registerButton;
}

function createEntreRegistrationHTML() {
  var emailHTML = `<div class="input-container">
                      <input type="text" id="entreEmail" required="required" />
                      <label for="entreEmail">Email</label>
                      <div class="bar"></div>
                  </div>`;
  var passwordHTML = `<div class="input-container">
                        <input type="password" id="entrePassword" required="required" />
                        <label for="entrePassword">Password</label>
                        <div class="bar"></div>
                      </div>`;
  var addressHTML = `<div class="input-container">
                        <input type="text" id="entreAddress" />
                        <label for="entreAddress">Address</label>
                        <div class="bar"></div>
                    </div>`;
  var websiteHTML = `<div class="input-container">
                        <input type="text" id="website" />
                        <label for="website">Website</label>
                        <div class="bar"></div>
                    </div>`;
  var descriptionHTML = `<div class="input-container">
                            <input type="text" id="description" />
                            <label for="description">Description of company/organisation</label>
                            <div class="bar"></div>
                        </div>`
  var registerButton = `<div class="button-container">
                            <button onclick="entreRegister()"><span>Register</span></button>
                        </div>`;

  return emailHTML + passwordHTML + addressHTML + websiteHTML + descriptionHTML + registerButton;
}

function entreRegister() {
  // calls the register api
  // needs to watch out for
}

function patronRegister() {
  // calls the register api
}
