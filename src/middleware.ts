import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (pathname === "/redeem") {
    const hasToken = searchParams.has("token");
    const hasCode = searchParams.has("code");
    if (!hasToken && !hasCode) {
      const url = req.nextUrl.clone();
      url.pathname = "/giftcard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/redeem"],
};
