'use strict'

const debug = require('debug')('move:db')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { configDB, handleFatalError } = require('move-utils')
const db = require('./index')

const prompt = inquirer.createPromptModule()

async function setup () {
  const args = process.argv.slice()
  if (!args.includes('--y') && !args.includes('--yes')) {
    const asnwer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])

    if (!asnwer.setup) {
      return console.log('Nothing happened :)')
    }
  }

  const config = {
    ...configDB,
    setup: true
  }

  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}

setup()
