'use strict'

const debug = require('debug')('move:mqtt')
const chalk = require('chalk')
const redisPersistence = require('aedes-persistence-redis')
const { configDB, handleFatalError, handleError, parsePayload } = require('move-utils')
const db = require('move-db')

const port = 1883

const settings = {
  persistence: redisPersistence({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    maxSessionDelivery: 100
  })
}

const aedes = require('aedes')(settings)
const server = require('net').createServer(aedes.handle)

const clients = new Map()
let Agent, Metric

server.listen(port, (error) => {
  if (!error) {
    console.log(`${chalk.green('[move-mqtt]')} Server runingn on port ${port}`)
  } else {
    handleFatalError(error)
  }
})

server.on('listening', async () => {
  try {
    const services = await db({ ...configDB, logging: (s) => debug(s) })
    Agent = services.Agent
    Metric = services.Metric
  } catch (error) {
    handleFatalError(error)
  }
})

aedes.on('client', client => {
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null)
})

aedes.on('clientDisconnect', async client => {
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)

  if (agent) {
    // Mark Agent as Disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }

    // Delete Agent from Clients List
    clients.delete(client.id)

    aedes.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })

    debug(`Client (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`)
  }
})

aedes.on('publish', async (packet, client) => {
  debug(`Received: ${packet.topic}`)

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message': {
      debug(`Payload: ${packet.payload}`)
      const payload = parsePayload(packet.payload)

      if (payload) {
        payload.agent.connected = true
        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError(e)
        }

        debug(`Agent ${agent.uuid} saved`)

        // Notify Agents is Connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          aedes.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store Metrics
        const saveMetricsPromises = payload.metrics.map(async (metric) => {
          let createdMetric
          try {
            createdMetric = await Metric.create(agent.uuid, metric)
          } catch(error) {
            return handleError(error)
          }
          debug(`Metric ${createdMetric.id} saved on agent ${agent.uuid}`)
        })

        try{
          await Promise.all(saveMetricsPromises)
        }catch(error) {
          return handleError(error)
        }
      }
      break
    }
  }
})

aedes.on('error', handleFatalError)

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
