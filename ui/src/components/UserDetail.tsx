import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, User } from "./dummyData";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(users[0]);
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Detail</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phoneNumber}</p>
      <p>Role: {user.role}</p>
      {user.tariff && (
        <>
          <h3>Tariff</h3>
          <p>Name: {user.tariff.name}</p>
          <p>Price: {user.tariff.price}</p>
        </>
      )}
    </div>
  );
};

export default UserDetail;
