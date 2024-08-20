import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './components/SideBarIcon.jsx';
import ChatList from './components/ChatList.jsx';
import ChatSection from './components/ChatSection.jsx';
import Login from './components/Login.jsx';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  const handleUserSignup = async () => {
    await fetchUsers();
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <SideBar />
          <ChatList users={users} onUserSelect={handleUserSelect} loggedInUser={user} />
          <ChatSection selectedUser={selectedUser} loggedInUser={user} />
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} onUserSignup={handleUserSignup} />
      )}
    </div>
  );
}
