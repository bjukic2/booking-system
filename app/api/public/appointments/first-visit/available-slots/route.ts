import { NextResponse } from "next/server";
import {
  getAvailableSlotsForFirstVisit,
  verifyCaptcha,
} from "@/server/publicBooking";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, captchaToken } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const ok = await verifyCaptcha(captchaToken);
    if (!ok) {
      return NextResponse.json(
        { error: "Captcha nije prošla." },
        { status: 400 },
      );
    }

    const slots = await getAvailableSlotsForFirstVisit();

    return NextResponse.json({ slots });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
