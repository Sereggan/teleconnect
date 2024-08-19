import React, { useState, useEffect } from "react";
import { users, User } from "../dummyData";
import UserCard from "./UserCard";
import { Link } from "react-router-dom";

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    setUserList(users);
  }, []);

  return (
    <>
      <Link to="/users/add">Add New User</Link>
      <p>List of users:</p>
      <div>
        {userList.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </>
  );
};

export default UserManagement;
