import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserClient";
import { User, UserRole } from "../../models/User";

export default function NewUser() {
  const [user, setUser] = useState<User>({
    phoneNumber: "",
    password: "",
    email: "",
    name: "",
    surname: "",
    role: UserRole.ROLE_CUSTOMER,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createUser(user);
      navigate("/users");
    } catch (error: any) {
      setError("Error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <div>Something went wrong, please try again later.</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Surname:
              <input
                type="text"
                name="surname"
                value={user.surname}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Role:
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                required
              >
                <option value={UserRole.ROLE_CUSTOMER}>Customer</option>
                <option value={UserRole.ROLE_EMPLOYEE}>Employee</option>
                <option value={UserRole.ROLE_ADMIN}>Admin</option>
              </select>
            </label>
            <br />
            <button type="submit">Create User</button>
          </div>
        </form>
      )}
    </>
  );
}
