var masterDetailsComponent = function (args) {

    var $this = this;

    window.addEventListener("mousedown", function (evt) {

    });


    var rootNode = document.getElementById("app-root");
    var appMaster = document.getElementById('app-master');

    var searchTextField = document.getElementById("search-field");
    var searchTextButton = document.getElementById("search-button");
    searchTextButton.addEventListener("mousedown", function (evt) {
        crawlWeb();
        
        evt.cancelBubble = true;
        evt.preventDefault();
    });


    // Details Callout
    var detailsCalloutView = document.getElementById("details-callout-view");
    detailsCalloutView.addEventListener("mousedown", function (evt) {
        $this.hideDetailsCallout();
        evt.cancelBubble = true;
        evt.preventDefault();
    });

    var detailsCalloutViewPanel = document.querySelector("div[data-section=\"details-callout-view-panel\"]");
    detailsCalloutViewPanel.addEventListener("mousedown", function (evt) {
        evt.cancelBubble = true;
        evt.preventDefault();
    });



    // public
    this.loader = new LoaderComponent({
        canvas: document.getElementById("details-body")
    });

    this.hideDetailsCallout = function () {
        detailsCalloutView.removeAttribute("show-callout", "");
        setTimeout(function () {
            detailsCalloutView.setAttribute("hide", "");
        }, 100);
    };

    this.showDetailsCallout = function () {
        detailsCalloutView.removeAttribute("hide");
        setTimeout(function () {
            detailsCalloutView.setAttribute("show-callout", "");
        }, 100);
    };


    // private
    crawlWeb = function () {
        $this.loader.show();
        console.log(app.locationDetails);
        var location = "IE";
        http.get({
                url: "http://localhost:8020/search/" + searchTextField.value + " in " + app.locationDetails.country
            },
            function (response) {
                $this.loader.hide();

                http.load({
                    path: "components/products/products.component.html",
                    canvas: document.getElementById("details-body"),
                    component: productsComponent,
                    param: {
                        root: $this,
                        products: response.data
                    }
                });
            },
            function (error) {
                $this.loader.hide();
                
            });
    };

    setTimeout(function () {
        crawlWeb();
    }, 1000);


    //Harburger click
    var hamburgerButton = document.getElementById("hamburger-button");
    hamburgerButton.addEventListener("mousedown", function(evt) {
     document.getElementById("getUser").innerHTML ="Hello, "+ app.userData.firstName;
      slidableMenuPanel.classList.add("show-slidable-panel");
      evt.cancelBubble = true;
      evt.preventDefault();
    });
    
    var slidableMenuPanel = document.getElementById("slidable-menu-panel");
    window.addEventListener("mousedown", function(event) {
      slidableMenuPanel.classList.remove("show-slidable-panel");
    });

    //Redirect to wishlist page
    var wishlistButton = document.getElementById("wishlist-btn");
    wishlistButton.addEventListener("mousedown", function (evt) {
        app.getItemFromWishList();
        http.load({
            path: "components/wishlist/wishlist.component.html",
            canvas: document.getElementById("app-root"),
            component: wishListComponent,
            param: null
        });
    });

     //Log out page
     var logoutButton = document.getElementById("logout-btn");
     logoutButton.addEventListener("mousedown", function (evt) {
        http.load({
            path: "components/user.account/login.component.html",
            canvas: document.getElementById("app-root"),
            component: loginComponent,
            param: null
        });
     });


     app["getItemFromWishList"] = function (callback) {
        http.post({
            url: "http://localhost:8020/get-wishlist/",
            data: {
                userID: app.userData._id,  
            },
            header: [{
                key: "Content-Type",
                value: "application/x-www-form-urlencoded; charset=UTF-8"
            }]
        },
        function (response) {
            app.loader.hide();
            var result = response.data;
            console.log(result);
            if(result.statusCode == 200) {
                app["wishlist"] = result.wishlist;
                if(callback) {
                    callback();
                }
            } else {
                var errorToastr = app.toastr("error-toastr");
                errorToastr.show();
                errorToastr.setText(result.message);
            }
             
            // if(result) {
            //      errorToastr.innerHTML = result.message;
            // }
        },
        function (error) {
            // app.loader.hide();
            // label.error({
            //     message: "Oops!, something went wrong",
            // });
        });
    };
    
};