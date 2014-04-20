var http = require('http');
var url = require('url');

var sendFileToFront = require('send_file');
var frontEndFiles = __dirname + "\\front_files";

http.createServer(function(req, res) {

    console.log("Request: " + req.url);

    switch (req.url) {

        case '/': 
            sendFileToFront(frontEndFiles, "index.html", res);
            break;

        case '/api':
            var body = '';

            req
                .on('readable', function () {

                    body += req.read();

                    if (body.length > 1e4) {
                        res.statusCode = 413;
                        res.end("Your message is too big");
                    }
                })
                .on('end', function () {

                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        res.statusCode = 400;
                        res.end("Bad Request");
                        return;
                    }

                    res.end("ok");
                });

            break;

        default:
            sendFileToFront(frontEndFiles, url.parse(req.url).pathname, res);
    };


}).listen(3000);

console.log("Server run and listening http://localhost:3000");