const get = require('lodash.get')
const pino = require('pino')
const utils = require('./utils')
const validator = require('./validator')

const tokens = {}

function assign (key, token) {
  validator('tokenLabel', key)
  validator('token', token)

  tokens[key] = token
}

assign('level', (data, colors) => (
  colors.level(pino.levels.labels[data.level])
))

assign('time', (data, colors, field) => {
  const date = new Date(data.time)
  let ts = data.time

  switch (field) {
    case 'iso':
      ts = date.toISOString()
      break
    case 'utc':
      ts = date.toUTCString()
      break
  }

  return colors.dim(ts)
})

assign('responseTime', data => (
  data.responseTime
))

assign('message', (data, colors, field = 'msg') => (
  get(data, field) || data.msg || data.data
))

assign('get', (data, colors, field) => (
  get(data, field)
))

assign('error', (data, colors, field = 'message') => (
  get(data.err, field)
))

assign('environment', () => (
  process.env.NODE_ENV
))

assign('res', (data, colors, field) => {
  const match = utils.getHeader(data.res, field)

  return (match && match[1]) || undefined
})

assign('req', (data, colors, field) => (
  data.req.headers[field]
))

assign('status', (data, colors) => (
  colors.status(data.res.statusCode)
))

assign('method', (data, colors) => (
  colors.status(data.req.method)
))

assign('payload', data => (
  JSON.stringify(data.payload || {})
))

assign('remoteAddress', data => (
  data.req.remoteAddress
))

assign('url', data => (
  data.req.url
))

module.exports = tokens
module.exports.assign = assign
