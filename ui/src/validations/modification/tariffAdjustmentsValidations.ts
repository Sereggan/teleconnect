export const idValidation = {
  name: "id",
  label: "Id",
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

export const priceValidation = {
  name: "price",
  label: "Price (Euro)",
  type: "number",
  id: "price",
  placeholder: "Enter special price",
  disabled: false,
  validation: {
    min: {
      value: 0,
      message: "Price must be 0 or more",
    },
    max: {
      value: 1000,
      message: "Price must not exceed 1000",
    },
  },
};

export const dataLimitValidation = {
  name: "dataLimit",
  label: "Data Limit (GB)",
  type: "number",
  id: "adjustedDataLimit",
  placeholder: "Enter data limit adjustment",
  disabled: false,
  validation: {
    min: {
      value: 0,
      message: "Data limit must be 0 or more",
    },
    max: {
      value: 300,
      message: "Data limit must not exceed 300",
    },
  },
};

export const callMinutesValidation = {
  name: "callMinutes",
  label: "Call Minutes",
  type: "number",
  id: "adjustedCallMinutes",
  placeholder: "Enter call minutes adjustment",
  disabled: false,
  validation: {
    min: {
      value: 0,
      message: "Call minutes must be 0 or more",
    },
    max: {
      value: 10_000,
      message: "Call minutes must not exceed 10 000",
    },
  },
};

export const smsLimitValidation = {
  name: "smsLimit",
  label: "SMS Limit",
  type: "number",
  id: "adjustedSmsLimit",
  placeholder: "Enter SMS limit adjustment",
  disabled: false,
  validation: {
    min: {
      value: 0,
      message: "SMS limit must be 0 or more",
    },
    max: {
      value: 10_000,
      message: "Sms limit must not exceed 10 000",
    },
  },
};
