'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const { metricFixture } = require('move-utils')

const config = {
  logging: function () {}
}

let sandbox = null
let db = null
let MetricStub = null
let AgentStub = null
const uuid = 'yyy-yyy-yyy'
const type = 'cpu'

const newMetric = {
  idAgent: 1,
  type: 'cpu',
  value: '85%'
}

const metricUuidArgs = {
  attributes: ['type'],
  group: ['type'],
  include: [
    {
      attributes: [],
      model: AgentStub,
      where: {
        uuid
      }
    }
  ],
  raw: true
}

const typeUuidArgs = {
  attributes: ['id', 'type', 'value', 'created_at'],
  where: {
    type
  },
  limit: 20,
  order: [['created_at', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }
  }],
  raw: true
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  MetricStub = {
    belongsTo: sandbox.spy()
  }

  // Model create Stub
  MetricStub.create = sandbox.stub()
  MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
    toJSON () { return newMetric }
  }))

  // Model findAll Stub
  MetricStub.findAll = sandbox.stub()
  MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixture.all))
  MetricStub.findAll.withArgs(metricUuidArgs).returns(Promise.resolve(metricFixture.byAgentUuid(uuid)))
  MetricStub.findAll.withArgs(typeUuidArgs).returns(Promise.resolve(metricFixture.byTypeAgentUuid(type, uuid)))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

test.afterEach(t => {
  sandbox && sandbox.restore()
})

test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('Setup', t => {
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the MetricModel and AgentModel')
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
})

test.serial('Metric#findByAgentUuid', async t => {
  const metric = await db.Metric.findByAgentUuid(uuid)

  t.true(MetricStub.findAll.called, 'findAll should be called on model')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith(metricUuidArgs), 'findAll should be called with specified metricUuidArgs')

  t.deepEqual(metric, metricFixture.byAgentUuid(uuid))
})
