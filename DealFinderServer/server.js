var http = require('http');
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var base64encode = require('base64-stream').Encode;
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var iplocate = require('node-iplocate');
var publicIp = require('public-ip');


var urlencodedParser = bodyParser.urlencoded({ extended: false });
var url = "mongodb://localhost:8020/";

var express = require("express");
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

const Database = require("./app/database.js");
const CrawlerController = require("./app/controllers/crawler/crawler.controller.js");
const UserAccountController = require("./app/controllers/useraccount/useraccount.controller.js");
const WishListController = require("./app/controllers/wishlist/wishlist.controller.js");


let crawler = new CrawlerController();
let userAccount = new UserAccountController();
let wishList = new WishListController();

// http://localhost:8020
app.listen(8020, (res) => {
    console.log("Node server is running on port 8020");
});

// http://localhost:8020/setup-db
app.get("/setup-db", (request, response) => {

    // create databse
    database = new Database();
    database.createDatabase("dealfinder_db");
    database.createTable("search");
    database.createTable("user");
    database.createTable("wishlist");

    response.send("Database Setup Completed!");
});

// http://localhost:8020/search/:value
app.get("/search/:value", (request, response) => {
    crawler.crawlWeb(request.params.value, (res) => {
        // send response from google to browser
        response.send(res);
    });

});

app.post("/get-image-data", (request, response) => {
    crawler.getImage(request.body.url, (res) => {
        // send response from google to browser
        response.send(res);
    });
});

// http://localhost:8020/add-wishlist
app.post("/add-wishlist", (request, response) => {
    // execute wishlist

    wishList.addItemToWishlist(request.body, (res) => {
        response.send(res);
    });

});

// http://localhost:8020/get-wishlist
app.post("/get-wishlist/", (request, response) => {
    // execute wishlist 
    wishList.getItemFromWishList(request.body, (res) => {
        response.send(res);
    });

});

// http://localhost:8020/remove-wishlist
app.post("/remove-wishlist/", (request, response) => {
    // execute wishlist 
    wishList.removeItemToWishlist(request.body, (res) => {
        response.send(res);
    });

});

// http://localhost:8020/reminder
app.get("/reminder", (request, response) => {
    wishList.getPriceDrop(request.body, (res) => {
        response.send(res);
    });
    // execute reminder

});

// http://localhost:8020/verify-user
app.post("/verify-user", urlencodedParser, (request, response) => {
    // response.send(request.body);
    userAccount.verifyUser(request.body, (res) => {
        response.send(res);
    });
});


// http://localhost:8020/register-user
app.post("/register-user", (request, response) => {
    userAccount.registerUser(request.body, (res) => {
        response.send(res);
    });
});


// http://localhost:8020/get-country
app.get("/get-country", (request, response) => {
    userAccount.getUserCurrentLocation((res) => {
        response.send(res);
    });
});
