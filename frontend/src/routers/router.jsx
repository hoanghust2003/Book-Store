import {
    createBrowserRouter
  } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CartPage from "../pages/books/CartPage";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/order",
            element: <div>Orders</div>
        },
        {
            path: "/about",
            element: <div>About</div>
        },
        {
          path: "/cart",
          element: <CartPage/>
        }
      ]
    },
  ]);

export default router;