import { z } from "zod";
import { tool } from "ai";
import type { DemoTradeProAPIClient } from "../../utils/api-client";
import type { StockInfo } from "../../types/api.js";

/**
 * Get Stock Info Tool
 * Get detailed stock information including metrics and performance
 */

// Schema definition
export const GetStockInfoSchema = z.object({
  symbol: z
    .string()
    .min(1, "Stock symbol is required")
    .max(10, "Stock symbol must be 10 characters or less")
    .regex(/^[A-Z]+$/, "Stock symbol must be uppercase letters only")
    .describe("Stock symbol (e.g., AAPL, GOOGL)"),
  includeMetrics: z
    .boolean()
    .default(true)
    .describe("Include financial metrics like P/E ratio, market cap"),
});

export type GetStockInfoParams = z.infer<typeof GetStockInfoSchema>;

// Default handler implementation
export async function getStockInfoHandler(
  params: GetStockInfoParams,
  apiClient: DemoTradeProAPIClient
): Promise<StockInfo> {
  const queryParams = params.includeMetrics ? "?includeMetrics=true" : "";
  const response = await apiClient.get<StockInfo>(
    `/stocks/${params.symbol}${queryParams}`
  );

  if (!response.success) {
    throw new Error(
      response.error?.message || `Failed to fetch info for ${params.symbol}`
    );
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description:
      "Get detailed stock information including metrics and performance - DemoTradePro",
    inputSchema: GetStockInfoSchema,
    execute: async ({ symbol, includeMetrics = true }) =>
      getStockInfoHandler({ symbol, includeMetrics }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "getStockInfo",
    description:
      "Get detailed stock information including metrics and performance - DemoTradePro",
    inputSchema: GetStockInfoSchema.shape,
    requiredScopes: [],
  };
}

// Convenience exports
export const schema = GetStockInfoSchema;
export const defaultHandler = getStockInfoHandler;
