var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

var ports = [8080, 8443];
var types = defineTypes();
var OK = 200, Redirect = 307, NotFound = 404, BadType = 415, Error = 500;

function start() {
    //test();
    var httpService = http.createServer(serve);
    httpService.listen(ports[0], 'localhost');
    var options = { key: key, cert: cert };
    var httpsService = https.createServer(options, serve);
    httpsService.listen(ports[1], 'localhost');
    printAddresses();
}


function serve(request, response) {
    var file = request.url;
    url = lower(url);
    url = addIndex(url);
    validateURL(url);

}


function printAddresses() {
    var httpAddress = "http://localhost";
    if (ports[0] != 80) httpAddress += ":" + ports[0];
    httpAddress += "/";
    var httpsAddress = "https://localhost";
    if (ports[1] != 443) httpsAddress += ":" + ports[1];
    httpsAddress += "/";
    console.log('Server running at', httpAddress, 'and', httpsAddress);
}


function lower(url) {
    return url.toLowerCase();
}


function addIndex(url) {
    if (ends(url, '/')) url = url + "index.html";
    return url;
}


function validateURL(url) {

}





















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