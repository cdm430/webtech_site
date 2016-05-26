"use strict";
var sql = require("sqlite3");
sql.verbose();
var db = new sql.Database("test.db");
db.serialize(startup);

function startup() {
    db.run("DROP TABLE IF EXISTS User");
    db.run("CREATE TABLE User (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "fname VARCHAR(100) NOT NULL," +
        "lname VARCHAR(100) NOT NULL" +
        "username VARCHAR(100) NOT NULL, " +
        "password VARCHAR(100) NOT NULL," +
        "gender VARCHAR(10) NOT NULL),"
        , err);
    db.run("INSERT INTO User (fname, lname, username, password, gender) " +
        "VALUES ('Liam', 'White', 'Liam121', 'wales', 'male')", err);
    db.run("INSERT INTO User (fname, lname, username, password, gender) " +
        "VALUES ('Chris', 'Meehan', 'Chris72', 'england', 'male')", err);
    db.close();
}

function err(e) {if (e) throw e; }
