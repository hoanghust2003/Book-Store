import {
    createBrowserRouter
  } from "react-router-dom";
import App from "../App";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <h1>Home</h1>
        },
        {
            path: "/order",
            element: <div>Orders</div>
        },
        {
            path: "/about",
            element: <div>About</div>
        }
      ]
    },
  ]);

export default router;