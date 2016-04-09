slack-repeater
==============

A repeater microservice for posting messages to Slack channels via the Slack 
API.  SSL is used for a minty fresh secure feeling, that fights plaque and lasts all day.

This is intended to be used on an internal network, ergo, no authentication is used by the repeater.  Be aware.

### Installation

Installation should be performed under a normal user with access to node.js, ideally via nvm.

After checkout, install the required modules:

```
npm install
```

Next, generate a SSL certificate.

```
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365
```

Configure the Slack endpoint in repeater.js.  This is the 'var url' line, and should look something like the following:

```
var url = 'https://hooks.slack.com/services/<STUFF>/<MORESTUFF>/<EVENMORESTUFF>';
```

The full URL string will be given to you when you set up an incoming webhook for Slack.

You can also adjust the port if necessary; it defaults to 8000.

Install the systemd startup script, located at scripts/slack-repeater.service.  This should be located under /etc/systemd/system.  Note that you should change the parameters within the script accordingly to take into account the user the repeater is being installed under.

Finally, start it up.  As root:

```
systemctl enable slack-repeater
systemctl start slack-repeater
```

### Testing and Use

You can use the repeater by posting a payload including a channel, username, text, icon_emoji and attachments array.  icon_emoji and attachments are optional, but the other fields are required.  Example:

```
curl -kX POST -H "Content-Type: application/json" -d '{"channel": "quicktest", "username": "SlackRepeater", "text": "Test message, please ignore.", "icon_emoji": ":coffee:"}' https://127.0.0.1:8000
```
