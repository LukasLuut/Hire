// apiClient.ts
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });


  let body: any = null;

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    body = await response.json();
  }

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
