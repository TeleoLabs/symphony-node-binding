'use strict'
var Q = require('q');
var crypto = require('crypto');
var request = require('request');
var EventEmitter = require('events');

class RequestModel extends EventEmitter {
	constructor (certOptions, headers)
	{
		super();
		this.certOptions = certOptions;
		this.headers = headers || {};
		this.log = false;
	}

	setLogState (on)
	{
		this.log = on;
	}

	request (url, method, passedOptions)
	{
		passedOptions = passedOptions || {};
		method = method || 'GET';
		var deferred = Q.defer();
		var headers = Object.assign({}, this.headers, passedOptions.headers || {})
		var cookies = passedOptions.cookies;

		var options = {
			url: url,
			method: method,
			headers: headers,
			strictSSL: false,
			json: passedOptions.json,
			agentOptions: this.certOptions,
			timeout: 5 * 60 * 60 * 1000
		};

		if (cookies)
		{
			var jar = request.jar();
			cookies.each(function(cookie)
			{
				jar.setCookie(cookie, url);
			}, this);

			options.jar = jar;
		}

		if (method.toUpperCase() === 'GET')
		{
			options.qs = passedOptions.params || passedOptions.qs;
		}
		else if (method.toUpperCase() === 'POST')
		{
			options.form = passedOptions.params || passedOptions.form;
			options.qs = passedOptions.qs;
			options.body = passedOptions.body;
			options.formData = passedOptions.formData;
		}

		if (this.log) console.log(url);

		request(options, function response(error, response, body)
		{
			if (error) console.log(url, error);
			if (error) console.log(url, body);
			if (response) {
				var contentType = response.headers['content-type'];
				if (passedOptions.contentType && passedOptions.contentTypes.indexOf(contentType) === -1)
					deferred.reject(new Error('invalid content type'));
			}
			if (error) deferred.reject(error);
			else if (response.statusCode < 200 || response.statusCode > 299)
			{
				console.log('error', url, response.statusCode);
				console.log(error);
				console.log(body);
				deferred.reject(new Error(response.statusCode));
			}
			else
			{
				try
				{
					deferred.resolve(JSON.parse(body));
				}
				catch (e)
				{
					deferred.resolve(body);
				}

			}
		}.bind(this));

		return deferred.promise;
	}
};

module.exports = RequestModel;
