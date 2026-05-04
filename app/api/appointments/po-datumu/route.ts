import { NextResponse } from "next/server";
import { appointmentService } from "@/backend/modules/appointments/appointment.service";
import { ClinicRequest } from "@/types/next";

export async function GET(req: ClinicRequest) {
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    console.log("API → clinicId:", req.headers.get("x-clinic-id"));

    if (!clinicId) {
      return NextResponse.json(
        { error: "Klinika ne postoji!" },
        { status: 400 },
      );
    }

    if (!date) {
      return NextResponse.json({ error: "Fali datum!" }, { status: 400 });
    }

    const appointments = await appointmentService.getAppointmentsByDate(
      clinicId,
      date,
    );

    return NextResponse.json(appointments);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
