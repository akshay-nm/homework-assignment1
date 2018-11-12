/**
 * Homework Assignment
*/

// Dependencies
var http = require('http');
var url = require('url');
var config = require('./config')

// Instantiating the HTTP server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function() {
    console.log("HTTP Server running!\nPort: " + config.httpPort)
});

// All the server logic
var unifiedServer = function(req, res) {

    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path from the url
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    req.on('data',function(){});
    req.on('end', function() {
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath
        };

        chosenHandler(data, function(statusCode, payload){

            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            
            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(payloadString);
        })
    })
}

// Define the handlers
var handlers = {}

// Hello World handler
handlers.helloWorld = function(data, callback) {
    callback(200, {'reply': 'hello world'});
} 

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
}

// Define the router
var router = {
    'helloWorld' : handlers.helloWorld
}
