var productsComponent = function (args) {

    var $this = this;

    // app.loader.hide();
    var productsComponentDom, productsList, dom;

    var localStorage = [];

    getImage = function (url, callback) {
        http.post({
                url: "http://localhost:8020/get-image-data",
                data: {
                    url: url
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                // app.loader.hide();
                callback(response.data);
            },
            function (error) {
               
            });
    };

    this.render = function (products) {
        Array.prototype.forEach.call(products, function (product) {
            
            localStorage[product["details"]["cid"]] = product;

            var productDOMNode = dom.firstChild.cloneNode(true);
            productDOMNode.setAttribute("cid", product.details[productDOMNode.getAttribute("data-label")]);

            // display image
            var productImage = productDOMNode.querySelector("img");
            productImage.setAttribute("src", product.image);

            // display shop link
            var productUrl = productDOMNode.querySelector("a");
            productUrl.addEventListener("mousedown", function (evt) {
                if (evt.button == 0) {
                    args.root.showDetailsCallout();
                    $this.viewDetails(productDOMNode.getAttribute("cid"));
                }
            });

            // view details link
            var productViewDetailsLink = productDOMNode.querySelector("div[view-details-link]");
            productViewDetailsLink.addEventListener("mousedown", function (evt) {
                if (evt.button == 0) {
                    args.root.showDetailsCallout();
                    $this.viewDetails(productDOMNode.getAttribute("cid"));
                }
            });
            // Add to wishlist
            var productAddWishlistLink = productDOMNode.querySelector("div[add-wishlist-link]");
            productAddWishlistLink.addEventListener("mousedown", function (evt) {
                var product = localStorage[productDOMNode.getAttribute("cid")];
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
                                // errorToastr.innerHTML = result.message;
                                alert(result.message);
                            }
                        },
                        function (error) {
                            
                        });
            });

            productsList.appendChild(productDOMNode);
        });
    };

    this.viewDetails = function (cid) {
        http.load({
            path: "components/products/product.component.html",
            canvas: document.getElementById("details-callout-view-panel"),
            component: productComponent,
            param: {
                root: $this,
                product: localStorage[cid]
            }
        });
    };
   

    productsComponentDom = document.getElementById("products-component");
    productsList = productsComponentDom.querySelector("div[data-section='product-list']");

    dom = document.createElement('div');
    dom.appendChild(productsList.querySelector("div[data-section='product-item']"));

    productsList.innerHTML = "";

    this.render(args.products);

};