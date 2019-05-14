var http = require('http');
var iplocate = require('node-iplocate');
var publicIp = require('public-ip');

const Database = require("../../database.js");

class UserAccountController {

    constructor() {
        // ...
    }

    registerUser(userData, callback) {
        //calling the database

        let database = new Database();
        let userDetail = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password
        }
        if (userData.email == '' && userData.firstName == '' && userData.lastName == '' && userData.password == '') {
            // Invalid user
            callback({
                statusCode: 404,
                message: "Make sure you fill the textboxes"
            });
        }else{

            let response = database.query("user", {
                query: {
                    email: userData.email
                }
            }, function (response) {
                console.log(response);
                if (response.length == 0) {
                    // Insert new user
                    database.insert("user", userDetail);
                    callback({
                        statusCode: 200,
                        message: "User was Successfully created"
                    });
                } else {
                    if (response.length == 1) {
                        callback({
                            statusCode: 404,
                            message: "User already exist"
                        });
                    }
                    else {
                        if (response.length > 1) {
                            callback({
                                statusCode: 404,
                                message: "Not Found"
                            });
                        }
                    }
                }
    
            })
        }
    }

    verifyUser(user, callback) {
        let database = new Database();
        let response = database.query("user", {
            query: {
                email: user.email
            }
        }, function (response) {
            if (null == response) {
                // Invalid user
                callback({
                    statusCode: 404,
                    message: "Not Found"
                });
            } else {
                if (response.length > 1) {
                    callback({
                        statusCode: 404,
                        message: "Not Found"
                    });
                } else {
                    if (response.length == 1) {
                        var userData = response[0];
                        if (userData.email == user.email && userData.password == user.password) {
                            // valid user
                            callback({
                                statusCode: 200,
                                message: "Found",
                                userData: userData
                            });
                        } else {
                            callback({
                                statusCode: 404,
                                message: "Not Found"
                            });
                        }
                    } else {
                        callback({
                            statusCode: 404,
                            message: "Not Found"
                        });
                    }
                }
            }
        });

    }

    getUserCurrentLocation(callback) {
        http.get({ 'host': 'api.ipify.org', 'port': 80, 'path': '/' }, function (resp) {
            return resp.on('data', function (ip) {
                iplocate(ip).then(function (results) {
                    //response.send(results);
                     console.log(results);
                    callback(results);
                });
            });
        });
    }
}
module.exports = UserAccountController;