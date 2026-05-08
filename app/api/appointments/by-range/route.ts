import { NextResponse } from "next/server";
import { appointmentService } from "@/backend/modules/appointments/appointment.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { error: "Parametri 'start' i 'end' su obavezni!" },
        { status: 400 },
      );
    }

    const clinicId = Number(req.headers.get("x-clinic-id"));

    const startDate = new Date(start);
    const endDate = new Date(end);

    const result = await appointmentService.getAppointmentByDateRange(
      clinicId,
      startDate,
      endDate,
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
