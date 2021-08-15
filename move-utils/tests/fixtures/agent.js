'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  {
    ...agent,
    id: 2,
    uuid: 'yyy-yyy-yyw',
    connected: false,
    username: 'test'
  },
  {
    ...agent,
    id: 3,
    uuid: 'yyy-yyy-yyx'
  },
  {
    ...agent,
    id: 4,
    uuid: 'yyy-yyy-yyz',
    username: 'test'
  }
]

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  byUuid: id => agents.filter(a => a.uuid === id).shift(),
  byId: id => agents.filter(a => a.id === id).shift()
}
