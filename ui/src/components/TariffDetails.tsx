import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tariffs, Tariff } from "./dummyData";

function TariffDetails() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const tariffId = parseInt(id);
      const foundTariff = tariffs.find((t) => t.id === tariffId) || null;
      setTariff(foundTariff);
    }
  }, [id]);

  if (!tariff) {
    return <div>Tariff not found</div>;
  }

  return (
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
    </div>
  );
}

export default TariffDetails;
