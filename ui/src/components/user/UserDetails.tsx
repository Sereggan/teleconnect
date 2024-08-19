import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, User } from "../dummyData";
import { Link } from "react-router-dom";

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const userId = parseInt(id);
      const foundUser = users.find((u) => u.id === userId) || null;
      setUser(foundUser);
    }
  }, [id]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>
        <strong>Name:</strong> {user.name} {user.surname}
      </p>
      <p>
        <strong>Phone Number:</strong> {user.phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      {user.role === "ROLE_CUSTOMER" && user.tariff && (
        <>
          <h3>Tariff Details</h3>
          <p>
            <strong>Tariff Name:</strong> {user.tariff.name}
          </p>
          <p>
            <strong>Price:</strong> {user.tariff.price} Euro
          </p>
          <p>
            <strong>Description:</strong> {user.tariff.description}
          </p>
          <p>
            <strong>Data Limit:</strong> {user.tariff.dataLimit} MB
          </p>
          <p>
            <strong>Call Minutes:</strong> {user.tariff.callMinutes}
          </p>
          <p>
            <strong>SMS Limit:</strong> {user.tariff.smsLimit}
          </p>
          <p>
            <strong>Active:</strong> {user.tariff.isActive ? "Yes" : "No"}
          </p>
          <Link to={`/tariffs/${user.tariff.id}`}>Tariff Info</Link>
        </>
      )}
    </div>
  );
}

export default UserDetails;
