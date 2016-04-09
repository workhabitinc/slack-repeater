// Copyright (c) 2016 - WorkHabit, Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without 
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, 
// this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, 
// this list of conditions and the following disclaimer in the documentation 
// and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors
// may be used to endorse or promote products derived from this software without
// specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.

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
var port = 8000;

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
				console.log("Error: " + err);
			}
			if (response.body !== 'ok') {
				console.log("Error from Slack: " + response.body);
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
httpsServer.listen(port);
