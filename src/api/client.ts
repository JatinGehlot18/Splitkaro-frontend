import { Platform } from 'react-native';

/**
 * Base URL for the SplitKaro backend (REST under /api, GraphQL at /graphql).
 *
 * - iOS simulator can reach the host machine on localhost.
 * - Android emulator reaches the host machine on the special IP 10.0.2.2.
 *
 * Edit API_HOST/DEFAULT_PORT if you run the server elsewhere (e.g. a LAN IP
 * when testing on a physical device).
 */
const DEFAULT_PORT = 4000;
const API_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${API_HOST}:${DEFAULT_PORT}`;

type SpringError = { message?: string; error?: string };

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const { method = 'GET', body, token } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const err = json as SpringError | null;
    throw new Error(err?.message || err?.error || `API ${method} ${path} failed: ${res.status}`);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body, token }),
  put: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: 'PUT', body, token }),
  del: <T>(path: string, token?: string) =>
    request<T>(path, { method: 'DELETE', token }),
};

/** POSTs a GraphQL query/mutation to /graphql, authenticated with the access token. */
export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || 'GraphQL request failed');
  }
  return json.data as T;
}
