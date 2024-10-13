export const nameValidation = {
  name: "name",
  label: "Name",
  type: "text",
  id: "name",
  placeholder: "Enter name",
  validation: {
    required: {
      value: true,
      message: "Name is required",
    },
    maxLength: {
      value: 50,
      message: "Name cannot exceed 50 characters",
    },
  },
};

export const priceValidation = {
  name: "price",
  label: "Price (Euro)",
  type: "number",
  id: "price",
  placeholder: "Enter price",
  validation: {
    required: {
      value: true,
      message: "Price is required",
    },
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

export const descriptionValidation = {
  name: "description",
  label: "Description",
  type: "text",
  id: "description",
  placeholder: "Enter description",
  validation: {
    required: {
      value: true,
      message: "Description is required",
    },
    maxLength: {
      value: 200,
      message: "Description cannot exceed 200 characters",
    },
  },
};

export const dataLimitValidation = {
  name: "dataLimit",
  label: "Data Limit (MB)",
  type: "number",
  id: "dataLimit",
  placeholder: "Enter data limit",
  validation: {
    min: {
      value: 0,
      message: "Data limit must be 0 or more",
    },
    max: {
      value: 10_000,
      message: "Data limit must not exceed 1000000",
    },
  },
};

export const callMinutesValidation = {
  name: "callMinutes",
  label: "Call Minutes",
  type: "number",
  id: "callMinutes",
  placeholder: "Enter call minutes",
  validation: {
    min: {
      value: 0,
      message: "Call minutes must be 0 or more",
    },
    max: {
      value: 10_000,
      message: "Call minutes must not exceed 10000",
    },
  },
};

export const smsLimitValidation = {
  name: "smsLimit",
  label: "SMS Limit",
  type: "number",
  id: "smsLimit",
  placeholder: "Enter SMS limit",
  validation: {
    min: {
      value: 0,
      message: "SMS limit must be 0 or more",
    },
    max: {
      value: 10_000,
      message: "Sms limit must not exceed 10000",
    },
  },
};

export const isActiveValidation = {
  name: "isActive",
  label: "Active",
  type: "checkbox",
  id: "isActive",
  validation: {},
};