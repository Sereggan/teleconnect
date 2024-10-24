import { TicketStatus } from "../../models/Ticket";

export const ticketStatusValidation = {
  name: "status",
  label: "Status",
  type: "select",
  id: "status",
  validation: {},
  requirred: false,
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
