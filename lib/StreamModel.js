var Q = require('q');
var RequestModel = require('./RequestModel');
var urljoin = require('url-join');

class StreamModel extends RequestModel {
	constructor (podBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);
		this.podBaseUrl = podBaseUrl;
	}

	list (start = 0, count = 100, streamTypes, includeInactive)
	{
		var qs = {
			skip : start,
			limit: count
		};

		var body = {
			streamTypes: streamTypes,
			includeInactiveStreams: Boolean(includeInactive)
		}

		return this.request(urljoin(this.podBaseUrl, '/v1/streams/list'), 'POST', {qs : qs, body: body, json: true});
	}

	oneInfo (id)
	{
		return this.request(urljoin(this.podBaseUrl, '/v1/streams', id, 'info'), 'GET');
	}

	createIm (ids)
	{
		var body = ids

		return this.request(urljoin(this.podBaseUrl, '/v1/im/create'), 'POST', {body: body, json: true});
	}

	infoBatch (ids, results)
	{
		if (ids.length === 0) return Q([]);
		if (!Array.isArray(ids)) ids = [ids];
		var batch = ids.splice(0, 20);


		var promises = [];

		batch.forEach(function(id)
		{
			promises.push(this.oneInfo(id));
		}, this)

		return Q.allSettled(promises)
			.then(function(responses)
			{
				var infos = [];

				responses.forEach(function(response)
				{
					if (response.value) infos.push(response.value);
				}, this);

				results.infos.push.apply(results.infos, infos);

				return this.infoBatch(ids, results);
			}.bind(this));
	}

	info (ids)
	{
		var results = {infos: []};
		return this.infoBatch(ids, results)
			.then(function()
			{
				return results.infos;
			}.bind(this))
			.fail(function(e)
			{
				console.log(e.message);
				console.log(e.stack);
			}.bind(this));
	}
}

module.exports = StreamModel;
