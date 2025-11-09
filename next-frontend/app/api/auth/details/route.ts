// app/api/auth/details/route.ts

/**
 * Reads token cookie from browser and forwards it to backend via Authorization header.
 * This bypasses cross-domain cookie restrictions so backend can authenticate the user.
 */

import { cookies } from "next/headers";

export async function GET() {
  // ✅ cookies() must be awaited
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // ✅ Forward token to backend via Authorization header
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await backendRes.text();

  return new Response(data, {
    status: backendRes.status,
    headers: {
      "Content-Type":
        backendRes.headers.get("Content-Type") ?? "application/json",
    },
  });
}
