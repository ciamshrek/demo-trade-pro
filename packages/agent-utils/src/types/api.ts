/**
 * DemoTradePro API types for tool integration
 * Base URL: http://localhost:3001/api
 */

export interface PortfolioHolding {
  symbol: string
  shares: number
  averageCost: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
}

export interface Portfolio {
  userId: string
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
  lastUpdated: string
}

export interface PortfolioHistory {
  date: string
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
}

export interface StockInfo {
  symbol: string
  name: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  peRatio: number
  high52Week: number
  low52Week: number
  lastUpdated: string
}

export interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  lastUpdated: string
}

export interface Order {
  id: string
  userId: string
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  createdAt: string
  updatedAt: string
  filledAt?: string
}

export interface CreateOrderRequest {
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
}

export interface APIError {
  error: string
  message: string
  statusCode: number
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
}
