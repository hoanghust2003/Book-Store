import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import AdminRoute from "../routers/AdminRoute"
import AdminLogin from "../components/AdminLogin"
import ReviewForm from "../pages/books/ReviewForm";
import DashboardLayout from "../pages/dashboard/DashboardLayout"
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import Profile from '../pages/profile/Profile';
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: <PrivateRoute><OrderPage/></PrivateRoute>
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/cart",
        element: <CartPage/>
      },
      {
        path: "/checkout",
        element: <PrivateRoute><CheckoutPage/></PrivateRoute>
      },
      {
        path: "/books/:id",
        element: <SingleBook/>
      },
      {
        path: "/rate/:id",
        element: <ReviewForm />, 
      },
      {
        path: "/admin",
        element: <AdminLogin/>
      },
      {
        path: "/profile",
        element: <PrivateRoute><Profile /></PrivateRoute>,
      },
      {
        path: "/dashboard",
        element: <AdminRoute>
                  <DashboardLayout/>
                  </AdminRoute>,
        children: [
          {
            path: "",
            element: <AdminRoute><Dashboard/></AdminRoute>,
          },
          {
            path: "add-new-book",
            element: <AdminRoute>
              <AddBook/>
            </AdminRoute>,
          },
          {
            path: "edit-book/:id",
            element: <AdminRoute>
              <UpdateBook/>
            </AdminRoute>,
          },
          {
            path: "manage-books",
            element: <AdminRoute>
              <ManageBooks/>
              </AdminRoute>,
          },
        ]
      }
    ],
  },
]);

export default router;
