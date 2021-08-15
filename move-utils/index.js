const { configDB } = require('./configDB')
const { parsePayload } = require('./parsePayload')
const { handleFatalError, handleError } = require('./error')
const agentFixtures = require('./tests/fixtures/agent')
const metricFixtures = require('./tests/fixtures/metric')
const { pipe } = require('./pipe')

module.exports = {
    configDB,
    handleFatalError,
    handleError,
    parsePayload,
    agentFixtures,
    metricFixtures,
    pipe
}