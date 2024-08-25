import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTariffById } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";

export default function TariffDetails() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchTariff = async () => {
      if (id !== undefined) {
        try {
          const tariffId = parseInt(id);
          const tariff = await getTariffById(tariffId);
          if (tariff) {
            setTariff(tariff);
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
    fetchTariff();
  }, [id]);

  return (
    <>
      {error && <div>Something went wrong, please try again...</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && tariff && (
        <div>
          <h2>Tariff Details</h2>
          <p>
            <strong>Name:</strong> {tariff.name}
          </p>
          <p>
            <strong>Price:</strong> {tariff.price} Euro
          </p>
          <p>
            <strong>Description:</strong> {tariff.description}
          </p>
          <p>
            <strong>Data Limit:</strong> {tariff.dataLimit} MB
          </p>
          <p>
            <strong>Call Minutes:</strong> {tariff.callMinutes}
          </p>
          <p>
            <strong>SMS Limit:</strong> {tariff.smsLimit}
          </p>
          {tariff.validFrom && (
            <p>
              <strong>Valid From:</strong>{" "}
              {new Date(tariff.validFrom).toLocaleDateString()}
            </p>
          )}
          {tariff.validTo && (
            <p>
              <strong>Valid To:</strong>{" "}
              {new Date(tariff.validTo).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Active:</strong> {tariff.isActive ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is used by users:</strong> {tariff.isUsed ? "Yes" : "No"}
          </p>
        </div>
      )}
    </>
  );
}
