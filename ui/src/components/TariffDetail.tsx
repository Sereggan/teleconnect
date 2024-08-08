import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tariffs, Tariff } from "./dummyData";

const TariffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);

  useEffect(() => {
    setTariff(tariffs[0]);
  }, [id]);

  if (!tariff) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tariff Detail</h2>
      <p>Name: {tariff.name}</p>
      <p>Price: {tariff.price}</p>
      <p>Description: {tariff.description}</p>
      <p>Data Limit: {tariff.dataLimit}</p>
      <p>Call Minutes: {tariff.callMinutes}</p>
      <p>SMS Limit: {tariff.smsLimit}</p>
      <p>Active: {tariff.isActive ? "Yes" : "No"}</p>
    </div>
  );
};

export default TariffDetail;
