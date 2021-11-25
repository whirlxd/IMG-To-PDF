import React from "react";
import ReactDOM from "react-dom";
import "./css/Index.css";
import Core from "./Core";
//@ts-ignore:next-line
import swal from "sweetalert2/dist/sweetalert2.all.min.js";
const Toast = swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: "Refresh",
  cancelButtonText: "No Thanks",
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener("mouseenter", swal.stopTimer);
    toast.addEventListener("mouseleave", swal.resumeTimer);
  },
});
const Toast2 = swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: "Alright",
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener("mouseenter", swal.stopTimer);
    toast.addEventListener("mouseleave", swal.resumeTimer);
  },
});
//@ts-ignore:next-line
import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  onNeedRefresh() {
    Toast.fire({
      icon: "info",
      title: "New iTp Version Available",
    }).then((result: any) => {
      if (result.isConfirmed) {
        updateSW();
      }
    });
  },
  onOfflineReady() {
    Toast2.fire({
      icon: "info",
      title: "iTp is Ready To Work Offline",
    });
  },
});
ReactDOM.render(
  <React.StrictMode>
    <Core />
  </React.StrictMode>,
  document.getElementById("application")
);
