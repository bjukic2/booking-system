import { NextResponse } from "next/server";
import { appointmentService } from "@/backend/modules/appointments/appointment.service";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const clinicId = Number(req.headers.get("x-clinic-id"));
  const { id } = await context.params;
  try {
    const cancelled = await appointmentService.cancelAppointment(
      Number(id),
      clinicId,
    );
    return NextResponse.json(cancelled);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
