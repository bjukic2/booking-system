import { NextResponse } from "next/server";

export function proxy(req: Request) {
  const host = req.headers.get("host") ?? "";
  const sub = host.split(".")[0];

  const res = NextResponse.next();

  if (!isNaN(Number(sub))) {
    res.headers.set("x-clinic-id", sub);
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
