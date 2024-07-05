import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Preview from "./views/Preview/Preview";
import Game from "./views/Game/Game";
import Finals from "./views/Finals/Finals";
import HostGame from "./views/HostGame/HostGame";
import HostFinals from "./views/HostFinals/HostFinals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Preview />,
  },
  {
    path: "/game/",
    element: <Game />,
  },
  {
    path: "/finals/",
    element: <Finals />,
  },
  {
    path: "/host/game/",
    element: <HostGame />,
  },
  {
    path: "/host/finals/",
    element: <HostFinals />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
