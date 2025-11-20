const isBuildTime = process.env.npm_lifecycle_event?.includes("build") ?? false;

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? "your-tenant.auth0.com";
export const AUTH0_AUDIENCE =
  process.env.AUTH0_AUDIENCE ?? "http://localhost:3003/mcp";
export const MCP_SERVER_URL =
  process.env.MCP_SERVER_URL ?? `http://localhost:3003`;

export const API_AUDIENCE =
  process.env.API_AUDIENCE ?? "https://api.stocktrade.example";

export const MCP_SERVER_CUSTOM_API_CLIENT_ID =
  process.env.MCP_SERVER_CUSTOM_API_CLIENT_ID;
export const MCP_SERVER_CUSTOM_API_CLIENT_SECRET =
  process.env.MCP_SERVER_CUSTOM_API_CLIENT_SECRET;

if (!isBuildTime) {
  if (!MCP_SERVER_CUSTOM_API_CLIENT_ID) {
    throw new Error(
      "MCP_SERVER_CUSTOM_API_CLIENT_ID is required for MCP server to access OIDC connection."
    );
  }

  if (!MCP_SERVER_CUSTOM_API_CLIENT_SECRET) {
    throw new Error(
      "MCP_SERVER_CUSTOM_API_CLIENT_SECRET is required for MCP server to access OIDC connection."
    );
  }
}

/**
 * CORS headers to allow cross-origin requests to this endpoint
 * Configure appropriately for production
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust as needed for production
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
