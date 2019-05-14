var app = {

    // apiUrl: "http://api.rateboard.com.ng",
    // apiUrl: "http://p2pay.core/",

    loader: null,

    toastr: function(id) {
        var toastr = document.getElementById(id);
        return{
            show: function() {
                toastr.removeAttribute("hide");
                setTimeout(function () {
                  toastr.setAttribute("hide", "");
                }, 10000);
            },
            hide: function() {
                toastr.setAttribute("hide", "");
            },
            setText: function(text) {
                toastr.innerHTML = text;
                app.toastr(id).show();
            }
        };
    },

    // Application Constructor
    initialize: function () {

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        app["loader"] = new LoaderComponent();
        app["modal"] = new ModalComponent();
        app["alert"] = new AlertModalComponent();

        http.load({
            path: "components/user.account/login.component.html",
            component: loginComponent,
            canvas: document.getElementById("app-root")
        });

        // http.load({
        //     path: "components/master.details/master.details.component.html",
        //     canvas: document.getElementById("app-root"),
        //     component: masterDetailsComponent,
        //     param: null
        // });

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('app-root');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var _$app = document.getElementById(id);

        http.get({
            url: "http://localhost:8020/get-country",
            data: null
        }, function (response) {
            app["locationDetails"] = response.data;
            //console.log(app.locationDetails);
        },
            function (error) {
                _$app.loader.hide();
            });

    },

    // getFCMToken: function () {

    //     FCMPlugin.getToken(function (token) {
    //         // app["deviceToken"] = token;
    //         // http.post({
    //         //         url: app.apiUrl + "/accounts/registerdevice",
    //         //         data: {
    //         //             deviceToken: token
    //         //         },
    //         //         header: [{
    //         //             key: "Content-Type",
    //         //             value: "application/x-www-form-urlencoded; charset=UTF-8"
    //         //         }]
    //         //     }, function (response) {
    //         //         app["deviceDetails"] = response.data;
    //         //     },
    //         //     function (error) {
    //         //         app.loader.hide();
    //         //     });
    //     });

    //     FCMPlugin.onTokenRefresh(function (token) {});

    //     FCMPlugin.onNotification(function (data) {
    //             if (data.wasTapped) {
    //                 // ...
    //             } else {
    //                 // ...
    //             }
    //         },
    //         function (msg) {
    //             console.log(msg);
    //         },
    //         function (err) {
    //             console.log(err);
    //         });
    // },
};

app.initialize();

var date = new Date();
    date.setDate(date.getDate()-31);

console.log(date);