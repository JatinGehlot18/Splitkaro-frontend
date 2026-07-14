import { Platform } from 'react-native';

/**
 * Base URL for the mock API server (see /server).
 *
 * - iOS simulator can reach the host machine on localhost.
 * - Android emulator reaches the host machine on the special IP 10.0.2.2.
 *
 * Edit API_HOST/DEFAULT_PORT if you run the server elsewhere (e.g. a LAN IP
 * when testing on a physical device).
 */
const DEFAULT_PORT = 3001;
const API_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${API_HOST}:${DEFAULT_PORT}`;

type ApiEnvelope<T> = { ok: boolean; data: T; error?: string };

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

  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed: ${res.status}`);
  }

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!json.ok) {
    throw new Error(json.error || `API ${method} ${path} returned an error`);
  }
  return json.data;
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body, token }),
};
