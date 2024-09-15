import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  getUsersByTariff,
  getUsersWithoutTariff,
  getAdjustmentsByTariff,
  getMostDiscountedTariff,
} from "../../services/StatisticsClient";
import {
  UserByTariffResponse,
  AdjustmentByTariffResponse,
  MostDiscountedTariffResponse,
  UsersWithoutTariffResponse,
} from "../../models/Statistics";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#ff8042"];

export default function StatisticsDashboard() {
  const [usersByTariff, setUsersByTariff] = useState<UserByTariffResponse[]>(
    []
  );
  const [usersWithoutTariff, setUsersWithoutTariff] =
    useState<UsersWithoutTariffResponse | null>(null);
  const [adjustmentsByTariff, setAdjustmentsByTariff] = useState<
    AdjustmentByTariffResponse[]
  >([]);
  const [mostDiscountedTariff, setMostDiscountedTariff] =
    useState<MostDiscountedTariffResponse | null>(null);

  useEffect(() => {
    fetchUsersByTariff();
    fetchUsersWithoutTariff();
    fetchAdjustmentsByTariff();
    fetchMostDiscountedTariff();
  }, []);

  const fetchUsersByTariff = async () => {
    const result = await getUsersByTariff();
    setUsersByTariff(result);
  };

  const fetchUsersWithoutTariff = async () => {
    const result = await getUsersWithoutTariff();
    setUsersWithoutTariff(result);
  };

  const fetchAdjustmentsByTariff = async () => {
    const result = await getAdjustmentsByTariff();
    setAdjustmentsByTariff(result);
  };

  const fetchMostDiscountedTariff = async () => {
    const result = await getMostDiscountedTariff();
    setMostDiscountedTariff(result);
  };

  return (
    <div>
      <h2>Statistics Dashboard</h2>
      <Tabs defaultActiveKey="usersByTariff">
        <Tab eventKey="usersByTariff" title="Users by Tariff">
          <h3>Users by Tariff</h3>
          <BarChart width={600} height={300} data={usersByTariff}>
            <XAxis dataKey="tariffName" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="userCount" fill="#8884d8" />
          </BarChart>
        </Tab>
        <Tab eventKey="usersWithoutTariff" title="Users Without Tariff">
          <h3>Users Without Tariff</h3>
          {usersWithoutTariff && (
            <div>
              <p>Total Users Without Tariff: {usersWithoutTariff.count}</p>
            </div>
          )}
        </Tab>
        <Tab eventKey="adjustmentsByTariff" title="Adjustments by Tariff">
          <h3>Adjustments by Tariff</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={adjustmentsByTariff}
              dataKey="adjustmentCount"
              nameKey="tariffName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {adjustmentsByTariff.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Tab>
        <Tab eventKey="mostDiscountedTariff" title="Most Discounted Tariff">
          <h3>Most Discounted Tariff</h3>
          {mostDiscountedTariff && (
            <div>
              <p>Tariff Name: {mostDiscountedTariff.tariffName}</p>
              <p>Average Discount: {mostDiscountedTariff.averageDiscount}%</p>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
