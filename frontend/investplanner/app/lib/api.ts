const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  if (!API_URL) {
    throw new Error("API_URL is not defined. Check your .env.local file");
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  console.log("Calling API:", url);

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  console.log("🔍 Token from localStorage:", token); // ✅ Debug log

  // Build headers - Proper typing
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add custom headers if provided
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Add token to Authorization header if it exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ Token added to header");
  }

  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));

    throw new Error(`API error: ${response.statusText} - ${errorBody.message || "No error message"}`);
  }

  return response.json();
};