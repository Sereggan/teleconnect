export const priceMinValidation = {
  name: "priceMin",
  label: "Price Min, Euro",
  type: "number",
  id: "priceMin",
  placeholder: "Min Price",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 1,
      message: "Minimum price must be 1 or more",
    },
  },
};

export const priceMaxValidation = {
  name: "priceMax",
  label: "Price Max, Euro",
  type: "number",
  id: "priceMax",
  placeholder: "Max Price",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 1,
      message: "Maximum price must be 1 or more",
    },
    max: {
      value: 1000,
      message: "Maximum value must not exceed 1 000",
    },
  },
};

export const dataLimitMinValidation = {
  name: "dataLimitMin",
  label: "Data Limit Min, GB",
  type: "number",
  id: "dataLimitMin",
  placeholder: "Min Data Limit",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 1,
      message: "Minimum value must be 1 or more",
    },
  },
};

export const dataLimitMaxValidation = {
  name: "dataLimitMax",
  label: "Data Limit Max, GB",
  type: "number",
  id: "dataLimitMax",
  placeholder: "Max Data Limit",
  requirred: false,
  disabled: false,
  validation: {
    max: {
      value: 1000000,
      message: "Maximum value must noy exceed 1 000 000",
    },
  },
};

export const isActiveValidation = {
  name: "isActive",
  label: "Is Active",
  type: "select",
  id: "isActive",
  validation: {},
  requirred: false,
  disabled: false,
  options: [
    {
      value: "true",
      label: "True",
    },
    {
      value: "false",
      label: "False",
    },
  ],
};

export const isUsedValidation = {
  name: "isUsed",
  label: "Is Used",
  type: "select",
  id: "isUsed",
  validation: {},
  requirred: false,
  disabled: false,
  options: [
    {
      value: "true",
      label: "True",
    },
    {
      value: "false",
      label: "False",
    },
  ],
};

export const callMinutesMinValidation = {
  name: "callMinutesMin",
  label: "Call Minutes Min",
  type: "number",
  id: "callMinutesMin",
  placeholder: "Min Minutes",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 1,
      message: "Minimum call minutes must be 1 or more",
    },
  },
};

export const callMinutesMaxValidation = {
  name: "callMinutesMax",
  label: "Call Minutes Max",
  type: "number",
  id: "callMinutesMax",
  placeholder: "Max Minutes",
  requirred: false,
  disabled: false,
  validation: {
    max: {
      value: 10_000,
      message: "Maximum call minutes must not exceed 10 000",
    },
  },
};

export const smsLimitMinValidation = {
  name: "smsLimitMin",
  label: "SMS Limit Min",
  type: "number",
  id: "smsLimitMin",
  placeholder: "Min SMS",
  requirred: false,
  disabled: false,
  validation: {
    min: {
      value: 1,
      message: "Minimum SMS limit must be 1 or more",
    },
  },
};

export const smsLimitMaxValidation = {
  name: "smsLimitMax",
  label: "SMS Limit Max",
  type: "number",
  id: "smsLimitMax",
  placeholder: "Max SMS",
  requirred: false,
  disabled: false,
  validation: {
    max: {
      value: 10_000,
      message: "Maximum SMS limit must not exceed 10 000",
    },
  },
};
