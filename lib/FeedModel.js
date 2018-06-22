'use strict'
var events = require('events');
var Q = require('q');
var urljoin = require('url-join');
var RequestModel = require('./RequestModel');

var RETRY_TIMER_DELAY = [5000, 15000, 30000, 60000, 300000] //ms
let RETRY_COUNT = 0
let RETRY_CONNECTION = false

class FeedModel extends RequestModel
{
	constructor (agentBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);

		this.agentBaseUrl = agentBaseUrl;
		this.baseTime = Date.now();
	}

	start ()
	{
		return this.create()
			.then(function(id)
			{
				this.feedId = id;
				this.run(id);
				return id
			}.bind(this));
	}

	stop ()
	{
		this.stopped = true;
	}

	run (id)
	{
		let that = this;

		return this.request(urljoin(this.agentBaseUrl, '/v4/datafeed/', id,  '/read'), 'GET')
			.then(function(response)
			{
				if (this.stopped) return;

				try {
					this.emit('messages', response);
				} catch(e) {
					console.warn(e.stack);
				}

				return this.run(id);
			}.bind(this))
			.fail(function(reason)
			{
				this.emit('error', reason);

				RETRY_CONNECTION = true

				if (RETRY_CONNECTION && (RETRY_COUNT <= 4)) {
          RETRY_COUNT++
          setTimeout(() => {
            that.run(that.feedId)
            console.log('Retry Count', RETRY_COUNT)
          }, RETRY_TIMER_DELAY[RETRY_COUNT]);
        } else {
        	that.feedId = null;
        	RETRY_CONNECTION = false
        	RETRY_COUNT = 0
        	this.emit('kill', 'Ignore current datafeed and re-create new feed.');
        }
			}.bind(this));
	}

	create ()
	{
		return this.request(urljoin(this.agentBaseUrl, '/v4/datafeed/create'), 'POST')
			.then(function(response)
			{
				return response.id;
			}.bind(this));
	}
}

module.exports = FeedModel;
