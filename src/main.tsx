import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Preview from "./views/Preview/Preview";
import Game from "./views/Game/Game";
import Finals from "./views/Finals/Finals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Preview />,
  },
  {
    path: "/game/:id",
    element: <Game />,
  },
  {
    path: "/finals/:id/",
    element: <Finals />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
