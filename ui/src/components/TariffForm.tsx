import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tariffs, Tariff } from "./dummyData";

function TariffForm() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff>({
    id: 0,
    name: "",
    price: 0,
    description: "",
    dataLimit: 0,
    callMinutes: 0,
    smsLimit: 0,
    isActive: true,
  });

  useEffect(() => {
    if (id !== undefined) {
      const tariffId = parseInt(id);
      setTariff(tariffs[tariffId] || null);
    }
  }, [id]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setTariff((prevTariff) => ({
      ...prevTariff,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault;
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
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={tariff.isActive}
              onChange={handleChange}
            />
          </label>{" "}
        </div>
        {<button type="submit">Save Tariff</button>}
      </form>
    </>
  );
}

export default TariffForm;
