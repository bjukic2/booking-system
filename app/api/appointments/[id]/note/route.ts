import { appointmentService } from "@/backend/modules/appointments/appointment.service";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));

    const body = await req.json();
    const note = body.note ?? null;

    const updated = await appointmentService.updateAppointmentNote(
      Number(id),
      clinicId,
      note,
    );

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
