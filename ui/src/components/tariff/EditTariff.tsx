import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTariff,
  getTariffById,
  updateTariff,
} from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";

export default function EditTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);

  const fetchTariff = async (controller: AbortController) => {
    if (id !== undefined) {
      setIsLoading(true);
      try {
        const tariffId = parseInt(id);
        const fetchedTariff = await getTariffById(tariffId, controller);
        if (fetchedTariff) {
          setTariff(fetchedTariff);
        } else {
          setError("Tariff not found");
        }
      } catch (error: any) {
        if (!controller.signal.aborted) {
          setError(error.message || "Error fetching tariff");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    controllerRef.current = new AbortController();
    fetchTariff(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!tariff) return;
    const { name, value, type, checked } = event.target;
    setTariff((prevTariff) => ({
      ...prevTariff!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tariff) return;
    setIsLoading(true);
    try {
      await updateTariff(tariff, controllerRef.current!);
      await fetchTariff(controllerRef.current!);
    } catch (error: any) {
      if (!controllerRef.current?.signal.aborted) {
        setError("Error updating tariff");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tariff || !tariff.id) return;
    setIsLoading(true);
    try {
      await deleteTariff(tariff.id, controllerRef.current!);
      navigate("/tariffs");
    } catch (error: any) {
      if (!controllerRef.current?.signal.aborted) {
        setError("Error deleting tariff");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <div>Something went wrong, please try again...</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && tariff && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={tariff.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={tariff.price}
                onChange={handleChange}
                required
              />{" "}
              Euro
            </label>
            <br />
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={tariff.description}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Data Limit:
              <input
                type="number"
                name="dataLimit"
                value={tariff.dataLimit || ""}
                onChange={handleChange}
              />
              MB
            </label>
            <br />
            <label>
              Call Minutes:
              <input
                type="number"
                name="callMinutes"
                value={tariff.callMinutes || ""}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              SMS Limit:
              <input
                type="number"
                name="smsLimit"
                value={tariff.smsLimit || ""}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Active:
              <input
                type="checkbox"
                name="isActive"
                checked={tariff.isActive}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit">Save Tariff</button>
          <button type="button" onClick={handleDelete}>
            Delete Tariff
          </button>
        </form>
      )}
    </>
  );
}
