var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

class Database {

    constructor() {
        // ...
        // this._database = database;
    }

    createDatabase() {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        });
    }

    // createDatabase(databaseName) {
    //     MongoClient.connect(url, function (err, db) {
    //         if (err) throw err;
    //         dbo = db.db(databaseName);
    //     });
    // }

    createTable(tableName) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.createCollection(tableName, function (err, res) {
                if (err) throw err;
                console.log("Collection created!");
                db.close();
            });
        });
    }

    dropTable(tableName) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).drop(function (err, delOK) {
                if (err) throw err;
                if (delOK) console.log("Collection deleted");
                db.close();
            });
        });
    }

    insert(tableName, data) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            if (Array.isArray(data)) {
                dbo.collection(tableName).insertMany(data, function (err, res) {
                    if (err) throw err;
                    console.log(data.length + ((data.length > 1) ? " records" : " record") + " inserted");
                    db.close();
                });
            } else {
                dbo.collection(tableName).insertOne(data, function (err, res) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    db.close();
                });
            }
        });
    }

    firstOrDefault(tableName) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).findOne({}, function (err, res) {
                if (err) throw err;
                db.close();
                return res;
            });
        });
    }

    query(tableName, options, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            if ((null != options) && ("query" in options)) {
                if (Array.isArray(options.query)) {
                    //
                } else {
                    console.log(options.query);
                    dbo.collection(tableName).find(options.query).toArray(function (err, res) {
                        if (err) throw err;
                        db.close();
                        callback(res);
                    });
                }
            }

        });
    }

    queryWithDate(tableName, options, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            if ((null != options) && ("query" in options)) {
                    console.log(options.query);
                    dbo.collection(tableName).find({ status: "A", qty: { $lt: 30 } }).toArray(function (err, res) {
                        if (err) throw err;
                        db.close();
                        callback(res);
                    });
            }

        });
    }

    sort(tableName, sort) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).find().sort(sort).toArray(function (err, res) {
                if (err) throw err;
                db.close();
                return res;
            });
        });
    }

    delete(tableName, query) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).deleteOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 record deleted");
                db.close();
            });
        });
    }

    deleteAll(tableName, query) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).deleteMany(query, function (err, obj) {
                if (err) throw err;
                console.log(obj.result.n + ((obj.result.n > 1) ? " records" : " record") + " deleted");
                db.close();
            });
        });
    }

    // update("customer", {name: "ife"}, {name: "Oluwapo"});
    update(tableName, query, set) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("dealfinder_db");
            dbo.collection(tableName).updateOne(query, {
                $set: set
            }, function (err, res) {
                if (err) throw err;
                console.log("1 record updated");
                db.close();
            });
        });
    }

}
module.exports = Database;