import * as React from "react";

import Status from "./components/Status/Status";
import Summary from "./components/Summary/Summary";

interface IState {
  currentLog: Array<{ msg: string, level: string, pageUrl?: string }>;
  socket: WebSocket;
}

class App extends React.Component<{}, IState> {
  private loc = window.location;

  constructor() {
    super({});

    let wsUri;
    if (this.loc.protocol === "https:") {
      wsUri = "wss:";
    } else {
      wsUri = "ws:";
    }
    wsUri += "//" + this.loc.host;

    this.state = {
      currentLog: [{ msg: "Connecting to socket...", level: "INFO" }],
      socket: new WebSocket(wsUri),
    };

    this.state.socket.onopen = () => {
      this.state.socket.send("start scanning");
    };

    this.state.socket.onmessage = (event) => {
      const eventObj = JSON.parse(event.data);
      this.onUpdate(eventObj);
    };
  }

  public render() {
    return (
      <div id="app">
        <h1>
          Does itdesign.de contain broken links?
        </h1>
        <Status scanLog={this.state.currentLog} />
        <Summary brokenCount={this.state.currentLog.filter((entry) => entry.level === "WARN").length} />
      </div>
    );
  }

  private onUpdate = (update: { msg: string, level: string, pageUrl?: string }) => {
    return this.setState({ currentLog: [...this.state.currentLog, update] });
  }
}

export default App;
