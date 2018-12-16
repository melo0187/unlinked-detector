const blc = require('broken-link-checker')

const options = {
  // No point to check links to linked.in: https://github.com/stevenvachon/broken-link-checker/issues/91
  // Thus I exclude them, which is better than reporting them as broken while they are fine.
  excludedKeywords: ['*.linkedin.com/*'],
  // Setting to 0, since 1 yields false positives for some img src pointing at cdn.itdesign.de
  // More interested in clickable links anyway.
  filterLevel: 0
}

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

function Scanner() {
}
// Defines the handlers to send according message through websocket and starts the scan
Scanner.prototype.setupHandlersWithWsAndStart = function (ws, siteUrl) {
  if (ws === undefined) {
    throw new Error("Parameter ws it no allowed to be undefined")
  }

  this.currentlyScanningSite = siteUrl
  new blc.SiteChecker(options, {
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
      this.isScanning = false
    }
  }).enqueue(siteUrl)

  this.isScanning = true

  ws.send(
    JSON.stringify(
      new ScanEvent('Started to scan itdesign.de',
        undefined,
        ScanEventLevel.INFO.toString()))
  )
}

module.exports = Scanner