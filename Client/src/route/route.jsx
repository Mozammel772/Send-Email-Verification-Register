import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Mainlayout from "../layout/Mainlayout/Mainlayout";
import Register from "../Pages/AuthenticationPages/Register/Register";
import Home from "../Pages/HomePages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/app",
        element: <App />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
