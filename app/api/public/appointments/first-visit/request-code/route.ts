import { NextResponse } from "next/server";
import {
  createSession,
  generateCode,
  sendSMSCode,
} from "@/server/publicBooking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, slot } = body;

    if (!firstName || !lastName || !email || !phone || !slot) {
      return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const code = generateCode();

    const session = createSession({
      firstName,
      lastName,
      email,
      phone,
      slot,
      code,
    });

    await sendSMSCode(phone, code);

    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
