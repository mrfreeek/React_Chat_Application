import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Client",
    path: "/clients",
    icon: <FaIcons.FaPersonBooth />,
    cName: "nav-text",
  },
  {
    title: "Users",
    path: "/users",
    icon: <IoIcons.IoIosPerson />,
    cName: "nav-text",
  },
  {
    title: "Chats",
    path: "/chatroom",
    icon: <FaIcons.FaEnvelope />,
    cName: "nav-text",
  },
  {
    title: "Setting",
    path: "/setting",
    icon: <IoIcons.IoMdSettings />,
    cName: "nav-text",
  },
];
