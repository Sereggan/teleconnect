import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../services/UserClient";
import { getTariffById } from "../../services/TariffClient";
import {
  getTariffAdjustment,
  createTariffAdjustment,
  updateTariffAdjustment,
  deleteTariffAdjustment,
} from "../../services/TariffAdjustmentClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";
import { TariffAdjustment } from "../../models/TariffAdjustment";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTariff, setCurrentTariff] = useState<Tariff | undefined>(
    undefined
  );
  const [adjustment, setAdjustment] = useState<TariffAdjustment | null>(null);
  const [isEditingAdjustment, setIsEditingAdjustment] = useState(false);
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current = new AbortController();
    fetchUser(controllerRef.current);
    fetchTariff(controllerRef.current);
    fetchAdjustment(controllerRef.current);
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

  const fetchAdjustment = async (controller: AbortController) => {
    if (user?.tariffAdjustmentId) {
      try {
        const fetchedAdjustment = await getTariffAdjustment(
          user.tariffAdjustmentId,
          controller
        );
        if (fetchedAdjustment) {
          setAdjustment(fetchedAdjustment);
        }
      } catch (error: any) {
        setError("Error fetching adjustment");
      }
    }
  };

  const fetchTariff = async (controller: AbortController) => {
    try {
      if (user && user.tariffId) {
        const currentTariff = await getTariffById(user.tariffId, controller);
        if (currentTariff) {
          setCurrentTariff(currentTariff);
        }
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error fetching tariff");
      }
    }
  };

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

  const handleSaveAdjustment = async () => {
    if (!adjustment) return;
    setIsLoading(true);
    try {
      if (!adjustment.id) {
        const newAdjustment = await createTariffAdjustment(
          adjustment,
          controllerRef.current!
        );
        await updateUser(
          { ...user!, tariffAdjustmentId: newAdjustment?.id },
          controllerRef.current!
        );
      } else {
        await updateTariffAdjustment(adjustment, controllerRef.current!);
      }
      setIsEditingAdjustment(false);
    } catch (error: any) {
      setError("Error saving adjustment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdjustment = async () => {
    if (!adjustment || !adjustment.id) return;
    setIsLoading(true);
    try {
      await deleteTariffAdjustment(adjustment.id, controllerRef.current!);
      await updateUser(
        { ...user!, tariffAdjustmentId: undefined },
        controllerRef.current!
      );
      setAdjustment(null);
      setIsEditingAdjustment(false);
    } catch (error: any) {
      setError("Error deleting adjustment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTariff = async () => {
    if (user) {
      const updatedUser = { ...user, tariffId: undefined };
      setUser(updatedUser);

      controllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        await updateUser(updatedUser, controllerRef.current);
        await fetchUser(controllerRef.current);
      } catch (error: any) {
        if (!controllerRef.current.signal.aborted) {
          setError("Error disabling tariff");
        }
      } finally {
        setIsLoading(false);
      }
    }
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
                required
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
            {user.role === UserRole.ROLE_CUSTOMER && (
              <>
                {currentTariff && (
                  <div>
                    <label>Current Tariff: {currentTariff.name}</label>
                    <br />
                    <button type="button" onClick={handleDisableTariff}>
                      Disable Tariff
                    </button>
                  </div>
                )}
                <Link to={`/users/${user.id}/change-tariff`}>
                  <button type="button">Change Tariff</button>
                </Link>
                {adjustment && (
                  <div>
                    <h3>Tariff Adjustment</h3>
                    <button
                      onClick={() =>
                        setIsEditingAdjustment(!isEditingAdjustment)
                      }
                    >
                      {isEditingAdjustment ? "Cancel" : "Adjust Tariff"}
                    </button>
                    {isEditingAdjustment && (
                      <>
                        <label>Adjusted Data Limit</label>
                        <input
                          type="number"
                          name="adjustedDataLimit"
                          value={adjustment.adjustedDataLimit || ""}
                          onChange={handleAdjustmentInputChange}
                        />
                        <br />
                        <label>Adjusted Call Minutes</label>
                        <input
                          type="number"
                          name="adjustedCallMinutes"
                          value={adjustment.adjustedCallMinutes || ""}
                          onChange={handleAdjustmentInputChange}
                        />
                        <br />
                        <label>Adjusted SMS Limit</label>
                        <input
                          type="number"
                          name="adjustedSmsLimit"
                          value={adjustment.adjustedSmsLimit || ""}
                          onChange={handleAdjustmentInputChange}
                        />
                        <br />
                        <label>Discount Percentage</label>
                        <input
                          type="number"
                          name="discountPercentage"
                          value={adjustment.discountPercentage || ""}
                          onChange={handleAdjustmentInputChange}
                        />
                        <br />
                        <button onClick={handleSaveAdjustment}>
                          Save Adjustment
                        </button>
                        <button onClick={handleDeleteAdjustment}>
                          Delete Adjustment
                        </button>
                      </>
                    )}
                  </div>
                )}
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
