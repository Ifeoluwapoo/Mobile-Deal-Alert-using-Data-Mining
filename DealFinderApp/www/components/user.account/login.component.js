var loginComponent = function (args) {


    var login;

    var emailTextbox = document.getElementById("email-txt");
    var passwordTextbox = document.getElementById("password-txt");
    var signInButton = document.getElementById("signin-btn");
    var registerButton = document.getElementById("register-btn");
    var errorToastr = document.getElementById("error-toastr");

    verifyUser = function () {
        http.post({
                url: "http://localhost:8020/verify-user",
                data: {
                    email: emailTextbox.value,
                    password: passwordTextbox.value
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                let auth = response.data;

                if (auth.statusCode == 200) {
                    app["userData"] = auth.userData;
                    http.load({
                        path: "components/master.details/master.details.component.html",
                        canvas: document.getElementById("app-root"),
                        component: masterDetailsComponent,
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
        verifyUser();
    });

    registerButton.addEventListener("mousedown", function (evt) {
        http.load({
            path: "components/user.account/register.component.html",
            canvas: document.getElementById("app-root"),
            component: registerComponent,
            param: null
        });
    });

}