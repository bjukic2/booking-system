import { NextResponse } from "next/server";
import { getSession, deleteSession } from "@/server/publicBooking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, code } = body;

    if (!sessionId || !code) {
      return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Sesija nije pronađena ili je istekla." },
        { status: 400 },
      );
    }

    if (session.code !== code) {
      return NextResponse.json(
        { error: "Kod nije ispravan." },
        { status: 400 },
      );
    }

    deleteSession(sessionId);

    return NextResponse.json({
      success: true,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
