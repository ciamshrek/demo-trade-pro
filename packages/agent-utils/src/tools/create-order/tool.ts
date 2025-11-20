import { z } from "zod";
import { tool } from "ai";
import { DemoTradeProAPIClient } from "../../utils/api-client";
import type { Order, CreateOrderRequest } from "../../types/api";
import { randomBytes } from "crypto";

/**
 * Create Order Tool
 * Place a new buy or sell order for stocks
 */

// Schema definition
export const CreateOrderSchema = z.object({
  userId: z.string().describe("User ID placing the order"),
  symbol: z
    .string()
    .min(1, "Stock symbol is required")
    .max(10, "Stock symbol must be 10 characters or less")
    .regex(/^[A-Z]+$/, "Stock symbol must be uppercase letters only")
    .describe("Stock symbol (e.g., AAPL, GOOGL)"),
  side: z.enum(["buy", "sell"]).describe("Order type: buy or sell"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1 share")
    .max(10000, "Maximum 10,000 shares per order")
    .int("Quantity must be a whole number")
    .describe("Number of shares to trade"),
  price: z
    .number()
    .min(0.01, "Price must be at least $0.01")
    .max(1000000, "Maximum price is $1,000,000")
    .describe("Price per share in USD"),
});

export type CreateOrderParams = z.infer<typeof CreateOrderSchema>;

// Default handler implementation
export async function createOrderHandler(
  params: CreateOrderParams,
  apiClient: DemoTradeProAPIClient
): Promise<Order> {
  const orderRequest: CreateOrderRequest = {
    symbol: params.symbol,
    side: params.side.toUpperCase() as "BUY" | "SELL",
    quantity: params.quantity,
    price: params.price,
  };

  const response = await apiClient.post<Order>("/orders", orderRequest, {
    authParams: {
      bindingMessage: randomBytes(12).toString("hex"),
      authorizationDetails: [
        {
          type: "urn:auth0:schemas:authorization-details:v1:create_order",
          instruction: `Approve the following ${params.side} order`,
          properties: {
            symbol: {
              display: true,
              display_order: 1,
              name: "Stock Symbol",
              value: params.symbol,
            },
            quantity: {
              display: true,
              display_order: 2,
              name: "Quantity",
              value: params.quantity,
            },
            price_display: {
              display: true,
              display_order: 3,
              name: "Price",
              value: `$${params.price.toFixed(2)}`,
            },
            price: {
              display: false,
              display_order: 4,
              name: "price",
              value: params.price,
            },
            side: {
              display: false,
              display_order: 5,
              name: "side",
              value: params.side.toUpperCase(),
            },
          },
        },
      ],
    },
  });

  if (!response.success) {
    throw new Error(response.error?.message || "Failed to create order");
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: "Place a new buy or sell order for stocks - DemoTradePro",
    inputSchema: CreateOrderSchema,
    execute: async ({ userId, symbol, side, quantity, price }) =>
      createOrderHandler({ userId, symbol, side, quantity, price }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "createOrder",
    description: "Place a new buy or sell order for stocks - DemoTradePro",
    inputSchema: CreateOrderSchema.shape,
    requiredScopes: ["trade:write"],
  };
}

// Convenience exports
export const schema = CreateOrderSchema;
export const defaultHandler = createOrderHandler;
