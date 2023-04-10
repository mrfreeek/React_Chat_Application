import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./chatroom.css";

const ChatRoom = () => {
  const { username } = useParams();
  const [msg, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = (event) => {
      console.log("WebSocket connected:", event);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const time = new Date().toLocaleTimeString();

    const sentMessage = { sender: "agent", message: msg, timestamp: time };
    setMessages((prevMessages) => [...prevMessages, sentMessage]);

    socketRef.current.send(JSON.stringify({ sender: "agent", message: msg, timestamp:time }));

    setMessage("");
    fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender: "agent", message: msg }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="chat-room">
      <h1>Chat Room</h1>
      <div className="msg">
        {messages.map((m, index) => (
          <div
            key={index}
            className={m.sender === "agent" ? "sender" : "visitor"}
          >
            <div className="message-bubble">
              {m.message}{" "}
              <span className="timestamp">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <form className="msg-input" onSubmit={handleMessageSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={msg}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter your message"
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
