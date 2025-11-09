// app/api/user/details/route.ts

/**
 * Forwards user cookies to the backend to retrieve authenticated user details.
 * Returns the backend response payload as-is, preserving type (JSON or text).
 */

export async function GET(req: Request) {
  // Read cookie header from request
  const cookie = req.headers.get("cookie") ?? "";

  // Forward request to backend API with cookie for authentication
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`,
    {
      method: "GET",
      headers: {
        cookie,
      },
      credentials: "include",
    }
  );

  // Deliberately parse as text to support both JSON and non-JSON responses
  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
}
