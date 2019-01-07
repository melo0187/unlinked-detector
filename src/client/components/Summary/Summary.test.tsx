import * as enzyme from "enzyme";
import * as React from "react";

import Summary from "./Summary";

describe("Summary Component", () => {

  it("should render a positive summary for Logs without warnings", () => {
    const summary = enzyme.shallow(<Summary brokenCount={0} />);
    expect(summary.find("#positiveResult")).toHaveLength(1);
    expect(summary.find("#negativeResult")).toHaveLength(0);
  });

  it("should render a negative summary for Logs with 1 or more warnings", () => {
    const summary = enzyme.shallow(<Summary brokenCount={1} />);
    expect(summary.find("#negativeResult")).toHaveLength(1);
    expect(summary.find("#positiveResult")).toHaveLength(0);

    const summary2 = enzyme.shallow(<Summary brokenCount={2} />);
    expect(summary.find("#negativeResult")).toHaveLength(1);
    expect(summary.find("#positiveResult")).toHaveLength(0);
  });

});
