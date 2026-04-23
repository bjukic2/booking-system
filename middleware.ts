import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-clinic-id", "1");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
