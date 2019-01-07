import * as React from "react";

export interface IProps {
  brokenCount: number;
}

class Summary extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div id="summary">
        {this.props.brokenCount > 0 ?
          <span id="negativeResult">Oh my, we've found <b>{this.props.brokenCount}</b> broken
          {this.props.brokenCount === 1 ? " link" : " links"}</span>
          :
          <span id="positiveResult">Hurray, we found no broken links! Good Job!</span>
        }
      </div>
    );
  }
}

export default Summary;
