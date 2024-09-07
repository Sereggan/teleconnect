import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTariff } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";

export default function NewTariff() {
  const [tariff, setTariff] = useState<Tariff>({
    name: "",
    price: 0,
    description: "",
    dataLimit: 0,
    callMinutes: 0,
    smsLimit: 0,
    isActive: true,
    isUsed: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setTariff((prevTariff) => ({
      ...prevTariff,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createTariff(tariff, controllerRef.current!);
      navigate("/tariffs");
    } catch (error: any) {
      if (!controllerRef.current?.signal.aborted) {
        setError("Error creating tariff");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    controllerRef.current = new AbortController();

    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return (
    <>
      {error && <div>Something went wrong, please try again...</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && (
        <div>
          <p>Enter Data for new Tariff:</p>
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
                Active:
                <input
                  type="checkbox"
                  name="isActive"
                  checked={tariff.isActive}
                  onChange={handleChange}
                />
                <br />
              </label>
              <label>
                Is used by users:
                <input
                  type="checkbox"
                  name="isUsed"
                  checked={tariff.isUsed}
                  onChange={handleChange}
                />
              </label>
            </div>
            <button type="submit">Create Tariff</button>
          </form>
        </div>
      )}
    </>
  );
}
