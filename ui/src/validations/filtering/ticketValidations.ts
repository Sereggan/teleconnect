import { TicketStatus } from "../../models/Ticket";

export const ticketStatusValidation = {
  name: "ticketStatus",
  label: "Status",
  type: "select",
  id: "ticketStatus",
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
    {
      value: TicketStatus.Rejected,
      label: "Rejected",
    },
  ],
};
