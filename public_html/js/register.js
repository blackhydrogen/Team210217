function entreRegistration() {
  $('#registrationForm')
    .empty()
    .append(
      createEntreRegistrationHTML()
    );

    entrepreneur = true;
    patron = false;
}

function patronRegistration() {
  $('#registrationForm')
    .empty()
    .append(
      createPatronRegistrationHTML()
    );

  entrepreneur = false;
  patron = true;
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
  var confirmPassword = `<div class="input-container">
                          <input type="password" id="confirmPatronPassword" required="required" />
                          <label for="confirmPatronPassword">Confirm Your Password</label>
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

  return emailHTML + passwordHTML + confirmPassword + nameHTML + registerButton;
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
  var confirmPassword = `<div class="input-container">
                          <input type="password" id="confirmEntrePassword" required="required" />
                          <label for="confirmEntrePassword">Confirm Your Password</label>
                          <div class="bar"></div>
                        </div>`;
  var companyName = `<div class="input-container">
                        <input type="text" id="companyName" required="required" />
                        <label for="companyName">Company Name</label>
                        <div class="bar"></div>
                      </div>`;
  var addressHTML = `<div class="input-container">
                        <input type="text" id="entreAddress" required="required" />
                        <label for="entreAddress">Address</label>
                        <div class="bar"></div>
                    </div>`;
  var websiteHTML = `<div class="input-container">
                        <input type="text" id="website" required="required" />
                        <label for="website">Website</label>
                        <div class="bar"></div>
                    </div>`;
  var descriptionHTML = `<div class="input-container">
                            <input type="text" id="description" required="required" />
                            <label for="description">Description of company/organisation</label>
                            <div class="bar"></div>
                        </div>`;
  var registerButton = `<div class="button-container">
                            <button onclick="entreRegister()"><span>Register</span></button>
                        </div>`;

  return emailHTML + passwordHTML + confirmPassword + companyName + addressHTML + websiteHTML + descriptionHTML + registerButton;
}

function submitForm() {
  if(entrepreneur) {
    entreRegister();
  } else {
    patronRegister();
  }
}

function entreRegister() {
  // calls the register api
  // needs to watch out for
  checkPasswordMatch("entrepreneur");
}

function patronRegister() {
  // calls the register api
}


function checkPasswordMatch(accountType) {
  if(accountType == "entrepreneur") {
    var password = $("#entrePassword").val();
    var cfmPassword = $("#confirmEntrePassword").val();

    if(password != cfmPassword) {
      alert("Passwords do not match!");
      $("#entrePassword").val("");
      $("#confirmEntrePassword").val("");
    }
  } else {
    var password = $("#patronPassword").val();
    var cfmPassword = $("#confirmPatronPassword").val();

    if(password != cfmPassword) {
      alert("Passwords do not match!");
      $("#patronPassword").val("");
      $("#confirmPatronPassword").val("");
    }
  }
}

var entrepreneur = false;
var patron = false;
