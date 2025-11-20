import { z } from "zod";
import { tool } from "ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { DemoTradeProAPIClient } from "../../utils/api-client";
import type { Order } from "../../types/api";

/**
 * Get Order History Tool
 * Retrieve user trading history and past orders
 */

// Schema definition
export const GetOrderHistorySchema = z.object({
  userId: z.string().describe("User ID to fetch order history for"),
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Maximum 100 orders")
    .default(20)
    .describe("Maximum number of orders to return (default: 20)"),
  status: z
    .enum(["pending", "filled", "cancelled", "rejected", "all"])
    .default("all")
    .describe("Filter orders by status"),
  symbol: z
    .string()
    .max(10, "Stock symbol must be 10 characters or less")
    .regex(/^[A-Z]*$/, "Stock symbol must be uppercase letters only")
    .optional()
    .describe("Filter orders by stock symbol (optional)"),
});

export type GetOrderHistoryParams = z.infer<typeof GetOrderHistorySchema>;

// Default handler implementation
export async function getOrderHistoryHandler(
  params: GetOrderHistoryParams,
  apiClient: DemoTradeProAPIClient
): Promise<Order[]> {
  const queryParams = new URLSearchParams({
    limit: params.limit.toString(),
    status: params.status,
  });

  if (params.symbol) {
    queryParams.set("symbol", params.symbol);
  }

  const response = await apiClient.get<Order[]>(`/orders?${queryParams}`);

  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch order history");
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: "Get user order history with filtering options - DemoTradePro",
    inputSchema: GetOrderHistorySchema,
    execute: async ({ userId, limit = 20, status = "all", symbol }) =>
      getOrderHistoryHandler({ userId, limit, status, symbol }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "getOrderHistory",
    description: "Retrieve user trading history and past orders - DemoTradePro",
    inputSchema: zodToJsonSchema(GetOrderHistorySchema),
  };
}

// Convenience exports
export const schema = GetOrderHistorySchema;
export const defaultHandler = getOrderHistoryHandler;
