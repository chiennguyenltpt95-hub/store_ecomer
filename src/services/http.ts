import axios from 'axios';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_DAYS = 1;
const REFRESH_TOKEN_DAYS = 30;

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type RetryConfig = {
  _retry?: boolean;
  headers?: Record<string, string>;
};

export const http = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'text/plain',
    'Content-Type': 'application/json'
  }
});

const refreshClient = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'text/plain',
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function runRefreshQueue(token: string | null) {
  for (const resolve of refreshQueue) {
    resolve(token);
  }
  refreshQueue = [];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
  const prefix = `${name}=`;
  const items = document.cookie.split('; ');

  for (const item of items) {
    if (!item.startsWith(prefix)) continue;
    return decodeURIComponent(item.slice(prefix.length));
  }

  return null;
}

function deleteCookie(name: string) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax${secure}`;
}

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(tokens: TokenPair) {
  setCookie(ACCESS_TOKEN_KEY, tokens.accessToken, ACCESS_TOKEN_DAYS);
  setCookie(REFRESH_TOKEN_KEY, tokens.refreshToken, REFRESH_TOKEN_DAYS);
}

function extractTokens(data: unknown): TokenPair | null {
  if (!data || typeof data !== 'object') return null;

  const source = data as Record<string, unknown>;
  const record = source.data && typeof source.data === 'object' ? (source.data as Record<string, unknown>) : source;

  const accessToken =
    typeof record.access_token === 'string'
      ? record.access_token
      : typeof record.accessToken === 'string'
        ? record.accessToken
        : typeof record.token === 'string'
          ? record.token
          : null;

  const refreshToken =
    typeof record.refresh_token === 'string' ? record.refresh_token : typeof record.refreshToken === 'string' ? record.refreshToken : null;

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setAuthTokensFromResponse(data: unknown) {
  const tokenPair = extractTokens(data);
  if (!tokenPair) return false;
  setAuthTokens(tokenPair);
  return true;
}

http.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!error.response || error.response.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      const token = await new Promise<string | null>((resolve) => {
        refreshQueue.push(resolve);
      });

      if (!token) {
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return http(originalRequest);
    }

    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post('/v1/auth/refresh', {
        refresh_token: refreshToken
      });

      const saved = setAuthTokensFromResponse(refreshResponse.data);
      const nextAccessToken = getAccessToken();

      if (!saved || !nextAccessToken) {
        clearAuthTokens();
        runRefreshQueue(null);
        return Promise.reject(error);
      }

      runRefreshQueue(nextAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      runRefreshQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
