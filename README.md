# unlinked detector [![Build Status](https://travis-ci.org/melo0187/unlinked-detector.svg?branch=master)](https://travis-ci.org/melo0187/unlinked-detector)
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
### Run it locally
```
git clone https://github.com/melo0187/unlinked-detector.git
cd unlinked-detector
npm install
npm start
```
Once running, visit http://localhost:3000/

To run in debug (`--inspect`), replace `npm start` with `npm run dev`.

To run tests execute `npm test`.

### Run it in Docker
Same as above, but instead of the `npm` commands you build an image and run it like so:
```
docker build -t melo0187/unlinked-detector .
docker run -p 8080:8080 -d melo0187/unlinked-detector
```
You bind the port *8080* here, because that is what is exposed by default in the Dockerfile.
However you can run on another port (e.g. *3333*) like so:
```
docker run --env PORT=3333 -p 3333:3333 -d melo0187/unlinked-detector
```

## Project Structure
- *lib* - contains our modules (just the blc adapter for now)
- *public* - contains the front end we serve
- *spec* - contains tests as jasmine specs
- *app.js* - contains the set up for our express application
- *index.js* - starts our express app (allowing to inject port through env)
- *package.json* - contains scripts to run, debug and test the app

## ToDos
- Add a counter for the found broken links to the front end
- Besides the realtime scan status add a summary of the found broken links
- Figure out reason for false positives (e.g. img ressources from cdn.itdesign.de)
- Add more tests, like a spec for the front end
- Allow user to provide siteUrl to be checked