import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../services/UserClient";
import { getAllTariffs } from "../../services/TariffClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current = new AbortController();

    fetchUser(controllerRef.current);
    fetchTariffs(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
  }, [id]);

  const fetchUser = async (controller: AbortController) => {
    setIsLoading(true);
    try {
      if (id) {
        const userId = parseInt(id);
        const fetchedUser = await getUserById(userId, controller);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          setError("User not found");
        }
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error fetching user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTariffs = async (controller: AbortController) => {
    try {
      const fetchedTariffs = await getAllTariffs({}, controller);
      setTariffs(fetchedTariffs ?? []);
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error fetching tariffs");
      }
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    controllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      await updateUser(user, controllerRef.current);
      await fetchUser(controllerRef.current);
    } catch (error: any) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error updating user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !user.id) return;
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    try {
      await deleteUser(user.id, controller);
      navigate("/users");
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error deleting user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <div>Something went wrong, please try again later.</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && user && (
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
            {user.role === UserRole.ROLE_CUSTOMER && (
              <>
                <label>
                  Tariff:
                  <select
                    name="tariffId"
                    value={user.tariffId || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Tariff</option>
                    {tariffs.map((tariff) => (
                      <option key={tariff.id} value={tariff.id}>
                        {tariff.name} - {tariff.price} Euro
                      </option>
                    ))}
                  </select>
                </label>
                <br />
              </>
            )}
            <button type="submit">Update User</button>
            <button type="button" onClick={handleDelete}>
              Delete User
            </button>
          </div>
        </form>
      )}
    </>
  );
}
