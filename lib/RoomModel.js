const Q = require('q');
const RequestModel = require('./RequestModel');
const urljoin = require('url-join');

class v1 extends RequestModel {

  constructor(podBaseUrl, certOptions, headers) {
    super(certOptions, headers);
    this.podBaseUrl = podBaseUrl;
  }

  activate(id, active) {
    const qs = {
      active: active
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/room', id, 'setActive'), 'POST', { qs: qs, json: true });
  }

  addMember(streamId, userId) {
    const body = {
      id: userId
    };

    return this.request(urljoin(this.podBaseUrl, '/v1/room', streamId, 'membership/add'), 'POST', { body: body, json: true });
  }

  removeMember(streamId, userId) {
    const body = {
      id: userId
    };

    return this.request(urljoin(this.podBaseUrl, '/v1/room', streamId, 'membership/remove'), 'POST', { body: body, json: true });
  }

  promoteOwner(streamId, userId) {
    const body = {
      id: userId
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/room', streamId, 'promoteOwner'), 'POST', { body: body, json: true });
  }

  demoteOwner(streamId, userId) {
    const body = {
      id: userId
    }

    return this.request(urljoin(this.podBaseUrl, '/v1/room', streamId, 'demoteOwner'), 'POST', { body: body, json: true });
  }
}

class v2 extends RequestModel {

  constructor(podBaseUrl, certOptions, headers) {
    super(certOptions, headers);
    this.podBaseUrl = podBaseUrl;
  }

  info(id) {
    return this.request(urljoin(this.podBaseUrl, '/v2/room', id, 'info'), 'GET');
  }

  listMember(id) {
    return this.request(urljoin(this.podBaseUrl, '/v2/room', id, 'membership/list'), 'GET');
  }
}

class v3 extends RequestModel {

  constructor(podBaseUrl, certOptions, headers) {
    super(certOptions, headers);
    this.podBaseUrl = podBaseUrl;
  }

  create(name, description, keywords, membersCanInvite = true, discoverable = true, anyoneCanJoin = false, readOnly = false, copyProtected = false, crossPod = false, viewHistory = false) {
    const body = {
      name: name,
      description: description,
      keywords: keywords,
      membersCanInvite: membersCanInvite,
      discoverable: discoverable,
      public: anyoneCanJoin,
      readOnly: readOnly,
      copyProtected: copyProtected,
      crossPod: crossPod,
      viewHistory: viewHistory
    };

    return this.request(urljoin(this.podBaseUrl, '/v3/room/create'), 'POST', { body: body, json: true });
  }

  update(id, name, description, keywords, membersCanInvite, discoverable, copyProtected, crossPod, viewHistory) {
    const body = {
      name: name,
      description: description,
      keywords: keywords,
      membersCanInvite: membersCanInvite,
      discoverable: discoverable,
      copyProtected: copyProtected,
      crossPod: crossPod,
      viewHistory: viewHistory
    };

    return this.request(urljoin(this.podBaseUrl, '/v3/room', id, 'update'), 'POST', { body: body, json: true });
  }

  search(skip = 0, limit = 100, query, labels, active = true, includePrivateRooms = false, creator, owner, member, sortOrder = 'RELEVANCE') {
    const qs = {
      skip: skip,
      limit: limit
    };

    const body = {
      query: query,
      labels: labels,
      active: active,
      private: includePrivateRooms,
      creator: creator,
      owner: owner,
      member: member,
      sortOrder: sortOrder
    }

    return this.request(urljoin(this.podBaseUrl, '/v3/room/search'), 'POST', { qs: qs, body: body, json: true });
  }
}

class RoomModel extends RequestModel {
  constructor(podBaseUrl, certOptions, headers) {
    super(certOptions, headers);

    this.podBaseUrl = podBaseUrl;
    this.v1 = new v1(podBaseUrl, certOptions, headers);
    this.v2 = new v2(podBaseUrl, certOptions, headers);
    this.v3 = new v3(podBaseUrl, certOptions, headers);
  }

  create(name, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory) {
    this.v3.create(name, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory);
  }

  update(id, name, description, keywords, membersCanInvite, discoverable, copyProtected, crossPod, viewHistory) {
    this.v3.update(id, name, description, keywords, membersCanInvite, discoverable, copyProtected, crossPod, viewHistory);
  }

  info(id) {
    this.v2.info(id);
  }

  activate(id, active) {
    this.v1.activate(id, active);
  }

  listMember(id) {
    this.v2.listMember(id);
  }

  addMember(streamId, userId) {
    this.v1.addMember(streamId, userId);
  }

  removeMember(streamId, userId) {
    this.v1.removeMember(streamId, userId);
  }

  promoteOwner(streamId, userId) {
    this.v1.promoteOwner(streamId, userId);
  }

  demoteOwner(streamId, userId) {
    this.v1.demoteOwner(streamId, userId);
  }

  search(skip, limit, query, labels, active, includePrivateRooms, creator, owner, member, sortOrder) {
    this.v3.search(skip, limit, query, labels, active, includePrivateRooms, creator, owner, member, sortOrder);
  }
}

module.exports = RoomModel;
