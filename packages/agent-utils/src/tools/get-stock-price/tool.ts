import { z } from "zod";
import { tool } from "ai";
import {
  createAPIClient,
  type DemoTradeProAPIClient,
} from "../../utils/api-client";
import type { StockPrice } from "../../types/api.js";

/**
 * Get Stock Price Tool
 * Get current stock price by symbol
 */

// Schema definition
export const GetStockPriceSchema = z.object({
  symbol: z
    .string()
    .min(1, "Stock symbol is required")
    .max(10, "Stock symbol must be 10 characters or less")
    .regex(/^[A-Z]+$/, "Stock symbol must be uppercase letters only")
    .describe("Stock symbol (e.g., WAYNE, STARK)"),
});

export type GetStockPriceParams = z.infer<typeof GetStockPriceSchema>;

// Default handler implementation
export async function getStockPriceHandler(
  params: GetStockPriceParams,
  apiClient: DemoTradeProAPIClient
): Promise<StockPrice> {
  const response = await apiClient.get<StockPrice>(`/stocks/${params.symbol}`);

  if (!response.success) {
    throw new Error(
      response.error?.message || `Failed to fetch price for ${params.symbol}`
    );
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: "Get current stock price by symbol - DemoTradePro",
    inputSchema: GetStockPriceSchema,
    execute: async ({ symbol }) => getStockPriceHandler({ symbol }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "getStockPrice",
    description: "Get current stock price by symbol - DemoTradePro",
    inputSchema: GetStockPriceSchema.shape,
    requiredScopes: [],
  };
}

// Convenience exports
export const schema = GetStockPriceSchema;
export const defaultHandler = getStockPriceHandler;
