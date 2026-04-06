import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const B2B_ROUTES = ["/wholesale", "/quick-order", "/credit"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isB2B = B2B_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect already-authenticated users away from login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isB2B) {
    return NextResponse.next();
  }

  // B2B route protection — check if token exists
  // Actual JWT validation happens server-side by Go API
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wholesale/:path*",
    "/quick-order/:path*",
    "/credit/:path*",
    "/login",
    "/register",
  ],
  runtime: "nodejs",
};
