# symphony-api  (forked and modified version by Teleo Studios)
A node.js symphony api implementation

# Installation
To use the library, run this command in your project's root path.

```
npm -install symphony-api --save
```

# Getting Started

## Example

```javascript
var symphonyApi = require('symphony-api');
var fs = require('fs');

var urls = {
	keyUrl: 'https://mypod.symphony.com:8444/keyauth',
	sessionUrl: 'https://mypod.symphony.com:8444/sessionauth',
	agentUrl: 'https://mypod.symphony.com:8444/agent',
	podUrl: 'https://mypod.symphony.com:443/pod'
};


var cert = fs.readFileSync('./certs/bot-cert.pem', {encoding: 'utf-8'});
var key = fs.readFileSync('./certs/bot-key.pem', {encoding: 'utf-8'}),
var passphrase = 'this is my passphrase'

var api = symphonyApi.create(urls);
api.setCerts(cert, key, passphrase)
api.authenticate()
	.then()
	{
		api.stream.list()
			.then(function(streams)
			{
				if (streams.length > 0) api.message.send(streams[0].id, 'text', 'hello there');
			});
	});
```

# Using the API

The api is encapsulated into a single object that is created using `symphonyApi.create();`. Once
authenticated, additional functionality is made available through members of this main object. For instance,
`api.message.send(streamId, 'text', 'hello world')` will send the text 'hello world' to the stream streamId.


## Api

## api.user (UserModel)
## api.feed (FeedModel)
## api.message (MessageModel)
## api.stream (StreamModel)
