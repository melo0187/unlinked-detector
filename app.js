const app = function () {
  const express = require('express')
  const app = express()
  require('express-ws')(app)

  const Scanner = require('./lib/Scanner')
  const scanner = new Scanner()

  // Setup app's root path
  app.get('/', function (req, res, next) {
    console.log('requested index -> serving index.html connecting to ws')
    res.sendFile(__dirname + '/public/index.html')
  })

  // Setup websocket route
  app.ws('/', function (ws, req) {

    ws.on('message', function open() {
      console.log('received go to start scanning')
      scanner.setupHandlersWithWsAndStart(ws, 'https://itdesign.de')
    })
  })

  return app
}()

module.exports = app