import { UserRole } from "../../models/User";

export const idValidation = {
  name: "id",
  label: "User ID",
  type: "number",
  id: "id",
  placeholder: "",
  disabled: true,
  validation: {
    min: {
      value: 0,
      message: "Tariff ID must be a positive number",
    },
  },
};

export const phoneNumberValidation = {
  name: "phoneNumber",
  label: "Phone Number",
  type: "text",
  id: "phoneNumber",
  placeholder: "Phone Number",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Phone Number is required",
    },
    minLength: {
      value: 10,
      message: "Phone Number must be at least 10 characters long",
    },
    maxLength: {
      value: 15,
      message: "Phone Number cannot exceed 15 characters",
    },
  },
};

export const passwordValidation = {
  name: "password",
  label: "Password",
  type: "password",
  id: "password",
  placeholder: "Password",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Password is required",
    },
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
};

export const emailValidation = {
  name: "email",
  label: "Email",
  type: "email",
  id: "email",
  placeholder: "Email",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Email is required",
    },
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Invalid email address",
    },
  },
};

export const nameValidation = {
  name: "name",
  label: "Name",
  type: "text",
  id: "name",
  placeholder: "Name",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Name is required",
    },
    maxLength: {
      value: 30,
      message: "Name cannot exceed 30 characters",
    },
  },
};

export const familyNameValidation = {
  name: "familyName",
  label: "Family Name",
  type: "text",
  id: "familyName",
  placeholder: "Family Name",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Family Name is required",
    },
    maxLength: {
      value: 30,
      message: "Family Name cannot exceed 30 characters",
    },
  },
};

export const roleValidation = {
  name: "role",
  label: "Role",
  type: "select",
  id: "role",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Role is required",
    },
  },
  options: [
    { value: UserRole.ROLE_CUSTOMER, label: "Customer" },
    { value: UserRole.ROLE_EMPLOYEE, label: "Employee" },
  ],
};

export const birthDateValidation = {
  name: "birthDate",
  label: "Birth Date",
  type: "date",
  id: "birthDate",
  placeholder: "Birth Date",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Birth date is required",
    },
  },
};
