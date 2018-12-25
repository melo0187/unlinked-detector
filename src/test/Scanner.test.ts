import Scanner from "../controllers/Scanner";

describe("Scanner", () => {
  it("should be initialized correctly", () => {
    const scanner = new Scanner();
    /* tslint:disable:no-unused-expression */
    expect(scanner.currentlyScanningSite).toBeUndefined;
    expect(scanner.isScanning).toBe(false);
  });

  it("should start to scan the requested siteUrl", () => {
    const scanner = new Scanner();
    const sendMockFn = jest.fn((str) => { `should send '${str}' through websocket`; });
    const wsMock = { send: sendMockFn };
    const siteToCheck = "https://melo.myds.me";
    scanner.setupHandlersWithWsAndStart(wsMock, siteToCheck);
    /* tslint:disable:no-unused-expression */
    expect(scanner.currentlyScanningSite).toBe(siteToCheck);
    expect(scanner.isScanning).toBe(true);
    expect(wsMock.send).toBeCalled();
  });
});
