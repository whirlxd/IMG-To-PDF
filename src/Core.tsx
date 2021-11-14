import { useState, useEffect } from "react";
import { App, Loader } from "./components";

export default function core() {
  const [loaded, setLoaded] = useState<Boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  }, []);
  return <>{loaded ? <App /> : <Loader />}</>;
}
