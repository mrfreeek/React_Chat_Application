import React, { useState, useEffect } from "react";
import './user.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    srNo: "",
    username: "",
    password:"",
    status: "",
    role: "",
    email:""
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setUsers([...users, newUser]);
    setNewUser({
      srNo: "",
      username: "",
      password:"",
      status: "",
      role: "",
      email:"",
      mobile:""
    });
    setShowForm(false);

    fetch('http://localhost:4000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        srNo: newUser.srNo,
        username: newUser.username,
        password:newUser.password,
        status: newUser.status,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };


  function deleteUser(userId) {
    fetch(`http://localhost:4000/users/${userId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="reports">

      <button className="add-user-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Users"}&#9660;
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Sr.no
            <input
              placeholder="Serial no.."
              type="text"
              name="srNo"
              value={newUser.srNo}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label>
            Username
            <input
              placeholder="Enter name.."
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
          </label>
          <label>
            Status
            <input
              placeholder="Your status.."
              type="text"
              name="status"
              value={newUser.status}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label>
            Email
            <input
              placeholder="Enter mail.."
              type="text"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label>
            Mobile no
            <input
              placeholder="Mobile no.."
              type="text"
              name="mobile"
              value={newUser.mobile}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label>
            Role
            <input
              placeholder="Enter your role.."
              type="text"
              name="role"
              value={newUser.role}
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Username</th>
            <th>Password</th>
            <th>Status</th>
            <th>Email</th>
            <th>Mobile no</th>
            <th>Role</th>
            <th>Delete</th>

          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.srNo}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.status}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.role}</td>
              <td>
        <button className="del-btn" onClick={() => deleteUser(user.id)}><i class="bi bi-trash"></i></button>
      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;