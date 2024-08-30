import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../services/UserClient";
import { User, UserRole } from "../../models/User";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async (abortController: AbortController) => {
      if (id) {
        setIsLoading(true);
        try {
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, abortController);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            setError("User not found");
          }
        } catch (error: any) {
          setError(error.message || "Error fetching user");
        } finally {
          setIsLoading(false);
        }
      }
    };

    const abortController = new AbortController();
    fetchUser(abortController);
    return () => {
      abortController.abort();
    };
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
      {user.role === UserRole.ROLE_CUSTOMER && user.tariffId && (
        <>
          <Link to={`/tariffs/${user.tariffId}`}>Tariff Info</Link>
        </>
      )}
    </div>
  );
}
