# unlinked detector
> Scan your site for broken links from the comfort of your browser

This is a small example node application making use of the following:
- [express](https://www.npmjs.com/package/express) for routing
- [express-ws](https://www.npmjs.com/package/express-ws) for WebSockets
- [broken-link-checker](https://www.npmjs.com/package/broken-link-checker) for performing the actual scan
- [jasmine](https://www.npmjs.com/package/jasmine) for running tests

For now all it can do is serve a minimalistic front end that will establish a
WebSocket connection to the server. Once the connection is established, the scan
is initiated and the scan results are send back to the front end to be displayed
in realtime.

## Usage
To run it locally:
```
git clone https://github.com/melo0187/unlinked-detector.git
cd unlinked-detector
npm install
npm start
```
Once running, visit http://localhost:3000/

To run in debug (`--inspect`), replace `npm start` with `npm run dev`.

To run tests execute `npm test`.

## Project Structure
- *lib* - contains our modules (just the blc adapter for now)
- *public* - contains the front end we serve
- *spec* - contains tests as jasmine specs
- *app.js* - contains the set up for our express application
- *index.js* - starts our express app (allowing to inject port through env)
- *package.json* - contains scripts to run, debug and test the app

## ToDos
- Demo deployment to Heroku or somethin alike
- Add `Dockerfile` to be able to run as container
- Add a counter for the found broken links to the front end
- Besides the realtime scan status add a summary of the found broken links
- Figure out reason for false positives (e.g. img ressources from cdn.itdesign.de)
- Add more tests, like a spec for the front end
- Allow user to provide siteUrl to be checked