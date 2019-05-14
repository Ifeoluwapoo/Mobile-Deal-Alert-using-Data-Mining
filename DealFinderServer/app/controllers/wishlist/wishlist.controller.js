var cheerio = require('cheerio');
const Database = require("../../database.js");

class WishListController {
    addItemToWishlist(wishlistData, callback) {
        //calling the database

        let database = new Database();
        let today =  new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
        //function add new wish list
        function addItem() {
            let wishlistDetail = {
                userId: wishlistData.userID,
                productId: wishlistData.productID,
                productName: wishlistData.productName,
                productShopUrl: wishlistData.productShopUrl,
                productImage: wishlistData.productImage,
                date: today,
            };
            database.insert("wishlist", wishlistDetail);
        }
        //Check if the item exist on user wishlist
        let response = database.query("wishlist", {
            query: {
                userId: wishlistData.userID,
            }
        }, function (response) {
            // console.log(response);
            if (response.length == 0) {
                // Insert new wishlist
                addItem();
                callback({
                    statusCode: 200,
                    message: "Item was Successfully added"
                });
            } else {
                var wishlist = response;
                if (wishlist.length > 0) {
                    var wishListItem = null;
                    Array.prototype.forEach.call(wishlist, function (item) {
                        if (item.userId == wishlistData.userID && item.productId == wishlistData.productID) {
                            wishListItem = item;
                        }
                    });
                    if(wishListItem != null) {
                        callback({
                            statusCode: 304,
                            message: "Item already exist in your wishlist",
                        });
                    } else {
                        // Insert new wishlist
                        addItem();
                        callback({
                            statusCode: 200,
                            message: "Item was Successfully added"
                        });
                    }
                }
            }
        }

        );
    }

    getItemFromWishList(user, callback){
        let database = new Database();

        var date = new Date();
        date.setDate(date.getDate()-31);
 
        // { status: "A", qty: { $lt: 30 } }
        let response = database.query("wishlist", {
            query: {
                userId: user.userID,
                date: { $gt: date }
            }
        }, function (response) {
            //console.log(response);
            if (response.length == 0) {
                callback({
                    statusCode: 404,
                    message: "Sorry you have no item in your wishlist"
                });

            } else {

                var wishlist = response;
                if (wishlist.length > 0) {
                    callback({
                        statusCode: 200,
                        message: "Found",
                        wishlist: wishlist
                    });
                }
            }
        }

        );
    }

//Remove items from Wishlist

removeItemToWishlist(user, callback){
    console.log(user);
    let database = new Database();

     let response = database.query("wishlist", {
        query: {
            userId: user.userID,
        }
    }, function (response) {
        if (response.length == null) {
            callback({
                statusCode: 404,
                message: "Sorry, you have no item in the wishlist"
            });
        }
        if (response.length == 0) {
            callback({
                statusCode: 404,
                message: "Sorry, you have no item in the wishlist"
            });
        } else {
            var wishlist = response;
                if (wishlist.length > 0) {

                 var wishListItem = null;
                    Array.prototype.forEach.call(wishlist, function (item) {
                        if (item.userId == user.userID && item.productId == user.productID) {
                            wishListItem = item;
                        }
                    });
                    if(wishListItem != null) {
                        database.delete("wishlist", wishListItem);
                        callback({
                            statusCode: 200,
                            message: "Item has been deleted from wishlist",

                        });
                    }
            }
        }
    }

    );
  }

  getPriceDrop(user, callback){
    let database = new Database();

    var date = new Date();
    date.setDate(date.getDate()-31);

    let response = database.query("wishlist", {
        query: {
            userId: user.userID,
            date: { $gt: date }
        }
    }, function (response) {
        if (response.length == 0) {
            callback({
                statusCode: 404,
                message: "Sorry you have no item in your wishlist"
            });
        } else {

            var wishlist = response;
            if (wishlist.length > 0) {

             var wishListItem = null;
                Array.prototype.forEach.call(wishlist, function (item) {
                    if (item.userId == user.userID && item.productId == user.productID) {

                        request(item.productShopUrl, function(error, response, body) {
                            var $ = cheerio.load(body);
                            var actualPrice = $('.price').text();
                            var dropPrice = actualPrice.replace('$', '').replace(',', '');
                            console.log(dropPrice);
                         });
                        
                        wishListItem = item;
                    }
                });
                if(wishListItem != null) {
                    callback({
                        statusCode: 200,
                        message: "Item has drop in price",

                    });
                }
            }
        }
    }

    );
    
  }
}
module.exports = WishListController;