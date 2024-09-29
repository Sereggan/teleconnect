export const priceMinValidation = {
  name: "priceMin",
  label: "Price Min, Euro",
  type: "number",
  id: "priceMin",
  placeholder: "Min Price",
  validation: {
    min: {
      value: 0,
      message: "Minimum value must be 0 or more",
    },
  },
};

export const priceMaxValidation = {
  name: "priceMax",
  label: "Price Max, Euro",
  type: "number",
  id: "priceMax",
  placeholder: "Max Price",
  validation: {
    min: {
      value: 0,
      message: "Maximum value must be 0 or more",
    },
    max: {
      value: 1000,
      message: "Maximum value must not exceed 1000",
    },
  },
};

export const dataLimitMinValidation = {
  name: "dataLimitMin",
  label: "Data Limit Min, MB",
  type: "number",
  id: "dataLimitMin",
  placeholder: "Min Data Limit",
  validation: {
    min: {
      value: 0,
      message: "Minimum value must be 0 or more",
    },
  },
};

export const dataLimitMaxValidation = {
  name: "dataLimitMax",
  label: "Data Limit Max, MB",
  type: "number",
  id: "dataLimitMax",
  placeholder: "Max Data Limit",
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
};

export const isUsedValidation = {
  name: "isUsed",
  label: "Is Used",
  type: "select",
  id: "isUsed",
  validation: {},
};

export const callMinutesMinValidation = {
  name: "callMinutesMin",
  label: "Call Minutes Min",
  type: "number",
  id: "callMinutesMin",
  placeholder: "Min Minutes",
  validation: {
    min: {
      value: 0,
      message: "Minimum call minutes must be 0 or more",
    },
  },
};

export const callMinutesMaxValidation = {
  name: "callMinutesMax",
  label: "Call Minutes Max",
  type: "number",
  id: "callMinutesMax",
  placeholder: "Max Minutes",
  validation: {
    max: {
      value: 10_000,
      message: "Maximum call minutes must not exceed 10000",
    },
  },
};

export const smsLimitMinValidation = {
  name: "smsLimitMin",
  label: "SMS Limit Min",
  type: "number",
  id: "smsLimitMin",
  placeholder: "Min SMS",
  validation: {
    min: {
      value: 0,
      message: "Minimum SMS limit must be 0 or more",
    },
  },
};

export const smsLimitMaxValidation = {
  name: "smsLimitMax",
  label: "SMS Limit Max",
  type: "number",
  id: "smsLimitMax",
  placeholder: "Max SMS",
  validation: {
    max: {
      value: 10_000,
      message: "Maximum SMS limit must not exceed 10000",
    },
  },
};
