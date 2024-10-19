export const usernameValidation = {
  name: "username",
  label: "Username",
  type: "text",
  id: "username",
  placeholder: "Enter email or phone number",
  disabled: false,
  validation: {
    minLength: {
      required: {
        value: true,
        message: "Required",
      },
      value: 6,
      message: "Must be longer than 6 characters",
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
  label: "Enter your email address",
  type: "email",
  id: "email",
  placeholder: "Email",
  disabled: false,
  validation: {
    requirred: {
      value: true,
      messasge: "Email is requirred",
    },
    minLength: {
      value: 3,
      message: "Email must be longer than 3 characters",
    },
    maxLength: {
      value: 30,
      message: "Email cannot exceed 30 characters",
    },
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Invalid email address",
    },
  },
};

export const codeValidation = {
  name: "code",
  label: "Enter received code",
  type: "code",
  id: "code",
  placeholder: "",
  disabled: false,
  validation: {
    requirred: {
      value: true,
      messasge: "Code is requirred",
    },
    minLength: {
      value: 6,
      message: "Email must be 6 digits long",
    },
    maxLength: {
      value: 6,
      message: "Email must be 6 digits long",
    },
  },
};
