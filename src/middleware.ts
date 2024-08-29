import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Continue to the requested page if the user is an admin
  return NextResponse.next();
}

// Specify routes where the middleware should apply
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/acceptMaterial/:path*",
    "/api/rejectMaterial/:path*",
  ],
};
