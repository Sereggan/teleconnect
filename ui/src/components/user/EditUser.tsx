import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../clients/UserClient";
import { getAllTariffs, getTariffById } from "../../clients/TariffClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";
import {
  Button,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import { FormSelect } from "../common/FormSelect";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import {
  phoneNumberValidation,
  emailValidation,
  nameValidation,
  familyNameValidation,
  passwordValidation,
  roleValidation,
  birthDateValidation,
  idValidation,
} from "../../validations/modification/userValidations";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [currentTariff, setCurrentTariff] = useState<Tariff>();
  const [tariffs, setTariffs] = useState<Tariff[]>();

  const [selectedTariff, setSelectedTariff] = useState<Tariff>();
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
      setError("");
      try {
        if (id) {
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, controller);
          if (fetchedUser) {
            setUser(fetchedUser);
            if (fetchedUser.role === UserRole.ROLE_CUSTOMER) {
              if (fetchedUser.tariffId) {
                const fetchedTariff = await getTariffById(
                  fetchedUser.tariffId,
                  controller
                );
                if (fetchedTariff) {
                  setCurrentTariff(fetchedTariff);
                  setSelectedTariff(fetchedTariff);
                }
              }

              try {
                const { tariffs } = await getAllTariffs(
                  {
                    isActive: true,
                    limit: 50,
                  },
                  controller
                );
                setTariffs(tariffs);
              } catch (err) {
                console.log(err);
                setError("Could not fetch tariffs");
                setTariffs(undefined);
              }
            }
          } else {
            setError("User not found");
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setUser(undefined);
          setTariffs(undefined);
          setError("Error fetching data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, [id]);

  useEffect(() => {
    if (tariffs) {
      setTariffOptions(
        tariffs
          .filter((tariff) => tariff.id != null)
          .map((tariff) => ({
            value: tariff.id!.toString(),
            label: `${tariff.name} - $${tariff.price}`,
          }))
      );
      console.log(tariffOptions);
    }
  }, [tariffs]);

  const onSubmit = methods.handleSubmit(async (filterUser: User) => {
    if (!user || !user.id) return;

    controllerRef.current = new AbortController();
    setIsLoading(true);
    setError("");
    try {
      let updatedUser = { ...user, ...filterUser };

      updatedUser = {
        ...updatedUser,
        tariffId: selectedTariff?.id,
        tariffAdjustmentId: selectedTariff?.id
          ? updatedUser.tariffAdjustmentId
          : undefined,
      };

      const fetchedUser = await updateUser(updatedUser, controllerRef.current);

      if (fetchedUser) {
        setUser(fetchedUser);
      }

      if (fetchedUser?.tariffId) {
        const currentTariff = tariffs?.filter(
          (t) => t.id === fetchedUser?.tariffId
        )[0];
        setCurrentTariff(currentTariff);
        setSelectedTariff(currentTariff);
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
      const updatedUser = await updateUser(
        userWithoutTariff,
        controllerRef.current
      );
      if (updatedUser) {
        setUser(updatedUser);
        setCurrentTariff(undefined);
        setSelectedTariff(undefined);
      }
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
    setError("");
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
    candidate: { label: string; value: string },
    input: string
  ) => {
    if (input) {
      return candidate.label.toLowerCase().includes(input.toLowerCase());
    } else {
      return true;
    }
  };

  const selectedTariffOption = useMemo(() => {
    if (selectedTariff) {
      return {
        value: selectedTariff.id!.toString(),
        label: `${selectedTariff.name}`,
      };
    } else if (currentTariff) {
      return {
        value: currentTariff.id!.toString(),
        label: `${currentTariff.name}`,
      };
    }
    return null;
  }, [currentTariff, selectedTariff]);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container>
      {!isLoading && !error && (
        <FormProvider {...methods}>
          <Form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <Row>
              <Col md={6}>
                <FormInput {...idValidation} value={user?.id ? user?.id : ""} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...nameValidation}
                  value={user?.name ? user?.name : ""}
                />
              </Col>
              <Col md={6}>
                <FormInput
                  {...familyNameValidation}
                  value={user?.familyName ? user?.familyName : ""}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput
                  {...phoneNumberValidation}
                  value={user?.phoneNumber ? user?.phoneNumber : ""}
                />
              </Col>
              <Col md={6}>
                <FormInput
                  {...emailValidation}
                  value={user?.email ? user?.email : ""}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput
                  {...{
                    ...passwordValidation,
                    validation: {
                      ...passwordValidation.validation,
                      required: false,
                    },
                  }}
                  value={undefined}
                />
              </Col>
              <Col md={6}>
                <FormSelect
                  {...roleValidation}
                  value={user?.role ? user?.role : undefined}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...birthDateValidation}
                  value={user?.birthDate ? user?.birthDate : undefined}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                {tariffs && (
                  <Select
                    value={selectedTariffOption}
                    onChange={(option) => {
                      const selected = tariffs!.find(
                        (tariff) => tariff.id!.toString() === option?.value
                      );
                      setSelectedTariff(selected);
                    }}
                    isClearable
                    isSearchable
                    name="name"
                    options={tariffOptions}
                    placeholder="Select a tariff"
                    filterOption={filterTariffOptions}
                  />
                )}
              </Col>
            </Row>
            {user &&
              methods.getValues().role === UserRole.ROLE_CUSTOMER &&
              currentTariff && (
                <>
                  <Container>
                    <Nav.Link
                      className="text-primary fw-bold"
                      as={Link}
                      to={`/tariffs/${user.tariffId}`}
                    >
                      Current basic tariff Info
                    </Nav.Link>
                    <Nav.Link
                      className="text-primary fw-bold"
                      as={Link}
                      to={`/users/${user.id}/edit/tariff-adjustment`}
                    >
                      {user.tariffAdjustmentId
                        ? "User's special tariff plan"
                        : "Create special tariff plan"}
                    </Nav.Link>
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
            {currentTariff && (
              <Button className="mt-3 ms-2" onClick={handleDisableTariff}>
                Disable Tariff
              </Button>
            )}
          </Form>
        </FormProvider>
      )}
    </Container>
  );
}
