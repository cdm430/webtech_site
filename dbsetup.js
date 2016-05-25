"use strict";
var sql = require("sqlite3");
sql.verbose();
var db = new sql.Database("test.db");
db.serialize(startup);

function startup() {
    db.run("DROP TABLE IF EXISTS User");
    db.run("CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL)", err);
    db.run("INSERT INTO User (username, password) VALUES ('Liam121', 'wales')", err);
    db.run("INSERT INTO User (username, password) VALUES ('Chris72', 'england')", err);
    db.close();
}

function err(e) {if (e) throw e; }
