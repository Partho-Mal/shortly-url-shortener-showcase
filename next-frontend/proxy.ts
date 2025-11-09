/**
 * proxy.ts
 *
 * This file handles authentication and route protection for the Next.js app.
 * It performs the following:
 *  - Validates JWT tokens for protected routes
 *  - Redirects users from the root path to /dashboard if authenticated
 *  - Cleans up referral query parameters for SEO purposes
 */
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type JWTPayload = {
  user_id?: string;  
  exp?: number;
  iat?: number;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Allowed user_ids (comma-separated in .env)
// const allowedUserIds = (process.env.ALLOWED_USER_IDS || "").split(",");

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // console.log("✅ JWT payload:", payload);
    return payload as JWTPayload;
  } catch (e) {
    console.error("❌ JWT validation failed:", e);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Handle referral query cleanup (SEO-friendly)
  if (url.searchParams.has("ref")) {
    url.searchParams.delete("ref");
    return NextResponse.redirect(url, 308); // Permanent redirect to clean URL
  }

  const isDev = process.env.NODE_ENV === "development";
  const shouldBypass = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

  // ✅ Root redirect
  if (pathname === "/") {
    if ((isDev && shouldBypass) || token) {
      const payload = token ? await verifyToken(token) : null;
      if (payload) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // 🔒 Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // still    // if (pathname === "/dashboard/hiddenqr") {
    //   const isAllowed = payload.user_id && allowedUserIds.includes(payload.user_id);
    //   if (!isAllowed) {
    //     url.pathname = "/dashboard"; // or homepage
    //     return NextResponse.redirect(url);
    //   }
    // } matches hiddenqr
};



// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// /** Payload structure for JWT */
// type JWTPayload = {
//   user_id?: string;
//   exp?: number;
//   iat?: number;
// };

// /** Secret key for JWT verification, loaded from environment variables */
// const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// /**
//  * Verifies a JWT token.
//  * @param token - JWT token string
//  * @returns JWTPayload if valid, otherwise null
//  */
// async function verifyToken(token: string): Promise<JWTPayload | null> {
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     return payload as JWTPayload;
//   } catch (err) {
//     console.error("JWT validation failed:", err);
//     return null;
//   }
// }

// /**
//  * Proxy middleware to handle route protection and redirections.
//  * @param request - NextRequest object
//  * @returns NextResponse with appropriate redirect or next action
//  */
// export async function proxy(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const url = request.nextUrl.clone();
//   const pathname = url.pathname;

//   // Remove referral query parameters for SEO-friendly URLs
//   if (url.searchParams.has("ref")) {
//     url.searchParams.delete("ref");
//     return NextResponse.redirect(url, 308); // Permanent redirect
//   }

//   const isDev = process.env.NODE_ENV === "development";
//   const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

//   // Redirect root path to dashboard if authenticated or bypassing auth in dev
//   if (pathname === "/") {
//     if ((isDev && bypassAuth) || token) {
//       const payload = token ? await verifyToken(token) : null;
//       if (payload) {
//         url.pathname = "/dashboard";
//         return NextResponse.redirect(url);
//       }
//     }
//     return NextResponse.next();
//   }

//   // Protect /dashboard routes - redirect unauthenticated users to root
//   if (pathname.startsWith("/dashboard")) {
//     const payload = token ? await verifyToken(token) : null;
//     if (!payload) {
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }
//   }

//   // Allow request to proceed if no restrictions apply
//   return NextResponse.next();
// }

// /** Configure the paths this middleware/proxy applies to */
// export const config = {
//   matcher: ["/", "/dashboard/:path*"],
// };
