import React from "react";
import "../css/loader.css";

export default function Preloader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader"></div>
    </div>
  );
}
