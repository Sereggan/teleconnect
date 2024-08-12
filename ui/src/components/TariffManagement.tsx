import { useState, useEffect } from "react";
import { tariffs, Tariff } from "./dummyData";
import TariffCard from "./TariffCard";
import { Link } from "react-router-dom";

function TariffManagement() {
  const [tariffList, setTariffList] = useState<Tariff[]>([]);

  useEffect(() => {
    setTariffList(tariffs);
  }, []);

  return (
    <>
      <Link to="/tariffs/add">Add New Tariff</Link>
      <p>List of tariffs:</p>
      <div>
        {tariffList.map((t) =>
          t.isActive ? <TariffCard key={t.id} tariff={t} /> : null
        )}
      </div>
    </>
  );
}

export default TariffManagement;
