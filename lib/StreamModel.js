const Q = require('q');
const RequestModel = require('./RequestModel');
const urljoin = require('url-join');

class StreamModel extends RequestModel {
	constructor(podBaseUrl, certOptions, headers) {
		super(certOptions, headers);
		this.podBaseUrl = podBaseUrl;
	}

	list(skip = 0, limit = 100, streamTypes, includeInactive) {
		const qs = {
			skip: skip,
			limit: limit
		};

		const body = {
			streamTypes: streamTypes,
			includeInactiveStreams: Boolean(includeInactive)
		}

		return this.request(urljoin(this.podBaseUrl, '/v1/streams/list'), 'POST', { qs: qs, body: body, json: true });
	}

	listForEnterprise(skip = 0, limit = 100, streamTypes, scope, origin, privacy, status = 'ACTIVE', startDate, endDate) {
		const qs = {
			skip: skip,
			limit: limit
		};

		const body = {
			streamTypes: streamTypes,
			scope: scope,
			origin: origin,
			privacy: privacy,
			status: status,
			startDate: startDate,
			endDate: endDate
		}

		return this.request(urljoin(this.podBaseUrl, '/v1/admin/streams/list'), 'POST', { qs: qs, body: body, json: true });
	}

	listForEnterpriseV2(skip = 0, limit = 100, streamTypes, scope, origin, privacy, status, startDate, endDate) {
		const qs = {
			skip: skip,
			limit: limit
		};

		const body = {
			streamTypes: streamTypes,
			scope: scope,
			origin: origin,
			privacy: privacy,
			status: status,
			startDate: startDate,
			endDate: endDate
		}

		return this.request(urljoin(this.podBaseUrl, '/v2/admin/streams/list'), 'POST', { qs: qs, body: body, json: true });
	}

	oneInfo(id) {
		return this.request(urljoin(this.podBaseUrl, '/v1/streams', id, 'info'), 'GET');
	}

	createIm(ids) {
		var body = ids

		return this.request(urljoin(this.podBaseUrl, '/v1/im/create'), 'POST', { body: body, json: true });
	}

	infoBatch(ids, results) {
		if (ids.length === 0) return Q([]);
		if (!Array.isArray(ids)) ids = [ids];
		const batch = ids.splice(0, 20);


		let promises = [];

		batch.forEach(function (id) {
			promises.push(this.oneInfo(id));
		}, this)

		return Q.allSettled(promises)
			.then(function (responses) {
				let infos = [];

				responses.forEach(function (response) {
					if (response.value) infos.push(response.value);
				}, this);

				results.infos.push.apply(results.infos, infos);

				return this.infoBatch(ids, results);
			}.bind(this));
	}

	info(ids) {
		let results = { infos: [] };
		return this.infoBatch(ids, results)
			.then(function () {
				return results.infos;
			}.bind(this))
			.fail(function (e) {
				console.log(e.message);
				console.log(e.stack);
			}.bind(this));
	}
}

module.exports = StreamModel;
