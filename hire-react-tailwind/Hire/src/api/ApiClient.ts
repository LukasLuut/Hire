// apiClient.ts
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`http://localhost:8080${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {}

  if (!response.ok) {
    let message = "Erro na requisição";

    if (Array.isArray(body)) {
      message = Object.values(body[0])[0] as string;
    } else if (typeof body === "object" && body !== null) {
      message = body.message || body.error || message;
    }

    throw new Error(message);
  }

  return body as T;
}
