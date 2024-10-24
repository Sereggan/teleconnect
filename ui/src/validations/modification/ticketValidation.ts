import { TicketStatus } from "../../models/Ticket";

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
      message: "Ticket id must be a positive number",
    },
  },
};

export const titleValidation = {
  name: "title",
  label: "Ticket title",
  type: "text",
  id: "title",
  placeholder: "Enter title",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Title is required",
    },
    maxLength: {
      value: 50,
      message: "Title cannot exceed 50 characters",
    },
  },
};

export const descriptionValidation = {
  name: "description",
  label: "Ticket description",
  id: "description",
  placeholder: "",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Description is required",
    },
    minLength: {
      value: 5,
      message: "Description cannot be shorter than 5 symbols",
    },
    maxLength: {
      value: 200,
      message: "Description cannot exceed 200 characters",
    },
  },
};

export const ticketStatusValidation = {
  name: "status",
  label: "Status",
  type: "select",
  id: "status",
  validation: {
    required: {
      value: true,
      message: "Status is required",
    },
  },
  disabled: false,
  options: [
    {
      value: TicketStatus.New,
      label: "New",
    },
    {
      value: TicketStatus.InProgress,
      label: "In Progress",
    },
    {
      value: TicketStatus.Resolved,
      label: "Resolved",
    },
  ],
};

export const resoltuionValidation = {
  name: "resolution",
  label: "Ticket's resoltuion",
  id: "resolution",
  placeholder: "",
  disabled: false,
  validation: {
    required: {
      value: true,
      message: "Resolution is required",
    },
    minLength: {
      value: 5,
      message: "Resolution cannot be shorter than 5 symbols",
    },
    maxLength: {
      value: 200,
      message: "Resolution cannot exceed 200 characters",
    },
  },
};
