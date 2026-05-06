import { NextResponse } from "next/server";
import { appointmentService } from "@/backend/modules/appointments/appointment.service";

export async function GET(req: Request) {
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));
    const appointments = await appointmentService.getByClinic(clinicId);
    return NextResponse.json(appointments);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));
    const body = await req.json();

    const appointment = await appointmentService.create({
      ...body,
      clinicId,
    });

    return NextResponse.json(appointment);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
