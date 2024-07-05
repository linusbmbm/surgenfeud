import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import HostPreview from "./views/Host/HostPreview/HostPreview";
import Preview from "./views/Players/Preview/Preview";
import HostGame from "./views/Host/HostGame/HostGame";
import Game from "./views/Players/Game/Game";
import HostFinals from "./views/Host/HostFinals/HostFinals";
import Finals from "./views/Players/Finals/Finals";

const RedirectAndOpenNewTab = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.open("/preview", "_blank");
    navigate("/host/preview");
  }, []);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectAndOpenNewTab />,
  },
  {
    path: "/host/preview",
    element: <HostPreview />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/host/game/",
    element: <HostGame />,
  },
  {
    path: "/game/",
    element: <Game />,
  },
  {
    path: "/host/finals/",
    element: <HostFinals />,
  },
  {
    path: "/finals/",
    element: <Finals />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
