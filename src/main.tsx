import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Preview from "./Preview.tsx";
import Game from "./Game.tsx";
import Finals from "./Finals.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Preview />,
  },
  {
    path: "/:id",
    element: <Game />,
  },
  {
    path: "/finals/:id",
    element: <Finals />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
