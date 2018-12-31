import express from "express";
import expressWs from "express-ws";
const app = expressWs(express()).app;

import * as path from "path";

import Scanner from "./controllers/Scanner";
const scanner = new Scanner();

app.use(express.static(path.join(__dirname, "client")));

// Setup app's root path
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

// Setup websocket route
app.ws("/", (ws, req) => {

  ws.on("message", () => {
    scanner.setupHandlersWithWsAndStart(ws, "https://itdesign.de");
  });
});
export default app;
