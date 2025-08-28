import type { AxiosInstance } from 'axios'
import axios from 'axios'

export const ResultType = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
} as const

export const ErrorType = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const

export type ResultType = [keyof typeof ResultType]
export type ErrorType = [keyof typeof ErrorType]

export interface ErrorMessage {
  code: string
  message: string
  data?: never
}

export interface ApiResponse<T> {
  result: ResultType
  data: T | null
  error: ErrorMessage | null
}

export interface CursorResponse<T, U> {
  data: T[]
  nextCursor: U
  hasNext: boolean
}

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params })
    return response.data
  }

  async getCursor<T, U>(
    url: string,
    params?: any
  ): Promise<CursorResponse<T, U>> {
    const response = await this.axiosInstance.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data)
    return response.data
  }
}

export const apiClient = new ApiClient()
