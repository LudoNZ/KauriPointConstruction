import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { ProgressBar } from "../ProgressBar";

const MockProgressbar = ({ initial, progress, warning }) => {
  return (
    <BrowserRouter>
      <ProgressBar initial={initial} progress={progress} warning={warning} />
    </BrowserRouter>
  );
};

test("testing ProgressBar-progress", async () => {
  render(<MockProgressbar progress={50} />);

  const progressDataElement = screen.getByTestId("progress");
  expect(getComputedStyle(progressDataElement).width).toBe("50%");
});
test("testing ProgressBar-warning", async () => {
  render(<MockProgressbar warning={60} />);

  const progressDataElement = screen.getByTestId("warning");
  expect(getComputedStyle(progressDataElement).width).toBe("60%");
});
test("testing ProgressBar-initial", async () => {
  render(<MockProgressbar initial={40} />);

  const progressDataElement = screen.getByTestId("initial");
  expect(getComputedStyle(progressDataElement).width).toBe("40%");
});
