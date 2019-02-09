# unlinked detector [![Build Status](https://travis-ci.org/melo0187/unlinked-detector.svg?branch=master)](https://travis-ci.org/melo0187/unlinked-detector)
> Scan your site for broken links from the comfort of your browser

This is a small example node application making use of the following:
- [express](https://www.npmjs.com/package/express) for routing
- [express-ws](https://www.npmjs.com/package/express-ws) for WebSockets
- [broken-link-checker](https://www.npmjs.com/package/broken-link-checker) for performing the actual scan
- [Jest](https://www.npmjs.com/package/jest) and [SuperTest](https://www.npmjs.com/package/supertest) for testing the server and [Enzyme](https://www.npmjs.com/package/enzyme) for testing the React client

For now all it can do is serve a minimalistic front end that will establish a
WebSocket connection to the server. Once the connection is established, the scan
is initiated and the scan results are send back to the front end to be displayed
in realtime.

Both the Node.js back end and the React front end make use of [TypeScript](https://www.typescriptlang.org/).
The front end is very basic, but thanks to React I feel it has a solid foundation to add more components and thus make it more useful.

## Usage
### Demo
Thanks to [Travis CI](https://travis-ci.org/melo0187/unlinked-detector) the source code in this repo is picked up, tested and deployed to [Heroku](https://www.heroku.com/).

Check out [the demo](https://unlinked-detector.herokuapp.com/).

### Run it locally
```
git clone https://github.com/melo0187/unlinked-detector.git
cd unlinked-detector
npm install
npm run build
npm start
```
Once running, visit http://localhost:3000/

To run in debug (`--inspect`), replace `npm start` with `npm run serve-debug`.

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
Once your container is running, visit http://localhost:8080/ (or whatever port you specified)

### Development
```
npm run dev
```
This will concurrently start three watch tasks for WebPack, TypeScript and Node (with `--inspect`).
Whenever you change source files they will be recompiled, which triggers a browser reload through the use of [browser-sync](https://www.browsersync.io/).

Whenever you commit a pre-commit hook will lint and test everything.

## Project Structure
- *src* - contains all app related source code
- *src/types* - contains types for used modules missing an @types package
- *src/client* - contains the front end that is tested with jest and enzyme and bundled by webpack
- *src/test* - contains tests for the server using Jest and/or SuperTest
- *src/app.ts* - contains the set up for our express application
- *src/server.ts* - starts our express app (allowing to inject port through env)
- *copyStaticAssets.ts* - copies front end assets into *dist* folder
- *package.json* - contains scripts to build, test, run, and debug the app

## Further areas of experimentation
### Functional
- Besides the realtime scan status add a summary of the found broken links
- Figure out reason for false positives (e.g. img ressources from cdn.itdesign.de)
- Allow user to provide siteUrl to be checked

### Non-Functional
- Make use of webpack's `mode` to create sourcemaps only during development
- Improve the dev workflow by adding watch/reload mechanics for back end and front end
- Try Docker multi-stage build
- Try Sass for styling the front end