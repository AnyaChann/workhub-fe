import React, { useState } from 'react';
import './ManageUsers.css';

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name (A-Z)');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: '',
      email: 'bachct504@gmail.com',
      permissions: 'Admin',
      avatar: null
    }
    // Add more users here as needed
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleInviteUser = () => {
    console.log('Invite user clicked');
    // TODO: Open invite user modal
  };

  const handleUserActions = (userId) => {
    console.log('User actions for:', userId);
    // TODO: Open user actions dropdown
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Manage users</h1>
        <button className="invite-user-btn" onClick={handleInviteUser}>
          <span className="plus-icon">+</span>
          Invite user
        </button>
      </div>
      
      <div className="manage-users-content">
        <div className="users-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search users by name, email etc."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="users-meta">
            <span className="user-count">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</span>
            <div className="sort-controls">
              <span className="sort-label">Sort by</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="Name (Z-A)">Name (Z-A)</option>
                <option value="Email (A-Z)">Email (A-Z)</option>
                <option value="Email (Z-A)">Email (Z-A)</option>
                <option value="Permission">Permission</option>
              </select>
            </div>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Permissions</th>
                <th className="table-header table-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <span className="avatar-placeholder">👤</span>
                        )}
                      </div>
                      <span className="user-name">{user.name || ''}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`permission-badge ${user.permissions.toLowerCase()}`}>
                      {user.permissions}
                    </span>
                  </td>
                  <td className="table-cell table-actions">
                    <button
                      className="actions-btn"
                      onClick={() => handleUserActions(user.id)}
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3 className="empty-title">No users found</h3>
              <p className="empty-description">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start by inviting your first team member'
                }
              </p>
              {!searchTerm && (
                <button className="empty-action-btn" onClick={handleInviteUser}>
                  <span className="plus-icon">+</span>
                  Invite user
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManageUsers;