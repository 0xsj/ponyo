import { APIResult } from "./shared/result";
import { APIError } from "./errors/api-error";

export interface IBaseAPI {
  get<T>(path: string, query?: Record<string, any>): Promise<APIResult<T>>;
  post<T>(path: string, data: any): Promise<APIResult<T>>;
  put<T>(path: string, data: any): Promise<APIResult<T>>;
  patch<T>(path: string, data: any): Promise<APIResult<T>>;
  delete<T>(path: string): Promise<APIResult<T>>;

  setHeader?(key: string, value: string): void;
  removeHeader?(key: string): void;

  setBaseUrl?(baseUrl: string): void;
  setTimeout?(timeout: number): void;

  addRequestInterceptor?(interceptor: (config: any) => any): void;
  addResponseInterceptor?(interceptor: (response: any) => any): void;

  handleError?(error: APIError): void;

  uploadFile?<T>(path: string, file: File, data?: any): Promise<APIResult<T>>;
  setRetryPolicy?(retries: number, delay: number): void;

  setAuthToken?(token: string): void;
  clearAuthToken?(): void;

  enableCaching?(enable: boolean): void;
  enableLogging?(enable: boolean): void;
}
