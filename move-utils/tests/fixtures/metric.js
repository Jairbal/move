'use stric'

const agentFixtures = require('./agent')

const metric = {
  id: 1,
  idAgent: 1,
  type: 'cpu',
  value: '25%',
  createdAt: new Date(),
  agent: agentFixtures.byId(1)
}

const metrics = [
  metric,
  {
    ...metric,
    id: 2,
    value: '35%'
  },
  {
    ...metric,
    id: 3,
    value: '30%'
  },
  {
    ...metric,
    id: 4,
    value: '45%'
  },
  {
    ...metric,
    id: 5,
    value: '40%'
  },
  {
    ...metric,
    id: 6,
    type: 'ram',
    value: '80%',
    agent: agentFixtures.byId(2)
  },
  {
    ...metric,
    id: 7,
    type: 'ram',
    value: '83%',
    agent: agentFixtures.byId(2)
  },
  {
    ...metric,
    id: 8,
    type: 'ram',
    value: '90%',
    agent: agentFixtures.byId(2)
  },
  {
    ...metric,
    id: 9,
    type: 'gpu',
    value: '5%',
    agent: agentFixtures.byId(3)
  },
  {
    ...metric,
    id: 10,
    type: 'gpu',
    value: '8%',
    agent: agentFixtures.byId(3)
  }
]

module.exports = {
  all: metrics,
  byTypeAgentUuid: (type, uuid) =>
    metrics.filter((a) => a.type === type && a.agent.uuid === uuid),
  byAgentUuid: (uuid) => metrics.filter((a) => a.agent.uuid === uuid)
}
