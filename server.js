// Serve a request.  Process and validate the url, then deliver the file.
"use strict";

// Database setup
var sql = require("sqlite3");
sql.verbose();
var db = new sql.Database("test.db");

// Global map to be used for session keys and user ids
var userToKey = {};

// Required global variables
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var ports = [8080, 8443];
var banned = defineBanned();
var types = defineTypes();
var OK = 200, Redirect = 307, NotFound = 404, BadType = 415, Error = 500;


/*
 * Starts the server running and sets up the port listening
 */
function start() {
    var httpService = http.createServer(redirectHTTPS);
    httpService.listen(ports[0], 'localhost');
    var options = { key: key, cert: cert };
    var httpsService = https.createServer(options, handle);
    httpsService.listen(ports[1], 'localhost');
    printAddresses();
}


/*
 * Redirects the browser to the https version
 */
function redirectHTTPS(request, response) {
    var url = request.url;
    response.writeHead(Redirect, {
        'Location': 'https://localhost:8443' + url
    });
    response.end();
}


/*
 * Parses the broswer cookies in a manner which allows the session key to be
 * easily separated
 */
function parseCookies(request) {
    var cookieList = {};
    var rc = request.headers.cookie;

    rc = rc.split(';').forEach(function(cookie){
        var parts = cookie.split('=');
        cookieList[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return cookieList;
}


/*
 * Main function for handling any incoming requests
 */
function handle(request, response) {
    var url = request.url;

    console.log(url);

    if(checkSpecialRequests(request, response)) return;

    url = removeQuery(url);
    url = lower(url);
    url = addIndex(url);
    if (! valid(url)) return fail(response, NotFound, "Invalid URL");
    if (! safe(url)) return fail(response, NotFound, "Unsafe URL");
    if (! open(url)) return fail(response, NotFound, "URL has been banned");
    var type = findType(url);
    if (type == null) return fail(response, BadType, "File type unsupported");
    if (type == "text/html") type = negotiate(request.headers.accept);
    reply(response, url, type);
}


/*
 * Check if any special requests were made, return true if so, else false
 */
function checkSpecialRequests(request, response) {
    // Get necessary cookie information
    var cookieList, key, userId;
    var headerobject = request.headers;
    var rc = request.headers.cookie;
    if(rc !== undefined) {
        cookieList = parseCookies(request);
        key = cookieList.sessionid;
        userId = userToKey[key];
    }
    var url = request.url;


    // Check if trying to login and do so
    if(starts(url, "/login")) {
        parseLogin(request, response);
        return true;
    }
    // Check if trying to create account and do so
    else if(starts(url, "/create-account")) {
        parseSignup(request, response);
        return true;
    }
    // Check if user is logged in and if so return username
    else if(starts(url, "/loggedin")) {
        if(rc === undefined) deliverData(response, false);
        else deliverUsername(response, userId);
        return true;
    }
    // Check if trying to log out and do so
    else if(starts(url, "/logout")) {
        if(rc === undefined) console.log("freak situation");
        else logOut(response, key);
        return true;
    }
    // Check if trying to retrieve user info and do so
    else if(starts(url, "/get-user-info") && (rc != undefined || key === 0)) {
        deliverInfo(response, key);
        return true;
    }
    // Check if trying to purchase a ticket and do so
    else if(starts(url, "/purchaseticket?")) {
        if(rc === undefined) deliverData(response, false);
        else {
            var urlParts = url.split("?");
            var ticketType = urlParts[1];
            makePurchase(ticketType, userId, response);
        }
        return true;
    }
    // Check if trying to get ticket info and do so
    else if(starts(url, "/gettickets")) {
        if(rc === undefined) deliverData(response, false);
        else getTickets(userId, response);
        return true;
    }

    // Return false if no special cases were found
    return false;
}


/*
 * Get ticket information for a given user
 */
function getTickets(userId, response) {
    var numTickets1, numTickets2, numTickets3;

    var ps = db.prepare("SELECT (SELECT COUNT(*) FROM PurchasedTicket WHERE user = ? and ticketType = 1) AS numTickets1, " +
        "(SELECT COUNT(*) FROM PurchasedTicket WHERE user = ? and ticketType = 2) AS numTickets2, " +
            "(SELECT COUNT(*) FROM PurchasedTicket WHERE user = ? and ticketType = 3) AS numTickets3");

    ps.get(userId, userId, userId, sendNumTickets);

    // Send the number of each tickets back
    function sendNumTickets(err, rows) {
        if(err) throw err;
        if(rows == undefined) {
            deliverData(response, false);
            return;
        }
        else {
            response.writeHead(OK, {'Content-Type' : 'text/plain' });
            var objectString = JSON.stringify(rows);
            response.write(objectString);
            response.end();
            return;
        }
    }
}


/*
 * Log out the user by setting empty cookie and removing from list
 */
function logOut(response, key) {
    delete userToKey[key];
    response.writeHead(OK, {
        'Set-Cookie' : "0",
        'Content-Type' : 'text/plain'});
    response.write("loggedout");
    response.end();
}


/*
 * Make a purchase of a ticket by adding to the tickets purchased table
 */
function makePurchase(ticketType, userId, response) {
    var ticketId;
    if(ticketType === "ewok-purchase")          ticketId = 1;
    else if(ticketType === "rebel-purchase")    ticketId = 2;
    else if(ticketType === "jedi-purchase")     ticketId = 3;

    var ps = db.prepare("INSERT INTO PurchasedTicket (user, ticketType) " +
       "VALUES(?, ?)");

   ps.run(userId, ticketId);
   ps.finalize(writeResponse);

   function writeResponse() {
       response.writeHead(OK, {'Content-Type' : 'text/plain'});
       response.write("writtenticket");
       response.end();
   }
}


/*
 * Generates a random session key (sha256)
 */
function generateKey(response) {
    var crypto = require("crypto");
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
}


/*
 * Parse the login information and check if exists etc
 */
function parseLogin(request, response) {
    // Extract the entered parameters from the login field
    var QS = require('querystring');
    var params = QS.parse(require('url').parse(request.url).query);
    checkUserExists(params, response);
}


/*
 * Deliver the logged in username in the resonse
 */
function deliverUsername(response, userId) {
    var ps = db.prepare("SELECT username FROM USER WHERE id = ?");
    ps.get(userId, findUser);
    function findUser(err, rows) {
        if(err) throw err;

        if(rows == undefined) {
            deliverData(response, false);
            return;
        }
        else {
            response.writeHead(OK, {'Content-Type' : 'text/plain' });
            response.write(rows.username);
            response.end();
            return;
        }
    }
}


/*
 * Check if the user exists for a given login username password combination
 */
function checkUserExists(params, response) {
    var username = params.username;
    var password = params.password;

    var user = {};
    // Prepared Statement to stop SQL injection
    var ps = db.prepare("SELECT * FROM User WHERE username = ? AND password = ?");
    ps.get(username, password, findUser);

    function findUser(err, rows) {
        if(err) throw err;

        if(rows == undefined) {
            deliverData(response, false);
            return;
        }
        else {
            var key = generateKey(response);
            userToKey[key] = rows.id;
            response.writeHead(OK, {
                'Set-Cookie' : 'sessionid=' + key,
                'Content-Type' : 'text/plain'
            });
            response.write(rows.username);
            response.end();
            return;
        }
    }
}


/*
 * Deliver response information depending on whether query successful or not
 */
function deliverData(response, worked) {
    if(worked) {
        response.end();
        return;
    }
    else {
        deliverEmpty(response);
        return;
    }
}


/*
 * Delivers an empty resonse to indicate unsuccessful db query
 */
function deliverEmpty(response) {
    response.writeHeader(OK, {'Content-Type' : 'text/plain'});
    response.write("nf");
    response.end();
}


/*
 * Delivers user information response
 */
function deliverInfo(response, key) {
    var user = userToKey[key];
    getInfo(user, response);
}


/*
 * Get user info from a given user id
 */
function getInfo(user, response) {
    var ps = db.prepare("SELECT * FROM User WHERE id = ?");
    ps.get(user, getUser);
    function getUser(err, rows) {
        if(err) throw err;
        if(rows === undefined) {
            deliverEmpty(response);
        }
        else {
            var userString = JSON.stringify(rows);
            response.writeHeader(OK, {'Content-Type' : 'text/plain'});
            response.write(userString);
            response.end();
        }
    }
}


/*
 * Parses the sign up request to make suitable db query
 */
function parseSignup(request, response) {
    var QS = require('querystring');
    var params = QS.parse(require('url').parse(request.url).query);
    clash(params, response);
}


/*
 * Check if username is already taken
 */
function clash(params, response) {
    var username = params.username;
    var ps = db.prepare("SELECT id FROM User WHERE username=?");
    ps.get(username, check);

    function check(err, rows) {
        if(err) throw err;
        if(rows === undefined) {
            writeSignup(params, response);
        }
        else {
            response.writeHead(OK, {'Content-Type' : 'text/plain'});
            response.write("taken");
            response.end();
        }
    }

}


/*
 * Write the new user to db based on the sign up info
 */
function writeSignup(params, response) {
    var fname = params.fname, lname = params.lname, username = params.username,
        email = params.email, password = params.password, gender = params.gender;
    var ps = db.prepare('INSERT INTO User (fname, lname, username, email, password, gender) ' +
       'VALUES(?, ?, ?, ?, ?, ?)');
    ps.run(fname, lname, username, email, password, gender);
    ps.finalize(writeResponse);

    function writeResponse() {
        response.writeHead(OK, {'Content-Type' : 'text/plain'});
        response.end();
    }
}


/*
 * Remove query part of a URL
 */
function removeQuery(url) {
    var n = url.indexOf('?');
    if (n >= 0) url = url.substring(0, n);
    return url;
}


/*
 * Read and deliver url as file within site
 */
function reply(response, url, type) {
    var file = "." + url;
    fs.readFile(file, deliver.bind(null, response, type));
}


/*
 * Deliver the file that has been read into the browser
 */
function deliver(response, type, err, content) {
    if (err) return fail(response, NotFound, "File not found");
    var typeHeader = { 'Content-Type': type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}


// Do content negotiation, assuming all pages on the site are XHTML and
// suitable for dual delivery.  Check whether the browser claims to accept the
// XHTML type and, if so, use that instead of the HTML type.
function negotiate(accept) {
    var htmlType = "text/html";
    var xhtmlType = "application/xhtml+xml";
    var accepts = accept.split(",");
    if (accepts.indexOf(xhtmlType) >= 0) return xhtmlType;
    else return htmlType;
}


/*
 * Print addresses based on ports in terminal
 */
function printAddresses() {
    var httpAddress = "http://localhost";
    if (ports[0] != 80) httpAddress += ":" + ports[0];
    httpAddress += "/";
    var httpsAddress = "https://localhost";
    if (ports[1] != 443) httpsAddress += ":" + ports[1];
    httpsAddress += "/";
    console.log('Server running at', httpAddress, 'and', httpsAddress);
}


/*
 * Convert to lower case
 */
function lower(url) {
    return url.toLowerCase();
}


/*
 * Add index to end of url
 */
function addIndex(url) {
    if (ends(url, '/')) url = url + "index.html";
    return url;
}


/*
 * Find type of url
 */
function findType(url) {
    var dot = url.lastIndexOf(".");
    var extension = url.substring(dot);
    return types[extension];
}


/*
 * Give minimal failure response to the browser
 */
function fail(response, code, text) {
    var textTypeHeader = { 'Content-Type': 'text/plain' };
    response.writeHead(code, textTypeHeader);
    response.write(text, 'utf8');
    response.end();
}


/*
 * Avoid delivering server file, also ban upper case
 */
function defineBanned() {
    var banned = ["/server.js"];
    banUpperCase(".", banned);
    return banned;
}


// Validate the URL.  It must start with / and not contain /. or // so
// that /../ and /./ and file or folder names starting with dot are excluded.
// Also a final name with no extension is rejected.
function valid(url) {
    if (! starts(url, "/")) return false;
    if (url.indexOf("//") >= 0) return false;
    if (url.indexOf("/.") >= 0) return false;
    if (ends(url, "/")) return true;
    if (url.lastIndexOf(".") < url.lastIndexOf("/")) return false;
    return true;
}


/*
 * Bans upper case
 */
function banUpperCase(folder, banned) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) {
            banned.push(file.substring(1));
        }
        var mode = fs.statSync(file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(file, banned);
    }
}


// Restrict the url to visible ascii characters, excluding control characters,
// spaces, and unicode characters beyond ascii.  Such characters aren't
// technically illegal, but (a) need to be escaped which causes confusion for
// users and (b) can be a security risk.
function safe(url) {
    var spaceCode = 32, deleteCode = 127;
    if (url.length > 1000) return false;
    for (var i=0; i<url.length; i++) {
        var code = url.charCodeAt(i);
        if (code > spaceCode && code < deleteCode) continue;
        return false;
    }
    return true;
}

// Protect any resources which shouldn't be delivered to the browser.
function open(url) {
    for (var i=0; i<banned.length; i++) {
        var ban = banned[i];
        if (url == ban || ends(ban, "/") && starts(url, ban)) {
            return false;
        }
    }
    return true;
}


// Check whether a string starts with a prefix, or ends with a suffix.  (The
// starts function uses a well-known efficiency trick.)
function starts(s, x) { return s.lastIndexOf(x, 0) == 0; }
function ends(s, x) { return s.indexOf(x, s.length-x.length) >= 0; }


function defineTypes() {
    return {
        '.html' : 'text/html, application/xhtml+xml',
        '.css'  : 'text/css',
        '.js'   : 'application/javascript',
        '.png'  : 'image/png',
        '.mp3'  : 'audio/mpeg', // audio
        '.aac'  : 'audio/aac',  // audio
        '.mp4'  : 'video/mp4',  // video
        '.webm' : 'video/webm', // video
        '.gif'  : 'image/gif',  // only if imported unchanged
        '.jpeg' : 'image/jpeg', // only if imported unchanged
        '.svg'  : 'image/svg+xml',
        '.json' : 'application/json',
        '.pdf'  : 'application/pdf',
        '.txt'  : 'text/plain', // plain text only
        '.ttf'  : 'application/x-font-ttf',
        '.xhtml': '#not suitable for dual delivery, use .html',
        '.htm'  : '#proprietary, non-standard, use .html',
        '.jpg'  : '#common but non-standard, use .jpeg',
        '.rar'  : '#proprietary, non-standard, platform dependent, use .zip',
        '.docx' : '#proprietary, non-standard, platform dependent, use .pdf',
        '.doc'  : '#proprietary, non-standard, platform dependent, ' +
        'closed source, unstable over versions and installations, ' +
        'contains unsharable personal and printer preferences, use .pdf',
    };
}


// A dummy key and certificate are provided for https.
// They should not be used on a public site because they are insecure.
// They are effectively public, which private keys should never be.
var key =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIICXAIBAAKBgQDGkGjkLwOG9gkuaBFj12n+dLc+fEFk1ns60vsE1LNTDtqe87vj\n" +
    "3cTMPpsSjzZpzm1+xQs3+ayAM2+wkhdjhthWwiG2v2Ime2afde3iFzA93r4UPlQv\n" +
    "aDVET8AiweE6f092R0riPpaG3zdx6gnsnNfIEzRH3MnPUe5eGJ/TAiwxsQIDAQAB\n" +
    "AoGAGz51JdnNghb/634b5LcJtAAPpGMoFc3X2ppYFrGYaS0Akg6fGQS0m9F7NXCw\n" +
    "5pOMMniWsXdwU6a7DF7/FojJ5d+Y5nWkqyg7FRnrR5QavIdA6IQCIq8by9GRZ0LX\n" +
    "EUpgIqE/hFbbPM2v2YxMe6sO7E63CU2wzSI2aYQtWCUYKAECQQDnfABYbySAJHyR\n" +
    "uxntTeuEahryt5Z/rc0XRluF5yUGkaafiDHoxqjvirN4IJrqT/qBxv6NxvKRu9F0\n" +
    "UsQOzMpJAkEA25ff5UQRGg5IjozuccopTLxLJfTG4Ui/uQKjILGKCuvnTYHYsdaY\n" +
    "cZeVjuSJgtrz5g7EKdOi0H69/dej1cFsKQJBAIkc/wti0ekBM7QScloItH9bZhjs\n" +
    "u71nEjs+FoorDthkP6DxSDbMLVat/n4iOgCeXRCv8SnDdPzzli5js/PcQ9kCQFWX\n" +
    "0DykGGpokN2Hj1WpMAnqBvyneXHMknaB0aXnrd/t7b2nVBiVhdwY8sG80ODBiXnt\n" +
    "3YZUKM1N6a5tBD5IY2kCQDIjsE0c39OLiFFnpBwE64xTNhkptgABWzN6vY7xWRJ/\n" +
    "bbMgeh+dQH20iq+O0dDjXkWUGDfbioqtRClhcyct/qE=\n" +
    "-----END RSA PRIVATE KEY-----\n";

var cert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIClTCCAf4CCQDwoLa5kuCqOTANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMC\n" +
    "VUsxDTALBgNVBAgMBEF2b24xEDAOBgNVBAcMB0JyaXN0b2wxDDAKBgNVBAoMA1VP\n" +
    "QjEZMBcGA1UECwwQQ29tcHV0ZXIgU2NpZW5jZTESMBAGA1UEAwwJbG9jYWxob3N0\n" +
    "MSEwHwYJKoZIhvcNAQkBFhJub25lQGNzLmJyaXMuYWMudWswHhcNMTMwNDA4MDgy\n" +
    "NjE2WhcNMTUwNDA4MDgyNjE2WjCBjjELMAkGA1UEBhMCVUsxDTALBgNVBAgMBEF2\n" +
    "b24xEDAOBgNVBAcMB0JyaXN0b2wxDDAKBgNVBAoMA1VPQjEZMBcGA1UECwwQQ29t\n" +
    "cHV0ZXIgU2NpZW5jZTESMBAGA1UEAwwJbG9jYWxob3N0MSEwHwYJKoZIhvcNAQkB\n" +
    "FhJub25lQGNzLmJyaXMuYWMudWswgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGB\n" +
    "AMaQaOQvA4b2CS5oEWPXaf50tz58QWTWezrS+wTUs1MO2p7zu+PdxMw+mxKPNmnO\n" +
    "bX7FCzf5rIAzb7CSF2OG2FbCIba/YiZ7Zp917eIXMD3evhQ+VC9oNURPwCLB4Tp/\n" +
    "T3ZHSuI+lobfN3HqCeyc18gTNEfcyc9R7l4Yn9MCLDGxAgMBAAEwDQYJKoZIhvcN\n" +
    "AQEFBQADgYEAQo4j5DAC04trL3nKDm54/COAEKmT0PGg87BvC88S5sTsWTF4jZdj\n" +
    "dgxV4FeBF6hW2pnchveJK4Kh56ShKF8SK1P8wiqHqV04O9p1OrkB6GxlIO37eq1U\n" +
    "xQMaMCUsZCWPP3ujKAVL7m3HY2FQ7EJBVoqvSvqSaHfnhog3WpgdyMw=\n" +
    "-----END CERTIFICATE-----\n";


// Start everything going.
start();
