export const phoneNumberValidation = {
  name: "phoneNumber",
  label: "Phone Number",
  type: "text",
  id: "phoneNumber",
  placeholder: "Phone Number",
  requirred: false,
  disabled: false,
  validation: {
    maxLength: {
      value: 15,
      message: "Phone number cannot exceed 15 characters",
    },
  },
};

export const emailValidation = {
  name: "email",
  label: "Email",
  type: "email",
  id: "email",
  placeholder: "Email",
  requirred: false,
  disabled: false,
  validation: {
    maxLength: {
      value: 30,
      message: "Email cannot exceed 30 characters",
    },
    minLength: {
      value: 3,
      message: "Email must be longer than 3 characters",
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
  requirred: false,
  disabled: false,
  validation: {
    minLength: {
      value: 3,
      message: "Name must be longer than 3 characters",
    },
    maxLength: {
      value: 30,
      message: "Name cannot exceed 30 characters",
    },
  },
};

export const familyNameValidation = {
  name: "familyName",
  label: "FamilyName",
  type: "text",
  id: "familyName",
  placeholder: "FamilyName",
  requirred: false,
  disabled: false,
  validation: {
    minLength: {
      value: 3,
      message: "Family Name must be longer than 3 characters",
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
  requirred: false,
  disabled: false,
  validation: {},
};

export const tariffIdValidation = {
  name: "tariffId",
  label: "Tariff ID",
  type: "number",
  id: "tariffId",
  placeholder: "Tariff ID",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 0,
      message: "Tariff ID must be a positive number",
    },
  },
};
