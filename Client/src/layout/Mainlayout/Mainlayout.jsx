import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../../Shared/Navbar/Navbar";

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <ToastContainer/>
    </div>
  );
};

export default Mainlayout;
