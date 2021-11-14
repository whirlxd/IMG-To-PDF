import React from "react";
//i was going to use it. , but not anymore lol.
export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 sm:flex-row">
      {"ㅤ"}
      <p className="py-2 text-gray-800 sm:py-0">
        Copyright ©️ {new Date().getFullYear()} Whirl , All rights reserved.
      </p>
      {"ㅤ"}
    </footer>
  );
}
