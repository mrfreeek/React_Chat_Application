import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import Client from "./routes/Clients";
import Users from "./routes/Users";
import Chats from "./routes/ChatRoom";
import Navbar from "./components/Navbar";
import "./App.css";
//import Messages from "./routes/Message";
import App from "./App"
import ChatRoom from "./routes/ChatRoom";
import Login from "./routes/Login";

const AppLayout = () => (
 
  <>
    <Navbar />
    <Outlet />
  </>
);



const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "clients",
        element: <Client />,
      },
      {
        path: "chatroom",
        element: <ChatRoom />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
