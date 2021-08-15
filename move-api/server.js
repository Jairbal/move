'use strict'

const debug = require('debug')('move:api')
const express = require('express')
const chalk = require('chalk')
const { handleFatalError } = require('move-utils')

const api = require('./api')

const port = process.env.PORT || 3000
const app = express()

app.use('/api', api)

// Expres Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if(err.name === 'UnauthorizedError'){
      return res.status(401).send({ error: err.message })
  }

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  app.listen(port, () => {
    console.log(`${chalk.green('[move-api]')} server listening in port ${port}`)
  })
}

module.exports = app
