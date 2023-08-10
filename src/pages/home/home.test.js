import { findByRole, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
//import Fetch from './fetch' //-The url to get
import Home from "./home";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

//UNIT TESTS

//GET BY
test("testing app home heading", () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const headerElement = screen.getByText(/Kauri Point Construction Services/i);
  expect(headerElement).toBeInTheDocument();
});

test("testing New builds heading appears on home", () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const newBuildsSection = screen.getByRole("heading", { name: "New builds" });
  expect(newBuildsSection).toBeInTheDocument();
});
test("testing Exterior heading section appears on home", () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const newBuildsSection = screen.getByRole("heading", { name: "Exterior" });
  expect(newBuildsSection).toBeInTheDocument();
});

//FIND BY
test("paragraph on home section New Builds", async () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const newBuildsparagraph = await screen.findByText(
    /Across our team, we have decades of building project experience/i
  );
  expect(newBuildsparagraph).toBeInTheDocument();
});
test("section on home page: testimonial ", async () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const testimonialText = await screen.findByText(
    /We hired Kauri Point in 2022 to renovate our Ponsonby Villa/i
  );
  expect(testimonialText).toBeInTheDocument();
});
test("section on home page: support local communities", async () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const testimonialText = await screen.findByText(
    /Supporting local communitites/i
  );
  expect(testimonialText).toBeInTheDocument();
});
