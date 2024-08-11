import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, User } from "./dummyData";
import Navbar from "./Navbar";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id != undefined) {
      const userId = parseInt(id);
      setUser(users[userId]);
    }
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div>
        <h2>User Detail</h2>
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
    </>
  );
};

export default UserDetail;
