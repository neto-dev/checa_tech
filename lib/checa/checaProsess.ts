import * as lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export class Checa {
  url: String;

  constructor(url: String) {
    this.url = url;
  }

  public launchChromeAndRunLighthouse(opts, config = null) {
    return chromeLauncher
      .launch({ chromeFlags: opts.chromeFlags })
      .then((chrome) => {
        opts.port = chrome.port;
        return lighthouse(this.url, opts, config).then((results) => {
          // use results.lhr for the JS-consumable output
          // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
          // use results.report for the HTML/JSON/CSV output as a string
          // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
          return chrome.kill().then(() => results.lhr);
        });
      });
  }
}
