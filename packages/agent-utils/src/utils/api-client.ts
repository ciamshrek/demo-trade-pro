import type { APIResponse } from '../types/api.js'

/**
 * DemoTradePro API client utilities
 */
export class DemoTradeProAPIClient {
  private baseUrl: string
  private tokenProvider?: () => Promise<string | undefined>

  constructor(
    baseUrl: string = 'http://localhost:3001/api/', 
    tokenProvider?: () => Promise<string | undefined>
  ) {
    this.baseUrl = baseUrl
    this.tokenProvider = tokenProvider
  }

  /**
   * Make authenticated API request
   */
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    
    const safeEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
    const url = new URL(safeEndpoint, this.baseUrl).toString()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    // Add authorization header if token provider is available
    if (this.tokenProvider) {
      const token = await this.tokenProvider()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: data.error || 'Request failed',
            message: data.message || 'An error occurred',
            statusCode: response.status
          }
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          error: 'NetworkError',
          message: error instanceof Error ? error.message : 'Network request failed',
          statusCode: 500
        }
      }
    }
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  /**
   * Update token provider
   */
  setTokenProvider(tokenProvider: () => Promise<string>): void {
    this.tokenProvider = tokenProvider
  }
}

/**
 * Create API client instance
 */
export function createAPIClient(
  apiBaseUrl: string = 'http://localhost:3001/api/',
  tokenProvider?: () => Promise<string | undefined>
): DemoTradeProAPIClient {
  return new DemoTradeProAPIClient(apiBaseUrl, tokenProvider)
}
