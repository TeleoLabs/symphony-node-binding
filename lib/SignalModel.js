const Q = require('q');
const RequestModel = require('./RequestModel');
const urljoin = require('url-join');

class SignalModel extends RequestModel {
  constructor(agentBaseUrl, certOptions, headers) {
    super(certOptions, headers);
    this.agentBaseUrl = agentBaseUrl;
  }

  subscribers(signalId, skip = 0, limit = 50) {
    const qs = {
      skip: skip,
      limit: limit
    };

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/', signalId, '/subscribers'), 'GET', { qs: qs, json: true });
  }

  list(skip = 0, limit = 50) {
    const qs = {
      skip: skip,
      limit: limit
    };

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/list'), 'GET', { qs: qs, json: true });
  }

  get(signalId) {
    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/', signalId, '/get'), 'GET', { json: true });
  }

  create(name, query, visibleOnProfile = true, companyWide = false) {
    const body = {
      name: name,
      query: query,
      visibleOnProfile: visibleOnProfile,
      companyWide: companyWide
    }

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/create'), 'POST', { body: body, json: true });
  }

  update(signalId, name, query, visibleOnProfile, companyWide) {
    const body = {
      name: name,
      query: query,
      visibleOnProfile: visibleOnProfile,
      companyWide: companyWide
    }

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/', signalId, '/update'), 'POST', { body: body, json: true });
  }

  delete(signalId) {
    return this.request(urljoin(this.agentBaseUrl, '/v1/signals/', signalId, '/delete'), 'POST', { json: true });
  }

  subscribe(signalId, pushed = false, users = []) {
    const qs = {
      pushed: pushed
    };

    const body = users

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals', signalId, '/subscribe'), 'POST', { qs: qs, body: body, json: true });
  }

  unsubscribe(signalId, users = []) {
    const body = users

    return this.request(urljoin(this.agentBaseUrl, '/v1/signals', signalId, '/unsubscribe'), 'POST', { body: body, json: true });
  }
}

module.exports = SignalModel;
