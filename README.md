slack-repeater
==============

A repeater for posting messages to Slack channels via the Slack API.  SSL is used for a minty fresh secure feeling that fights plaque and lasts all day.

### Installation

Installation should be performed under a normal user with access to node.js via nvm.

After checkout, install the required modules:

```
npm install express
npm install body-parser
npm install request
```

Next, generate a SSL certificate.

```
openssl rsa -in old.pem -out key.pem
openssl req -new -key key.pem -out csr
openssl x509 -req -days 999 -in csr -signkey key.pem -out cert.pem
rm old.pem
rm csr
```

Configure the Slack endpoint in repeater.js.  This is the 'var url' line, and should look something like the following:

```
var url = 'https://wh.slack.com/services/hooks/incoming-webhook?token=IJF2i0fm2ofmiHFSHUFH';
```

The URL and token will be given to you during Slack API setup.

Install the systemd startup script, located at scripts/slack-repeater.service.  This should be located under /etc/systemd/system.  Note that you should change the parameters within the script accordingly to take into account the user the repeater is being installed under.

Finally, start it up.

```
systemctl enable slack-repeater
systemctl start slack-repeater
```

### Testing and Use

You can use the repeater by posting a payload including a channel, username, text, and icon_emoji.  icon_emoji is optional, but the other fields are required.  Example:

```
curl -kX POST -H "Content-Type: application/json" -d '{"channel": "#general", "username": "j.js", "text": "What?  j.pl is evolving.  j.pl has evolved into j.js.", "icon_emoji": ":coffee:"}' https://127.0.0.1:8000
```
