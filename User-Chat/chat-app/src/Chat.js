import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaComments } from 'react-icons/fa';
import ScrollToBottom from 'react-scroll-to-bottom';
import './chat.css';
import { parseISO } from 'date-fns';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState('');
  const [uniqueId, setChatId] = useState('');
  const [isServerOnline, setIsServerOnline] = useState(false);



  useEffect(() => {
      console.log('Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:8080');
    setSocket(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    socket.onmessage = (event) => {
      const message = event.data;
      if (message instanceof Blob) {
        // handle binary message
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const json = JSON.parse(text);
          json.timestamp = parseISO(json.timestamp); // Use parseISO() to parse the 
          message.timestamp = new Date(message.timestamp);
          setMessages(prevMessages => [...prevMessages, json]);
          console.log(`Received message: ${JSON.stringify(json)}`);
        };
        reader.readAsText(message);
      } else {
        // handle JSON message
        const json = JSON.parse(message);
        json.timestamp = parseISO(json.timestamp); // Use parseISO() to parse the timestamp
        setMessages(prevMessages => [...prevMessages, json]);
        console.log(`Received message: ${JSON.stringify(json)}`);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('Closing WebSocket connection...');
      socket.close();
    };
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      return;
    }
    const timestamp = new Date();
    const message = {
      message: inputValue,
      sender: 'user',
      clientId: clientId,
      uniqueId: uniqueId,
      timestamp: timestamp.toISOString() // convert timestamp to ISO string format
    };

    setMessages(prevMessages => [...prevMessages, message]);
    setInputValue('');
    console.log(`Sending message: ${JSON.stringify(message)}`);
    socket.send(JSON.stringify(message));

    fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message.message,
        sender: message.sender,
        clientId: clientId,
        uniqueId: uniqueId,
        timestamp: message.timestamp
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to store message in database');
        }
        console.log('Message stored in database');
      })
      .catch(error => {
        console.error(error);
      });

  };

  function generateClientId(socket) {
    var clientId = Math.random().toString(36).substring(2, 13);
    setClientId(clientId);
  }
  useEffect(() => {
    generateClientId();
  }, []);

  function generateChatId(socket) {
    var uniqueId = Math.random().toString(36).substring(2, 13);
    setChatId(uniqueId);
  }
  useEffect(() => {
    generateChatId();
  }, []);





  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  console.log(messages);


  return (
    <>
      {showChat ? (
        <Container className="chat-container fixed-bottom bg-light shadow">

          <Row>
            <Col>
              <div className="chat-header d-flex justify-content-between px-3 py-2">
                <img src="https://cdn-icons-png.flaticon.com/512/2706/2706962.png" />


                <h4>CityIndiaService</h4>
                <Button onClick={toggleChat} variant="link">
                  X
                </Button>
              </div>
              {/* <div className="server-status">
                Server status: {isServerOnline ? <span className="online">Online</span> : <span className="offline">Offline</span>}
              </div> */}

              <ScrollToBottom className="chat">
                {console.log('Messages:', messages)}
                {messages.map((message, index) => (
                  <Row key={index} className={`message ${message.sender}`}>
                    <Col xs={2} className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Col>
                    <Col xs={10} className="message-text">
                      {message.message}
                    </Col>
                  </Row>
                ))}

              </ScrollToBottom>

              <div className="chat-input-box px-3 py-2">
                <Form onSubmit={sendMessage} className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-grow-1 mr-2"
                  />
                  <Button type="submit" variant="primary">
                    Send
                  </Button>
                  <span className='webb'>Powered By Web<mark>ikka</mark></span>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <div className="open-chat-button" onClick={toggleChat}>
          <FaComments />
        </div>
      )}
    </>
  );


};

export default Chat;
