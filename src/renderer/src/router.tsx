import { createHashRouter } from "react-router-dom";
import { lazy } from "react";
import HomeLayout from "./layouts/HomeLayout/HomeLayout";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import Appearance from "./pages/settings/routes/Appearance";
import Advanced from "./pages/settings/routes/Advanced";


const Me = lazy(() => import("./pages/settings/routes/Me"));

const router = createHashRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "settings",
                element: <Settings />,
                children: [
                    {
                        index: true,
                        element: <Me />
                    },
                    {
                        path: "appearance",
                        element: <Appearance />
                    },
                    {
                        path: "advanced",
                        element:  <Advanced />
                    },
                ]
            },
        ]
    },
]);

export default router;