const express = require('express')
const app = express()
require('express-ws')(app)

const blc = require('broken-link-checker')

app.get('/', function (req, res, next) {
  console.log('requested index -> serving index.html connecting to ws')
  res.sendFile(__dirname + '/public/index.html')
})

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
      ws.send(`Got all links from '${pageUrl}' -> starting check`)
    },
    link: function (result) {
      // Not interested in skipped links (e.g. because of honoring robot exclusion).
      // Thus only notifiyng about the broken links we found
      if (result.broken) {
        // blc does not offer human readable versions for all returned brokenReason values.
        // In that cases we return the plain brokenReason, which is still better than 'undefined'
        ws.send(`|--BROKEN-- '${result.url.original}' with reason 
        '${blc[result.brokenReason] ||
            result.brokenReason}'`)
      }
    },
    page: function (error, pageUrl) {
      ws.send(`Checked all links of ${pageUrl}`)
    },
    site: function (error, siteUrl) {
      ws.send(`Finished check for site ${siteUrl}`)
    },
    end: function () {
      console.log('done scanning')
      ws.send('No checks left, all done!')
    }
  }

  const siteChecker = new blc.SiteChecker(options, handlers)

  ws.on('message', function open() {
    console.log('received go to start scanning')
    siteChecker.enqueue('https://itdesign.de')
    ws.send('started to scan itdesign.de')
  })
})

app.listen(3000)