import { NextResponse } from "next/server";
import { appointmentService } from "@/backend/modules/appointments/appointment.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const appointment = await appointmentService.getById(Number(params.id));
    return NextResponse.json(appointment);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
