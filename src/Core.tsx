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
                <GithubCorner />
                <Home /> <Stats />
                <Footer />
              </>
            }
          />
          <Route
            path="/app"
            element={
              <>
                <GithubCorner />
                <App />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <GithubCorner />
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
