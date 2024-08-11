import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users, User } from "./dummyData";
import Navbar from "./Navbar";

const UserManagement = () => {
  const [userList, setUsers] = useState<User[]>([]);
  useEffect(() => {
    setUsers(users);
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h2>User Management</h2>
        <Link to="/users/new">Add New User</Link>
        <ul>
          {userList.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>{user.email}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserManagement;
