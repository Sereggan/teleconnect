import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../services/UserClient";
import { getTariffById } from "../../services/TariffClient";
import {
  getTariffAdjustment,
  updateTariffAdjustment,
} from "../../services/TariffAdjustmentClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";
import { TariffAdjustment } from "../../models/TariffAdjustment";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTariff, setCurrentTariff] = useState<Tariff | undefined>(
    undefined
  );
  const [adjustment, setAdjustment] = useState<TariffAdjustment | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, controller);
          if (fetchedUser) {
            setUser(fetchedUser);

            if (fetchedUser.tariffId) {
              const fetchedTariff = await getTariffById(
                fetchedUser.tariffId,
                controller
              );
              if (fetchedTariff) {
                setCurrentTariff(fetchedTariff);
              }
            }

            if (fetchedUser.tariffAdjustmentId) {
              const fetchedAdjustment = await getTariffAdjustment(
                fetchedUser.tariffAdjustmentId,
                controller
              );
              if (fetchedAdjustment) {
                setAdjustment(fetchedAdjustment);
              }
            }
          } else {
            setError("User not found");
          }
        }
      } catch (error: any) {
        if (!controller.signal.aborted) {
          setError("Error fetching data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const handleAdjustmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAdjustment((prevAdjustment) => ({
      ...prevAdjustment!,
      [name]: parseInt(value),
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.id) return;

    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      let updatedUser = { ...user };

      if (adjustment) {
        adjustment.userId = user.id;
        if (!user.tariffId) return;
        adjustment.tariffId = user.tariffId;
        adjustment.id = user.tariffAdjustmentId;
        const updatedAdjustment = await updateTariffAdjustment(
          adjustment,
          controllerRef.current
        );
        updatedUser = {
          ...updatedUser,
          tariffAdjustmentId: updatedAdjustment?.id,
        };
      }

      const fetchedUser = await updateUser(updatedUser, controllerRef.current);

      if (fetchedUser) {
        setUser(fetchedUser);
      }
    } catch (error: any) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error updating user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTariff = async () => {
    if (!user || !user.id) return;

    const updatedUser = { ...user, tariffId: undefined };
    setUser(updatedUser);

    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      await updateUser(updatedUser, controllerRef.current);
      const fetchedUser = await getUserById(user.id, controllerRef.current);
      if (fetchedUser) {
        setUser(fetchedUser);
        setCurrentTariff(undefined);
      }
    } catch (error: any) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error disabling tariff");
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
      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && user && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Role:
              <select
                name="role"
                value={user.role}
                onChange={handleInputChange}
                required
              >
                <option value={UserRole.ROLE_CUSTOMER}>Customer</option>
                <option value={UserRole.ROLE_EMPLOYEE}>Employee</option>
              </select>
            </label>
            <br />

            {user.role === UserRole.ROLE_CUSTOMER && currentTariff && (
              <>
                <div>
                  <label>
                    Current Tariff:
                    <Link to={`/tariffs/${user.tariffId}`}>
                      {currentTariff.name}
                    </Link>
                  </label>

                  <button type="button" onClick={handleDisableTariff}>
                    Disable Tariff
                  </button>
                  <br />
                  <h3>Tariff Adjustment</h3>
                  <label>Adjusted Data Limit</label>
                  <input
                    type="number"
                    name="adjustedDataLimit"
                    value={adjustment?.adjustedDataLimit || ""}
                    onChange={handleAdjustmentInputChange}
                  />
                  <br />
                  <label>Adjusted Call Minutes</label>
                  <input
                    type="number"
                    name="adjustedCallMinutes"
                    value={adjustment?.adjustedCallMinutes || ""}
                    onChange={handleAdjustmentInputChange}
                  />
                  <br />
                  <label>Adjusted SMS Limit</label>
                  <input
                    type="number"
                    name="adjustedSmsLimit"
                    value={adjustment?.adjustedSmsLimit || ""}
                    onChange={handleAdjustmentInputChange}
                  />
                  <br />
                  <label>Discount Percentage</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={adjustment?.discountPercentage || ""}
                    onChange={handleAdjustmentInputChange}
                  />
                  <br />
                </div>
              </>
            )}
            <Link to={`/users/${user.id}/change-tariff`}>
              <button type="button">Change Basic Tariff</button>
            </Link>
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
