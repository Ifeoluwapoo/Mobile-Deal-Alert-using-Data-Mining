var registerComponent = function (args) {

    // Na your own to do

    var register;

    //Getting the id's from the register page textboxes
    var firstNameTextbox = document.getElementById("firstName-txt");
    var lastNameTextbox = document.getElementById("lastName-txt");
    var emailTextbox = document.getElementById("email-txt");
    var passwordTextbox = document.getElementById("password-txt");
    var cPasswordTextbox = document.getElementById("cPassword-txt");
    var signInButton = document.getElementById("signin-btn");
    var registerButton = document.getElementById("register-btn");
    var errorToastr = document.getElementById("error-toastr");

    function validateForm() {
        if (firstNameTextbox == "") {
          return false;
        }
            if(lastNameTextbox == ""){
                return false;
        }
    
        if(passwordTextbox == ""){
            return false;
            }
        if(cPasswordTextbox == "" && (cPasswordTextbox != passwordTextbox)){
                return false;
        }    
    }

    //Getting the values from the register page textboxes
    registerUser = function () {
        validateForm();
        http.post({
                url: "http://localhost:8020/register-user",
                data: {
                    firstName: firstNameTextbox.value,
                    lastName: lastNameTextbox.value,
                    email: emailTextbox.value,
                    password: passwordTextbox.value,
                    cPassword: cPasswordTextbox.value
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                let auth = response.data;
                console.log(auth);

                if (auth.statusCode == 200) {
                    http.load({
                        path: "components/user.account/login.component.html",
                        component: loginComponent,
                        canvas: document.getElementById("app-root"),
                        param: null
                    });
                } else {
                    errorToastr.innerHTML = auth.message;
                }
            },
            function (error) {
                app.loader.hide();
            });
    };


    signInButton.addEventListener("mousedown", function (evt) {
        //verifyUser();
        http.load({
            path: "components/user.account/login.component.html",
            canvas: document.getElementById("app-root"),
            component: loginComponent,
            param: null
        });
    });

    registerButton.addEventListener("mousedown", function (evt) {
        registerUser();
    });

}