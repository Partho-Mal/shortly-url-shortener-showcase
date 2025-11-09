import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Overwrite the token cookie = delete
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
