import React, { useState, useEffect } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "./ChatSection.css";

export default function ChatSection({ selectedUser, loggedInUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/messages/${selectedUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      };

      fetchMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || selectedFile) {
      const messageData = {
        sender: loggedInUser._id,
        recipientId: selectedUser._id,
        message: newMessage,
        file: selectedFile ? selectedFile.name : null,
        timestamp: new Date(),
      };

      if (selectedFile) {
        // Handle file upload logic here
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/messages",
          messageData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
        setSelectedFile(null);
      } catch (error) {
        console.error("Error sending message:", error.message);
        alert("Error sending message. Please try again.");
      }
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-header">
        <div className="chat-header-user">
          <img
            src={
              selectedUser ? selectedUser.profileImage : "path_to_default_image"
            }
            alt="User"
            className="chat-header-image"
          />
          <span className="chat-header-username">
            {selectedUser ? selectedUser.name : "Select a user"}
          </span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === loggedInUser._id ? "sent" : "received"
            }`}
          >
            {msg.sender !== loggedInUser._id && (
              <img
                src={selectedUser ? selectedUser.profileImage : "path_to_default_image"}
                alt="Sender"
                className="message-profile-image"
              />
            )}
            <div className="message-content">
              {msg.sender !== loggedInUser._id && (
                <span className="message-username">{selectedUser.name}</span>
              )}
              <p>{msg.message}</p>
              {msg.file && (
                <div className="file-attachment">
                  <img
                    src={`http://localhost:5000/uploads/${msg.file}`}
                    alt="attachment"
                    className="chat-attachment"
                  />
                  <a
                    href={`http://localhost:5000/uploads/${msg.file}`}
                    download
                  >
                    Download {msg.file}
                  </a>
                </div>
              )}
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-section">
        <button
          className="chat-emoji-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={(event, emojiObject) =>
              setNewMessage(newMessage + emojiObject.emoji)
            }
          />
        )}
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="chat-file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="chat-file-button">
          <i className="fas fa-paperclip"></i>
        </label>
        <input
          type="text"
          placeholder="Enter your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="chat-send-button">
          Send 🛩️
        </button>
      </div>
    </div>
  );
}
