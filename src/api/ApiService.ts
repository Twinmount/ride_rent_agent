import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiConfig, DEFAULT_API_CONFIG } from "./Api-config";
import { Slug } from "./Api-Endpoints";
import { StorageKeys, load } from "@/utils/storage";

export interface ApiResponse<T> {
  data: T;
}

export interface APIParameters {
  axiosConfig?: AxiosRequestConfig;
  body?: object;
  queryParameters?: object;
  slug: Slug | string;
}

export class ApiService {
  private static instance: ApiService | null = null;
  axios: AxiosInstance | undefined;
  config: ApiConfig;

  private constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  public static getInstance(config?: ApiConfig): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(config);
      ApiService.instance.setup();
    } else if (config) {
      ApiService.instance.config = config;
      ApiService.instance.setup();
    }

    return ApiService.instance;
  }

  /**
   * Sets up the API with interceptors for request and response handling.
   */
  setup() {
    this.axios = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    });

    // ✅ REQUEST INTERCEPTOR 1: Set dynamic baseURL from localStorage
    this.axios.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      // Read country from localStorage before EVERY request
      const appCountry = localStorage.getItem("appCountry") || "ae";

      // Set the correct baseURL based on country
      req.baseURL =
        appCountry === "in"
          ? import.meta.env.VITE_API_URL_INDIA
          : import.meta.env.VITE_API_URL_UAE;

      return req;
    });

    // ✅ REQUEST INTERCEPTOR 2: Add authorization token (existing logic)
    this.axios.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      const { url } = req;
      if (
        url !== Slug.LOGIN &&
        url !== Slug.REGISTER &&
        url !== Slug.VERIFY_OTP
      ) {
        const accessToken = load<string>(StorageKeys.ACCESS_TOKEN);

        if (accessToken) {
          req.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return req;
    });

    // ✅ RESPONSE INTERCEPTOR (existing logic - no changes)
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          console.error("apiService 401 error: ", error.response);
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>({
    slug,
    axiosConfig = {},
    queryParameters = {},
  }: APIParameters): Promise<T | undefined> {
    if (!this.axios) {
      return;
    }
    const response = await this.axios.get<ApiResponse<T>>(slug, {
      ...axiosConfig,
      params: queryParameters,
    });
    return response.data as unknown as T;
  }

  public async post<T>({
    slug,
    body,
    axiosConfig = {},
  }: APIParameters): Promise<T | undefined> {
    if (!this.axios) {
      return;
    }
    const response = await this.axios.post<ApiResponse<T>>(
      slug,
      body,
      axiosConfig
    );
    return response.data as unknown as T;
  }

  public async put<T>({
    slug,
    body,
    axiosConfig = {},
  }: APIParameters): Promise<T | undefined> {
    if (!this.axios) {
      return;
    }
    const response = await this.axios.put<ApiResponse<T>>(
      slug,
      body,
      axiosConfig
    );
    return response.data as unknown as T;
  }

  public async delete<T>({
    slug,
    axiosConfig = {},
    queryParameters = {},
  }: APIParameters): Promise<T | undefined> {
    if (!this.axios) {
      return;
    }
    const response = await this.axios.delete<ApiResponse<T>>(slug, {
      ...axiosConfig,
      params: queryParameters,
    });
    return response.data as unknown as T;
  }

  public async patch<T>({
    slug,
    body,
    axiosConfig = {},
  }: APIParameters): Promise<T | undefined> {
    if (!this.axios) {
      return;
    }
    const response = await this.axios.patch<ApiResponse<T>>(
      slug,
      body,
      axiosConfig
    );
    return response.data as unknown as T;
  }
}

export const API = ApiService.getInstance(DEFAULT_API_CONFIG);

export type API_Request_Status = "SUCCESS" | "NOT_SUCCESS";
