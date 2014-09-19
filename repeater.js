// This is a simple "repeater" type job that takes some input, does some
// checking, and spews it over to Slack.  The idea here is that we can
// just spew notifications to one place, and have one Slack key to
// manage, rather than managing things for every single last node/other
// application we write.
//
// SSL is used for that minty fresh secure feeling.

// Setup for our server
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var bodyParser = require('body-parser');
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(bodyParser.json());
var httpsServer = https.createServer(credentials, app);

// Setup for our posting to Slack
// Change url as necessary, ensuring token is included
var request = require('request');
var url = '';

// Just a brief message if someone accidently GETs /
app.get('/', function(req, res){
	res.status(200).send('<h3>Slack Repeater</h3><p>You need to POST, man.  Cry havoc, and let slip the notifications for Slack!</p>');
});

// Handle POST to /
app.post('/', function(req, res){
	var emoji = req.body.icon_emoji;
	var attach = req.body.attachments;
	if(!req.body.channel) {
		res.status(400).send("Message rejected - missing 'channel' parameter.");
	} else if (!req.body.username) {
		req.status(400).send("Message rejected - missing 'username' parameter.");
	} else if (!req.body.text) {
		req.status(400).send("Message rejected - missing 'text' parameter.");
	} else {
		if(!emoji) {
			emoji = ':ghost:';
		} 
		var data = {
			channel: req.body.channel,
			username: req.body.username,
			text: req.body.text,
			icon_emoji: emoji,
			attachments: attach
		}
		request.post(url, {
			form: {
				payload: JSON.stringify(data)
			}
		}, function(err, response) {
			// We could probably use some better error logging here.
			if(err) {
				console.log(err);
			}
			if (response.body !== 'ok') {
				console.log(err);
			}
		});		
		res.status(200).send('Accepted!');
	}
});

// Handle 404
app.use(function(req, res, next){
	res.status(404).send("<h3>Invalid page.</h3><p>Your page ain't here, man.  Your page ain't here.</p>");
});

// Start up our server
httpsServer.listen(8000);
