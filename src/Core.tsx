import { useState, useEffect } from "react";
import { App, Loader } from "./components";
import GithubCorner from "react-github-corner";

export default function core() {
  const [loaded, setLoaded] = useState<Boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  }, []);
  return (
    <>
      {loaded ? (
        <>
          <GithubCorner
            href="https://github.com/whirl21/img-to-pdf"
            bannerColor="#FFFFFF"
            octoColor="#2a2e38"
          />
          <App />
        </>
      ) : (
        <>
          <GithubCorner
            href="https://github.com/whirl21/img-to-pdf"
            bannerColor="#FFFFFF"
            octoColor="#2a2e38"
          />
          <Loader />
        </>
      )}
    </>
  );
}
