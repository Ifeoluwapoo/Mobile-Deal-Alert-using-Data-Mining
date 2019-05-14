var wishListComponent = function (args) {

  var errorToastr = app.toastr("error-toastr");

  // var date = new Date();
  //     date.setDate(date.getDate()-15);

  // console.log(date);


  //Harburger click
  var hamburgerButton = document.getElementById("hamburger-button");
  hamburgerButton.addEventListener("mousedown", function (evt) {
    document.getElementById("getUser").innerHTML = "Hello, " + app.userData.firstName;
    slidableMenuPanel.classList.add("show-slidable-panel");
    evt.cancelBubble = true;
    evt.preventDefault();
  });

  var slidableMenuPanel = document.getElementById("slidable-menu-panel");
  window.addEventListener("mousedown", function (event) {
    slidableMenuPanel.classList.remove("show-slidable-panel");
  });

  getList = function() {
    errorToastr.setText("Items more than 30 days are removed automatically");
    var items = app.wishlist;
    if (items != null) {
      // var before = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 14).toISOString();
      // items = items.filter(function (item) {
      //   return (item.date !== before);
      // });
      var wishListDOMObject = document.getElementById("wish-list-page");
      wishListDOMObject.clear();
      items.forEach(function (item) {

        var productContainer = document.createElement("a");
        productContainer.addEventListener("mousedown", function (evt) {
          var ref = window.open(encodeURI(item.productShopUrl), '_blank', 'location=yes');
        });
        productContainer.id = 'product-Name';
        productContainer.href = '#';
        productContainer.className = 'list-group-item list-group-item-action wishListContent';
        var product_Image = document.createElement("img");
        product_Image.src = item.productImage;
        var product = document.createElement("div");
        product.className = 'd-flex w-100 justify-content-between';
        var productNam = document.createElement("h3");
        productNam.className = 'mb-1';
        var textproductName = document.createTextNode(item.productName);
        productNam.appendChild(textproductName);
        product.appendChild(productNam);

        var shopUrl = document.createElement("p");
        shopUrl.id = 'linkUrl';
        shopUrl.className = 'mb-1';
        var textshopUrl = document.createTextNode(item.productShopUrl);
        shopUrl.appendChild(textshopUrl);

        var removeItem = document.createElement("button");
        removeItem.addEventListener("mousedown", function (evt) {
          removeItemToWishlist(item);
        });
        removeItem.id = 'removeId';
        removeItem.className = 'wishlistRemoveButton';
        removeItem.innerHTML = 'remove';

        productContainer.appendChild(product_Image);
        productContainer.appendChild(product);
        productContainer.appendChild(shopUrl);
        wishListDOMObject.appendChild(productContainer);
        wishListDOMObject.appendChild(removeItem);
      });
    }

  }
  removeItemToWishlist = function (item) {
    http.post({
      url: "http://localhost:8020/remove-wishlist",
      data: {
        userID: app.userData._id,
        productID: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        productShopUrl: item.productShopUrl
      },
      header: [{
        key: "Content-Type",
        value: "application/x-www-form-urlencoded; charset=UTF-8"
      }]
    },
      function (response) {
        app.loader.hide();
        var result = response.data;
        if (result) {
          errorToastr.setText(result.message);
          errorToastr.show();
          app.getItemFromWishList(getList);
        }
      },
      function (error) {
        // app.loader.hide();
        // label.error({
        //     message: "Oops!, something went wrong",
        // });
      });

  }
  //Redirect to dashboard page
  var nameLinkButton = document.getElementById("name-btn");
  nameLinkButton.addEventListener("mousedown", function (evt) {
    http.load({
      path: "components/master.details/master.details.component.html",
      canvas: document.getElementById("app-root"),
      component: masterDetailsComponent,
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

  document.onload = getList();

};


