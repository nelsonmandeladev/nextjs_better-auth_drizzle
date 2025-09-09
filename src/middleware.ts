import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    const authUrls = ["/login", "/register"];

    const { pathname } = new URL(request.url);

    // Redirect unauthenticated users to /login
    if (!sessionCookie && !authUrls.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Prevent authenticated users from accessing auth pages
    if (sessionCookie && authUrls.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except static assets
};