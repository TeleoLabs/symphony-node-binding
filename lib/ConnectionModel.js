const Q = require('q');
const RequestModel = require('./RequestModel');
const urljoin = require('url-join');

class ConnectionModel extends RequestModel {
  constructor(podBaseUrl, certOptions, headers) {
    super(certOptions, headers);
    this.podBaseUrl = podBaseUrl;
  }

  create(userId) {
    const body = {
      userId: userId
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/connection/create'), 'POST', { body: body, json: true });
  }

  get(userId) {
    return this.request(urljoin(this.podBaseUrl, '/v1/connection/', userId, '/info'), 'GET', { json: true });
  }

  list(status = 'all', userIds) {
    const qs = {
      status: status,
      userIds: userIds
    };

    return this.request(urljoin(this.podBaseUrl, '/v1/connection/list'), 'GET', { qs: qs, json: true });
  }

  accept(userId) {
    const body = {
      userId: userId
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/connection/accept'), 'POST', { body: body, json: true });
  }

  reject(userId) {
    const body = {
      userId: userId
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/connection/reject'), 'POST', { body: body, json: true });
  }

  remove(userId) {
    return this.request(urljoin(this.podBaseUrl, '/v1/connection/user', userId, '/remove'), 'POST', { json: true });
  }
}

module.exports = ConnectionModel;
