var Q = require('q');
var RequestModel = require('./RequestModel');
var urljoin = require('url-join');

class UserModel extends RequestModel {
	constructor(podBaseUrl, certOptions, headers) {
		super(certOptions, headers);
		this.podBaseUrl = podBaseUrl;
	}

	me() {
		if (this.myinfo) return Q(this.myinfo);

		return this.request(urljoin(this.podBaseUrl, '/v1/sessioninfo'), 'GET', {})
			.then(function (response) {
				var id = response.userId;
				return this.lookup({ uid: id })
					.then(function (response) {
						this.myinfo = response;
						return response;
					}.bind(this));
			}.bind(this));
	}

	get(uid) {
		return this.request(urljoin(this.podBaseUrl, '/v1/admin/user', uid), 'GET')
	}

	lookup(params) {
		return this.request(urljoin(this.podBaseUrl, '/v2/user'), 'GET', { params: params })
	}
}

module.exports = UserModel;
