import { useEffect, useState } from "react";
import { Container, Spinner, Tab, Tabs } from "react-bootstrap";
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
  getTariffAgeGroupStatistics,
  getTariffAdjustmentCount,
} from "../../clients/StatisticsClient";
import {
  UserByTariffResponse,
  UsersWithoutTariffResponse,
  TariffAgeGroupStatisticsResponse,
  TariffAdjustmentCountResponse,
} from "../../models/Statistics";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#ff8042"];

export default function StatisticsDashboard() {
  const [key, setKey] = useState<string>("usersByTariff");
  const [usersByTariff, setUsersByTariff] = useState<UserByTariffResponse[]>();
  const [usersByTariffError, setUsersByTariffError] = useState("");

  const [usersWithoutTariff, setUsersWithoutTariff] =
    useState<UsersWithoutTariffResponse>();
  const [usersWithoutTariffError, setUsersWithoutTariffError] = useState("");

  const [tariffAgeGroupStatistics, setTariffAgeGroupStatistics] =
    useState<TariffAgeGroupStatisticsResponse[]>();
  const [tariffAgeGroupStatisticsError, setTariffAgeGroupStatisticsError] =
    useState("");

  const [tariffAdjustmentCount, setTariffAdjustmentCount] =
    useState<TariffAdjustmentCountResponse[]>();
  const [tariffAdjustmentCountError, setTariffAdjustmentCountError] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    if (key === "usersByTariff" && !usersByTariff) {
      fetchUsersByTariff(controller);
    } else if (key === "usersWithoutTariff" && !usersWithoutTariff) {
      fetchUsersWithoutTariff(controller);
    } else if (key === "tariffAgeGroup" && !tariffAgeGroupStatistics) {
      fetchTariffAgeGroupStatistics(controller);
    } else if (key === "tariffAdjustmentCount" && !tariffAdjustmentCount) {
      fetchTariffAdjustmentCount(controller);
    }
    setIsLoading(false);

    return () => {
      controller.abort();
    };
  }, [key]);

  const fetchUsersByTariff = async (controller: AbortController) => {
    try {
      const result = await getUsersByTariff(controller);
      setUsersByTariff(result);
      setUsersByTariffError("");
    } catch (error) {
      if (!controller.signal.aborted) {
        setUsersByTariffError("Error fetching users by tariff");
      }
    }
  };

  const fetchUsersWithoutTariff = async (controller: AbortController) => {
    try {
      const result = await getUsersWithoutTariff(controller);
      setUsersWithoutTariff(result);
      setUsersWithoutTariffError("");
    } catch (error) {
      if (!controller.signal.aborted) {
        setUsersWithoutTariffError("Error fetching users without tariff");
      }
    }
  };

  const fetchTariffAgeGroupStatistics = async (controller: AbortController) => {
    try {
      const result = await getTariffAgeGroupStatistics(controller);
      setTariffAgeGroupStatistics(result);
      setTariffAgeGroupStatisticsError("");
    } catch (error) {
      if (!controller.signal.aborted) {
        setTariffAgeGroupStatisticsError("Error fetching age group statistics");
      }
    }
  };

  const fetchTariffAdjustmentCount = async (controller: AbortController) => {
    try {
      const result = await getTariffAdjustmentCount(controller);
      setTariffAdjustmentCount(result);
      setTariffAdjustmentCountError("");
    } catch (error) {
      if (!controller.signal.aborted) {
        setTariffAdjustmentCountError("Error fetching tariff adjustment count");
      }
    }
  };

  return (
    <Container>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k!)}
        className="mb-3"
        justify
      >
        <Tab eventKey="usersByTariff" title="Users by Tariff">
          <h3>Users by Tariff</h3>
          {isLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {usersByTariffError && <p>Something went wrong...</p>}
          {!usersByTariffError && usersByTariff && (
            <BarChart width={600} height={300} data={usersByTariff}>
              <XAxis dataKey="tariffName" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="userCount" fill="#8884d8" />
            </BarChart>
          )}
        </Tab>
        <Tab eventKey="usersWithoutTariff" title="Users Without Tariff">
          <h3>Users Without Tariff</h3>
          {isLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {usersWithoutTariffError && <p>Something went wrong...</p>}
          {!usersWithoutTariffError && usersWithoutTariff && (
            <div>
              <p>Total Users Without Tariff: {usersWithoutTariff.count}</p>
            </div>
          )}
        </Tab>
        <Tab eventKey="tariffAgeGroup" title="Tariff by Age Group">
          <h3>Tariff by Age Group</h3>
          {isLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {tariffAgeGroupStatisticsError && <p>Something went wrong...</p>}
          {!tariffAgeGroupStatisticsError && tariffAgeGroupStatistics && (
            <PieChart width={400} height={400}>
              <Pie
                data={tariffAgeGroupStatistics}
                dataKey="userCount"
                nameKey="ageGroup"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {tariffAgeGroupStatistics.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </Tab>
        <Tab eventKey="tariffAdjustmentCount" title="Adjustments by Tariff">
          <h3>Adjustments by Tariff</h3>
          {isLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {tariffAdjustmentCountError && <p>Something went wrong...</p>}
          {!tariffAdjustmentCountError && tariffAdjustmentCount && (
            <PieChart width={400} height={400}>
              <Pie
                data={tariffAdjustmentCount}
                dataKey="adjustmentCount"
                nameKey="tariffName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {tariffAdjustmentCount.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}
