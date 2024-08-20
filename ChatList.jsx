import React, { useState, useEffect } from 'react';
import './ChatList.css';
import Contact from '../assets/Contact.jpg';

export default function ChatList({ users, onUserSelect, loggedInUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user) => {
    onUserSelect(user);
  };

  return (
    <div className="unique-chat-list">
      <div className="unique-chat-list-header">
        <h2>Chats</h2>
        <div className="unique-chat-list-header-actions">
          <input 
            type="text" 
            placeholder="Search messages or users" 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </div>
      </div>
      <div className="unique-chat-list-body">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user._id}
              className={`unique-chat-item ${user._id === loggedInUser._id ? 'highlighted' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="unique-chat-avatar">
                <img className='unique-chat-user-image' src={Contact} alt="User" />
              </div>
              <div className="unique-chat-details">
                <span className="unique-chat-name">{user.name}</span>
                <span className="unique-chat-message">Hey! there I'm available</span>
              </div>
              <span className="unique-chat-time">02:50 PM</span>
            </div>
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>
    </div>
  );
}
