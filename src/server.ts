import * as BrowserSync from "browser-sync";
import app from "./app";

const port = process.env.PORT || 3000;
const isProduction = "production" === process.env.NODE_ENV;
let browserSync: typeof BrowserSync;

app.listen(port, listening);

function listening() {
    // if we are not running in production (but rather in watch mode due to `npm run dev`)
    // init browser-sync to reload browsers on client changes
    if (!isProduction) {
        // This is a technique for conditional imports, because I want browser-sync as devDep only
        // http://ideasintosoftware.com/typescript-conditional-imports/
        browserSync = require("browser-sync");
        // https://ponyfoo.com/articles/a-browsersync-primer#inside-a-node-application
        browserSync.init({
            files: ["dist/client/**/*.{html,js,css}"],
            online: false,
            open: false,
            proxy: {
                target: `localhost:${port}`,
                ws: true,
            },
        }, async () => {
            // after both the server and browser-sync started reload already open browser sessions
            // we wait 2 seconds to give browser-sync time to find open browser sessions
            await sleep(2000);
            browserSync.reload();
        });
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
