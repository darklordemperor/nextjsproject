import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

const PROTECTED_PREFIXES = ["/dashboard", "/employer", "/jobseeker"];

async function isAuthenticated(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!(await isAuthenticated(request))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/jobseeker/:path*"],
};
