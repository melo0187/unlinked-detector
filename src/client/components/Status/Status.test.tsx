import * as enzyme from "enzyme";
import * as React from "react";

import Status from "./Status";

describe("Status Component", () => {

  const testScanLog = [
    { msg: "Connecting to socket...", level: "INFO" },
    { msg: "Starting to scan melo.myds.me", level: "INFO", pageUrl: "melo.myds.me" },
    { msg: "Scanned melo.myds.me", level: "INFO", pageUrl: "melo.myds.me" },
    { msg: "Starting to scan melo.myds.me/wordpess", level: "INFO", pageUrl: "melo.myds.me/wordpess" },
    { msg: "|--BROKEN-- link to example.com", level: "WARN", pageUrl: "melo.myds.me/wordpess" },
  ];

  it("should render an entry for each scan event", () => {
    const status = enzyme.shallow(<Status scanLog={testScanLog} />);
    expect(
      status.find("#status")
        .children("div")
        .children("span"),
    ).toHaveLength(testScanLog.length);
  });

  it("should render span with class according to scan event's level", () => {
    const status = enzyme.shallow(<Status scanLog={testScanLog} />);
    expect(
      status.find("#status")
        .children("div")
        .children("span.info"),
    ).toHaveLength(4);
    expect(
      status.find("#status")
        .children("div")
        .children("span.warning"),
    ).toHaveLength(1);
  });

  it("should render break between spans of different pageUrls", () => {
    const status = enzyme.shallow(<Status scanLog={testScanLog} />);
    expect(
      status.find("#status")
        .children("div")
        .children("br"))
      .toHaveLength(2);
    expect(
      status.find("#status")
        .children("div").at(1)
        .children("br"))
      .toBeDefined();
    expect(
      status.find("#status")
        .children("div").at(3)
        .children("br"))
      .toBeDefined();
  });

  it("should scroll to the latest entry, but only if log actually changed", () => {
    // https://stackoverflow.com/a/52335414
    // shallow does not do DOM rendering so there will never be a DOM node on which to call scrollIntoView().
    // Any code that does DOM manipulation needs to be tested using the full DOM rendering provided by mount.
    // The default environment in Jest is a browser-like environment through jsdom.
    // jsdom does not implement scrollIntoView.
    const statusWrapper = enzyme.mount(<Status scanLog={testScanLog} />);
    Element.prototype.scrollIntoView = jest.fn();

    statusWrapper.setProps({ scanLog: testScanLog });
    expect(statusWrapper.find("#status")
      .children("div")
      .children("span"),
    ).toHaveLength(testScanLog.length);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(0);

    const updatedLog = [...testScanLog, { msg: "Update", level: "INFO" }];
    statusWrapper.setProps({ scanLog: updatedLog });
    expect(statusWrapper.find("#status")
      .children("div")
      .children("span"),
    ).toHaveLength(updatedLog.length);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
