import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect B2B routes — require auth + wholesaler role
    if (pathname.startsWith("/wholesale") || pathname.startsWith("/quick-order") || pathname.startsWith("/credit")) {
        // In production: validate JWT from cookie and check role claim
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        // Role check will be enforced by the backend; middleware just ensures authentication
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/wholesale/:path*", "/quick-order/:path*", "/credit/:path*"],
};
