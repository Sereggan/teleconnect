import { Ticket } from "../models/Ticket";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const ticketEndpoint: string = "/ticket";
const ticketClient = createAxiosClient(basePath);

export const getAllTickets = async (
  queryParams: {
    status?: string;
    limit?: number;
    offset?: number;
  },
  abortController: AbortController
): Promise<{
  tickets: Ticket[];
  currentPage: number;
  totalPages: number;
}> => {
  const response = await ticketClient.get(basePath + "/ticket/listTickets", {
    params: queryParams,
    signal: abortController.signal,
  });
  return response.data;
};

export const getTicketById = async (
  id: number,
  abortController: AbortController
): Promise<Ticket | undefined> => {
  const response = await ticketClient.get(
    `${basePath}${ticketEndpoint}/${id}`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const createTicket = async (
  ticket: Ticket,
  abortController: AbortController
): Promise<Ticket | undefined> => {
  const response = await ticketClient.post(basePath + ticketEndpoint, ticket, {
    signal: abortController.signal,
  });
  return response.data;
};

export const updateTicket = async (
  ticket: Ticket,
  abortController: AbortController
): Promise<Ticket | undefined> => {
  const response = await ticketClient.put(basePath + ticketEndpoint, ticket, {
    signal: abortController.signal,
  });
  return response.data;
};

export const deleteTicket = async (
  id: number,
  abortController: AbortController
): Promise<void> => {
  await ticketClient.delete(`${basePath}${ticketEndpoint}/${id}`, {
    signal: abortController.signal,
  });
};

export const getTicketsByUserId = async (
  userId: number,
  abortController: AbortController
): Promise<Ticket[] | undefined> => {
  const response = await ticketClient.get(
    `${basePath}${ticketEndpoint}/user/${userId}`,
    { signal: abortController.signal }
  );
  return response.data.tickets;
};
