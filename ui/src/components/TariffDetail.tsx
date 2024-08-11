import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tariffs, Tariff } from "./dummyData";
import Navbar from "./Navbar";

function TariffDetail() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const tariffId = parseInt(id);
      setTariff(tariffs[tariffId] || null);
    }
  }, [id]);

  if (!tariff) return <div>Loading...</div>;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setTariff((prevTariff) =>
      prevTariff ? { ...prevTariff, [name]: value } : null
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log(event);
  }

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Tariff Detail</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={tariff.name}
              onChange={handleChange}
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
            />
          </label>
          <br />
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={tariff.description}
              onChange={handleChange}
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
          <label>Active: {tariff.isActive ? "Yes" : "No"}</label>
        </div>
        {<button type="submit">Save Tariff</button>}
      </form>
    </>
  );
}

export default TariffDetail;
