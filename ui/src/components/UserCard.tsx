import React from "react";
import { User } from "./dummyData";
import { Link } from "react-router-dom";

function UserCard({ user }: { user: User }) {
  return (
    <div className="card">
      <p>
        {user.name} {user.surname}
      </p>
      <p>{user.phoneNumber}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
      {user.role === "ROLE_CUSTOMER" && user.tariff && (
        <p>Tariff: {user.tariff.name}</p>
      )}
      <Link to={`/users/${user.id}`}>User Info</Link>
      <Link to={`/users/edit/${user.id}`}>Edit User</Link>
    </div>
  );
}

export default UserCard;
