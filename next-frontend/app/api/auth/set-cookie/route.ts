// app/api/auth/set-cookie/route.ts

/**
 * Proxies user request to backend to create or update authentication cookies.
 * The backend is responsible for setting cookie attributes. This route forwards
 * that cookie back to the client.
 */

export async function POST(req: Request) {
  // Read request body received from client
  const body = await req.json();

  // Forward request to backend responsible for cookie creation
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/set-cookie`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  // Retrieve cookie from backend response
  const setCookie = backendRes.headers.get("set-cookie");

  // Prepare client response
  const response = new Response(
    JSON.stringify({ ok: true }),
    {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Forward cookie if backend returned one
  if (setCookie) {
    response.headers.set("Set-Cookie", setCookie);
  }

  return response;
}
