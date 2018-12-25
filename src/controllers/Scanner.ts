import * as blc from "broken-link-checker";
type BLC_Type = typeof blc;

import { ScanEvent, ScanEventLevel } from "../models/ScanEvent";

class Scanner {

  public currentlyScanningSite: string;

  public isScanning: boolean = false;

  private readonly options = {
    // No point to check links to linked.in: https://github.com/stevenvachon/broken-link-checker/issues/91
    // Thus I exclude them, which is better than reporting them as broken while they are fine.
    excludedKeywords: ["*.linkedin.com/*"],
    // Setting to 0, since 1 yields false positives for some img src pointing at cdn.itdesign.de
    // More interested in clickable links anyway.
    filterLevel: 0,
  };

  // Defines the handlers to send according message through websocket and starts the scan
  public setupHandlersWithWsAndStart(ws: { send: (arg0: string) => void }, siteUrl: string) {
    this.currentlyScanningSite = siteUrl;
    new blc.SiteChecker(this.options, this.buildBLCHandlers(this, this.getBLCBrokenReason, ws))
      .enqueue(siteUrl, undefined);

    this.isScanning = true;

    ws.send(
      JSON.stringify(
        new ScanEvent(ScanEventLevel.Info,
          "Started to scan itdesign.de",
          undefined)),
    );
  }

  // https://stackoverflow.com/a/48135213
  // work around no index signature error for import * as blc when using bracket property access
  private getBLCBrokenReason<K extends keyof BLC_Type>(input: K): BLC_Type[K] {
    return blc[input];
  }

  private buildBLCHandlers(
    scanner: Scanner,
    humanizeReasonsFn: (input: string | number) => BLC_Type[keyof BLC_Type],
    ws: { send: (arg0: string) => void },
  ) {
    return {
      html(tree: any, robots: any, response: any, pageUrl: any) {
        ws.send(
          JSON.stringify(
            new ScanEvent(ScanEventLevel.Info,
              `Got all links from '${pageUrl}' -> starting check`,
              pageUrl),
          ),
        );
      },
      link(result: { broken: any; url: { original: any; }; brokenReason: string | number; base: { original: any; }; }) {
        // Not interested in skipped links (e.g. because of honoring robot exclusion).
        // Thus only notifiyng about the broken links we found
        if (result.broken) {
          // blc does not offer human readable versions for all returned brokenReason values.
          // In that cases we return the plain brokenReason, which is still better than 'undefined'
          ws.send(
            JSON.stringify(
              new ScanEvent(ScanEventLevel.Warn,
                `|--BROKEN-- '${result.url.original}' with reason
                '${humanizeReasonsFn(result.brokenReason) || result.brokenReason}'`,
                result.base.original),
            ),
          );
        }
      },
      page(error: any, pageUrl: any) {
        ws.send(
          JSON.stringify(
            new ScanEvent(ScanEventLevel.Info,
              `Checked all links of ${pageUrl}`,
              pageUrl),
          ),
        );
      },
      site(error: any, siteUrl: any) {
        ws.send(
          JSON.stringify(
            new ScanEvent(ScanEventLevel.Info,
              `Finished check for site ${siteUrl}`,
              undefined),
          ),
        );
      },
      end() {
        ws.send(
          JSON.stringify(
            new ScanEvent(ScanEventLevel.Info,
              "No checks left, all done!",
              undefined),
          ),
        );
        scanner.isScanning = false;
        scanner.currentlyScanningSite = "";
      },
    };
  }
}
export default Scanner;
