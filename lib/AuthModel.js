'use strict'
var Q = require('q');
var RequestModel = require('./RequestModel');

class AuthModel extends RequestModel
{
	constructor (authBase, keyBase, certOptions)
	{
		super(certOptions);

		this.authBase = authBase;
		this.keyBase = keyBase;
	}

	authenticate ()
	{
		var promises = [];

		promises.push(this.request(this.authBase + '/v1/authenticate', 'POST'));
		promises.push(this.request(this.keyBase + '/v1/authenticate', 'POST'));

		return Q.allSettled(promises).spread(function(r1, r2) {
			var result1 = r1.value;
			var result2 = r2.value;
			var auth = {};

			if (!result1 || !result2) throw(new Error('failed to authenticate'));

			auth[result1.name] = result1.token;
			auth[result2.name] = result2.token;

			return auth;
		});
	}

	appAuthenticate ()
	{
		var promises = [];

		promises.push(this.request(this.authBase + '/v1/app/authenticate', 'POST'));

		return Q.allSettled(promises).spread(function(r1) {
			var result1 = r1.value;
			var auth = {};

			if (!result1) throw(new Error('failed to authenticate'));

			auth[result1.name] = result1.token;

			return auth;
		});
	}

	extensionAppAuthenticate (userIdAsToken)
	{
		var promises = [];

		var options = {
			body: {
				appToken: userIdAsToken
			},
			json: true
		}

		promises.push(this.request(this.authBase + '/v1/authenticate/extensionApp', 'POST', options));

		return Q.allSettled(promises).spread(function(r1) {
			var result1 = r1.value;

			if (!result1) throw(new Error('failed to authenticate'));

			return result1;
		});
	}

	getPublicCert ()
	{
		var promises = [];

		promises.push(this.request(this.authBase + '/v1/app/pod/certificate', 'GET'));

		return Q.allSettled(promises).spread(function(r1) {
			console.log(r1)
			var result1 = r1.value;

			if (!result1) throw(new Error('failed to authenticate'));

			return result1.certificate;
		});
	}

	oboAuthenticate (appSessionToken, userId)
	{
		var promises = [];

		var options = {
			headers: {
				sessionToken: appSessionToken,
				passphrase: '',
				cacheControl: 'no-cache'
			}
		}

		promises.push(this.request(this.authBase + '/v1/app/user/' + userId + '/authenticate', 'POST', options));

		return Q.allSettled(promises).spread(function(r1) {
			return r1.value.sessionToken
		});
	}
}

module.exports = AuthModel;
