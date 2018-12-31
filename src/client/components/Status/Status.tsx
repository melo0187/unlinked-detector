import * as React from "react";

export interface IProps {
  scanLog: Array<{ msg: string, level: string, pageUrl?: string }>;
}

class Status extends React.Component<IProps, {}> {
  private statusDiv: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);
    this.statusDiv = React.createRef();
  }

  public render() {
    const entries = this.props.scanLog.map(({ msg, level, pageUrl }, index, array) => {
      const levelClass = level === "WARN" ? "warning" : "info";
      const isNewPageStart = index > 0 ? pageUrl !== array[index - 1].pageUrl : false;
      let brElementIfNeeded;
      if (isNewPageStart) { brElementIfNeeded = <br />; }
      return (
        // https://reactjs.org/docs/lists-and-keys.html#keys
        // Keys help React identify which items have changed, are added, or are removed.
        // Keys should be given to the elements inside the array to give the elements a stable identity.
        // When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort.
        // I think it is perfectly fine to use index here, because the order of items can never change in our case.
        <div key={index}>
          {brElementIfNeeded}
          <span className={levelClass} data-pageurl={pageUrl}>{msg}</span>
        </div>
      );
    });

    return (
      <div id="status" ref={this.statusDiv}>
        {entries}
      </div>
    );
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.scanLog !== prevProps.scanLog) {
      this.statusDiv.current.lastElementChild.scrollIntoView();
    }
  }
}

export default Status;
