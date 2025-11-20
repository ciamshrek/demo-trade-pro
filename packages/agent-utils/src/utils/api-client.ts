import type { APIResponse } from "../types/api.js";

export type TokenProvider = (context: {
  endpoint: string;
  options: RequestInit;
  authParams?: AuthParams;
}) => Promise<string | undefined>;

type AuthParams = {
  bindingMessage?: string;
  authorizationDetails?: Record<string, unknown>[];
};

/**
 * DemoTradePro API client utilities
 */
export class DemoTradeProAPIClient {
  private baseUrl: string;
  private tokenProvider?: TokenProvider;

  constructor(
    baseUrl: string = "http://localhost:3001/api/",
    tokenProvider?: TokenProvider
  ) {
    this.baseUrl = baseUrl;
    this.tokenProvider = tokenProvider;
  }

  /**
   * Make authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    authParams?: AuthParams
  ): Promise<APIResponse<T>> {
    const safeEndpoint = endpoint.startsWith("/")
      ? endpoint.substring(1)
      : endpoint;

    // Ensure baseUrl ends with / for proper URL joining
    const normalizedBaseUrl = this.baseUrl.endsWith("/")
      ? this.baseUrl
      : `${this.baseUrl}/`;

    const url = new URL(safeEndpoint, normalizedBaseUrl).toString();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token provider is available
    if (this.tokenProvider) {
      const token = await this.tokenProvider({ endpoint, options, authParams });
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: data.error || "Request failed",
            message: data.message || "An error occurred",
            statusCode: response.status,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          error: "NetworkError",
          message:
            error instanceof Error ? error.message : "Network request failed",
          statusCode: 500,
        },
      };
    }
  }

  /**
   * GET request helper
   */
  async get<T>(
    endpoint: string,
    { authParams }: { authParams?: AuthParams } = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, authParams);
  }

  /**
   * POST request helper
   */
  async post<T>(
    endpoint: string,
    body?: any,
    { authParams }: { authParams?: AuthParams } = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      authParams
    );
  }

  /**
   * DELETE request helper
   */
  async delete<T>(
    endpoint: string,
    { authParams }: { authParams?: AuthParams } = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" }, authParams);
  }

  /**
   * Update token provider
   */
  setTokenProvider(tokenProvider: () => Promise<string>): void {
    this.tokenProvider = tokenProvider;
  }
}

/**
 * Create API client instance
 */
export function createAPIClient(
  apiBaseUrl: string = "http://localhost:3001/api/",
  tokenProvider?: TokenProvider
): DemoTradeProAPIClient {
  return new DemoTradeProAPIClient(apiBaseUrl, tokenProvider);
}
