import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../services/UserClient";
import { getAllTariffs, getTariffById } from "../../services/TariffClient";
import {
  deleteTariffAdjustment,
  getTariffAdjustment,
  updateTariffAdjustment,
} from "../../services/TariffAdjustmentClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";
import { TariffAdjustment } from "../../models/TariffAdjustment";
import { Button, Col, Container, Form, Nav, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import { FormSelect } from "../common/FormSelect";
import Select, { createFilter, GroupBase, OptionsOrGroups } from "react-select";
import {
  phoneNumberValidation,
  emailValidation,
  nameValidation,
  familyNameValidation,
  passwordValidation,
  roleValidation,
} from "../../utils/newUserValidations";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTariff, setCurrentTariff] = useState<Tariff | undefined>(
    undefined
  );
  const [adjustment, setAdjustment] = useState<TariffAdjustment | undefined>(
    undefined
  );
  const [tariffs, setTariffs] = useState<Tariff[] | undefined>(undefined);

  const [tariffChoice, setTariffChoice] = useState<Tariff | undefined>(
    undefined
  );
  type TariffOption = {
    value: string;
    label: string;
  };
  const [tariffOptions, setTariffOptions] = useState<
    OptionsOrGroups<TariffOption, GroupBase<TariffOption>>
  >([]);

  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);
  const methods = useForm<User>();

  useEffect(() => {
    const controller = new AbortController();
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, controller);
          if (fetchedUser) {
            setUser(fetchedUser);

            if (fetchedUser.tariffId) {
              const fetchedTariff = await getTariffById(
                fetchedUser.tariffId,
                controller
              );
              if (fetchedTariff) {
                setCurrentTariff(fetchedTariff);
              }
            }

            if (fetchedUser.tariffAdjustmentId) {
              const fetchedAdjustment = await getTariffAdjustment(
                fetchedUser.tariffAdjustmentId,
                controller
              );
              if (fetchedAdjustment) {
                setAdjustment(fetchedAdjustment);
              }
            }

            if (fetchedUser.role === UserRole.ROLE_CUSTOMER) {
              getAllTariffs(
                {
                  isActive: true,
                  limit: 50,
                },
                controller
              )
                .then((response) => {
                  setTariffs(response.tariffs);
                })
                .catch(() => {
                  setTariffs(undefined);
                });
            }
          } else {
            setError("User not found");
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError("Error fetching data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
    if (tariffs) {
      setTariffOptions(
        tariffs.map((tariff) => ({
          value: tariff.id.toString(),
          label: `${tariff.name} - $${tariff.price}`,
        }))
      );
    }

    return () => {
      controller.abort();
    };
  }, [id]);

  const onSubmit = methods.handleSubmit(async (user: User) => {
    if (!user || !user.id) return;

    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      let updatedUser = { ...user };
      let updatedAdjustment = undefined;
      if (user.tariffId) {
        if (adjustment) {
          adjustment.tariffId = user.tariffId;
          adjustment.id = user.tariffAdjustmentId;
          updatedAdjustment = await updateTariffAdjustment(
            adjustment,
            controllerRef.current
          );
        }
      } else if (adjustment && adjustment.id) {
        await deleteTariffAdjustment(adjustment.id, controllerRef.current);
        setAdjustment(undefined);
      }

      updatedUser = {
        ...updatedUser,
        tariffAdjustmentId: updatedAdjustment?.id,
        tariffId: tariffChoice?.id,
      };

      const fetchedUser = await updateUser(updatedUser, controllerRef.current);

      if (fetchedUser) {
        setUser(fetchedUser);
      }
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error updating user");
      }
    } finally {
      setIsLoading(false);
    }
  });

  const handleDisableTariff = async () => {
    if (!user || !user.id) return;

    const userWithoutTariff = {
      ...user,
      tariffId: undefined,
      tariffAdjustmentId: undefined,
    };
    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      if (adjustment && adjustment.id) {
        await deleteTariffAdjustment(adjustment.id, controllerRef.current);
        setAdjustment(undefined);
      }

      const updatedUser = await updateUser(
        userWithoutTariff,
        controllerRef.current
      );
      if (updatedUser) {
        setUser(updatedUser);
        setCurrentTariff(undefined);
      }
      setTariffChoice(undefined);
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error disabling tariff");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !user.id) return;
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    try {
      await deleteUser(user.id, controller);
      navigate("/users");
    } catch (error) {
      if (!controller.signal.aborted) {
        setError("Error deleting user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterTariffOptions = (
    candidate: { label: string; value: string; data: any },
    input: string
  ) => {
    if (input) {
      return candidate.value === input;
    } else {
      return true;
    }
  };

  return (
    <Container>
      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <FormProvider {...methods}>
          <Form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <Row>
              <Col md={6}>
                <FormInput {...nameValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...familyNameValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...phoneNumberValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...emailValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...passwordValidation} />
              </Col>
              <Col md={6}>
                <FormSelect
                  {...roleValidation}
                  options={[
                    { value: UserRole.ROLE_CUSTOMER, label: "Customer" },
                    { value: UserRole.ROLE_EMPLOYEE, label: "Employee" },
                  ]}
                />
              </Col>
            </Row>

            {user &&
              methods.getValues().role === UserRole.ROLE_CUSTOMER &&
              currentTariff && (
                <>
                  <Container>
                    <Nav.Link as={Link} to={`/tariffs/${user.tariffId}`}>
                      Current tariff Info
                    </Nav.Link>
                    {tariffs && (
                      <Select
                        defaultValue={tariffOptions[0]}
                        isClearable
                        isSearchable
                        name="name"
                        options={tariffOptions}
                        placeholder="Select a tariff"
                        filterOption={filterTariffOptions}
                      />
                    )}
                    {!tariffs && <p>No tariffs available.</p>}
                    <Button onClick={handleDisableTariff}>
                      Disable Tariff
                    </Button>

                    <h3>Tariff Adjustments</h3>
                    <FormInput
                      name="adjustedDataLimit"
                      label="Adjusted Data Limit"
                      type="number"
                      placeholder="Adjusted Data Limit"
                    />
                    <FormInput
                      name="adjustedCallMinutes"
                      label="Adjusted Call Minutes"
                      type="number"
                      placeholder="Adjusted Call Minutes"
                    />
                    <FormInput
                      name="adjustedSmsLimit"
                      label="Adjusted SMS Limit"
                      type="number"
                      placeholder="Adjusted SMS Limit"
                    />
                    <FormInput
                      name="discountPercentage"
                      label="Discount Percentage"
                      type="number"
                      placeholder="Discount Percentage"
                    />
                  </Container>
                </>
              )}
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Update User
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={handleDelete}
              className="mt-3 ms-2"
            >
              Delete User
            </Button>
          </Form>
        </FormProvider>
      )}
    </Container>
  );
}
