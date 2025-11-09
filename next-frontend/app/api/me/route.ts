// app/api/me/route.ts

/**
 * Validates access by verifying a JWT stored in cookies.
 * Determines whether the user identifier in the token is listed as allowed.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  // Read cookie value
  // cookies() is synchronous
  const cookieStore = cookies();  
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return NextResponse.json({ allowed: false });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const allowed = process.env.ALLOWED_USER_IDS?.split(",") ?? [];

    return NextResponse.json({
      allowed: payload.user_id && allowed.includes(payload.user_id as string),
    });
  } catch {
    return NextResponse.json({ allowed: false });
  }
}
