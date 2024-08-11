import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tariffs, Tariff } from "./dummyData";
import Navbar from "./Navbar";

const TariffManagement: React.FC = () => {
  const [tariffList, setTariffList] = useState<Tariff[]>([]);

  useEffect(() => {
    setTariffList(tariffs);
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h2>Tariff Management</h2>
        <Link to="/tariffs/new">Add New Tariff</Link>
        <ul>
          {tariffList.map((tariff) => (
            <li key={tariff.id}>
              <Link to={`/tariffs/${tariff.id}`}>{tariff.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TariffManagement;
