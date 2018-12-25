export enum ScanEventLevel {
  Info = "INFO",
  Warn = "WARN",
}

export class ScanEvent {
  public msg: string;
  public pageUrl?: string;
  public level: ScanEventLevel;

  constructor(level: ScanEventLevel, msg: string, pageUrl?: string) {
    this.msg = msg;
    this.pageUrl = pageUrl;
    this.level = level;
  }
}
