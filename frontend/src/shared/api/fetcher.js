const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetcher(
  url,
  { method = 'GET', headers = {}, body } = {}
) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API Error');
  }

  return response.json();
}