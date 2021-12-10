import { useState, useEffect } from "react";
import { App, Loader, Home, Footer, Stats } from "./components";
import GithubCorner from "react-github-corner";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

export default function core() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <GithubCorner href="https://github.com/whirl21/img-to-pdf" />
                <Home /> <Stats />
                <Footer />
              </>
            }
          />
          <Route
            path="/app"
            element={
              <>
                <GithubCorner href="https://github.com/whirl21/img-to-pdf" />
                <App />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <GithubCorner href="https://github.com/whirl21/img-to-pdf" />
                <Home /> <Stats />
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
