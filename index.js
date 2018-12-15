const express = require('express')
const app = express()
require('express-ws')(app)

const blc = require('broken-link-checker')

// https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
// Using this instead of Symbol, because JSON.stringify() can't serialize deserialize Symbol.
// Why this or Symbol? To get immutability and collision avoidance.
const enumValue = (name) => Object.freeze({ toString: () => name });

// Const definining and freezing ScanEventLevel makes it immutable
const ScanEventLevel = Object.freeze({
  INFO: enumValue('ScanEventLevel.INFO'),
  WARN: enumValue('ScanEventLevel.WARN')
});

class ScanEvent {
  constructor(msg, pageUrl, level) {
    this.msg = msg
    this.pageUrl = pageUrl
    this.level = level
  }
}

// Setup app's root path
app.get('/', function (req, res, next) {
  console.log('requested index -> serving index.html connecting to ws')
  res.sendFile(__dirname + '/public/index.html')
})

// Setup websocket route
app.ws('/', function (ws, req) {
  const options = {
    // No point to check links to linked.in: https://github.com/stevenvachon/broken-link-checker/issues/91
    // Thus I exclude them, which is better than reporting them as broken while they are fine.
    excludedKeywords: ['*.linkedin.com/*'],
    // Setting to 0, since 1 yields false positives for some img src pointing at cdn.itdesign.de
    // More interested in clickable links anyway.
    filterLevel: 0
  }

  const handlers = {
    html: function (tree, robots, response, pageUrl) {
      ws.send(
        JSON.stringify(
          new ScanEvent(`Got all links from '${pageUrl}' -> starting check`,
            pageUrl, ScanEventLevel.INFO.toString())
        )
      )
    },
    link: function (result) {
      // Not interested in skipped links (e.g. because of honoring robot exclusion).
      // Thus only notifiyng about the broken links we found
      if (result.broken) {
        // blc does not offer human readable versions for all returned brokenReason values.
        // In that cases we return the plain brokenReason, which is still better than 'undefined'
        ws.send(
          JSON.stringify(
            new ScanEvent(`|--BROKEN-- '${result.url.original}' with reason '${blc[result.brokenReason] || result.brokenReason}'`,
              result.base.original,
              ScanEventLevel.WARN.toString())
          )
        )
      }
    },
    page: function (error, pageUrl) {
      ws.send(
        JSON.stringify(
          new ScanEvent(`Checked all links of ${pageUrl}`,
            pageUrl,
            ScanEventLevel.INFO.toString())
        )
      )
    },
    site: function (error, siteUrl) {
      ws.send(
        JSON.stringify(
          new ScanEvent(`Finished check for site ${siteUrl}`,
            undefined,
            ScanEventLevel.INFO.toString())
        )
      )
    },
    end: function () {
      console.log('done scanning')
      ws.send(
        JSON.stringify(
          new ScanEvent('No checks left, all done!',
            undefined,
            ScanEventLevel.INFO.toString())
        )
      )
    }
  }

  const siteChecker = new blc.SiteChecker(options, handlers)

  ws.on('message', function open() {
    console.log('received go to start scanning')
    siteChecker.enqueue('https://itdesign.de')
    ws.send(
      JSON.stringify(
        new ScanEvent('started to scan itdesign.de',
          undefined,
          ScanEventLevel.INFO.toString()))
    )
  })
})

// Start the app
// ToDo: Externalize which port to use!
app.listen(3000)