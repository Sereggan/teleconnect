import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTariffById } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";

export default function TariffDetails() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchTariff = async (controller: AbortController) => {
      if (id !== undefined) {
        setIsLoading(true);
        try {
          const tariffId = parseInt(id);
          const tariff = await getTariffById(tariffId, controller);
          if (tariff) {
            setTariff(tariff);
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

    controllerRef.current = new AbortController();
    fetchTariff(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
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
