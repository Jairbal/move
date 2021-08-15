'use strict'

const test = require('ava')
const util = require('util')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { agentFixtures, metricFixtures } = require('move-utils')
const auth = require('../auth')
const sign = util.promisify(auth.sign)

let token = null
const secret = 'move'
let uuid = 'yyy-yyy-yyy'
let type = 'cpu'
let wrongUuid = 'yyy-yyy-aaa'
let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}

test.beforeEach(async () => {
    sandbox = sinon.createSandbox()

    dbStub = sandbox.stub()
    dbStub.returns(Promise.resolve({
        Agent: AgentStub,
        Metric: MetricStub
    }))

    AgentStub.findConnected = sandbox.stub()
    AgentStub.findByUuid = sandbox.stub()

    AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))
    AgentStub.findByUuid.withArgs(uuid).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
    AgentStub.findByUuid.withArgs(wrongUuid).returns(Promise.resolve(null))

    MetricStub.findByAgentUuid = sandbox.stub()
    MetricStub.findByTypeAgentUuid = sandbox.stub()

    MetricStub.findByAgentUuid.withArgs(uuid).returns(Promise.resolve(metricFixtures.byAgentUuid(uuid)))
    MetricStub.findByAgentUuid.withArgs(wrongUuid).returns(Promise.resolve(null))
    MetricStub.findByTypeAgentUuid.withArgs(type, uuid).returns(Promise.resolve(metricFixtures.byTypeAgentUuid(type, uuid)))
    MetricStub.findByTypeAgentUuid.withArgs(type, wrongUuid).returns(Promise.resolve(null))
    
    token = await sign({ admin: true, username: 'move', }, secret)

    const api = proxyquire('../api', {
        'move-db': dbStub
    })
    
    server = proxyquire('../server', {
        './api': api
    })
})

test.afterEach(() => {
    sandbox && sinon.restore()
})

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agents - unhautorized', t => {
    request(server)
      .get('/api/agents')
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { 
            console.log(err, 'should not return an error')
        }
        t.is(res.statusCode, 401, 'Error must be Unauthorized User')
        t.end()
    })
})

test.serial.cb('/api/agent/:uuid', t => {
    request(server)
    .get(`/api/agent/${uuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        t.falsy(err, 'should not return an error')
        let body = JSON.stringify(res.body)
        let expected = JSON.stringify(agentFixtures.byUuid(uuid))
        t.deepEqual(body, expected, 'response body should be the expected')
        t.end()
    })
})

test.serial.cb('/api/agent/:uuid - not found', t => {
    request(server)
    .get(`/api/agent/${wrongUuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        if(err){
            console.log(err)
        }
        t.truthy(res.body.error, 'should return an error')
        t.regex(res.body.error, /not found/, 'Error should contains not found')
        t.end()
    })
})

test.serial.cb('/api/agent/:uuid - unhautorized', t => {
    request(server)
      .get(`/api/agent/${uuid}`)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { 
            console.log(err, 'should not return an error')
        }
        t.is(res.statusCode, 401, 'Error must be Unauthorized User')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid', t => {
    request(server)
    .get(`/api/metrics/${uuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        t.falsy(err, 'should not return an error')
        let body = JSON.stringify(res.body)
        let expected = JSON.stringify(metricFixtures.byAgentUuid(uuid))
        t.deepEqual(body, expected, 'response body should be the expected')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid - not found', t => {
    request(server)
    .get(`/api/metrics/${wrongUuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        if(err){
            console.log(err)
        }
        t.truthy(res.body.error, 'should return an error')
        t.regex(res.body.error, /not found/, 'Error should contains not found')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid - unhautorized', t => {
    request(server)
      .get(`/api/metrics/${uuid}`)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { 
            console.log(err, 'should not return an error')
        }
        t.is(res.statusCode, 401, 'Error must be Unauthorized User')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type', t => {
    request(server)
    .get(`/api/metrics/${uuid}/${type}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        t.falsy(err, 'should not return an error')
        let body = JSON.stringify(res.body)
        let expected = JSON.stringify(metricFixtures.byTypeAgentUuid(type, uuid))
        t.deepEqual(body, expected, 'response body should be the expected')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type - not found', t => {
    request(server)
    .get(`/api/metrics/${wrongUuid}/${type}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        if(err){
            console.log(err)
        }
        t.truthy(res.body.error, 'should return an error')
        t.regex(res.body.error, /not found/, 'Error should contains not found')
        t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type - unhautorized', t => {
    request(server)
      .get(`/api/metrics/${uuid}/${type}`)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { 
            console.log(err, 'should not return an error')
        }
        t.is(res.statusCode, 401, 'Error must be Unauthorized User')
        t.end()
    })
})