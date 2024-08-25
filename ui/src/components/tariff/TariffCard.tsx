import { Link } from "react-router-dom";
import { Tariff } from "../../models/Tariff";
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
          {tariff.validFrom && (
            <li>
              <strong>Valid From:</strong>{" "}
              {new Date(tariff.validFrom).toLocaleDateString()}
            </li>
          )}
          {tariff.validTo && (
            <li>
              <strong>Valid To:</strong>{" "}
              {new Date(tariff.validTo).toLocaleDateString()}
            </li>
          )}
          <li>
            <strong>Active:</strong> {tariff.isActive ? "Yes" : "No"}
          </li>
          <li>
            <p>
              <strong>Is used by users:</strong> {tariff.isUsed ? "Yes" : "No"}
            </p>
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
