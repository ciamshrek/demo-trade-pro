import { z } from "zod";
import { tool } from "ai";
import type { DemoTradeProAPIClient } from "../../utils/api-client";
import type { Portfolio } from "../../types/api";

/**
 * Get Portfolio Tool
 * Retrieve user portfolio holdings and performance data
 */

// Schema definition
export const GetPortfolioSchema = z.object({
  includeHistory: z
    .boolean()
    .optional()
    .describe("Include historical performance data"),
});

export type GetPortfolioParams = z.infer<typeof GetPortfolioSchema>;

// Default handler implementation
export async function getPortfolioHandler(
  params: GetPortfolioParams,
  apiClient: DemoTradeProAPIClient
): Promise<Portfolio> {
  const response = await apiClient.get<Portfolio>("/portfolio");
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch portfolio");
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description:
      "Retrieve user portfolio holdings and performance data - DemoTradePro",
    inputSchema: GetPortfolioSchema,
    execute: async ({ includeHistory }) =>
      getPortfolioHandler({ includeHistory }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "getPortfolio",
    description:
      "Get user portfolio with current positions and values - DemoTradePro",
    inputSchema: GetPortfolioSchema.shape,
    requiredScopes: ["portfolio:read"],
  };
}

// Convenience exports
export const schema = GetPortfolioSchema;
export const defaultHandler = getPortfolioHandler;
