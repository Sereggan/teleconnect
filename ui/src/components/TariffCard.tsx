import { Link } from "react-router-dom";
import { Tariff } from "./dummyData";

function TariffCard({ tariff }: { tariff: Tariff }) {
  return (
    <div className="card">
      <p>{tariff.name}</p>
      <p>{tariff.description}</p>
      <p>Price: {tariff.price} Euro</p>
      <p>Call minutes: {tariff.callMinutes} minutes</p>
      <p>Data limit: {tariff.dataLimit} MB</p>
      <p>SMS limit: {tariff.smsLimit}</p>
      <Link to={`/tariffs/${tariff.id}`}>Tariff Info</Link>
      <Link to={`/tariffs/edit/${tariff.id}`}>Edit Tariff</Link>
    </div>
  );
}

export default TariffCard;
