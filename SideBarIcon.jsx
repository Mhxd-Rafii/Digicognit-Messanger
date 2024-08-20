import React from 'react';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments, faUsers, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function SideBar() {
  return (
    <div className="sidebar">
      <div className="sidebar-icon">
        <FontAwesomeIcon icon={faUserCircle} />
        <span className="tooltip-text">User Profile</span>
      </div>
      <div className="sidebar-icon">
        <FontAwesomeIcon icon={faComments} />
        <span className="tooltip-text">Messages</span>
      </div>
      <div className="sidebar-icon">
        <FontAwesomeIcon icon={faUsers} />
        <span className="tooltip-text">Groups</span>
      </div>
      <div className="sidebar-icon">
        <FontAwesomeIcon icon={faCog} />
        <span className="tooltip-text">Settings</span>
      </div>
      <div className="sidebar-icon">
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span className="tooltip-text">Logout</span>
      </div>
    </div>
  );
}