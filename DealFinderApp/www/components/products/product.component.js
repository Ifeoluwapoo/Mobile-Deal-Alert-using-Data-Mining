var productComponent = function (args) {

    var errorToastr = document.getElementById("error-toastr");

    var $this = this;

    this.render = function (product) {

        var productComponentDom = document.getElementById("product-component");
        productComponentDom.setAttribute("cid", product.details[productComponentDom.getAttribute("data-label")]);

        // display image
        var productImage = productComponentDom.querySelector("img");
        productImage.setAttribute("src", product.image);

        // display title
        var productTitle = productComponentDom.querySelector("h5[data-label=\"t\"]");
        productTitle.innerHTML = product.details[productTitle.getAttribute("data-label")];

        // view details link
        var productVisitShopLink = productComponentDom.querySelector("div[visit-shop-link]");
        productVisitShopLink.addEventListener("mousedown", function (evt) {
            if (evt.button == 0) {
                var ref = window.open(encodeURI(product.details.purl), '_blank', 'location=yes');
                console.log(product.details);
            }
        });

        // add to wishlist link
        var productAddWishlistLink = productComponentDom.querySelector("div[add-wishlist-link]");
        productAddWishlistLink.addEventListener("mousedown", function (evt) {
           addItemToWishlist();
        });
    
        addItemToWishlist = function () {
            http.post({
                url: "http://localhost:8020/add-wishlist",
                data: {
                    userID: app.userData._id,
                    productID: product.details.cid,
                    productName: product.details.t,
                    productImage: product.image,
                    productShopUrl: product.details.purl     
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                var result = response.data;
                if(result) {
                     errorToastr.innerHTML = result.message;
                }
            },
            function (error) {
                // app.loader.hide();
                // label.error({
                //     message: "Oops!, something went wrong",
                // });
            });
        }
    };

   
    // app.loader.hide();
    this.render(args.product);

}