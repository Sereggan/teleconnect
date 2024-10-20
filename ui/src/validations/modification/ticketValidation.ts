import { TicketStatus } from "../../models/Ticket";

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
  name: "title",
  label: "Ticket description",
  id: "title",
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
  name: "ticketStatus",
  label: "Status",
  type: "select",
  id: "ticketStatus",
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
    {
      value: TicketStatus.Rejected,
      label: "Rejected",
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
