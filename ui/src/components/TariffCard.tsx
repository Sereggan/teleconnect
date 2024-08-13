import { Link } from "react-router-dom";
import { Tariff } from "./dummyData";
import { Card } from "react-bootstrap";

export default function TariffCard({ tariff }: { tariff: Tariff }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{tariff.name}</Card.Title>
        <Card.Text>{tariff.description}</Card.Text>
        <ul className="list-unstyled">
          <li>
            <strong>Price:</strong> {tariff.price} Euro
          </li>
          <li>
            <strong>Call minutes:</strong> {tariff.callMinutes} minutes
          </li>
          <li>
            <strong>Data limit:</strong> {tariff.dataLimit} MB
          </li>
          <li>
            <strong>SMS limit:</strong> {tariff.smsLimit}
          </li>
        </ul>
        <Link to={`/tariffs/${tariff.id}`} className="btn btn-primary me-2">
          Tariff Info
        </Link>
        <Link to={`/tariffs/edit/${tariff.id}`} className="btn btn-secondary">
          Edit Tariff
        </Link>
      </Card.Body>
    </Card>
  );
}
