export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  resolution?: string;
  userId: number;
}

export enum TicketStatus {
  New = "New",
  InProgress = "InProgress",
  Resolved = "Resolved",
  Rejected = "Rejected",
}
