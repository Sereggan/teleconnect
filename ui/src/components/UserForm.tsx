import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, User, tariffs } from "./dummyData";

function UserForm() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>({
    id: 0,
    phoneNumber: "",
    email: "",
    name: "",
    surname: "",
    role: "",
  });

  useEffect(() => {
    if (id !== undefined) {
      const userId = parseInt(id);
      const foundUser = users.find((u) => u.id === userId) || null;
      setUser(
        foundUser || {
          id: 0,
          phoneNumber: "",
          email: "",
          name: "",
          surname: "",
          role: "",
        }
      );
    }
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Логика сохранения данных пользователя
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
              value={user.name}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={user.surname}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Phone Number:
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Role:
            <input
              type="text"
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          {user.role === "ROLE_CUSTOMER" && (
            <label>
              Tariff:
              <select
                name="tariff"
                value={user.tariff?.id || ""}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    tariff: tariffs.find(
                      (tariff) => tariff.id === Number(e.target.value)
                    ),
                  }))
                }
              >
                <option value="">Select a Tariff</option>
                {tariffs.map((tariff) => (
                  <option key={tariff.id} value={tariff.id}>
                    {tariff.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <button type="submit">Save User</button>
      </form>
    </>
  );
}

export default UserForm;
