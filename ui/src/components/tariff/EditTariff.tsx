import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTariffById, updateTariff } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";

export default function EditTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTariff = async () => {
    if (id !== undefined) {
      setIsLoading(true);
      try {
        const tariffId = parseInt(id);
        const fetchedTariff = await getTariffById(tariffId);
        if (fetchedTariff) {
          setTariff(fetchedTariff);
        } else {
          setError("Tariff not found");
        }
      } catch (error: any) {
        setError(error.message || "Error fetching tariff");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTariff();
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
      await updateTariff(tariff);
      await fetchTariff();
    } catch (error: any) {
      setError("Error updating tariff");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong, please try again...</div>;
  }

  if (!tariff) {
    return null;
  }

  return (
    <>
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
              value={tariff.dataLimit}
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
              value={tariff.callMinutes}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            SMS Limit:
            <input
              type="number"
              name="smsLimit"
              value={tariff.smsLimit}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Valid From:
            <input
              type="date"
              name="validFrom"
              value={tariff.validFrom || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Valid To:
            <input
              type="date"
              name="validTo"
              value={tariff.validTo || ""}
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
          </label>{" "}
        </div>
        <button type="submit">Save Tariff</button>
      </form>
    </>
  );
}
